import { analyzeCultureHotel } from '../../src/core/culture-hotel-engine';

describe('Culture Hotel & Mother Colony Preservation Engine', () => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  it('correctly assesses an active, healthy SCOBY hotel (fed 10 days ago at 21°C)', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'KOMBUCHA_SCOBY_HOTEL',
      lastFedTimestamp: now - 10 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 21,
      currentLiquidVolumeMl: 2000,
      measuredPh: 2.7,
      yeastSludgeDepthCm: 0.5,
    });

    expect(result.daysSinceLastFed).toBe(10);
    expect(result.healthStatus).toBe('HEALTHY_ACTIVE');
    expect(result.isMoldHazard).toBe(false);
    expect(result.isTrubPurgeRequired).toBe(false);
    expect(result.feedingSchedule.feedLiquidVolumeMl).toBe(600);
    expect(result.feedingSchedule.feedSugarGrams).toBe(39); // 0.6L * 65g/L
    expect(result.feedingSchedule.feedNutrientGrams).toBe(4); // 0.6L * 7g/L
  });

  it('flags due-for-feeding when interval is exceeded', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'KOMBUCHA_SCOBY_HOTEL',
      lastFedTimestamp: now - 40 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 22,
      currentLiquidVolumeMl: 1500,
    });

    expect(result.daysSinceLastFed).toBe(40);
    expect(result.healthStatus).toBe('DUE_FOR_FEEDING');
    expect(result.daysUntilNextFeeding).toBe(0);
  });

  it('triggers critical starvation alarm when culture is neglected past the limit', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'KOMBUCHA_SCOBY_HOTEL',
      lastFedTimestamp: now - 75 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 22,
      currentLiquidVolumeMl: 1000,
    });

    expect(result.daysSinceLastFed).toBe(75);
    expect(result.healthStatus).toBe('STARVATION_RISK');
    expect(result.statusLabelPl).toContain('Zagrożenie');
  });

  it('detects mold risk if pH rises above safe boundary in vinegar/SCOBY hotel', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'VINEGAR_MOTHER',
      lastFedTimestamp: now - 5 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 20,
      currentLiquidVolumeMl: 800,
      measuredPh: 3.8, // unsafe! Limit is 3.4
    });

    expect(result.isMoldHazard).toBe(true);
    expect(result.actionAlerts.some((a) => a.includes('ALARM BIO-OCHRONY'))).toBe(true);
  });

  it('warns about dead yeast sediment when sludge depth >= 2.0 cm', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'KOMBUCHA_SCOBY_HOTEL',
      lastFedTimestamp: now - 15 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 20,
      currentLiquidVolumeMl: 2000,
      yeastSludgeDepthCm: 2.5,
    });

    expect(result.isTrubPurgeRequired).toBe(true);
    expect(result.actionAlerts.some((a) => a.includes('OSAD DROŻDŻOWY'))).toBe(true);
  });

  it('calculates grain growth multiplier for milk kefir', () => {
    const now = Date.now();
    const result = analyzeCultureHotel({
      cultureType: 'MILK_KEFIR_GRAINS',
      lastFedTimestamp: now - 1 * ONE_DAY_MS,
      nowTimestamp: now,
      currentTempC: 21,
      currentLiquidVolumeMl: 500,
      grainWeightGrams: 40,
    });

    expect(result.healthStatus).toBe('HEALTHY_ACTIVE');
    expect(result.expectedGrainGainGrams).toBe(6); // 15% of 40g
  });
});
