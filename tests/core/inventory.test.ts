import {
  processPantryDepletion,
  calculateBatchYieldAndEconomics,
  RecipeRequirement,
} from '../../src/core/inventory';
import { PantryItem } from '../../src/data/db';

describe('FERMENT Inventory & Production Economics Engine', () => {
  const mockPantry: PantryItem[] = [
    {
      id: 'p1',
      category: 'MILK',
      itemName: 'Świeże Mleko Krowie Prosto od Krowy',
      quantityAvailable: 50,
      unit: 'L',
      costPerUnitPln: 3.5, // 3.50 PLN / L
    },
    {
      id: 'p2',
      category: 'RENNET',
      itemName: 'Podpuszczka Naturalna Cielęca 1:10000',
      quantityAvailable: 100,
      unit: 'ml',
      costPerUnitPln: 0.25, // 0.25 PLN / ml
    },
    {
      id: 'p3',
      category: 'CULTURE',
      itemName: 'Kultura mezofilna Danisco CHOOZIT MA 11',
      quantityAvailable: 10,
      unit: 'g',
      costPerUnitPln: 2.0, // 2.00 PLN / g
    },
    {
      id: 'p4',
      category: 'SALT',
      itemName: 'Kłodawska Sól Kamienna Niejodowana',
      quantityAvailable: 1000,
      unit: 'g',
      costPerUnitPln: 0.005, // 5 PLN / kg = 0.005 PLN / g
    },
  ];

  it('processes pantry depletion accurately with unit conversions', () => {
    const requirements: RecipeRequirement[] = [
      { name: 'Mleko Krowie', category: 'MILK', quantity: 20, unit: 'L' },
      { name: 'Podpuszczka', category: 'RENNET', quantity: 2.5, unit: 'ml' },
      { name: 'Kultura mezofilna', category: 'CULTURE', quantity: 1.5, unit: 'g' },
    ];

    const result = processPantryDepletion(requirements, mockPantry);

    expect(result.hasDeficits).toBe(false);
    expect(result.items.length).toBe(3);

    // Milk: 20 L @ 3.50 = 70.00 PLN, remaining 30 L
    const milk = result.items.find(i => i.pantryItemId === 'p1');
    expect(milk?.deductedQty).toBe(20);
    expect(milk?.remainingQty).toBe(30);
    expect(milk?.itemCost).toBe(70.0);

    // Rennet: 2.5 ml @ 0.25 = 0.63 PLN
    const rennet = result.items.find(i => i.pantryItemId === 'p2');
    expect(rennet?.deductedQty).toBe(2.5);
    expect(rennet?.remainingQty).toBe(97.5);

    // Total cost: 70 + 0.63 + 3.0 = 73.63 PLN
    expect(result.totalIngredientCost).toBeCloseTo(73.63, 1);
  });

  it('detects inventory deficits and generates actionable alerts', () => {
    const excessiveRequirements: RecipeRequirement[] = [
      { name: 'Mleko Krowie', category: 'MILK', quantity: 60, unit: 'L' }, // only 50L available
    ];

    const result = processPantryDepletion(excessiveRequirements, mockPantry);

    expect(result.hasDeficits).toBe(true);
    expect(result.deficitWarnings.length).toBe(1);
    expect(result.deficitWarnings[0]).toContain('Niewystarczający stan spiżarni');
    expect(result.items[0].deductedQty).toBe(50);
    expect(result.items[0].remainingQty).toBe(0);
    expect(result.items[0].isDeficit).toBe(true);
  });

  it('calculates cheese yield percentage and production cost per unit', () => {
    // 20L milk produces 2.1 kg cheese (10.5% yield) with 75 PLN total cost
    const econ = calculateBatchYieldAndEconomics(75.0, 20.0, 2.1);

    expect(econ.yieldPercentage).toBe(10.5);
    expect(econ.costPerKgOrLiter).toBeCloseTo(35.71, 1);
    expect(econ.comment).toContain('Wzorcowa wydajność serowarska');
  });
});
