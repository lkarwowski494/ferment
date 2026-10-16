// ============================================================================
// Apps4Brew Studio — FERMENT Ingredient Substitutions & Equivalents Engine
// Enzyme strength conversions, natural starter equivalents & salt density math
// ============================================================================

export interface RennetSubstitutionResult {
  milkLiters: number;
  targetImcuTotal: number;
  substituteType: 'LIQUID_200_IMCU' | 'POWDER_MICROBIAL_2000' | 'MEITO_TABLET' | 'PASTE_ANIMAL';
  requiredAmount: number;
  unit: string;
  preparationTip: string;
}

export interface CultureSubstitutionResult {
  milkLiters: number;
  cultureType: 'MESOPHILIC' | 'THERMOPHILIC';
  commercialDvsGrams: number;
  naturalSubstituteName: string;
  naturalSubstituteAmount: number;
  naturalSubstituteUnit: string;
  notes: string;
}

export interface Cacl2SubstitutionResult {
  milkLiters: number;
  dryAnhydrousGrams: number;
  dryDihydrateGrams: number;
  liquid33PercentMl: number;
  liquid10PercentMl: number;
}

/**
 * Przelicza dawkę enzymu podpuszczkowego na różne formy handlowe
 */
export function convertRennetForm(
  milkLiters: number,
  substituteType: RennetSubstitutionResult['substituteType'],
  targetImcuPerLiter: number = 35.0
): RennetSubstitutionResult {
  if (milkLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');

  const targetImcuTotal = milkLiters * targetImcuPerLiter;
  let requiredAmount = 0;
  let unit = 'ml';
  let preparationTip = '';

  switch (substituteType) {
    case 'LIQUID_200_IMCU':
      // 200 IMCU / ml
      requiredAmount = Math.round((targetImcuTotal / 200.0) * 100) / 100;
      unit = 'ml';
      preparationTip = 'Rozcieńcz dawkę w 30 ml chłodnej, niechlorowanej wody przed wlaniem do mleka.';
      break;

    case 'POWDER_MICROBIAL_2000':
      // 2000 IMCU / g (np. Fromase)
      requiredAmount = Math.round((targetImcuTotal / 2000.0) * 1000) / 1000;
      unit = 'g';
      preparationTip = 'Odmierz precyzyjną wagą jubilerską (0.01g) i rozpuść w 50 ml wody na 15 min przed użyciem.';
      break;

    case 'MEITO_TABLET':
      // 1 tabletka Meito zazwyczaj koaguluje 50 L mleka (ok. 2500 IMCU / tabl)
      requiredAmount = Math.round((milkLiters / 50.0) * 100) / 100;
      unit = 'tabl.';
      preparationTip = 'Rozgnieć wymaganą część tabletki w kieliszku z odrobiną soli i 20 ml letniej wody.';
      break;

    case 'PASTE_ANIMAL':
      // Pasta jagnięca / koźlęca zawiera dodatkowo lipazę (ok. 100 IMCU / g)
      requiredAmount = Math.round((targetImcuTotal / 100.0) * 10) / 10;
      unit = 'g';
      preparationTip = 'Rozetrzyj pastę z odrobiną mleka w moździerzu, by uwolnić enzymy i lipazę.';
      break;
  }

  return {
    milkLiters,
    targetImcuTotal,
    substituteType,
    requiredAmount,
    unit,
    preparationTip,
  };
}

/**
 * Przelicza komercyjne kultury liofilizowane DVS na naturalne źródła starterowe
 */
export function getCultureNaturalSubstitute(
  milkLiters: number,
  cultureType: 'MESOPHILIC' | 'THERMOPHILIC'
): CultureSubstitutionResult {
  if (milkLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');

  const commercialDvsGrams = Math.round(milkLiters * 0.1 * 100) / 100; // standard 0.1g / L

  if (cultureType === 'MESOPHILIC') {
    // 15-20 ml żywej naturalnej maślanki lub zsiadłego mleka na litr
    const amountMl = Math.round(milkLiters * 18);
    return {
      milkLiters,
      cultureType,
      commercialDvsGrams,
      naturalSubstituteName: 'Świeża maślanka zagrodowa lub zsiadłe mleko z surowego mleka',
      naturalSubstituteAmount: amountMl,
      naturalSubstituteUnit: 'ml',
      notes: 'Upewnij się, że maślanka jest "żywa" (niepasteryzowana po ukwaszeniu) i ma przyjemny, czysty maślany zapach.',
    };
  } else {
    // 15g żywego gęstego jogurtu greckiego na litr (L. bulgaricus, S. thermophilus)
    const amountGrams = Math.round(milkLiters * 15);
    return {
      milkLiters,
      cultureType,
      commercialDvsGrams,
      naturalSubstituteName: 'Naturalny jogurt z żywymi kulturami (L. bulgaricus, S. thermophilus)',
      naturalSubstituteAmount: amountGrams,
      naturalSubstituteUnit: 'g',
      notes: 'Doskonałe do serów parzonych (mozzarella, caciocavallo) oraz serów typu Feta. Zahartuj jogurt w 50ml ciepłego mleka.',
    };
  }
}

/**
 * Przelicza chlorek wapnia (CaCl2) pomiędzy czystą formą suchą a roztworami
 */
export function convertCacl2Forms(
  milkLiters: number,
  targetDryGramsPerLiter: number = 0.20
): Cacl2SubstitutionResult {
  if (milkLiters <= 0) throw new Error('Objętość mleka musi być większa od zera.');

  const dryAnhydrousGrams = Math.round(milkLiters * targetDryGramsPerLiter * 100) / 100;
  // Dwuwodny CaCl2 * 2H2O ma masę molową o ok. 32% wyższą: 147 / 111 ≈ 1.32
  const dryDihydrateGrams = Math.round(dryAnhydrousGrams * 1.32 * 100) / 100;
  // Roztwór 33%: 1 ml dostarcza ok. 0.429g czystego CaCl2
  const liquid33PercentMl = Math.round((dryAnhydrousGrams / 0.429) * 10) / 10;
  // Roztwór 10%: 1 ml dostarcza ok. 0.108g czystego CaCl2
  const liquid10PercentMl = Math.round((dryAnhydrousGrams / 0.108) * 10) / 10;

  return {
    milkLiters,
    dryAnhydrousGrams,
    dryDihydrateGrams,
    liquid33PercentMl,
    liquid10PercentMl,
  };
}
