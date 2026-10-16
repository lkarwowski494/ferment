// ============================================================================
// Apps4Brew Studio — FERMENT Pasteurization Units (PU) & Thermal Stabilization
// Bigelow model, thermal death time (TDT), yeast/LAB inactivation, and sensory guard
// ============================================================================

export type PasteurizationTargetCategory =
  | 'KOMBUCHA_STABILIZATION' // Stabilizacja słodzonej kombuchy (15-25 PU)
  | 'LIVING_VINEGAR_PRESERVATION' // Stabilizacja octu owocowego (20-30 PU)
  | 'FERMENTED_HOT_SAUCE' // Kiszone sosy chili / sriracha (50-100 PU)
  | 'CRISP_PICKLE_JAR'; // Słoiki z kiszonkami (100-200 PU)

export interface TargetCategoryMeta {
  category: PasteurizationTargetCategory;
  namePl: string;
  targetPuMin: number;
  targetPuMax: number;
  referenceTempC: number;
  zValueCelsius: number;
  maxSensorySafeTempC: number;
  targetOrganisms: string[];
  descriptionPl: string;
}

export const PASTEURIZATION_TARGETS: Record<PasteurizationTargetCategory, TargetCategoryMeta> = {
  KOMBUCHA_STABILIZATION: {
    category: 'KOMBUCHA_STABILIZATION',
    namePl: 'Stabilizacja kombuchy owocowej (Stop refermentacji 2F)',
    targetPuMin: 15,
    targetPuMax: 25,
    referenceTempC: 60.0,
    zValueCelsius: 7.0,
    maxSensorySafeTempC: 68.0,
    targetOrganisms: ['Saccharomyces cerevisiae', 'Brettanomyces', 'Zygosaccharomyces'],
    descriptionPl: 'Dezaktywacja drożdży w dosłodzonej kombusze zapobiegająca eksplozji butelek swing-top.',
  },
  LIVING_VINEGAR_PRESERVATION: {
    category: 'LIVING_VINEGAR_PRESERVATION',
    namePl: 'Utrwalenie octu owocowego (Ochrona matki octowej przed zmętnieniem)',
    targetPuMin: 20,
    targetPuMax: 30,
    referenceTempC: 60.0,
    zValueCelsius: 6.0,
    maxSensorySafeTempC: 70.0,
    targetOrganisms: ['Acetobacter aceti', 'Komagataeibacter', 'Dzikie drożdże'],
    descriptionPl: 'Zatrzymanie ciągłego narastania błonki matki octowej w zabutelkowanym occie.',
  },
  FERMENTED_HOT_SAUCE: {
    category: 'FERMENTED_HOT_SAUCE',
    namePl: 'Pasteryzacja sosów fermentowanych (Sriracha, Tabasco, Habanero)',
    targetPuMin: 50,
    targetPuMax: 100,
    referenceTempC: 65.0,
    zValueCelsius: 8.0,
    maxSensorySafeTempC: 80.0,
    targetOrganisms: ['Lactobacillus plantarum', 'Leuconostoc', 'Drożdże kożuchujące'],
    descriptionPl: 'Gwarancja stabilności w temperaturze pokojowej bez konieczności trzymania w lodówce.',
  },
  CRISP_PICKLE_JAR: {
    category: 'CRISP_PICKLE_JAR',
    namePl: 'Pasteryzacja niskotemperaturowa kiszonek (Zachowanie chrupkości)',
    targetPuMin: 100,
    targetPuMax: 180,
    referenceTempC: 65.0,
    zValueCelsius: 10.0,
    maxSensorySafeTempC: 76.0,
    targetOrganisms: ['Pektynazy pleśniowe', 'Lactobacillus', 'Drożdże powierzchniowe'],
    descriptionPl: 'Denaturacja enzymów pektolitycznych bez ugotowania miąższu warzyw.',
  },
};

export interface PasteurizationInput {
  category: PasteurizationTargetCategory;
  waterBathTempCelsius: number;
  bottleCoreTempCelsius?: number; // Jeśli użytkownik ma sondę w butelce referencyjnej
  holdTimeMinutes?: number; // Czas przetrzymania w kąpieli
  bottleVolumeMl?: number; // Rozmiar butelki (np. 500ml)
}

export interface PasteurizationResult {
  category: PasteurizationTargetCategory;
  targetPu: number;
  puAccumulationRatePerMinute: number;
  requiredHoldTimeMinutes: number;
  actualAccumulatedPu?: number;
  isTargetAchieved: boolean;
  thermalSafetyStatus: 'SAFE_OPTIMAL' | 'UNDER_PASTEURIZED_UNSTABLE' | 'SENSORY_HEAT_DAMAGE_RISK';
  statusMessagePl: string;
  sensoryPreservationAdvice: string;
  recommendedWaterBathProtocol: string[];
}

/**
 * Calculates instantaneous Pasteurization Units (PU) per minute using the Bigelow model:
 * PU/min = 10 ^ ((T - T_ref) / z)
 */
export function calculateInstantaneousPuRate(
  currentTempC: number,
  referenceTempC: number,
  zValueC: number
): number {
  if (currentTempC < referenceTempC - 10) {
    return 0; // Negligible thermal lethality below T_ref - 10°C
  }
  const exponent = (currentTempC - referenceTempC) / zValueC;
  return Math.pow(10, exponent);
}

/**
 * Calculates required water bath hold time and thermal death lethality.
 */
export function calculatePasteurizationPlan(input: PasteurizationInput): PasteurizationResult {
  const {
    category,
    waterBathTempCelsius,
    bottleCoreTempCelsius,
    holdTimeMinutes,
    bottleVolumeMl = 500,
  } = input;

  const meta = PASTEURIZATION_TARGETS[category];
  const targetPu = Math.round((meta.targetPuMin + meta.targetPuMax) / 2);

  // Effective temperature at container core
  // If no internal probe, core is estimated ~2°C below water bath during steady hold
  const effectiveTemp = bottleCoreTempCelsius !== undefined
    ? bottleCoreTempCelsius
    : Math.max(20, waterBathTempCelsius - 2.0);

  const puPerMin = calculateInstantaneousPuRate(effectiveTemp, meta.referenceTempC, meta.zValueCelsius);

  // Required hold time in minutes (accounting for ~15% PU accumulation during heating ramp)
  const effectiveTargetPu = targetPu * 0.85;
  const requiredHoldTimeMinutes = puPerMin > 0
    ? Math.max(1, Math.round((effectiveTargetPu / puPerMin) * 10) / 10)
    : 999;

  let actualAccumulatedPu: number | undefined;
  let isTargetAchieved = false;

  if (holdTimeMinutes !== undefined) {
    // Estimating total PU = ramp (15% of target) + steady hold
    const holdPu = puPerMin * holdTimeMinutes;
    const rampEstimate = Math.min(targetPu * 0.15, holdPu * 0.15);
    actualAccumulatedPu = Math.round((holdPu + rampEstimate) * 10) / 10;
    isTargetAchieved = actualAccumulatedPu >= meta.targetPuMin;
  }

  // Thermal safety & sensory check
  let thermalSafetyStatus: PasteurizationResult['thermalSafetyStatus'] = 'SAFE_OPTIMAL';
  let statusMessagePl = 'Parametry optymalne: pełna stabilizacja mikrobiologiczna z zachowaniem świeżego aromatu.';

  if (waterBathTempCelsius > meta.maxSensorySafeTempC) {
    thermalSafetyStatus = 'SENSORY_HEAT_DAMAGE_RISK';
    statusMessagePl = `Temperatura łaźni (${waterBathTempCelsius}°C) przekracza próg zachowania jakości (${meta.maxSensorySafeTempC}°C)! Ryzyko posmaku gotowanego surowca i degradacji estrów.`;
  } else if (holdTimeMinutes !== undefined && !isTargetAchieved) {
    thermalSafetyStatus = 'UNDER_PASTEURIZED_UNSTABLE';
    statusMessagePl = `Niedostateczna pasteryzacja (${actualAccumulatedPu} PU < ${meta.targetPuMin} PU). Drożdże lub bakterie przetrwają, stwarzając ryzyko refermentacji!`;
  }

  // Sensory advice
  let sensoryPreservationAdvice = 'Schłodź butelki w chłodnej wodzie (nie lodowatej, by uniknąć szoku termicznego szkła) natychmiast po upływie czasu kąpieli.';
  if (category === 'KOMBUCHA_STABILIZATION') {
    sensoryPreservationAdvice = 'W przypadku kombuchy nie przekraczaj 65°C w rdzeniu — wyższa temperatura niszczy lotne związki terpenowe chmielu i owoców.';
  } else if (category === 'CRISP_PICKLE_JAR') {
    sensoryPreservationAdvice = 'Niska pasteryzacja (68-72°C) denaturuje enzym pektynazy, zachowując chrupkość ogórków nieporównywalnie lepiej niż tradycyjne gotowanie w 100°C.';
  }

  const lagMinutes = bottleVolumeMl > 750 ? 8 : bottleVolumeMl > 350 ? 5 : 3;

  const recommendedWaterBathProtocol: string[] = [
    `1. Rozgrzej kąpiel wodną do ${waterBathTempCelsius}°C. Poziom wody powinien sięgać szyjek butelek/słoików.`,
    `2. Wstaw szczelnie zamknięte butelki (o pojemności ${bottleVolumeMl} ml). Czas wyrównania temperatury rdzenia: ok. ${lagMinutes} min.`,
    `3. Utrzymuj stabilną temperaturę kąpieli przez ${requiredHoldTimeMinutes} minut (wystarczy do osiągnięcia celu ${targetPu} PU).`,
    `4. Wyjmij naczynia i pozostaw do ostygnięcia w temperaturze pokojowej. Nie wstawiaj bezpośrednio do lodu (ryzyko pęknięcia szkła).`,
  ];

  return {
    category,
    targetPu,
    puAccumulationRatePerMinute: Math.round(puPerMin * 100) / 100,
    requiredHoldTimeMinutes,
    actualAccumulatedPu,
    isTargetAchieved,
    thermalSafetyStatus,
    statusMessagePl,
    sensoryPreservationAdvice,
    recommendedWaterBathProtocol,
  };
}
