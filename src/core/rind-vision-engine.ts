// ============================================================================
// Apps4Brew Studio — SEROWAR Rind Vision & Colorimetric Affinage Engine
// Computer vision colorimetry for mold coverage inspection, Brevibacterium smear
// intensity, defect detection (Mucor/black rot), and cross-section eye density.
// ============================================================================

export type RindFloraType =
  | 'WHITE_MOLD_CAMEMBERT' // Penicillium camemberti / candidum
  | 'GEOTRICHUM_WRINKLED'  // Geotrichum candidum (brain-like white ivory)
  | 'WASHED_RIND_SMEAR'    // Brevibacterium linens (orange/ochre)
  | 'BLUE_VEIN'            // Penicillium roqueforti
  | 'NATURAL_BRUSHED'      // Hard crust (grey/beige/brown)
  | 'MUCOR_PIN_DEFECT'     // Cat's hair mold (black/dark grey unwanted)
  | 'CLEAN_UNRINDED';      // Fresh curd surface

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RindColorimetricAnalysis {
  dominantFlora: RindFloraType;
  colorName: string;
  floraConfidencePct: number;
  isContaminationSuspected: boolean;
  contaminationDetails?: string;
  recommendedAction: string;
}

export interface RindCoverageAssessment {
  currentCoveragePct: number;
  targetCoveragePct: number;
  dayInCave: number;
  targetFlora: RindFloraType;
  status: 'OPTIMAL_PROGRESS' | 'LAGGING_COVERAGE' | 'OVER_MATURED' | 'FLORA_RETRACTED';
  actionDirective: string;
}

export interface CrossSectionEyeDensity {
  totalEyesCount: number;
  meanDiameterMm: number;
  porosityPct: number; // Gas void fraction (0..40%)
  openingType: 'PROPIONIC_ROUND_EYES' | 'MECHANICAL_SLITS' | 'COLIFORM_SPONGE' | 'BLIND_SOLID';
  commercialGrade: 'EXTRA_CLASS' | 'STANDARD_CLASS' | 'DOWNGRADED';
  gradeNotes: string;
}

/**
 * Calculates Euclidean color distance between two RGB colors.
 */
function rgbDistance(c1: RgbColor, c2: RgbColor): number {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
}

// Canonical RGB centroids for cheese rind microbiological flora
const FLORA_CENTROIDS: Array<{ flora: RindFloraType; rgb: RgbColor; name: string }> = [
  { flora: 'WHITE_MOLD_CAMEMBERT', rgb: { r: 245, g: 245, b: 240 }, name: 'Śnieżnobiała Pleśń (P. camemberti)' },
  { flora: 'GEOTRICHUM_WRINKLED', rgb: { r: 235, g: 228, b: 205 }, name: 'Kremowo-Kościsty Aksamit (G. candidum)' },
  { flora: 'WASHED_RIND_SMEAR', rgb: { r: 215, g: 125, b: 45 }, name: 'Pomarańczowo-Ruda Maź (B. linens)' },
  { flora: 'BLUE_VEIN', rgb: { r: 65, g: 105, b: 95 }, name: 'Szmaragdowo-Niebieski Przerost (P. roqueforti)' },
  { flora: 'NATURAL_BRUSHED', rgb: { r: 160, g: 140, b: 110 }, name: 'Szaro-Beżowa Skórka Naturalna' },
  { flora: 'MUCOR_PIN_DEFECT', rgb: { r: 45, g: 45, b: 45 }, name: 'Sierść Kota / Czarna Pleśń (Mucor mucedo)' },
  { flora: 'CLEAN_UNRINDED', rgb: { r: 240, g: 230, b: 180 }, name: 'Jasnożółta Skrzepowa Powierzchnia' },
];

/**
 * Analyzes RGB color samples from cheese surface photos and identifies dominant surface flora.
 */
export function analyzeRindChromatics(rgbSamples: RgbColor[]): RindColorimetricAnalysis {
  if (!rgbSamples || rgbSamples.length === 0) {
    return {
      dominantFlora: 'CLEAN_UNRINDED',
      colorName: 'Brak próbek wizyjnych',
      floraConfidencePct: 100,
      isContaminationSuspected: false,
      recommendedAction: 'Skieruj aparat na oświetloną powierzchnię krążka sera.',
    };
  }

  // Calculate average RGB
  const avgR = rgbSamples.reduce((acc, c) => acc + c.r, 0) / rgbSamples.length;
  const avgG = rgbSamples.reduce((acc, c) => acc + c.g, 0) / rgbSamples.length;
  const avgB = rgbSamples.reduce((acc, c) => acc + c.b, 0) / rgbSamples.length;
  const avgColor: RgbColor = { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) };

  // Find nearest centroid
  let bestMatch = FLORA_CENTROIDS[0];
  let minDistance = Infinity;

  for (const c of FLORA_CENTROIDS) {
    const dist = rgbDistance(avgColor, c.rgb);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = c;
    }
  }

  // Confidence inversely proportional to distance (max distance in RGB is ~441)
  const confidence = Math.max(30, Math.min(99, Math.round(100 - (minDistance / 250) * 100)));

  const isContamination = bestMatch.flora === 'MUCOR_PIN_DEFECT';
  let recommendedAction = 'Flory powierzchniowe rozwijają się prawidłowo. Kontynuuj zaplanowany harmonogram pielęgnacji.';
  let contaminationDetails: string | undefined;

  if (isContamination) {
    contaminationDetails = 'Wykryto ciemne skupiska szarej/czarnej pleśni szpilkowej (Mucor). Grozi gorzkim smakiem i rozkładem tłuszczu.';
    recommendedAction = 'Przemyj natychmiast skórkę mocną solanką (18%) z dodatkiem octu lub przetrzyj szczotką o twardym włosiu.';
  } else if (bestMatch.flora === 'WHITE_MOLD_CAMEMBERT') {
    recommendedAction = 'Porost pleśni szlachetnej. Gdy pokrycie osiągnie 95%, zawiń krążek w papier dwuwarstwowy i przenieś do 4°C.';
  } else if (bestMatch.flora === 'WASHED_RIND_SMEAR') {
    recommendedAction = 'Aktywny rozwój mazi B. linens. Przemywaj roztworem soli 5-8% co 2-3 dni, aby utrzymać wilgotność skórki.';
  }

  return {
    dominantFlora: bestMatch.flora,
    colorName: bestMatch.name,
    floraConfidencePct: confidence,
    isContaminationSuspected: isContamination,
    contaminationDetails,
    recommendedAction,
  };
}

/**
 * Assesses the progression of rind surface colonization against the expected affinage calendar.
 */
export function assessRindCoverage(params: {
  currentCoveragePct: number;
  dayInCave: number;
  targetFlora: RindFloraType;
}): RindCoverageAssessment {
  const cov = Math.max(0, Math.min(100, params.currentCoveragePct));
  const day = Math.max(1, params.dayInCave);
  const targetFlora = params.targetFlora;

  // Expected coverage target by day for white molds vs washed rinds
  let expectedCoverage = 10;
  if (day >= 12) expectedCoverage = 95;
  else if (day >= 8) expectedCoverage = 75;
  else if (day >= 5) expectedCoverage = 40;
  else if (day >= 3) expectedCoverage = 20;

  let status: RindCoverageAssessment['status'] = 'OPTIMAL_PROGRESS';
  let actionDirective = 'Wzrost grzybni i bakterii zgodny z krzywą affinage.';

  if (cov < expectedCoverage * 0.6) {
    status = 'LAGGING_COVERAGE';
    actionDirective = 'Opóźniony porost skórki. Zwiększ wilgotność względną (RH) w jaskini o 3-5% i sprawdź czy temperatura nie spadła poniżej 11°C.';
  } else if (day >= 15 && cov >= 95) {
    status = 'OVER_MATURED';
    actionDirective = 'Skórka w pełni skolonizowana. Czas na zawijanie w papier serowarski i spowolnienie proteolizy w chłodni.';
  } else if (day > 7 && cov < 15) {
    status = 'FLORA_RETRACTED';
    actionDirective = 'Brak rozwoju flory. Podejrzenie zbyt niskiego pH skórki (<5.0) lub przesuszenia powierzchniowego.';
  }

  return {
    currentCoveragePct: cov,
    targetCoveragePct: expectedCoverage,
    dayInCave: day,
    targetFlora,
    status,
    actionDirective,
  };
}

/**
 * Analyzes cross-section eye density, void fraction (porosity), and classifies commercial grade.
 */
export function analyzeCrossSectionEyes(
  eyeDiametersMm: number[],
  sliceAreaCm2 = 100
): CrossSectionEyeDensity {
  if (!eyeDiametersMm || eyeDiametersMm.length === 0) {
    return {
      totalEyesCount: 0,
      meanDiameterMm: 0,
      porosityPct: 0,
      openingType: 'BLIND_SOLID',
      commercialGrade: 'STANDARD_CLASS',
      gradeNotes: 'Miąższ jednolity, bezoczkowy (ser ślepy — np. Cheddar, Parmezan).',
    };
  }

  const count = eyeDiametersMm.length;
  const meanD = eyeDiametersMm.reduce((a, b) => a + b, 0) / count;

  // Approximate eye surface area in cross section: sum(pi * (d/2)^2) in mm2
  const totalEyesAreaMm2 = eyeDiametersMm.reduce((acc, d) => acc + Math.PI * Math.pow(d / 2, 2), 0);
  const sliceAreaMm2 = sliceAreaCm2 * 100;
  const porosityPct = Number(Math.min(45, (totalEyesAreaMm2 / sliceAreaMm2) * 100).toFixed(1));

  let openingType: CrossSectionEyeDensity['openingType'] = 'PROPIONIC_ROUND_EYES';
  let commercialGrade: CrossSectionEyeDensity['commercialGrade'] = 'EXTRA_CLASS';
  let gradeNotes = 'Oczka okrągłe o lśniącej powierzchni. Prawidłowy rozwój gazowy.';

  if (meanD < 3 && count > 30) {
    openingType = 'COLIFORM_SPONGE';
    commercialGrade = 'DOWNGRADED';
    gradeNotes = 'Drobne, gęste oczka (efekt gąbki / wczesne wzdęcie). Możliwe zakażenie bakteriami grupy coli lub drożdżami.';
  } else if (meanD < 5 && count < 15) {
    openingType = 'MECHANICAL_SLITS';
    commercialGrade = 'STANDARD_CLASS';
    gradeNotes = 'Oczka mechaniczne (szczeliny) powstałe przez niedokładne sprasowanie ziaren skrzepu bez poduszki serwatkowej.';
  } else if (meanD >= 10 && meanD <= 30) {
    openingType = 'PROPIONIC_ROUND_EYES';
    commercialGrade = 'EXTRA_CLASS';
    gradeNotes = 'Wzorcowe wielkie oczka propionowe (klasa ekstra dla serów typu szwajcarskiego).';
  }

  return {
    totalEyesCount: count,
    meanDiameterMm: Number(meanD.toFixed(1)),
    porosityPct,
    openingType,
    commercialGrade,
    gradeNotes,
  };
}
