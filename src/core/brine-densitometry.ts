// ============================================================================
// Apps4Brew Studio — FERMENT Brine Densitometry & Hydrometer Temp Compensation
// Salometer (°Sal), Baumé (°Bé), Specific Gravity (SG) and % NaCl Conversions
// ============================================================================

export type HydrometerCalibrationTemp = 15.56 | 20.0; // 60°F or 20°C

export type BrineTargetProfileKey =
  | 'HARD_CHEESE_HEAVY' // Gouda, Parmesan, Cheddar (18-20 °Bé / 72-80 °Sal)
  | 'SOFT_CHEESE_MEDIUM' // Camembert, Brie (14-16 °Bé / 55-63 °Sal)
  | 'FETA_STORAGE' // Solanka do przechowywania fety (7-8 °Bé / 27-32 °Sal)
  | 'PASTA_FILATA_BRINE' // Mozzarella, Provolone (16-18 °Bé / 64-72 °Sal)
  | 'VEG_PICKLE_SOUR' // Ogórki kiszone / zakwasy (5-6% / 19-23 °Sal)
  | 'VEG_LOW_SALT'; // Małosolne / lekkie kiszonki (2.5-3.5% / 10-14 °Sal)

export interface BrineTargetProfile {
  key: BrineTargetProfileKey;
  namePl: string;
  nameEn: string;
  targetPercentMin: number;
  targetPercentMax: number;
  targetSalometerMin: number;
  targetSalometerMax: number;
  targetBaumeMin: number;
  targetBaumeMax: number;
  descriptionPl: string;
}

export const BRINE_TARGET_PROFILES: Record<BrineTargetProfileKey, BrineTargetProfile> = {
  HARD_CHEESE_HEAVY: {
    key: 'HARD_CHEESE_HEAVY',
    namePl: 'Sery twarde i półtwarde (Gouda, Parmezan, Cheddar)',
    nameEn: 'Hard & Semi-Hard Cheeses (Gouda, Parmesan, Cheddar)',
    targetPercentMin: 19.0,
    targetPercentMax: 21.0,
    targetSalometerMin: 72.0,
    targetSalometerMax: 80.0,
    targetBaumeMin: 18.0,
    targetBaumeMax: 20.0,
    descriptionPl: 'Klasyczna mocna solanka serowarska gwarantująca właściwy ociek i tworzenie zwartej skórki.',
  },
  SOFT_CHEESE_MEDIUM: {
    key: 'SOFT_CHEESE_MEDIUM',
    namePl: 'Sery miękkie z porostem (Camembert, Brie)',
    nameEn: 'Soft Bloomy Rind Cheeses (Camembert, Brie)',
    targetPercentMin: 14.0,
    targetPercentMax: 16.0,
    targetSalometerMin: 53.0,
    targetSalometerMax: 61.0,
    targetBaumeMin: 13.5,
    targetBaumeMax: 15.5,
    descriptionPl: 'Umiarkowane zasolenie niehamujące wzrostu delikatnej pleśni Penicillium camemberti.',
  },
  FETA_STORAGE: {
    key: 'FETA_STORAGE',
    namePl: 'Solanka do dojrzewania i przechowywania Fety',
    nameEn: 'Feta Preservation & Maturation Brine',
    targetPercentMin: 7.0,
    targetPercentMax: 8.5,
    targetSalometerMin: 26.5,
    targetSalometerMax: 32.2,
    targetBaumeMin: 6.8,
    targetBaumeMax: 8.3,
    descriptionPl: 'Roztwór zabezpieczający ser solankowy przed rozpuszczaniem krawędzi (wymaga buforu CaCl2 i pH).',
  },
  PASTA_FILATA_BRINE: {
    key: 'PASTA_FILATA_BRINE',
    namePl: 'Sery parzone Pasta Filata (Mozzarella, Scamorza)',
    nameEn: 'Pasta Filata Cheeses (Mozzarella, Scamorza)',
    targetPercentMin: 16.0,
    targetPercentMax: 18.0,
    targetSalometerMin: 60.5,
    targetSalometerMax: 68.2,
    targetBaumeMin: 15.5,
    targetBaumeMax: 17.5,
    descriptionPl: 'Szybkie solenie po rozciąganiu w gorącej wodzie dla uformowania elastycznego miąższu.',
  },
  VEG_PICKLE_SOUR: {
    key: 'VEG_PICKLE_SOUR',
    namePl: 'Kiszonki tradycyjne (Ogórki kiszone, pomidory)',
    nameEn: 'Traditional Vegetable Ferments (Sour pickles, green tomatoes)',
    targetPercentMin: 5.0,
    targetPercentMax: 6.5,
    targetSalometerMin: 19.0,
    targetSalometerMax: 24.6,
    targetBaumeMin: 4.8,
    targetBaumeMax: 6.3,
    descriptionPl: 'Mocna solanka warzywna chroniąca przed mięknięciem i rozwojem niepożądanych bakterii.',
  },
  VEG_LOW_SALT: {
    key: 'VEG_LOW_SALT',
    namePl: 'Kiszonki małosolne i delikatne warzywa (Cukinia, rzodkiewka)',
    nameEn: 'Low-Salt & Summer Pickles (Zucchini, radish, half-sours)',
    targetPercentMin: 2.5,
    targetPercentMax: 3.5,
    targetSalometerMin: 9.5,
    targetSalometerMax: 13.3,
    targetBaumeMin: 2.4,
    targetBaumeMax: 3.4,
    descriptionPl: 'Łagodne zasolenie do szybkiej konsumpcji letniej.',
  },
};

export interface BrineDensitometryInput {
  measuredValue: number;
  unit: 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY' | 'PERCENT_WT';
  sampleTempC: number;
  calibrationTempC?: HydrometerCalibrationTemp; // default 20.0°C
  currentBrineVolumeLiters?: number; // optional for salt adjustment
  targetPercent?: number; // optional target % NaCl
}

export interface BrineDensitometryResult {
  temperatureCorrectedSg: number;
  percentNacl: number;
  salometerDegrees: number;
  baumeDegrees: number;
  gramsNaclPerLiterWater: number;
  gramsNaclPerLiterBrine: number;
  thermalOffsetSg: number;
  status: 'OPTIMAL' | 'TOO_DILUTE' | 'SUPER_SATURATED' | 'ACCEPTABLE';
  alertsPl: string[];
  alertsEn: string[];
  saltAdjustmentGrams?: number;
}

/**
 * Konwersja gęstości pozornej roztworu NaCl (SG przy 20°C) na ułamek wagowy % NaCl.
 * Zależność aproksymowana wzorem wielomianowym na podstawie tablic CRC.
 */
export function specificGravityToPercentNacl(sg: number): number {
  if (sg <= 1.000) return 0;
  // Dla typowego zakresu NaCl 0-26%: SG = 1.000 + 0.007077 * P + 0.0000305 * P^2
  // Rozwiązanie równania kwadratowego a*P^2 + b*P - (SG - 1) = 0
  const a = 0.0000305;
  const b = 0.007077;
  const c = -(sg - 1.0);
  const delta = b * b - 4 * a * c;
  if (delta < 0) return 0;
  const percent = (-b + Math.sqrt(delta)) / (2 * a);
  return Math.min(26.4, Math.max(0, percent));
}

/**
 * Konwersja ułamka wagowego % NaCl na gęstość właściwą SG przy 20°C.
 */
export function percentNaclToSpecificGravity(percent: number): number {
  const p = Math.min(26.4, Math.max(0, percent));
  return 1.000 + 0.007077 * p + 0.0000305 * p * p;
}

/**
 * Konwersja stopni Baumé na SG (dla cieczy cięższych od wody, wzorzec 145).
 */
export function baumeToSpecificGravity(baume: number): number {
  if (baume <= 0) return 1.000;
  if (baume >= 145) return 2.000;
  return 145 / (145 - baume);
}

/**
 * Konwersja SG na stopnie Baumé.
 */
export function specificGravityToBaume(sg: number): number {
  if (sg <= 1.000) return 0;
  return 145 * (1 - 1 / sg);
}

/**
 * Konwersja % NaCl na stopnie Salometru (°Sal).
 * 100°Sal = nasycona solanka 26.395% wagowo NaCl.
 */
export function percentToSalometer(percent: number): number {
  return (percent / 26.395) * 100;
}

/**
 * Konwersja stopni Salometru na % NaCl.
 */
export function salometerToPercent(salometer: number): number {
  return (salometer / 100) * 26.395;
}

/**
 * Główny silnik przeliczeń aerometrycznych solanki z kompensacją temperatury.
 */
export function calculateBrineDensitometry(input: BrineDensitometryInput): BrineDensitometryResult {
  const calTemp = input.calibrationTempC ?? 20.0;
  const sampleTemp = input.sampleTempC;

  // Krok 1: Wyznaczenie nominalnego SG z pomiaru w temperaturze próbki
  let measuredSg = 1.000;
  switch (input.unit) {
    case 'SPECIFIC_GRAVITY':
      measuredSg = input.measuredValue;
      break;
    case 'BAUME':
      measuredSg = baumeToSpecificGravity(input.measuredValue);
      break;
    case 'SALOMETER': {
      const p = salometerToPercent(input.measuredValue);
      measuredSg = percentNaclToSpecificGravity(p);
      break;
    }
    case 'PERCENT_WT':
      measuredSg = percentNaclToSpecificGravity(input.measuredValue);
      break;
  }

  // Krok 2: Kompensacja temperaturowa
  // Ciecz o wyższej temp rozszerza się, areometr zanurza się głębiej (mierzy za mało).
  // Współczynnik rozszerzalności solanki wynosi ok. 0.00032 SG na każdy 1°C różnicy.
  const deltaT = sampleTemp - calTemp;
  const thermalOffsetSg = deltaT * 0.00032;
  const correctedSg = Math.max(1.000, measuredSg + thermalOffsetSg);

  // Krok 3: Wyliczenie zunifikowanych parametrów roztworu
  const percentNacl = specificGravityToPercentNacl(correctedSg);
  const salometerDegrees = percentToSalometer(percentNacl);
  const baumeDegrees = specificGravityToBaume(correctedSg);

  // g/L roztworu i g/L czystej wody
  const gramsNaclPerLiterBrine = percentNacl * correctedSg * 10;
  const gramsNaclPerLiterWater = percentNacl >= 100
    ? 0
    : (percentNacl / (100 - percentNacl)) * 1000;

  // Krok 4: Weryfikacja bezpieczeństwa i alerty
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];
  let status: BrineDensitometryResult['status'] = 'OPTIMAL';

  if (percentNacl >= 26.0) {
    status = 'SUPER_SATURATED';
    alertsPl.push('Solanka nasycona lub przesycona (>26% NaCl). Nadmiar soli krystalizuje na dnie naczynia.');
    alertsEn.push('Saturated/supersaturated brine (>26% NaCl). Excess salt will precipitate to the bottom.');
  } else if (percentNacl < 6.0) {
    status = 'TOO_DILUTE';
    alertsPl.push('Bardzo niskie zasolenie (<6% NaCl). Niewystarczające dla serów twardych — ryzyko śluzowacenia i puchnięcia.');
    alertsEn.push('Very low salinity (<6% NaCl). Inadequate for hard cheeses — risk of mucor and swelling.');
  }

  // Krok 5: Kalkulacja dawki soli do poziomu docelowego (jeśli podano objętość i cel)
  let saltAdjustmentGrams: number | undefined;
  if (input.currentBrineVolumeLiters && input.currentBrineVolumeLiters > 0 && input.targetPercent !== undefined) {
    const targetP = Math.min(26.3, Math.max(0, input.targetPercent));
    if (targetP > percentNacl) {
      // Masa aktualnej solanki = objętość (L) * gęstość (kg/L)
      const currentBrineMassKg = input.currentBrineVolumeLiters * correctedSg;
      const currentSaltKg = currentBrineMassKg * (percentNacl / 100);
      const waterKg = currentBrineMassKg - currentSaltKg;
      // W docelowym roztworze: targetSaltKg / (waterKg + targetSaltKg) = targetP / 100
      // targetSaltKg * (1 - targetP/100) = waterKg * (targetP/100)
      const targetSaltKg = waterKg * (targetP / (100 - targetP));
      const neededSaltKg = Math.max(0, targetSaltKg - currentSaltKg);
      saltAdjustmentGrams = Math.round(neededSaltKg * 1000);
    } else {
      saltAdjustmentGrams = 0;
    }
  }

  return {
    temperatureCorrectedSg: Number(correctedSg.toFixed(4)),
    percentNacl: Number(percentNacl.toFixed(2)),
    salometerDegrees: Number(salometerDegrees.toFixed(1)),
    baumeDegrees: Number(baumeDegrees.toFixed(1)),
    gramsNaclPerLiterWater: Math.round(gramsNaclPerLiterWater),
    gramsNaclPerLiterBrine: Math.round(gramsNaclPerLiterBrine),
    thermalOffsetSg: Number(thermalOffsetSg.toFixed(4)),
    status,
    alertsPl,
    alertsEn,
    saltAdjustmentGrams,
  };
}
