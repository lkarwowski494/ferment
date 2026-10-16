// ============================================================================
// Apps4Brew Studio — FERMENT ASTM E104 Saturated Salt Hygrometer Calibration
// Precision psychrometry sensor calibration for artisanal cheese aging caves
// ============================================================================

export type CalibrationSaltType = 'NACL_TABLE_SALT' | 'KCL_POTASSIUM_CHLORIDE' | 'K2SO4_POTASSIUM_SULFATE' | 'MGCL2_MAGNESIUM_CHLORIDE';

export type SensorAccuracyGrade = 'EXCELLENT' | 'ACCEPTABLE_DRIFT' | 'SIGNIFICANT_DRIFT' | 'DEFECTIVE_SENSOR';

export interface SaturatedSaltMeta {
  type: CalibrationSaltType;
  namePl: string;
  chemicalFormula: string;
  nominalRh20C: number;
  descriptionPl: string;
  recommendedUse: string;
}

export const SATURATED_SALTS: Record<CalibrationSaltType, SaturatedSaltMeta> = {
  NACL_TABLE_SALT: {
    type: 'NACL_TABLE_SALT',
    namePl: 'Sól kuchenna (Chlorek sodu)',
    chemicalFormula: 'NaCl',
    nominalRh20C: 75.3,
    descriptionPl: 'Powszechnie dostępna sól kuchenna bez dodatków przeciwzbrylających.',
    recommendedUse: 'Podstawowa kalibracja 1-punktowa w każdym gospodarstwie domowym.',
  },
  KCL_POTASSIUM_CHLORIDE: {
    type: 'KCL_POTASSIUM_CHLORIDE',
    namePl: 'Chlorek potasu (Sól potasowa)',
    chemicalFormula: 'KCl',
    nominalRh20C: 84.3,
    descriptionPl: 'Laboratoryjny roztwór nasycony w samym sercu mikroklimatu serowarskiego.',
    recommendedUse: 'Złoty standard kalibracji dla serów twardych (Gouda, Cheddar, Gruyère).',
  },
  K2SO4_POTASSIUM_SULFATE: {
    type: 'K2SO4_POTASSIUM_SULFATE',
    namePl: 'Siarczan potasu',
    chemicalFormula: 'K2SO4',
    nominalRh20C: 97.6,
    descriptionPl: 'Wysokowilgotnościowy roztwór nasycony dla skórki maziowej i pleśni.',
    recommendedUse: 'Punkt odniesienia dla serów maziowych i pleśni białej (Brie, Camembert, Munster).',
  },
  MGCL2_MAGNESIUM_CHLORIDE: {
    type: 'MGCL2_MAGNESIUM_CHLORIDE',
    namePl: 'Chlorek magnezu',
    chemicalFormula: 'MgCl2',
    nominalRh20C: 33.1,
    descriptionPl: 'Niskowilgotnościowy roztwór nasycony do kalibracji dwupunktowej.',
    recommendedUse: 'Dolny punkt odniesienia do wyznaczenia nachylenia krzywej (slope factor).',
  },
};

const ASTM_DATA: Record<CalibrationSaltType, { t: number; rh: number }[]> = {
  NACL_TABLE_SALT: [
    { t: 10, rh: 75.7 },
    { t: 15, rh: 75.6 },
    { t: 20, rh: 75.3 },
    { t: 25, rh: 75.3 },
    { t: 30, rh: 75.1 },
  ],
  KCL_POTASSIUM_CHLORIDE: [
    { t: 10, rh: 86.8 },
    { t: 15, rh: 85.9 },
    { t: 20, rh: 84.3 },
    { t: 25, rh: 84.3 },
    { t: 30, rh: 83.6 },
  ],
  K2SO4_POTASSIUM_SULFATE: [
    { t: 10, rh: 98.2 },
    { t: 15, rh: 97.9 },
    { t: 20, rh: 97.6 },
    { t: 25, rh: 97.3 },
    { t: 30, rh: 97.0 },
  ],
  MGCL2_MAGNESIUM_CHLORIDE: [
    { t: 10, rh: 33.5 },
    { t: 15, rh: 33.3 },
    { t: 20, rh: 33.1 },
    { t: 25, rh: 32.8 },
    { t: 30, rh: 32.4 },
  ],
};

/**
 * Returns exact ASTM E104 equilibrium relative humidity (%) at given temperature (°C).
 */
export function getAstmEquilibriumRh(salt: CalibrationSaltType, tempC: number): number {
  const table = ASTM_DATA[salt];
  const t = Math.max(table[0].t, Math.min(table[table.length - 1].t, tempC));

  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];
    if (t >= p1.t && t <= p2.t) {
      if (p1.t === p2.t) return p1.rh;
      const frac = (t - p1.t) / (p2.t - p1.t);
      const val = p1.rh + frac * (p2.rh - p1.rh);
      return Math.round(val * 10) / 10;
    }
  }
  return table[table.length - 1].rh;
}

export interface SinglePointCalibrationInput {
  saltType: CalibrationSaltType;
  chamberTempC: number;
  rawSensorReadingPct: number;
  measuredCaveRawRhPct?: number;
}

export interface SinglePointCalibrationResult {
  saltType: CalibrationSaltType;
  referenceEquilibriumRh: number;
  rawSensorReadingPct: number;
  offsetPct: number; // referenceRh - rawSensorReading
  accuracyGrade: SensorAccuracyGrade;
  gradeLabelPl: string;
  calibratedCaveRhPct?: number;
  cheeseCaveAffinageImpact: string;
  testingChecklist: string[];
}

export interface TwoPointCalibrationInput {
  lowSalt: CalibrationSaltType;
  lowSaltTempC: number;
  lowRawSensorReadingPct: number;

  highSalt: CalibrationSaltType;
  highSaltTempC: number;
  highRawSensorReadingPct: number;

  measuredCaveRawRhPct?: number;
}

export interface TwoPointCalibrationResult {
  lowRefRh: number;
  highRefRh: number;
  slopeA: number;
  interceptB: number;
  accuracyGrade: SensorAccuracyGrade;
  gradeLabelPl: string;
  calibratedCaveRhPct?: number;
  calibrationFormula: string;
}

export function calculateSinglePointCalibration(
  input: SinglePointCalibrationInput
): SinglePointCalibrationResult {
  const { saltType, chamberTempC, rawSensorReadingPct, measuredCaveRawRhPct } = input;

  const referenceEquilibriumRh = getAstmEquilibriumRh(saltType, chamberTempC);
  const offsetPct = Math.round((referenceEquilibriumRh - rawSensorReadingPct) * 10) / 10;
  const absOffset = Math.abs(offsetPct);

  let accuracyGrade: SensorAccuracyGrade = 'EXCELLENT';
  let gradeLabelPl = 'Wzorcowa dokładność fabryczna (błąd ≤ 2%)';

  if (absOffset > 12) {
    accuracyGrade = 'DEFECTIVE_SENSOR';
    gradeLabelPl = 'Krytyczne rozkalibrowanie sensora (> 12%) — zalecana wymiana';
  } else if (absOffset > 6) {
    accuracyGrade = 'SIGNIFICANT_DRIFT';
    gradeLabelPl = 'Znaczący błąd pomiaru (7–12%) — bezwzględnie stosuj offset programowy';
  } else if (absOffset > 2) {
    accuracyGrade = 'ACCEPTABLE_DRIFT';
    gradeLabelPl = 'Typowy dryf sensora domowego (3–6%) — skorygowany offsetem';
  }

  let calibratedCaveRhPct: number | undefined;
  if (measuredCaveRawRhPct !== undefined) {
    calibratedCaveRhPct = Math.max(0, Math.min(100, Math.round((measuredCaveRawRhPct + offsetPct) * 10) / 10));
  }

  // Affinage impact analysis
  let cheeseCaveAffinageImpact = 'Sensor mierzy wilgotność z wysoką precyzją. Mikroklimat piwniczki odzwierciedla stan faktyczny.';
  if (offsetPct < -4) {
    cheeseCaveAffinageImpact =
      `Higrometr zawyża wilgotność o ${Math.abs(offsetPct)}%! Gdy wyświetlacz pokazuje 85%, realnie w jaskini jest tylko ${(85 + offsetPct).toFixed(1)}%. Krążki sera są narażone na wysychanie, pękanie i case hardening!`;
  } else if (offsetPct > 4) {
    cheeseCaveAffinageImpact =
      `Higrometr zaniża wilgotność o ${offsetPct}%! Gdy wyświetlacz pokazuje 85%, realna wilgotność wynosi ${(85 + offsetPct).toFixed(1)}%. Ryzyko kondensacji, śliskiej skórki (slip skin) i inwazji czarnego grzyba Mucor!`;
  }

  const testingChecklist: string[] = [
    '1. Do małego naczynka (np. kieliszka) wsyp 2-3 łyżeczki soli i dodaj kilka kropel wody, uzyskując mokrą papkę (nie roztwór płynny!).',
    '2. Wstaw naczynko z solą i higrometr do szczelnego słoika lub woreczka strunowego (ziploc).',
    '3. Zamknij szczelnie i odczekaj min. 8-12 godzin w stabilnej temperaturze pokojowej bez przeciągów.',
    `4. Odczytaj wartość: wzorcowa wilgotność dla ${SATURATED_SALTS[saltType].chemicalFormula} w ${chamberTempC}°C wynosi dokładnie ${referenceEquilibriumRh}%.`,
    `5. Wprowadzony offset (${offsetPct >= 0 ? '+' : ''}${offsetPct}%) jest automatycznie uwzględniany w kalkulatorze piwniczki.`,
  ];

  return {
    saltType,
    referenceEquilibriumRh,
    rawSensorReadingPct,
    offsetPct,
    accuracyGrade,
    gradeLabelPl,
    calibratedCaveRhPct,
    cheeseCaveAffinageImpact,
    testingChecklist,
  };
}

export function calculateTwoPointCalibration(
  input: TwoPointCalibrationInput
): TwoPointCalibrationResult {
  const {
    lowSalt,
    lowSaltTempC,
    lowRawSensorReadingPct,
    highSalt,
    highSaltTempC,
    highRawSensorReadingPct,
    measuredCaveRawRhPct,
  } = input;

  const lowRefRh = getAstmEquilibriumRh(lowSalt, lowSaltTempC);
  const highRefRh = getAstmEquilibriumRh(highSalt, highSaltTempC);

  const rawDelta = highRawSensorReadingPct - lowRawSensorReadingPct;
  const slopeA = rawDelta !== 0 ? Math.round(((highRefRh - lowRefRh) / rawDelta) * 1000) / 1000 : 1;
  const interceptB = Math.round((highRefRh - slopeA * highRawSensorReadingPct) * 10) / 10;

  const maxDeviation = Math.max(
    Math.abs(highRefRh - highRawSensorReadingPct),
    Math.abs(lowRefRh - lowRawSensorReadingPct)
  );

  let accuracyGrade: SensorAccuracyGrade = 'EXCELLENT';
  let gradeLabelPl = 'Wysoka liniowość sensora (odchylenie ≤ 2%)';

  if (maxDeviation > 12) {
    accuracyGrade = 'DEFECTIVE_SENSOR';
    gradeLabelPl = 'Krytyczne rozkalibrowanie nieliniowe sensora';
  } else if (maxDeviation > 6) {
    accuracyGrade = 'SIGNIFICANT_DRIFT';
    gradeLabelPl = 'Wyraźne zniekształcenie charakterystyki sensora';
  } else if (maxDeviation > 2) {
    accuracyGrade = 'ACCEPTABLE_DRIFT';
    gradeLabelPl = 'Drobna nieliniowość skorygowana 2-punktowo';
  }

  let calibratedCaveRhPct: number | undefined;
  if (measuredCaveRawRhPct !== undefined) {
    const rawCal = slopeA * measuredCaveRawRhPct + interceptB;
    calibratedCaveRhPct = Math.max(0, Math.min(100, Math.round(rawCal * 10) / 10));
  }

  const sign = interceptB >= 0 ? '+' : '';
  const calibrationFormula = `RH_skorygowane = ${slopeA} × RH_surowe ${sign} ${interceptB}%`;

  return {
    lowRefRh,
    highRefRh,
    slopeA,
    interceptB,
    accuracyGrade,
    gradeLabelPl,
    calibratedCaveRhPct,
    calibrationFormula,
  };
}
