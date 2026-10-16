import {
  calculateMilkSpeciesKinetics,
  MILK_SPECIES_DATABASE,
} from '../../src/core/milk-species-profile';

describe('Milk Species Coagulation & Proteolysis Profile Engine', () => {
  it('should calculate baseline values for standard cow milk', () => {
    const result = calculateMilkSpeciesKinetics({
      speciesId: 'COW',
      milkVolumeLiters: 10,
      baseRennetImcuPerLiter: 35,
      baseFlocculationMultiplier: 3.0,
    });

    expect(result.recommendedRennetImcuPerLiter).toBe(35);
    expect(result.totalRennetImcuRequired).toBe(350);
    expect(result.rennetVolumeMlLiquid200Imcu).toBe(1.75);
    expect(result.effectiveFlocculationMultiplier).toBe(3.0);
    expect(result.expectedCheeseYieldKg).toBeCloseTo(1.05, 1);
    expect(result.yieldRatioPct).toBe(10.5);
  });

  it('should double cheese yield and reduce rennet dosage for sheep milk', () => {
    const result = calculateMilkSpeciesKinetics({
      speciesId: 'SHEEP',
      milkVolumeLiters: 10,
      baseRennetImcuPerLiter: 35,
      baseFlocculationMultiplier: 3.0,
    });

    // 20% yield -> 2.0 kg cheese from 10 L
    expect(result.expectedCheeseYieldKg).toBe(2.0);
    expect(result.yieldRatioPct).toBe(20.0);
    // Rennet reduced by 25% (35 * 0.75 = 26.3 IMCU/L)
    expect(result.recommendedRennetImcuPerLiter).toBe(26.3);
    // Multiplier reduced (3.0 * 0.85 = 2.55)
    expect(result.effectiveFlocculationMultiplier).toBe(2.55);
    expect(result.wheyProteinRecoveryPotentialGrams).toBeGreaterThan(90);
  });

  it('should increase flocculation multiplier for delicate goat milk curd', () => {
    const result = calculateMilkSpeciesKinetics({
      speciesId: 'GOAT',
      milkVolumeLiters: 15,
      baseRennetImcuPerLiter: 35,
      baseFlocculationMultiplier: 3.0,
    });

    // Multiplier increased by 15% (3.0 * 1.15 = 3.45)
    expect(result.effectiveFlocculationMultiplier).toBe(3.45);
    expect(result.temperatureRecommendationsC).toEqual([29, 31]);
    expect(result.craftNotes.some((n) => n.includes('friable curd') || n.includes('kruchy'))).toBe(true);
  });

  it('should model buffalo milk for pasta filata', () => {
    const result = calculateMilkSpeciesKinetics({
      speciesId: 'BUFFALO',
      milkVolumeLiters: 10,
      baseRennetImcuPerLiter: 35,
      baseFlocculationMultiplier: 3.0,
    });

    expect(result.yieldRatioPct).toBe(17.0);
    expect(result.temperatureRecommendationsC).toEqual([34, 36]);
    expect(result.species.meanFatGlobuleDiameterMicrons).toBe(5.0);
  });
});
