// ============================================================================
// Apps4Brew Studio — FERMENT Kefir Grains Biomass & Fermentation Kinetics
// Milk kefir & Water kefir (Tibicos), kefiran matrix, 1F/2F and lactose digestion
// ============================================================================

export type KefirMediumType = 'MILK_KEFIR' | 'WATER_KEFIR_TIBICOS';

export type KefirHibernationMethod = 'FRIDGE_LIQUID' | 'FREEZER_DRY_POWDER' | 'DEHYDRATED';

export interface Kefir1FInput {
  medium: KefirMediumType;
  liquidVolumeMl: number;
  grainWeightGrams: number;
  ambientTempC: number;
  sugarConcentrationPct?: number; // dla water kefir (np. 6% = 60g cukru / 1L)
}

export interface Kefir1FResult {
  inoculationRatioPct: number;
  recommendedGrainWeightMinG: number;
  recommendedGrainWeightMaxG: number;
  estimatedFermentationHours: number;
  status: 'OPTIMAL' | 'OVER_INOCULATED' | 'UNDER_INOCULATED' | 'THERMAL_RISK';
  expectedLactoseReductionPct: number; // np. 75% w 1F
  biomassGrowthPotentialGrams: number;
  alertsPl: string[];
  alertsEn: string[];
  recommendationsPl: string[];
}

export interface Kefir2FInput {
  medium: KefirMediumType;
  ripenedLiquidVolumeMl: number;
  flavorAddition: 'CITRUS_PEEL' | 'BERRIES' | 'VANILLA_CHAI' | 'DRIED_FRUIT' | 'NONE';
  temperatureC: number;
  durationHours: number;
  isHermeticVessel: boolean;
}

export interface Kefir2FResult {
  carbonationLevelVol: number; // vol CO2
  finalLactoseReductionPct: number; // np. 92-95%
  folateIncreasePct: number; // witamina B9
  riskOfBottleBurst: boolean;
  alertsPl: string[];
  alertsEn: string[];
  servingNotesPl: string;
}

export interface KefirHibernationPlan {
  method: KefirHibernationMethod;
  storageDaysMax: number;
  mediumRequiredPl: string;
  reactivationStepsPl: string[];
}

/**
 * Kalkulacja parametrów fermentacji pierwotnej (1F) z ziarnami kefirowymi.
 */
export function calculateKefir1F(input: Kefir1FInput): Kefir1FResult {
  const volMl = Math.max(100, input.liquidVolumeMl);
  const grainsG = Math.max(1, input.grainWeightGrams);
  const temp = input.ambientTempC;
  const isMilk = input.medium === 'MILK_KEFIR';

  // Optymalny współczynnik inokulacji:
  // Mleczny kefir: 2.5% do 5.0% wagi (25-50g na 1L)
  // Wodny kefir: 5.0% do 10.0% wagi (50-100g na 1L)
  const minRatio = isMilk ? 2.5 : 5.0;
  const maxRatio = isMilk ? 5.0 : 10.0;
  const recommendedGrainWeightMinG = Math.round((volMl * minRatio) / 100);
  const recommendedGrainWeightMaxG = Math.round((volMl * maxRatio) / 100);

  const inoculationRatioPct = Number(((grainsG / volMl) * 100).toFixed(1));

  // Szacowany czas fermentacji na podstawie temperatury (baza 20°C = 24h dla optimum)
  // Kinetyka Q10 ~ 2.0
  let baseHours = 24;
  if (temp >= 26) {
    baseHours = 14;
  } else if (temp >= 23) {
    baseHours = 18;
  } else if (temp >= 20) {
    baseHours = 24;
  } else if (temp >= 17) {
    baseHours = 36;
  } else {
    baseHours = 48;
  }

  // Korekta o nadmiar/niedomiar ziaren
  let estimatedFermentationHours = Math.round(baseHours * (minRatio / Math.max(1, inoculationRatioPct)));
  estimatedFermentationHours = Math.max(8, Math.min(60, estimatedFermentationHours));

  const alertsPl: string[] = [];
  const alertsEn: string[] = [];
  const recommendationsPl: string[] = [];
  let status: Kefir1FResult['status'] = 'OPTIMAL';

  if (inoculationRatioPct > (isMilk ? 7.0 : 14.0)) {
    status = 'OVER_INOCULATED';
    alertsPl.push(
      isMilk
        ? 'Przeinokulowanie (>7%): Grozi szybkim rozwarstwieniem skrzepu na kwaśną serwatkę i grudki kazeiny (whey pocketing) w mniej niż 12h.'
        : 'Zbyt duża masa ziaren: Szybkie wyczerpanie cukru, wsad może stać się drożdżowy i agresywnie octowy.'
    );
    alertsEn.push(
      isMilk
        ? 'Over-inoculation (>7%): High risk of rapid curd/whey separation (whey pocketing) and sharp tartness within 12h.'
        : 'Excess grain biomass: Quick sugar depletion, leading to yeasty and overly acetic ferment.'
    );
    recommendationsPl.push('Oddziel nadmiar ziaren kefirowych i zamroź lub zjedz jako probiotyczną przekąskę.');
  } else if (inoculationRatioPct < (isMilk ? 1.5 : 3.0)) {
    status = 'UNDER_INOCULATED';
    alertsPl.push('Za mało ziaren: Fermentacja potrwa ponad 36h, co zwiększa ryzyko namnożenia bakterii gnilnych.');
    alertsEn.push('Under-inoculation: Fermentation will take over 36h, increasing risk of spoilage organisms.');
    recommendationsPl.push('Zmniejsz objętość płynu do czasu namnożenia biomasy ziaren.');
  }

  if (temp > 28.0) {
    status = 'THERMAL_RISK';
    alertsPl.push('Zbyt wysoka temperatura (>28°C): Drożdże kefirowe dominują nad bakteriami mlekowymi (smak alkoholowo-drożdżowy).');
    alertsEn.push('High temperature (>28°C): Yeasts outcompete lactic acid bacteria, yielding yeasty off-flavors.');
  } else if (temp < 16.0) {
    alertsPl.push('Niska temperatura (<16°C): Proces znacznie zwolni, kefir będzie łagodny i mniej gęsty.');
    alertsEn.push('Low temperature (<16°C): Sluggish fermentation, resulting in mild and thin kefir.');
  }

  // Przyrost biomasy ziaren: ~7% masy na dobę w optymalnych warunkach
  const biomassGrowthPotentialGrams = Number((grainsG * 0.07).toFixed(1));

  // Stopień rozkładu laktozy: 70-75% w 1F
  const expectedLactoseReductionPct = isMilk ? (status === 'OVER_INOCULATED' ? 82 : 72) : 100;

  return {
    inoculationRatioPct,
    recommendedGrainWeightMinG,
    recommendedGrainWeightMaxG,
    estimatedFermentationHours,
    status,
    expectedLactoseReductionPct,
    biomassGrowthPotentialGrams,
    alertsPl,
    alertsEn,
    recommendationsPl,
  };
}

/**
 * Obliczenia refermentacji wtórnej (2F) bez ziaren (nasycenie CO2, foliany, trawienie laktozy).
 */
export function calculateKefir2F(input: Kefir2FInput): Kefir2FResult {
  const isHermetic = input.isHermeticVessel;
  const hours = input.durationHours;
  const temp = input.temperatureC;

  // Akumulacja CO2 w szczelnej butelce:
  // Baza: 0.8 vol po 1F. W 2F w hermetycznym naczyniu przybiera 0.08 vol na godzinę przy 21°C
  const ratePerHr = 0.07 * (temp / 20.0);
  const carbonationLevelVol = isHermetic
    ? Number(Math.min(4.2, 0.8 + hours * ratePerHr).toFixed(2))
    : 1.0;

  const riskOfBottleBurst = isHermetic && carbonationLevelVol >= 3.6;

  const alertsPl: string[] = [];
  const alertsEn: string[] = [];

  if (riskOfBottleBurst) {
    alertsPl.push(`KRYTYCZNE CIŚNIENIE CO2 (${carbonationLevelVol} vol): Wysokie ryzyko eksplozji butelki szklanej! Odgazuj natychmiast lub schłódź do 4°C.`);
    alertsEn.push(`CRITICAL CO2 PRESSURE (${carbonationLevelVol} vol): High bottle explosion risk! Burp immediately or refrigerate at 4°C.`);
  }

  // W 2F bakterie nadal konsumują resztkową laktozę
  const finalLactoseReductionPct = Math.min(96, 75 + Math.round(hours * 0.9));

  // Synteza kwasu foliowego (B9) stymulowana obecnością owoców cytrusowych / jagód
  let folateIncreasePct = 40;
  if (input.flavorAddition === 'CITRUS_PEEL' || input.flavorAddition === 'BERRIES') {
    folateIncreasePct = 95;
  }

  const servingNotesPl = isHermetic
    ? 'Schłodź w lodówce przez 4-6 godzin przed otwarciem, aby gaz $CO_2$ rozpuścił się w płynie zamiast spowodować gejzer.'
    : 'Kefir otwarty 2F zyskuje aksamitną kremowość i łagodny, maślano-owocowy profil aromatyczny.';

  return {
    carbonationLevelVol,
    finalLactoseReductionPct,
    folateIncreasePct,
    riskOfBottleBurst,
    alertsPl,
    alertsEn,
    servingNotesPl,
  };
}

/**
 * Instrukcja uśpienia i regeneracji ziaren kefirowych.
 */
export function getKefirHibernationPlan(method: KefirHibernationMethod): KefirHibernationPlan {
  switch (method) {
    case 'FRIDGE_LIQUID':
      return {
        method: 'FRIDGE_LIQUID',
        storageDaysMax: 21,
        mediumRequiredPl: 'Słoik z mlekiem pełnym (lub 6% wodą z cukrem) w temp. 3–5°C',
        reactivationStepsPl: [
          '1. Wyjmij słoik z lodówki i odcedź ziarna na sitku nylonowym.',
          '2. Zalej świeżym mlekiem/wodą w temperaturze pokojowej.',
          '3. Pierwszą partię po uśpieniu potraktuj jako rozruchową (może być rzadsza).',
          '4. Od 2. partii ziarna odzyskują pełną moc probiotyczną i tempo zakwaszania.',
        ],
      };
    case 'FREEZER_DRY_POWDER':
      return {
        method: 'FREEZER_DRY_POWDER',
        storageDaysMax: 365,
        mediumRequiredPl: 'Ziarna opłukane, osuszone i obtoczone w mleku w proszku w szczelnym woreczku strunowym w -18°C',
        reactivationStepsPl: [
          '1. Rozmroź w lodówce przez 12 godzin.',
          '2. Wypłucz w letniej niechlorowanej wodzie.',
          '3. Zalej małą objętością mleka (200 ml) i zmieniaj co 24h przez 3 dni aż powróci zapach świeżego kefiru.',
        ],
      };
    case 'DEHYDRATED':
      return {
        method: 'DEHYDRATED',
        storageDaysMax: 540,
        mediumRequiredPl: 'Ziarna wysuszone na pergaminie w temperaturze pokojowej (do stanu żółtych kamyczków)',
        reactivationStepsPl: [
          '1. Zalej ziarna letnim mlekiem i odstaw na 24h.',
          '2. Zmieniaj mleko codziennie przez 4-7 dni.',
          '3. Gdy ziarna napęcznieją i zaczną ścinać mleko w 24h, są w pełni reaktywowane.',
        ],
      };
  }
}
