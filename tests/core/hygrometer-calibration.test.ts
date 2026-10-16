import {
  SATURATED_SALTS,
  getAstmEquilibriumRh,
  calculateSinglePointCalibration,
  calculateTwoPointCalibration,
} from '../../src/core/hygrometer-calibration';

describe('ASTM E104 Saturated Salt Hygrometer Calibration Engine', () => {
  describe('ASTM Equilibrium Reference Table', () => {
    it('should provide exact reference values for standard salts across temperatures', () => {
      expect(SATURATED_SALTS.NACL_TABLE_SALT.nominalRh20C).toBe(75.3);
      expect(SATURATED_SALTS.KCL_POTASSIUM_CHLORIDE.nominalRh20C).toBe(84.3);
      expect(SATURATED_SALTS.K2SO4_POTASSIUM_SULFATE.nominalRh20C).toBe(97.6);
      expect(SATURATED_SALTS.MGCL2_MAGNESIUM_CHLORIDE.nominalRh20C).toBe(33.1);

      // Temperature variation
      expect(getAstmEquilibriumRh('NACL_TABLE_SALT', 20)).toBe(75.3);
      expect(getAstmEquilibriumRh('NACL_TABLE_SALT', 10)).toBe(75.7);

      expect(getAstmEquilibriumRh('KCL_POTASSIUM_CHLORIDE', 20)).toBe(84.3);
      expect(getAstmEquilibriumRh('KCL_POTASSIUM_CHLORIDE', 10)).toBe(86.8);
    });
  });

  describe('Single-Point Salt Calibration', () => {
    it('should detect accurate sensor with minimal offset (<= 2%)', () => {
      const res = calculateSinglePointCalibration({
        saltType: 'NACL_TABLE_SALT',
        chamberTempC: 20,
        rawSensorReadingPct: 75.0,
        measuredCaveRawRhPct: 85.0,
      });

      expect(res.offsetPct).toBe(0.3); // 75.3 - 75.0
      expect(res.accuracyGrade).toBe('EXCELLENT');
      expect(res.calibratedCaveRhPct).toBe(85.3);
      expect(res.cheeseCaveAffinageImpact).toContain('wysoką precyzją');
    });

    it('should detect sensor reading too high and warn against case hardening', () => {
      // Sensor reads 82% in 75.3% salt environment (exaggerates RH by 6.7%)
      const res = calculateSinglePointCalibration({
        saltType: 'NACL_TABLE_SALT',
        chamberTempC: 20,
        rawSensorReadingPct: 82.0,
        measuredCaveRawRhPct: 85.0,
      });

      expect(res.offsetPct).toBe(-6.7);
      expect(res.accuracyGrade).toBe('SIGNIFICANT_DRIFT');
      expect(res.calibratedCaveRhPct).toBe(78.3);
      expect(res.cheeseCaveAffinageImpact).toContain('zawyża wilgotność');
      expect(res.cheeseCaveAffinageImpact).toContain('case hardening');
    });

    it('should detect sensor reading too low and warn against slip skin and mold', () => {
      // Sensor reads 68% in 75.3% salt (underestimates RH by 7.3%)
      const res = calculateSinglePointCalibration({
        saltType: 'NACL_TABLE_SALT',
        chamberTempC: 20,
        rawSensorReadingPct: 68.0,
        measuredCaveRawRhPct: 85.0,
      });

      expect(res.offsetPct).toBe(7.3);
      expect(res.accuracyGrade).toBe('SIGNIFICANT_DRIFT');
      expect(res.calibratedCaveRhPct).toBe(92.3);
      expect(res.cheeseCaveAffinageImpact).toContain('zaniża wilgotność');
      expect(res.cheeseCaveAffinageImpact).toContain('slip skin');
    });

    it('should provide complete 5-step laboratory test checklist', () => {
      const res = calculateSinglePointCalibration({
        saltType: 'KCL_POTASSIUM_CHLORIDE',
        chamberTempC: 20,
        rawSensorReadingPct: 84.0,
      });

      expect(res.testingChecklist).toHaveLength(5);
      expect(res.testingChecklist[0]).toContain('mokrą papkę');
      expect(res.testingChecklist[1]).toContain('szczelnego słoika');
    });
  });

  describe('Two-Point Linear Calibration', () => {
    it('should compute linear slope and intercept between MgCl2 and KCl', () => {
      // MgCl2 ref = 33.1%, sensor reads 30.0%
      // KCl ref = 84.3%, sensor reads 80.0%
      const res = calculateTwoPointCalibration({
        lowSalt: 'MGCL2_MAGNESIUM_CHLORIDE',
        lowSaltTempC: 20,
        lowRawSensorReadingPct: 30.0,

        highSalt: 'KCL_POTASSIUM_CHLORIDE',
        highSaltTempC: 20,
        highRawSensorReadingPct: 80.0,

        measuredCaveRawRhPct: 75.0,
      });

      // slope = (84.3 - 33.1) / (80.0 - 30.0) = 51.2 / 50 = 1.024
      expect(res.slopeA).toBeCloseTo(1.024, 2);
      expect(res.calibrationFormula).toContain('RH_skorygowane');
      expect(res.calibratedCaveRhPct).toBeDefined();
      expect(res.calibratedCaveRhPct).toBeGreaterThan(75);
    });
  });
});
