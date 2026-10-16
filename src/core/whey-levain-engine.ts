// ============================================================================
// Apps4Brew Studio — FERMENT Mother Whey Levain & Starter Propagation Engine
// Sierroinnesto, Alpine thermophilic culture, farmhouse mesophilic backslopping
// ============================================================================

export type WheyLevainType =
  | 'THERMOPHILIC_ALPINE' // Sierroinnesto alpejskie (42-44°C, Parmigiano, Gruyère, Grana)
  | 'MESOPHILIC_FARMHOUSE' // Sierroinnesto mezofilne (28-32°C, Gouda, Koryciński, Twaróg)
  | 'HIGHLAND_SMOKED' // Tradycyjna serwatka tatrzańska (36-38°C, Oscypek, Gołka)
  | 'VEGETABLE_BRINE_BACKSLOP' // Zakwas ze startej kiszonki (18-22°C, ogórki, kimchi)
  | 'WATER_KEFIR_RESERVE'; // Starter kefiru wodnego (22-25°C, Tibicos)

export type LevainRipenessStatus =
  | 'WARMING_UP'
  | 'ACTIVE_ACIDIFYING'
  | 'PEAK_RIPE'
  | 'OVER_ACIDIFIED'
  | 'COLD_RESERVE';

export type GenerationVitalityStatus =
  | 'OPTIMAL_VITALITY'
  | 'VIGILANCE_MONITOR'
  | 'DEGENERATION_RESET_REQUIRED';

export interface WheyLevainInput {
  levainType: WheyLevainType;
  wheyVolumeMl: number;
  incubationTempCelsius: number;
  currentPh?: number;
  hoursIncubated: number;
  generationPassage?: number; // Serial backslopping generation (default 1)
  targetMilkVolumeLiters?: number; // Target batch milk to inoculate (default 10L)
}

export interface WheyLevainPlan {
  levainType: WheyLevainType;
  wheyVolumeMl: number;
  requiredStarterMl: number;
  inoculumRatioPct: number;
  optimalIncubationHours: number;
  remainingHours: number;
  targetPhMin: number;
  targetPhMax: number;
  currentStatus: LevainRipenessStatus;
  isReadyForInoculation: boolean;
  statusLabelPl: string;
  passageHealth: {
    generation: number;
    status: GenerationVitalityStatus;
    warning?: string;
  };
  stepByStepInstructions: string[];
  craftRecommendations: string[];
}

interface LevainProfileMeta {
  optimalTempC: number;
  nominalHours: number;
  targetPhMin: number;
  targetPhMax: number;
  nominalInoculumPct: number; // % v/v względem mleka
  species: string[];
}

const LEVAIN_PROFILES: Record<WheyLevainType, LevainProfileMeta> = {
  THERMOPHILIC_ALPINE: {
    optimalTempC: 43,
    nominalHours: 20,
    targetPhMin: 3.4,
    targetPhMax: 3.65,
    nominalInoculumPct: 2.5, // 2.5% v/v (250 ml na 10L)
    species: [
      'Streptococcus thermophilus',
      'Lactobacillus delbrueckii subsp. lactis',
      'Lactobacillus helveticus',
    ],
  },
  MESOPHILIC_FARMHOUSE: {
    optimalTempC: 30,
    nominalHours: 24,
    targetPhMin: 3.8,
    targetPhMax: 4.1,
    nominalInoculumPct: 2.0, // 2.0% v/v (200 ml na 10L)
    species: [
      'Lactococcus lactis subsp. lactis',
      'Lactococcus lactis subsp. cremoris',
      'Leuconostoc mesenteroides',
    ],
  },
  HIGHLAND_SMOKED: {
    optimalTempC: 37,
    nominalHours: 18,
    targetPhMin: 3.6,
    targetPhMax: 3.9,
    nominalInoculumPct: 3.0, // 3.0% v/v (300 ml na 10L)
    species: [
      'Lactobacillus plantarum',
      'Lactococcus lactis',
      'Streptococcus thermophilus',
    ],
  },
  VEGETABLE_BRINE_BACKSLOP: {
    optimalTempC: 20,
    nominalHours: 24,
    targetPhMin: 3.4,
    targetPhMax: 3.8,
    nominalInoculumPct: 5.0, // 5.0% v/v do solanki
    species: [
      'Leuconostoc mesenteroides',
      'Lactobacillus plantarum',
      'Pediococcus pentosaceus',
    ],
  },
  WATER_KEFIR_RESERVE: {
    optimalTempC: 23,
    nominalHours: 24,
    targetPhMin: 3.6,
    targetPhMax: 4.0,
    nominalInoculumPct: 10.0,
    species: ['Lactobacillus hilgardii', 'Saccharomyces cerevisiae', 'Acetobacter'],
  },
};

/**
 * Calculates incubation kinetics, readiness, required inoculum dose, and generation health.
 */
export function calculateWheyLevainPlan(input: WheyLevainInput): WheyLevainPlan {
  const {
    levainType,
    wheyVolumeMl,
    incubationTempCelsius,
    currentPh,
    hoursIncubated,
    generationPassage = 1,
    targetMilkVolumeLiters = 10,
  } = input;

  const profile = LEVAIN_PROFILES[levainType];

  // Temperature acceleration / deceleration factor (Q10 = 2.0)
  const tempDiff = incubationTempCelsius - profile.optimalTempC;
  const speedFactor = Math.pow(2.0, tempDiff / 10);
  const clampedSpeed = Math.max(0.25, Math.min(3.0, speedFactor));

  // Adjusted hours needed to reach target pH
  const optimalIncubationHours = Math.round((profile.nominalHours / clampedSpeed) * 10) / 10;
  const remainingHours = Math.max(0, Math.round((optimalIncubationHours - hoursIncubated) * 10) / 10);

  // Status calculation based on pH if provided, or elapsed time
  let currentStatus: LevainRipenessStatus = 'WARMING_UP';
  let isReadyForInoculation = false;
  let statusLabelPl = 'Wstępne namnażanie';

  if (currentPh !== undefined) {
    if (currentPh > profile.targetPhMax + 0.5) {
      currentStatus = 'WARMING_UP';
      statusLabelPl = `Wczesna faza namnażania (pH ${currentPh})`;
    } else if (currentPh > profile.targetPhMax) {
      currentStatus = 'ACTIVE_ACIDIFYING';
      statusLabelPl = `Aktywna produkcja kwasu (pH ${currentPh})`;
    } else if (currentPh >= profile.targetPhMin && currentPh <= profile.targetPhMax) {
      currentStatus = 'PEAK_RIPE';
      isReadyForInoculation = true;
      statusLabelPl = `Szczyt dojrzałości technologicznej (pH ${currentPh}) — GOTOWY!`;
    } else {
      currentStatus = 'OVER_ACIDIFIED';
      statusLabelPl = `Przekwaszenie (pH ${currentPh} < ${profile.targetPhMin}) — ryzyko autolizy kwasomlekowej`;
    }
  } else {
    // Estimating by time
    if (hoursIncubated < optimalIncubationHours * 0.4) {
      currentStatus = 'WARMING_UP';
      statusLabelPl = 'Wstępne namnażanie flory matecznej';
    } else if (hoursIncubated < optimalIncubationHours * 0.85) {
      currentStatus = 'ACTIVE_ACIDIFYING';
      statusLabelPl = 'Aktywna faza zakwaszania serwatki';
    } else if (hoursIncubated <= optimalIncubationHours * 1.2) {
      currentStatus = 'PEAK_RIPE';
      isReadyForInoculation = true;
      statusLabelPl = 'Szczyt dojrzałości starterowej — GOTOWY!';
    } else {
      currentStatus = 'OVER_ACIDIFIED';
      statusLabelPl = 'Wydłużona inkubacja — schłodź natychmiast do 4°C';
    }
  }

  // Dose for target milk volume
  const requiredStarterMl = Math.round(targetMilkVolumeLiters * 1000 * (profile.nominalInoculumPct / 100));

  // Serial backslopping passage health
  let genStatus: GenerationVitalityStatus = 'OPTIMAL_VITALITY';
  let genWarning: string | undefined;

  if (generationPassage >= 18) {
    genStatus = 'DEGENERATION_RESET_REQUIRED';
    genWarning = `Generacja ${generationPassage}: wysokie ryzyko nagromadzenia bakteriofagów serowarskich oraz dryfu monokultury. Zresetuj matkę ze świeżego, surowego mleka lub liofilizatu!`;
  } else if (generationPassage >= 11) {
    genStatus = 'VIGILANCE_MONITOR';
    genWarning = `Generacja ${generationPassage}: monitoruj czas koagulacji skrzepu. Po 15-18 pasażach zalecana jest odnowa biologiczna matki serwatkowej.`;
  }

  // Step-by-step craft instructions
  const stepByStepInstructions: string[] = [
    `1. Pobierz ${wheyVolumeMl} ml czystej, nieposolonej serwatki z dzisiejszego warzenia (odciek z formy przed soleniem).`,
    `2. Przefiltruj przez jałowe płótno serowarskie, usuwając drobinki skrzepu (pył kazeinowy).`,
    `3. Umieść serwatkę w wyparzonym termosie lub słoiku w kąpieli wodnej o temp. ${profile.optimalTempC}°C.`,
    `4. Inkubuj przez ok. ${optimalIncubationHours} godz. aż pH osiągnie ${profile.targetPhMin}–${profile.targetPhMax} (zapach czysty, jogurtowo-maślany).`,
    `5. Do jutrzejszego warzenia (${targetMilkVolumeLiters}L mleka) dodaj dokładnie ${requiredStarterMl} ml gotowego zakwasu (${profile.nominalInoculumPct}% v/v).`,
    `6. Resztę schłodź do 4°C na kolejny pasaż (maks. 48 godz. w chłodzie).`,
  ];

  // Craft recommendations
  const craftRecommendations: string[] = [
    `Gatunki dominujące: ${profile.species.join(', ')}.`,
    `Nigdy nie pobieraj serwatki po soleniu gęstwy lub po solance — wysokie stężenie soli hamuje namnażanie S. thermophilus.`,
  ];

  if (incubationTempCelsius < profile.optimalTempC - 4) {
    craftRecommendations.push(
      `Temperatura ${incubationTempCelsius}°C jest za niska dla tej kultury (optimum to ${profile.optimalTempC}°C). Fermentacja ulegnie spowolnieniu, a przewagę mogą zyskać dzikie bakterie kwaszące.`
    );
  } else if (incubationTempCelsius > profile.optimalTempC + 3) {
    craftRecommendations.push(
      `Temperatura ${incubationTempCelsius}°C przekracza optimum termiczne. Ryzyko stresu cieplnego i termolizy bakterii kwasomlekowych.`
    );
  }

  return {
    levainType,
    wheyVolumeMl,
    requiredStarterMl,
    inoculumRatioPct: profile.nominalInoculumPct,
    optimalIncubationHours,
    remainingHours,
    targetPhMin: profile.targetPhMin,
    targetPhMax: profile.targetPhMax,
    currentStatus,
    isReadyForInoculation,
    statusLabelPl,
    passageHealth: {
      generation: generationPassage,
      status: genStatus,
      warning: genWarning,
    },
    stepByStepInstructions,
    craftRecommendations,
  };
}
