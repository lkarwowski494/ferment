// ============================================================================
// Apps4Brew Studio — Tests for Traditional Polish Mead (Miodosytnictwo) Engine
// ============================================================================

import { calculateMeadBatch, MEAD_GRADE_CONFIGS } from '../../src/core/mead-kinetics';

describe('Traditional Polish Mead (Miodosytnictwo) Engine', () => {
  describe('Grade Ratios & Gravities', () => {
    test('Półtorak 10L batch has 1:0.5 ratio, mandatory step-feeding and high Balling', () => {
      const result = calculateMeadBatch({
        grade: 'POLTORAK',
        targetTotalVolumeLiters: 10,
        preparation: 'SYCONY',
      });

      expect(result.grade).toBe('POLTORAK');
      expect(result.honeyLiters).toBeCloseTo(6.67, 1);
      expect(result.waterLiters).toBeCloseTo(3.33, 1);
      expect(result.honeyWeightKg).toBeGreaterThan(9.0);
      expect(result.initialBallingDegrees).toBe(60.0);
      expect(result.isStepFeedingMandatory).toBe(true);
      expect(result.stepFeedingDosesLiters).toHaveLength(3);
      expect(result.alertsPl[0]).toContain('WYSOKI SZOK OSMOTYCZNY');
      expect(result.tosnaNutrientGramsTotal).toBeGreaterThan(40);
      expect(result.tosnaAdditionsSchedulePl).toHaveLength(4);
      expect(result.expectedAgingYears.min).toBeGreaterThanOrEqual(4);
    });

    test('Trójniak 15L batch has 1:2 ratio and does not mandate step-feeding', () => {
      const result = calculateMeadBatch({
        grade: 'TROJNIAK',
        targetTotalVolumeLiters: 15,
        preparation: 'NIESYCONY',
      });

      expect(result.honeyLiters).toBe(5.0);
      expect(result.waterLiters).toBe(10.0);
      expect(result.isStepFeedingMandatory).toBe(false);
      expect(result.stepFeedingDosesLiters).toEqual([5.0]);
      expect(result.alertsPl).toHaveLength(0);
      expect(result.expectedAbvPct).toBe(13.0);
      expect(result.expectedAgingYears.min).toBe(1);
    });

    test('Czwórniak 20L table mead has 1:3 ratio and faster maturation', () => {
      const result = calculateMeadBatch({
        grade: 'CZWORNIAK',
        targetTotalVolumeLiters: 20,
        preparation: 'NIESYCONY',
      });

      expect(result.honeyLiters).toBe(5.0);
      expect(result.waterLiters).toBe(15.0);
      expect(result.expectedAbvPct).toBe(10.5);
      expect(result.expectedAgingYears.min).toBe(0.5);
    });
  });

  describe('Must Preparation Advice', () => {
    test('Differentiates boiled sycony from cold-mixed niesycony advice', () => {
      const sycony = calculateMeadBatch({
        grade: 'DWOJNIAK',
        targetTotalVolumeLiters: 10,
        preparation: 'SYCONY',
      });
      const niesycony = calculateMeadBatch({
        grade: 'DWOJNIAK',
        targetTotalVolumeLiters: 10,
        preparation: 'NIESYCONY',
      });

      expect(sycony.preparationAdvicePl).toContain('szumując pianę');
      expect(niesycony.preparationAdvicePl).toContain('maks. 38°C');
    });
  });

  describe('Grade Configs Presets', () => {
    test('All four canonical grades are configured', () => {
      expect(MEAD_GRADE_CONFIGS.POLTORAK).toBeDefined();
      expect(MEAD_GRADE_CONFIGS.DWOJNIAK).toBeDefined();
      expect(MEAD_GRADE_CONFIGS.TROJNIAK).toBeDefined();
      expect(MEAD_GRADE_CONFIGS.CZWORNIAK).toBeDefined();
    });
  });
});
