// ============================================================================
// Apps4Brew Studio — FERMENT Artisan Batch Cost & Production Yield Calculator
// Evaluates ingredient costs, thermal cooking kWh, long-term cave refrigeration,
// finished net yield after affinage shrinkage, and market price benchmark savings.
// Adapted from Apps4Brew Studio Standards (Piekarz & Charcutier).
// ============================================================================

export type ProductionCraftType = 'CHEESE' | 'VEG_FERMENT' | 'KOMBUCHA';

export interface BatchCostInput {
  craftType: ProductionCraftType;

  // Raw base ingredient
  baseVolumeOrWeight: number;     // Liters of milk (cheese), kg of veg (ferments), or Liters of water (kombucha)
  basePricePerUnit?: number;      // PLN/L or PLN/kg (default: 4.50 PLN/L for milk, 5.00 PLN/kg for veg, 0.02 PLN/L for water)

  // Additives & cultures
  culturesAndEnzymesCost?: number;// PLN (rennet, DVS cultures, CaCl2, SCOBY tea)
  saltAndSpicesCost?: number;     // PLN (salt, herbs, gochugaru, ginger)
  sugarOrFeedCost?: number;       // PLN (for kombucha/kefir)

  // Packaging & consumables
  packagingCost?: number;         // PLN (wax, polyvinyl, vacuum pouches, crown caps, labels)

  // Energy consumption
  cookerPowerKw?: number;         // default: 2.0 kW (induction / electric heating)
  cookDurationHours?: number;     // default: 1.5 h for cheese curd cooking / water boiling
  agingDays?: number;             // default: 60 days for cheese, 0 for fresh ferments
  agingDailyKwh?: number;         // default: 0.6 kWh/day for cave chiller / wine fridge
  electricityPricePerKwh?: number;// default: 1.15 PLN/kWh

  // Yield & Shrinkage
  expectedFinishedKgOrLiters: number; // Final usable weight/volume after whey runoff or shrinkage
  marketBenchmarkPricePerKgOrUnit?: number; // Retail price for artisan comparison
}

export interface BatchCostResult {
  craftType: ProductionCraftType;

  // Breakdown
  baseIngredientCost: number;
  additivesCost: number;
  packagingCost: number;
  ingredientsTotalCost: number;

  cookingEnergyCost: number;
  agingEnergyCost: number;
  energyTotalCost: number;

  totalBatchCost: number;

  // Unit costs
  finishedYieldKgOrLiters: number;
  costPerKgOrLiter: number;
  costPer100gOrPortion: number;

  // Market comparison
  marketBenchmarkTotalValue: number;
  savingsTotalPln: number;
  savingsPercentage: number;
  financialSummaryPl: string;
}

export const DEFAULT_COST_CONFIG = {
  milkPricePerLiter: 4.50,
  vegPricePerKg: 5.50,
  waterPricePerLiter: 0.02,
  saltAndSpicesDefault: 2.50,
  culturesDefaultCheese: 6.00,
  culturesDefaultKombucha: 2.00,
  packagingDefaultCheese: 4.50, // Wax or vacuum pouch
  packagingDefaultKombucha: 3.00, // Caps and seals
  packagingDefaultVeg: 2.00,
  electricityPricePerKwh: 1.15,
  caveChillerDailyKwh: 0.60,
  cookerPowerKw: 2.0,

  // Market benchmarks
  retailCheesePerKg: 110.0, // Artisan raw milk cave-aged Gouda / Cheddar
  retailKimchiPerKg: 48.0,  // Organic artisan jarred kimchi
  retailKombuchaPerLiter: 22.0, // Cold-pressed raw kombucha
};

function roundGrosze(val: number): number {
  return Math.round(val * 100) / 100;
}

/**
 * Calculates total batch cost, unit costs and economic savings vs commercial artisan products
 */
export function calculateBatchCost(input: BatchCostInput): BatchCostResult {
  const {
    craftType,
    baseVolumeOrWeight,
    agingDays = craftType === 'CHEESE' ? 60 : 0,
    agingDailyKwh = craftType === 'CHEESE' ? DEFAULT_COST_CONFIG.caveChillerDailyKwh : 0,
    cookerPowerKw = DEFAULT_COST_CONFIG.cookerPowerKw,
    cookDurationHours = craftType === 'CHEESE' ? 1.5 : 0.5,
    electricityPricePerKwh = DEFAULT_COST_CONFIG.electricityPricePerKwh,
    expectedFinishedKgOrLiters,
  } = input;

  if (baseVolumeOrWeight <= 0) {
    throw new Error('Ilość surowca bazowego musi być większa od zera.');
  }
  if (expectedFinishedKgOrLiters <= 0) {
    throw new Error('Oczekiwany uzysk końcowy musi być większy od zera.');
  }

  // 1. Base ingredient cost
  let defaultBasePrice: number;
  let defaultCulturesCost: number;
  let defaultPackagingCost: number;
  let defaultMarketBenchmark: number;

  switch (craftType) {
    case 'CHEESE':
      defaultBasePrice = DEFAULT_COST_CONFIG.milkPricePerLiter;
      defaultCulturesCost = DEFAULT_COST_CONFIG.culturesDefaultCheese;
      defaultPackagingCost = DEFAULT_COST_CONFIG.packagingDefaultCheese;
      defaultMarketBenchmark = DEFAULT_COST_CONFIG.retailCheesePerKg;
      break;
    case 'VEG_FERMENT':
      defaultBasePrice = DEFAULT_COST_CONFIG.vegPricePerKg;
      defaultCulturesCost = 0;
      defaultPackagingCost = DEFAULT_COST_CONFIG.packagingDefaultVeg;
      defaultMarketBenchmark = DEFAULT_COST_CONFIG.retailKimchiPerKg;
      break;
    case 'KOMBUCHA':
      defaultBasePrice = DEFAULT_COST_CONFIG.waterPricePerLiter;
      defaultCulturesCost = DEFAULT_COST_CONFIG.culturesDefaultKombucha;
      defaultPackagingCost = DEFAULT_COST_CONFIG.packagingDefaultKombucha;
      defaultMarketBenchmark = DEFAULT_COST_CONFIG.retailKombuchaPerLiter;
      break;
  }

  const basePrice = input.basePricePerUnit ?? defaultBasePrice;
  const baseIngredientCost = roundGrosze(baseVolumeOrWeight * basePrice);

  const culturesCost = input.culturesAndEnzymesCost ?? defaultCulturesCost;
  const saltSpicesCost = input.saltAndSpicesCost ?? DEFAULT_COST_CONFIG.saltAndSpicesDefault;
  const sugarCost = input.sugarOrFeedCost ?? 0;
  const additivesCost = roundGrosze(culturesCost + saltSpicesCost + sugarCost);

  const packagingCost = roundGrosze(input.packagingCost ?? defaultPackagingCost);
  const ingredientsTotalCost = roundGrosze(baseIngredientCost + additivesCost + packagingCost);

  // 2. Energy costs
  const cookingKwh = cookerPowerKw * cookDurationHours;
  const cookingEnergyCost = roundGrosze(cookingKwh * electricityPricePerKwh);

  const agingKwh = agingDays * agingDailyKwh;
  const agingEnergyCost = roundGrosze(agingKwh * electricityPricePerKwh);

  const energyTotalCost = roundGrosze(cookingEnergyCost + agingEnergyCost);
  const totalBatchCost = roundGrosze(ingredientsTotalCost + energyTotalCost);

  // 3. Unit economics
  const finishedYieldKgOrLiters = roundGrosze(expectedFinishedKgOrLiters);
  const costPerKgOrLiter = roundGrosze(totalBatchCost / finishedYieldKgOrLiters);
  const costPer100gOrPortion = roundGrosze(costPerKgOrLiter / 10);

  // 4. Market benchmark comparison
  const benchmarkUnitPrice = input.marketBenchmarkPricePerKgOrUnit ?? defaultMarketBenchmark;
  const marketBenchmarkTotalValue = roundGrosze(finishedYieldKgOrLiters * benchmarkUnitPrice);

  const savingsTotalPln = roundGrosze(Math.max(0, marketBenchmarkTotalValue - totalBatchCost));
  const savingsPercentage =
    marketBenchmarkTotalValue > 0
      ? Math.round((savingsTotalPln / marketBenchmarkTotalValue) * 100)
      : 0;

  const financialSummaryPl = `Koszt partii: ${totalBatchCost.toFixed(2)} zł (${costPerKgOrLiter.toFixed(2)} zł/${craftType === 'KOMBUCHA' ? 'L' : 'kg'}). Rynkowa wartość rzemieślnicza: ${marketBenchmarkTotalValue.toFixed(2)} zł. Oszczędzasz: ${savingsTotalPln.toFixed(2)} zł (${savingsPercentage}%).`;

  return {
    craftType,
    baseIngredientCost,
    additivesCost,
    packagingCost,
    ingredientsTotalCost,
    cookingEnergyCost,
    agingEnergyCost,
    energyTotalCost,
    totalBatchCost,
    finishedYieldKgOrLiters,
    costPerKgOrLiter,
    costPer100gOrPortion,
    marketBenchmarkTotalValue,
    savingsTotalPln,
    savingsPercentage,
    financialSummaryPl,
  };
}
