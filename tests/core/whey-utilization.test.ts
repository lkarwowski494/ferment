import {
  calculateRicottaRecovery,
  calculateWheyIsotonicDrink,
  calculateScobyZeroWaste,
} from '../../src/core/whey-utilization';

describe('FERMENT Zero-Waste Whey & Byproduct Engine', () => {
  it('calculates Ricotta recovery from sweet whey with and without whole milk addition', () => {
    // 10L sweet whey only
    const res1 = calculateRicottaRecovery(10, 0);
    expect(res1.estimatedRicottaYieldGrams).toBe(380);
    expect(res1.citricAcidGramsNeeded).toBeCloseTo(18.0, 1);
    expect(res1.heatingTargetTempC).toBe(90);
    expect(res1.instructions.length).toBe(5);

    // 10L sweet whey + 1L whole milk boost
    const res2 = calculateRicottaRecovery(10, 1.0);
    expect(res2.estimatedRicottaYieldGrams).toBe(490);
    expect(res2.citricAcidGramsNeeded).toBeCloseTo(19.8, 1);
  });

  it('calculates artisanal whey isotonic beverage (Rivella)', () => {
    const drink = calculateWheyIsotonicDrink(2.5);
    expect(drink.wheyLiters).toBe(2.5);
    expect(drink.honeyOrSugarGrams).toBe(88); // 2.5 * 35
    expect(drink.lemonJuiceMl).toBe(100);    // 2.5 * 40
    expect(drink.freshMintLeavesCount).toBe(20);
    expect(drink.waterDilutionMl).toBe(500);
  });

  it('calculates SCOBY dehydration and probiotic gummy parameters', () => {
    const scoby = calculateScobyZeroWaste(500); // 500g excess SCOBY
    expect(scoby.excessScobyGrams).toBe(500);
    expect(scoby.dehydratedJerkyGrams).toBe(40); // 8%
    expect(scoby.fruitPureeGramsForGummies).toBe(350);
    expect(scoby.dehydratorTempC).toBe(45);
  });
});
