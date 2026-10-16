// ============================================================================
// Apps4Brew Studio — FERMENT Crock & Jar Headspace Sizing Tests
// ============================================================================

import { calculateCrockHeadspace } from '../../src/core/crock-headspace';

describe('FERMENT Crock & Jar Headspace Sizing Engine', () => {
  it('calculates optimal fill level and stone displacement for 1000ml jar', () => {
    // 1000ml jar, 600g shredded cabbage (600 * 0.95 = 570 ml), 250ml brine, 150g glass weight (150 / 2.5 = 60 ml)
    // Total = 570 + 250 + 60 = 880 ml. Headspace = 1000 - 880 = 120 ml (12.0%)
    const res = calculateCrockHeadspace({
      jarCapacityMl: 1000,
      vegetableWeightGrams: 600,
      brineWaterMl: 250,
      weightMassGrams: 150,
      weightMaterial: 'GLASS_FLAT',
      packType: 'SHREDDED_DENSE',
    });

    expect(res.displacedWeightVolumeMl).toBe(60);
    expect(res.totalSubstanceVolumeMl).toBe(880);
    expect(res.remainingHeadspaceMl).toBe(120);
    expect(res.headspacePercentage).toBe(12.0);
    expect(res.isSafeFromOverflow).toBe(true);
    expect(res.isExcessiveHeadspace).toBe(false);
    expect(res.status).toBe('OPTIMAL');
    expect(res.summaryAlert).toContain('Optymalna przestrzeń wolna');
  });

  it('detects overflow hazard when headspace is too small (<40 ml)', () => {
    // 1000ml jar, 700g cabbage (665 ml), 300ml brine, 150g weight (60 ml)
    // Total = 665 + 300 + 60 = 1025 ml -> overflow!
    const overflow = calculateCrockHeadspace({
      jarCapacityMl: 1000,
      vegetableWeightGrams: 700,
      brineWaterMl: 300,
      weightMassGrams: 150,
    });

    expect(overflow.remainingHeadspaceMl).toBeLessThan(0);
    expect(overflow.status).toBe('CRITICAL_SPILL');
    expect(overflow.isSafeFromOverflow).toBe(false);

    // Tight fill: 1000ml, total = 975 ml (headspace 25 ml)
    const tight = calculateCrockHeadspace({
      jarCapacityMl: 1000,
      vegetableWeightGrams: 650, // 618 ml
      brineWaterMl: 300,
      weightMassGrams: 140, // 56 ml -> total 974 ml
    });

    expect(tight.status).toBe('RISK_OVERFLOW');
    expect(tight.isSafeFromOverflow).toBe(false);
    expect(tight.summaryAlert).toContain('Zagrożenie wykipieniem');
  });

  it('detects excessive oxygen headspace (>25%)', () => {
    // 2000ml jar with only 500g cabbage and 200ml brine
    const airy = calculateCrockHeadspace({
      jarCapacityMl: 2000,
      vegetableWeightGrams: 500,
      brineWaterMl: 200,
      weightMassGrams: 100,
    });

    expect(airy.headspacePercentage).toBeGreaterThan(25.0);
    expect(airy.isExcessiveHeadspace).toBe(true);
    expect(airy.status).toBe('RISK_EXCESS_OXYGEN');
    expect(airy.summaryAlert).toContain('Zbyt duża poduszka powietrzna');
  });

  it('calculates headspace height in cm accurately', () => {
    const res = calculateCrockHeadspace({
      jarCapacityMl: 1000,
      vegetableWeightGrams: 600,
      brineWaterMl: 200,
      weightMassGrams: 100,
      jarInnerDiameterCm: 10.0, // radius = 5, area = 78.54 cm2
    });

    // Total = 570 + 200 + 40 = 810 ml. Headspace = 190 ml.
    // Height = 190 / 78.54 ≈ 2.4 cm
    expect(res.headspaceHeightCm).toBeCloseTo(2.4, 1);
  });

  it('validates physical constraints', () => {
    expect(() =>
      calculateCrockHeadspace({
        jarCapacityMl: 0,
        vegetableWeightGrams: 100,
        brineWaterMl: 50,
        weightMassGrams: 50,
      })
    ).toThrow();

    expect(() =>
      calculateCrockHeadspace({
        jarCapacityMl: 1000,
        vegetableWeightGrams: -10,
        brineWaterMl: 50,
        weightMassGrams: 50,
      })
    ).toThrow();
  });
});
