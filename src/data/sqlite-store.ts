// ============================================================================
// Apps4Brew Studio — FERMENT SQLite Store & Persistence
// 100% Offline-First | WAL Mode | Foreign Keys ON | Safe Sandbox Path
// ============================================================================

import * as SQLite from 'expo-sqlite';
import { dbDirectory } from '../lib/db-path';
import {
  Batch,
  CheeseBatchDetails,
  PressingStage,
  BriningLog,
  CaveCheeseWheel,
  CaveEnvironmentLog,
  VegFermentDetails,
  SymbioticBeverageDetails,
  PantryItem,
  SensoryEvaluation,
  CaveActionLog,
  StoredAppAccess,
  SubscriptionTier,
} from './db';

const DB_NAME = 'ferment.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

// In-memory fallback for non-native / Jest testing environments
let memBatches: Batch[] = [];
let memCheeseDetails: Map<string, CheeseBatchDetails> = new Map();
let memPressingStages: Map<string, PressingStage[]> = new Map();
let memBriningLogs: Map<string, BriningLog> = new Map();
let memCaveWheels: CaveCheeseWheel[] = [];
let memCaveActions: CaveActionLog[] = [];
let memEnvLogs: CaveEnvironmentLog[] = [];
let memVegDetails: Map<string, VegFermentDetails> = new Map();
let memBeverageDetails: Map<string, SymbioticBeverageDetails> = new Map();
let memPantry: PantryItem[] = [];
let memSensory: Map<string, SensoryEvaluation> = new Map();
let memSettings: Record<string, string> = {};
let memAppAccess: StoredAppAccess = {
  id: 'current_user',
  trialStartedAt: Date.now(),
  trialDays: 14,
  subscriptionTier: 'none',
  subscriptionExpiresAt: null,
  completedBatchesCount: 0,
};

export function _resetMemStore(): void {
  memBatches = [];
  memCheeseDetails = new Map();
  memPressingStages = new Map();
  memBriningLogs = new Map();
  memCaveWheels = [];
  memCaveActions = [];
  memEnvLogs = [];
  memVegDetails = new Map();
  memBeverageDetails = new Map();
  memPantry = [];
  memSensory = new Map();
  memSettings = {};
  memAppAccess = {
    id: 'current_user',
    trialStartedAt: Date.now(),
    trialDays: 14,
    subscriptionTier: 'none',
    subscriptionExpiresAt: null,
    completedBatchesCount: 0,
  };
}

export async function getDb(): Promise<SQLite.SQLiteDatabase | null> {
  if (dbInstance) return dbInstance;
  try {
    const defaultDir = SQLite.defaultDatabaseDirectory;
    const safeDir = dbDirectory(defaultDir);
    dbInstance = safeDir
      ? await SQLite.openDatabaseAsync(DB_NAME, undefined, safeDir)
      : await SQLite.openDatabaseAsync(DB_NAME);
    return dbInstance;
  } catch {
    return null; // Fallback to memory store
  }
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS batches (
          id TEXT PRIMARY KEY NOT NULL,
          batch_number TEXT UNIQUE NOT NULL,
          category TEXT NOT NULL CHECK(category IN ('CHEESE', 'VEG_FERMENT', 'KIMCHI', 'KOMBUCHA', 'VINEGAR')),
          style_name TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS cheese_batch_details (
          batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          milk_type TEXT NOT NULL,
          milk_treatment TEXT NOT NULL,
          milk_volume_liters REAL NOT NULL,
          cacl2_added_grams REAL DEFAULT 0.0,
          rennet_type TEXT NOT NULL,
          rennet_imcu_per_ml REAL NOT NULL,
          rennet_volume_ml REAL NOT NULL,
          flocculation_seconds INTEGER,
          flocculation_multiplier REAL,
          target_cut_seconds INTEGER,
          curd_size_target TEXT,
          cooking_target_temp_c REAL,
          cooking_duration_minutes INTEGER,
          whey_washed_liters REAL DEFAULT 0.0
        );

        CREATE TABLE IF NOT EXISTS pressing_stages (
          id TEXT PRIMARY KEY NOT NULL,
          batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          stage_order INTEGER NOT NULL,
          target_pressure_kg_cm2 REAL NOT NULL,
          weight_applied_kg REAL NOT NULL,
          duration_minutes INTEGER NOT NULL,
          turned_and_flipped INTEGER NOT NULL DEFAULT 0,
          completed_at INTEGER
        );

        CREATE TABLE IF NOT EXISTS brining_logs (
          batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          brine_salinity_pct REAL NOT NULL,
          brine_ph REAL NOT NULL,
          cacl2_in_brine_pct REAL NOT NULL,
          started_at INTEGER NOT NULL,
          planned_duration_hours REAL NOT NULL,
          turned_in_brine INTEGER NOT NULL DEFAULT 0,
          completed_at INTEGER
        );

        CREATE TABLE IF NOT EXISTS cave_cheese_wheels (
          id TEXT PRIMARY KEY NOT NULL,
          batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          wheel_tag TEXT UNIQUE NOT NULL,
          location_in_cave TEXT NOT NULL,
          initial_weight_grams REAL NOT NULL,
          current_weight_grams REAL NOT NULL,
          rind_type TEXT NOT NULL,
          target_aging_days INTEGER NOT NULL,
          last_turned_at INTEGER,
          last_washed_at INTEGER,
          last_brushed_at INTEGER,
          pierced_for_blue_at INTEGER,
          shrinkage_pct REAL DEFAULT 0.0
        );

        CREATE TABLE IF NOT EXISTS cave_action_logs (
          id TEXT PRIMARY KEY NOT NULL,
          wheel_id TEXT NOT NULL REFERENCES cave_cheese_wheels(id) ON DELETE CASCADE,
          action_type TEXT NOT NULL,
          logged_at INTEGER NOT NULL,
          weight_grams REAL,
          shrinkage_pct REAL,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS cave_environment_logs (
          id TEXT PRIMARY KEY NOT NULL,
          timestamp INTEGER NOT NULL,
          temperature_c REAL NOT NULL,
          humidity_rh_pct REAL NOT NULL,
          dew_point_c REAL NOT NULL,
          sensor_source TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS veg_ferment_details (
          batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          vegetables_weight_grams REAL NOT NULL,
          water_weight_grams REAL NOT NULL,
          total_batch_weight_grams REAL NOT NULL,
          salt_target_pct REAL NOT NULL,
          salt_added_grams REAL NOT NULL,
          salting_method TEXT NOT NULL,
          initial_ph REAL,
          current_ph REAL,
          botulinum_safe INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS symbiotic_beverage_details (
          batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          tea_type TEXT,
          tea_grams REAL,
          sugar_grams REAL,
          water_liters REAL,
          starter_liquid_ml REAL,
          scoby_tag TEXT,
          phase TEXT NOT NULL,
          estimated_abv_pct REAL,
          estimated_co2_volumes REAL,
          target_acetic_acid_pct REAL
        );

        CREATE TABLE IF NOT EXISTS pantry_inventory (
          id TEXT PRIMARY KEY NOT NULL,
          item_name TEXT NOT NULL,
          category TEXT NOT NULL,
          quantity_available REAL NOT NULL,
          unit TEXT NOT NULL,
          imcu_or_concentration TEXT,
          expiry_date INTEGER,
          cost_per_unit_pln REAL
        );

        CREATE TABLE IF NOT EXISTS sensory_evaluations (
          id TEXT PRIMARY KEY NOT NULL,
          batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
          evaluated_at INTEGER NOT NULL,
          acidity INTEGER,
          salinity INTEGER,
          firmness INTEGER,
          creaminess INTEGER,
          pungency INTEGER,
          nuttiness INTEGER,
          tasting_notes TEXT
        );
      `);
    } catch {
      // Ignore DDL errors in fallback environments
    }
  }

  // Populate memory defaults for development / testing
  if (memPantry.length === 0) {
    memPantry = [
      {
        id: 'pantry_salt_klodawska',
        itemName: 'Sól kamienna kłodawska niejodowana',
        category: 'SALT',
        quantityAvailable: 3000,
        unit: 'g',
        costPerUnitPln: 0.003,
      },
      {
        id: 'pantry_rennet_chymosin',
        itemName: 'Podpuszczka naturalna chymozyna 200 IMCU',
        category: 'RENNET',
        quantityAvailable: 50,
        unit: 'ml',
        imcuOrConcentration: '200 IMCU/ml',
        costPerUnitPln: 0.60,
      },
      {
        id: 'pantry_cacl2_33',
        itemName: 'Chlorek wapnia (CaCl2) roztwór 33%',
        category: 'MINERAL',
        quantityAvailable: 100,
        unit: 'ml',
        imcuOrConcentration: '33%',
        costPerUnitPln: 0.15,
      },
      {
        id: 'pantry_culture_meso_ld',
        itemName: 'Kultury mezofilne typ LD (L. lactis, L. cremoris, diacetylactis)',
        category: 'CULTURE',
        quantityAvailable: 10,
        unit: 'g',
        costPerUnitPln: 3.5,
      },
    ];
  }
}

// ============================================================================
// App Settings & Monetization CRUD
// ============================================================================

export async function getAppSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (db) {
    try {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_settings WHERE key = ?',
        [key]
      );
      return row ? row.value : null;
    } catch {
      // Fallback
    }
  }
  return memSettings[key] ?? null;
}

export async function setAppSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        [key, value]
      );
      return;
    } catch {
      // Fallback
    }
  }
  memSettings[key] = value;
}

export async function getAppAccess(): Promise<StoredAppAccess> {
  const trialStartStr = await getAppSetting('trial_start_timestamp');
  const purchasedTierStr = await getAppSetting('purchased_receipt_tier');
  const completedBatchesStr = await getAppSetting('completed_batches_count');
  const expiresAtStr = await getAppSetting('subscription_expires_at');

  const trialStartedAt = trialStartStr ? parseInt(trialStartStr, 10) : memAppAccess.trialStartedAt;
  const subscriptionTier = (purchasedTierStr as SubscriptionTier) || memAppAccess.subscriptionTier;
  const completedBatchesCount = completedBatchesStr ? parseInt(completedBatchesStr, 10) : memAppAccess.completedBatchesCount;
  const subscriptionExpiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : memAppAccess.subscriptionExpiresAt;

  return {
    id: 'current_user',
    trialStartedAt,
    trialDays: 14,
    subscriptionTier,
    subscriptionExpiresAt,
    completedBatchesCount,
    purchasedReceiptTier: subscriptionTier,
  };
}

export async function setSubscriptionTier(
  tier: SubscriptionTier,
  expiresAt: number | null = null
): Promise<void> {
  await setAppSetting('purchased_receipt_tier', tier);
  if (expiresAt) {
    await setAppSetting('subscription_expires_at', expiresAt.toString());
  } else {
    await setAppSetting('subscription_expires_at', '');
  }
  memAppAccess.subscriptionTier = tier;
  memAppAccess.subscriptionExpiresAt = expiresAt;
  memAppAccess.purchasedReceiptTier = tier;
}

export async function incrementCompletedBatches(): Promise<number> {
  const current = await getAppAccess();
  const next = current.completedBatchesCount + 1;
  await setAppSetting('completed_batches_count', next.toString());
  memAppAccess.completedBatchesCount = next;
  return next;
}

// ============================================================================
// Batches & Cave Wheels CRUD
// ============================================================================

export async function getBatches(): Promise<Batch[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.getAllAsync<{
        id: string;
        batch_number: string;
        category: string;
        style_name: string;
        created_at: number;
        status: string;
        notes: string | null;
      }>('SELECT * FROM batches ORDER BY created_at DESC');
      return rows.map((r) => ({
        id: r.id,
        batchNumber: r.batch_number,
        category: r.category as any,
        styleName: r.style_name,
        createdAt: r.created_at,
        status: r.status as any,
        notes: r.notes || undefined,
      }));
    } catch {
      // Fallback
    }
  }
  return [...memBatches];
}

export async function saveBatch(
  batch: Batch,
  cheeseDetails?: CheeseBatchDetails,
  vegDetails?: VegFermentDetails,
  beverageDetails?: SymbioticBeverageDetails
): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO batches (id, batch_number, category, style_name, created_at, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [batch.id, batch.batchNumber, batch.category, batch.styleName, batch.createdAt, batch.status, batch.notes || null]
      );
      if (cheeseDetails) {
        await db.runAsync(
          `INSERT OR REPLACE INTO cheese_batch_details 
           (batch_id, milk_type, milk_treatment, milk_volume_liters, cacl2_added_grams, rennet_type, rennet_imcu_per_ml, rennet_volume_ml, flocculation_seconds, flocculation_multiplier, target_cut_seconds, curd_size_target, cooking_target_temp_c, cooking_duration_minutes, whey_washed_liters)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cheeseDetails.batchId,
            cheeseDetails.milkType,
            cheeseDetails.milkTreatment,
            cheeseDetails.milkVolumeLiters,
            cheeseDetails.cacl2AddedGrams,
            cheeseDetails.rennetType,
            cheeseDetails.rennetImcuPerMl,
            cheeseDetails.rennetVolumeMl,
            cheeseDetails.flocculationSeconds || null,
            cheeseDetails.flocculationMultiplier || null,
            cheeseDetails.targetCutSeconds || null,
            cheeseDetails.curdSizeTarget || null,
            cheeseDetails.cookingTargetTempC || null,
            cheeseDetails.cookingDurationMinutes || null,
            cheeseDetails.wheyWashedLiters || 0.0,
          ]
        );
      }
      return;
    } catch {
      // Fallback
    }
  }

  const idx = memBatches.findIndex((b) => b.id === batch.id);
  if (idx >= 0) memBatches[idx] = batch;
  else memBatches.unshift(batch);

  if (cheeseDetails) memCheeseDetails.set(batch.id, cheeseDetails);
  if (vegDetails) memVegDetails.set(batch.id, vegDetails);
  if (beverageDetails) memBeverageDetails.set(batch.id, beverageDetails);
}

export async function getCaveWheels(): Promise<CaveCheeseWheel[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.getAllAsync<{
        id: string;
        batch_id: string;
        wheel_tag: string;
        location_in_cave: string;
        initial_weight_grams: number;
        current_weight_grams: number;
        rind_type: string;
        target_aging_days: number;
        last_turned_at: number | null;
        last_washed_at: number | null;
        last_brushed_at: number | null;
        pierced_for_blue_at: number | null;
        shrinkage_pct: number;
      }>('SELECT * FROM cave_cheese_wheels ORDER BY initial_weight_grams DESC');
      return rows.map((r) => ({
        id: r.id,
        batchId: r.batch_id,
        wheelTag: r.wheel_tag,
        locationInCave: r.location_in_cave,
        initialWeightGrams: r.initial_weight_grams,
        currentWeightGrams: r.current_weight_grams,
        rindType: r.rind_type as any,
        targetAgingDays: r.target_aging_days,
        lastTurnedAt: r.last_turned_at || undefined,
        lastWashedAt: r.last_washed_at || undefined,
        lastBrushedAt: r.last_brushed_at || undefined,
        piercedForBlueAt: r.pierced_for_blue_at || undefined,
        shrinkagePct: r.shrinkage_pct,
      }));
    } catch {
      // Fallback
    }
  }
  return [...memCaveWheels];
}

export async function saveCaveWheel(wheel: CaveCheeseWheel): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO cave_cheese_wheels 
         (id, batch_id, wheel_tag, location_in_cave, initial_weight_grams, current_weight_grams, rind_type, target_aging_days, last_turned_at, last_washed_at, last_brushed_at, pierced_for_blue_at, shrinkage_pct)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          wheel.id,
          wheel.batchId,
          wheel.wheelTag,
          wheel.locationInCave,
          wheel.initialWeightGrams,
          wheel.currentWeightGrams,
          wheel.rindType,
          wheel.targetAgingDays,
          wheel.lastTurnedAt || null,
          wheel.lastWashedAt || null,
          wheel.lastBrushedAt || null,
          wheel.piercedForBlueAt || null,
          wheel.shrinkagePct,
        ]
      );
      return;
    } catch {
      // Fallback
    }
  }
  const idx = memCaveWheels.findIndex((w) => w.id === wheel.id);
  if (idx >= 0) memCaveWheels[idx] = wheel;
  else memCaveWheels.push(wheel);
}

export async function getPantry(): Promise<PantryItem[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.getAllAsync<{
        id: string;
        item_name: string;
        category: string;
        quantity_available: number;
        unit: string;
        imcu_or_concentration: string | null;
        expiry_date: number | null;
        cost_per_unit_pln: number | null;
      }>('SELECT * FROM pantry_inventory ORDER BY category ASC, item_name ASC');
      return rows.map((r) => ({
        id: r.id,
        itemName: r.item_name,
        category: r.category as any,
        quantityAvailable: r.quantity_available,
        unit: r.unit,
        imcuOrConcentration: r.imcu_or_concentration || undefined,
        expiryDate: r.expiry_date || undefined,
        costPerUnitPln: r.cost_per_unit_pln || undefined,
      }));
    } catch {
      // Fallback
    }
  }
  return [...memPantry];
}

export async function savePantryItem(item: PantryItem): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO pantry_inventory 
         (id, item_name, category, quantity_available, unit, imcu_or_concentration, expiry_date, cost_per_unit_pln)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.itemName,
          item.category,
          item.quantityAvailable,
          item.unit,
          item.imcuOrConcentration || null,
          item.expiryDate || null,
          item.costPerUnitPln || null,
        ]
      );
      return;
    } catch {
      // Fallback
    }
  }
  const idx = memPantry.findIndex((p) => p.id === item.id);
  if (idx >= 0) memPantry[idx] = item;
  else memPantry.push(item);
}

export async function deletePantryItem(itemId: string): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync('DELETE FROM pantry_inventory WHERE id = ?', [itemId]);
      return;
    } catch {
      // Fallback
    }
  }
  memPantry = memPantry.filter((p) => p.id !== itemId);
}

export async function updatePantryItemQty(itemId: string, newQty: number): Promise<void> {
  const safeQty = Math.max(0, Math.round(newQty * 100) / 100);
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync('UPDATE pantry_inventory SET quantity_available = ? WHERE id = ?', [safeQty, itemId]);
      return;
    } catch {
      // Fallback
    }
  }
  const idx = memPantry.findIndex((p) => p.id === itemId);
  if (idx >= 0) {
    memPantry[idx] = { ...memPantry[idx], quantityAvailable: safeQty };
  }
}

export async function applyPantryDepletion(
  depletions: { pantryItemId: string; remainingQty: number }[]
): Promise<void> {
  for (const dep of depletions) {
    await updatePantryItemQty(dep.pantryItemId, dep.remainingQty);
  }
}

export type CaveWheel = CaveCheeseWheel;

export interface WeighLog {
  id: string;
  wheelId: string;
  weightGrams: number;
  shrinkagePct: number;
  loggedAt: number;
}

export async function getCaveActions(wheelId: string): Promise<CaveActionLog[]> {
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.getAllAsync<{
        id: string;
        wheel_id: string;
        action_type: string;
        logged_at: number;
        weight_grams: number | null;
        shrinkage_pct: number | null;
        notes: string | null;
      }>('SELECT * FROM cave_action_logs WHERE wheel_id = ? ORDER BY logged_at DESC', [wheelId]);
      return rows.map((r) => ({
        id: r.id,
        wheelId: r.wheel_id,
        actionType: r.action_type as any,
        loggedAt: r.logged_at,
        weightGrams: r.weight_grams || undefined,
        shrinkagePct: r.shrinkage_pct || undefined,
        notes: r.notes || undefined,
      }));
    } catch {
      // Fallback
    }
  }
  return memCaveActions.filter((a) => a.wheelId === wheelId);
}

export async function logCaveAction(action: CaveActionLog): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO cave_action_logs (id, wheel_id, action_type, logged_at, weight_grams, shrinkage_pct, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          action.id,
          action.wheelId,
          action.actionType,
          action.loggedAt,
          action.weightGrams || null,
          action.shrinkagePct || null,
          action.notes || null,
        ]
      );
      return;
    } catch {
      // Fallback
    }
  }
  memCaveActions.unshift(action);
}

export async function getSensoryEvaluation(batchId: string): Promise<SensoryEvaluation | null> {
  const db = await getDb();
  if (db) {
    try {
      const row = await db.getFirstAsync<{
        id: string;
        batch_id: string;
        evaluated_at: number;
        acidity: number | null;
        salinity: number | null;
        firmness: number | null;
        creaminess: number | null;
        pungency: number | null;
        nuttiness: number | null;
        tasting_notes: string | null;
      }>('SELECT * FROM sensory_evaluations WHERE batch_id = ?', [batchId]);
      if (row) {
        return {
          id: row.id,
          batchId: row.batch_id,
          evaluatedAt: row.evaluated_at,
          acidity: row.acidity || 5,
          salinity: row.salinity || 5,
          firmness: row.firmness || 5,
          creaminess: row.creaminess || 5,
          pungency: row.pungency || 5,
          nuttiness: row.nuttiness || 5,
          tastingNotes: row.tasting_notes || undefined,
        };
      }
    } catch {
      // Fallback
    }
  }
  return memSensory.get(batchId) || null;
}

export async function saveSensoryEvaluation(ev: SensoryEvaluation): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO sensory_evaluations (id, batch_id, evaluated_at, acidity, salinity, firmness, creaminess, pungency, nuttiness, tasting_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ev.id,
          ev.batchId,
          ev.evaluatedAt,
          ev.acidity,
          ev.salinity,
          ev.firmness,
          ev.creaminess,
          ev.pungency,
          ev.nuttiness,
          ev.tastingNotes || null,
        ]
      );
      return;
    } catch {
      // Fallback
    }
  }
  memSensory.set(ev.batchId, ev);
}

export async function updateBatchStatus(batchId: string, status: Batch['status']): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync('UPDATE batches SET status = ? WHERE id = ?', [status, batchId]);
      return;
    } catch {
      // Fallback
    }
  }
  const b = memBatches.find((item) => item.id === batchId);
  if (b) b.status = status;
}

export async function deleteBatch(batchId: string): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync('DELETE FROM batches WHERE id = ?', [batchId]);
      return;
    } catch {
      // Fallback
    }
  }
  memBatches = memBatches.filter((b) => b.id !== batchId);
}

export async function deleteCaveWheel(wheelId: string): Promise<void> {
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync('DELETE FROM cave_cheese_wheels WHERE id = ?', [wheelId]);
      return;
    } catch {
      // Fallback
    }
  }
  memCaveWheels = memCaveWheels.filter((w) => w.id !== wheelId);
}

export interface AppSettings {
  app_lang: 'pl' | 'en';
  unit_system: 'metric' | 'imperial';
  trial_start_timestamp: number;
  purchased_receipt_tier: string;
  updated_at: string;
}

export { Batch, PantryItem, CaveCheeseWheel, CaveActionLog, SensoryEvaluation };

export function getSqliteStore() {
  return {
    initialize: initDatabase,
    getBatches,
    saveBatch: async (batch: any, details?: any) => {
      const normalizedBatch: Batch = {
        id: batch.id,
        batchNumber: batch.batchNumber || batch.code || `BATCH-${batch.id}`,
        category: (batch.category || (batch.type ? batch.type.toUpperCase() : 'CHEESE')) as any,
        styleName: batch.styleName || batch.name || 'Ser Zagrodowy',
        createdAt: batch.createdAt || (batch.started_at ? new Date(batch.started_at).getTime() : Date.now()),
        status: (batch.status || 'PREPARING') as any,
        notes: batch.notes,
      };
      return saveBatch(normalizedBatch, details);
    },
    updateBatchStatus,
    deleteBatch,
    getCaveWheels,
    saveCaveWheel,
    deleteCaveWheel,
    getCaveActions,
    logCaveAction,
    getSensoryEvaluation,
    saveSensoryEvaluation,
    getPantryItems: getPantry,
    savePantryItem,
    deletePantryItem,
    updatePantryItemQty,
    applyPantryDepletion,
    getWeighLogs: async (wheelId?: string): Promise<WeighLog[]> => {
      if (wheelId) {
        const actions = await getCaveActions(wheelId);
        return actions
          .filter((a) => a.actionType === 'WEIGH' && a.weightGrams !== undefined)
          .map((a) => ({
            id: a.id,
            wheelId: a.wheelId,
            weightGrams: a.weightGrams!,
            shrinkagePct: a.shrinkagePct || 0,
            loggedAt: a.loggedAt,
          }));
      }
      return [];
    },
    logWeight: async (log: WeighLog): Promise<void> => {
      await logCaveAction({
        id: log.id,
        wheelId: log.wheelId,
        actionType: 'WEIGH',
        loggedAt: log.loggedAt,
        weightGrams: log.weightGrams,
        shrinkagePct: log.shrinkagePct,
      });
    },
    getAppSettings: async (): Promise<AppSettings> => {
      const lang = ((await getAppSetting('app_lang')) as 'pl' | 'en') || 'pl';
      const unit = ((await getAppSetting('unit_system')) as 'metric' | 'imperial') || 'metric';
      const trial = await getAppSetting('trial_start_timestamp');
      const tier = (await getAppSetting('purchased_receipt_tier')) || 'none';
      return {
        app_lang: lang,
        unit_system: unit,
        trial_start_timestamp: trial ? parseInt(trial, 10) : Date.now(),
        purchased_receipt_tier: tier,
        updated_at: new Date().toISOString(),
      };
    },
    saveAppSettings: async (settings: Partial<AppSettings>): Promise<void> => {
      if (settings.app_lang) await setAppSetting('app_lang', settings.app_lang);
      if (settings.unit_system) await setAppSetting('unit_system', settings.unit_system);
      if (settings.trial_start_timestamp) {
        await setAppSetting('trial_start_timestamp', settings.trial_start_timestamp.toString());
      }
      if (settings.purchased_receipt_tier) {
        await setAppSetting('purchased_receipt_tier', settings.purchased_receipt_tier);
      }
    },
  };
}

