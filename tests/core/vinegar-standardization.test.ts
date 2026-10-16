import {
  calculateVinegarStandardization,
  calculateVinegarStoichiometry,
  calculateVesselAeration,
} from '../../src/core/vinegar-standardization';

describe('Vinegar Standardization & Surface Aeration Engine', () => {
  describe('Pearson Square Grain Strength Dilution', () => {
    it('should correctly calculate water required to dilute 7.2% vinegar to 5.0%', () => {
      // 5 Liters of 7.2% raw vinegar diluted to 5.0%
      // V_water = 5.0 * (7.2 - 5.0) / 5.0 = 5.0 * 2.2 / 5.0 = 2.20 Liters
      const result = calculateVinegarStandardization({
        rawAcidityPct: 7.2,
        rawVolumeLiters: 5.0,
        targetAcidityPct: 5.0,
        dilutionLiquid: 'DISTILLED_WATER',
      });

      expect(result.rawGrainStrength).toBe(72);
      expect(result.targetGrainStrength).toBe(50);
      expect(result.isDilutionNeeded).toBe(true);
      expect(result.dilutionLiquidVolumeLiters).toBe(2.2);
      expect(result.totalFinishedVolumeLiters).toBe(7.2);
      expect(result.legalFoodGradeClassification).toBe('STANDARD_TABLE_50_GRAIN');
    });

    it('should return zero dilution when raw acidity is already at or below target', () => {
      const result = calculateVinegarStandardization({
        rawAcidityPct: 4.8,
        rawVolumeLiters: 3.0,
        targetAcidityPct: 5.0,
        dilutionLiquid: 'DISTILLED_WATER',
      });

      expect(result.isDilutionNeeded).toBe(false);
      expect(result.dilutionLiquidVolumeLiters).toBe(0);
      expect(result.totalFinishedVolumeLiters).toBe(3.0);
    });

    it('should classify 60 grain as pickling preserve vinegar', () => {
      const result = calculateVinegarStandardization({
        rawAcidityPct: 8.0,
        rawVolumeLiters: 4.0,
        targetAcidityPct: 6.0,
        dilutionLiquid: 'DISTILLED_WATER',
      });

      expect(result.targetGrainStrength).toBe(60);
      expect(result.legalFoodGradeClassification).toBe('PICKLING_PRESERVE_60_GRAIN');
    });
  });

  describe('Stoichiometric Alcohol-to-Acetic Yield', () => {
    it('should calculate expected acidity for standard cider at 85% efficiency', () => {
      // 6.0% ABV cider -> theoretical max ~6.30% acidity -> 85% yield ~5.36% (53.6 grain)
      const result = calculateVinegarStoichiometry({
        initialAbvPct: 6.0,
        batchVolumeLiters: 10,
        biologicalEfficiencyPct: 85,
      });

      expect(result.theoreticalMaxAcidityPct).toBe(6.3);
      expect(result.expectedActualAcidityPct).toBeCloseTo(5.36, 1);
      expect(result.isAlcoholTooHighWarning).toBe(false);
      expect(result.isAlcoholTooLowWarning).toBe(false);
      expect(result.potentialSpoilageRisk).toBeNull();
    });

    it('should flag inhibition warning when ABV exceeds 8.0%', () => {
      const result = calculateVinegarStoichiometry({
        initialAbvPct: 12.0, // High-gravity wine
        batchVolumeLiters: 5,
      });

      expect(result.isAlcoholTooHighWarning).toBe(true);
      expect(result.potentialSpoilageRisk).toContain('Inhibicja bakterii octowych');
      expect(result.recommendedAdjustments[0]).toContain('Rozcieńcz nastaw');
    });

    it('should flag low alcohol warning when ABV is below 4.0%', () => {
      const result = calculateVinegarStoichiometry({
        initialAbvPct: 3.2,
        batchVolumeLiters: 5,
      });

      expect(result.isAlcoholTooLowWarning).toBe(true);
      expect(result.potentialSpoilageRisk).toContain('Niska trwałość biologiczna');
    });
  });

  describe('Vessel Aeration & Surface-to-Volume Kinetics', () => {
    it('should flag stagnant suffocation for narrow neck carboy', () => {
      // Carboy with 6cm neck diameter and 10L liquid -> Area = pi * 3^2 = 28.3 cm^2 -> Ratio = 2.8 cm^2/L
      const result = calculateVesselAeration({
        vesselType: 'DEMIJOHN_CARBOY',
        surfaceDiameterCm: 6,
        liquidVolumeLiters: 10,
      });

      expect(result.surfaceToVolumeRatioCm2PerLiter).toBeLessThan(10);
      expect(result.aerationRating).toBe('STAGNANT_SUFFOCATION');
      expect(result.estimatedFermentationWeeks.min).toBeGreaterThanOrEqual(12);
      expect(result.actionableRecommendations.some((r) => r.includes('Przelej nastaw'))).toBe(true);
    });

    it('should rate wide crock as optimal artisan aeration', () => {
      // Crock with 24cm diameter and 5L liquid -> Area = pi * 12^2 = 452.4 cm^2 -> Ratio = 90.5 cm^2/L
      const result = calculateVesselAeration({
        vesselType: 'WIDE_CROCK',
        surfaceDiameterCm: 24,
        liquidVolumeLiters: 5,
      });

      expect(result.surfaceToVolumeRatioCm2PerLiter).toBeGreaterThan(60);
      expect(result.surfaceToVolumeRatioCm2PerLiter).toBeLessThan(180);
      expect(result.aerationRating).toBe('OPTIMAL_ARTISAN');
      expect(result.estimatedFermentationWeeks.min).toBe(3);
      expect(result.estimatedFermentationWeeks.max).toBe(5);
    });
  });
});
