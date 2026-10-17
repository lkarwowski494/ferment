// ============================================================================
// Apps4Brew Studio — Tests for Brine Acidification & Buffer Engine (GAP-LOG-01)
// ============================================================================

import { calculateBrineAcidification } from '../../src/core/brine-acidification';

describe('Brine Acidification & Buffer Engine (RD-BRINE-01)', () => {
  it('calculates salt, lactic acid and CaCl2 for 5L water at 20% salinity', () => {
    const res = calculateBrineAcidification({
      brineWaterLiters: 5,
      initialWaterPh: 7.5,
      targetPh: 5.2,
      lacticAcidConcentrationPct: 80,
      targetSalinityPct: 20,
    });

    expect(res.waterLiters).toBe(5);
    expect(res.saltKg).toBeCloseTo(1.25, 1);
    expect(res.lacticAcidMlNeeded).toBeGreaterThan(5);
    expect(res.cacl2GramsNeeded).toBe(10); // 2g/L * 5L
    expect(res.isBufferingCritical).toBe(true);
    expect(res.equilibriumExplanation).toContain('CaCl2');
  });

  it('requires 0 ml acid when initial water pH is already at or below target pH', () => {
    const res = calculateBrineAcidification({
      brineWaterLiters: 10,
      initialWaterPh: 5.0, // Water/whey already sufficiently acidic
      targetPh: 5.2,
      lacticAcidConcentrationPct: 80,
      targetSalinityPct: 18,
    });

    expect(res.lacticAcidMlNeeded).toBe(0);
    expect(res.saltKg).toBeGreaterThan(2.0);
    expect(res.cacl2GramsNeeded).toBe(20.0);
  });

  it('clamps minimum water volume to 0.5L and calculates correct proportions', () => {
    const res = calculateBrineAcidification({
      brineWaterLiters: 0.1, // Below minimum
      initialWaterPh: 7.5,
      targetPh: 5.2,
      lacticAcidConcentrationPct: 80,
      targetSalinityPct: 20,
    });

    expect(res.waterLiters).toBe(0.5);
    expect(res.cacl2GramsNeeded).toBe(1.0); // 2g/L * 0.5L
    expect(res.saltKg).toBeCloseTo(0.13, 2);
  });

  it('scales acid volume inversely with lactic acid concentration', () => {
    const highConc = calculateBrineAcidification({
      brineWaterLiters: 5,
      initialWaterPh: 7.5,
      targetPh: 5.2,
      lacticAcidConcentrationPct: 80,
      targetSalinityPct: 20,
    });

    const lowConc = calculateBrineAcidification({
      brineWaterLiters: 5,
      initialWaterPh: 7.5,
      targetPh: 5.2,
      lacticAcidConcentrationPct: 40,
      targetSalinityPct: 20,
    });

    expect(lowConc.lacticAcidMlNeeded).toBeCloseTo(highConc.lacticAcidMlNeeded * 2, 0);
  });

  it('handles maximum safe salinity clamping (26% saturation ceiling)', () => {
    const res = calculateBrineAcidification({
      brineWaterLiters: 10,
      initialWaterPh: 7.2,
      targetPh: 5.2,
      lacticAcidConcentrationPct: 80,
      targetSalinityPct: 35, // Exceeds NaCl saturation in water (~26%)
    });

    // Should clamp to 26%
    const expectedSalt = Math.round(((10 * 26) / (100 - 26)) * 100) / 100;
    expect(res.saltKg).toBe(expectedSalt);
  });
});
