// ============================================================================
// Apps4Brew Studio — FERMENT Data Model & Database Schemas
// ============================================================================

export type BatchCategory = 'CHEESE' | 'VEG_FERMENT' | 'KIMCHI' | 'KOMBUCHA' | 'VINEGAR';

export type BatchStatus =
  | 'PREPARING'
  | 'COAGULATING'
  | 'PRESSING'
  | 'BRINING'
  | 'AGING'
  | 'COMPLETED'
  | 'DISCARDED';

export type MilkType = 'COW' | 'GOAT' | 'SHEEP' | 'BUFFALO' | 'MIXED';

export type MilkTreatment = 'RAW' | 'PASTEURIZED_LOW' | 'STORE_MICROFILTERED';

export type RindType =
  | 'NATURAL'
  | 'SMEAR_BREVI'
  | 'BLOOMY_WHITE'
  | 'BLUE_MOLD'
  | 'WAXED'
  | 'OILED';

export type SensorSource = 'MANUAL' | 'RUUVI_BLE' | 'MIJIA_BLE';

export type SaltingMethod = 'TOTAL_MASS_BRINE' | 'DRY_SALTING_CABBAGE' | 'LIQUID_BRINE';

export type BeveragePhase = '1F_AEROBIC' | '2F_BOTTLE_PRESSURE' | 'ACETIC_OXIDATION';

export type PantryCategory = 'MILK' | 'CULTURE' | 'RENNET' | 'SALT' | 'MINERAL' | 'TEA' | 'SUGAR';

export type SubscriptionTier = 'none' | 'monthly' | 'yearly' | 'lifetime';

export interface Batch {
  id: string;
  batchNumber: string;
  category: BatchCategory;
  styleName: string;
  createdAt: number;
  status: BatchStatus;
  notes?: string;
}

export interface CheeseBatchDetails {
  batchId: string;
  milkType: MilkType;
  milkTreatment: MilkTreatment;
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

export interface PressingStage {
  id: string;
  batchId: string;
  stageOrder: number;
  targetPressureKgCm2: number;
  weightAppliedKg: number;
  durationMinutes: number;
  turnedAndFlipped: boolean;
  completedAt?: number;
}

export interface BriningLog {
  batchId: string;
  brineSalinityPct: number;
  brinePh: number;
  cacl2InBrinePct: number;
  startedAt: number;
  plannedDurationHours: number;
  turnedInBrine: boolean;
  completedAt?: number;
}

export interface CaveCheeseWheel {
  id: string;
  batchId: string;
  wheelTag: string;
  locationInCave: string;
  initialWeightGrams: number;
  currentWeightGrams: number;
  rindType: RindType;
  targetAgingDays: number;
  lastTurnedAt?: number;
  lastWashedAt?: number;
  lastBrushedAt?: number;
  piercedForBlueAt?: number;
  shrinkagePct: number;
}

export interface CaveEnvironmentLog {
  id: string;
  timestamp: number;
  temperatureC: number;
  humidityRhPct: number;
  dewPointC: number;
  sensorSource: SensorSource;
}

export interface VegFermentDetails {
  batchId: string;
  vegetablesWeightGrams: number;
  waterWeightGrams: number;
  totalBatchWeightGrams: number;
  saltTargetPct: number;
  saltAddedGrams: number;
  saltingMethod: SaltingMethod;
  initialPh?: number;
  currentPh?: number;
  botulinumSafe: boolean;
}

export interface SymbioticBeverageDetails {
  batchId: string;
  teaType?: string;
  teaGrams?: number;
  sugarGrams?: number;
  waterLiters?: number;
  starterLiquidMl?: number;
  scobyTag?: string;
  phase: BeveragePhase;
  estimatedAbvPct?: number;
  estimatedCo2Volumes?: number;
  targetAceticAcidPct?: number;
}

export interface PantryItem {
  id: string;
  itemName: string;
  category: PantryCategory;
  quantityAvailable: number;
  unit: string;
  imcuOrConcentration?: string;
  expiryDate?: number;
  costPerUnitPln?: number;
}

export interface SensoryEvaluation {
  id: string;
  batchId: string;
  evaluatedAt: number;
  acidity: number; // 1-10
  salinity: number; // 1-10
  firmness: number; // 1-10
  creaminess: number; // 1-10
  pungency: number; // 1-10
  nuttiness: number; // 1-10
  tastingNotes?: string;
}

export interface StoredAppAccess {
  id: string;
  trialStartedAt: number;
  trialDays: number;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: number | null;
  completedBatchesCount: number;
  purchasedReceiptTier?: SubscriptionTier;
}

export interface AppSetting {
  key: string;
  value: string;
}
