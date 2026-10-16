// ============================================================================
// Apps4Brew Studio — FERMENT Kombucha Continuous Brew Siphon & Maintenance Engine
// Steady-state kinetics, safe draw ratios, sweet tea replenishment, and trub purge
// ============================================================================

export type TeaBaseType = 'BLACK' | 'GREEN' | 'OOLONG' | 'WHITE' | 'HERBAL_BLEND';

export interface ContinuousBrewSystem {
  id: string;
  name: string;
  vesselCapacityLiters: number;
  currentVolumeLiters: number;
  ambientTempCelsius: number;
  teaBaseType: TeaBaseType;
  totalCyclesCompleted: number;
  cyclesSinceLastPurge: number;
  lastDrawDate?: number;
  lastPurgeDate?: number;
}

export interface HarvestCalculationInput {
  system: ContinuousBrewSystem;
  drawVolumeLiters: number;
  currentPreDrawPh?: number;
  desiredSweetTeaSugarPerLiterGrams?: number; // default 70g/L
  desiredTeaLeavesPerLiterGrams?: number; // default 5g/L
}

export interface HarvestPlan {
  drawVolumeLiters: number;
  drawRatioPct: number;
  isDrawSafe: boolean;
  safetyWarning?: string;
  reserveVolumeLiters: number;
  sweetTeaVolumeLiters: number;
  sugarTotalGrams: number;
  teaLeavesTotalGrams: number;
  recommendedSteepTimeMinutes: number;
  recommendedCoolingTempCelsius: number;
  estimatedCycleDays: number;
  estimatedPostRefillPh?: number;
  trubPurgeAlert?: {
    due: boolean;
    urgency: 'NONE' | 'UPCOMING' | 'OVERDUE';
    reason: string;
    actionSteps: string[];
  };
  recommendations: string[];
}

/**
 * Calculates optimal cycle interval in days based on ambient temperature
 * Kombucha microbial consortium (SCOBY) operates optimally at 24-27°C.
 */
export function estimateContinuousBrewCycleDays(tempCelsius: number): number {
  if (tempCelsius >= 30) {
    return 4; // Very fast, danger of yeast dominance & vinegar punch
  } else if (tempCelsius >= 27) {
    return 5;
  } else if (tempCelsius >= 24) {
    return 7; // Optimal weekly cadence
  } else if (tempCelsius >= 21) {
    return 10;
  } else if (tempCelsius >= 18) {
    return 14;
  } else {
    return 21; // Sluggish, cold stall
  }
}

/**
 * Calculates post-refill pH based on logarithmic dilution of hydrogen ion concentration.
 * Safe threshold is pH <= 4.0 (ideally <= 3.8) to maintain antimicrobial barrier.
 */
export function estimatePostRefillPh(
  reserveVolumeL: number,
  reservePh: number,
  refillVolumeL: number,
  neutralSweetTeaPh: number = 6.2
): number {
  const totalVolume = reserveVolumeL + refillVolumeL;
  if (totalVolume <= 0) return reservePh;

  // H+ concentration = 10^(-pH) mol/L
  const hReserve = Math.pow(10, -reservePh) * reserveVolumeL;
  const hRefill = Math.pow(10, -neutralSweetTeaPh) * refillVolumeL;
  const mixedH = (hReserve + hRefill) / totalVolume;

  const rawPh = -Math.log10(mixedH);
  // Round to 2 decimal places
  return Math.round(rawPh * 100) / 100;
}

/**
 * Computes harvest draw, sweet tea replenishment, safety guardrails, and maintenance alerts.
 */
export function calculateContinuousBrewPlan(input: HarvestCalculationInput): HarvestPlan {
  const {
    system,
    drawVolumeLiters,
    currentPreDrawPh,
    desiredSweetTeaSugarPerLiterGrams = 70,
    desiredTeaLeavesPerLiterGrams = 5,
  } = input;

  const currentVol = system.currentVolumeLiters > 0 ? system.currentVolumeLiters : system.vesselCapacityLiters;
  const clampedDraw = Math.max(0, Math.min(drawVolumeLiters, currentVol));
  const drawRatioPct = Math.round((clampedDraw / currentVol) * 100);
  const reserveVolumeLiters = Math.round((currentVol - clampedDraw) * 100) / 100;
  const sweetTeaVolumeLiters = clampedDraw;

  // Safe draw ratio: 15% to 33% max
  let isDrawSafe = true;
  let safetyWarning: string | undefined;

  if (drawRatioPct > 35) {
    isDrawSafe = false;
    safetyWarning =
      'Pobór przekracza 35% objętości naczynia! Istnieje wysokie ryzyko załamania tarczy kwasowej (wzrost pH > 4.2), co sprzyja rozwojowi pleśni i bakterii gnilnych.';
  } else if (drawRatioPct < 15 && drawRatioPct > 0) {
    safetyWarning =
      'Pobór poniżej 15% może prowadzić do nadmiernego przekwaszenia bazy (profil octowy), chyba że planujesz krótki 3-dniowy interwał.';
  }

  // Ingredients calculation
  const sugarTotalGrams = Math.round(sweetTeaVolumeLiters * desiredSweetTeaSugarPerLiterGrams);
  const teaLeavesTotalGrams = Math.round(sweetTeaVolumeLiters * desiredTeaLeavesPerLiterGrams * 10) / 10;

  // Steeping params by tea base
  let recommendedSteepTimeMinutes = 15;
  if (system.teaBaseType === 'GREEN' || system.teaBaseType === 'WHITE') {
    recommendedSteepTimeMinutes = 10;
  } else if (system.teaBaseType === 'OOLONG') {
    recommendedSteepTimeMinutes = 12;
  }

  const estimatedCycleDays = estimateContinuousBrewCycleDays(system.ambientTempCelsius);

  // pH estimation
  let estimatedPostRefillPh: number | undefined;
  if (currentPreDrawPh !== undefined) {
    estimatedPostRefillPh = estimatePostRefillPh(reserveVolumeLiters, currentPreDrawPh, sweetTeaVolumeLiters);
    if (estimatedPostRefillPh > 4.0) {
      isDrawSafe = false;
      safetyWarning = `Szacowane pH po uzupełnieniu wynosi ${estimatedPostRefillPh} (powyżej krytycznego progu 4.0). Zmniejsz pobór lub dodaj 100 ml dojrzałego octu kombuchowego!`;
    }
  }

  // Trub Purge & Maintenance Alert
  // Trub accumulates at ~2mm per cycle. After 10 cycles (~70-90 days), deep purge is recommended.
  let trubPurgeAlert: HarvestPlan['trubPurgeAlert'];
  const cycles = system.cyclesSinceLastPurge;

  if (cycles >= 12) {
    trubPurgeAlert = {
      due: true,
      urgency: 'OVERDUE',
      reason: `Wykonano ${cycles} cykli bez usunięcia osadu drożdżowego z dna. Gruba warstwa drożdży (trub) powoduje posmak siarkowo-drożdżowy i zatyka kranik.`,
      actionSteps: [
        'Zlej 20% najczystszego płynu z góry do osobnego słoja jako bazę startową.',
        'Wyjmij grzybek SCOBY, usuń ciemne, poszarpane warstwy od dołu (zostaw 1-2 cm góry).',
        'Zlej resztę płynu i dokładnie wypłucz osad drożdżowy z dna naczynia.',
        'Wlej zachowaną bazę startową, umieść przycięty SCOBY i dolej świeżej słodkiej herbaty.',
      ],
    };
  } else if (cycles >= 8) {
    trubPurgeAlert = {
      due: false,
      urgency: 'UPCOMING',
      reason: `Wykonano ${cycles} cykli od ostatniego czyszczenia dna. Za 2-4 cykle zaplanuj przegląd grzybka i usunięcie osadu z kranika.`,
      actionSteps: [
        'Przygotuj czysty pojemnik na zlanie starteru przy kolejnym rozlewie.',
        'Sprawdź drożność kranika i czy nie gromadzą się wokół niego pasma drożdżowe.',
      ],
    };
  } else {
    trubPurgeAlert = {
      due: false,
      urgency: 'NONE',
      reason: `Stan naczynia stabilny (${cycles} cykli od ostatniego czyszczenia).`,
      actionSteps: [],
    };
  }

  // Craft recommendations
  const recommendations: string[] = [];
  if (system.ambientTempCelsius < 20) {
    recommendations.push(
      'Temperatura otoczenia poniżej 20°C: użyj maty grzewczej ze sterownikiem, aby utrzymać 24-26°C i zapobiec uśpieniu bakterii octowych.'
    );
  } else if (system.ambientTempCelsius > 28) {
    recommendations.push(
      'Temperatura powyżej 28°C: drożdże pracują intensywnie. Skróć cykl do 4-5 dni, aby zapobiec nadmiernej produkcji alkoholu i kwasowości octowej.'
    );
  }

  recommendations.push(
    'Pamiętaj: dolewaj słodką herbatę schłodzoną do temperatury pokojowej (< 28°C). Gorący płyn zabija żywe kultury bakterii i drożdży!'
  );

  return {
    drawVolumeLiters: clampedDraw,
    drawRatioPct,
    isDrawSafe,
    safetyWarning,
    reserveVolumeLiters,
    sweetTeaVolumeLiters,
    sugarTotalGrams,
    teaLeavesTotalGrams,
    recommendedSteepTimeMinutes,
    recommendedCoolingTempCelsius: 24,
    estimatedCycleDays,
    estimatedPostRefillPh,
    trubPurgeAlert,
    recommendations,
  };
}
