// ============================================================================
// Apps4Brew Studio — FERMENT 10-Rotation Backup & Disaster Recovery Engine
// Automatic JSON snapshotting after mutations & safetyBackup before restore
// ============================================================================

import * as FileSystem from 'expo-file-system/legacy';
import { getSqliteStore, Batch, CaveWheel, PantryItem, WeighLog, AppSettings } from '../data/sqlite-store';

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
}

const MAX_ROTATION_BACKUPS = 10;
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

function getBackupDirectory(): string {
  const docDir = getDocDir();
  if (docDir) {
    return `${docDir}${BACKUP_DIR_NAME}/`;
  }
  return '/tmp/ferment_backups/';
}

/**
 * Ensures backup directory exists
 */
async function ensureDirectoryExists(dir: string): Promise<void> {
  if (getDocDir()) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
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
    schema_version: 1,
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
 * 10-Rotation automatic backup triggered after each data mutation
 */
export async function createAutoBackup(): Promise<string> {
  const data = await createSnapshotData();
  const json = JSON.stringify(data, null, 2);
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const fileName = `ferment_backup_${timestamp}.json`;

  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const filePath = `${dir}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, json, { encoding: FileSystem.EncodingType.UTF8 });

    // Rotate and purge older than 10 backups
    await rotateBackups(dir);
    return filePath;
  } else {
    // In-memory fallback for unit testing
    inMemoryBackups.set(fileName, json);
    if (inMemoryBackups.size > MAX_ROTATION_BACKUPS) {
      const oldestKey = Array.from(inMemoryBackups.keys()).sort()[0];
      inMemoryBackups.delete(oldestKey);
    }
    return fileName;
  }
}

/**
 * Purges older backups to keep strictly at most MAX_ROTATION_BACKUPS (10)
 */
async function rotateBackups(dir: string): Promise<void> {
  if (!getDocDir()) return;

  const files = await FileSystem.readDirectoryAsync(dir);
  const backupFiles = files
    .filter(f => f.startsWith('ferment_backup_') && f.endsWith('.json'))
    .sort(); // Lexicographical sort by timestamp

  if (backupFiles.length > MAX_ROTATION_BACKUPS) {
    const toDeleteCount = backupFiles.length - MAX_ROTATION_BACKUPS;
    for (let i = 0; i < toDeleteCount; i++) {
      const fileToDelete = `${dir}${backupFiles[i]}`;
      try {
        await FileSystem.deleteAsync(fileToDelete, { idempotent: true });
      } catch {
        // Ignore deletion error
      }
    }
  }
}

/**
 * Creates safety snapshot before importing or restoring
 */
export async function createSafetyBackup(reason: string = 'restore'): Promise<string> {
  const data = await createSnapshotData();
  const json = JSON.stringify(data, null, 2);
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const fileName = `safety_backup_${reason}_${timestamp}.json`;

  if (getDocDir()) {
    const dir = getBackupDirectory();
    await ensureDirectoryExists(dir);
    const filePath = `${dir}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, json, { encoding: FileSystem.EncodingType.UTF8 });
    return filePath;
  } else {
    inMemoryBackups.set(fileName, json);
    return fileName;
  }
}

/**
 * Restores data from JSON backup string after creating a safety backup
 */
export async function restoreFromBackupJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(jsonString) as FermentBackupData;
    if (parsed.app !== 'FERMENT' || !parsed.schema_version) {
      throw new Error('Nieprawidłowy plik kopii zapasowej. Brak nagłówka FERMENT.');
    }

    // P0: Always take safety backup of current state before overriding
    await createSafetyBackup('pre_restore');

    const store = getSqliteStore();

    // Restore batches
    if (Array.isArray(parsed.batches)) {
      for (const b of parsed.batches) {
        await store.saveBatch(b);
      }
    }

    // Restore cave wheels
    if (Array.isArray(parsed.cave_wheels)) {
      for (const w of parsed.cave_wheels) {
        await store.saveCaveWheel(w);
      }
    }

    // Restore pantry
    if (Array.isArray(parsed.pantry_items)) {
      for (const p of parsed.pantry_items) {
        await store.savePantryItem(p);
      }
    }

    // Restore weigh logs
    if (Array.isArray(parsed.weigh_logs)) {
      for (const wl of parsed.weigh_logs) {
        await store.logWeight(wl);
      }
    }

    // Restore app settings if present
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
 * Lists available backups in storage
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
      list.push({
        fileName: f,
        filePath: path,
        createdAt: info.exists && 'modificationTime' in info ? new Date((info as any).modificationTime * 1000).toISOString() : new Date().toISOString(),
        sizeBytes: info.exists && 'size' in info ? (info as any).size || 0 : 0,
      });
    }
    return list;
  } else {
    return Array.from(inMemoryBackups.keys()).map(name => ({
      fileName: name,
      filePath: name,
      createdAt: new Date().toISOString(),
      sizeBytes: inMemoryBackups.get(name)?.length || 0,
    }));
  }
}
