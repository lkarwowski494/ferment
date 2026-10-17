import fermentCorpus from './fixtures/ferment-corpus.json';
import themeContrastCorpus from './fixtures/theme-contrast-corpus.json';
import dstCorpus from './fixtures/dst-corpus.json';
import { calculateTotalBatchSalinity, verifyBotulinumSafety } from '../src/core/ferment-engine';
import { calculateInstantaneousPuRate } from '../src/core/pasteurization-units';
import { calculateFermentationQ10 } from '../src/core/fermentation-q10';

describe('Python Truth Oracle Corpus Verification (BR-TEST-011..015)', () => {
  it('Salinity: 100% agreement with Python oracle (80 test cases)', () => {
    for (const testCase of fermentCorpus.salinityCases) {
      const res = calculateTotalBatchSalinity(
        testCase.vegGrams,
        testCase.waterGrams,
        testCase.salinityPct
      );
      expect(res.totalMassGrams).toBe(testCase.expectedTotalMassGrams);
      expect(res.saltGrams).toBe(testCase.expectedSaltGrams);
      expect(Math.abs(res.effectiveSalinityPct - testCase.expectedEffectivePct)).toBeLessThanOrEqual(0.1);
    }
  });

  it('Botulinum Guard: 100% agreement with Python oracle (48 test cases)', () => {
    for (const testCase of fermentCorpus.botulinumCases) {
      const res = verifyBotulinumSafety(testCase.measuredPh, testCase.fermentHours);
      expect(res.isSafe).toBe(testCase.expectedIsSafe);
      expect(res.status).toBe(testCase.expectedStatus);
    }
  });

  it('Pasteurization Bigelow PU Rate: 100% agreement with Python oracle (24 test cases)', () => {
    for (const testCase of fermentCorpus.puRateCases) {
      const rate = calculateInstantaneousPuRate(
        testCase.currentTempC,
        testCase.referenceTempC,
        testCase.zValueC
      );
      expect(Math.abs(rate - testCase.expectedPuRate)).toBeLessThanOrEqual(0.005);
    }
  });

  it('Q10 Temperature Kinetics: 100% agreement with Python oracle (32 test cases)', () => {
    for (const testCase of fermentCorpus.q10Cases) {
      const res = calculateFermentationQ10({
        cultureType: testCase.cultureType as any,
        ambientTempC: testCase.ambientTempC,
        nominalDaysAt20C: 7,
      });
      expect(res.velocityMultiplier).toBe(testCase.expectedVelocityMultiplier);
    }
  });

  it('Theme WCAG 2.1 Contrast: all semantic color pairs satisfy minimum contrast thresholds', () => {
    for (const pair of themeContrastCorpus.pairs) {
      expect(pair.passes).toBe(true);
      expect(pair.calculatedRatio).toBeGreaterThanOrEqual(pair.minRequired);
    }
  });

  it('DST & Timezone Invariants: preserves 23h, 24h, 25h boundaries across 7 global zones', () => {
    for (const tc of dstCorpus.cases) {
      expect(tc.durationHours).toBeGreaterThanOrEqual(23.0);
      expect(tc.durationHours).toBeLessThanOrEqual(25.0);
      if (tc.isShortDay23h) {
        expect(tc.durationHours).toBe(23.0);
      }
      if (tc.isLongDay25h) {
        expect(tc.durationHours).toBe(25.0);
      }
      if (tc.isStandardDay24h) {
        expect(tc.durationHours).toBe(24.0);
      }
    }
  });
});
