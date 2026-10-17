import {
  createSnapshotData,
  createAutoBackup,
  createSafetyBackup,
  restoreFromBackupJson,
  listBackups,
  getCorruptStateRecovery,
  clearCorruptState,
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
});
