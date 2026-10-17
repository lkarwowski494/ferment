// ============================================================================
// Apps4Brew Studio — Deterministic Property-Based Testing (W3/PBT)
// Mathematical & State Sequence Invariants (fast-check + PROP_SEED Replay)
// ============================================================================

import fc from 'fast-check';
import { calculateTotalBatchSalinity } from '../src/core/ferment-engine';
import { calculateRennetDose } from '../src/core/cheese-engine';
import { calculateFermentationQ10 } from '../src/core/fermentation-q10';
import { calculateDutchLeverPress } from '../src/core/press-cascade';
import { calculateDewPoint, calculateVpd } from '../src/core/psychrometry';
import { wInKeep } from '../src/lib/unit-converter';

const { PROP_SEED, MATRIX_RUNS } = require('./prop-seed.js') as {
  PROP_SEED: number;
  MATRIX_RUNS: number;
};

describe('Fast-Check Mathematical & State Sequence Invariants (BR-TEST-006..010, W3/PBT)', () => {
  const pbtOptions = {
    numRuns: MATRIX_RUNS,
    seed: PROP_SEED,
  };

  beforeAll(() => {
    // Log deterministic seed so any CI failure can be instantly replayed with PROP_SEED=<seed> npm test
    console.log(`[PBT] Running with deterministic PROP_SEED=${PROP_SEED} (runs=${MATRIX_RUNS})`);
  });

  it('Property 1: Salinity strictly scales monotonically with total batch mass (veg + water)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        fc.double({ min: 1.5, max: 5.0, noNaN: true }),
        (veg, water, salinityPct) => {
          const res1 = calculateTotalBatchSalinity(veg, water, salinityPct);
          const res2 = calculateTotalBatchSalinity(veg * 2, water * 2, salinityPct);

          expect(res1.saltGrams).toBeGreaterThan(0);
          expect(res2.saltGrams).toBeGreaterThan(res1.saltGrams);
          // Effective salinity must stay within tight bounds of target
          expect(Math.abs(res1.effectiveSalinityPct - salinityPct)).toBeLessThanOrEqual(0.15);
        }
      ),
      pbtOptions
    );
  });

  it('Property 2: Rennet dose scales linearly with milk volume', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1.0, max: 200.0, noNaN: true }),
        fc.double({ min: 20.0, max: 50.0, noNaN: true }),
        fc.double({ min: 100.0, max: 600.0, noNaN: true }),
        (milk, imcu, strength) => {
          const dose1 = calculateRennetDose(milk, imcu, strength);
          const dose2 = calculateRennetDose(milk * 2, imcu, strength);

          expect(dose1.volumeMl).toBeGreaterThan(0);
          expect(dose2.volumeMl).toBeGreaterThanOrEqual(dose1.volumeMl);
          expect(Math.abs(dose2.volumeMl - dose1.volumeMl * 2)).toBeLessThanOrEqual(0.05);
        }
      ),
      pbtOptions
    );
  });

  it('Property 3: Q10 velocity multiplier increases with temperature above 20°C and decreases below 20°C', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10.0, max: 19.9, noNaN: true }),
        fc.double({ min: 20.1, max: 35.0, noNaN: true }),
        (coldTemp, warmTemp) => {
          const coldRes = calculateFermentationQ10({
            cultureType: 'VEG_LAB',
            ambientTempC: coldTemp,
            nominalDaysAt20C: 7,
          });
          const warmRes = calculateFermentationQ10({
            cultureType: 'VEG_LAB',
            ambientTempC: warmTemp,
            nominalDaysAt20C: 7,
          });

          expect(coldRes.velocityMultiplier).toBeLessThan(1.0);
          expect(warmRes.velocityMultiplier).toBeGreaterThan(1.0);
          expect(coldRes.adjustedHours).toBeGreaterThan(warmRes.adjustedHours);
        }
      ),
      pbtOptions
    );
  });

  it('Property 4: wInKeep unit roundtrip drift invariant (BR-TEST-005) holds across cycles', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10.0, max: 150.0, noNaN: true }),
        (initialKg) => {
          const roundedKg = Math.round(initialKg * 100) / 100;
          // Format to lb with 1 decimal digit
          const displayedLb = (roundedKg * 2.2046226218).toFixed(1);
          // User opens input and re-saves the exact displayed string
          const savedKg = wInKeep(displayedLb, 'lb', roundedKg);
          // Drift must be exactly zero!
          expect(savedKg).toBe(roundedKg);
        }
      ),
      pbtOptions
    );
  });

  it('Property 5: Random state transitions with guaranteed opening step preserve state invariants', () => {
    interface AppBatchState {
      id: string;
      code: string;
      category: 'CHEESE' | 'VEG_FERMENT' | 'KOMBUCHA';
      createdAt: number;
      phHistory: number[];
      status: 'PREPARING' | 'FERMENTING' | 'AGING' | 'COMPLETED' | 'DISCARDED';
    }

    function assertStateInvariants(batches: AppBatchState[]) {
      const ids = new Set<string>();
      for (const b of batches) {
        expect(b.id).toBeTruthy();
        expect(ids.has(b.id)).toBe(false);
        ids.add(b.id);
        expect(b.code).toMatch(/^FERM-\d{4}/);
        expect(Number.isFinite(b.createdAt)).toBe(true);
        expect(b.createdAt).toBeGreaterThan(0);
        for (const ph of b.phHistory) {
          expect(ph).toBeGreaterThanOrEqual(0);
          expect(ph).toBeLessThanOrEqual(14);
          expect(Number.isNaN(ph)).toBe(false);
        }
      }
    }

    type Action =
      | { type: 'ADD_BATCH'; category: 'CHEESE' | 'VEG_FERMENT' | 'KOMBUCHA' }
      | { type: 'ADD_PH'; batchIdx: number; ph: number }
      | { type: 'CHANGE_STATUS'; batchIdx: number; status: 'FERMENTING' | 'AGING' | 'COMPLETED' | 'DISCARDED' }
      | { type: 'REMOVE_BATCH'; batchIdx: number };

    const actionArbitrary: fc.Arbitrary<Action> = fc.oneof(
      fc.record({
        type: fc.constant('ADD_BATCH' as const),
        category: fc.constantFrom('CHEESE' as const, 'VEG_FERMENT' as const, 'KOMBUCHA' as const),
      }),
      fc.record({
        type: fc.constant('ADD_PH' as const),
        batchIdx: fc.nat({ max: 20 }),
        ph: fc.double({ min: 3.2, max: 6.8, noNaN: true }),
      }),
      fc.record({
        type: fc.constant('CHANGE_STATUS' as const),
        batchIdx: fc.nat({ max: 20 }),
        status: fc.constantFrom('FERMENTING' as const, 'AGING' as const, 'COMPLETED' as const, 'DISCARDED' as const),
      }),
      fc.record({
        type: fc.constant('REMOVE_BATCH' as const),
        batchIdx: fc.nat({ max: 20 }),
      })
    );

    fc.assert(
      fc.property(
        fc.array(actionArbitrary, { minLength: 5, maxLength: 50 }),
        (actions) => {
          const batches: AppBatchState[] = [
            {
              id: 'initial_batch',
              code: 'FERM-0001',
              category: 'CHEESE',
              createdAt: 1700000000000,
              phHistory: [6.6],
              status: 'PREPARING',
            },
          ];

          let counter = 2;

          for (const action of actions) {
            switch (action.type) {
              case 'ADD_BATCH': {
                batches.push({
                  id: `batch_${counter}`,
                  code: `FERM-${counter.toString().padStart(4, '0')}`,
                  category: action.category,
                  createdAt: 1700000000000 + counter * 1000,
                  phHistory: [6.5],
                  status: 'PREPARING',
                });
                counter++;
                break;
              }
              case 'ADD_PH': {
                if (batches.length > 0) {
                  const idx = action.batchIdx % batches.length;
                  batches[idx].phHistory.push(action.ph);
                }
                break;
              }
              case 'CHANGE_STATUS': {
                if (batches.length > 0) {
                  const idx = action.batchIdx % batches.length;
                  batches[idx].status = action.status;
                }
                break;
              }
              case 'REMOVE_BATCH': {
                if (batches.length > 1) {
                  const idx = action.batchIdx % batches.length;
                  batches.splice(idx, 1);
                }
                break;
              }
            }

            assertStateInvariants(batches);
          }
        }
      ),
      pbtOptions
    );
  });

  it('Property 6: Dutch Lever Press physics strictly preserves force and pressure monotonicity (GAP-PBT-02)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 30.0, max: 120.0, noNaN: true }),
        fc.double({ min: 10.0, max: 30.0, noNaN: true }),
        fc.double({ min: 0.5, max: 5.0, noNaN: true }),
        fc.double({ min: 1.0, max: 20.0, noNaN: true }),
        fc.double({ min: 8.0, max: 30.0, noNaN: true }),
        (armLen, moldDist, armWeight, weightHung, moldDia) => {
          // Geometry: moldDist <= armLen
          const safeDist = Math.min(armLen - 5.0, Math.max(5.0, moldDist));

          const res1 = calculateDutchLeverPress({
            armTotalLengthCm: armLen,
            moldDistanceCm: safeDist,
            armSelfWeightKg: armWeight,
            weightHungKg: weightHung,
            moldDiameterCm: moldDia,
          });

          // Doubling hanging weight MUST strictly increase total applied force
          const res2 = calculateDutchLeverPress({
            armTotalLengthCm: armLen,
            moldDistanceCm: safeDist,
            armSelfWeightKg: armWeight,
            weightHungKg: weightHung * 2,
            moldDiameterCm: moldDia,
          });

          expect(res1.tareForceFromArmKg).toBeGreaterThanOrEqual(0);
          expect(res1.totalAppliedForceKg).toBeGreaterThan(0);
          expect(res2.totalAppliedForceKg).toBeGreaterThan(res1.totalAppliedForceKg);
          expect(res1.pressurePsi).toBeGreaterThan(0);

          // For identical force, larger diameter mold MUST have strictly lower PSI
          const resLargeMold = calculateDutchLeverPress({
            armTotalLengthCm: armLen,
            moldDistanceCm: safeDist,
            armSelfWeightKg: armWeight,
            weightHungKg: weightHung,
            moldDiameterCm: moldDia + 10.0,
          });

          expect(resLargeMold.pressurePsi).toBeLessThan(res1.pressurePsi);
        }
      ),
      pbtOptions
    );
  });

  it('Property 7: Psychrometry invariants hold: T_dew <= T_dry and VPD >= 0 for all conditions (GAP-PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 2.0, max: 35.0, noNaN: true }),
        fc.double({ min: 20.0, max: 99.9, noNaN: true }),
        (tempC, humidityRh) => {
          const dewPoint = calculateDewPoint(tempC, humidityRh);
          const vpd = calculateVpd(tempC, humidityRh);

          // Invariant 1: Dew point is strictly <= dry bulb air temperature (+ margin for float rounding)
          expect(dewPoint).toBeLessThanOrEqual(tempC + 0.1);

          // Invariant 2: VPD is strictly non-negative
          expect(vpd.vpdKPa).toBeGreaterThanOrEqual(0);
          expect(vpd.esKPa).toBeGreaterThanOrEqual(vpd.eaKPa);

          // Invariant 3: At 100% RH, dew point equals temperature
          const satDewPoint = calculateDewPoint(tempC, 100.0);
          expect(Math.abs(satDewPoint - tempC)).toBeLessThanOrEqual(0.1);
        }
      ),
      pbtOptions
    );
  });
});
