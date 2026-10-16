// ============================================================================
// Apps4Brew Studio — Tests for Brine Acidification & Buffer Engine
// ============================================================================

import { calculateBrineAcidification } from '../../src/core/brine-acidification';

describe('Brine Acidification & Buffer Engine', () => {
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
    expect(res.equilibriumExplanation).toContain('CaCl2');
  });
});
