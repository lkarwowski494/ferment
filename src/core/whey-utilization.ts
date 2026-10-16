// ============================================================================
// Apps4Brew Studio — FERMENT Zero-Waste Whey & Byproduct Engine
// Ricotta recovery kinetics, artisanal whey isotonic beverages, and SCOBY utilization
// ============================================================================

export interface RicottaRecoveryResult {
  wheyLiters: number;
  addedWholeMilkLiters: number;
  totalLiquidLiters: number;
  estimatedRicottaYieldGrams: number;
  heatingTargetTempC: number;
  citricAcidGramsNeeded: number;
  vinegar10PctMlAlternative: number;
  instructions: string[];
}

export interface WheyDrinkRecipe {
  wheyLiters: number;
  honeyOrSugarGrams: number;
  lemonJuiceMl: number;
  freshMintLeavesCount: number;
  waterDilutionMl: number;
  description: string;
}

export interface ScobyZeroWasteResult {
  excessScobyGrams: number;
  dehydratedJerkyGrams: number;
  fruitPureeGramsForGummies: number;
  soakingHours: number;
  dehydratorTempC: number;
  dehydratorHours: number;
}

/**
 * Oblicza odzysk tradycyjnej Ricotty (Ziger) ze słodkiej serwatki podpuszczkowej.
 * Denaturacja białek serwatkowych (albumin i globulin) w temp. 88–92°C w obecności kwasu.
 */
export function calculateRicottaRecovery(
  sweetWheyLiters: number,
  addedWholeMilkLiters: number = 0
): RicottaRecoveryResult {
  if (sweetWheyLiters <= 0) throw new Error('Objętość serwatki musi być większa od zera.');
  if (addedWholeMilkLiters < 0) throw new Error('Dodatek mleka nie może być ujemny.');

  const totalLiquidLiters = sweetWheyLiters + addedWholeMilkLiters;

  // Czysta serwatka daje ok. 3.8% uzysku (38g / L).
  // Każdy dodany litr tłustego mleka daje dodatkowo ok. 110g delikatnej ricotty.
  const yieldFromWhey = sweetWheyLiters * 38;
  const yieldFromAddedMilk = addedWholeMilkLiters * 110;
  const estimatedRicottaYieldGrams = Math.round(yieldFromWhey + yieldFromAddedMilk);

  // Zapotrzebowanie na kwas cytrynowy: ok. 1.8g na każdy litr cieczy
  const citricAcidGramsNeeded = Math.round(totalLiquidLiters * 1.8 * 10) / 10;
  // Alternatywa w occie 10%: ok. 18 ml na litr
  const vinegar10PctMlAlternative = Math.round(totalLiquidLiters * 18);

  const instructions = [
    '1. Rozgrzej słodką serwatkę (z opcjonalnym dodatkiem mleka) do 88–90°C, delikatnie mieszając od dna.',
    `2. W 88°C wyłącz palnik i powoli wlej ${citricAcidGramsNeeded}g kwasku cytrynowego rozpuszczonego w 50ml ciepłej wody (lub ${vinegar10PctMlAlternative}ml octu).`,
    '3. Wykonaj jeden delikatny ruch łopatką w kształcie ósemki i pozostaw garnek w spokoju na 10–15 minut.',
    '4. Gdy delikatne płatki białka wypłyną na powierzchnię (tzw. "fleur de ricotta"), zbieraj je ostrożnie łyżką cedzakową do formy ricottowej.',
    '5. Pozostaw do ocieknięcia na 1–2 godziny w temperaturze pokojowej, po czym schłodź w lodówce.',
  ];

  return {
    wheyLiters: sweetWheyLiters,
    addedWholeMilkLiters,
    totalLiquidLiters,
    estimatedRicottaYieldGrams,
    heatingTargetTempC: 90,
    citricAcidGramsNeeded,
    vinegar10PctMlAlternative,
    instructions,
  };
}

/**
 * Receptura na orzeźwiający probiotyczny napój izotoniczny z serwatki (Alpejska Rivella).
 */
export function calculateWheyIsotonicDrink(wheyLiters: number): WheyDrinkRecipe {
  if (wheyLiters <= 0) throw new Error('Objętość serwatki musi być większa od zera.');

  return {
    wheyLiters,
    honeyOrSugarGrams: Math.round(wheyLiters * 35),
    lemonJuiceMl: Math.round(wheyLiters * 40),
    freshMintLeavesCount: Math.round(wheyLiters * 8),
    waterDilutionMl: Math.round(wheyLiters * 200), // 20% wody mineralnej
    description: 'Naturalny izotonik bogaty w potas, wapń, kwas mlekowy i bioaktywne peptydy.',
  };
}

/**
 * Oblicza parametry przetworzenia nadmiaru grzybka SCOBY na suszone żelki/chipsy probiotyczne.
 */
export function calculateScobyZeroWaste(excessScobyGrams: number): ScobyZeroWasteResult {
  if (excessScobyGrams <= 0) throw new Error('Masa grzybka SCOBY musi być większa od zera.');

  // Grzybek SCOBY to 95% woda i 5% celuloza bakteryjna
  const dehydratedJerkyGrams = Math.round(excessScobyGrams * 0.08);
  const fruitPureeGramsForGummies = Math.round(excessScobyGrams * 0.7);

  return {
    excessScobyGrams,
    dehydratedJerkyGrams,
    fruitPureeGramsForGummies,
    soakingHours: 12, // moczenie w puree owocowym
    dehydratorTempC: 45, // niska temp zachowuje żywe kultury probiotyczne
    dehydratorHours: 8,
  };
}
