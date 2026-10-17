import fc from 'fast-check';
import { calculateTotalBatchSalinity } from '../src/core/ferment-engine';
import { calculateRennetDose } from '../src/core/cheese-engine';
import { calculateFermentationQ10 } from '../src/core/fermentation-q10';
import { wInKeep } from '../src/lib/unit-converter';

describe('Fast-Check Mathematical & State Sequence Invariants (BR-TEST-006..010)', () => {
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
      { numRuns: 200 }
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
      { numRuns: 200 }
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
      { numRuns: 200 }
    );
  });

  it('Property 4: wInKeep unit roundtrip drift invariant (BR-TEST-005) holds across 200 cycles', () => {
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
      { numRuns: 200 }
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

    // Invariant verifier
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
        fc.array(actionArbitrary, { minLength: 15, maxLength: 40 }),
        (actions) => {
          let seq = 1;
          const batches: AppBatchState[] = [];

          // Guaranteed opening step (BR-TEST-007)
          batches.push({
            id: 'init-001',
            code: 'FERM-0001',
            category: 'CHEESE',
            createdAt: Date.now(),
            phHistory: [6.6],
            status: 'PREPARING',
          });
          assertStateInvariants(batches);

          for (const action of actions) {
            switch (action.type) {
              case 'ADD_BATCH': {
                seq++;
                batches.push({
                  id: `batch-${seq}`,
                  code: `FERM-${String(seq).padStart(4, '0')}`,
                  category: action.category,
                  createdAt: Date.now() + seq * 1000,
                  phHistory: [],
                  status: 'PREPARING',
                });
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

            // Assert state invariants hold true after EVERY single step
            assertStateInvariants(batches);
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
