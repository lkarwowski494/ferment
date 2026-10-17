// ============================================================================
// Apps4Brew Studio — FERMENT 10-Rotation Backup & Disaster Recovery Engine
// Dual 10-backup pools (RD-ENG-12, BR-TEST-022) & Corrupt State Guard (BR-TEST-023)
// ============================================================================

import * as FileSystem from 'expo-file-system/legacy';
import { getSqliteStore, Batch, CaveWheel, PantryItem, WeighLog, AppSettings } from '../data/sqlite-store';

export const CURRENT_SCHEMA_VERSION = 1;

export interface FermentBackupData {
  schema_version: number;
  app: 'FERMENT';
  exported_at: string;
  batches: Batch[];
  cave_wheels: CaveWheel[];
  pantry_items: PantryItem[];
  weigh_logs: WeighLog[];
  app_settings: AppSettings;
}

export interface BackupFileInfo {
  fileName: string;
  filePath: string;
  createdAt: string;
  sizeBytes: number;
  pool: 'auto' | 'safety' | 'other';
}

export interface CorruptRecoveryInfo {
  fileName: string;
  timestamp: string;
  reason: string;
  recovery: string;
}

export const MAX_ROTATION_BACKUPS = 10;
const BACKUP_DIR_NAME = 'backups';

const fsAny = FileSystem as any;

function getDocDir(): string | null {
  if (fsAny && fsAny.documentDirectory) return fsAny.documentDirectory;
  if (fsAny && fsAny.Paths && fsAny.Paths.document && fsAny.Paths.document.uri) {
    return fsAny.Paths.document.uri;
  }
  return null;
}

// In-memory fallback for Jest unit tests if docDir is undefined
const inMemoryBackups: Map<string, string> = new Map();
let inMemoryCorruptRecovery: CorruptRecoveryInfo | null = null;

export function _resetInMemoryBackups(): void {
  inMemoryBackups.clear();
  inMemoryCorruptRecovery = null;
}

function getBackupDirectory(): string {
  const docDir = getDocDir();
  if (docDir) {
    return `${docDir}${BACKUP_DIR_NAME}/`;
  }
  return '/tmp/ferment_backups/';
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  if (getDocDir()) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
}

export function isAutoBackup(fileName: string): boolean {
  return fileName.startsWith('ferment-kopia-') || fileName.startsWith('ferment_backup_');
}

export function isSafetyBackup(fileName: string): boolean {
  return (
    fileName.startsWith('ferment-przed-importem-') ||
    fileName.startsWith('ferment-przed-czyszczeniem-') ||
    fileName.startsWith('safety_backup_')
  );
}

function formatTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`;
}

async function getUniqueFileName(prefix: string, ext = '.json'): Promise<string> {
  const baseTimestamp = formatTimestamp();
  let candidate = `${prefix}${baseTimestamp}${ext}`;
  let collisionIndex = 2;

  const exists = async (name: string): Promise<boolean> => {
    if (getDocDir()) {
      const dir = getBackupDirectory();
      const info = await FileSystem.getInfoAsync(`${dir}${name}`);
      return info.exists;
    }
    return inMemoryBackups.has(name);
  };

  while (await exists(candidate)) {
    candidate = `${prefix}${baseTimestamp}-${collisionIndex}${ext}`;
    collisionIndex++;
  }

  return candidate;
}

/**
 * Creates the full snapshot payload from current SQLite store
 */
export async function createSnapshotData(): Promise<FermentBackupData> {
  const store = getSqliteStore();
  const batches = await store.getBatches();
  const cave_wheels = await store.getCaveWheels();
  const pantry_items = await store.getPantryItems();
  const weigh_logs = await store.getWeighLogs();
  const app_settings = await store.getAppSettings();

  return {
    schema_version: CURRENT_SCHEMA_VERSION,
    app: 'FERMENT',
    exported_at: new Date().toISOString(),
    batches,
    cave_wheels,
    pantry_items,
    weigh_logs,
    app_settings,
  };
}

/**
 * 10-Rotation automatic backup triggered after each data mutation (Pool: auto)
 */
export async function createAutoBackup(): Promise<string> {
  const data = await createSnapshotData();
  const json = JSON.stringify(data, null, 2);
  const fileName = await getUniqueFileName('ferment-kopia-');

  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const filePath = `${dir}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, json, { encoding: FileSystem.EncodingType.UTF8 });
    await rotateBackups(dir, 'auto');
    return filePath;
  } else {
    inMemoryBackups.set(fileName, json);
    rotateInMemoryBackups('auto');
    return fileName;
  }
}

/**
 * Creates safety snapshot before importing or clearing data (Pool: safety)
 * Aborts immediately if creation fails (BR-TEST-022, RD-ENG-12)
 */
export async function createSafetyBackup(reason: 'przed-importem' | 'przed-czyszczeniem' | string = 'przed-importem'): Promise<string> {
  try {
    const data = await createSnapshotData();
    const json = JSON.stringify(data, null, 2);
    const prefix = reason.includes('czyszczen')
      ? 'ferment-przed-czyszczeniem-'
      : 'ferment-przed-importem-';

    const fileName = await getUniqueFileName(prefix);

    if (getDocDir()) {
      const dir = getBackupDirectory();
      await ensureDirectoryExists(dir);
      const filePath = `${dir}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, json, { encoding: FileSystem.EncodingType.UTF8 });
      await rotateBackups(dir, 'safety');
      return filePath;
    } else {
      inMemoryBackups.set(fileName, json);
      rotateInMemoryBackups('safety');
      return fileName;
    }
  } catch (err: any) {
    throw new Error(`[BR-TEST-022] Błąd tworzenia kopii bezpieczeństwa przed operacją (${reason}): ${err?.message || err}`);
  }
}

/**
 * Rotates backups maintaining up to MAX_ROTATION_BACKUPS (10) per distinct pool (RD-ENG-12)
 */
async function rotateBackups(dir: string, pool: 'auto' | 'safety'): Promise<void> {
  if (!getDocDir()) return;

  const files = await FileSystem.readDirectoryAsync(dir);
  const poolFiles = files
    .filter(f => (pool === 'auto' ? isAutoBackup(f) : isSafetyBackup(f)) && f.endsWith('.json'))
    .sort(); // Lexicographical sort by timestamp & collision counter

  if (poolFiles.length > MAX_ROTATION_BACKUPS) {
    const toDeleteCount = poolFiles.length - MAX_ROTATION_BACKUPS;
    for (let i = 0; i < toDeleteCount; i++) {
      const fileToDelete = `${dir}${poolFiles[i]}`;
      try {
        await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
      } catch {
        // Ignore deletion errors
      }
    }
  }
}

function rotateInMemoryBackups(pool: 'auto' | 'safety'): void {
  const poolKeys = Array.from(inMemoryBackups.keys())
    .filter(f => (pool === 'auto' ? isAutoBackup(f) : isSafetyBackup(f)))
    .sort();

  if (poolKeys.length > MAX_ROTATION_BACKUPS) {
    const toDeleteCount = poolKeys.length - MAX_ROTATION_BACKUPS;
    for (let i = 0; i < toDeleteCount; i++) {
      inMemoryBackups.delete(poolKeys[i]);
    }
  }
}

/**
 * Saves corrupt payload into state_corrupt_<timestamp>.json with recovery field (BR-TEST-023)
 */
export async function saveCorruptState(rawContent: string, reason = 'Błąd odczytu stanu'): Promise<string> {
  const timestamp = formatTimestamp();
  const fileName = `state_corrupt_${timestamp}.json`;
  const corruptPayload = {
    app: 'FERMENT',
    timestamp,
    reason,
    recovery: rawContent,
  };
  const json = JSON.stringify(corruptPayload, null, 2);

  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const filePath = `${dir}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, json, { encoding: FileSystem.EncodingType.UTF8 });
    return filePath;
  } else {
    inMemoryBackups.set(fileName, json);
    inMemoryCorruptRecovery = { fileName, timestamp, reason, recovery: rawContent };
    return fileName;
  }
}

/**
 * Checks if a corrupt state recovery is pending
 */
export async function getCorruptStateRecovery(): Promise<CorruptRecoveryInfo | null> {
  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const files = await FileSystem.readDirectoryAsync(dir);
    const corruptFiles = files.filter(f => f.startsWith('state_corrupt_') && f.endsWith('.json')).sort().reverse();
    if (corruptFiles.length === 0) return null;

    const latest = corruptFiles[0];
    const path = `${dir}${latest}`;
    try {
      const content = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.UTF8 });
      const parsed = JSON.parse(content);
      return {
        fileName: latest,
        timestamp: parsed.timestamp || '',
        reason: parsed.reason || 'Uszkodzony stan',
        recovery: parsed.recovery || '',
      };
    } catch {
      return null;
    }
  } else {
    return inMemoryCorruptRecovery;
  }
}

/**
 * Clears corrupt state after user resolves or ignores it
 */
export async function clearCorruptState(): Promise<void> {
  if (getDocDir()) {
    const dir = getBackupDirectory();
    const files = await FileSystem.readDirectoryAsync(dir);
    const corruptFiles = files.filter(f => f.startsWith('state_corrupt_') && f.endsWith('.json'));
    for (const f of corruptFiles) {
      try {
        await FileSystem.deleteAsync(`${dir}${f}`, { idempotent: true });
      } catch {
        // ignore
      }
    }
  } else {
    inMemoryCorruptRecovery = null;
  }
}

/**
 * Restores data from JSON backup string after creating a safety backup
 */
export async function restoreFromBackupJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    let parsed: FermentBackupData;
    try {
      parsed = JSON.parse(jsonString) as FermentBackupData;
    } catch (parseErr: any) {
      await saveCorruptState(jsonString, 'Niepoprawny format JSON');
      throw new Error(`Niepoprawny format JSON kopii: ${parseErr?.message}`);
    }

    if (parsed.app !== 'FERMENT' || !parsed.schema_version) {
      await saveCorruptState(jsonString, 'Brak nagłówka aplikacji FERMENT');
      throw new Error('Nieprawidłowy plik kopii zapasowej. Brak nagłówka FERMENT.');
    }

    // Schema version protection against downgrade data corruption (RYZ-05, BR-TEST-023)
    if (parsed.schema_version > CURRENT_SCHEMA_VERSION) {
      throw new Error(`Plik kopii pochodzi z nowszej wersji aplikacji (schemat v${parsed.schema_version} > bieżący v${CURRENT_SCHEMA_VERSION}). Zaktualizuj aplikację.`);
    }

    // P0: Always take safety backup of current state before overriding (pool: safety)
    await createSafetyBackup('przed-importem');

    const store = getSqliteStore();

    if (Array.isArray(parsed.batches)) {
      for (const b of parsed.batches) {
        await store.saveBatch(b);
      }
    }

    if (Array.isArray(parsed.cave_wheels)) {
      for (const w of parsed.cave_wheels) {
        await store.saveCaveWheel(w);
      }
    }

    if (Array.isArray(parsed.pantry_items)) {
      for (const p of parsed.pantry_items) {
        await store.savePantryItem(p);
      }
    }

    if (Array.isArray(parsed.weigh_logs)) {
      for (const wl of parsed.weigh_logs) {
        await store.logWeight(wl);
      }
    }

    if (parsed.app_settings) {
      await store.saveAppSettings(parsed.app_settings);
    }

    // Create an auto backup of newly restored state
    await createAutoBackup();

    return {
      success: true,
      message: 'Kopia zapasowa przywrócona pomyślnie. Utworzono punkt bezpieczeństwa.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Błąd przywracania kopii: ${error?.message || 'Nieznany błąd'}`,
    };
  }
}

/**
 * Lists available backups in storage classified by pool
 */
export async function listBackups(): Promise<BackupFileInfo[]> {
  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const files = await FileSystem.readDirectoryAsync(dir);
    const list: BackupFileInfo[] = [];

    for (const f of files.filter(f => f.endsWith('.json')).sort().reverse()) {
      const path = `${dir}${f}`;
      const info = await FileSystem.getInfoAsync(path);
      const pool: BackupFileInfo['pool'] = isAutoBackup(f)
        ? 'auto'
        : isSafetyBackup(f)
        ? 'safety'
        : 'other';

      list.push({
        fileName: f,
        filePath: path,
        createdAt: info.exists && 'modificationTime' in info ? new Date((info as any).modificationTime * 1000).toISOString() : new Date().toISOString(),
        sizeBytes: info.exists && 'size' in info ? (info as any).size || 0 : 0,
        pool,
      });
    }
    return list;
  } else {
    return Array.from(inMemoryBackups.keys()).map(name => ({
      fileName: name,
      filePath: name,
      createdAt: new Date().toISOString(),
      sizeBytes: inMemoryBackups.get(name)?.length || 0,
      pool: isAutoBackup(name) ? 'auto' : isSafetyBackup(name) ? 'safety' : 'other',
    }));
  }
}
