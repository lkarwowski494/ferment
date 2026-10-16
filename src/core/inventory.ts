// ============================================================================
// Apps4Brew Studio — FERMENT Inventory Auto-Depletion & Production Economics
// Automatic stock deduction, yield calculation, and unit cost accounting
// ============================================================================

import { PantryItem } from '../data/db';

export interface RecipeRequirement {
  name: string;
  category: PantryItem['category'];
  quantity: number;
  unit: string;
}

export interface DepletionItemResult {
  pantryItemId: string;
  name: string;
  requestedQty: number;
  deductedQty: number;
  remainingQty: number;
  unit: string;
  itemCost: number;
  isDeficit: boolean;
}

export interface BatchDepletionSummary {
  items: DepletionItemResult[];
  totalIngredientCost: number;
  hasDeficits: boolean;
  deficitWarnings: string[];
}

export interface YieldAnalysisResult {
  milkLiters?: number;
  producedWeightKg?: number;
  yieldPercentage?: number; // e.g. 10.5% for hard cheese
  totalBatchCost: number;
  costPerKgOrLiter: number;
  comment: string;
}

/**
 * Normalizes quantity to base unit (grams for weight, ml for volume, units for pieces)
 */
function toBaseUnits(qty: number, unit: string): { baseQty: number; dimension: 'mass' | 'volume' | 'count' } {
  const u = unit.toLowerCase().trim();
  if (u === 'kg') return { baseQty: qty * 1000, dimension: 'mass' };
  if (u === 'g' || u === 'gram') return { baseQty: qty, dimension: 'mass' };
  if (u === 'l' || u === 'liter' || u === 'litr') return { baseQty: qty * 1000, dimension: 'volume' };
  if (u === 'ml') return { baseQty: qty, dimension: 'volume' };
  return { baseQty: qty, dimension: 'count' };
}

function fromBaseUnits(baseQty: number, targetUnit: string): number {
  const u = targetUnit.toLowerCase().trim();
  if (u === 'kg') return baseQty / 1000;
  if (u === 'g' || u === 'gram') return baseQty;
  if (u === 'l' || u === 'liter' || u === 'litr') return baseQty / 1000;
  if (u === 'ml') return baseQty;
  return baseQty;
}

/**
 * Calculate depletion of pantry items from required recipe ingredients
 */
export function processPantryDepletion(
  requirements: RecipeRequirement[],
  currentPantry: PantryItem[]
): BatchDepletionSummary {
  const results: DepletionItemResult[] = [];
  const deficitWarnings: string[] = [];
  let totalCost = 0;

  for (const req of requirements) {
    // Find matching pantry item by category or loose name
    const match = currentPantry.find(p => {
      const pName = p.itemName || (p as any).name || '';
      return p.category.toUpperCase() === req.category.toUpperCase() && (
        pName.toLowerCase().includes(req.name.toLowerCase()) ||
        req.name.toLowerCase().includes(pName.toLowerCase())
      );
    }) || currentPantry.find(p => p.category.toUpperCase() === req.category.toUpperCase());

    const matchName = match ? (match.itemName || (match as any).name || '') : '';

    if (!match) {
      deficitWarnings.push(`Brak w spiżarni składnika w kategorii "${req.category}" (${req.name}). Wymagane: ${req.quantity} ${req.unit}.`);
      continue;
    }

    const matchQty = match.quantityAvailable ?? (match as any).quantity ?? 0;
    const reqBase = toBaseUnits(req.quantity, req.unit);
    const pantryBase = toBaseUnits(matchQty, match.unit);

    let deductedInPantryUnits = 0;
    let isDeficit = false;

    if (reqBase.dimension === pantryBase.dimension) {
      const deductionBase = Math.min(reqBase.baseQty, pantryBase.baseQty);
      deductedInPantryUnits = fromBaseUnits(deductionBase, match.unit);

      if (reqBase.baseQty > pantryBase.baseQty) {
        isDeficit = true;
        const missingBase = reqBase.baseQty - pantryBase.baseQty;
        const missing = fromBaseUnits(missingBase, req.unit);
        deficitWarnings.push(
          `Niewystarczający stan spiżarni dla "${matchName}". Brakuje ${missing.toFixed(1)} ${req.unit}!`
        );
      }
    } else {
      // Direct count/unmatched dimensions
      deductedInPantryUnits = Math.min(req.quantity, matchQty);
      if (req.quantity > matchQty) {
        isDeficit = true;
        deficitWarnings.push(
          `Niewystarczający stan magazynowy "${matchName}". Brakuje ${req.quantity - matchQty} ${req.unit}!`
        );
      }
    }

    const remainingQty = Math.max(0, Math.round((matchQty - deductedInPantryUnits) * 100) / 100);
    const unitPrice = match.costPerUnitPln ?? (match as any).cost_per_unit ?? 0;
    const itemCost = Math.round(deductedInPantryUnits * unitPrice * 100) / 100;
    totalCost += itemCost;

    results.push({
      pantryItemId: match.id,
      name: matchName,
      requestedQty: req.quantity,
      deductedQty: deductedInPantryUnits,
      remainingQty,
      unit: match.unit,
      itemCost,
      isDeficit,
    });
  }

  return {
    items: results,
    totalIngredientCost: Math.round(totalCost * 100) / 100,
    hasDeficits: deficitWarnings.length > 0,
    deficitWarnings,
  };
}

/**
 * Calculates cheese yield and economic cost per kg/L
 */
export function calculateBatchYieldAndEconomics(
  totalCost: number,
  milkLiters?: number,
  producedWeightKg?: number
): YieldAnalysisResult {
  let yieldPercentage: number | undefined;
  let costPerKgOrLiter = 0;
  let comment = '';

  if (milkLiters && milkLiters > 0 && producedWeightKg && producedWeightKg > 0) {
    yieldPercentage = Math.round((producedWeightKg / milkLiters) * 10000) / 100; // e.g. 10.5%
    costPerKgOrLiter = Math.round((totalCost / producedWeightKg) * 100) / 100;

    if (yieldPercentage >= 13.0) {
      comment = `Wysoka wydajność (${yieldPercentage}%). Typowa dla serów miękkich, kwasowo-podpuszczkowych o wysokiej wilgotności (feta, camembert).`;
    } else if (yieldPercentage >= 9.5) {
      comment = `Wzorcowa wydajność serowarska (${yieldPercentage}%). Prawidłowy bilans kazeiny i tłuszczu dla serów półtwardych i twardych (Gouda, Cheddar).`;
    } else {
      comment = `Niska wydajność (${yieldPercentage}%). Sprawdź jakość mleka (utrata białka w serwatce, niska zawartość suchej masy lub zbyt mocne odciskanie).`;
    }
  } else if (producedWeightKg && producedWeightKg > 0) {
    costPerKgOrLiter = Math.round((totalCost / producedWeightKg) * 100) / 100;
    comment = `Koszt jednostkowy wyprodukowanego sera/wsadu: ${costPerKgOrLiter.toFixed(2)} PLN/kg.`;
  } else if (milkLiters && milkLiters > 0) {
    costPerKgOrLiter = Math.round((totalCost / milkLiters) * 100) / 100;
    comment = `Koszt jednostkowy na litr mleka/napoju: ${costPerKgOrLiter.toFixed(2)} PLN/L.`;
  }

  return {
    milkLiters,
    producedWeightKg,
    yieldPercentage,
    totalBatchCost: Math.round(totalCost * 100) / 100,
    costPerKgOrLiter,
    comment,
  };
}
