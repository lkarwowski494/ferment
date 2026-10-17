// ============================================================================
// Apps4Brew Studio — FERMENT Tempeh Solid-State Mycelium Fermentation Kinetics
// Rhizopus oligosporus/oryzae, Bacillus cereus hurdle, and exothermic burst curve
// ============================================================================

export type LegumeType = 'SOYBEAN' | 'CHICKPEA' | 'LENTIL' | 'BLACK_BEAN';

export type TempehPhase =
  | 'LAG_INOCULATION' // 0-12h: kiełkowanie zarodników, wymagane grzanie (30-32°C)
  | 'EXOTHERMIC_BURST' // 13-24h: eksplozja grzybni, grzanie metaboliczne (wyłącz inkubator!)
  | 'MATURE_DENSE_CAKE' // 25-32h: biały zwarty blok, szczyt aromatu grzybowo-orzechowego
  | 'OVER_MATURE_SPORULATED'; // >32h: zarodnikowanie (czarne plamki), amoniak

export interface TempehInput {
  dryLegumeWeightGrams: number;
  legumeType: LegumeType;
  soakVinegarMl5Pct?: number; // doza octu 5% do wody moczenia
  incubationHours: number;
  currentCoreTempC: number;
  ambientTempC: number;
  bagWidthCm?: number;
  bagLengthCm?: number;
}

export interface TempehResult {
  hydratedLegumeWeightGrams: number;
  recommendedStarterGrams: number;
  soakVinegarRecommendedMl: number;
  isSoakAcidSafe: boolean; // pH < 4.80 przeciw Bacillus cereus
  mycelialPhase: TempehPhase;
  phaseLabelPl: string;
  isExothermicBurstActive: boolean;
  recommendedIncubatorTempC: number;
  perforationHolesRecommended: number;
  thermalStatus: 'OPTIMAL' | 'TOO_COLD' | 'OVERHEATING_WARNING' | 'CRITICAL_DEATH';
  alertsPl: string[];
  alertsEn: string[];
  recommendationsPl: string[];
}

/**
 * Główny kalkulator kinetyki fermentacji tempehu.
 */
export function calculateTempehKinetics(input: TempehInput): TempehResult {
  const dryGrams = Math.max(50, input.dryLegumeWeightGrams);
  const hours = Math.max(0, input.incubationHours);
  const coreTemp = input.currentCoreTempC;
  const ambientTemp = input.ambientTempC;

  // Hydratacja ziaren: suche strączki wchłaniają ok. 110-120% wody (masa rośnie 2.1-2.2x)
  let hydrationFactor = 2.15;
  if (input.legumeType === 'CHICKPEA') hydrationFactor = 2.05;
  if (input.legumeType === 'LENTIL') hydrationFactor = 1.90;
  const hydratedLegumeWeightGrams = Math.round(dryGrams * hydrationFactor);

  // Dawka startera (Ragi Tempeh - Rhizopus oligosporus):
  // Standard to 1.5g do 2.0g na 500g suchych ziaren (~3-4g na 1kg)
  const recommendedStarterGrams = Number(((dryGrams / 500) * 1.8).toFixed(1));

  // Bezpieczeństwo biologiczne (Hurdle Technology):
  // Bacillus cereus jest patogenem formującym przetrwalniki, ginącym lub hamowanym poniżej pH 4.80.
  // Standard to 15 ml octu jabłkowego 5% na każde 500g suchych ziaren w wodzie do gotowania/moczenia.
  const soakVinegarRecommendedMl = Math.round((dryGrams / 500) * 15);
  const givenVinegar = input.soakVinegarMl5Pct ?? soakVinegarRecommendedMl;
  const isSoakAcidSafe = givenVinegar >= soakVinegarRecommendedMl * 0.8;

  // Wyznaczenie fazy wzrostu grzybni
  let mycelialPhase: TempehPhase = 'LAG_INOCULATION';
  let phaseLabelPl = 'Faza adaptacji (0–12h): kiełkowanie zarodników';
  let isExothermicBurstActive = false;
  let recommendedIncubatorTempC = 31.0;

  if (hours <= 12) {
    mycelialPhase = 'LAG_INOCULATION';
    phaseLabelPl = 'Faza adaptacji (0–12h): kiełkowanie zarodników';
    recommendedIncubatorTempC = 31.0;
  } else if (hours <= 24) {
    mycelialPhase = 'EXOTHERMIC_BURST';
    phaseLabelPl = 'Faza egzotermiczna (13–24h): gwałtowny rozrost grzybni i autogenne ciepło!';
    isExothermicBurstActive = true;
    // W fazie egzotermicznej grzybnia sama produkuje ciepło — inkubator obniżamy do 24-26°C lub wyłączamy
    recommendedIncubatorTempC = 25.0;
  } else if (hours <= 32) {
    mycelialPhase = 'MATURE_DENSE_CAKE';
    phaseLabelPl = 'Faza dojrzałości (25–32h): zwarty biały blok, aromat świeżych pieczarek';
    recommendedIncubatorTempC = 24.0;
  } else {
    mycelialPhase = 'OVER_MATURE_SPORULATED';
    phaseLabelPl = 'Faza przejrzała (>32h): zarodnikowanie, szary nalot, zapach amoniaku';
    recommendedIncubatorTempC = 4.0; // nakaz natychmiastowego chłodzenia
  }

  // Rekomendowane otwory perforacyjne w torebce (siatka 1.5 cm x 1.5 cm)
  const bagW = input.bagWidthCm ?? 15;
  const bagL = input.bagLengthCm ?? 20;
  const bagAreaCm2 = bagW * bagL;
  const perforationHolesRecommended = Math.round(bagAreaCm2 / 2.25); // 1 otwór co 2.25 cm²

  // Ocena termiczna rdzenia wsadu
  let thermalStatus: TempehResult['thermalStatus'] = 'OPTIMAL';
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];
  const recommendationsPl: string[] = [];

  if (!isSoakAcidSafe) {
    alertsPl.push('KRYTYCZNE RYZYKO BIOLOGICZNE: Brak zakwaszenia wsadu octem (<pH 4.80). Ryzyko namnożenia laseczek Bacillus cereus!');
    alertsEn.push('CRITICAL BIO-SAFETY HAZARD: Inadequate vinegar acidification (<pH 4.80). High risk of Bacillus cereus proliferation!');
  }

  if (coreTemp >= 42.0) {
    thermalStatus = 'CRITICAL_DEATH';
    alertsPl.push(`KRYTYCZNE PRZEGRZANIE RDZENIA (${coreTemp}°C): Grzybnia Rhizopus obumiera powyżej 42°C! Nastąpi gnicie bakteryjne.`);
    alertsEn.push(`CRITICAL CORE OVERHEATING (${coreTemp}°C): Rhizopus mycelium dies above 42°C! Bacterial rot and liquefaction will ensue.`);
    recommendationsPl.push('Wyjmij torebki z inkubatora na ruszt, rozsuń je i skieruj delikatny nawiew chłodnego powietrza.');
  } else if (coreTemp >= 38.0) {
    thermalStatus = 'OVERHEATING_WARNING';
    alertsPl.push(`Ostrzeżenie o przegrzaniu (${coreTemp}°C): Zbliżasz się do progu przedwczesnego zarodnikowania (czarne plamy zarodni).`);
    alertsEn.push(`Overheating warning (${coreTemp}°C): Approaching premature sporulation threshold (black sporangia formation).`);
    recommendationsPl.push('Wyłącz dogrzewanie inkubatora. Pozwól grzybni grzać się własnym metabolizmem.');
  } else if (coreTemp < 27.0 && hours <= 24) {
    thermalStatus = 'TOO_COLD';
    alertsPl.push(`Za niska temperatura (${coreTemp}°C): Grzybnia rozwija się powoli, woda może kondensować na ziarnach.`);
    alertsEn.push(`Low temperature (${coreTemp}°C): Slow mycelial colonization, risk of condensation and bacterial slip.`);
    recommendationsPl.push('Podnieś temperaturę inkubatora do 31°C.');
  }

  if (isExothermicBurstActive) {
    recommendationsPl.push('Zapewnij odstęp min. 3 cm między torebkami — stykające się bloki mogą się wzajemnie ugotować.');
  }

  return {
    hydratedLegumeWeightGrams,
    recommendedStarterGrams,
    soakVinegarRecommendedMl,
    isSoakAcidSafe,
    mycelialPhase,
    phaseLabelPl,
    isExothermicBurstActive,
    recommendedIncubatorTempC,
    perforationHolesRecommended,
    thermalStatus,
    alertsPl,
    alertsEn,
    recommendationsPl,
  };
}
