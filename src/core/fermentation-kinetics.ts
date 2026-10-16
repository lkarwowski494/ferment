// ============================================================================
// Apps4Brew Studio — FERMENT Fermentation Kinetics & Vinegar Acidity Engine
// Lactic Acid Bacteria (LAB) acidification curve, botulinum milestones & Titratable Acidity
// ============================================================================

export interface LabKineticsPoint {
  hoursElapsed: number;
  expectedPh: number;
  dominantBacteria: string;
  phaseDescription: string;
}

export interface LabFermentEvaluation {
  hoursElapsed: number;
  measuredPh: number;
  expectedPh: number;
  isBotulinumSafe: boolean; // pH <= 4.60
  isAcidificationOnTrack: boolean;
  status: 'OPTIMAL' | 'SLOW_RISK' | 'CRITICAL_HAZARD';
  message: string;
  recommendedAction: string;
}

export interface VinegarTitrationResult {
  vinegarSampleVolumeMl: number;
  naohTiterVolumeMl: number; // Volume of 0.1M NaOH used to reach end point
  aceticAcidPercentage: number; // % w/v acetic acid
  isFoodGradeSafe: boolean;      // >= 5.0%
  classification: 'SUB_STANDARD' | 'TABLE_VINEGAR' | 'PICKLING_STRENGTH';
  notes: string;
}

/**
 * Evaluates current lactic acid fermentation stage against microbiological benchmark curve.
 * Baseline curve:
 * 0h: pH 6.5 (raw vegetable)
 * 24h: pH 5.2 (Leuconostoc startup)
 * 48h: pH 4.4 (Crosses botulinum barrier 4.60)
 * 72h: pH 3.9 (Lactobacillus plantarum dominance)
 * 120h+: pH 3.6 (Terminal plateau)
 */
export function evaluateLabFermentation(hoursElapsed: number, measuredPh: number): LabFermentEvaluation {
  const safeHours = Math.max(0, hoursElapsed);
  const safePh = Math.max(2.5, Math.min(8.0, measuredPh));

  // Calculate expected theoretical pH at this time point
  let expectedPh = 6.5;
  if (safeHours <= 24) {
    expectedPh = 6.5 - (safeHours / 24) * 1.3; // 6.5 down to 5.2
  } else if (safeHours <= 48) {
    expectedPh = 5.2 - ((safeHours - 24) / 24) * 0.8; // 5.2 down to 4.4
  } else if (safeHours <= 72) {
    expectedPh = 4.4 - ((safeHours - 48) / 24) * 0.5; // 4.4 down to 3.9
  } else {
    expectedPh = Math.max(3.5, 3.9 - ((safeHours - 72) / 96) * 0.3); // 3.9 down to 3.6
  }
  expectedPh = Math.round(expectedPh * 100) / 100;

  const isBotulinumSafe = safePh <= 4.60;

  // Critical hazard: more than 72 hours and still pH > 4.60
  if (safeHours >= 72 && !isBotulinumSafe) {
    return {
      hoursElapsed: safeHours,
      measuredPh: safePh,
      expectedPh,
      isBotulinumSafe: false,
      isAcidificationOnTrack: false,
      status: 'CRITICAL_HAZARD',
      message: `ZAGROŻENIE BIOLOGICZNE! Po ${safeHours}h pH wynosi ${safePh} (>4.60). Bakterie kwasu mlekowego nie zdominowały wsadu.`,
      recommendedAction: 'Nie spożywać na surowo. Dodaj zakwaszonej solanki lub natychmiast zutylizuj, jeśli wyczuwalny jest zapach gnilny.',
    };
  }

  // Slow risk: after 48h pH is still > 5.0
  if (safeHours >= 48 && safePh > 5.0) {
    return {
      hoursElapsed: safeHours,
      measuredPh: safePh,
      expectedPh,
      isBotulinumSafe: false,
      isAcidificationOnTrack: false,
      status: 'SLOW_RISK',
      message: `Spowolnione zakwaszanie (pH ${safePh}, oczekiwane ~${expectedPh}). Ryzyko zbyt niskiej temperatury lub chlorowanej wody.`,
      recommendedAction: 'Przenieś naczynie do cieplejszego miejsca (21–23°C). Upewnij się, że warzywa są w 100% zanurzone pod solanką.',
    };
  }

  return {
    hoursElapsed: safeHours,
    measuredPh: safePh,
    expectedPh,
    isBotulinumSafe,
    isAcidificationOnTrack: true,
    status: 'OPTIMAL',
    message: isBotulinumSafe
      ? `Fermentacja bezpieczna (pH ${safePh} <= 4.60). Bariera Clostridium botulinum aktywna.`
      : `Prawidłowy start fermentacji (pH ${safePh}). Trwa faza namnażania Leuconostoc.`,
    recommendedAction: isBotulinumSafe
      ? 'Pozwól na dalszy rozwój smaku lub przenieś do chłodu (piwniczka/lodówka 4–10°C) aby zahamować przekwaszenie.'
      : 'Utrzymuj naczynie zamknięte w temperaturze 19–22°C bez dostępu tlenu.',
  };
}

/**
 * Calculates titratable acetic acid percentage of artisan living vinegar
 * using standard 0.1 M NaOH titration:
 * % Acetic Acid = (V_naoh * 0.1 * 0.06005 * 100) / V_sample
 */
export function calculateVinegarTitration(
  sampleVolumeMl: number,
  naohTiterVolumeMl: number
): VinegarTitrationResult {
  const safeSample = Math.max(1.0, sampleVolumeMl);
  const safeTiter = Math.max(0.1, naohTiterVolumeMl);

  // 1 ml of 0.1 M NaOH neutralizes 0.0060052 g of acetic acid
  const aceticAcidGrams = safeTiter * 0.0060052;
  const aceticAcidPct = Math.round(((aceticAcidGrams / safeSample) * 100.0) * 100) / 100;

  const isFoodGradeSafe = aceticAcidPct >= 5.0;

  let classification: VinegarTitrationResult['classification'] = 'TABLE_VINEGAR';
  let notes = '';

  if (aceticAcidPct < 5.0) {
    classification = 'SUB_STANDARD';
    notes = `Kwasowość ${aceticAcidPct}% jest poniżej standardu octu spożywczego (min. 5.0%). Ocet jest łagodny, ale mniej trwały w długim przechowywaniu.`;
  } else if (aceticAcidPct >= 6.0) {
    classification = 'PICKLING_STRENGTH';
    notes = `Wysoka kwasowość ${aceticAcidPct}%. Doskonały do marynat, konserwacji przetworów i długiego leżakowania.`;
  } else {
    classification = 'TABLE_VINEGAR';
    notes = `Optymalny ocet stołowy (${aceticAcidPct}% kwasu octowego). Zbalansowany aromat i pełne bezpieczeństwo mikrobiologiczne.`;
  }

  return {
    vinegarSampleVolumeMl: safeSample,
    naohTiterVolumeMl: safeTiter,
    aceticAcidPercentage: aceticAcidPct,
    isFoodGradeSafe,
    classification,
    notes,
  };
}
