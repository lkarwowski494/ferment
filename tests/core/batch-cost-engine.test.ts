import { calculateBatchCost } from '../../src/core/batch-cost-engine';

describe('Batch Cost & Production Yield Calculator Engine', () => {
  it('calculates full production cost for a 10L Gouda wheel aged for 60 days', () => {
    // 10L milk at 4.50 PLN/L = 45.00 PLN
    // Finished yield: 1.05 kg aged cheese
    const result = calculateBatchCost({
      craftType: 'CHEESE',
      baseVolumeOrWeight: 10,
      basePricePerUnit: 4.50,
      expectedFinishedKgOrLiters: 1.05,
      agingDays: 60,
    });

    expect(result.baseIngredientCost).toBe(45.0);
    expect(result.ingredientsTotalCost).toBeGreaterThan(50.0); // with rennet, salt, wax
    expect(result.agingEnergyCost).toBeGreaterThan(0); // 60 days * 0.6 kWh * 1.15
    expect(result.totalBatchCost).toBeGreaterThan(80.0);
    expect(result.totalBatchCost).toBeLessThan(110.0);

    // Compared to retail artisan Gouda (110 PLN/kg -> ~115.50 PLN for 1.05kg)
    expect(result.marketBenchmarkTotalValue).toBe(115.5);
    expect(result.savingsTotalPln).toBeGreaterThan(0);
    expect(result.financialSummaryPl).toContain('Oszczędzasz');
  });

  it('calculates batch cost for a 5 kg Baechu-Kimchi batch', () => {
    const result = calculateBatchCost({
      craftType: 'VEG_FERMENT',
      baseVolumeOrWeight: 5.0,
      basePricePerUnit: 5.0, // 25 PLN
      expectedFinishedKgOrLiters: 4.8,
    });

    expect(result.baseIngredientCost).toBe(25.0);
    expect(result.agingEnergyCost).toBe(0); // No cave chiller
    expect(result.costPerKgOrLiter).toBeLessThan(12.0); // ~6-9 PLN/kg vs 48 PLN/kg retail
    expect(result.savingsPercentage).toBeGreaterThan(70);
  });

  it('calculates batch cost for a 6L Kombucha batch', () => {
    const result = calculateBatchCost({
      craftType: 'KOMBUCHA',
      baseVolumeOrWeight: 6.0,
      expectedFinishedKgOrLiters: 5.5,
      sugarOrFeedCost: 4.0,
    });

    expect(result.craftType).toBe('KOMBUCHA');
    expect(result.costPerKgOrLiter).toBeLessThan(5.0); // Homemade kombucha is very economical
    expect(result.marketBenchmarkTotalValue).toBe(121.0); // 5.5L * 22 PLN/L
    expect(result.savingsPercentage).toBeGreaterThan(80);
  });

  it('throws validation errors on invalid base quantity or yield', () => {
    expect(() =>
      calculateBatchCost({
        craftType: 'CHEESE',
        baseVolumeOrWeight: 0,
        expectedFinishedKgOrLiters: 1,
      })
    ).toThrow('surowca bazowego');

    expect(() =>
      calculateBatchCost({
        craftType: 'CHEESE',
        baseVolumeOrWeight: 10,
        expectedFinishedKgOrLiters: 0,
      })
    ).toThrow('uzysk końcowy');
  });
});
