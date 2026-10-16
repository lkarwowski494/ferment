// ============================================================================
// Apps4Brew Studio — FERMENT Q10 Temperature Kinetics Engine Tests
// ============================================================================

import {
  calculateFermentationQ10,
  FermentCultureType,
} from '../../src/core/fermentation-q10';

describe('FERMENT Q10 Temperature Kinetics Engine', () => {
  it('returns baseline 1.0x velocity at standard 20°C', () => {
    const res = calculateFermentationQ10({
      cultureType: 'VEG_LAB',
      ambientTempC: 20.0,
      nominalDaysAt20C: 7.0,
    });

    expect(res.velocityMultiplier).toBe(1.0);
    expect(res.adjustedDays).toBe(7.0);
    expect(res.adjustedHours).toBe(168);
    expect(res.zone).toBe('GOLDILOCKS_OPTIMAL');
    expect(res.botulinumSafeHourEstimated).toBe(42);
  });

  it('calculates slower crisp fermentation at 16°C in cool cellar', () => {
    const res = calculateFermentationQ10({
      cultureType: 'VEG_LAB',
      ambientTempC: 16.0,
      nominalDaysAt20C: 7.0,
    });

    // deltaT = -4. 2.2^(-0.4) ≈ 0.73. Velocity ≈ 0.73
    expect(res.velocityMultiplier).toBeLessThan(1.0);
    expect(res.velocityMultiplier).toBeGreaterThan(0.7);
    expect(res.adjustedDays).toBeGreaterThan(7.0);
    expect(res.zone).toBe('SLOW_CRISP');
    expect(res.flavorProfileImpact).toContain('Leuconostoc mesenteroides');
  });

  it('calculates accelerated fermentation at 26°C summer room temp', () => {
    const res = calculateFermentationQ10({
      cultureType: 'VEG_LAB',
      ambientTempC: 26.0,
      nominalDaysAt20C: 7.0,
    });

    // deltaT = +6. 2.2^(0.6) ≈ 1.6
    expect(res.velocityMultiplier).toBeGreaterThan(1.5);
    expect(res.adjustedDays).toBeLessThan(5.0);
    expect(res.zone).toBe('RAPID_ACCELERATED');
    expect(res.botulinumSafeHourEstimated).toBeLessThan(30);
  });

  it('detects heat stress and spoilage zone above 27°C', () => {
    const res = calculateFermentationQ10({
      cultureType: 'VEG_LAB',
      ambientTempC: 30.0,
      nominalDaysAt20C: 5.0,
    });

    expect(res.zone).toBe('HEAT_STRESS_SPOILAGE');
    expect(res.technicalRecommendations.some((r) => r.includes('Przenieś naczynie natychmiast'))).toBe(true);
  });

  it('detects sluggish dormant zone below 15°C', () => {
    const res = calculateFermentationQ10({
      cultureType: 'KOMBUCHA_SCOBY',
      ambientTempC: 12.0,
      nominalDaysAt20C: 10.0,
    });

    expect(res.zone).toBe('DORMANT_SLUGGISH');
    expect(res.adjustedDays).toBeGreaterThan(15.0);
  });

  it('validates nominal days > 0', () => {
    expect(() =>
      calculateFermentationQ10({
        cultureType: 'VEG_LAB',
        ambientTempC: 20.0,
        nominalDaysAt20C: 0,
      })
    ).toThrow();
  });
});
