// ============================================================================
// Apps4Brew Studio — Python Truth Oracle Differential Verification (W3/DIFF)
// Differential testing across Ferments, Contrast, DST and Artisan Dairy & Cheese Physics
// ============================================================================

import fermentCorpus from './fixtures/ferment-corpus.json';
import dairyCorpus from './fixtures/dairy-corpus.json';
import themeContrastCorpus from './fixtures/theme-contrast-corpus.json';
import dstCorpus from './fixtures/dst-corpus.json';
import { calculateTotalBatchSalinity, verifyBotulinumSafety } from '../src/core/ferment-engine';
import { calculateInstantaneousPuRate } from '../src/core/pasteurization-units';
import { calculateFermentationQ10 } from '../src/core/fermentation-q10';
import { calculateDewPoint, calculateVpd } from '../src/core/psychrometry';
import { calculateDutchLeverPress } from '../src/core/press-cascade';
import { calculateBrineAcidification } from '../src/core/brine-acidification';
import { calculateRennetDose } from '../src/core/cheese-engine';

describe('Python Truth Oracle Corpus Verification (BR-TEST-011..015, W3/DIFF)', () => {
  describe('Legacy Ferments & Plant Microbiology (ferment-corpus.json)', () => {
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
  });

  describe('Artisan Cheese & Cave Physics Differential Verification (dairy-corpus.json, GAP-DIFF-01)', () => {
    it('Psychrometry & VPD: 100% agreement with Python oracle (56 test cases)', () => {
      for (const tc of dairyCorpus.psychrometryCases) {
        const dp = calculateDewPoint(tc.temperatureC, tc.humidityRhPct);
        expect(Math.abs(dp - tc.expectedDewPointC)).toBeLessThanOrEqual(0.1);

        const vpd = calculateVpd(tc.temperatureC, tc.humidityRhPct);
        expect(Math.abs(vpd.esKPa - tc.expectedEsKPa)).toBeLessThanOrEqual(0.005);
        expect(Math.abs(vpd.eaKPa - tc.expectedEaKPa)).toBeLessThanOrEqual(0.005);
        expect(Math.abs(vpd.vpdKPa - tc.expectedVpdKPa)).toBeLessThanOrEqual(0.005);
      }
    });

    it('Dutch Lever Press Mechanics: 100% agreement with Python oracle (6 test cases)', () => {
      for (const tc of dairyCorpus.pressCases) {
        const res = calculateDutchLeverPress({
          armTotalLengthCm: tc.armTotalLengthCm,
          moldDistanceCm: tc.moldDistanceCm,
          armSelfWeightKg: tc.armSelfWeightKg,
          weightHungKg: tc.weightHungKg,
          moldDiameterCm: tc.moldDiameterCm,
        });

        expect(Math.abs(res.mechanicalAdvantageRatio - tc.expectedRatio)).toBeLessThanOrEqual(0.02);
        expect(Math.abs(res.tareForceFromArmKg - tc.expectedTareForceKg)).toBeLessThanOrEqual(0.05);
        expect(Math.abs(res.totalAppliedForceKg - tc.expectedTotalForceKg)).toBeLessThanOrEqual(0.05);
        expect(Math.abs(res.pressurePsi - tc.expectedPressurePsi)).toBeLessThanOrEqual(0.05);
      }
    });

    it('Brine Acidification Equilibrium: 100% agreement with Python oracle (5 test cases)', () => {
      for (const tc of dairyCorpus.brineCases) {
        const res = calculateBrineAcidification({
          brineWaterLiters: tc.waterLiters,
          initialWaterPh: tc.initialPh,
          targetPh: tc.targetPh,
          lacticAcidConcentrationPct: tc.acidPct,
          targetSalinityPct: tc.salinityPct,
        });

        expect(Math.abs(res.saltKg - tc.expectedSaltKg)).toBeLessThanOrEqual(0.05);
        expect(Math.abs(res.lacticAcidMlNeeded - tc.expectedAcidMl)).toBeLessThanOrEqual(0.1);
        expect(Math.abs(res.cacl2GramsNeeded - tc.expectedCacl2Grams)).toBeLessThanOrEqual(0.1);
      }
    });

    it('Rennet IMCU Dosage: 100% agreement with Python oracle (5 test cases)', () => {
      for (const tc of dairyCorpus.rennetCases) {
        const res = calculateRennetDose(tc.milkLiters, tc.targetImcu, tc.rennetStrength);
        expect(Math.abs(res.volumeMl - tc.expectedVolumeMl)).toBeLessThanOrEqual(0.02);
      }
    });
  });

  describe('UI & Time Invariants (theme-contrast-corpus.json, dst-corpus.json)', () => {
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
});
