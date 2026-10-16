import {
  calculateCurdSyneresis,
  CHEESE_SYNERESIS_CONFIGS,
} from '../../src/core/curd-syneresis';

describe('Curd Syneresis & Casein Shrinkage Kinetics Engine', () => {
  it('should detect critical case hardening when heating ramp exceeds safety threshold', () => {
    // Gouda heated from 31°C to 39°C in 5 minutes (ramp = 1.6°C/min, safe = 0.5°C/min)
    const result = calculateCurdSyneresis({
      cheeseStyle: 'GOUDA_EDAM',
      curdCutSizeMm: 8,
      initialTempC: 31,
      targetCookingTempC: 39,
      heatingDurationMinutes: 5,
      stirringDurationMinutes: 20,
      drainPh: 6.40,
    });

    expect(result.actualRampRateCPerMin).toBe(1.6);
    expect(result.caseHardeningVerdict).toBe('CRITICAL_CASE_HARDENING');
    expect(result.caseHardeningAlertPl).toContain('Zagrożenie zasklepieniem ziarna');
    expect(result.recommendations.some((r) => r.includes('Wydłuż czas dogrzewania'))).toBe(true);
  });

  it('should validate optimal kinetics for slow ramp rate in Gouda', () => {
    // 31°C to 38°C in 20 minutes (ramp = 0.35°C/min < 0.5°C/min)
    const result = calculateCurdSyneresis({
      cheeseStyle: 'GOUDA_EDAM',
      curdCutSizeMm: 8,
      initialTempC: 31,
      targetCookingTempC: 38,
      heatingDurationMinutes: 20,
      stirringDurationMinutes: 30,
      drainPh: 6.42,
    });

    expect(result.actualRampRateCPerMin).toBe(0.35);
    expect(result.caseHardeningVerdict).toBe('OPTIMAL_PORE_OPEN');
    expect(result.calciumRetentionVerdict).toBe('OPTIMAL_MINERAL_BALANCE');
    expect(result.syneresisIntensityIndex).toBeGreaterThan(40);
    expect(result.expectedMoisturePct).toBeGreaterThanOrEqual(result.expectedMoistureMinPct);
  });

  it('should flag excessive calcium leaching when drain pH is too low', () => {
    // Gouda with premature acidification / over-acidic drain at pH 5.75
    const result = calculateCurdSyneresis({
      cheeseStyle: 'GOUDA_EDAM',
      curdCutSizeMm: 8,
      initialTempC: 31,
      targetCookingTempC: 38,
      heatingDurationMinutes: 20,
      stirringDurationMinutes: 25,
      drainPh: 5.75,
    });

    expect(result.calciumRetentionVerdict).toBe('DECALCIFIED_BRITTLE_ACIDIC');
    expect(result.calciumImpactMessagePl).toContain('Zbyt niskie pH');
  });

  it('should flag rubbery curd when drain pH is too high', () => {
    // Parmesan with drain pH 6.55 (> max 6.35)
    const result = calculateCurdSyneresis({
      cheeseStyle: 'PARMESAN_GRANA',
      curdCutSizeMm: 3,
      initialTempC: 33,
      targetCookingTempC: 54,
      heatingDurationMinutes: 35,
      stirringDurationMinutes: 30,
      drainPh: 6.55,
    });

    expect(result.calciumRetentionVerdict).toBe('EXCESSIVE_CALCIUM_RUBBERY');
    expect(result.calciumImpactMessagePl).toContain('Zbyt wysokie pH');
  });

  it('should correctly model soft mold cheese (Camembert) with low syneresis and high moisture', () => {
    const result = calculateCurdSyneresis({
      cheeseStyle: 'CAMEMBERT_BRIE',
      curdCutSizeMm: 18,
      initialTempC: 32,
      targetCookingTempC: 32, // No cooking
      heatingDurationMinutes: 0,
      stirringDurationMinutes: 5,
      drainPh: 6.35,
    });

    expect(result.caseHardeningVerdict).toBe('OPTIMAL_PORE_OPEN');
    expect(result.expectedMoisturePct).toBeGreaterThan(50);
    expect(result.schedule.length).toBeGreaterThanOrEqual(2);
  });
});
