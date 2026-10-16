// ============================================================================
// Apps4Brew Studio — FERMENT Q10 Temperature Kinetics Engine
// Dynamic fermentation velocity, Arrhenius/Q10 scaling & ambient temperature safety
// ============================================================================

export type FermentCultureType = 'VEG_LAB' | 'KOMBUCHA_SCOBY' | 'VINEGAR_ACETIC' | 'CHEESE_MESOPHILIC';

export interface Q10KineticsParams {
  cultureType: FermentCultureType;
  ambientTempC: number;
  nominalDaysAt20C: number;
}

export interface Q10KineticsResult {
  cultureType: FermentCultureType;
  ambientTempC: number;
  nominalDays: number;
  adjustedDays: number;
  adjustedHours: number;
  velocityMultiplier: number;
  zone: 'DORMANT_SLUGGISH' | 'SLOW_CRISP' | 'GOLDILOCKS_OPTIMAL' | 'RAPID_ACCELERATED' | 'HEAT_STRESS_SPOILAGE';
  zoneLabel: string;
  botulinumSafeHourEstimated: number; // expected hour when pH crosses <= 4.60
  flavorProfileImpact: string;
  technicalRecommendations: string[];
}

/**
 * Default Q10 coefficients by culture
 */
const DEFAULT_Q10: Record<FermentCultureType, number> = {
  VEG_LAB: 2.2,
  KOMBUCHA_SCOBY: 2.0,
  VINEGAR_ACETIC: 1.9,
  CHEESE_MESOPHILIC: 2.1,
};

/**
 * Calculates adjusted fermentation duration based on ambient temperature using the Q10 rule
 */
export function calculateFermentationQ10(params: Q10KineticsParams): Q10KineticsResult {
  const { cultureType, ambientTempC, nominalDaysAt20C } = params;

  if (nominalDaysAt20C <= 0) {
    throw new Error('Nominalny czas fermentacji musi być większy od zera.');
  }

  const q10 = DEFAULT_Q10[cultureType] || 2.1;
  const deltaT = ambientTempC - 20.0;
  // Velocity relative to 20°C: v = Q10 ^ (deltaT / 10)
  const velocityMultiplier = Math.round(Math.pow(q10, deltaT / 10) * 100) / 100;
  const safeVelocity = Math.max(0.1, velocityMultiplier);

  const adjustedHoursRaw = (nominalDaysAt20C * 24) / safeVelocity;
  const adjustedHours = Math.round(adjustedHoursRaw);
  const adjustedDays = Math.round((adjustedHoursRaw / 24) * 10) / 10;

  // Baseline 20°C botulinum milestone is typically 42 hours
  const botulinumSafeHourEstimated = Math.round(42 / safeVelocity);

  let zone: Q10KineticsResult['zone'] = 'GOLDILOCKS_OPTIMAL';
  let zoneLabel = '';
  let flavorProfileImpact = '';
  const technicalRecommendations: string[] = [];

  if (ambientTempC < 15.0) {
    zone = 'DORMANT_SLUGGISH';
    zoneLabel = 'Strefa Uśpienia / Spowolnienia (<15°C)';
    flavorProfileImpact =
      'Bakterie pracują bardzo wolno. Wydłużony czas namnażania sprzyja wyrazistemu, czystemu profilowi, ale zwiększa ryzyko pleśni powierzchniowej przed zakwaszeniem.';
    technicalRecommendations.push(
      'Upewnij się, że warzywa są szczelnie dociśnięte kamieniem pod solanką.',
      'Rozważ przeniesienie słoja do cieplejszego pomieszczenia na pierwsze 24h (kickstart).'
    );
  } else if (ambientTempC < 19.0) {
    zone = 'SLOW_CRISP';
    zoneLabel = 'Strefa Chłodna & Chrupka (15–18°C)';
    flavorProfileImpact =
      'Optymalne warunki dla Leuconostoc mesenteroides. Zachowuje najwyższą chrupkość warzyw, daje delikatną, maślaną kwasowość bez ostrych nut.';
    technicalRecommendations.push(
      'Doskonała temperatura dla tradycyjnych ogórków kiszonych i kapusty.',
      'Fermentacja potrwa około 20–40% dłużej niż standardowo.'
    );
  } else if (ambientTempC <= 23.0) {
    zone = 'GOLDILOCKS_OPTIMAL';
    zoneLabel = 'Złoty Środek / Wzorcowa (19–23°C)';
    flavorProfileImpact =
      'Zrównoważona sukcesja mikrobiologiczna. Szybki spadek pH poniżej 4.60 w ciągu pierwszych 36–48h gwarantuje pełne bezpieczeństwo biologiczne.';
    technicalRecommendations.push(
      'Wzorcowa temperatura pokojowa. Nie wymaga korekt termicznych.'
    );
  } else if (ambientTempC <= 27.0) {
    zone = 'RAPID_ACCELERATED';
    zoneLabel = 'Strefa Przyspieszona (24–27°C)';
    flavorProfileImpact =
      'Gwałtowna produkcja CO2 i szybki spadek pH. Dominacja Lactobacillus plantarum; smak wyraźnie kwaśny i ostry, ryzyko rozmiękania tkanek przy soli <2.0%.';
    technicalRecommendations.push(
      'Kontroluj naczynie codziennie — wysokie ciśnienie gazu wymaga częstego odgazowywania.',
      'Po osiągnięciu pożądanej kwasowości natychmiast schłodź naczynie do 4–8°C.'
    );
  } else {
    zone = 'HEAT_STRESS_SPOILAGE';
    zoneLabel = 'Zagrożenie Termiczne & Zepsucie (>27°C)';
    flavorProfileImpact =
      'Zbyt wysoka temperatura sprzyja dzikim drożdżom tlenowym, nadmiernemu śluzowaceniu (dekstran) oraz utracie chrupkości (aktywność enzymów pektynazy).';
    technicalRecommendations.push(
      'Krytyczne: Przenieś naczynie natychmiast do chłodniejszego miejsca!',
      'Zwiększ stężenie soli do min. 2.5–3.0%, aby zahamować rozmiękanie pektyn.'
    );
  }

  return {
    cultureType,
    ambientTempC,
    nominalDays: nominalDaysAt20C,
    adjustedDays,
    adjustedHours,
    velocityMultiplier,
    zone,
    zoneLabel,
    botulinumSafeHourEstimated,
    flavorProfileImpact,
    technicalRecommendations,
  };
}
