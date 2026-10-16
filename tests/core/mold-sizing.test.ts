// ============================================================================
// Apps4Brew Studio — Tests for Mold Sizing & Curd Geometry Engine
// ============================================================================

import {
  calculateCylindricalMoldVolume,
  calculateRectangularMoldVolume,
  calculateCurdAndMoldFitting,
  STANDARD_MOLD_TEMPLATES,
} from '../../src/core/mold-sizing';

describe('Mold Sizing Engine', () => {
  it('calculates cylindrical mold volume correctly', () => {
    // Diameter 14 cm, height 11 cm (approx Kadova Gouda 1kg)
    // radius = 7, area = pi * 49 ~= 153.94 cm2
    // volume = 153.94 * 11 ~= 1693.3 cm3 ~= 1.69 L
    const res = calculateCylindricalMoldVolume(14, 11);
    expect(res.shape).toBe('CYLINDER');
    expect(res.volumeCm3).toBeCloseTo(1693.3, 0);
    expect(res.volumeLiters).toBeCloseTo(1.69, 1);
    expect(res.maxPressedCheeseKg).toBeGreaterThan(1.0);
  });

  it('calculates rectangular mold volume correctly', () => {
    // 20 cm x 12 cm x 10 cm = 2400 cm3 = 2.4 L
    const res = calculateRectangularMoldVolume(20, 12, 10);
    expect(res.shape).toBe('RECTANGULAR');
    expect(res.volumeCm3).toBe(2400);
    expect(res.volumeLiters).toBe(2.4);
    expect(res.maxPressedCheeseKg).toBeGreaterThan(2.0);
  });

  it('recommends closest mold and evaluates curd fitting for 10L milk', () => {
    // 10L milk @ 10.5% yield = 1.05 kg cheese
    const res = calculateCurdAndMoldFitting(10, 10.5);
    expect(res.expectedYieldKg).toBe(1.05);
    expect(res.rawCurdVolumeLiters).toBeGreaterThan(1.5);
    expect(res.recommendedMold).toBeDefined();
    expect(res.recommendedMold.id).toBe('kadova_gouda_1kg');
    expect(res.isMoldSufficient).toBe(true);
  });

  it('selects larger mold when 20L milk is processed', () => {
    // 20L milk @ 10.5% yield = 2.10 kg cheese
    const res = calculateCurdAndMoldFitting(20, 10.5);
    expect(res.expectedYieldKg).toBe(2.10);
    expect(res.recommendedMold.targetCheeseWeightKg).toBeGreaterThanOrEqual(1.5);
  });
});
