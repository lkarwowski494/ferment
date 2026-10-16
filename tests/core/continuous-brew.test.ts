import {
  estimateContinuousBrewCycleDays,
  estimatePostRefillPh,
  calculateContinuousBrewPlan,
  ContinuousBrewSystem,
} from '../../src/core/continuous-brew';

describe('Kombucha Continuous Brew Siphon & Maintenance Engine', () => {
  const baseSystem: ContinuousBrewSystem = {
    id: 'cb_vessel_01',
    name: 'Słój 10L z kranikiem',
    vesselCapacityLiters: 10,
    currentVolumeLiters: 10,
    ambientTempCelsius: 24,
    teaBaseType: 'BLACK',
    totalCyclesCompleted: 5,
    cyclesSinceLastPurge: 3,
    lastDrawDate: Date.now() - 7 * 86400000,
  };

  describe('Kinetic Cycle Interval Estimation', () => {
    it('should return 7 days at optimal room temperature (24°C)', () => {
      expect(estimateContinuousBrewCycleDays(24)).toBe(7);
      expect(estimateContinuousBrewCycleDays(25)).toBe(7);
    });

    it('should scale down to 4-5 days in warm conditions (27-31°C)', () => {
      expect(estimateContinuousBrewCycleDays(27)).toBe(5);
      expect(estimateContinuousBrewCycleDays(30)).toBe(4);
    });

    it('should scale up to 10-21 days in cool or cold rooms', () => {
      expect(estimateContinuousBrewCycleDays(21)).toBe(10);
      expect(estimateContinuousBrewCycleDays(18)).toBe(14);
      expect(estimateContinuousBrewCycleDays(15)).toBe(21);
    });
  });

  describe('Post-Refill Logarithmic pH Dilution', () => {
    it('should accurately calculate resulting pH after dilution with sweet tea', () => {
      // 7.5L of reserve at pH 3.0 + 2.5L of fresh sweet tea at pH 6.2
      const postPh = estimatePostRefillPh(7.5, 3.0, 2.5, 6.2);
      expect(postPh).toBeGreaterThanOrEqual(3.1);
      expect(postPh).toBeLessThanOrEqual(3.2);
    });

    it('should return baseline pH when volume is zero or unchanged', () => {
      expect(estimatePostRefillPh(10, 3.2, 0)).toBe(3.2);
    });
  });

  describe('Continuous Brew Harvest & Replenishment Planning', () => {
    it('should generate a safe 25% weekly draw plan with ingredients and steep time', () => {
      const plan = calculateContinuousBrewPlan({
        system: baseSystem,
        drawVolumeLiters: 2.5,
        currentPreDrawPh: 3.0,
      });

      expect(plan.drawRatioPct).toBe(25);
      expect(plan.isDrawSafe).toBe(true);
      expect(plan.safetyWarning).toBeUndefined();
      expect(plan.reserveVolumeLiters).toBe(7.5);
      expect(plan.sweetTeaVolumeLiters).toBe(2.5);
      expect(plan.sugarTotalGrams).toBe(175); // 2.5L * 70g
      expect(plan.teaLeavesTotalGrams).toBe(12.5); // 2.5L * 5g
      expect(plan.recommendedSteepTimeMinutes).toBe(15);
      expect(plan.estimatedCycleDays).toBe(7);
      expect(plan.estimatedPostRefillPh).toBeLessThan(3.5);
      expect(plan.trubPurgeAlert?.urgency).toBe('NONE');
    });

    it('should adjust steep time for green and oolong tea bases', () => {
      const greenPlan = calculateContinuousBrewPlan({
        system: { ...baseSystem, teaBaseType: 'GREEN' },
        drawVolumeLiters: 2.0,
      });
      expect(greenPlan.recommendedSteepTimeMinutes).toBe(10);

      const oolongPlan = calculateContinuousBrewPlan({
        system: { ...baseSystem, teaBaseType: 'OOLONG' },
        drawVolumeLiters: 2.0,
      });
      expect(oolongPlan.recommendedSteepTimeMinutes).toBeDefined();
      expect(oolongPlan.recommendedSteepTimeMinutes).toBe(12);
    });

    it('should flag unsafe draw exceeding 35% with critical safety warning', () => {
      const plan = calculateContinuousBrewPlan({
        system: baseSystem,
        drawVolumeLiters: 5.0, // 50% draw
        currentPreDrawPh: 3.2,
      });

      expect(plan.drawRatioPct).toBe(50);
      expect(plan.isDrawSafe).toBe(false);
      expect(plan.safetyWarning).toContain('Pobór przekracza 35% objętości naczynia');
    });

    it('should trigger UPCOMING trub purge alert after 8-11 cycles', () => {
      const plan = calculateContinuousBrewPlan({
        system: { ...baseSystem, cyclesSinceLastPurge: 9 },
        drawVolumeLiters: 2.0,
      });

      expect(plan.trubPurgeAlert?.due).toBe(false);
      expect(plan.trubPurgeAlert?.urgency).toBe('UPCOMING');
      expect(plan.trubPurgeAlert?.actionSteps.length).toBeGreaterThan(0);
    });

    it('should trigger OVERDUE trub purge alert after 12+ cycles with trimming instructions', () => {
      const plan = calculateContinuousBrewPlan({
        system: { ...baseSystem, cyclesSinceLastPurge: 14 },
        drawVolumeLiters: 2.5,
      });

      expect(plan.trubPurgeAlert?.due).toBe(true);
      expect(plan.trubPurgeAlert?.urgency).toBe('OVERDUE');
      expect(plan.trubPurgeAlert?.reason).toContain('14 cykli bez usunięcia osadu drożdżowego');
      expect(plan.trubPurgeAlert?.actionSteps.length).toBe(4);
    });

    it('should provide ambient temperature heating / cooling warnings', () => {
      const coldPlan = calculateContinuousBrewPlan({
        system: { ...baseSystem, ambientTempCelsius: 17 },
        drawVolumeLiters: 2.0,
      });
      expect(coldPlan.recommendations.some((r) => r.includes('maty grzewczej'))).toBe(true);

      const hotPlan = calculateContinuousBrewPlan({
        system: { ...baseSystem, ambientTempCelsius: 30 },
        drawVolumeLiters: 2.0,
      });
      expect(hotPlan.recommendations.some((r) => r.includes('powyżej 28°C'))).toBe(true);
    });
  });
});
