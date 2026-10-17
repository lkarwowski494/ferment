// ============================================================================
// SEROWAR: Rzemieślnicze Przetwórstwo Mleka (src/core/domain/types.ts)
// Czysta Warstwa Domenowa (Clean Architecture) | ZERO zależności od UI/React
// ============================================================================

export type DairyCategory =
  | 'HARD_CHEESE'
  | 'SOFT_CHEESE'
  | 'FRESH_CURD'
  | 'BUTTER_GHEE'
  | 'FERMENTED_MILK'
  | 'WHEY_PRODUCT';

export type DairyBatchStatus =
  | 'PREPARING'
  | 'COAGULATING'
  | 'PRESSING'
  | 'BRINING'
  | 'AGING'
  | 'COMPLETED'
  | 'DISCARDED';

export type MilkSpecies = 'COW' | 'GOAT' | 'SHEEP' | 'BUFFALO' | 'MIXED';

export type MilkHeatTreatment = 'RAW' | 'PASTEURIZED_LOW' | 'STORE_MICROFILTERED';

export type CheeseRindType =
  | 'NATURAL'
  | 'SMEAR_BREVI'
  | 'BLOOMY_WHITE'
  | 'BLUE_MOLD'
  | 'WAXED'
  | 'OILED';

export type CaveWheelStatus =
  | 'DRYING_AFTER_BRINE'
  | 'ACTIVE_AFFINAGE'
  | 'RIND_SEALED'
  | 'MATURED_READY'
  | 'CONSUMED'
  | 'DISCARDED';

export type CaveAction =
  | 'WEIGH'
  | 'TURN'
  | 'WASH_BRINE'
  | 'DRY_BRUSH'
  | 'WAX_COATING'
  | 'CLOTHBOUND'
  | 'PIERCE_BLUE';

export type AcidificationMethod =
  | 'NATURAL_SOURED'
  | 'MESOPHILIC_DVI'
  | 'CITRIC_ACID'
  | 'ACID_WHEY';

export type CreamType = 'SWEET' | 'CULTURED';

export type FermentedMilkCulture =
  | 'YOGURT_THERMOPHILIC'
  | 'KEFIR_GRAINS'
  | 'BUTTERMILK_MESOPHILIC';

export type WheyProductType = 'RICOTTA' | 'BRUNOST_MYSOST';

export type DairyPantryCategory =
  | 'MILK'
  | 'CREAM'
  | 'CULTURE'
  | 'RENNET'
  | 'SALT'
  | 'MINERAL'
  | 'HERB';

export type SubscriptionTier = 'none' | 'monthly' | 'yearly' | 'lifetime';

export interface DairyBatchEntity {
  id: string;
  batchNumber: string;
  category: DairyCategory;
  styleName: string;
  createdAt: number;
  status: DairyBatchStatus;
  notes?: string;
  milkVolumeLiters?: number;
  sensoryScore?: number;
  updatedAt: number;
}

export interface CheeseCoagulationParams {
  batchId: string;
  milkType: MilkSpecies;
  milkTreatment: MilkHeatTreatment;
  milkVolumeLiters: number;
  cacl2AddedGrams: number;
  rennetType: string;
  rennetImcuPerMl: number;
  rennetVolumeMl: number;
  flocculationSeconds?: number;
  flocculationMultiplier?: number;
  targetCutSeconds?: number;
  curdSizeTarget?: string;
  cookingTargetTempC?: number;
  cookingDurationMinutes?: number;
  wheyWashedLiters?: number;
}

export interface PressingStageEntity {
  id: string;
  batchId: string;
  stageOrder: number;
  targetPressureKgCm2: number;
  weightAppliedKg: number;
  durationMinutes: number;
  turnedAndFlipped: boolean;
  completedAt?: number;
}

export interface BriningLogEntity {
  batchId: string;
  brineSalinityPct: number;
  brinePh: number;
  cacl2InBrinePct: number;
  startedAt: number;
  plannedDurationHours: number;
  turnedInBrine: boolean;
  completedAt?: number;
}

export interface CaveCheeseWheelEntity {
  id: string;
  batchId: string;
  wheelTag: string;
  locationInCave: string;
  initialWeightGrams: number;
  currentWeightGrams: number;
  rindType: CheeseRindType;
  targetAgingDays: number;
  lastTurnedAt?: number;
  lastWashedAt?: number;
  lastBrushedAt?: number;
  piercedForBlueAt?: number;
  shrinkagePct: number;
  status: CaveWheelStatus;
}

export interface CaveActionLogEntity {
  id: string;
  wheelId: string;
  actionType: CaveAction;
  loggedAt: number;
  weightGrams?: number;
  shrinkagePct?: number;
  notes?: string;
}

export interface WheelWeightLogEntity {
  id: string;
  wheelId: string;
  weightGrams: number;
  shrinkagePct: number;
  loggedAt: number;
  notes?: string;
}

export interface CaveEnvironmentLogEntity {
  id: string;
  timestamp: number;
  temperatureC: number;
  humidityRhPct: number;
  dewPointC: number;
  sensorSource: 'MANUAL' | 'RUUVI_BLE' | 'MIJIA_BLE';
}

export interface CurdBatchEntity {
  batchId: string;
  acidificationMethod: AcidificationMethod;
  milkVolumeLiters: number;
  measuredPh?: number;
  heatingTempC: number;
  drainDurationMinutes: number;
  pressedWeightKg?: number;
  finalCurdWeightGrams?: number;
}

export interface ButterChurnEntity {
  batchId: string;
  creamFatPct: number;
  creamVolumeLiters: number;
  creamTemperatureC: number;
  creamType: CreamType;
  churnDurationMinutes?: number;
  washCyclesCount: number;
  butterYieldGrams?: number;
  buttermilkYieldMl?: number;
  gheeYieldGrams?: number;
}

export interface FermentedMilkEntity {
  batchId: string;
  cultureType: FermentedMilkCulture;
  incubationTempC: number;
  incubationDurationHours: number;
  targetPh: number;
  strainedGreekYieldGrams?: number;
}

export interface WheyProductEntity {
  batchId: string;
  sourceBatchId?: string;
  wheyType: 'SWEET_RENNET' | 'ACID_CURD';
  wheyVolumeLiters: number;
  wholeMilkAddedLiters: number;
  creamAddedLiters: number;
  heatingTempC: number;
  productType: WheyProductType;
  finalYieldGrams?: number;
}

export interface DairyPantryItemEntity {
  id: string;
  itemName: string;
  category: DairyPantryCategory;
  quantityAvailable: number;
  unit: string;
  imcuOrConcentration?: string;
  expiryDate?: number;
  costPerUnitPln?: number;
}

export interface SensoryEvaluationEntity {
  id: string;
  batchId: string;
  evaluatedAt: number;
  acidity: number; // 1-10
  salinity: number; // 1-10
  firmness: number; // 1-10
  creaminess: number; // 1-10
  pungency: number; // 1-10
  nuttiness: number; // 1-10
  overallScore?: number;
  grade?: string;
  flawsIdentified?: string;
  tastingNotes?: string;
  notes?: string;
}
