import {
  calculateSaltToBoostBrine,
  calculateBrineTopupWithVolume,
} from '../../src/core/brine-topup';

describe('FERMENT Brine Topup & Salinity Boost Engine', () => {
  it('calculates salt needed to boost diluted 10L brine from 16% to 20%', () => {
    const res = calculateSaltToBoostBrine(10, 16.0, 20.0);
    expect(res.currentVolumeLiters).toBe(10);
    expect(res.saltGramsToAdd).toBeGreaterThan(450);
    expect(res.saltGramsToAdd).toBeLessThan(600);
    expect(res.warning).toBeUndefined();
  });

  it('calculates combined top-up with added water volume', () => {
    // 5L brine at 18%, we add 2L water and want final 20%
    const res = calculateBrineTopupWithVolume(5, 18.0, 20.0, 2.0);
    expect(res.newTotalVolumeLiters).toBe(7.0);
    expect(res.totalSaltGramsToAdd).toBeGreaterThan(500);
    expect(res.finalSalinityPct).toBe(20.0);
  });

  it('validates bounds and throws on negative volume or impossible target salinity', () => {
    expect(() => calculateSaltToBoostBrine(-5, 15, 20)).toThrow();
    expect(() => calculateSaltToBoostBrine(10, 20, 15)).toThrow(); // Target < current
    expect(() => calculateSaltToBoostBrine(10, 15, 30)).toThrow(); // Exceeds saturation
  });
});
