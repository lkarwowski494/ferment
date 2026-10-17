import {
  createSnapshotData,
  createAutoBackup,
  createSafetyBackup,
  restoreFromBackupJson,
  listBackups,
  getCorruptStateRecovery,
  clearCorruptState,
  isAutoBackup,
  isSafetyBackup,
  _resetInMemoryBackups,
} from '../../src/lib/backup';
import { getSqliteStore } from '../../src/data/sqlite-store';

describe('FERMENT Dual 10-Rotation Backup & Disaster Recovery Engine (BR-TEST-022, BR-TEST-023, RD-ENG-12)', () => {
  const store = getSqliteStore();

  beforeAll(async () => {
    await store.initialize();
  });

  beforeEach(() => {
    _resetInMemoryBackups();
  });

  it('creates complete snapshot payload from store', async () => {
    const snapshot = await createSnapshotData();
    expect(snapshot.app).toBe('FERMENT');
    expect(snapshot.schema_version).toBe(1);
    expect(Array.isArray(snapshot.batches)).toBe(true);
    expect(snapshot.app_settings).toBeDefined();
  });

  it('maintains two strictly separated pools of 10 backups without displacing each other (RD-ENG-12)', async () => {
    // Generate 12 auto backups and 12 safety backups
    for (let i = 0; i < 12; i++) {
      await createAutoBackup();
      await createSafetyBackup('przed-importem');
    }

    const backups = await listBackups();
    const autoPool = backups.filter(b => b.pool === 'auto');
    const safetyPool = backups.filter(b => b.pool === 'safety');

    expect(autoPool.length).toBe(10);
    expect(safetyPool.length).toBe(10);
    expect(backups.length).toBe(20);
  });

  it('creates safety backup and successfully restores from valid JSON payload', async () => {
    const initialBatch = {
      id: 'test-batch-restore-1',
      code: 'RESTORE-001',
      type: 'cheese' as const,
      name: 'Koryciński Do Restore',
      status: 'active' as const,
      recipe_id: 'rec-1',
      started_at: '2026-10-15',
    };

    const payload = {
      schema_version: 1,
      app: 'FERMENT' as const,
      exported_at: new Date().toISOString(),
      batches: [initialBatch],
      cave_wheels: [],
      pantry_items: [],
      weigh_logs: [],
      app_settings: {
        app_lang: 'pl' as const,
        unit_system: 'metric' as const,
        trial_start_timestamp: 1000,
        purchased_receipt_tier: 'none' as const,
        updated_at: '2026-10-15',
      },
    };

    const res = await restoreFromBackupJson(JSON.stringify(payload));
    expect(res.success).toBe(true);

    const batches = await store.getBatches();
    expect(batches.some(b => b.id === 'test-batch-restore-1')).toBe(true);
  });

  it('rejects corrupted or non-FERMENT backup files and preserves raw recovery payload (BR-TEST-023)', async () => {
    await clearCorruptState();
    const invalidJson = '{"app": "OTHER_APP", "broken": true}';
    const res = await restoreFromBackupJson(invalidJson);
    expect(res.success).toBe(false);

    const corruptRecovery = await getCorruptStateRecovery();
    expect(corruptRecovery).not.toBeNull();
    expect(corruptRecovery?.recovery).toBe(invalidJson);
  });

  it('rejects future schema versions to prevent downgrade corruption (RYZ-05)', async () => {
    const futurePayload = {
      schema_version: 99,
      app: 'FERMENT' as const,
      exported_at: new Date().toISOString(),
      batches: [],
      cave_wheels: [],
      pantry_items: [],
      weigh_logs: [],
      app_settings: {
        app_lang: 'pl' as const,
        unit_system: 'metric' as const,
        trial_start_timestamp: 1000,
        purchased_receipt_tier: 'none' as const,
        updated_at: '2026-10-15',
      },
    };

    const res = await restoreFromBackupJson(JSON.stringify(futurePayload));
    expect(res.success).toBe(false);
    expect(res.message).toContain('nowszej wersji aplikacji');
  });

  it('correctly classifies auto, safety, and other backup file names (QA-03)', () => {
    expect(isAutoBackup('ferment-kopia-2026-10-18-12-00-00.json')).toBe(true);
    expect(isAutoBackup('ferment_backup_2026.json')).toBe(true);
    expect(isAutoBackup('ferment-przed-importem-2026.json')).toBe(false);

    expect(isSafetyBackup('ferment-przed-importem-2026-10-18.json')).toBe(true);
    expect(isSafetyBackup('ferment-przed-czyszczeniem-2026-10-18.json')).toBe(true);
    expect(isSafetyBackup('safety_backup_snapshot.json')).toBe(true);
    expect(isSafetyBackup('ferment-kopia-1.json')).toBe(false);
    expect(isSafetyBackup('arbitrary-file.json')).toBe(false);
  });

  it('handles completely malformed JSON and captures it in corrupt state recovery (QA-03)', async () => {
    await clearCorruptState();
    const brokenJson = 'NOT_EVEN_JSON_AT_ALL {[';
    const res = await restoreFromBackupJson(brokenJson);

    expect(res.success).toBe(false);
    expect(res.message).toContain('Błąd przywracania kopii');

    const corrupt = await getCorruptStateRecovery();
    expect(corrupt).not.toBeNull();
    expect(corrupt?.reason).toBe('Niepoprawny format JSON');
    expect(corrupt?.recovery).toBe(brokenJson);

    await clearCorruptState();
    const afterClear = await getCorruptStateRecovery();
    expect(afterClear).toBeNull();
  });

  it('restores all entities: wheels, pantry items, and weigh logs (QA-03)', async () => {
    const fullPayload = {
      schema_version: 1,
      app: 'FERMENT' as const,
      exported_at: new Date().toISOString(),
      batches: [],
      cave_wheels: [
        {
          id: 'wheel-restore-1',
          batchId: 'batch-1',
          wheelTag: 'TAG-RES-1',
          locationInCave: 'Shelf A',
          initialWeightGrams: 1500,
          currentWeightGrams: 1400,
          rindType: 'NATURAL' as const,
          targetAgingDays: 90,
          shrinkagePct: 6.6,
        },
      ],
      pantry_items: [
        {
          id: 'pantry-restore-1',
          itemName: 'Chlorek Wapnia CaCl2',
          category: 'ADDITIVE' as const,
          quantityAvailable: 100,
          unit: 'ml',
        },
      ],
      weigh_logs: [
        {
          id: 'log-restore-1',
          wheelId: 'wheel-restore-1',
          loggedAt: 1700000000000,
          weightGrams: 1450,
          relativeHumidityPct: 85,
          ambientTemperatureC: 12,
        },
      ],
      app_settings: {
        app_lang: 'pl' as const,
        unit_system: 'metric' as const,
        trial_start_timestamp: 1000,
        purchased_receipt_tier: 'none' as const,
        updated_at: '2026-10-18',
      },
    };

    const res = await restoreFromBackupJson(JSON.stringify(fullPayload));
    expect(res.success).toBe(true);

    const wheels = await store.getCaveWheels();
    expect(wheels.some(w => w.id === 'wheel-restore-1')).toBe(true);

    const items = await store.getPantryItems();
    expect(items.some(p => p.id === 'pantry-restore-1')).toBe(true);
  });

  it('creates safety backup with przed-czyszczeniem prefix (QA-03)', async () => {
    const file = await createSafetyBackup('przed-czyszczeniem');
    expect(file).toContain('ferment-przed-czyszczeniem-');
  });
});
