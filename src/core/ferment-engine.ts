// ============================================================================
// Apps4Brew Studio — FERMENT Ferment Engine & Plant/Beverage Kinetics
// Biochemical Tier 1 Rigor (Katz / USDA Food Safety / Acetobacter Stoichiometry)
// ============================================================================

export interface TotalSalinityResult {
  totalMassGrams: number;
  saltGrams: number;
  effectiveSalinityPct: number;
  warning?: string;
}

export type BotulinumStatus = 'SAFE' | 'BORDERLINE' | 'ACIDIFYING' | 'CRITICAL_DANGER';

export interface BotulinumSafetyResult {
  ph: number;
  status: BotulinumStatus;
  isSafe: boolean;
  message: string;
}

export interface KimchiPrepResult {
  cabbageWeightGrams: number;
  saltWeightGrams: number;
  minWiltHours: number;
  turnIntervalHours: number;
  paste: {
    riceFlourGrams: number;
    waterForPorridgeMl: number;
    gochugaruGrams: number;
    garlicGrams: number;
    gingerGrams: number;
    fishOrSoySauceMl: number;
  };
}

export interface Kombucha1FResult {
  waterLiters: number;
  teaGrams: number;
  sugarGrams: number;
  starterLiquidMl: number;
  totalVolumeLiters: number;
  warning?: string;
}

export interface Kombucha2FPressureResult {
  estimatedCo2Volumes: number;
  riskLevel: 'LOW' | 'OPTIMAL' | 'HIGH' | 'EXPLOSION_HAZARD';
  refrigerationRequired: boolean;
  message: string;
}

export interface VinegarConversionResult {
  initialBrix: number;
  estimatedAbvPct: number;
  expectedAceticAcidPct: number;
  isAbvTooHigh: boolean;
  waterDilutionMlNeededPerLiter?: number;
  message: string;
}

/**
 * RD-26: Total Salinity Guard — oblicza wagę soli na masę całkowitą nastawu (warzywa + woda).
 */
export function calculateTotalBatchSalinity(
  vegWeightGrams: number,
  waterWeightGrams: number,
  targetSalinityPct: number = 2.2
): TotalSalinityResult {
  if (vegWeightGrams <= 0) throw new Error('Waga warzyw musi być większa od zera.');
  if (waterWeightGrams < 0) throw new Error('Waga wody nie może być ujemna.');
  if (targetSalinityPct <= 0 || targetSalinityPct >= 20.0) {
    throw new Error('Docelowe stężenie soli musi mieścić się w przedziale 0.5%–20%.');
  }

  const totalMassGrams = vegWeightGrams + waterWeightGrams;
  // Ścisła formuła: m_soli = (S / (100 - S)) * M_calkowita
  const rawSalt = (targetSalinityPct / (100.0 - targetSalinityPct)) * totalMassGrams;
  const saltGrams = Math.round(rawSalt * 10) / 10;
  const effectiveSalinityPct = Math.round((saltGrams / (totalMassGrams + saltGrams)) * 1000) / 10;

  let warning: string | undefined;
  if (targetSalinityPct < 1.5) {
    warning = 'Stężenie soli < 1.5% grozi mięknięciem tkanek warzyw i rozwojem bakterii gnilnych!';
  }

  return {
    totalMassGrams,
    saltGrams,
    effectiveSalinityPct,
    warning,
  };
}

/**
 * RD-27: Botulinum Guard — weryfikacja bariery kwasowości biologicznej (pH < 4.60).
 */
export function verifyBotulinumSafety(
  currentPh: number,
  hoursElapsed: number = 0
): BotulinumSafetyResult {
  if (currentPh < 0 || currentPh > 14) {
    throw new Error('Wartość pH musi mieścić się w zakresie 0–14.');
  }

  if (currentPh <= 4.40) {
    return {
      ph: currentPh,
      status: 'SAFE',
      isSafe: true,
      message: 'Środowisko bezpieczne. pH poniżej 4.4 trwale uniemożliwia rozwój Clostridium botulinum.',
    };
  }

  if (currentPh <= 4.60) {
    return {
      ph: currentPh,
      status: 'BORDERLINE',
      isSafe: true,
      message: 'Granica bezpieczeństwa botulinowego (4.40 - 4.60). Zalecane dalsze zakwaszanie.',
    };
  }

  // pH > 4.60
  if (hoursElapsed >= 72) {
    return {
      ph: currentPh,
      status: 'CRITICAL_DANGER',
      isSafe: false,
      message: 'ALARM SANITARNY: pH po 72 godzinach wynosi >= 4.6! Ryzyko przetrwania patogenów i toksyny botulinowej. Nie spożywać!',
    };
  }

  return {
    ph: currentPh,
    status: 'ACIDIFYING',
    isSafe: true,
    message: 'Faza wstępna fermentacji. Bakterie kwasu mlekowego obniżają pH wsadu.',
  };
}

/**
 * RD-29: Asystent zasalania i pasty tradycyjnego Kimchi (Baechu-Kimchi).
 */
export function calculateKimchiPrep(cabbageWeightGrams: number): KimchiPrepResult {
  if (cabbageWeightGrams <= 0) throw new Error('Waga kapusty musi być większa od zera.');

  // Zasalanie na sucho: 8.5% masy kapusty niejodowaną solą morską
  const saltWeightGrams = Math.round(cabbageWeightGrams * 0.085);

  // Pasta smakowa na zadaną wagę kapusty
  const factor = cabbageWeightGrams / 1000.0;
  return {
    cabbageWeightGrams,
    saltWeightGrams,
    minWiltHours: 4,
    turnIntervalHours: 2,
    paste: {
      riceFlourGrams: Math.round(15.0 * factor),
      waterForPorridgeMl: Math.round(150.0 * factor),
      gochugaruGrams: Math.round(35.0 * factor),
      garlicGrams: Math.round(25.0 * factor),
      gingerGrams: Math.round(10.0 * factor),
      fishOrSoySauceMl: Math.round(25.0 * factor),
    },
  };
}

/**
 * RD-31: Oblicza proporcje wsadu Kombuchy 1F (Fermentacja tlenowa ze SCOBY).
 */
export function calculateKombucha1F(
  waterLiters: number,
  teaGramsPerLiter: number = 7.0,
  sugarGramsPerLiter: number = 65.0,
  starterPct: number = 12.0
): Kombucha1FResult {
  if (waterLiters <= 0) throw new Error('Objętość wody musi być większa od zera.');

  const teaGrams = Math.round(waterLiters * teaGramsPerLiter);
  const sugarGrams = Math.round(waterLiters * sugarGramsPerLiter);
  const starterLiquidMl = Math.round(waterLiters * (starterPct / 100.0) * 1000);
  const totalVolumeLiters = Math.round((waterLiters + starterLiquidMl / 1000.0) * 100) / 100;

  let warning: string | undefined;
  if (starterPct < 10.0) {
    warning = 'Objętość płynu startowego < 10% nie gwarantuje szybkiego obniżenia pH poniżej 4.5. Ryzyko pleśni!';
  }

  return {
    waterLiters,
    teaGrams,
    sugarGrams,
    starterLiquidMl,
    totalVolumeLiters,
    warning,
  };
}

/**
 * RD-35: Kombucha Bottle Pressure Guard — nasycenie CO2 i ryzyko rozerwania butelek w 2F.
 */
export function calculateKombucha2FPressure(
  residualSugarGramsPerLiter: number,
  daysInRoomTemp: number
): Kombucha2FPressureResult {
  // Przyjmujemy nasycenie bazowe z 1F = 1.0 vol
  // Każdy 1 g/L przetrawionego cukru generuje ok. 0.245 vol CO2
  const consumedSugar = Math.min(residualSugarGramsPerLiter, daysInRoomTemp * 3.0);
  const estimatedCo2Volumes = Math.round((1.0 + consumedSugar * 0.245) * 10) / 10;

  if (estimatedCo2Volumes >= 3.8 || daysInRoomTemp >= 5) {
    return {
      estimatedCo2Volumes,
      riskLevel: 'EXPLOSION_HAZARD',
      refrigerationRequired: true,
      message: 'KRYTYCZNE ZAGROŻENIE ROZERWANIEM SZKŁA! Natychmiast schłodź butelki w lodówce (2–4°C) i ostrożnie odpowietrz!',
    };
  }

  if (estimatedCo2Volumes >= 2.8) {
    return {
      estimatedCo2Volumes,
      riskLevel: 'HIGH',
      refrigerationRequired: true,
      message: 'Optymalne musowanie szampańskie osiągnięte. Wstaw butelki do lodówki, aby zatrzymać wzrost ciśnienia.',
    };
  }

  if (estimatedCo2Volumes >= 1.8) {
    return {
      estimatedCo2Volumes,
      riskLevel: 'OPTIMAL',
      refrigerationRequired: false,
      message: 'Lekkie naturalne musowanie. Kontynuuj refermentację w temperaturze pokojowej.',
    };
  }

  return {
    estimatedCo2Volumes,
    riskLevel: 'LOW',
    refrigerationRequired: false,
    message: 'Niski poziom nagazowania. Faza początkowa refermentacji beztlenowej.',
  };
}

/**
 * RD-32: Stechiometryczny bilans żywych octów owocowych i ABV Inhibition Guard.
 */
export function calculateVinegarConversion(
  initialBrix: number,
  currentAbvPct?: number
): VinegarConversionResult {
  if (initialBrix < 0) throw new Error('Wartość Brix nie może być ujemna.');

  // Z 1°Brix powstaje ok. 0.55% ABV
  const estimatedAbvPct = currentAbvPct !== undefined ? currentAbvPct : Math.round(initialBrix * 0.55 * 10) / 10;
  // Z 1% ABV w obecności Acetobacter powstaje ok. 0.85% kwasu octowego
  const expectedAceticAcidPct = Math.round(estimatedAbvPct * 0.85 * 10) / 10;

  const isAbvTooHigh = estimatedAbvPct > 8.0;
  let waterDilutionMlNeededPerLiter: number | undefined;
  let message: string;

  if (isAbvTooHigh) {
    // Rozcieńczenie do optymalnego 6.0% ABV: V_docelowe = V_poczatkowe * (ABV_obecne / 6.0)
    const targetAbv = 6.0;
    waterDilutionMlNeededPerLiter = Math.round(((estimatedAbvPct / targetAbv) - 1.0) * 1000);
    message = `Stężenie alkoholu (${estimatedAbvPct}% ABV) przekracza 8.0%! Bakterie kwasu octowego (Acetobacter) ulegną zatruciu. Dolej ${waterDilutionMlNeededPerLiter} ml wody na każdy litr wsadu.`;
  } else if (expectedAceticAcidPct >= 5.0) {
    message = `Doskonały wsad octowy. Przewidywana kwasowość ${expectedAceticAcidPct}% kwasu octowego spełnia normę kulinarną (>= 5.0%).`;
  } else {
    message = `Przewidywana kwasowość (${expectedAceticAcidPct}%) może być zbyt łagodna do długiej konserwacji. Rozważ dodanie miodu lub cukru do fermentacji alkoholowej.`;
  }

  return {
    initialBrix,
    estimatedAbvPct,
    expectedAceticAcidPct,
    isAbvTooHigh,
    waterDilutionMlNeededPerLiter,
    message,
  };
}
