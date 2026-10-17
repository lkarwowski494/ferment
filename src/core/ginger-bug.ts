/**
 * Ginger Bug & Wild Soda Carbonation Kinetics Engine (src/core/ginger-bug.ts)
 *
 * Silnik prowadzenia dzikiego startera imbirowego (Ginger Bug), doboru dawek
 * pożywki (świeży imbir ze skórką + cukier), kalkulacji proporcji nastawu
 * piwa imbirowego (Ginger Beer) / dzikich sod oraz modelowania kinetyki
 * refermentacji butelkowej z zabezpieczeniem przeciwwybuchowym (Bottle Burst Guard).
 *
 * Podstawa mikrobiologiczna:
 * - Dzikie drożdże (Saccharomyces spp., Torulaspora delbrueckii, Hanseniaspora uvarum)
 *   oraz bakterie kwasu mlekowego (Lactobacillus, Leuconostoc mesenteroides) obecne
 *   naturalnie na skórce surowego, niebielonego i niechlorowanego korzenia imbiru.
 * - Karmienie: 15g świeżo startego imbiru (ze skórką) + 15g cukru + 15-30ml wody na dobę.
 * - Dozowanie do napoju: 8% - 12% objętości nastawu (standardowo 100 ml na 1 litr).
 * - Bezpieczeństwo szkła: przyrost CO2 ok. 0.07-0.10 vol/h w 22°C. Granica bezpieczeństwa
 *   dla butelek z zamknięciem patentowym to 3.4-3.6 vol CO2.
 */

export type GingerBugStarterStatus =
  | 'INCUBATING_YOUNG'
  | 'PEAK_ACTIVE'
  | 'SLUGGISH_NEED_FEEDING'
  | 'REFRIGERATED_DORMANT'
  | 'OVER_ACIDIFIED';

export interface GingerBugFeedingInput {
  starterAgeDays: number;
  daysSinceLastFeed: number;
  temperatureC: number;
  hasBubbles: boolean;
  hasFizzOnStir: boolean;
  isRefrigerated: boolean;
  starterVolumeMl?: number;
}

export interface GingerBugFeedingResult {
  status: GingerBugStarterStatus;
  statusLabelPl: string;
  statusLabelEn: string;
  isReadyForBrewing: boolean;
  nextFeedGingerGrams: number;
  nextFeedSugarGrams: number;
  nextFeedWaterMl: number;
  starterHealthScore: number; // 0 - 100
  recommendationsPl: string[];
  recommendationsEn: string[];
}

export type BottleType = 'SWING_TOP_HEAVY_GLASS' | 'PET_PLASTIC_CONTROL' | 'STANDARD_CROWN_CAP';

export interface GingerBeerBatchInput {
  batchVolumeLiters: number;
  targetSugarGramsPerLiter?: number; // default 70g/L (~7% sugar)
  bottlingTempC?: number; // default 22°C
  hoursInBottle: number;
  bottleType?: BottleType;
  baseFlavor?: 'TRADITIONAL_GINGER' | 'CITRUS_LEMON' | 'HIBISCUS_FLORAL' | 'HERBAL_PINE';
}

export type CarbonationStage =
  | 'FLAT'
  | 'MILD_EFFERVESCENT'
  | 'OPTIMAL_CHAMPAGNE'
  | 'HIGH_PRESSURE'
  | 'EXPLOSION_DANGER';

export interface GingerBeerBatchResult {
  requiredStarterVolumeMl: number;
  totalSugarGrams: number;
  freshGingerDecoctionGrams: number;
  lemonJuiceMl: number;
  estimatedCo2Volumes: number;
  carbonationStage: CarbonationStage;
  burstRiskSeverity: 'SAFE' | 'WARNING' | 'CRITICAL';
  estimatedHoursToOptimalCo2: number;
  alertsPl: string[];
  alertsEn: string[];
  stepsPl: string[];
  stepsEn: string[];
}

/**
 * Ocena kondycji i harmonogramu karmienia startera Ginger Bug
 */
export function evaluateGingerBugStarter(input: GingerBugFeedingInput): GingerBugFeedingResult {
  const {
    starterAgeDays,
    daysSinceLastFeed,
    temperatureC,
    hasBubbles,
    hasFizzOnStir,
    isRefrigerated,
  } = input;

  const recommendationsPl: string[] = [];
  const recommendationsEn: string[] = [];

  // Uśpienie w lodówce
  if (isRefrigerated) {
    const needFeed = daysSinceLastFeed >= 7;
    return {
      status: 'REFRIGERATED_DORMANT',
      statusLabelPl: 'Starter uśpiony w chłodzie (Hibernacja)',
      statusLabelEn: 'Refrigerated Dormant Starter (Hibernation)',
      isReadyForBrewing: false,
      nextFeedGingerGrams: 15,
      nextFeedSugarGrams: 15,
      nextFeedWaterMl: 25,
      starterHealthScore: needFeed ? 65 : 85,
      recommendationsPl: needFeed
        ? ['Starter przebywa w lodówce ponad 7 dni bez dokarmienia. Wyjmij na 2–3h, nakarm 15g imbiru i 15g cukru, wymieszaj i odstaw do lodówki.']
        : ['Starter śpi w lodówce. Aby go użyć do partii piwa, wyjmij go do temperatury pokojowej na 24–48h przed nastawem i nakarm 1–2 razy.'],
      recommendationsEn: needFeed
        ? ['Starter has rested over 7 days in fridge without feed. Warm for 2–3h, feed 15g ginger + 15g sugar, stir and return to fridge.']
        : ['Starter is dormant. To brew, bring it to room temp 24–48h prior to batching and feed 1–2 times to revive peak fizz.'],
    };
  }

  // W temperaturze pokojowej
  let status: GingerBugStarterStatus = 'INCUBATING_YOUNG';
  let isReadyForBrewing = false;
  let starterHealthScore = 50;

  if (starterAgeDays < 3) {
    status = 'INCUBATING_YOUNG';
    starterHealthScore = 50 + starterAgeDays * 10;
    recommendationsPl.push('Starter jest w fazie wczesnego rozruchu. Kolonizacja dzikich drożdży trwa min. 3–5 dni.');
    recommendationsEn.push('Starter is in early activation. Colonization of wild yeasts requires at least 3–5 days.');
  } else if (hasBubbles && hasFizzOnStir && daysSinceLastFeed <= 1) {
    status = 'PEAK_ACTIVE';
    isReadyForBrewing = true;
    starterHealthScore = 95;
    recommendationsPl.push('Starter ma szczytową aktywność biologiczną! Pięknie bąbelkuje i musuje po zamieszaniu. Jest gotowy do zaszczepienia nastawu.');
    recommendationsEn.push('Starter is at peak microbial vigor! Abundant bubbles and audible fizz upon stirring. Ready for batch inoculation.');
  } else if (daysSinceLastFeed > 2) {
    status = 'SLUGGISH_NEED_FEEDING';
    starterHealthScore = 40;
    recommendationsPl.push('Starter jest wygłodzony. Drożdże wyczerpały cukier i wchodzą w fazę autolizy. Nakarm go natychmiast.');
    recommendationsEn.push('Starter is depleted. Yeasts exhausted available sugars. Feed immediately to restore viability.');
  } else if (starterAgeDays >= 14 && (!hasBubbles || !hasFizzOnStir)) {
    status = 'OVER_ACIDIFIED';
    starterHealthScore = 30;
    recommendationsPl.push('Starter mógł ulec nadmiernemu zakwaszeniu przez bakterie kwasu mlekowego kosztem drożdży. Odlej połowę płynu i uzupełnij świeżą wodą z cukrem.');
    recommendationsEn.push('Starter likely over-acidified by lactic bacteria suppressive to yeasts. Discard 50% liquid and refresh with non-chlorinated water and sugar.');
  } else {
    // 3-5 dni, powoli się rozkręca
    status = 'INCUBATING_YOUNG';
    starterHealthScore = 70;
    recommendationsPl.push('Karm starter codziennie o stałej porze. Nie zamykaj słoika na szczelno — przykryj gazą lub luźną nakrętką.');
    recommendationsEn.push('Feed starter daily at a consistent time. Do not seal airtight — cover with breathable cloth or loose lid.');
  }

  // Temperatura warning
  if (temperatureC < 19) {
    recommendationsPl.push('Temperatura otoczenia jest zbyt niska (<19°C). Przenieś słoik w cieplejsze miejsce (21–25°C), aby przyspieszyć metabolizm.');
    recommendationsEn.push('Ambient temperature is too low (<19°C). Move jar to a warmer spot (21–25°C) to stimulate yeast division.');
  }

  return {
    status,
    statusLabelPl:
      status === 'PEAK_ACTIVE'
        ? 'Szczytowa aktywność (Gotowy do warzenia)'
        : status === 'SLUGGISH_NEED_FEEDING'
        ? 'Wygłodzony (Wymaga natychmiastowej pożywki)'
        : status === 'OVER_ACIDIFIED'
        ? 'Przekwaszony (Wymaga odświeżenia)'
        : 'W fazie rozruchu (Młody)',
    statusLabelEn:
      status === 'PEAK_ACTIVE'
        ? 'Peak Active (Ready for Brewing)'
        : status === 'SLUGGISH_NEED_FEEDING'
        ? 'Sluggish (Hungry, Needs Feed)'
        : status === 'OVER_ACIDIFIED'
        ? 'Over-acidified (Needs Refresh Dilution)'
        : 'Incubating (Young)',
    isReadyForBrewing,
    nextFeedGingerGrams: 15,
    nextFeedSugarGrams: 15,
    nextFeedWaterMl: 25,
    starterHealthScore,
    recommendationsPl,
    recommendationsEn,
  };
}

/**
 * Kalkulator proporcji nastawu piwa imbirowego oraz kinetyki nasycenia CO2 i Bottle Burst Guard
 */
export function calculateGingerBeerBatch(input: GingerBeerBatchInput): GingerBeerBatchResult {
  const {
    batchVolumeLiters,
    targetSugarGramsPerLiter = 70, // 70g/L = 7% cukru
    bottlingTempC = 22,
    hoursInBottle,
    bottleType = 'SWING_TOP_HEAVY_GLASS',
  } = input;

  // 1. Proporcje składników nastawu
  // Inokulacja: 10% objętości partii
  const requiredStarterVolumeMl = Math.round(batchVolumeLiters * 100);
  const totalSugarGrams = Math.round(batchVolumeLiters * targetSugarGramsPerLiter);
  // Wywar imbirowy: 50g świeżego imbiru na 1L piwa
  const freshGingerDecoctionGrams = Math.round(batchVolumeLiters * 50);
  // Sok z cytryny: 35ml na 1L dla balansu pH 3.8-4.0
  const lemonJuiceMl = Math.round(batchVolumeLiters * 35);

  // 2. Kinetyka nasycenia CO2
  // Początkowe nasycenie rozpuszczonym CO2 w wodzie: ~0.8 vol przy 22°C
  // Tempo fermentacji w szczelnej butelce: zależne od temperatury (Q10 ~ 2.0 przy 20°C vs 25°C)
  const tempFactor = Math.pow(1.08, bottlingTempC - 20); // 1.0 przy 20°C, 1.16 przy 22°C, 1.46 przy 25°C
  const co2RatePerHr = 0.055 * tempFactor;

  const estimatedCo2Volumes = Number((0.8 + hoursInBottle * co2RatePerHr).toFixed(2));

  // 3. Ocena etapu nasycenia
  let carbonationStage: CarbonationStage;
  if (estimatedCo2Volumes < 1.4) {
    carbonationStage = 'FLAT';
  } else if (estimatedCo2Volumes < 2.2) {
    carbonationStage = 'MILD_EFFERVESCENT';
  } else if (estimatedCo2Volumes <= 2.8) {
    carbonationStage = 'OPTIMAL_CHAMPAGNE';
  } else if (estimatedCo2Volumes <= 3.4) {
    carbonationStage = 'HIGH_PRESSURE';
  } else {
    carbonationStage = 'EXPLOSION_DANGER';
  }

  // 4. Ocena ryzyka pęknięcia szkła (Bottle Burst Guard)
  let burstRiskSeverity: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];

  const maxGlassSafeCo2 = bottleType === 'PET_PLASTIC_CONTROL' ? 3.8 : 3.4;

  if (estimatedCo2Volumes >= maxGlassSafeCo2) {
    burstRiskSeverity = 'CRITICAL';
    alertsPl.push(`KRYTYCZNE CIŚNIENIE CO2 (${estimatedCo2Volumes} vol)! Ekstremalne ryzyko eksplozji butelki. Natychmiast schłodź butelki do 4°C lub ostrożnie odgazuj (burp) przez ręcznik!`);
    alertsEn.push(`CRITICAL CO2 PRESSURE (${estimatedCo2Volumes} vol)! Severe bottle burst danger. Instantly chill bottles to 4°C or burp cautiously wrapped in a towel!`);
  } else if (estimatedCo2Volumes >= 2.9) {
    burstRiskSeverity = 'WARNING';
    alertsPl.push(`Wysokie ciśnienie (${estimatedCo2Volumes} vol). Przygotuj się do włożenia butelek do lodówki w ciągu najbliższych kilku godzin.`);
    alertsEn.push(`High carbonation pressure (${estimatedCo2Volumes} vol). Prepare to move bottles to refrigerator within next few hours.`);
  }

  // Czas do optymalnego nasycenia (2.5 vol)
  const targetOptimalCo2 = 2.5;
  const hoursNeeded = Math.max(0, Math.round((targetOptimalCo2 - 0.8) / co2RatePerHr));
  const estimatedHoursToOptimalCo2 = Math.max(0, hoursNeeded - hoursInBottle);

  // Instrukcja krok po kroku
  const stepsPl: string[] = [
    `Zetrzyj ${freshGingerDecoctionGrams}g świeżego imbiru, zalej 1/3 wody z nastawu i gotuj na wolnym ogniu przez 15 minut.`,
    `Rozpuść w gorącym wywarze ${totalSugarGrams}g cukru. Ostudź wywar do temperatury poniżej 28°C (gorący płyn zabije drożdże!).`,
    `Wlej ostudzony wywar, resztę zimnej wody, ${lemonJuiceMl}ml soku z cytryny oraz ${requiredStarterVolumeMl}ml odcedzonego aktywnego Ginger Buga do gąsiorka/dzbanka.`,
    'Rozlej do czystych butelek ciśnieniowych (pozostawiając 3–4 cm wolnej przestrzeni tzw. headspace). Szczelnie zamknij.',
    `Pozostaw butelki w temperaturze ${bottlingTempC}°C na ok. ${hoursNeeded} godzin. Po osiągnięciu optymalnego nagazowania natychmiast wstaw do lodówki (4°C), aby zatrzymać refermentację.`,
  ];

  const stepsEn: string[] = [
    `Grate ${freshGingerDecoctionGrams}g fresh ginger root, add 1/3 of batch water and simmer gently for 15 minutes.`,
    `Dissolve ${totalSugarGrams}g sugar into hot decoction. Allow decoction to cool below 28°C (hot liquid will kill wild yeasts!).`,
    `Combine cooled decoction, remaining cold water, ${lemonJuiceMl}ml lemon juice, and ${requiredStarterVolumeMl}ml strained active Ginger Bug in a sanitized vessel.`,
    'Bottle into pressure-safe swing-top bottles leaving 3–4 cm headspace. Seal tightly.',
    `Ferment at ${bottlingTempC}°C for approx. ${hoursNeeded} hours. Upon optimal fizz, transfer to refrigerator (4°C) immediately to halt yeast metabolism.`,
  ];

  return {
    requiredStarterVolumeMl,
    totalSugarGrams,
    freshGingerDecoctionGrams,
    lemonJuiceMl,
    estimatedCo2Volumes,
    carbonationStage,
    burstRiskSeverity,
    estimatedHoursToOptimalCo2,
    alertsPl,
    alertsEn,
    stepsPl,
    stepsEn,
  };
}
