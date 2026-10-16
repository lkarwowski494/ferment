// ============================================================================
// Apps4Brew Studio — FERMENT Curd Washing, Delactosing & Cheddar Salting Tests
// ============================================================================

import {
  calculateCurdWashWater,
  calculateCurdMillingSalting,
  calculateWheelCoating,
} from '../../src/core/curd-washing-and-salting';

describe('FERMENT Curd Washing, Delactosing & Cheddar Salting', () => {
  describe('calculateCurdWashWater', () => {
    it('calculates water volume required to wash curd and raise temp for Gouda', () => {
      // 10L milk, 31C curd, drain 3L whey (30%), add 60C water to reach 37C
      // Rem = 7L. DeltaT1 = 37 - 31 = 6. DeltaT2 = 60 - 37 = 23.
      // V_water = (7 * 6) / 23 = 42 / 23 = 1.826 L -> 1.83 L
      const res = calculateCurdWashWater({
        milkVolumeLiters: 10,
        initialCurdTempC: 31,
        wheyDrainedLiters: 3,
        hotWaterTempC: 60,
        targetCookingTempC: 37,
        cultureType: 'MESOPHILIC',
      });

      expect(res.waterVolumeLiters).toBeCloseTo(1.83, 2);
      expect(res.delactosingRatioPct).toBe(30.0);
      expect(res.isSafeForBacteria).toBe(true);
      expect(res.warnings).toHaveLength(0);
      expect(res.techniqueRecommendation).toContain('Klasyczne przemywanie Gouda/Edam');
    });

    it('warns when hot water exceeds 65C', () => {
      const res = calculateCurdWashWater({
        milkVolumeLiters: 20,
        initialCurdTempC: 32,
        wheyDrainedLiters: 6,
        hotWaterTempC: 70, // > 65C
        targetCookingTempC: 38,
      });

      expect(res.warnings.some((w) => w.includes('Wysoka temperatura wody'))).toBe(true);
    });

    it('flags bacterial hazard when target temp exceeds 39C with mesophilic cultures', () => {
      const res = calculateCurdWashWater({
        milkVolumeLiters: 10,
        initialCurdTempC: 30,
        wheyDrainedLiters: 3,
        hotWaterTempC: 60,
        targetCookingTempC: 42, // > 39C for mesophilic
        cultureType: 'MESOPHILIC',
      });

      expect(res.isSafeForBacteria).toBe(false);
      expect(res.warnings.some((w) => w.includes('Bakterie mezofilne'))).toBe(true);
    });

    it('throws errors on invalid physical inputs', () => {
      expect(() =>
        calculateCurdWashWater({
          milkVolumeLiters: 10,
          initialCurdTempC: 35,
          wheyDrainedLiters: 12, // More than milk!
          hotWaterTempC: 60,
          targetCookingTempC: 38,
        })
      ).toThrow();

      expect(() =>
        calculateCurdWashWater({
          milkVolumeLiters: 10,
          initialCurdTempC: 35,
          wheyDrainedLiters: 3,
          hotWaterTempC: 35, // Not hotter than target!
          targetCookingTempC: 38,
        })
      ).toThrow();
    });
  });

  describe('calculateCurdMillingSalting', () => {
    it('calculates dry milled salting for Cheddar with press whey runoff loss', () => {
      // 1000g curd, target 2.0% salinity (20g retained), 33% whey runoff loss
      // Total salt = 20 / 0.67 = 29.85 -> 29.9 g
      const res = calculateCurdMillingSalting({
        curdWeightGrams: 1000,
        targetSalinityPct: 2.0,
        wheyRunoffLossPct: 33.0,
      });

      expect(res.netSaltRetainedGrams).toBe(20.0);
      expect(res.totalSaltToApplyGrams).toBeCloseTo(29.9, 1);
      expect(res.additions).toHaveLength(3);
      const totalSteps = res.additions.reduce((acc, step) => acc + step.grams, 0);
      expect(totalSteps).toBeCloseTo(res.totalSaltToApplyGrams, 1);
    });

    it('validates salinity and runoff constraints', () => {
      expect(() =>
        calculateCurdMillingSalting({
          curdWeightGrams: 0,
        })
      ).toThrow();

      expect(() =>
        calculateCurdMillingSalting({
          curdWeightGrams: 1000,
          targetSalinityPct: 8.0, // too high
        })
      ).toThrow();
    });
  });

  describe('calculateWheelCoating', () => {
    it('calculates cheese wax coverage for standard 15cm x 8cm wheel', () => {
      // radius = 7.5 cm, base = PI * 7.5^2 = 176.7 cm2, lateral = 2 * PI * 7.5 * 8 = 376.99 cm2
      // Total = 2 * 176.7 + 377.0 = 730.4 cm2
      // 2 coats of wax @ 0.075 g/cm2 = 730.4 * 0.075 * 2 = 109.56 -> ~110 g
      const res = calculateWheelCoating({
        diameterCm: 15,
        heightCm: 8,
        coatingType: 'CHEESE_WAX',
        layersCount: 2,
      });

      expect(res.surfaceAreaCm2).toBeCloseTo(730.4, 0);
      expect(res.totalGramsNeeded).toBeCloseTo(110, -1);
      expect(res.recommendation).toContain('Wosk serowarski');
    });

    it('calculates breathable polyvinyl coating coverage', () => {
      const res = calculateWheelCoating({
        diameterCm: 15,
        heightCm: 8,
        coatingType: 'POLYVINYL_BREATHABLE',
        layersCount: 2,
      });

      // 730.4 * 0.040 * 2 = ~58 g
      expect(res.totalGramsNeeded).toBeCloseTo(58, -1);
      expect(res.recommendation).toContain('Powłoka polioctanowa');
    });
  });
});
