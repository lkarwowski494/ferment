// ============================================================================
// Apps4Brew Studio — SEROWAR Propionic Warm Room & Eye Formation Engine
// Kinetics of Propionibacterium freudenreichii fermentation, CO2 gas production,
// dome swelling, and 3-stage thermal affinage for Swiss/Alpine cheeses.
// ============================================================================

export type PropionicCheeseStyle = 'EMMENTALER' | 'MAASDAM' | 'JARLSBERG' | 'APPENZELLER';

export type PropionicStage = 'PRE_COOLING' | 'WARM_ROOM_ACTIVE' | 'POST_COOLING_STABILIZATION';

export interface PropionicChamberParams {
  cheeseStyle: PropionicCheeseStyle;
  initialWeightKg: number;
  currentDayInWarmRoom: number;
  tempCelsius: number;
  relativeHumidityPct: number;
  measuredDomeExpansionMm: number; // Vertical rise in center of cheese wheel
}

export interface PropionicKineticsResult {
  currentStage: PropionicStage;
  recommendedDurationDays: number;
  daysRemainingInStage: number;
  estimatedCo2LitersProduced: number;
  estimatedAverageEyeDiameterMm: number;
  targetEyeDiameterRangeMm: [number, number];
  domeExpansionMm: number;
  maxSafeExpansionMm: number;
  swellingSafetyStatus: 'SAFE' | 'ACTIVE_SWELLING' | 'TRANSFER_IMMINENT' | 'BLOWOUT_CRITICAL';
  shrinkageWeightLossPct: number;
  estimatedCurrentWeightKg: number;
  thermalActionRecommendation: string;
  careInstructions: string;
}

export interface EyeDistributionAnalysis {
  measuredDiametersMm: number[];
  style: PropionicCheeseStyle;
  averageDiameterMm: number;
  uniformityIndexPct: number; // 0..100%
  conformanceStatus: 'PERFECT' | 'UNDER_DEVELOPED' | 'OVER_EXPANDED' | 'IRREGULAR_PINHOLES';
  feedback: string;
}

const STYLE_PROFILES: Record<
  PropionicCheeseStyle,
  {
    warmRoomTempRange: [number, number];
    warmRoomDays: number;
    targetEyeRangeMm: [number, number];
    maxExpansionMm: number;
    co2YieldPerKg: number; // Liters of CO2 per kg of cheese matrix
  }
> = {
  EMMENTALER: {
    warmRoomTempRange: [21, 24],
    warmRoomDays: 35,
    targetEyeRangeMm: [15, 30],
    maxExpansionMm: 22,
    co2YieldPerKg: 3.5,
  },
  MAASDAM: {
    warmRoomTempRange: [20, 23],
    warmRoomDays: 24,
    targetEyeRangeMm: [10, 22],
    maxExpansionMm: 16,
    co2YieldPerKg: 2.8,
  },
  JARLSBERG: {
    warmRoomTempRange: [19, 22],
    warmRoomDays: 28,
    targetEyeRangeMm: [8, 18],
    maxExpansionMm: 14,
    co2YieldPerKg: 2.4,
  },
  APPENZELLER: {
    warmRoomTempRange: [18, 20],
    warmRoomDays: 18,
    targetEyeRangeMm: [4, 10],
    maxExpansionMm: 8,
    co2YieldPerKg: 1.2,
  },
};

/**
 * Calculates warm room fermentation kinetics, gas volume, eye diameter, and stage progression.
 */
export function calculatePropionicKinetics(params: PropionicChamberParams): PropionicKineticsResult {
  const profile = STYLE_PROFILES[params.cheeseStyle] || STYLE_PROFILES.MAASDAM;
  const day = Math.max(0, params.currentDayInWarmRoom);
  const weight = Math.max(0.5, params.initialWeightKg);
  const expansion = Math.max(0, params.measuredDomeExpansionMm);

  // Stage determination
  let currentStage: PropionicStage = 'WARM_ROOM_ACTIVE';
  let daysRemaining = Math.max(0, profile.warmRoomDays - day);

  if (day === 0) {
    currentStage = 'PRE_COOLING';
  } else if (day >= profile.warmRoomDays || expansion >= profile.maxExpansionMm * 0.95) {
    currentStage = 'POST_COOLING_STABILIZATION';
    daysRemaining = 0;
  }

  // Kinetics progression ratio (0.0 .. 1.0)
  const progression = Math.min(1.0, day / profile.warmRoomDays);

  // Temperature acceleration / deceleration factor (Q10 ~ 2.0 around 22°C)
  const tempDelta = params.tempCelsius - 22;
  const tempSpeedFactor = Math.max(0.2, Math.min(2.0, Math.pow(1.08, tempDelta)));

  // Total CO2 volume: W * yield * progression * tempSpeed
  const totalPotentialCo2 = weight * profile.co2YieldPerKg;
  const estimatedCo2LitersProduced = Number((totalPotentialCo2 * progression * tempSpeedFactor).toFixed(1));

  // Eye diameter estimation
  const minTarget = profile.targetEyeRangeMm[0];
  const maxTarget = profile.targetEyeRangeMm[1];
  const eyeGrowthRatio = Math.min(1.15, Math.max(expansion / profile.maxExpansionMm, progression));
  const estimatedAverageEyeDiameterMm = Number((minTarget + (maxTarget - minTarget) * eyeGrowthRatio).toFixed(1));

  // Swelling safety assessment
  const expansionRatio = expansion / profile.maxExpansionMm;
  let swellingSafetyStatus: PropionicKineticsResult['swellingSafetyStatus'] = 'SAFE';
  let thermalActionRecommendation = 'Utrzymuj temperaturę w komorze ciepłej. Obracaj krążek codziennie.';
  let careInstructions = 'Myj skórkę 12% solanką 2 razy w tygodniu, aby zapobiec wysychaniu pęczniejącej powierzchni.';

  if (expansionRatio > 1.15) {
    swellingSafetyStatus = 'BLOWOUT_CRITICAL';
    thermalActionRecommendation = 'NATYCHMIAST PRZENIEŚ SER DO CHŁODNI (8-10°C)! Skrajne ryzyko pęknięcia skórki (Blowout).';
    careInstructions = 'Zatrzymaj fermentację propionową. Zabezpiecz krążek opaską lnianą lub parafiną.';
  } else if (expansionRatio >= 0.9) {
    swellingSafetyStatus = 'TRANSFER_IMMINENT';
    thermalActionRecommendation = 'Osiągnięto docelowe wybrzuszenie. Zaplanuj przeniesienie do chłodni w ciągu 48h.';
    careInstructions = 'Obracaj ser 2 razy na dobę. Skórka pod maksymalnym napięciem powierzchniowym.';
  } else if (expansionRatio >= 0.35) {
    swellingSafetyStatus = 'ACTIVE_SWELLING';
    thermalActionRecommendation = 'Intensywna faza pęcznienia (tworzenie oczek). Temperatura optymalna.';
    careInstructions = 'Kontroluj opukiwaniem głuchy rezonans świadczący o gromadzeniu CO2 w kawernach.';
  }

  // Weight shrinkage estimation in warm room (~0.12% per day in warm air)
  const shrinkageWeightLossPct = Number((day * 0.12).toFixed(2));
  const estimatedCurrentWeightKg = Number((weight * (1 - shrinkageWeightLossPct / 100)).toFixed(2));

  return {
    currentStage,
    recommendedDurationDays: profile.warmRoomDays,
    daysRemainingInStage: daysRemaining,
    estimatedCo2LitersProduced,
    estimatedAverageEyeDiameterMm,
    targetEyeDiameterRangeMm: profile.targetEyeRangeMm,
    domeExpansionMm: expansion,
    maxSafeExpansionMm: profile.maxExpansionMm,
    swellingSafetyStatus,
    shrinkageWeightLossPct,
    estimatedCurrentWeightKg,
    thermalActionRecommendation,
    careInstructions,
  };
}

/**
 * Analyzes eye size distribution from sample measurements across a cut cheese slice.
 */
export function analyzeEyeDistribution(
  measuredDiametersMm: number[],
  style: PropionicCheeseStyle
): EyeDistributionAnalysis {
  if (!measuredDiametersMm || measuredDiametersMm.length === 0) {
    return {
      measuredDiametersMm: [],
      style,
      averageDiameterMm: 0,
      uniformityIndexPct: 100,
      conformanceStatus: 'UNDER_DEVELOPED',
      feedback: 'Brak wprowadzonych pomiarów oczek w przekroju sera.',
    };
  }

  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.MAASDAM;
  const avg = measuredDiametersMm.reduce((a, b) => a + b, 0) / measuredDiametersMm.length;

  // Standard deviation for uniformity
  const variance =
    measuredDiametersMm.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / measuredDiametersMm.length;
  const stdDev = Math.sqrt(variance);

  // Uniformity index: 100% when stdDev is 0, drops as coefficient of variation increases
  const cv = avg > 0 ? stdDev / avg : 0;
  const uniformityIndexPct = Math.max(0, Math.min(100, Number(((1 - cv) * 100).toFixed(1))));

  let conformanceStatus: EyeDistributionAnalysis['conformanceStatus'] = 'PERFECT';
  let feedback = 'Wzorcowe oczkowanie propionowe o gładkich ściankach i harmonijnej wielkości.';

  if (uniformityIndexPct < 60 || cv > 0.35) {
    conformanceStatus = 'IRREGULAR_PINHOLES';
    feedback = 'Nieregularny rozkład oczek z drobnymi szczelinami. Podejrzenie gazowania wczesnego (bakterie grupy coli) lub zróżnicowanej wilgotności skrzepu.';
  } else if (avg < profile.targetEyeRangeMm[0] * 0.7) {
    conformanceStatus = 'UNDER_DEVELOPED';
    feedback = 'Oczka zbyt małe lub niedorozwinięte (ślepy ser / blind cheese). Zbyt niska temperatura komory lub słaba kultura propionowa.';
  } else if (avg > profile.targetEyeRangeMm[1] * 1.3) {
    conformanceStatus = 'OVER_EXPANDED';
    feedback = 'Oczka nadmiernie rozrośnięte (efekt orzecha włoskiego). Za długi czas w komorze ciepłej.';
  }

  return {
    measuredDiametersMm,
    style,
    averageDiameterMm: Number(avg.toFixed(1)),
    uniformityIndexPct,
    conformanceStatus,
    feedback,
  };
}
