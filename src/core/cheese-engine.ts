// ============================================================================
// Apps4Brew Studio — FERMENT Cheese Engine & Coagulation Kinetics
// Mathematical Tier 1 Rigor (Fox et al. / IDF Standard 157 / Berridge Method)
// ============================================================================

export interface RennetCalculationResult {
  volumeMl: number;
  drops: number;
  imcuTotal: number;
}

export interface Cacl2CalculationResult {
  dryGrams: number;
  solution33PercentMl: number;
  warning?: string;
}

export interface FlocculationResult {
  totalCoagulationSeconds: number;
  remainingSecondsAfterFloc: number;
  warning?: string;
}

export interface PressPressureResult {
  surfaceAreaCm2: number;
  appliedForceKg: number;
  pressureKgCm2: number;
  pressurePsi: number;
}

export interface BrineCompositionResult {
  waterLiters: number;
  saltKg: number;
  salinityPct: number;
  densityGPerCm3: number;
  degreesBaume: number;
  degreesSalometer: number;
  cacl2DryGrams: number;
  cacl2Solution33Ml: number;
  targetPhMin: number;
  targetPhMax: number;
}

export interface CurdCookingRampResult {
  deltaTempC: number;
  minRecommendedDurationMinutes: number;
  isTooFast: boolean;
  warning?: string;
}

/**
 * RD-01: Oblicza dawkę podpuszczki na litr mleka w jednostkach IMCU.
 */
export function calculateRennetDose(
  milkLiters: number,
  targetImcuPerLiter: number = 35.0,
  rennetStrengthImcuPerMl: number = 200.0
): RennetCalculationResult {
  if (milkLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');
  if (targetImcuPerLiter <= 0) throw new Error('Docelowe IMCU musi być większe od zera.');
  if (rennetStrengthImcuPerMl <= 0) throw new Error('Moc podpuszczki musi być większa od zera.');

  const imcuTotal = milkLiters * targetImcuPerLiter;
  const rawMl = imcuTotal / rennetStrengthImcuPerMl;
  const volumeMl = Math.round(rawMl * 100) / 100;
  const drops = Math.round(volumeMl * 20); // 1 ml ≈ 20 standard drops

  return { volumeMl, drops, imcuTotal };
}

/**
 * RD-02: Konwertuje tradycyjną siłę podpuszczki (1:X) na międzynarodowe IMCU/ml.
 */
export function convertRennetRatioToImcu(ratioNumber: number): number {
  if (ratioNumber <= 0) throw new Error('Stosunek podpuszczki musi być dodatni.');
  // Standard: 1:10 000 w 35°C przez 40 min ≈ 130 IMCU/ml
  return Math.round(((130.0 * ratioNumber) / 10000.0) * 10) / 10;
}

/**
 * RD-03: Oblicza zapotrzebowanie na chlorek wapnia (CaCl2).
 */
export function calculateCacl2Dose(
  milkLiters: number,
  milkTreatment: 'RAW' | 'PASTEURIZED_LOW' | 'STORE_MICROFILTERED',
  isWinterSurowka: boolean = false
): Cacl2CalculationResult {
  if (milkLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');

  let targetGramsPerLiter = 0.0;
  if (milkTreatment === 'STORE_MICROFILTERED' || milkTreatment === 'PASTEURIZED_LOW') {
    targetGramsPerLiter = 0.20; // 0.2 g / L
  } else if (milkTreatment === 'RAW' && isWinterSurowka) {
    targetGramsPerLiter = 0.10;
  }

  const dryGrams = Math.round(milkLiters * targetGramsPerLiter * 100) / 100;
  // 1 ml roztworu 33% zawiera ok. 0.429 g czystego CaCl2 -> dryGrams * 2.33
  const solution33PercentMl = Math.round(dryGrams * 2.33 * 10) / 10;

  let warning: string | undefined;
  if (targetGramsPerLiter > 0.40) {
    warning = 'Dawka CaCl2 przekracza 0.4 g/L. Ryzyko wystąpienia metaliczno-gorzkiego posmaku sera!';
  }

  return { dryGrams, solution33PercentMl, warning };
}

/**
 * RD-04: Metoda mnożnika flokulacji (Berridge Flocculation Multiplier).
 */
export function calculateFlocculationCutTime(
  flocculationSeconds: number,
  multiplier: number = 3.5
): FlocculationResult {
  if (flocculationSeconds <= 0) throw new Error('Czas flokulacji musi być większy od zera.');
  if (multiplier < 1.0) throw new Error('Mnożnik flokulacji nie może być mniejszy niż 1.0.');

  const totalCoagulationSeconds = Math.round(flocculationSeconds * multiplier);
  const remainingSecondsAfterFloc = totalCoagulationSeconds - flocculationSeconds;

  let warning: string | undefined;
  if (flocculationSeconds < 8 * 60) {
    warning = 'Flokulacja zaszła zbyt szybko (< 8 min). Ryzyko gumowatego skrzepu z powodu za wysokiej temperatury lub nadmiaru podpuszczki.';
  } else if (flocculationSeconds > 22 * 60) {
    warning = 'Flokulacja opóźniona (> 22 min). Osłabiona podpuszczka, zbyt niska temperatura lub niedobór jonów wapnia.';
  }

  return {
    totalCoagulationSeconds,
    remainingSecondsAfterFloc,
    warning,
  };
}

/**
 * RD-05: Oblicza nacisk jednostkowy prasy serowarskiej (kg/cm² i PSI).
 */
export function calculatePressPressure(
  weightAppliedKg: number,
  formDiameterCm: number,
  leverRatio: number = 1.0
): PressPressureResult {
  if (formDiameterCm <= 0) throw new Error('Średnica formy musi być większa od zera.');
  if (weightAppliedKg < 0) throw new Error('Masa obciążnika nie może być ujemna.');
  if (leverRatio <= 0) throw new Error('Przełożenie dźwigni musi być większe od zera.');

  const radiusCm = formDiameterCm / 2.0;
  const surfaceAreaCm2 = Math.PI * Math.pow(radiusCm, 2);
  const appliedForceKg = weightAppliedKg * leverRatio;
  const pressureKgCm2 = appliedForceKg / surfaceAreaCm2;
  const pressurePsi = pressureKgCm2 * 14.2233;

  return {
    surfaceAreaCm2: Math.round(surfaceAreaCm2 * 10) / 10,
    appliedForceKg: Math.round(appliedForceKg * 100) / 100,
    pressureKgCm2: Math.round(pressureKgCm2 * 1000) / 1000,
    pressurePsi: Math.round(pressurePsi * 100) / 100,
  };
}

/**
 * Oblicza wymaganą masę obciążnika dla zadanego docelowego nacisku (kg/cm²).
 */
export function calculatePressWeightNeeded(
  targetPressureKgCm2: number,
  formDiameterCm: number,
  leverRatio: number = 1.0
): number {
  if (targetPressureKgCm2 <= 0 || formDiameterCm <= 0 || leverRatio <= 0) return 0;
  const radiusCm = formDiameterCm / 2.0;
  const surfaceAreaCm2 = Math.PI * Math.pow(radiusCm, 2);
  const neededForceKg = targetPressureKgCm2 * surfaceAreaCm2;
  return Math.round((neededForceKg / leverRatio) * 10) / 10;
}

/**
 * RD-07: Kompozycja zbuforowanej solanki serowarskiej (18–22% NaCl).
 */
export function calculateBrineComposition(
  waterLiters: number,
  salinityPct: number = 20.0
): BrineCompositionResult {
  if (waterLiters <= 0) throw new Error('Objętość wody musi być większa od zera.');
  if (salinityPct < 16.0 || salinityPct > 26.0) {
    throw new Error('Bezpieczne stężenie solanki serowarskiej wynosi 16%–26%.');
  }

  // Wzór nasycenia: m_soli = V_wody * (S / (100 - S))
  const saltKg = Math.round((waterLiters * (salinityPct / (100.0 - salinityPct))) * 100) / 100;

  // Korekty areometryczne
  const densityGPerCm3 = Math.round((1.0 + (salinityPct * 0.0076)) * 1000) / 1000;
  const degreesBaume = Math.round((145.0 - (145.0 / densityGPerCm3)) * 10) / 10;
  const degreesSalometer = Math.round((salinityPct * 3.85) * 10) / 10;

  // Bufor wapniowy: 0.15% CaCl2
  const cacl2DryGrams = Math.round(waterLiters * 1.5 * 10) / 10;
  const cacl2Solution33Ml = Math.round(cacl2DryGrams * 2.33 * 10) / 10;

  return {
    waterLiters,
    saltKg,
    salinityPct,
    densityGPerCm3,
    degreesBaume,
    degreesSalometer,
    cacl2DryGrams,
    cacl2Solution33Ml,
    targetPhMin: 5.20,
    targetPhMax: 5.40,
  };
}

/**
 * RD-08: Oblicza czas kąpieli solankowej na podstawie wagi i grubości krążka.
 */
export function calculateBrineTimeHours(
  cheeseWeightKg: number,
  styleFactorHoursPerKg: number = 4.5,
  thicknessCm: number = 8.0,
  refThicknessCm: number = 8.0
): number {
  if (cheeseWeightKg <= 0) return 0;
  const geomFactor = Math.max(0.5, thicknessCm / refThicknessCm);
  const rawHours = cheeseWeightKg * styleFactorHoursPerKg * geomFactor;
  return Math.round(rawHours * 10) / 10;
}

/**
 * RD-17: Case Hardening Guard — minimalny czas dogrzewania skrzepu (max 1°C na 2 minuty).
 */
export function calculateCurdCookingMinTime(
  startTempC: number,
  targetTempC: number,
  actualDurationMinutes?: number
): CurdCookingRampResult {
  const deltaTempC = Math.max(0, targetTempC - startTempC);
  const minRecommendedDurationMinutes = Math.round(deltaTempC * 2.0);

  const isTooFast = actualDurationMinutes !== undefined && actualDurationMinutes < minRecommendedDurationMinutes;
  let warning: string | undefined;
  if (isTooFast) {
    warning = `Dogrzewanie zbyt gwałtowne (${actualDurationMinutes} min < ${minRecommendedDurationMinutes} min). Ryzyko zeszklania zewnętrznej warstwy ziarna (Case Hardening) i uwięzienia kwaśnej serwatki wewnątrz sera!`;
  }

  return {
    deltaTempC,
    minRecommendedDurationMinutes,
    isTooFast,
    warning,
  };
}
