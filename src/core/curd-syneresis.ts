// ============================================================================
// Apps4Brew Studio — FERMENT Curd Syneresis & Casein Shrinkage Kinetics
// Grain sizing (3-35mm), cooking ramp rates, case hardening protection, and drain pH
// ============================================================================

export type CheeseStyleSyneresis =
  | 'PARMESAN_GRANA' // Bardzo drobne ziarno (3mm), dogrzewanie 52-55°C
  | 'ALPINE_GRUYERE' // Drobne ziarno (4-5mm), dogrzewanie 50-54°C
  | 'GOUDA_EDAM' // Średnie ziarno (8-10mm), dogrzewanie 36-39°C
  | 'CHEDDAR' // Średnie ziarno (8-12mm), dogrzewanie 38-40°C
  | 'CAMEMBERT_BRIE' // Grube ziarno (15-20mm), bez dogrzewania (32-34°C)
  | 'FETA_FRESH'; // Bardzo grube płaty (25-35mm), osuszanie grawitacyjne

export type CurdCutStandard =
  | 'FINE_RICE' // 3-5 mm (twarde, dogrzewane)
  | 'MEDIUM_HAZELNUT' // 8-12 mm (półtwarde)
  | 'COARSE_WALNUT' // 15-20 mm (pleśniowe, miękkie)
  | 'FRESH_SLAB'; // 25-35 mm (świeże, solankowe)

export interface CheeseStyleConfig {
  style: CheeseStyleSyneresis;
  namePl: string;
  recommendedCutStandard: CurdCutStandard;
  recommendedCutSizeMm: number;
  initialTempC: number;
  maxCookingTempC: number;
  maxSafeRampRateCPerMin: number; // np. 0.5°C/min
  optimalDrainPhMin: number;
  optimalDrainPhMax: number;
  targetMoistureMinPct: number;
  targetMoistureMaxPct: number;
  descriptionPl: string;
}

export const CHEESE_SYNERESIS_CONFIGS: Record<CheeseStyleSyneresis, CheeseStyleConfig> = {
  PARMESAN_GRANA: {
    style: 'PARMESAN_GRANA',
    namePl: 'Parmezan / Grana (Twardy wysokodogrzewany)',
    recommendedCutStandard: 'FINE_RICE',
    recommendedCutSizeMm: 3,
    initialTempC: 33,
    maxCookingTempC: 55,
    maxSafeRampRateCPerMin: 0.8, // Do 38°C wolno (0.4°C/min), potem szybciej
    optimalDrainPhMin: 6.20,
    optimalDrainPhMax: 6.35,
    targetMoistureMinPct: 30,
    targetMoistureMaxPct: 34,
    descriptionPl: 'Ziarno wielkości ryżu, intensywne dogrzewanie do 54°C z energicznym mieszaniem.',
  },
  ALPINE_GRUYERE: {
    style: 'ALPINE_GRUYERE',
    namePl: 'Alpejski / Gruyère / Comté',
    recommendedCutStandard: 'FINE_RICE',
    recommendedCutSizeMm: 4,
    initialTempC: 32,
    maxCookingTempC: 53,
    maxSafeRampRateCPerMin: 0.6,
    optimalDrainPhMin: 6.30,
    optimalDrainPhMax: 6.42,
    targetMoistureMinPct: 34,
    targetMoistureMaxPct: 38,
    descriptionPl: 'Drobne ziarno pszenicy, powolne podgrzewanie chroniące przed zasklepieniem kazeiny.',
  },
  GOUDA_EDAM: {
    style: 'GOUDA_EDAM',
    namePl: 'Gouda / Edam (Półtwardy płukany)',
    recommendedCutStandard: 'MEDIUM_HAZELNUT',
    recommendedCutSizeMm: 8,
    initialTempC: 31,
    maxCookingTempC: 38,
    maxSafeRampRateCPerMin: 0.5, // 1°C na 2-3 min
    optimalDrainPhMin: 6.35,
    optimalDrainPhMax: 6.48,
    targetMoistureMinPct: 41,
    targetMoistureMaxPct: 46,
    descriptionPl: 'Ziarno wielkości orzecha laskowego/kukurydzy, płukanie serwatki ciepłą wodą.',
  },
  CHEDDAR: {
    style: 'CHEDDAR',
    namePl: 'Cheddar (Kwasowo-dogrzewany)',
    recommendedCutStandard: 'MEDIUM_HAZELNUT',
    recommendedCutSizeMm: 10,
    initialTempC: 31,
    maxCookingTempC: 39,
    maxSafeRampRateCPerMin: 0.5,
    optimalDrainPhMin: 6.00,
    optimalDrainPhMax: 6.20,
    targetMoistureMinPct: 36,
    targetMoistureMaxPct: 40,
    descriptionPl: 'Umiarkowane dogrzewanie, intensywna synereza kwasowa przed cheddaryzacją.',
  },
  CAMEMBERT_BRIE: {
    style: 'CAMEMBERT_BRIE',
    namePl: 'Camembert / Brie (Miękki z porostem)',
    recommendedCutStandard: 'COARSE_WALNUT',
    recommendedCutSizeMm: 18,
    initialTempC: 32,
    maxCookingTempC: 34,
    maxSafeRampRateCPerMin: 0.3,
    optimalDrainPhMin: 6.25,
    optimalDrainPhMax: 6.45,
    targetMoistureMinPct: 52,
    targetMoistureMaxPct: 58,
    descriptionPl: 'Grube kostki, minimalne mechaniczne mieszanie dla zachowania wilgoci.',
  },
  FETA_FRESH: {
    style: 'FETA_FRESH',
    namePl: 'Feta / Ser Solankowy / Świeży',
    recommendedCutStandard: 'FRESH_SLAB',
    recommendedCutSizeMm: 28,
    initialTempC: 32,
    maxCookingTempC: 32,
    maxSafeRampRateCPerMin: 0.2,
    optimalDrainPhMin: 6.30,
    optimalDrainPhMax: 6.45,
    targetMoistureMinPct: 55,
    targetMoistureMaxPct: 65,
    descriptionPl: 'Duże kostki lub nakładanie warstwami, grawitacyjny odciek w chustach/formach.',
  },
};

export interface SyneresisInput {
  cheeseStyle: CheeseStyleSyneresis;
  curdCutSizeMm: number;
  initialTempC: number;
  targetCookingTempC: number;
  heatingDurationMinutes: number; // Czas osiągania temperatury
  stirringDurationMinutes: number; // Czas mieszania po dogrzaniu (pitching/stir out)
  drainPh: number;
}

export interface SyneresisStep {
  minute: number;
  tempCelsius: number;
  action: string;
}

export interface SyneresisResult {
  cheeseStyle: CheeseStyleSyneresis;
  actualRampRateCPerMin: number;
  maxSafeRampRateCPerMin: number;
  caseHardeningVerdict: 'OPTIMAL_PORE_OPEN' | 'BORDERLINE_RATE' | 'CRITICAL_CASE_HARDENING';
  caseHardeningAlertPl: string;
  syneresisIntensityIndex: number; // 0 (bardzo mokry) do 100 (ekstremalnie suchy)
  expectedMoisturePct: number;
  expectedMoistureMinPct: number;
  expectedMoistureMaxPct: number;
  calciumRetentionVerdict: 'EXCESSIVE_CALCIUM_RUBBERY' | 'OPTIMAL_MINERAL_BALANCE' | 'DECALCIFIED_BRITTLE_ACIDIC';
  calciumImpactMessagePl: string;
  totalProcessMinutes: number;
  schedule: SyneresisStep[];
  recommendations: string[];
}

/**
 * Calculates curd syneresis kinetics, ramp rate, case hardening hazard, and calcium balance.
 */
export function calculateCurdSyneresis(input: SyneresisInput): SyneresisResult {
  const {
    cheeseStyle,
    curdCutSizeMm,
    initialTempC,
    targetCookingTempC,
    heatingDurationMinutes,
    stirringDurationMinutes,
    drainPh,
  } = input;

  const config = CHEESE_SYNERESIS_CONFIGS[cheeseStyle];
  const deltaTemp = Math.max(0, targetCookingTempC - initialTempC);
  const safeHeatingMinutes = Math.max(1, heatingDurationMinutes);
  const rampRate = Math.round((deltaTemp / safeHeatingMinutes) * 100) / 100;

  // Case Hardening (zasklepienie powierzchni ziarna kazeinowego)
  let caseHardeningVerdict: SyneresisResult['caseHardeningVerdict'] = 'OPTIMAL_PORE_OPEN';
  let caseHardeningAlertPl = 'Kinetyka dogrzewania optymalna — pory kazeinowe otwarte, równomierny odpływ serwatki.';

  if (deltaTemp > 0) {
    if (rampRate > config.maxSafeRampRateCPerMin * 1.3) {
      caseHardeningVerdict = 'CRITICAL_CASE_HARDENING';
      caseHardeningAlertPl = `Zagrożenie zasklepieniem ziarna! Tempo dogrzewania (${rampRate}°C/min) jest za wysokie (maks. ${config.maxSafeRampRateCPerMin}°C/min). Utworzy się twarda błona, więżąc serwatkę i laktozę w środku.`;
    } else if (rampRate > config.maxSafeRampRateCPerMin) {
      caseHardeningVerdict = 'BORDERLINE_RATE';
      caseHardeningAlertPl = `Tempo dogrzewania (${rampRate}°C/min) na granicy bezpieczeństwa. Zwolnij ogrzewanie poniżej ${config.maxSafeRampRateCPerMin}°C/min (1°C na 2-3 minuty).`;
    }
  }

  // Calcium retention and acid balance based on drain pH
  let calciumRetentionVerdict: SyneresisResult['calciumRetentionVerdict'] = 'OPTIMAL_MINERAL_BALANCE';
  let calciumImpactMessagePl = 'Równowaga micelarna zachowana — optymalny poziom fosforanu wapnia w skrzepie.';

  if (drainPh < config.optimalDrainPhMin) {
    calciumRetentionVerdict = 'DECALCIFIED_BRITTLE_ACIDIC';
    calciumImpactMessagePl = `Zbyt niskie pH przy ocieku (${drainPh} < ${config.optimalDrainPhMin}). Nadmierne wypłukanie wapnia koloidalnego. Ser będzie kruchy, kredowy i może wykazywać wady gorzkiego posmaku.`;
  } else if (drainPh > config.optimalDrainPhMax) {
    calciumRetentionVerdict = 'EXCESSIVE_CALCIUM_RUBBERY';
    calciumImpactMessagePl = `Zbyt wysokie pH przy ocieku (${drainPh} > ${config.optimalDrainPhMax}). Wysokie zatrzymanie wapnia micelarnego. Skrzep będzie gumowaty i podatny na powolne dojrzewanie.`;
  }

  // Syneresis Intensity Index (0 to 100)
  // Factors:
  // 1. Cut size (smaller = more surface area/volume = higher syneresis)
  // 2. Cooking temperature (higher = higher shrinkage)
  // 3. Stirring time (longer = more mechanical expulsion)
  // 4. Acid level (lower pH = closer to isoelectric point 4.6 = higher contraction)
  const sizeFactor = Math.max(0, Math.min(40, (30 - Math.min(30, curdCutSizeMm)) * 1.4)); // 0-40 pts
  const tempFactor = Math.max(0, Math.min(30, (targetCookingTempC - 30) * 1.3)); // 0-30 pts
  const stirFactor = Math.max(0, Math.min(15, stirringDurationMinutes * 0.4)); // 0-15 pts
  const phFactor = Math.max(0, Math.min(15, (6.6 - Math.min(6.6, Math.max(5.8, drainPh))) * 18.75)); // 0-15 pts

  // Penalize syneresis if critical case hardening occurs (outer shell prevents water escape)
  let syneresisIntensity = Math.round(sizeFactor + tempFactor + stirFactor + phFactor);
  if (caseHardeningVerdict === 'CRITICAL_CASE_HARDENING') {
    syneresisIntensity = Math.round(syneresisIntensity * 0.75); // Curd stays wet inside!
  }
  syneresisIntensity = Math.max(5, Math.min(98, syneresisIntensity));

  // Moisture estimate based on style config & syneresis index
  const moistureSpan = config.targetMoistureMaxPct - config.targetMoistureMinPct;
  const normalizedIntensity = (syneresisIntensity - 10) / 80; // 0 to 1
  let expectedMoisture = Math.round((config.targetMoistureMaxPct - normalizedIntensity * moistureSpan) * 10) / 10;
  
  if (caseHardeningVerdict === 'CRITICAL_CASE_HARDENING') {
    // Wet core defect
    expectedMoisture = Math.min(68, expectedMoisture + 4.5);
  }

  expectedMoisture = Math.max(28, Math.min(72, expectedMoisture));

  // Build Step-by-Step Schedule
  const schedule: SyneresisStep[] = [];
  schedule.push({ minute: 0, tempCelsius: initialTempC, action: `Krojenie skrzepu na ziarno ${curdCutSizeMm} mm. Odpoczynek 5 min pod serwatką.` });

  if (deltaTemp > 0) {
    const rampStepsCount = Math.max(1, Math.min(5, Math.ceil(safeHeatingMinutes / 5)));
    const minutesPerStep = Math.round(safeHeatingMinutes / rampStepsCount);
    const tempIncrement = deltaTemp / rampStepsCount;

    for (let i = 1; i <= rampStepsCount; i++) {
      const currentMin = i * minutesPerStep;
      const currentT = Math.round((initialTempC + i * tempIncrement) * 10) / 10;
      schedule.push({
        minute: currentMin,
        tempCelsius: currentT,
        action: `Podgrzewanie (krok ${i}/${rampStepsCount}): powolne mieszanie ósemkowe, temp. ${currentT}°C.`,
      });
    }
  }

  if (stirringDurationMinutes > 0) {
    const pitchMin = safeHeatingMinutes + stirringDurationMinutes;
    schedule.push({
      minute: pitchMin,
      tempCelsius: targetCookingTempC,
      action: `Koniec osuszania ziarna (stirring out). Ziarno sprężyste, nie skleja się po ściśnięciu w dłoni.`,
    });
  }

  const drainMinute = safeHeatingMinutes + stirringDurationMinutes + 2;
  schedule.push({
    minute: drainMinute,
    tempCelsius: targetCookingTempC,
    action: `Przekładanie do form (Drain). Docelowe pH serwatki: ${drainPh}. Natychmiastowe prasowanie wstępne.`,
  });

  // Actionable Artisan Recommendations
  const recommendations: string[] = [];
  if (curdCutSizeMm > config.recommendedCutSizeMm * 1.5) {
    recommendations.push(`Ziarno (${curdCutSizeMm} mm) jest znacznie większe niż standard stylu (${config.recommendedCutSizeMm} mm) — czas ociekania wydłuży się, a ser będzie miał wyższą wilgotność.`);
  } else if (curdCutSizeMm < config.recommendedCutSizeMm * 0.6) {
    recommendations.push(`Ziarno (${curdCutSizeMm} mm) jest bardzo drobne — uważaj na utratę tłuszczu w serwatce (biała/mleczna serwatka).`);
  }

  if (deltaTemp > 0 && rampRate > config.maxSafeRampRateCPerMin) {
    recommendations.push(`Wydłuż czas dogrzewania do co najmniej ${Math.ceil(deltaTemp / config.maxSafeRampRateCPerMin)} minut, aby uniknąć zasklepienia ziarna.`);
  }

  if (stirringDurationMinutes < 15 && cheeseStyle !== 'CAMEMBERT_BRIE' && cheeseStyle !== 'FETA_FRESH') {
    recommendations.push('Dla serów twardych i półtwardych zaleca się minimum 20-30 min mieszania po osiągnięciu temperatury docelowej.');
  }

  recommendations.push(`Kontroluj pH serwatki przy ocieku: optymalne okno dla ${config.namePl} to ${config.optimalDrainPhMin} - ${config.optimalDrainPhMax}.`);

  return {
    cheeseStyle,
    actualRampRateCPerMin: rampRate,
    maxSafeRampRateCPerMin: config.maxSafeRampRateCPerMin,
    caseHardeningVerdict,
    caseHardeningAlertPl,
    syneresisIntensityIndex: syneresisIntensity,
    expectedMoisturePct: expectedMoisture,
    expectedMoistureMinPct: config.targetMoistureMinPct,
    expectedMoistureMaxPct: config.targetMoistureMaxPct,
    calciumRetentionVerdict,
    calciumImpactMessagePl,
    totalProcessMinutes: safeHeatingMinutes + stirringDurationMinutes + 2,
    schedule,
    recommendations,
  };
}
