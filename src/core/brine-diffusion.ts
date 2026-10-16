// ============================================================================
// Apps4Brew Studio — FERMENT Salt Diffusion & Brining Penetration Time Engine
// Fick's Second Law & Geurts/Guinee Non-Steady-State Mass Transfer in Cheese Curd
// ============================================================================

export interface BrineDiffusionInput {
  wheelWeightKg: number;
  diameterCm: number;
  heightCm: number;
  fatInDryMatterPct?: number;     // e.g. 45-50% (default 48%)
  moisturePct?: number;            // e.g. 40-45% (default 42%)
  brineSalinityPct: number;        // e.g. 18-22% NaCl
  brineTempC?: number;             // e.g. 10-14°C (default 12°C)
  targetSaltInCheesePct?: number;  // e.g. 1.5-2.2% (default 1.8%)
}

export interface BrineDiffusionResult {
  surfaceAreaCm2: number;
  volumeCm3: number;
  halfThicknessCm: number;
  distanceToCoreCm: number;
  recommendedBriningHours: number;
  recommendedBriningDays: number;
  diffusionCoefficientCm2PerDay: number;
  daysToCoreEquilibration: number;
  saltUptakeRateGramsPerHour: number;
  totalSaltAbsorbedGrams: number;
  safetyWarningsPl: string[];
  equilibrationSchedulePl: string;
}

/**
 * Calculates mass transfer of NaCl into cylindrical cheese wheels based on Fickian diffusion
 */
export function calculateBrineDiffusion(input: BrineDiffusionInput): BrineDiffusionResult {
  const {
    wheelWeightKg,
    diameterCm,
    heightCm,
    fatInDryMatterPct = 48,
    moisturePct = 42,
    brineSalinityPct,
    brineTempC = 12,
    targetSaltInCheesePct = 1.8,
  } = input;

  if (wheelWeightKg <= 0 || diameterCm <= 0 || heightCm <= 0) {
    throw new Error('Wymiary i masa krążka sera muszą być większe od 0.');
  }

  // Geometry calculations for cylinder: V = pi * r^2 * h
  const radiusCm = diameterCm / 2.0;
  const surfaceAreaCm2 = Math.round(
    (2 * Math.PI * Math.pow(radiusCm, 2) + 2 * Math.PI * radiusCm * heightCm) * 10
  ) / 10;
  const volumeCm3 = Math.round(Math.PI * Math.pow(radiusCm, 2) * heightCm);

  // Shortest distance to geometric center: min(radius, height / 2)
  const halfThicknessCm = Math.round((heightCm / 2.0) * 100) / 100;
  const distanceToCoreCm = Math.round(Math.min(radiusCm, halfThicknessCm) * 100) / 100;

  // Effective diffusion coefficient (Geurts 1974 model)
  // Baseline D0 ~ 0.28 cm^2/day at 12°C for 42% moisture, 48% FDM
  // Higher moisture increases diffusion; higher fat creates tortuosity and decreases diffusion
  const moistureFactor = moisturePct / 42.0;
  const fatTortuosity = 1.0 - (fatInDryMatterPct / 100.0) * 0.45;
  const tempFactor = 1.0 + (brineTempC - 12.0) * 0.035; // ~3.5% per °C Arrhenius slope

  const dEff = Math.round(0.28 * moistureFactor * fatTortuosity * tempFactor * 1000) / 1000;
  const safeDEff = Math.max(0.12, dEff);

  // Total NaCl mass to absorb
  const totalSaltAbsorbedGrams = Math.round(wheelWeightKg * 1000 * (targetSaltInCheesePct / 100.0) * 10) / 10;

  // Brine uptake rate: depends on concentration gradient (Brine % vs Curd 0%)
  // At 20% brine: uptake ~ 0.55 g/cm2 / sqrt(day)
  const clampedBrineSalinity = Math.max(12, Math.min(26, brineSalinityPct));
  const concentrationGradient = clampedBrineSalinity / 20.0;

  // Empirical Geurts/Guinee semi-hard cheese formula for cylinder:
  // Base time: ~8.5 hours per kg for 7cm height flat wheel in 20% brine
  const heightCorrection = Math.pow(heightCm / 7.0, 1.35);
  const brineCorrection = 20.0 / clampedBrineSalinity;
  const targetSaltCorrection = targetSaltInCheesePct / 1.8;

  const rawHours = wheelWeightKg * 8.5 * heightCorrection * brineCorrection * targetSaltCorrection;
  const recommendedBriningHours = Math.max(1, Math.round(rawHours * 10) / 10);
  const recommendedBriningDays = Math.round((recommendedBriningHours / 24.0) * 10) / 10;

  const saltUptakeRateGramsPerHour =
    Math.round((totalSaltAbsorbedGrams / recommendedBriningHours) * 100) / 100;

  // Time for salt concentration at the center to reach >= 1.0% (Equilibration time)
  // In slab diffusion: t ~ (x^2) / (4 * D_eff)
  const daysToCoreEquilibration = Math.round((Math.pow(distanceToCoreCm, 2) / (4 * safeDEff)) * 10) / 10;

  const safetyWarningsPl: string[] = [];

  if (clampedBrineSalinity < 16) {
    safetyWarningsPl.push(
      'ZBYT NISKIE ZASOLENIE (<16%): Ryzyko szoku osmotycznego, pęcznienia kazeiny i obślizgłej skórki (slimy rind). Zalecane wzmocnienie do 18–20%.'
    );
  } else if (clampedBrineSalinity > 23) {
    safetyWarningsPl.push(
      'BARDZO MOCNA SOLANKA (>23%): Sól krystalizuje na powierzchni, blokując dyfuzję w głąb sera i tworząc twardą, suchą skorupę.'
    );
  }

  if (brineTempC > 15) {
    safetyWarningsPl.push(
      'PODWYŻSZONA TEMPERATURA SOLANKI (>15°C): Ryzyko szybkiego rozwoju niepożądanych bakterii i ucieczki wilgoci z powierzchni sera. Schłodź solankę do 10–13°C.'
    );
  } else if (brineTempC < 9) {
    safetyWarningsPl.push(
      'ZIMNA SOLANKA (<9°C): Dyfuzja soli spowolniona o ponad 25%. Czas solenia należy wydłużyć.'
    );
  }

  if (daysToCoreEquilibration > 40) {
    safetyWarningsPl.push(
      `DŁUGI CZAS DYFUZJI DO RDZENIA (${daysToCoreEquilibration} dni): Rdzeń sera będzie niedosolony przez pierwsze tygodnie. Utrzymuj temperaturę piwnicy < 12°C, aby zapobiec wczesnemu zakażeniu wnętrza.`
    );
  }

  let equilibrationSchedulePl = '';
  if (daysToCoreEquilibration <= 14) {
    equilibrationSchedulePl = `Szybka dyfuzja: sól osiągnie rdzeń krążka już po ok. ${daysToCoreEquilibration} dniach leżakowania (niski krążek o dużej powierzchni wymiany).`;
  } else if (daysToCoreEquilibration <= 30) {
    equilibrationSchedulePl = `Standardowa dyfuzja Ficka: pełne wyrównanie stężenia soli w całym przekroju krążka nastąpi po ok. ${daysToCoreEquilibration} dniach w piwniczce.`;
  } else {
    equilibrationSchedulePl = `Wydłużona dyfuzja Ficka: ze względu na dużą grubość (${heightCm} cm), sól dotrze do centrum dopiero po ok. ${daysToCoreEquilibration} dniach.`;
  }

  return {
    surfaceAreaCm2,
    volumeCm3,
    halfThicknessCm,
    distanceToCoreCm,
    recommendedBriningHours,
    recommendedBriningDays,
    diffusionCoefficientCm2PerDay: safeDEff,
    daysToCoreEquilibration,
    saltUptakeRateGramsPerHour,
    totalSaltAbsorbedGrams,
    safetyWarningsPl,
    equilibrationSchedulePl,
  };
}
