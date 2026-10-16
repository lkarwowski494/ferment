// ============================================================================
// Apps4Brew Studio — FERMENT Curd Washing, Delactosing & Cheddar Salting
// Thermal mass balancing, curd delactosing, direct milled salting & wax coverage
// ============================================================================

export interface CurdWashCalculationParams {
  milkVolumeLiters: number;
  initialCurdTempC: number;
  wheyDrainedLiters: number;
  hotWaterTempC: number;
  targetCookingTempC: number;
  cultureType?: 'MESOPHILIC' | 'THERMOPHILIC' | 'MIXED';
}

export interface CurdWashResult {
  waterVolumeLiters: number;
  delactosingRatioPct: number;
  finalVatVolumeLiters: number;
  isSafeForBacteria: boolean;
  warnings: string[];
  techniqueRecommendation: string;
}

export interface CurdMillingSaltingParams {
  curdWeightGrams: number;
  targetSalinityPct?: number; // e.g. 2.0%
  wheyRunoffLossPct?: number; // e.g. 33% typical press runoff loss
}

export interface CurdMillingSaltingResult {
  curdWeightGrams: number;
  targetSalinityPct: number;
  netSaltRetainedGrams: number;
  totalSaltToApplyGrams: number;
  additions: { step: number; grams: number; instruction: string }[];
  notes: string;
}

export interface WheelCoatingParams {
  diameterCm: number;
  heightCm: number;
  coatingType: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE';
  layersCount?: number;
}

export interface WheelCoatingResult {
  surfaceAreaCm2: number;
  coatingType: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE';
  layersCount: number;
  totalGramsNeeded: number;
  recommendation: string;
}

/**
 * Calculates hot water volume needed to wash curd (delactosing) and raise vat temp
 * Thermal equilibrium formula: M_rem * (T_target - T_curd) = V_water * (T_hot - T_target)
 */
export function calculateCurdWashWater(params: CurdWashCalculationParams): CurdWashResult {
  const {
    milkVolumeLiters,
    initialCurdTempC,
    wheyDrainedLiters,
    hotWaterTempC,
    targetCookingTempC,
    cultureType = 'MESOPHILIC',
  } = params;

  if (milkVolumeLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');
  if (wheyDrainedLiters <= 0 || wheyDrainedLiters >= milkVolumeLiters) {
    throw new Error('Objętość odlanej serwatki musi być dodatnia i mniejsza od objętości mleka.');
  }
  if (hotWaterTempC <= targetCookingTempC) {
    throw new Error('Temperatura dolewanej wody musi być wyższa niż temperatura docelowa.');
  }
  if (targetCookingTempC <= initialCurdTempC) {
    throw new Error('Temperatura docelowa musi być wyższa niż początkowa temperatura ziarna.');
  }

  const remainingMass = milkVolumeLiters - wheyDrainedLiters;
  const deltaT1 = targetCookingTempC - initialCurdTempC;
  const deltaT2 = hotWaterTempC - targetCookingTempC;

  const waterVolumeLiters = Math.round(((remainingMass * deltaT1) / deltaT2) * 100) / 100;
  const delactosingRatioPct = Math.round((wheyDrainedLiters / milkVolumeLiters) * 1000) / 10;
  const finalVatVolumeLiters = Math.round((remainingMass + waterVolumeLiters) * 100) / 100;

  const warnings: string[] = [];
  let isSafeForBacteria = true;

  if (hotWaterTempC > 65) {
    warnings.push(
      'Wysoka temperatura wody (>65°C). Wlewaj powoli cienkim strumieniem po ściance kotła przy ciągłym mieszaniu, aby uniknąć zacięcia termicznego ziaren.'
    );
  }

  if (targetCookingTempC > 39 && cultureType === 'MESOPHILIC') {
    isSafeForBacteria = false;
    warnings.push(
      'Zagrożenie termiczne! Bakterie mezofilne (Lactococcus lactis) ulegają szokowi i inaktywacji w temperaturach powyżej 39–40°C. Obniż docelową temperaturę dogrzewania.'
    );
  }

  let techniqueRecommendation = '';
  if (delactosingRatioPct >= 40) {
    techniqueRecommendation =
      'Głębokie przemywanie ziarna (styl skandynawski / Havarti): bardzo łagodny, maślany smak i wysoka elastyczność miąższu.';
  } else if (delactosingRatioPct >= 25) {
    techniqueRecommendation =
      'Klasyczne przemywanie Gouda/Edam (25–35%): zrównoważony profil, ograniczone nagromadzenie kwasu mlekowego i słodki finisz.';
  } else {
    techniqueRecommendation =
      'Lekkie dogrzewanie z małym przemyciem (<25%): zachowuje wyższą kwasowość i wyrazisty aromat dojrzewania.';
  }

  return {
    waterVolumeLiters,
    delactosingRatioPct,
    finalVatVolumeLiters,
    isSafeForBacteria,
    warnings,
    techniqueRecommendation,
  };
}

/**
 * Calculates direct dry salting of milled curd (Cheddar / Caerphilly)
 * Accounts for salt loss in press whey runoff (typically 30–35%)
 */
export function calculateCurdMillingSalting(params: CurdMillingSaltingParams): CurdMillingSaltingResult {
  const { curdWeightGrams, targetSalinityPct = 2.0, wheyRunoffLossPct = 33.0 } = params;

  if (curdWeightGrams <= 0) throw new Error('Waga ziarna musi być większa od zera.');
  if (targetSalinityPct <= 0 || targetSalinityPct > 5.0) {
    throw new Error('Docelowa słoność sera musi mieścić się w zakresie 0.5% – 5.0%.');
  }
  if (wheyRunoffLossPct < 0 || wheyRunoffLossPct >= 90) {
    throw new Error('Procent strat w serwatce musi mieścić się w zakresie 0% – 90%.');
  }

  const netSaltRetainedGrams = Math.round((curdWeightGrams * (targetSalinityPct / 100)) * 10) / 10;
  const retentionFraction = 1 - (wheyRunoffLossPct / 100);
  const totalSaltToApplyGrams = Math.round((netSaltRetainedGrams / retentionFraction) * 10) / 10;

  const step1Grams = Math.round((totalSaltToApplyGrams / 3) * 10) / 10;
  const step2Grams = step1Grams;
  const step3Grams = Math.round((totalSaltToApplyGrams - step1Grams - step2Grams) * 10) / 10;

  const additions = [
    {
      step: 1,
      grams: step1Grams,
      instruction: 'Posyp pocięte ziarno 1/3 dawki soli. Mieszaj dłońmi przez 3 minuty, po czym odczekaj 5 minut na pierwsze wyciągnięcie wilgoci.',
    },
    {
      step: 2,
      grams: step2Grams,
      instruction: 'Dodaj drugą porcję soli. Ziarno stanie się wilgotne i błyszczące. Mieszaj powoli przez 3 minuty i odczekaj kolejne 5 minut.',
    },
    {
      step: 3,
      grams: step3Grams,
      instruction: 'Wsyp ostatnią partię soli, wymieszaj do wchłonięcia i natychmiast przekładaj do formy wyłożonej chustą serowarską.',
    },
  ];

  return {
    curdWeightGrams,
    targetSalinityPct,
    netSaltRetainedGrams,
    totalSaltToApplyGrams,
    additions,
    notes: `Solenie bezpośrednie ziarna Cheddar: Zastosowano naddatek ${wheyRunoffLossPct}% na odciek serwatki pod prasą.`,
  };
}

/**
 * Calculates surface area and required coating material (wax or polyvinyl)
 */
export function calculateWheelCoating(params: WheelCoatingParams): WheelCoatingResult {
  const { diameterCm, heightCm, coatingType, layersCount = 2 } = params;

  if (diameterCm <= 0 || heightCm <= 0) {
    throw new Error('Wymiary krążka muszą być większe od zera.');
  }
  if (layersCount <= 0) {
    throw new Error('Liczba warstw musi być większa od zera.');
  }

  const radius = diameterCm / 2;
  // Total cylinder surface area = 2 * PI * r^2 + 2 * PI * r * h
  const baseArea = Math.PI * Math.pow(radius, 2);
  const lateralArea = 2 * Math.PI * radius * heightCm;
  const surfaceAreaCm2 = Math.round((2 * baseArea + lateralArea) * 10) / 10;

  // Consumption factors: Wax ~0.075 g/cm2/coat, Polyvinyl ~0.040 g/cm2/coat
  const factor = coatingType === 'CHEESE_WAX' ? 0.075 : 0.040;
  const totalGramsNeeded = Math.round(surfaceAreaCm2 * factor * layersCount);

  let recommendation = '';
  if (coatingType === 'CHEESE_WAX') {
    recommendation =
      'Wosk serowarski: Zanurzaj najpierw jedną połowę krążka w roztopionym wosku (65–75°C) na 3 sekundy, odczekaj 30 sekund i zanurz drugą połowę. Zapewnia pełną barierę wilgoci (0% ubytku).';
  } else {
    recommendation =
      'Powłoka polioctanowa z natamycyną: Nanoś pędzlem lub gąbką cienką równomierną warstwę. Przepuszcza parę wodną (pozwala na kontrolowany ubytek wagi), jednocześnie blokując rozwój pleśni i drożdży.';
  }

  return {
    surfaceAreaCm2,
    coatingType,
    layersCount,
    totalGramsNeeded,
    recommendation,
  };
}
