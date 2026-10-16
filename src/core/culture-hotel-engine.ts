// ============================================================================
// Apps4Brew Studio — FERMENT Live Culture Hotel & Mother Colony Preservation Engine
// SCOBY Hotel, Mother of Vinegar (Mycoderma aceti), Kefir Grains & Mother Whey Levain
// Invariant Safety: Acidity protection (pH < 3.2), starvation limit & yeast trub purging
// ============================================================================

export type LiveCultureType =
  | 'KOMBUCHA_SCOBY_HOTEL'
  | 'VINEGAR_MOTHER'
  | 'MILK_KEFIR_GRAINS'
  | 'WATER_KEFIR_TIBICOS'
  | 'WHEY_STARTER_LEVAIN';

export type CultureHealthStatus =
  | 'HEALTHY_ACTIVE'
  | 'DUE_FOR_FEEDING'
  | 'STARVATION_RISK'
  | 'DORMANT_REFRIGERATED';

export interface CultureHotelInput {
  cultureType: LiveCultureType;
  lastFedTimestamp: number;
  nowTimestamp?: number;
  currentTempC?: number;          // Ambient storage temp (e.g. 20°C room or 4°C fridge)
  measuredPh?: number;            // Acidity level
  currentLiquidVolumeMl: number;  // Current starter liquid volume (ml)
  grainWeightGrams?: number;      // Current grain weight for kefir (g)
  yeastSludgeDepthCm?: number;    // Bottom dead yeast sedimental layer (cm)
  isRefrigerated?: boolean;       // Cold hibernation flag
}

export interface CultureFeedingSchedule {
  nominalFeedingIntervalDays: number;
  maxStarvationLimitDays: number;
  recommendedFeedingRatioPl: string;
  feedLiquidVolumeMl: number;
  feedSugarGrams: number;
  feedNutrientGrams: number;      // Tea, flour, or dried fruits
}

export interface CultureHotelResult {
  cultureType: LiveCultureType;
  cultureNamePl: string;
  daysSinceLastFed: number;
  healthStatus: CultureHealthStatus;
  statusLabelPl: string;

  feedingSchedule: CultureFeedingSchedule;
  daysUntilNextFeeding: number;

  isMoldHazard: boolean;          // pH > 3.20 in kombucha/vinegar
  isTrubPurgeRequired: boolean;   // Sludge > 2.0 cm
  expectedGrainGainGrams?: number;// Projected +10-25% grain growth

  statusMessagePl: string;
  maintenanceChecklist: string[];
  actionAlerts: string[];
}

const CULTURE_CONFIGS: Record<
  LiveCultureType,
  {
    namePl: string;
    intervalDaysRoom: number;
    intervalDaysCold: number;
    starvationDaysRoom: number;
    starvationDaysCold: number;
    maxSafePh: number;
    ratioDescriptionPl: string;
    sugarPerLiter: number;
    nutrientPerLiter: number; // Tea for kombucha, milk/fruits for others
  }
> = {
  KOMBUCHA_SCOBY_HOTEL: {
    namePl: 'Hotel SCOBY (Rezerwa Grzybków & Płynu Starterowego)',
    intervalDaysRoom: 35,
    intervalDaysCold: 90,
    starvationDaysRoom: 60,
    starvationDaysCold: 150,
    maxSafePh: 3.2,
    ratioDescriptionPl: 'Dolewka słodkiej herbaty: 25-30% objętości hotelu (65 g cukru + 7 g herbaty na litr wody)',
    sugarPerLiter: 65,
    nutrientPerLiter: 7,
  },
  VINEGAR_MOTHER: {
    namePl: 'Matka Octowa (Mycoderma aceti)',
    intervalDaysRoom: 28,
    intervalDaysCold: 60,
    starvationDaysRoom: 50,
    starvationDaysCold: 100,
    maxSafePh: 3.4,
    ratioDescriptionPl: 'Napowietrzenie i zasilenie 5% roztworem etanolu (rozcieńczone wino lub cydr)',
    sugarPerLiter: 0,
    nutrientPerLiter: 0,
  },
  MILK_KEFIR_GRAINS: {
    namePl: 'Ziarna Kefiru Mlecznego (Grzybki Tybetańskie)',
    intervalDaysRoom: 1.5, // 36h
    intervalDaysCold: 14,
    starvationDaysRoom: 3,
    starvationDaysCold: 28,
    maxSafePh: 4.6,
    ratioDescriptionPl: 'Świeże mleko pełne w proporcji 1:10 do 1:20 masy ziaren',
    sugarPerLiter: 0,
    nutrientPerLiter: 0,
  },
  WATER_KEFIR_TIBICOS: {
    namePl: 'Kryształy Japońskie / Tibicos (Kefir Wodny)',
    intervalDaysRoom: 2.0, // 48h
    intervalDaysCold: 14,
    starvationDaysRoom: 4,
    starvationDaysCold: 25,
    maxSafePh: 4.0,
    ratioDescriptionPl: 'Woda z cukrem (50 g/L) + suszona figa/rodzynka + szczypta sody/minerałów',
    sugarPerLiter: 50,
    nutrientPerLiter: 15,
  },
  WHEY_STARTER_LEVAIN: {
    namePl: 'Serwatka Mateczna / Levain Lactique Serowara',
    intervalDaysRoom: 1.0,
    intervalDaysCold: 7,
    starvationDaysRoom: 2,
    starvationDaysCold: 14,
    maxSafePh: 4.4,
    ratioDescriptionPl: 'Świeże mleko lub odwirowana słodka serwatka',
    sugarPerLiter: 0,
    nutrientPerLiter: 0,
  },
};

/**
 * Analyzes health, feeding schedule and microbiological safety of live culture colonies
 */
export function analyzeCultureHotel(input: CultureHotelInput): CultureHotelResult {
  const {
    cultureType,
    lastFedTimestamp,
    nowTimestamp = Date.now(),
    currentTempC = 20,
    measuredPh,
    currentLiquidVolumeMl,
    grainWeightGrams,
    yeastSludgeDepthCm = 0,
    isRefrigerated = currentTempC < 10,
  } = input;

  const config = CULTURE_CONFIGS[cultureType];
  const elapsedMs = Math.max(0, nowTimestamp - lastFedTimestamp);
  const daysSinceLastFed = Math.round((elapsedMs / (1000 * 60 * 60 * 24)) * 10) / 10;

  const nominalInterval = isRefrigerated ? config.intervalDaysCold : config.intervalDaysRoom;
  const starvationLimit = isRefrigerated ? config.starvationDaysCold : config.starvationDaysRoom;

  let healthStatus: CultureHealthStatus;
  let statusLabelPl: string;
  let statusMessagePl: string;

  if (isRefrigerated && daysSinceLastFed <= nominalInterval) {
    healthStatus = 'DORMANT_REFRIGERATED';
    statusLabelPl = 'Hibernacja Chłodnicza (Stan Uśpienia)';
    statusMessagePl = `Kultura bezpiecznie uśpiona w lodówce (${currentTempC}°C). Ostatnie karmienie ${daysSinceLastFed} dni temu.`;
  } else if (daysSinceLastFed > starvationLimit) {
    healthStatus = 'STARVATION_RISK';
    statusLabelPl = 'Krytyczne Zagrożenie Śmiercią Głupotową';
    statusMessagePl = `Kultura nie była dokarmiana przez ${daysSinceLastFed} dni (limit: ${starvationLimit} dni)! Natychmiast podaj świeżą pożywkę.`;
  } else if (daysSinceLastFed >= nominalInterval) {
    healthStatus = 'DUE_FOR_FEEDING';
    statusLabelPl = 'Wymagane Dokarmienie (Termin Upłynął)';
    statusMessagePl = `Optymalne okno karmienia upłynęło (${daysSinceLastFed}/${nominalInterval} dni). Uzupełnij substrat.`;
  } else {
    healthStatus = 'HEALTHY_ACTIVE';
    statusLabelPl = 'Witalna & Aktywna Mikrobiologicznie';
    statusMessagePl = `Kultura w doskonałej kondycji. Pozostało ${Math.max(0, Math.round(nominalInterval - daysSinceLastFed))} dni do planowego zasilenia.`;
  }

  // Calculate nourishment amounts
  const feedVolumeMl = Math.round(currentLiquidVolumeMl * 0.3); // 30% top up
  const feedVolumeLiters = feedVolumeMl / 1000;
  const feedSugarGrams = Math.round(feedVolumeLiters * config.sugarPerLiter);
  const feedNutrientGrams = Math.round(feedVolumeLiters * config.nutrientPerLiter);

  const feedingSchedule: CultureFeedingSchedule = {
    nominalFeedingIntervalDays: nominalInterval,
    maxStarvationLimitDays: starvationLimit,
    recommendedFeedingRatioPl: config.ratioDescriptionPl,
    feedLiquidVolumeMl: feedVolumeMl,
    feedSugarGrams,
    feedNutrientGrams,
  };

  const daysUntilNextFeeding = Math.max(0, Math.round((nominalInterval - daysSinceLastFed) * 10) / 10);

  // Safety invariants
  const isMoldHazard = measuredPh !== undefined && measuredPh > config.maxSafePh;
  const isTrubPurgeRequired = yeastSludgeDepthCm >= 2.0;

  const actionAlerts: string[] = [];
  const maintenanceChecklist: string[] = [];

  if (isMoldHazard) {
    actionAlerts.push(
      `ALARM BIO-OCHRONY: Zmierzone pH (${measuredPh}) przekracza bezpieczny próg ${config.maxSafePh}! Brak wystarczającej kwasowości stwarza ryzyko zasiedlenia przez zarodniki pleśni. Dodaj zakwaszający ocet jabłkowy lub stary starter.`
    );
  }

  if (isTrubPurgeRequired) {
    actionAlerts.push(
      `OSAD DROŻDŻOWY: Warstwa martwych drożdży na dnie wynosi ${yeastSludgeDepthCm} cm (próg: 2.0 cm). Autoliza drożdży uwalnia nieprzyjemne nuty siarkowe/gumowe. Przelej płyn przez sitko i umyj naczynie.`
    );
  }

  // General maintenance checklist
  maintenanceChecklist.push(`Naczynie przykrywaj gęstą tkaniną bawełnianą zabezpieczoną gumką (ochrona przed muszkami owocówkami).`);
  maintenanceChecklist.push(`Nigdy nie używaj metalowych sitek ani łyżek z reaktywnych metali (kwasowość koroduje nikiel/miedź).`);

  if (cultureType === 'KOMBUCHA_SCOBY_HOTEL') {
    maintenanceChecklist.push(`Usuwaj najstarsze, ściemniałe spodnie warstwy grzybka, pozostawiając młode, jasne krążki.`);
  }

  let expectedGrainGainGrams: number | undefined;
  if (grainWeightGrams && grainWeightGrams > 0) {
    // Typical grain growth is +15% per active cycle
    expectedGrainGainGrams = Math.round(grainWeightGrams * 0.15 * 10) / 10;
    maintenanceChecklist.push(`Przewidywany przyrost ziaren w kolejnym cyklu: +${expectedGrainGainGrams} g (+15%).`);
  }

  return {
    cultureType,
    cultureNamePl: config.namePl,
    daysSinceLastFed,
    healthStatus,
    statusLabelPl,
    feedingSchedule,
    daysUntilNextFeeding,
    isMoldHazard,
    isTrubPurgeRequired,
    expectedGrainGainGrams,
    statusMessagePl,
    maintenanceChecklist,
    actionAlerts,
  };
}
