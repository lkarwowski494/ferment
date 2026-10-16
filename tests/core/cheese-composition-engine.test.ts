import {
  calculateCheeseComposition,
  estimateCurdMoistureAndYield,
} from '../../src/core/cheese-composition-engine';

describe('Cheese Composition & Codex Alimentarius Engine', () => {
  describe('calculateCheeseComposition', () => {
    it('correctly classifies a standard Dutch Gouda (Semi-Hard, Full-Fat, Optimal S/M)', () => {
      // Gouda typically: 42% moisture, 28% fat, 2.0% salt
      const result = calculateCheeseComposition({
        moisturePercentage: 42.0,
        fatPercentage: 28.0,
        saltPercentage: 2.0,
      });

      // MFFB = (42 / (100 - 28)) * 100 = 42 / 72 * 100 = 58.3% -> SEMI_HARD (54-63%)
      expect(result.mffbPercentage).toBe(58.3);
      expect(result.firmnessClass).toBe('SEMI_HARD');
      expect(result.firmnessLabelPl).toContain('Półtwardy');

      // FDM = (28 / (100 - 42)) * 100 = 28 / 58 * 100 = 48.3% -> FULL_FAT (45-60%)
      expect(result.fdmPercentage).toBe(48.3);
      expect(result.fatClass).toBe('FULL_FAT');

      // S/M = (2.0 / 42.0) * 100 = 4.8% -> OPTIMAL (4.0 - 6.0%)
      expect(result.saltInMoisturePercentage).toBe(4.8);
      expect(result.smStatus).toBe('OPTIMAL_BALANCED');
      expect(result.isRiskOfBitterness).toBe(false);
      expect(result.isRiskOfStalledAging).toBe(false);
    });

    it('correctly identifies Parmesan / Extra Hard profile', () => {
      // Parmesan: 30% moisture, 28% fat, 2.2% salt
      const result = calculateCheeseComposition({
        moisturePercentage: 30.0,
        fatPercentage: 28.0,
        saltPercentage: 2.2,
      });

      // MFFB = (30 / 72) * 100 = 41.7% -> EXTRA_HARD (<51%)
      expect(result.mffbPercentage).toBe(41.7);
      expect(result.firmnessClass).toBe('EXTRA_HARD');
    });

    it('detects under-salted curd leading to bitterness risk (S/M < 4.0%)', () => {
      // Under-salted: 45% moisture, 25% fat, 1.2% salt -> S/M = 1.2 / 45 * 100 = 2.7%
      const result = calculateCheeseComposition({
        moisturePercentage: 45.0,
        fatPercentage: 25.0,
        saltPercentage: 1.2,
      });

      expect(result.saltInMoisturePercentage).toBe(2.7);
      expect(result.smStatus).toBe('UNDER_SALTED_ACIDIC');
      expect(result.isRiskOfBitterness).toBe(true);
      expect(result.smMessagePl).toContain('goryczki');
      expect(result.recommendations.some((r) => r.includes('gorzkich'))).toBe(true);
    });

    it('detects over-salted curd leading to halted aging risk (S/M > 6.0%)', () => {
      // Over-salted: 38% moisture, 26% fat, 2.8% salt -> S/M = 2.8 / 38 * 100 = 7.4%
      const result = calculateCheeseComposition({
        moisturePercentage: 38.0,
        fatPercentage: 26.0,
        saltPercentage: 2.8,
      });

      expect(result.saltInMoisturePercentage).toBe(7.4);
      expect(result.smStatus).toBe('OVER_SALTED_INHIBITED');
      expect(result.isRiskOfStalledAging).toBe(true);
      expect(result.recommendations.some((r) => r.includes('hamuje'))).toBe(true);
    });

    it('throws validation error for invalid moisture or fat percentage', () => {
      expect(() =>
        calculateCheeseComposition({
          moisturePercentage: -5,
          fatPercentage: 30,
          saltPercentage: 2,
        })
      ).toThrow('Wilgotność');

      expect(() =>
        calculateCheeseComposition({
          moisturePercentage: 60,
          fatPercentage: 50,
          saltPercentage: 2,
        })
      ).toThrow('nie może przekraczać 100%');
    });
  });

  describe('estimateCurdMoistureAndYield', () => {
    it('estimates yield and moisture for 10L cow milk Gouda style', () => {
      const estimate = estimateCurdMoistureAndYield({
        milkVolumeLiters: 10,
        milkFatPct: 3.8,
        milkProteinPct: 3.2,
        curdCutSize: 'PEA_LENTIL',
        pressDurationHours: 6,
        cookingFinalTempC: 38,
      });

      expect(estimate.expectedFreshCurdKg).toBeGreaterThan(0.9);
      expect(estimate.expectedFreshCurdKg).toBeLessThan(1.5);
      expect(estimate.expectedAgedCheeseKg).toBeLessThan(estimate.expectedFreshCurdKg);
      expect(estimate.suggestedAffinageDays).toBe(60);
    });
  });
});
