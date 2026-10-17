import { calculateBlackGarlic, BLACK_GARLIC_PHASES } from '../../src/core/black-garlic';

describe('Black Garlic & Slow Maillard Aging Engine (src/core/black-garlic.ts)', () => {
  test('Phase 1: Initiation and enzyme inactivation at day 5', () => {
    const result = calculateBlackGarlic({
      rawWeightGrams: 1000,
      currentDay: 5,
      chamberTempC: 75,
      chamberRhPct: 85,
    });

    expect(result.currentPhase.id).toBe('INITIATION');
    expect(result.remainingDays).toBe(40);
    expect(result.estimatedCurrentWeightGrams).toBeLessThan(1000);
    expect(result.estimatedCurrentWeightGrams).toBeGreaterThan(900);
    expect(result.sacMultiplier).toBeGreaterThanOrEqual(1.0);
    expect(result.alerts).toHaveLength(0);
    expect(result.textureEstimatePl).toContain('żółtawo');
  });

  test('Phase 2: Active Maillard and melanoidin synthesis at day 20', () => {
    const result = calculateBlackGarlic({
      rawWeightGrams: 500,
      currentDay: 20,
      chamberTempC: 70,
      chamberRhPct: 80,
    });

    expect(result.currentPhase.id).toBe('MAILLARD_ACTIVE');
    expect(result.sacMultiplier).toBeGreaterThan(4.0);
    expect(result.expectedSugarBrix).toBeGreaterThan(25.0);
    expect(result.alerts).toHaveLength(0);
    expect(result.flavorProfilePl).toContain('umami');
  });

  test('Phase 3: Balsamic aging at day 35', () => {
    const result = calculateBlackGarlic({
      rawWeightGrams: 800,
      currentDay: 35,
      chamberTempC: 65,
      chamberRhPct: 70,
    });

    expect(result.currentPhase.id).toBe('BALSAMIC_AGING');
    expect(result.sacMultiplier).toBeGreaterThanOrEqual(7.0);
    expect(result.flavorProfilePl).toContain('balsamico');
    expect(result.alerts).toHaveLength(0);
  });

  test('Phase 4: Rest and aeration drying at day 45', () => {
    const result = calculateBlackGarlic({
      rawWeightGrams: 600,
      currentDay: 45,
      chamberTempC: 22,
      chamberRhPct: 50,
    });

    expect(result.currentPhase.id).toBe('REST_DRYING');
    expect(result.progressPct).toBe(100);
    expect(result.remainingDays).toBe(0);
    expect(result.estimatedWeightLossPct).toBeCloseTo(48.0, 1);
    expect(result.textureEstimatePl).toContain('żelka');
    // At resting ambient phase, temp and RH shouldn't trigger heated chamber alerts
    expect(result.alerts).toHaveLength(0);
  });

  test('Critical temperature safety alerts: cold spoiling and pyrolysis scorching', () => {
    const coldResult = calculateBlackGarlic({
      rawWeightGrams: 500,
      currentDay: 15,
      chamberTempC: 50, // Below 55°C
      chamberRhPct: 80,
    });
    expect(coldResult.alerts.some(a => a.code === 'TEMPERATURE_CRITICAL_LOW')).toBe(true);

    const hotResult = calculateBlackGarlic({
      rawWeightGrams: 500,
      currentDay: 15,
      chamberTempC: 86, // Above 82°C
      chamberRhPct: 80,
    });
    expect(hotResult.alerts.some(a => a.code === 'TEMPERATURE_CRITICAL_HIGH')).toBe(true);
  });

  test('Humidity safety alerts: desiccation turning to rock vs waterlogging', () => {
    const dryResult = calculateBlackGarlic({
      rawWeightGrams: 500,
      currentDay: 12,
      chamberTempC: 72,
      chamberRhPct: 45, // Below 60%
    });
    expect(dryResult.alerts.some(a => a.code === 'RH_CRITICAL_LOW')).toBe(true);

    const wetResult = calculateBlackGarlic({
      rawWeightGrams: 500,
      currentDay: 12,
      chamberTempC: 72,
      chamberRhPct: 95, // Above 92%
    });
    expect(wetResult.alerts.some(a => a.code === 'RH_CRITICAL_HIGH')).toBe(true);
  });
});
