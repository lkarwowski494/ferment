// ============================================================================
// Apps4Brew Studio — FERMENT Traditional Polish Mead (Miodosytnictwo) Engine
// Półtorak, Dwójniak, Trójniak, Czwórniak, TOSNA 3.0, and Osmotic Step-Feeding
// ============================================================================

export type PolishMeadGrade = 'POLTORAK' | 'DWOJNIAK' | 'TROJNIAK' | 'CZWORNIAK';

export type MeadPreparationType = 'SYCONY' | 'NIESYCONY'; // Gotowany z szumowaniem vs zimny na surowo

export interface MeadBatchInput {
  grade: PolishMeadGrade;
  targetTotalVolumeLiters: number;
  honeyTypePl?: string; // np. lipowy, gryczany, wielokwiatowy
  preparation: MeadPreparationType;
  ambientTempC?: number;
}

export interface MeadBatchResult {
  grade: PolishMeadGrade;
  gradeNamePl: string;
  honeyLiters: number;
  honeyWeightKg: number; // gęstość miodu ~1.42 kg/L
  waterLiters: number;
  initialBallingDegrees: number; // °Blg
  initialSpecificGravity: number; // SG
  expectedAbvPct: number;
  expectedAgingYears: { min: number; max: number };
  isStepFeedingMandatory: boolean;
  stepFeedingDosesLiters: number[];
  tosnaNutrientGramsTotal: number; // dawka Fermaid O
  tosnaAdditionsSchedulePl: string[];
  preparationAdvicePl: string;
  alertsPl: string[];
  alertsEn: string[];
}

export const MEAD_GRADE_CONFIGS: Record<
  PolishMeadGrade,
  {
    namePl: string;
    honeyToWaterRatio: string;
    nominalBlg: number;
    nominalSg: number;
    targetAbv: number;
    agingMinYears: number;
    agingMaxYears: number;
    stepFeedingNeeded: boolean;
    descriptionPl: string;
  }
> = {
  POLTORAK: {
    namePl: 'Półtorak (Królewski)',
    honeyToWaterRatio: '1 : 0.5 (1 obj. miodu na 0.5 obj. wody)',
    nominalBlg: 60.0,
    nominalSg: 1.285,
    targetAbv: 16.5,
    agingMinYears: 4,
    agingMaxYears: 8,
    stepFeedingNeeded: true,
    descriptionPl: 'Najszlachetniejszy, gęsty likierowy miód pitny. Ekstremalne ciśnienie osmotyczne (>180 atm) wymaga partionowania miodu.',
  },
  DWOJNIAK: {
    namePl: 'Dwójniak (Szlachecki)',
    honeyToWaterRatio: '1 : 1 (1 obj. miodu na 1 obj. wody)',
    nominalBlg: 50.0,
    nominalSg: 1.225,
    targetAbv: 15.5,
    agingMinYears: 2,
    agingMaxYears: 4,
    stepFeedingNeeded: true,
    descriptionPl: 'Słodki i deserowy. Znakomity balans słodyczy i alkoholu. Wymaga drożdży o wysokiej tolerancji alkoholowej.',
  },
  TROJNIAK: {
    namePl: 'Trójniak (Pospolity)',
    honeyToWaterRatio: '1 : 2 (1 obj. miodu na 2 obj. wody)',
    nominalBlg: 34.0,
    nominalSg: 1.150,
    targetAbv: 13.0,
    agingMinYears: 1,
    agingMaxYears: 2,
    stepFeedingNeeded: false,
    descriptionPl: 'Półsłodki / półwytrawny. Najpopularniejszy tradycyjny miód rzemieślniczy o zrównoważonym ciele.',
  },
  CZWORNIAK: {
    namePl: 'Czwórniak (Stołowy)',
    honeyToWaterRatio: '1 : 3 (1 obj. miodu na 3 obj. wody)',
    nominalBlg: 26.0,
    nominalSg: 1.110,
    targetAbv: 10.5,
    agingMinYears: 0.5,
    agingMaxYears: 1,
    stepFeedingNeeded: false,
    descriptionPl: 'Lekki, wytrawny miód sesyjny, wspaniały do orzeźwienia latem, gotowy do picia po 6 miesiącach.',
  },
};

/**
 * Oblicza proporcje miodu, wody, gęstość, harmonogram odżywek TOSNA i partionowanie miodu.
 */
export function calculateMeadBatch(input: MeadBatchInput): MeadBatchResult {
  const config = MEAD_GRADE_CONFIGS[input.grade];
  const totalVolume = Math.max(1, input.targetTotalVolumeLiters);
  const honeyDensity = 1.42; // kg na litr płynnego miodu

  let honeyVolumeFraction = 0.33; // Trójniak: 1 / (1+2) = 1/3
  switch (input.grade) {
    case 'POLTORAK':
      honeyVolumeFraction = 1.0 / 1.5; // ~0.667
      break;
    case 'DWOJNIAK':
      honeyVolumeFraction = 1.0 / 2.0; // 0.50
      break;
    case 'TROJNIAK':
      honeyVolumeFraction = 1.0 / 3.0; // ~0.333
      break;
    case 'CZWORNIAK':
      honeyVolumeFraction = 1.0 / 4.0; // 0.25
      break;
  }

  const honeyLiters = Number((totalVolume * honeyVolumeFraction).toFixed(2));
  const waterLiters = Number((totalVolume * (1 - honeyVolumeFraction)).toFixed(2));
  const honeyWeightKg = Number((honeyLiters * honeyDensity).toFixed(2));

  // TOSNA 3.0 (Tailored Organic Staggered Nutrient Addition):
  // Zapotrzebowanie YAN (mg N/L) = SG * 1000 - 1000 * współczynnik
  // W uproszczeniu dla czystego miodu (YAN bliski 0):
  // Gramy Fermaid O = (Objętość L) * (SG - 1.000) * 18.5
  const deltaSg = config.nominalSg - 1.000;
  const tosnaNutrientGramsTotal = Math.round(totalVolume * deltaSg * 18.5);
  const dosePerStep = Number((tosnaNutrientGramsTotal / 4).toFixed(1));

  const tosnaAdditionsSchedulePl = [
    `1. Dawka (24h po zadaniu drożdży): ${dosePerStep} g odżywki organicznej (Fermaid O)`,
    `2. Dawka (48h po zadaniu): ${dosePerStep} g odżywki organicznej`,
    `3. Dawka (72h po zadaniu): ${dosePerStep} g odżywki organicznej`,
    `4. Dawka (przy 1/3 odfermentowania cukru): ${dosePerStep} g odżywki organicznej (nie dodawać później!)`,
  ];

  // Partionowanie miodu (Step-Feeding):
  // Przy Półtoraku i Dwójniaku zadanie całego miodu na raz zabija drożdże szokiem osmotycznym.
  // Zaczynamy od brzeczki o gęstości Trójniaka (~34 °Blg), a resztę miodu dodajemy w 2 dawkach.
  const isStepFeedingMandatory = config.stepFeedingNeeded;
  const stepFeedingDosesLiters: number[] = [];

  if (isStepFeedingMandatory) {
    if (input.grade === 'POLTORAK') {
      stepFeedingDosesLiters.push(Number((honeyLiters * 0.50).toFixed(2))); // baza
      stepFeedingDosesLiters.push(Number((honeyLiters * 0.25).toFixed(2))); // po 5-7 dniach
      stepFeedingDosesLiters.push(Number((honeyLiters * 0.25).toFixed(2))); // po spowolnieniu
    } else {
      // Dwójniak
      stepFeedingDosesLiters.push(Number((honeyLiters * 0.65).toFixed(2))); // baza
      stepFeedingDosesLiters.push(Number((honeyLiters * 0.35).toFixed(2))); // po 7 dniach
    }
  } else {
    stepFeedingDosesLiters.push(honeyLiters);
  }

  const alertsPl: string[] = [];
  const alertsEn: string[] = [];

  if (isStepFeedingMandatory) {
    alertsPl.push(
      `WYSOKI SZOK OSMOTYCZNY (${config.nominalBlg}°Blg): Nie wlewaj całego miodu na raz! Zastosuj podział na ${stepFeedingDosesLiters.length} raty.`
    );
    alertsEn.push(
      `SEVERE OSMOTIC SHOCK (${config.nominalBlg}°Blg): Do not pitch yeast into full gravity! Use staggered honey addition across ${stepFeedingDosesLiters.length} doses.`
    );
  }

  const preparationAdvicePl =
    input.preparation === 'SYCONY'
      ? 'Miód sycony: gotuj brzeczkę na wolnym ogniu przez 30–60 min, regularnie szumując pianę (wosk i białka pszczele). Daje szybsze klarowanie, lecz ulatnia delikatne aromaty kwiatowe.'
      : 'Miód niesycony (na surowo): rozpuść miód w ciepłej wodzie (maks. 38°C). Zachowuje 100% olejków eterycznych i enzymów pszczelich, wymaga rygorystycznej sterylizacji naczynia.';

  return {
    grade: input.grade,
    gradeNamePl: config.namePl,
    honeyLiters,
    honeyWeightKg,
    waterLiters,
    initialBallingDegrees: config.nominalBlg,
    initialSpecificGravity: config.nominalSg,
    expectedAbvPct: config.targetAbv,
    expectedAgingYears: { min: config.agingMinYears, max: config.agingMaxYears },
    isStepFeedingMandatory,
    stepFeedingDosesLiters,
    tosnaNutrientGramsTotal,
    tosnaAdditionsSchedulePl,
    preparationAdvicePl,
    alertsPl,
    alertsEn,
  };
}
