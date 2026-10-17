// ============================================================================
// Apps4Brew Studio — Real SQLite In-Memory Database Tests (Zero Mock DB)
// Mathematical & Persistence Rigor: DDL, Foreign Keys, Cascade, Constraints & Transactions
// ============================================================================

import { DatabaseSync } from 'node:sqlite';
import { FERMENT_SQL_DDL } from '../../src/data/sqlite-store';

describe('Real In-Memory SQLite Engine Verification (Zero Mock DB, W4)', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec(FERMENT_SQL_DDL);
  });

  afterEach(() => {
    db.close();
  });

  it('DDL-01: executes 100% of FERMENT_SQL_DDL and passes PRAGMA integrity_check', () => {
    const row = db.prepare('PRAGMA integrity_check;').get() as { integrity_check: string };
    expect(row.integrity_check).toBe('ok');
  });

  it('DDL-02: verifies existence of all core tables and indices in SQLite catalog', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all() as Array<{ name: string }>;
    const tableNames = tables.map((t) => t.name);

    expect(tableNames).toContain('app_settings');
    expect(tableNames).toContain('batches');
    expect(tableNames).toContain('cheese_batch_details');
    expect(tableNames).toContain('pressing_stages');
    expect(tableNames).toContain('brining_logs');
    expect(tableNames).toContain('cave_cheese_wheels');
    expect(tableNames).toContain('cave_action_logs');
    expect(tableNames).toContain('wheel_weight_logs');
    expect(tableNames).toContain('cave_environment_logs');
    expect(tableNames).toContain('curd_batch_details');
    expect(tableNames).toContain('butter_churn_details');
    expect(tableNames).toContain('fermented_milk_details');
    expect(tableNames).toContain('whey_product_details');
    expect(tableNames).toContain('veg_ferment_details');
    expect(tableNames).toContain('symbiotic_beverage_details');
    expect(tableNames).toContain('pantry_inventory');
    expect(tableNames).toContain('sensory_evaluations');
    expect(tableNames).toContain('pending_ops');
  });

  it('FK-01: enforces ON DELETE CASCADE when a parent batch is deleted', () => {
    db.exec('PRAGMA foreign_keys = ON;');

    // Insert batch
    db.prepare(`
      INSERT INTO batches (id, batch_number, category, style_name, created_at, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('batch_gouda_99', 'GOU-TEST-99', 'CHEESE', 'Gouda 10L', 1700000000000, 'PRESSING', 'Cascade test');

    // Insert cheese details
    db.prepare(`
      INSERT INTO cheese_batch_details (batch_id, milk_type, milk_treatment, milk_volume_liters, rennet_type, rennet_imcu_per_ml, rennet_volume_ml)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('batch_gouda_99', 'COW_RAW', 'RAW_UNPASTEURIZED', 10.0, 'LIQUID_ANIMAL', 200, 2.5);

    // Insert pressing stage
    db.prepare(`
      INSERT INTO pressing_stages (id, batch_id, stage_order, target_pressure_kg_cm2, weight_applied_kg, duration_minutes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('stage_01', 'batch_gouda_99', 1, 0.05, 5.0, 30);

    // Verify records exist
    const detailsBefore = db.prepare('SELECT * FROM cheese_batch_details WHERE batch_id = ?').all('batch_gouda_99');
    const stagesBefore = db.prepare('SELECT * FROM pressing_stages WHERE batch_id = ?').all('batch_gouda_99');
    expect(detailsBefore).toHaveLength(1);
    expect(stagesBefore).toHaveLength(1);

    // Delete parent batch
    db.prepare('DELETE FROM batches WHERE id = ?').run('batch_gouda_99');

    // Verify cascade deletion
    const detailsAfter = db.prepare('SELECT * FROM cheese_batch_details WHERE batch_id = ?').all('batch_gouda_99');
    const stagesAfter = db.prepare('SELECT * FROM pressing_stages WHERE batch_id = ?').all('batch_gouda_99');
    expect(detailsAfter).toHaveLength(0);
    expect(stagesAfter).toHaveLength(0);
  });

  it('CONSTR-01: enforces wheel_tag UNIQUE constraint on cave_cheese_wheels', () => {
    db.exec('PRAGMA foreign_keys = ON;');

    db.prepare(`
      INSERT INTO batches (id, batch_number, category, style_name, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('batch_cheddar_01', 'CHD-01', 'CHEESE', 'Cheddar Farm', 1700000000000, 'AGING');

    db.prepare(`
      INSERT INTO cave_cheese_wheels (id, batch_id, wheel_tag, location_in_cave, initial_weight_grams, current_weight_grams, rind_type, target_aging_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('wheel_01', 'batch_cheddar_01', 'TAG-001', 'Polka 1', 1000, 1000, 'NATURAL', 90);

    // Attempt duplicate wheel_tag
    expect(() => {
      db.prepare(`
        INSERT INTO cave_cheese_wheels (id, batch_id, wheel_tag, location_in_cave, initial_weight_grams, current_weight_grams, rind_type, target_aging_days)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run('wheel_02', 'batch_cheddar_01', 'TAG-001', 'Polka 2', 1200, 1200, 'NATURAL', 90);
    }).toThrow(/UNIQUE constraint failed/);
  });

  it('TX-01: rolls back completely on fault injection (Zero Partial Writes)', () => {
    db.exec('PRAGMA foreign_keys = ON;');

    db.exec('BEGIN TRANSACTION;');
    try {
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('batch_tx_test', 'TX-001', 'CHEESE', 'Gouda Transaction', 1700000000000, 'PREPARING');

      // Inject fault: invalid category that violates CHECK constraint
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('batch_tx_bad', 'TX-002', 'INVALID_CATEGORY_TEST', 'Bad Batch', 1700000000000, 'PREPARING');

      db.exec('COMMIT;');
    } catch {
      db.exec('ROLLBACK;');
    }

    // Asercja Zero Partial Writes: żaden z rekordów z transakcji nie pozostał w bazie
    const batches = db.prepare('SELECT * FROM batches WHERE id IN (?, ?)').all('batch_tx_test', 'batch_tx_bad');
    expect(batches).toHaveLength(0);
  });

  it('CHECK-01: enforces category and status CHECK constraints on batches table', () => {
    expect(() => {
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('b_invalid_cat', 'INV-CAT', 'NON_EXISTENT_CAT', 'Style', 1700000000000, 'PREPARING');
    }).toThrow(/CHECK constraint failed/);

    expect(() => {
      db.prepare(`
        INSERT INTO batches (id, batch_number, category, style_name, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('b_invalid_stat', 'INV-STAT', 'CHEESE', 'Style', 1700000000000, 'INVALID_STATUS');
    }).toThrow(/CHECK constraint failed/);
  });
});
