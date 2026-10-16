import {
  createSnapshotData,
  createAutoBackup,
  createSafetyBackup,
  restoreFromBackupJson,
  listBackups,
} from '../../src/lib/backup';
import { getSqliteStore } from '../../src/data/sqlite-store';

describe('FERMENT 10-Rotation Backup & Disaster Recovery Engine', () => {
  const store = getSqliteStore();

  beforeAll(async () => {
    await store.initialize();
  });

  it('creates complete snapshot payload from store', async () => {
    const snapshot = await createSnapshotData();
    expect(snapshot.app).toBe('FERMENT');
    expect(snapshot.schema_version).toBe(1);
    expect(Array.isArray(snapshot.batches)).toBe(true);
    expect(snapshot.app_settings).toBeDefined();
  });

  it('creates auto-backup and rotates keeping maximum 10 backups', async () => {
    // Generate 12 auto backups
    for (let i = 0; i < 12; i++) {
      await createAutoBackup();
    }

    const backups = await listBackups();
    expect(backups.length).toBeLessThanOrEqual(10);
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

  it('rejects corrupted or non-FERMENT backup files safely', async () => {
    const invalidJson = JSON.stringify({ app: 'OTHER_APP', version: 1 });
    const res = await restoreFromBackupJson(invalidJson);
    expect(res.success).toBe(false);
    expect(res.message).toContain('Nieprawidłowy plik');
  });
});
