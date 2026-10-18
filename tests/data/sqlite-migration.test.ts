// ============================================================================
// Apps4Brew Studio — SQLite Schema Migration & Transactional Safeguard Tests
// Zero Data Loss Policy (RD-ENG-12, NFR-SEC-015, TASK-R05-02, TASK-R10-01)
// ============================================================================

import { DatabaseSync } from 'node:sqlite';
import { FERMENT_SQL_DDL } from '../../src/data/sqlite-store';

describe('SQLite Migration & Transactional Integrity (TASK-R05-02, TASK-R10-01)', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec(FERMENT_SQL_DDL);
  });

  afterEach(() => {
    db.close();
  });

  it('MIG-01: verifies PRAGMA busy_timeout is set to 5000ms to prevent iOS 0xDEAD10CC crashes', () => {
    const row = db.prepare('PRAGMA busy_timeout;').get() as { timeout: number };
    expect(row.timeout).toBe(5000);
  });

  it('MIG-02: verifies DDL idempotency (re-executing DDL does not corrupt data or fail)', () => {
    // Insert a batch record
    db.prepare(`
      INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('batch_idempotency_1', 'BATCH-IDEM-01', 'CHEESE', 'Idempotent Gouda', 1700000000000, 'PREPARING', 'Safe record');

    // Re-execute DDL
    expect(() => {
      db.exec(FERMENT_SQL_DDL);
    }).not.toThrow();

    // Verify record still exists intact
    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get('batch_idempotency_1') as { batch_number: string };
    expect(batch).toBeDefined();
    expect(batch.batch_number).toBe('BATCH-IDEM-01');

    // Integrity check
    const check = db.prepare('PRAGMA integrity_check;').get() as { integrity_check: string };
    expect(check.integrity_check).toBe('ok');
  });

  it('MIG-03: verifies atomic transaction rollback during migration failure (zero partial writes)', () => {
    // Stage initial data
    db.prepare(`
      INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('batch_tx_mig', 'BATCH-TX-01', 'CHEESE', 'Cheddar Pre-Mig', 1700000000000, 'PREPARING', 'Before migration');

    // Simulate an atomic migration transaction that encounters a failure halfway
    expect(() => {
      db.exec('BEGIN TRANSACTION;');
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('batch_tx_mig_2', 'BATCH-TX-02', 'CHEESE', 'Cheddar Mig 2', 1700000000001, 'PREPARING', 'Second batch');

      // Intentional failure: duplicate batch_number violates UNIQUE constraint
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('batch_tx_mig_3', 'BATCH-TX-01', 'CHEESE', 'Duplicate Batch', 1700000000002, 'PREPARING', 'Will fail');

      db.exec('COMMIT;');
    }).toThrow();

    // Rollback should restore state
    db.exec('ROLLBACK;');

    // First batch remains, second batch was rolled back
    const b1 = db.prepare('SELECT * FROM batches WHERE id = ?').get('batch_tx_mig');
    const b2 = db.prepare('SELECT * FROM batches WHERE id = ?').get('batch_tx_mig_2');
    expect(b1).toBeDefined();
    expect(b2).toBeUndefined();
  });

  it('MIG-04: verifies column addition migration preserves existing rows with zero data loss', () => {
    // Insert pantry item
    db.prepare(`
      INSERT INTO pantry_inventory (id, item_name, category, quantity_available, unit, cost_per_unit_pln)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('pantry_test_1', 'Podpuszczka Krowia', 'RENNET', 100, 'ml', 0.50);

    // Perform non-destructive ALTER TABLE migration
    db.exec('ALTER TABLE pantry_inventory ADD COLUMN supplier_lot_number TEXT DEFAULT NULL;');

    // Verify row is intact with new column
    const item = db.prepare('SELECT * FROM pantry_inventory WHERE id = ?').get('pantry_test_1') as {
      item_name: string;
      quantity_available: number;
      supplier_lot_number: string | null;
    };

    expect(item).toBeDefined();
    expect(item.item_name).toBe('Podpuszczka Krowia');
    expect(item.quantity_available).toBe(100);
    expect(item.supplier_lot_number).toBeNull();
  });

  it('MIG-05: verifies schema version tracking in app_settings table', () => {
    db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?);').run('schema_version', '1');

    const setting = db.prepare('SELECT value FROM app_settings WHERE key = ?;').get('schema_version') as { value: string };
    expect(setting).toBeDefined();
    expect(setting.value).toBe('1');

    // Upgrade version to 2
    db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?);').run('schema_version', '2');
    const upgraded = db.prepare('SELECT value FROM app_settings WHERE key = ?;').get('schema_version') as { value: string };
    expect(upgraded.value).toBe('2');
  });

  it('MIG-06: passes PRAGMA foreign_key_check on all relational tables', () => {
    // Insert valid parent and child
    db.prepare(`
      INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('batch_rel_1', 'REL-01', 'CHEESE', 'Brie', 1700000000000, 'AGING', 'FK check');

    db.prepare(`
      INSERT INTO cave_cheese_wheels (id, batch_id, wheel_tag, location_in_cave, initial_weight_grams, current_weight_grams, rind_type, target_aging_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('wheel_rel_1', 'batch_rel_1', 'TAG-REL-1', 'A1', 1200, 1150, 'BLOOMY_WHITE', 30);

    const fkViolations = db.prepare('PRAGMA foreign_key_check;').all();
    expect(fkViolations.length).toBe(0);
  });
});
