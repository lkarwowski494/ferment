// ============================================================================
// Apps4Brew Studio — FERMENT Vinegar Grain Strength & Aeration Standardization
// Grain rating (10 grain = 1%), Pearson square dilution, stoichiometry, and A/V surface aeration
// ============================================================================

export interface VinegarStandardizationInput {
  rawAcidityPct: number; // np. 7.2% (72 grain)
  rawVolumeLiters: number; // np. 5.0 L
  targetAcidityPct: number; // np. 5.0% (50 grain)
  dilutionLiquid: 'DISTILLED_WATER' | 'APPLE_CIDER_MUST' | 'WINE_BASE';
  dilutionLiquidAcidityPct?: number; // np. 0.0% dla wody, 0.6% dla soku jabłkowego
}

export interface VinegarDilutionResult {
  rawGrainStrength: number;
  targetGrainStrength: number;
  dilutionLiquidVolumeLiters: number;
  totalFinishedVolumeLiters: number;
  finishedGrainStrength: number;
  isDilutionNeeded: boolean;
  legalFoodGradeClassification: 'SUB_STANDARD_LOW' | 'STANDARD_TABLE_50_GRAIN' | 'PICKLING_PRESERVE_60_GRAIN' | 'EXTRA_STRONG_SPECIALTY';
  classificationLabelPl: string;
  motherPreservationAdvice: string;
}

export interface VinegarStoichiometryInput {
  initialAbvPct: number; // np. 6.5% ABV cydru
  batchVolumeLiters: number; // np. 10 L
  biologicalEfficiencyPct?: number; // np. 85% (typowa dla kultur Acetobacter)
}

export interface VinegarStoichiometryResult {
  initialAbvPct: number;
  theoreticalMaxAcidityPct: number;
  expectedActualAcidityPct: number;
  expectedGrainStrength: number;
  isAlcoholTooHighWarning: boolean; // > 8.0% ABV hamuje bakterie octowe
  isAlcoholTooLowWarning: boolean; // < 4.0% ABV daje ocet nietrwały
  potentialSpoilageRisk: string | null;
  recommendedAdjustments: string[];
}

export interface VesselAerationInput {
  vesselType: 'WIDE_CROCK' | 'DEMIJOHN_CARBOY' | 'GLASS_JAR' | 'SHALLOW_OAK_BARREL';
  surfaceDiameterCm: number; // Średnica lustra cieczy w cm
  liquidVolumeLiters: number; // Objętość cieczy w L
}

export interface VesselAerationResult {
  surfaceAreaCm2: number;
  surfaceToVolumeRatioCm2PerLiter: number;
  aerationRating: 'STAGNANT_SUFFOCATION' | 'MODERATE_SLOW' | 'OPTIMAL_ARTISAN' | 'EXCESSIVE_EVAPORATION';
  ratingLabelPl: string;
  estimatedFermentationWeeks: { min: number; max: number };
  motherPellicleHealthAdvice: string;
  actionableRecommendations: string[];
}

/**
 * Calculates Pearson square dilution for standardizing vinegar grain strength.
 */
export function calculateVinegarStandardization(
  input: VinegarStandardizationInput
): VinegarDilutionResult {
  const {
    rawAcidityPct,
    rawVolumeLiters,
    targetAcidityPct,
    dilutionLiquid,
    dilutionLiquidAcidityPct = 0,
  } = input;

  const rawGrain = Math.round(rawAcidityPct * 10 * 10) / 10;
  const targetGrain = Math.round(targetAcidityPct * 10 * 10) / 10;
  const diluentAcidity = dilutionLiquid === 'DISTILLED_WATER' ? 0 : Math.max(0, dilutionLiquidAcidityPct);

  if (rawAcidityPct <= targetAcidityPct) {
    let classification: VinegarDilutionResult['legalFoodGradeClassification'] = 'STANDARD_TABLE_50_GRAIN';
    let classLabel = 'Ocet stołowy (5% / 50 grain)';
    if (rawGrain < 40) {
      classification = 'SUB_STANDARD_LOW';
      classLabel = 'Poniżej normy spożywczej (<4% kwasu octowego)';
    } else if (rawGrain >= 60) {
      classification = 'PICKLING_PRESERVE_60_GRAIN';
      classLabel = 'Ocet konserwowy / piklowy (6% / 60 grain)';
    }

    return {
      rawGrainStrength: rawGrain,
      targetGrainStrength: targetGrain,
      dilutionLiquidVolumeLiters: 0,
      totalFinishedVolumeLiters: rawVolumeLiters,
      finishedGrainStrength: rawGrain,
      isDilutionNeeded: false,
      legalFoodGradeClassification: classification,
      classificationLabelPl: classLabel,
      motherPreservationAdvice: 'Rozcieńczanie nie jest wymagane — ocet ma kwasowość równą lub niższą od docelowej.',
    };
  }

  // Pearson square: V_diluent = V_raw * (C_raw - C_target) / (C_target - C_diluent)
  const numerator = rawAcidityPct - targetAcidityPct;
  const denominator = Math.max(0.1, targetAcidityPct - diluentAcidity);
  const diluentVolume = Math.round((rawVolumeLiters * (numerator / denominator)) * 100) / 100;
  const totalVolume = Math.round((rawVolumeLiters + diluentVolume) * 100) / 100;

  let legalClassification: VinegarDilutionResult['legalFoodGradeClassification'] = 'STANDARD_TABLE_50_GRAIN';
  let labelPl = 'Ocet stołowy konsumpcyjny (50 Grain / 5.0%)';

  if (targetGrain >= 60) {
    legalClassification = 'PICKLING_PRESERVE_60_GRAIN';
    labelPl = 'Mocny ocet marynatowy do przetworów (60 Grain / 6.0%)';
  } else if (targetGrain < 45) {
    legalClassification = 'SUB_STANDARD_LOW';
    labelPl = 'Ocet lekki / stołowy delikatny (<50 Grain)';
  }

  return {
    rawGrainStrength: rawGrain,
    targetGrainStrength: targetGrain,
    dilutionLiquidVolumeLiters: diluentVolume,
    totalFinishedVolumeLiters: totalVolume,
    finishedGrainStrength: targetGrain,
    isDilutionNeeded: true,
    legalFoodGradeClassification: legalClassification,
    classificationLabelPl: labelPl,
    motherPreservationAdvice:
      'Zalecenie rzemieślnicze: przed rozcieńczeniem odlej 15-20% surowego nierościeńczonego octu wraz z matką octową jako aktywny starter (mother liquor) do kolejnego nastawu!',
  };
}

/**
 * Calculates stoichiometric yield from ethanol to acetic acid via Acetobacter metabolism.
 */
export function calculateVinegarStoichiometry(
  input: VinegarStoichiometryInput
): VinegarStoichiometryResult {
  const { initialAbvPct, biologicalEfficiencyPct = 85 } = input;

  // Theoretical max: 1% ABV (0.789 g ethanol/100ml) converts to approx 1.03% w/v acetic acid
  // 1 g ethanol -> 1.303 g acetic acid:
  const theoreticalMax = Math.round(initialAbvPct * 1.05 * 100) / 100;
  const actualYieldPct = Math.max(0.5, Math.min(1.0, biologicalEfficiencyPct / 100));
  const expectedAcidity = Math.round(theoreticalMax * actualYieldPct * 100) / 100;
  const expectedGrain = Math.round(expectedAcidity * 10 * 10) / 10;

  const isAlcoholTooHigh = initialAbvPct > 8.0;
  const isAlcoholTooLow = initialAbvPct < 4.0;

  let potentialSpoilageRisk: string | null = null;
  const recommendedAdjustments: string[] = [];

  if (isAlcoholTooHigh) {
    potentialSpoilageRisk =
      'Inhibicja bakterii octowych: stężenie alkoholu > 8.0% ABV uszkadza błony komórkowe Acetobacter. Fermentacja zatrzyma się, a nastaw zepsuje się z zapachem octanu etylu (rozpuszczalnika).';
    recommendedAdjustments.push(
      `Rozcieńcz nastaw niechlorowaną wodą lub sokiem owocowym do stężenia 5.0–6.5% ABV przed zaszczepieniem matką octową.`
    );
  } else if (isAlcoholTooLow) {
    potentialSpoilageRisk =
      'Niska trwałość biologiczna: stężenie alkoholu < 4.0% ABV da ocet o kwasowości poniżej 3.5%, podatny na zakażenia grzybami powierzchniowymi (pleśń i drożdże kożuchujące Kahm).';
    recommendedAdjustments.push(
      'Wzmocnij nastaw dodatkiem miodu lub cukru, aby początkowy cydr/wino osiągnęło minimum 5.0% ABV.'
    );
  } else {
    recommendedAdjustments.push(
      'Idealne stężenie alkoholu (5.0–7.0% ABV) zapewniające dynamiczną pracę bakterii i trwały ocet > 5% kwasowości.'
    );
  }

  return {
    initialAbvPct,
    theoreticalMaxAcidityPct: theoreticalMax,
    expectedActualAcidityPct: expectedAcidity,
    expectedGrainStrength: expectedGrain,
    isAlcoholTooHighWarning: isAlcoholTooHigh,
    isAlcoholTooLowWarning: isAlcoholTooLow,
    potentialSpoilageRisk,
    recommendedAdjustments,
  };
}

/**
 * Analyzes vessel geometry, surface area of liquid-air interface, and aerobic kinetics.
 */
export function calculateVesselAeration(input: VesselAerationInput): VesselAerationResult {
  const { surfaceDiameterCm, liquidVolumeLiters } = input;

  const radiusCm = surfaceDiameterCm / 2;
  const surfaceAreaCm2 = Math.round(Math.PI * radiusCm * radiusCm * 10) / 10;
  const safeVolume = Math.max(0.1, liquidVolumeLiters);
  const ratio = Math.round((surfaceAreaCm2 / safeVolume) * 10) / 10;

  let rating: VesselAerationResult['aerationRating'] = 'OPTIMAL_ARTISAN';
  let ratingLabelPl = 'Optymalne natlenienie rzemieślnicze (3-5 tygodni)';
  let minWeeks = 3;
  let maxWeeks = 5;
  let advice = 'Znakomita dynamika tworzenia celulozowej matki octowej i szybka oksydacja tlenowa.';
  const recommendations: string[] = [];

  if (ratio < 25) {
    rating = 'STAGNANT_SUFFOCATION';
    ratingLabelPl = 'Krytyczny brak tlenu (Dusiąca się matka octowa)';
    minWeeks = 12;
    maxWeeks = 24;
    advice =
      'Wąska szyjka naczynia (np. gąsior/balon) drastycznie ogranicza dyfuzję tlenu. Bakterie octowe są ściśle tlenowe!';
    recommendations.push(
      'Przelej nastaw do szerokiego słoja lub kamionki z dużą powierzchnią lustra cieczy.'
    );
    recommendations.push(
      'Jeśli musisz fermentować w balonie, zainstaluj akwarystyczną pompkę napowietrzającą ze sterylnym filtrem HEPA.'
    );
  } else if (ratio < 60) {
    rating = 'MODERATE_SLOW';
    ratingLabelPl = 'Umiarkowane, powolne tempo (6-10 tygodni)';
    minWeeks = 6;
    maxWeeks = 10;
    advice = 'Powierzchnia wystarczająca do powolnej fermentacji orleańskiej (Orléans method).';
    recommendations.push(
      'Zabezpiecz naczynie gęstą tkaniną bawełnianą lub lnem — nie stosuj rurki fermentacyjnej z wodą!'
    );
  } else if (ratio > 180) {
    rating = 'EXCESSIVE_EVAPORATION';
    ratingLabelPl = 'Nadmierna ewaporacja (Ryzyko utraty kwasu i wyschnięcia)';
    minWeeks = 2;
    maxWeeks = 4;
    advice = 'Bardzo płytka warstwa cieczy — szybka fermentacja, ale wysokie straty parowania.';
    recommendations.push(
      'Kontroluj poziom cieczy co tydzień; uzupełniaj odparowany płyn cydrem lub wodą.'
    );
  } else {
    recommendations.push(
      'Trzymaj naczynie w ciemnym, ciepłym miejscu (22-26°C) z dala od bezpośrednich promieni słonecznych.'
    );
    recommendations.push(
      'Nie ruszaj ani nie potrząsaj naczyniem podczas tworzenia się cienkiej błonki matki octowej.'
    );
  }

  return {
    surfaceAreaCm2,
    surfaceToVolumeRatioCm2PerLiter: ratio,
    aerationRating: rating,
    ratingLabelPl,
    estimatedFermentationWeeks: { min: minWeeks, max: maxWeeks },
    motherPellicleHealthAdvice: advice,
    actionableRecommendations: recommendations,
  };
}
