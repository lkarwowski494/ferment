import { calculateFermentationStatistics } from '../../src/core/fermentation-statistics';
import { Batch, CaveWheel } from '../../src/data/sqlite-store';

describe('Fermentation History & Statistics Engine', () => {
  it('handles empty batch history gracefully', () => {
    const stats = calculateFermentationStatistics([]);
    expect(stats.totalBatches).toBe(0);
    expect(stats.hasEnoughData).toBe(false);
    expect(stats.totalMilkProcessedLiters).toBe(0);
    expect(stats.activeAgingWheelsCount).toBe(0);
  });

  it('aggregates mixed batches and cave wheels correctly', () => {
    const batches: Batch[] = [
      {
        id: 'b1',
        batchNumber: 'BATCH-2026-001',
        createdAt: Date.now() - 30 * 24 * 3600 * 1000,
        category: 'CHEESE',
        styleName: 'Gouda Zagrodowa',
        status: 'AGING',
        milkVolumeLiters: 20,
        sensoryScore: 92,
      },
      {
        id: 'b2',
        batchNumber: 'BATCH-2026-002',
        createdAt: Date.now() - 20 * 24 * 3600 * 1000,
        category: 'CHEESE',
        styleName: 'Cheddar Farmhouse',
        status: 'COMPLETED',
        milkVolumeLiters: 15,
        sensoryScore: 86,
      },
      {
        id: 'b3',
        batchNumber: 'BATCH-2026-003',
        createdAt: Date.now() - 10 * 24 * 3600 * 1000,
        category: 'VEG_FERMENT',
        styleName: 'Baechu-Kimchi',
        status: 'COMPLETED',
        sensoryScore: 88,
      },
    ];

    const wheels: CaveWheel[] = [
      {
        id: 'w1',
        batchId: 'b1',
        wheelTag: 'WHEEL-01',
        locationInCave: 'A1',
        initialWeightGrams: 2100,
        currentWeightGrams: 1950,
        rindType: 'NATURAL',
        targetAgingDays: 60,
        shrinkagePct: 7.1,
        status: 'ACTIVE_AGING',
      },
      {
        id: 'w2',
        batchId: 'b2',
        wheelTag: 'WHEEL-02',
        locationInCave: 'A2',
        initialWeightGrams: 1550,
        currentWeightGrams: 1480,
        rindType: 'NATURAL',
        targetAgingDays: 90,
        shrinkagePct: 4.5,
        status: 'ACTIVE_AGING',
      },
    ];

    const stats = calculateFermentationStatistics(batches, wheels);

    expect(stats.totalBatches).toBe(3);
    expect(stats.batchesByCategory.CHEESE).toBe(2);
    expect(stats.batchesByCategory.VEG_FERMENT).toBe(1);
    expect(stats.totalMilkProcessedLiters).toBe(35);
    expect(stats.totalCheeseWheels).toBe(2);
    expect(stats.activeAgingWheelsCount).toBe(2);
    expect(stats.totalAgingCheeseWeightKg).toBe(3.4); // (1950 + 1480) / 1000 = 3.43 kg
    expect(stats.averageSensoryScore).toBe(88.7); // (92 + 86 + 88) / 3 = 88.67
    expect(stats.sensoryScoreDistribution.exemplary).toBe(1); // 92
    expect(stats.sensoryScoreDistribution.good).toBe(2); // 86, 88
    expect(stats.successRatePercentage).toBe(100);
    expect(stats.totalEstimatedSavingsPln).toBeGreaterThan(150);
    expect(stats.hasEnoughData).toBe(true);
    expect(stats.motivationalSummaryPl).toContain('W piwniczce dojrzewa');
  });
});
