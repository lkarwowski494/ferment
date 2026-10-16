// ============================================================================
// Apps4Brew Studio — FERMENT Cheese Composition & Codex Alimentarius Engine
// Moisture on Fat-Free Basis (MFFB), Fat in Dry Matter (FDM) & Salt-in-Moisture (S/M)
// Standard: CODEX STAN 283-1978 & International Dairy Federation (IDF)
// ============================================================================

export type CodexFirmnessClass = 'EXTRA_HARD' | 'HARD' | 'SEMI_HARD' | 'SEMI_SOFT' | 'SOFT';
export type CodexFatClass = 'HIGH_FAT' | 'FULL_FAT' | 'MEDIUM_FAT' | 'LOW_FAT' | 'SKIM';
export type SaltMoistureStatus = 'UNDER_SALTED_ACIDIC' | 'OPTIMAL_BALANCED' | 'OVER_SALTED_INHIBITED';

export interface CheeseCompositionInput {
  moisturePercentage: number;   // Total water content in cheese (e.g. 42% for young Gouda)
  fatPercentage: number;        // Total fat in cheese (e.g. 28%)
  saltPercentage: number;       // Salt (NaCl) content in cheese (e.g. 1.8% to 2.2%)
}

export interface CurdMoistureEstimateInput {
  milkVolumeLiters: number;
  milkFatPct: number;           // e.g. 3.8%
  milkProteinPct: number;       // e.g. 3.2%
  curdCutSize: 'RICE_GRAIN' | 'PEA_LENTIL' | 'HAZELNUT' | 'WALNUT_LARGE';
  pressDurationHours: number;
  cookingFinalTempC: number;
}

export interface CheeseCompositionResult {
  moisturePercentage: number;
  fatPercentage: number;
  saltPercentage: number;
  dryMatterPercentage: number;

  // Codex Alimentarius classification
  mffbPercentage: number;       // Moisture on a Fat-Free Basis %
  firmnessClass: CodexFirmnessClass;
  firmnessLabelPl: string;

  fdmPercentage: number;        // Fat in Dry Matter %
  fatClass: CodexFatClass;
  fatLabelPl: string;

  // Salt-in-Moisture biochemistry
  saltInMoisturePercentage: number; // S/M %
  smStatus: SaltMoistureStatus;
  smMessagePl: string;
  isRiskOfBitterness: boolean;  // S/M < 4.0%
  isRiskOfStalledAging: boolean;// S/M > 6.0%

  recommendations: string[];
}

export interface YieldEstimateResult {
  expectedFreshCurdKg: number;
  expectedAgedCheeseKg: number;
  estimatedMoisturePct: number;
  estimatedFatPct: number;
  suggestedAffinageDays: number;
}

/**
 * Calculates Codex Alimentarius MFFB, FDM and Salt-in-Moisture biochemical invariants
 */
export function calculateCheeseComposition(input: CheeseCompositionInput): CheeseCompositionResult {
  const { moisturePercentage, fatPercentage, saltPercentage } = input;

  if (moisturePercentage <= 0 || moisturePercentage >= 100) {
    throw new Error('Wilgotność sera musi mieścić się w przedziale (0, 100)%.');
  }
  if (fatPercentage < 0 || fatPercentage >= 100) {
    throw new Error('Zawartość tłuszczu musi być dodatnia i mniejsza od 100%.');
  }
  if (saltPercentage < 0 || saltPercentage > 15) {
    throw new Error('Zawartość soli musi mieścić się w przedziale [0, 15]%.');
  }
  if (moisturePercentage + fatPercentage >= 100) {
    throw new Error('Suma wilgotności i tłuszczu nie może przekraczać 100%.');
  }

  const dryMatterPercentage = Math.round((100 - moisturePercentage) * 100) / 100;

  // 1. MFFB (Moisture on a Fat-Free Basis)
  // MFFB = (Moisture / (100 - Fat)) * 100
  const mffbRaw = (moisturePercentage / (100 - fatPercentage)) * 100;
  const mffbPercentage = Math.round(mffbRaw * 10) / 10;

  let firmnessClass: CodexFirmnessClass;
  let firmnessLabelPl: string;

  if (mffbPercentage < 51.0) {
    firmnessClass = 'EXTRA_HARD';
    firmnessLabelPl = 'Ekstra Twardy (Parmezan / Grana / Sbrinz)';
  } else if (mffbPercentage <= 56.0) {
    firmnessClass = 'HARD';
    firmnessLabelPl = 'Twardy (Cheddar / Dojrzała Gouda / Emmentaler)';
  } else if (mffbPercentage <= 63.0) {
    firmnessClass = 'SEMI_HARD';
    firmnessLabelPl = 'Półtwardy (Młoda Gouda / Edam / Tilsit)';
  } else if (mffbPercentage <= 69.0) {
    firmnessClass = 'SEMI_SOFT';
    firmnessLabelPl = 'Półmiękki (Koryciński / Havarti / Butterkäse)';
  } else {
    firmnessClass = 'SOFT';
    firmnessLabelPl = 'Miękki (Feta / Camembert / Twaróg / Ricotta)';
  }

  // 2. FDM (Fat in Dry Matter)
  // FDM = (Fat / DryMatter) * 100
  const fdmRaw = (fatPercentage / dryMatterPercentage) * 100;
  const fdmPercentage = Math.round(fdmRaw * 10) / 10;

  let fatClass: CodexFatClass;
  let fatLabelPl: string;

  if (fdmPercentage >= 60.0) {
    fatClass = 'HIGH_FAT';
    fatLabelPl = 'Wysokotłusty (Podwójnie kremowy >=60% FDM)';
  } else if (fdmPercentage >= 45.0) {
    fatClass = 'FULL_FAT';
    fatLabelPl = 'Pełnotłusty (45-60% FDM)';
  } else if (fdmPercentage >= 25.0) {
    fatClass = 'MEDIUM_FAT';
    fatLabelPl = 'Półtłusty (25-45% FDM)';
  } else if (fdmPercentage >= 10.0) {
    fatClass = 'LOW_FAT';
    fatLabelPl = 'Niskotłusty (10-25% FDM)';
  } else {
    fatClass = 'SKIM';
    fatLabelPl = 'Odtłuszczony (<10% FDM)';
  }

  // 3. Salt-in-Moisture (S/M)
  // S/M = (Salt / Moisture) * 100
  const smRaw = (saltPercentage / moisturePercentage) * 100;
  const saltInMoisturePercentage = Math.round(smRaw * 10) / 10;

  let smStatus: SaltMoistureStatus;
  let smMessagePl: string;
  let isRiskOfBitterness = false;
  let isRiskOfStalledAging = false;
  const recommendations: string[] = [];

  if (saltInMoisturePercentage < 4.0) {
    smStatus = 'UNDER_SALTED_ACIDIC';
    isRiskOfBitterness = true;
    smMessagePl = `Za niska koncentracja soli w fazie wodnej (${saltInMoisturePercentage}% S/M). Ryzyko ucieczki kwasowości i rozwoju goryczki.`;
    recommendations.push('Wydłuż czas solanki o 15–20% lub zwiększ stężenie solanki.');
    recommendations.push('Niskie S/M sprzyja nadmiernej aktywności enzymów chymozyny i powstawaniu gorzkich hydrofobowych peptydów.');
  } else if (saltInMoisturePercentage > 6.0) {
    smStatus = 'OVER_SALTED_INHIBITED';
    isRiskOfStalledAging = true;
    smMessagePl = `Zbyt wysoka koncentracja soli w fazie wodnej (${saltInMoisturePercentage}% S/M). Ryzyko zatrzymania dojrzewania i kruchej struktury.`;
    recommendations.push('Zmniejsz czas kąpieli solankowej.');
    recommendations.push('Wysokie S/M hamuje enzymy proteolityczne i bakterie starterowe, blokując rozwój bukietu smakowego.');
  } else {
    smStatus = 'OPTIMAL_BALANCED';
    smMessagePl = `Optymalna równowaga biochemiczna soli (${saltInMoisturePercentage}% S/M). Idealne warunki do harmonijnego affinage.`;
    recommendations.push('Idealny stosunek S/M w normie rzemieślniczej (4.0–6.0%).');
  }

  return {
    moisturePercentage,
    fatPercentage,
    saltPercentage,
    dryMatterPercentage,
    mffbPercentage,
    firmnessClass,
    firmnessLabelPl,
    fdmPercentage,
    fatClass,
    fatLabelPl,
    saltInMoisturePercentage,
    smStatus,
    smMessagePl,
    isRiskOfBitterness,
    isRiskOfStalledAging,
    recommendations,
  };
}

/**
 * Estimates curd moisture, yield and aging duration from raw processing parameters
 */
export function estimateCurdMoistureAndYield(input: CurdMoistureEstimateInput): YieldEstimateResult {
  const {
    milkVolumeLiters,
    milkFatPct,
    milkProteinPct,
    curdCutSize,
    pressDurationHours,
    cookingFinalTempC,
  } = input;

  if (milkVolumeLiters <= 0) {
    throw new Error('Objętość mleka musi być większa od zera.');
  }

  // Base theoretical yield via Van Slyke & Price equation approximation
  // Yield % ~ ((0.93 * Fat) + (Protein - 0.1) * 1.09) * 1.09 / (1 - Moisture)
  let baseCutMoisture: number;
  let cutAffinageDays: number;

  switch (curdCutSize) {
    case 'RICE_GRAIN': // Hard / Extra-hard styles (Parmesan, Pecorino)
      baseCutMoisture = 38.0;
      cutAffinageDays = 180;
      break;
    case 'PEA_LENTIL': // Semi-hard / Hard (Gouda, Cheddar)
      baseCutMoisture = 44.0;
      cutAffinageDays = 60;
      break;
    case 'HAZELNUT': // Semi-soft (Koryciński, Tilsit)
      baseCutMoisture = 50.0;
      cutAffinageDays = 21;
      break;
    case 'WALNUT_LARGE': // Soft / fresh (Feta, Camembert)
      baseCutMoisture = 58.0;
      cutAffinageDays = 14;
      break;
  }

  // Temperature cooking correction: higher cooking temp expels more whey
  const tempExcess = Math.max(0, cookingFinalTempC - 32);
  const moistureAfterCooking = Math.max(30, baseCutMoisture - tempExcess * 0.4);

  // Press duration correction
  const pressHours = Math.max(0, pressDurationHours);
  const moistureAfterPress = Math.max(28, moistureAfterCooking - Math.min(6, pressHours * 0.5));

  const estimatedMoisturePct = Math.round(moistureAfterPress * 10) / 10;
  const estimatedFatPct = Math.round((milkFatPct * 0.88 * (100 / (100 - estimatedMoisturePct)) * 0.4) * 10) / 10;

  // Van Slyke yield factor
  const totalSolidsFactor = (milkFatPct * 0.90 + milkProteinPct * 0.82) * 1.25;
  const yieldPct = totalSolidsFactor / (1 - estimatedMoisturePct / 100);
  const freshCurdKg = Math.round((milkVolumeLiters * (yieldPct / 100)) * 100) / 100;

  // Affinage shrinkage: typically 12-18% weight loss
  const shrinkagePct = Math.min(22, 10 + (estimatedMoisturePct - 35) * 0.35);
  const agedCheeseKg = Math.round((freshCurdKg * (1 - shrinkagePct / 100)) * 100) / 100;

  return {
    expectedFreshCurdKg: freshCurdKg,
    expectedAgedCheeseKg: agedCheeseKg,
    estimatedMoisturePct,
    estimatedFatPct,
    suggestedAffinageDays: cutAffinageDays,
  };
}
