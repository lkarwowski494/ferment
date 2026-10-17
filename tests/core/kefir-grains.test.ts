// ============================================================================
// Apps4Brew Studio — Tests for Kefir Grains Biomass & Fermentation Kinetics
// ============================================================================

import {
  calculateKefir1F,
  calculateKefir2F,
  getKefirHibernationPlan,
} from '../../src/core/kefir-grains';

describe('Kefir Grains Biomass & Fermentation Kinetics', () => {
  describe('Kefir 1F Kinetics & Inoculation', () => {
    test('Standard milk kefir 1L with 35g grains has optimal status and balanced duration', () => {
      const result = calculateKefir1F({
        medium: 'MILK_KEFIR',
        liquidVolumeMl: 1000,
        grainWeightGrams: 35,
        ambientTempC: 21.0,
      });

      expect(result.status).toBe('OPTIMAL');
      expect(result.inoculationRatioPct).toBe(3.5);
      expect(result.recommendedGrainWeightMinG).toBe(25);
      expect(result.recommendedGrainWeightMaxG).toBe(50);
      expect(result.estimatedFermentationHours).toBeGreaterThanOrEqual(16);
      expect(result.estimatedFermentationHours).toBeLessThanOrEqual(28);
      expect(result.expectedLactoseReductionPct).toBeGreaterThanOrEqual(70);
      expect(result.biomassGrowthPotentialGrams).toBeGreaterThan(0);
      expect(result.alertsPl).toHaveLength(0);
    });

    test('Over-inoculation (>7%) in milk kefir triggers whey pocketing alert', () => {
      const result = calculateKefir1F({
        medium: 'MILK_KEFIR',
        liquidVolumeMl: 1000,
        grainWeightGrams: 85, // 8.5%
        ambientTempC: 22.0,
      });

      expect(result.status).toBe('OVER_INOCULATED');
      expect(result.alertsPl.length).toBeGreaterThan(0);
      expect(result.alertsPl[0]).toContain('whey pocketing');
    });

    test('Under-inoculation (<1.5%) triggers slow fermentation alert', () => {
      const result = calculateKefir1F({
        medium: 'MILK_KEFIR',
        liquidVolumeMl: 1000,
        grainWeightGrams: 10, // 1.0%
        ambientTempC: 20.0,
      });

      expect(result.status).toBe('UNDER_INOCULATED');
      expect(result.alertsPl[0]).toContain('Za mało ziaren');
    });

    test('High ambient temperature (>28°C) triggers thermal risk of yeast dominance', () => {
      const result = calculateKefir1F({
        medium: 'MILK_KEFIR',
        liquidVolumeMl: 1000,
        grainWeightGrams: 35,
        ambientTempC: 30.0,
      });

      expect(result.status).toBe('THERMAL_RISK');
      expect(result.alertsPl[0]).toContain('Drożdże kefirowe dominują');
    });
  });

  describe('Kefir 2F Secondary Fermentation & Carbonation', () => {
    test('Hermetic bottle 2F for 18h builds pleasant effervescence and increases folates', () => {
      const result = calculateKefir2F({
        medium: 'MILK_KEFIR',
        ripenedLiquidVolumeMl: 500,
        flavorAddition: 'CITRUS_PEEL',
        temperatureC: 21.0,
        durationHours: 18,
        isHermeticVessel: true,
      });

      expect(result.carbonationLevelVol).toBeGreaterThan(1.5);
      expect(result.finalLactoseReductionPct).toBeGreaterThanOrEqual(90);
      expect(result.folateIncreasePct).toBe(95);
      expect(result.riskOfBottleBurst).toBe(false);
    });

    test('Excessive hermetic 2F duration triggers critical bottle burst alert', () => {
      const result = calculateKefir2F({
        medium: 'MILK_KEFIR',
        ripenedLiquidVolumeMl: 500,
        flavorAddition: 'BERRIES',
        temperatureC: 24.0,
        durationHours: 40,
        isHermeticVessel: true,
      });

      expect(result.riskOfBottleBurst).toBe(true);
      expect(result.alertsPl[0]).toContain('KRYTYCZNE CIŚNIENIE CO2');
    });
  });

  describe('Kefir Grains Hibernation Strategies', () => {
    test('Returns coherent plans for fridge, freezer, and dehydration', () => {
      const fridge = getKefirHibernationPlan('FRIDGE_LIQUID');
      expect(fridge.storageDaysMax).toBe(21);
      expect(fridge.reactivationStepsPl.length).toBeGreaterThanOrEqual(3);

      const freezer = getKefirHibernationPlan('FREEZER_DRY_POWDER');
      expect(freezer.storageDaysMax).toBe(365);

      const dry = getKefirHibernationPlan('DEHYDRATED');
      expect(dry.storageDaysMax).toBe(540);
    });
  });
});
