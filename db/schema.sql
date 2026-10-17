-- ============================================================================
-- SEROWAR: Rzemieślnicze Przetwórstwo Mleka (db/schema.sql)
-- Standardy: SQLite ACID, WAL Mode, Foreign Keys ON, B-Tree Indexes < 5ms
-- 100% Offline-First | Zero Cloud | Bundle ID: com.apps4brew.serowar
-- ============================================================================

-- 1. Pragmatyki wydajnościowe i integralnościowe
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA busy_timeout = 5000;
PRAGMA temp_store = MEMORY;
PRAGMA cache_size = -64000; -- 64MB bufora w pamięci RAM

-- 2. Wersjonowanie migracji schematu
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL
);

-- 3. Główna tabela partii przetwórstwa mlecznego (Batches)
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('HARD_CHEESE', 'SOFT_CHEESE', 'FRESH_CURD', 'BUTTER_GHEE', 'FERMENTED_MILK', 'WHEY_PRODUCT')),
    style_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
    notes TEXT,
    milk_volume_liters REAL,
    sensory_score REAL,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);

-- 4. Szczegóły koagulacji podpuszczkowej (Cheese Batch Details)
CREATE TABLE IF NOT EXISTS cheese_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL,
    milk_type TEXT NOT NULL CHECK(milk_type IN ('COW', 'GOAT', 'SHEEP', 'BUFFALO', 'MIXED')),
    milk_treatment TEXT NOT NULL CHECK(milk_treatment IN ('RAW', 'PASTEURIZED_LOW', 'STORE_MICROFILTERED')),
    milk_volume_liters REAL NOT NULL CHECK(milk_volume_liters > 0),
    cacl2_added_grams REAL DEFAULT 0.0,
    rennet_type TEXT NOT NULL,
    rennet_imcu_per_ml REAL NOT NULL CHECK(rennet_imcu_per_ml > 0),
    rennet_volume_ml REAL NOT NULL CHECK(rennet_volume_ml > 0),
    flocculation_seconds INTEGER,
    flocculation_multiplier REAL,
    target_cut_seconds INTEGER,
    curd_size_target TEXT,
    cooking_target_temp_c REAL,
    cooking_duration_minutes INTEGER,
    whey_washed_liters REAL DEFAULT 0.0,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 5. Harmonogram kaskadowego prasowania sera (Pressing Stages)
CREATE TABLE IF NOT EXISTS pressing_stages (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    target_pressure_kg_cm2 REAL NOT NULL CHECK(target_pressure_kg_cm2 >= 0),
    weight_applied_kg REAL NOT NULL CHECK(weight_applied_kg >= 0),
    duration_minutes INTEGER NOT NULL CHECK(duration_minutes > 0),
    turned_and_flipped INTEGER NOT NULL DEFAULT 0 CHECK(turned_and_flipped IN (0, 1)),
    completed_at INTEGER,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 6. Log kąpieli w nasyconej solance (Brining Logs)
CREATE TABLE IF NOT EXISTS brining_logs (
    batch_id TEXT PRIMARY KEY NOT NULL,
    brine_salinity_pct REAL NOT NULL CHECK(brine_salinity_pct BETWEEN 5.0 AND 30.0),
    brine_ph REAL NOT NULL CHECK(brine_ph BETWEEN 4.0 AND 7.0),
    cacl2_in_brine_pct REAL NOT NULL DEFAULT 0.2,
    started_at INTEGER NOT NULL,
    planned_duration_hours REAL NOT NULL CHECK(planned_duration_hours > 0),
    turned_in_brine INTEGER NOT NULL DEFAULT 0 CHECK(turned_in_brine IN (0, 1)),
    completed_at INTEGER,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 7. Kartoteka krążków dojrzewających (Cave Cheese Wheels)
CREATE TABLE IF NOT EXISTS cave_cheese_wheels (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL,
    wheel_tag TEXT UNIQUE NOT NULL,
    location_in_cave TEXT NOT NULL,
    initial_weight_grams REAL NOT NULL CHECK(initial_weight_grams > 0),
    current_weight_grams REAL NOT NULL CHECK(current_weight_grams > 0),
    rind_type TEXT NOT NULL CHECK(rind_type IN ('NATURAL', 'SMEAR_BREVI', 'BLOOMY_WHITE', 'BLUE_MOLD', 'WAXED', 'OILED')),
    target_aging_days INTEGER NOT NULL CHECK(target_aging_days > 0),
    last_turned_at INTEGER,
    last_washed_at INTEGER,
    last_brushed_at INTEGER,
    pierced_for_blue_at INTEGER,
    shrinkage_pct REAL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'ACTIVE_AFFINAGE' CHECK(status IN ('DRYING_AFTER_BRINE', 'ACTIVE_AFFINAGE', 'RIND_SEALED', 'MATURED_READY', 'CONSUMED', 'DISCARDED')),
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 8. Czynności pielęgnacyjne krążka w dojrzewalni (Cave Action Logs)
CREATE TABLE IF NOT EXISTS cave_action_logs (
    id TEXT PRIMARY KEY NOT NULL,
    wheel_id TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK(action_type IN ('WEIGH', 'TURN', 'WASH_BRINE', 'DRY_BRUSH', 'WAX_COATING', 'CLOTHBOUND', 'PIERCE_BLUE')),
    logged_at INTEGER NOT NULL,
    weight_grams REAL,
    shrinkage_pct REAL,
    notes TEXT,
    FOREIGN KEY (wheel_id) REFERENCES cave_cheese_wheels(id) ON DELETE CASCADE
);

-- 9. Pomiary dynamiki ubytku wagi krążka (Wheel Weight Logs)
CREATE TABLE IF NOT EXISTS wheel_weight_logs (
    id TEXT PRIMARY KEY NOT NULL,
    wheel_id TEXT NOT NULL,
    weight_grams REAL NOT NULL CHECK(weight_grams > 0),
    shrinkage_pct REAL NOT NULL,
    logged_at INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (wheel_id) REFERENCES cave_cheese_wheels(id) ON DELETE CASCADE
);

-- 10. Rejestr mikroklimatu jaskini/dojrzewalni (Cave Environment Logs)
CREATE TABLE IF NOT EXISTS cave_environment_logs (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    temperature_c REAL NOT NULL,
    humidity_rh_pct REAL NOT NULL CHECK(humidity_rh_pct BETWEEN 0.0 AND 100.0),
    dew_point_c REAL NOT NULL,
    sensor_source TEXT NOT NULL CHECK(sensor_source IN ('MANUAL', 'RUUVI_BLE', 'MIJIA_BLE'))
);

-- 11. Szczegóły twarogów klinkowych i serów kwasowych (Curd Batch Details)
CREATE TABLE IF NOT EXISTS curd_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL,
    acidification_method TEXT NOT NULL CHECK(acidification_method IN ('NATURAL_SOURED', 'MESOPHILIC_DVI', 'CITRIC_ACID', 'ACID_WHEY')),
    milk_volume_liters REAL NOT NULL CHECK(milk_volume_liters > 0),
    measured_ph REAL,
    heating_temp_c REAL NOT NULL,
    drain_duration_minutes INTEGER NOT NULL,
    pressed_weight_kg REAL,
    final_curd_weight_grams REAL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 12. Parametry zmaślania śmietanki i klarowania ghee (Butter Churn Details)
CREATE TABLE IF NOT EXISTS butter_churn_details (
    batch_id TEXT PRIMARY KEY NOT NULL,
    cream_fat_pct REAL NOT NULL CHECK(cream_fat_pct BETWEEN 20.0 AND 50.0),
    cream_volume_liters REAL NOT NULL CHECK(cream_volume_liters > 0),
    cream_temperature_c REAL NOT NULL,
    cream_type TEXT NOT NULL CHECK(cream_type IN ('SWEET', 'CULTURED')),
    churn_duration_minutes INTEGER,
    wash_cycles_count INTEGER NOT NULL DEFAULT 3,
    butter_yield_grams REAL,
    buttermilk_yield_ml REAL,
    ghee_yield_grams REAL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 13. Napoje fermentowane: jogurt, kefir, maślanka (Fermented Milk Details)
CREATE TABLE IF NOT EXISTS fermented_milk_details (
    batch_id TEXT PRIMARY KEY NOT NULL,
    culture_type TEXT NOT NULL CHECK(culture_type IN ('YOGURT_THERMOPHILIC', 'KEFIR_GRAINS', 'BUTTERMILK_MESOPHILIC')),
    incubation_temp_c REAL NOT NULL,
    incubation_duration_hours REAL NOT NULL,
    target_ph REAL DEFAULT 4.5,
    strained_greek_yield_grams REAL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 14. Zamknięty obieg serwatki: Ricotta i Norweski Brunost (Whey Product Details)
CREATE TABLE IF NOT EXISTS whey_product_details (
    batch_id TEXT PRIMARY KEY NOT NULL,
    source_batch_id TEXT,
    whey_type TEXT NOT NULL CHECK(whey_type IN ('SWEET_RENNET', 'ACID_CURD')),
    whey_volume_liters REAL NOT NULL CHECK(whey_volume_liters > 0),
    whole_milk_added_liters REAL DEFAULT 0.0,
    cream_added_liters REAL DEFAULT 0.0,
    heating_temp_c REAL NOT NULL,
    product_type TEXT NOT NULL CHECK(product_type IN ('RICOTTA', 'BRUNOST_MYSOST')),
    final_yield_grams REAL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 15. Inwentarz spiżarni serowarskiej (Pantry Inventory)
CREATE TABLE IF NOT EXISTS pantry_inventory (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('MILK', 'CREAM', 'CULTURE', 'RENNET', 'SALT', 'MINERAL', 'HERB')),
    quantity_available REAL NOT NULL CHECK(quantity_available >= 0),
    unit TEXT NOT NULL,
    imcu_or_concentration TEXT,
    expiry_date INTEGER,
    cost_per_unit_pln REAL
);

-- 16. Oceny sensoryczne i Radar Smaku (Sensory Evaluations)
CREATE TABLE IF NOT EXISTS sensory_evaluations (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL,
    evaluated_at INTEGER NOT NULL,
    acidity INTEGER CHECK(acidity BETWEEN 1 AND 10),
    salinity INTEGER CHECK(salinity BETWEEN 1 AND 10),
    firmness INTEGER CHECK(firmness BETWEEN 1 AND 10),
    creaminess INTEGER CHECK(creaminess BETWEEN 1 AND 10),
    pungency INTEGER CHECK(pungency BETWEEN 1 AND 10),
    nuttiness INTEGER CHECK(nuttiness BETWEEN 1 AND 10),
    overall_score REAL,
    grade TEXT,
    flaws_identified TEXT,
    tasting_notes TEXT,
    notes TEXT,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- 17. Ustawienia aplikacji i parametry lokalne (App Settings)
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);

-- 18. Dostęp aplikacji i subskrypcje StoreKit 2 (App Access)
CREATE TABLE IF NOT EXISTS app_access (
    id TEXT PRIMARY KEY NOT NULL DEFAULT 'current_user',
    trial_started_at INTEGER NOT NULL,
    trial_days INTEGER NOT NULL DEFAULT 14,
    subscription_tier TEXT NOT NULL DEFAULT 'none' CHECK(subscription_tier IN ('none', 'monthly', 'yearly', 'lifetime')),
    subscription_expires_at INTEGER,
    completed_batches_count INTEGER NOT NULL DEFAULT 0,
    purchased_receipt_tier TEXT
);

-- 19. Asynchroniczna kolejka zdarzeń outbox dla peryferiów i zegarka (Pending Ops)
CREATE TABLE IF NOT EXISTS pending_ops (
    id TEXT PRIMARY KEY NOT NULL,
    op_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PROCESSED', 'FAILED'))
);

-- ============================================================================
-- INDEKSY B-TREE POD ZAPYTANIA O CZASIE < 5ms
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_batches_category_status ON batches(category, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pressing_stages_batch ON pressing_stages(batch_id, stage_order ASC);
CREATE INDEX IF NOT EXISTS idx_cave_wheels_status ON cave_cheese_wheels(status, last_turned_at ASC);
CREATE INDEX IF NOT EXISTS idx_cave_actions_wheel ON cave_action_logs(wheel_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_wheel_weights_wheel ON wheel_weight_logs(wheel_id, logged_at ASC);
CREATE INDEX IF NOT EXISTS idx_cave_env_timestamp ON cave_environment_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pantry_category ON pantry_inventory(category, quantity_available);
CREATE INDEX IF NOT EXISTS idx_sensory_batch ON sensory_evaluations(batch_id);
CREATE INDEX IF NOT EXISTS idx_pending_ops_status ON pending_ops(status, created_at ASC);

-- ============================================================================
-- WYZWALACZE (TRIGGERS) DLA INTEGRALNOŚCI DANYCH
-- ============================================================================
CREATE TRIGGER IF NOT EXISTS trigger_batches_updated_at
AFTER UPDATE ON batches
BEGIN
    UPDATE batches SET updated_at = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
END;
