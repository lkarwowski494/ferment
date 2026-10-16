import fc from 'fast-check';
import { calculateRennetDose, calculateFlocculationCutTime } from '../../src/core/cheese-engine';
import { calculateTotalBatchSalinity } from '../../src/core/ferment-engine';
import { calculateDewPoint } from '../../src/core/psychrometry';

describe('FERMENT P0 Safety Invariants & Property Tests (fast-check)', () => {
  it('Property: rennet volume scales linearly and strictly monotonically with milk volume', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1.0, max: 200.0, noNaN: true }),
        fc.float({ min: 20.0, max: 60.0, noNaN: true }),
        fc.float({ min: 100.0, max: 800.0, noNaN: true }),
        (milkLiters, targetImcu, rennetStrength) => {
          const res1 = calculateRennetDose(milkLiters, targetImcu, rennetStrength);
          const res2 = calculateRennetDose(milkLiters * 2, targetImcu, rennetStrength);

          expect(res1.volumeMl).toBeGreaterThan(0);
          expect(res2.volumeMl).toBeGreaterThanOrEqual(res1.volumeMl);
          expect(Math.abs(res2.volumeMl - res1.volumeMl * 2)).toBeLessThanOrEqual(0.05);
        }
      )
    );
  });

  it('Property: salt weight in total batch salinity is strictly positive and proportional', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 50000 }), // 100g to 50kg
        fc.integer({ min: 0, max: 50000 }),
        fc.float({ min: 1.5, max: 5.0, noNaN: true }),
        (vegWeight, waterWeight, salinityPct) => {
          const res = calculateTotalBatchSalinity(vegWeight, waterWeight, salinityPct);
          expect(res.saltGrams).toBeGreaterThan(0);
          expect(Math.abs(res.effectiveSalinityPct - salinityPct)).toBeLessThanOrEqual(0.15);
        }
      )
    );
  });

  it('Property: dew point temperature never exceeds ambient dry-bulb temperature (T_dp <= T)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.0, max: 35.0, noNaN: true }), // 0°C to 35°C
        fc.float({ min: 10.0, max: 100.0, noNaN: true }), // 10% to 100% RH
        (tempC, humidityRh) => {
          const dp = calculateDewPoint(tempC, humidityRh);
          // Dew point is always <= ambient dry-bulb temperature within rounding margin
          expect(dp).toBeLessThanOrEqual(tempC + 0.2);
        }
      )
    );
  });

  it('Property: flocculation cut time is always strictly greater than initial flocculation time', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 60, max: 3600 }), // 1 min to 60 min
        fc.float({ min: 1.5, max: 6.0, noNaN: true }),
        (flocSec, multiplier) => {
          const res = calculateFlocculationCutTime(flocSec, multiplier);
          expect(res.totalCoagulationSeconds).toBeGreaterThan(flocSec);
          expect(res.remainingSecondsAfterFloc).toBeGreaterThan(0);
        }
      )
    );
  });
});
