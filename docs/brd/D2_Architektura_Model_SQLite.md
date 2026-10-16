# **FERMENT BRD 0.1 — Rozdziały 11–12: Architektura Techniczna i Model Relacyjny SQLite (D2)**

> **Architektura:** Expo / React Native, TypeScript Strict Mode, SQLite w trybie WAL  
> **Bezpieczna ścieżka:** `/Library/Application Support/SQLite/ferment.db`  
> **Rotacja kopii:** Automatyczny silnik 10 rotacyjnych kopii JSON (`autoBackup`)

---

## **1. Schemat Bazy Danych DDL (18 Tabel Relacyjnych w SQLite)**

```sql
-- 1. Tabela partii serowarskich i fermentacyjnych
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('CHEESE', 'VEG_FERMENT', 'KIMCHI', 'KOMBUCHA', 'VINEGAR')),
    style_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
    notes TEXT
);

-- 2. Parametry wsadu serowarskiego
CREATE TABLE IF NOT EXISTS cheese_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    milk_type TEXT NOT NULL CHECK(milk_type IN ('COW', 'GOAT', 'SHEEP', 'BUFFALO', 'MIXED')),
    milk_treatment TEXT NOT NULL CHECK(milk_treatment IN ('RAW', 'PASTEURIZED_LOW', 'STORE_MICROFILTERED')),
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

-- 3. Harmonogram i log prasowania sera
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

-- 4. Kąpiel solankowa krążka
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

-- 5. Kartoteka Cave Log (Dojrzewalnia sera / Affinage)
CREATE TABLE IF NOT EXISTS cave_cheese_wheels (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    wheel_tag TEXT UNIQUE NOT NULL,
    location_in_cave TEXT NOT NULL,
    initial_weight_grams REAL NOT NULL,
    current_weight_grams REAL NOT NULL,
    rind_type TEXT NOT NULL CHECK(rind_type IN ('NATURAL', 'SMEAR_BREVI', 'BLOOMY_WHITE', 'BLUE_MOLD', 'WAXED', 'OILED')),
    target_aging_days INTEGER NOT NULL,
    last_turned_at INTEGER,
    last_washed_at INTEGER,
    last_brushed_at INTEGER,
    pierced_for_blue_at INTEGER,
    shrinkage_pct REAL DEFAULT 0.0
);

-- 6. Pomiary środowiskowe w komorze dojrzewalniczej (Cave Logs)
CREATE TABLE IF NOT EXISTS cave_environment_logs (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    temperature_c REAL NOT NULL,
    humidity_rh_pct REAL NOT NULL,
    dew_point_c REAL NOT NULL,
    sensor_source TEXT NOT NULL CHECK(sensor_source IN ('MANUAL', 'RUUVI_BLE', 'MIJIA_BLE'))
);

-- 7. Nastawy kiszonek warzywnych i kimchi
CREATE TABLE IF NOT EXISTS veg_ferment_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    vegetables_weight_grams REAL NOT NULL,
    water_weight_grams REAL NOT NULL,
    total_batch_weight_grams REAL NOT NULL,
    salt_target_pct REAL NOT NULL,
    salt_added_grams REAL NOT NULL,
    salting_method TEXT NOT NULL CHECK(salting_method IN ('TOTAL_MASS_BRINE', 'DRY_SALTING_CABBAGE', 'LIQUID_BRINE')),
    initial_ph REAL,
    current_ph REAL,
    botulinum_safe INTEGER DEFAULT 0
);

-- 8. Nastawy kombuchy i octów
CREATE TABLE IF NOT EXISTS symbiotic_beverage_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    tea_type TEXT,
    tea_grams REAL,
    sugar_grams REAL,
    water_liters REAL,
    starter_liquid_ml REAL,
    scoby_tag TEXT,
    phase TEXT NOT NULL CHECK(phase IN ('1F_AEROBIC', '2F_BOTTLE_PRESSURE', 'ACETIC_OXIDATION')),
    estimated_abv_pct REAL,
    estimated_co2_volumes REAL,
    target_acetic_acid_pct REAL
);

-- 9. Spiżarnia i inwentarz surowców
CREATE TABLE IF NOT EXISTS pantry_inventory (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('MILK', 'CULTURE', 'RENNET', 'SALT', 'MINERAL', 'TEA', 'SUGAR')),
    quantity_available REAL NOT NULL,
    unit TEXT NOT NULL,
    imcu_or_concentration TEXT,
    expiry_date INTEGER,
    cost_per_unit_pln REAL
);

-- 10. Oceny sensoryczne (Radar Smaku)
CREATE TABLE IF NOT EXISTS sensory_evaluations (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    evaluated_at INTEGER NOT NULL,
    acidity INTEGER CHECK(acidity BETWEEN 1 AND 10),
    salinity INTEGER CHECK(salinity BETWEEN 1 AND 10),
    firmness INTEGER CHECK(firmness BETWEEN 1 AND 10),
    creaminess INTEGER CHECK(creaminess BETWEEN 1 AND 10),
    pungency INTEGER CHECK(pungency BETWEEN 1 AND 10),
    nuttiness INTEGER CHECK(nuttiness BETWEEN 1 AND 10),
    tasting_notes TEXT
);
```

---

## **2. Silnik Kopii Zapasowej (10-Krotna Rotacja JSON)**
Podobnie jak we wzorcowych aplikacjach `trening` i `piekarz`, moduł `backup.ts` tworzy po każdej zakończonej sesji zrzut stanu relacyjnego do pliku JSON o formacie:
`ferment_backup_YYYY-MM-DD_HHmmss.json`.
W katalogu `/Library/Application Support/Backups/` utrzymywanych jest ściśle 10 najświeższych kopii, z automatycznym usuwaniem najstarszej.
