// ============================================================================
// Apps4Brew Studio — FERMENT Water Chemistry & Dechlorination Engine
// Chlorine/Chloramine mitigation, general hardness (dGH) & alkalinity buffering
// ============================================================================

export interface DechlorinationResult {
  waterLiters: number;
  freeChlorineDegassingHours: number;
  boilingMinutesNeeded: number;
  vitaminCMgNeededForChloramine: number;
  recommendation: string;
}

export interface WaterHardnessResult {
  dGhTotalHardness: number;
  dKhAlkalinity: number;
  calciumIonPpm: number;
  magnesiumIonPpm: number;
  suitabilityForCheese: 'EXCELLENT' | 'GOOD' | 'NEEDS_CACL2';
  suitabilityForKombuchaAndVeg: 'OPTIMAL' | 'MODERATE' | 'TOO_BUFFERED';
  cacl2DryAdditionGramsPerLiterNeeded: number;
  notes: string;
}

/**
 * Oblicza procedurę usuwania chloru i chloraminy z wody kranowej.
 */
export function calculateDechlorination(
  waterLiters: number,
  isTreatedWithChloramine: boolean = false
): DechlorinationResult {
  if (waterLiters <= 0) throw new Error('Objętość wody musi być większa od zera.');

  // Witamina C (kwas L-askorbinowy): ok. 8 mg na 1 litr wody neutralizuje do 3 ppm chloraminy
  const vitaminCMgNeededForChloramine = Math.round(waterLiters * 8);

  let recommendation: string;
  if (isTreatedWithChloramine) {
    recommendation = `Woda z chloraminą NIE ulatnia się podczas stania! Dodaj ${vitaminCMgNeededForChloramine} mg witaminy C (kwasu askorbinowego) lub przefiltruj przez węgiel aktywny, by chronić bakterie i drożdże.`;
  } else {
    recommendation = `Wolny chlor: pozostaw wodę w otwartym garnku na 24h lub gotuj przez 15 min. Alternatywnie dodaj ${vitaminCMgNeededForChloramine} mg witaminy C do natychmiastowej neutralizacji.`;
  }

  return {
    waterLiters,
    freeChlorineDegassingHours: 24,
    boilingMinutesNeeded: 15,
    vitaminCMgNeededForChloramine,
    recommendation,
  };
}

/**
 * Analizuje twardość wody i zdolność buforową dla serowarstwa i kiszonek.
 * dGH = (Ca_ppm / 7.14) + (Mg_ppm / 4.35)
 * dKH = Bicarbonate_ppm / 21.8
 */
export function analyzeWaterHardnessForFerment(
  calciumPpm: number,
  magnesiumPpm: number,
  alkalinityBicarbonatePpm: number = 120
): WaterHardnessResult {
  if (calciumPpm < 0 || magnesiumPpm < 0 || alkalinityBicarbonatePpm < 0) {
    throw new Error('Parametry mineralne nie mogą być ujemne.');
  }

  const dGhTotalHardness = Math.round(((calciumPpm / 7.14) + (magnesiumPpm / 4.35)) * 10) / 10;
  const dKhAlkalinity = Math.round((alkalinityBicarbonatePpm / 21.8) * 10) / 10;

  let suitabilityForCheese: 'EXCELLENT' | 'GOOD' | 'NEEDS_CACL2' = 'GOOD';
  let cacl2DryAdditionGramsPerLiterNeeded = 0;

  if (calciumPpm >= 80) {
    suitabilityForCheese = 'EXCELLENT';
  } else if (calciumPpm < 40) {
    suitabilityForCheese = 'NEEDS_CACL2';
    // Uzupełnienie do 80 ppm Ca wymaga ok. 0.15g CaCl2 na litr
    cacl2DryAdditionGramsPerLiterNeeded = 0.15;
  }

  let suitabilityForKombuchaAndVeg: 'OPTIMAL' | 'MODERATE' | 'TOO_BUFFERED' = 'OPTIMAL';
  let notes = 'Woda optymalna mikrobiologicznie.';

  if (dKhAlkalinity > 10.0) {
    suitabilityForKombuchaAndVeg = 'TOO_BUFFERED';
    notes = 'Wysoka zasadowość (alkaliczność) silnie buforuje kwas! Fermentacja kombuchy i kiszonek będzie opóźniona w osiągnięciu bezpiecznego pH < 4.5. Zalecane częściowe zmieszanie z wodą z filtra RO.';
  } else if (dKhAlkalinity > 6.0) {
    suitabilityForKombuchaAndVeg = 'MODERATE';
    notes = 'Umiarkowany bufor wodorowęglanowy. Zapewnij zdrowy starter kwasowy o pH < 3.8.';
  }

  return {
    dGhTotalHardness,
    dKhAlkalinity,
    calciumIonPpm: calciumPpm,
    magnesiumIonPpm: magnesiumPpm,
    suitabilityForCheese,
    suitabilityForKombuchaAndVeg,
    cacl2DryAdditionGramsPerLiterNeeded,
    notes,
  };
}
