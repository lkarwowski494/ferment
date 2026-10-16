import {
  calculateInstantaneousPuRate,
  calculatePasteurizationPlan,
  PASTEURIZATION_TARGETS,
} from '../../src/core/pasteurization-units';

describe('Pasteurization Units (PU) & Thermal Stabilization Engine', () => {
  describe('Instantaneous Bigelow Lethality Rate', () => {
    it('should return exactly 1.0 PU/min at reference temperature (60°C)', () => {
      const rate = calculateInstantaneousPuRate(60.0, 60.0, 7.0);
      expect(rate).toBeCloseTo(1.0, 3);
    });

    it('should increase tenfold when temperature rises by one z-value (+7°C)', () => {
      const rate67 = calculateInstantaneousPuRate(67.0, 60.0, 7.0);
      expect(rate67).toBeCloseTo(10.0, 2);
    });

    it('should return 0 when temperature is significantly below lethal threshold (< T_ref - 10)', () => {
      const coldRate = calculateInstantaneousPuRate(45.0, 60.0, 7.0);
      expect(coldRate).toBe(0);
    });
  });

  describe('Kombucha Stabilization Plan', () => {
    it('should calculate required hold time in 63°C water bath to achieve target 20 PU', () => {
      const plan = calculatePasteurizationPlan({
        category: 'KOMBUCHA_STABILIZATION',
        waterBathTempCelsius: 63.0,
      });

      expect(plan.category).toBe('KOMBUCHA_STABILIZATION');
      expect(plan.targetPu).toBe(20);
      expect(plan.puAccumulationRatePerMinute).toBeGreaterThan(1.0);
      expect(plan.requiredHoldTimeMinutes).toBeGreaterThan(5);
      expect(plan.requiredHoldTimeMinutes).toBeLessThan(20);
      expect(plan.thermalSafetyStatus).toBe('SAFE_OPTIMAL');
      expect(plan.recommendedWaterBathProtocol.length).toBe(4);
    });

    it('should flag heat damage risk when water bath temperature is too high (> 68°C)', () => {
      const hotPlan = calculatePasteurizationPlan({
        category: 'KOMBUCHA_STABILIZATION',
        waterBathTempCelsius: 74.0,
      });

      expect(hotPlan.thermalSafetyStatus).toBe('SENSORY_HEAT_DAMAGE_RISK');
      expect(hotPlan.statusMessagePl).toContain('przekracza próg zachowania jakości');
    });

    it('should detect under-pasteurization when user hold time is insufficient', () => {
      const shortPlan = calculatePasteurizationPlan({
        category: 'KOMBUCHA_STABILIZATION',
        waterBathTempCelsius: 62.0,
        holdTimeMinutes: 2, // only 2 minutes
      });

      expect(shortPlan.isTargetAchieved).toBe(false);
      expect(shortPlan.thermalSafetyStatus).toBe('UNDER_PASTEURIZED_UNSTABLE');
      expect(shortPlan.statusMessagePl).toContain('Niedostateczna pasteryzacja');
    });
  });

  describe('Fermented Hot Sauce & Crisp Pickle Profiles', () => {
    it('should calculate higher lethality targets for fermented hot sauce (50-100 PU)', () => {
      const srirachaPlan = calculatePasteurizationPlan({
        category: 'FERMENTED_HOT_SAUCE',
        waterBathTempCelsius: 72.0,
      });

      expect(srirachaPlan.targetPu).toBe(75);
      expect(srirachaPlan.thermalSafetyStatus).toBe('SAFE_OPTIMAL');
    });

    it('should verify crisp pickle low-temp denaturation protocol', () => {
      const picklePlan = calculatePasteurizationPlan({
        category: 'CRISP_PICKLE_JAR',
        waterBathTempCelsius: 72.0,
        holdTimeMinutes: 20,
      });

      expect(picklePlan.targetPu).toBe(140);
      expect(picklePlan.sensoryPreservationAdvice).toContain('denaturuje enzym pektynazy');
    });
  });
});
