import {
  evaluateGingerBugStarter,
  calculateGingerBeerBatch,
} from '../../src/core/ginger-bug';

describe('Ginger Bug & Wild Soda Carbonation Kinetics Engine (src/core/ginger-bug.ts)', () => {
  describe('evaluateGingerBugStarter', () => {
    test('Early young starter (day 2) is incubating and not ready for brewing', () => {
      const result = evaluateGingerBugStarter({
        starterAgeDays: 2,
        daysSinceLastFeed: 1,
        temperatureC: 22,
        hasBubbles: false,
        hasFizzOnStir: false,
        isRefrigerated: false,
      });

      expect(result.status).toBe('INCUBATING_YOUNG');
      expect(result.isReadyForBrewing).toBe(false);
      expect(result.nextFeedGingerGrams).toBe(15);
      expect(result.nextFeedSugarGrams).toBe(15);
    });

    test('Peak active bubbling starter is ready for brewing', () => {
      const result = evaluateGingerBugStarter({
        starterAgeDays: 5,
        daysSinceLastFeed: 1,
        temperatureC: 23,
        hasBubbles: true,
        hasFizzOnStir: true,
        isRefrigerated: false,
      });

      expect(result.status).toBe('PEAK_ACTIVE');
      expect(result.isReadyForBrewing).toBe(true);
      expect(result.starterHealthScore).toBeGreaterThanOrEqual(90);
      expect(result.recommendationsPl[0]).toContain('szczytową aktywność');
    });

    test('Sluggish starter neglected for 3 days needs feeding', () => {
      const result = evaluateGingerBugStarter({
        starterAgeDays: 8,
        daysSinceLastFeed: 3,
        temperatureC: 22,
        hasBubbles: false,
        hasFizzOnStir: false,
        isRefrigerated: false,
      });

      expect(result.status).toBe('SLUGGISH_NEED_FEEDING');
      expect(result.isReadyForBrewing).toBe(false);
      expect(result.recommendationsPl[0]).toContain('wygłodzony');
    });

    test('Refrigerated dormant starter requires revival protocol', () => {
      const result = evaluateGingerBugStarter({
        starterAgeDays: 20,
        daysSinceLastFeed: 4,
        temperatureC: 4,
        hasBubbles: false,
        hasFizzOnStir: false,
        isRefrigerated: true,
      });

      expect(result.status).toBe('REFRIGERATED_DORMANT');
      expect(result.isReadyForBrewing).toBe(false);
      expect(result.recommendationsPl[0]).toContain('śpi w lodówce');
    });
  });

  describe('calculateGingerBeerBatch', () => {
    test('Calculates exact recipe proportions for 2.0L batch', () => {
      const batch = calculateGingerBeerBatch({
        batchVolumeLiters: 2.0,
        targetSugarGramsPerLiter: 70,
        bottlingTempC: 22,
        hoursInBottle: 12,
      });

      expect(batch.requiredStarterVolumeMl).toBe(200); // 10%
      expect(batch.totalSugarGrams).toBe(140);
      expect(batch.freshGingerDecoctionGrams).toBe(100);
      expect(batch.lemonJuiceMl).toBe(70);
      expect(batch.burstRiskSeverity).toBe('SAFE');
    });

    test('Models progression of CO2 carbonation up to optimal champagne level', () => {
      const batch = calculateGingerBeerBatch({
        batchVolumeLiters: 3.0,
        targetSugarGramsPerLiter: 70,
        bottlingTempC: 23,
        hoursInBottle: 24,
      });

      expect(batch.estimatedCo2Volumes).toBeGreaterThanOrEqual(2.2);
      expect(batch.carbonationStage).toBe('OPTIMAL_CHAMPAGNE');
      expect(batch.burstRiskSeverity).toBe('SAFE');
    });

    test('Triggers critical Bottle Burst Guard when CO2 exceeds safety threshold', () => {
      const batch = calculateGingerBeerBatch({
        batchVolumeLiters: 1.5,
        targetSugarGramsPerLiter: 70,
        bottlingTempC: 24,
        hoursInBottle: 52, // excessive hours in warm room
      });

      expect(batch.estimatedCo2Volumes).toBeGreaterThanOrEqual(3.4);
      expect(batch.burstRiskSeverity).toBe('CRITICAL');
      expect(batch.alertsPl[0]).toContain('KRYTYCZNE CIŚNIENIE');
      expect(batch.alertsEn[0]).toContain('CRITICAL CO2 PRESSURE');
    });
  });
});
