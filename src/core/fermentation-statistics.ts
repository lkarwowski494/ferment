// ============================================================================
// Apps4Brew Studio — FERMENT Batch History & Production Statistics Engine
// Aggregates craft productivity, sensory scores, affinage cave load & financial savings
// Adapted from Apps4Brew Studio Standards (Piekarz & Słoik).
// ============================================================================

import { Batch, CaveWheel } from '../data/sqlite-store';

export interface FermentationStatisticsResult {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  completedBatchesCount: number;
  successRatePercentage: number;
  successRatePct: number;
  batchesByCategory: {
    CHEESE: number;
    VEG_FERMENT: number;
    KOMBUCHA: number;
  };
  cheeseBatches: number;
  vegBatches: number;
  bevBatches: number;
  totalMilkProcessedLiters: number;
  totalMilkVolumeL: number;
  totalCheeseWheels: number;
  activeAgingWheelsCount: number;
  activeCaveWheels: number;
  totalAgingCheeseWeightKg: number;
  totalCaveWeightKg: number;

  averageSensoryScore: number;
  avgSensoryScore: number;
  scoredBatchesCount: number;
  evaluatedCount: number;
  sensoryScoreDistribution: {
    exemplary: number; // 90-100
    good: number;      // 75-89
    acceptable: number;// 60-74
    flawed: number;    // <60
  };

  totalEstimatedSavingsPln: number;
  estimatedTotalSavingsPln: number;
  mostPopularCraftType: string;
  hasEnoughData: boolean;
  motivationalSummaryPl: string;
}

/**
 * Calculates aggregate artisan metrics and economic impact from user's production batches and cave wheels
 */
export function calculateFermentationStatistics(
  batches: Batch[],
  caveWheels: CaveWheel[] = []
): FermentationStatisticsResult {
  if (!batches || batches.length === 0) {
    return {
      totalBatches: 0,
      activeBatches: 0,
      completedBatches: 0,
      completedBatchesCount: 0,
      successRatePercentage: 100,
      successRatePct: 100,
      batchesByCategory: { CHEESE: 0, VEG_FERMENT: 0, KOMBUCHA: 0 },
      cheeseBatches: 0,
      vegBatches: 0,
      bevBatches: 0,
      totalMilkProcessedLiters: 0,
      totalMilkVolumeL: 0,
      totalCheeseWheels: 0,
      activeAgingWheelsCount: 0,
      activeCaveWheels: 0,
      totalAgingCheeseWeightKg: 0,
      totalCaveWeightKg: 0,
      averageSensoryScore: 0,
      avgSensoryScore: 0,
      scoredBatchesCount: 0,
      evaluatedCount: 0,
      sensoryScoreDistribution: { exemplary: 0, good: 0, acceptable: 0, flawed: 0 },
      totalEstimatedSavingsPln: 0,
      estimatedTotalSavingsPln: 0,
      mostPopularCraftType: 'Brak danych',
      hasEnoughData: false,
      motivationalSummaryPl: 'Zapisz swoją pierwszą partię, aby uruchomić analitykę rzemieślniczą!',
    };
  }

  const counts = {
    CHEESE: 0,
    VEG_FERMENT: 0,
    KOMBUCHA: 0,
  };

  let totalMilkLiters = 0;
  let completedCount = 0;
  let sensorySum = 0;
  let scoredCount = 0;
  let totalSavings = 0;

  const distribution = {
    exemplary: 0,
    good: 0,
    acceptable: 0,
    flawed: 0,
  };

  for (const b of batches) {
    if (b.category === 'CHEESE') counts.CHEESE++;
    else if (b.category === 'VEG_FERMENT') counts.VEG_FERMENT++;
    else if (b.category === 'KOMBUCHA') counts.KOMBUCHA++;

    if (b.status === 'COMPLETED' || b.status === 'AGING') {
      completedCount++;
    }

    if (b.milkVolumeLiters && b.milkVolumeLiters > 0) {
      totalMilkLiters += b.milkVolumeLiters;
      // Cheese benchmark savings: ~45 PLN savings per 10L batch
      totalSavings += (b.milkVolumeLiters / 10) * 45;
    } else if (b.category === 'VEG_FERMENT') {
      totalSavings += 35; // typical savings on 3-5kg kimchi/pickles
    } else if (b.category === 'KOMBUCHA') {
      totalSavings += 25; // typical savings on 5L kombucha
    }

    if (b.sensoryScore !== undefined && b.sensoryScore > 0) {
      sensorySum += b.sensoryScore;
      scoredCount++;

      if (b.sensoryScore >= 90) distribution.exemplary++;
      else if (b.sensoryScore >= 75) distribution.good++;
      else if (b.sensoryScore >= 60) distribution.acceptable++;
      else distribution.flawed++;
    }
  }

  // Cave wheels metrics
  const totalCheeseWheels = caveWheels.length;
  const activeAgingWheels = caveWheels.filter((w) => !w.status || w.status === 'ACTIVE_AGING');
  const activeAgingWheelsCount = activeAgingWheels.length;

  const totalAgingCheeseWeightKg =
    Math.round(
      activeAgingWheels.reduce((sum, w) => sum + (w.currentWeightGrams || w.initialWeightGrams || 1000), 0) / 100
    ) / 10;

  const avgSensory = scoredCount > 0 ? Math.round((sensorySum / scoredCount) * 10) / 10 : 0;
  const successRate = Math.round((completedCount / batches.length) * 100);

  let mostPopular = 'CHEESE';
  if (counts.VEG_FERMENT > counts.CHEESE && counts.VEG_FERMENT >= counts.KOMBUCHA) {
    mostPopular = 'VEG_FERMENT';
  } else if (counts.KOMBUCHA > counts.CHEESE && counts.KOMBUCHA > counts.VEG_FERMENT) {
    mostPopular = 'KOMBUCHA';
  }

  const popularLabel =
    mostPopular === 'CHEESE'
      ? '🧀 Serowarstwo Zagrodowe'
      : mostPopular === 'VEG_FERMENT'
      ? '🥬 Kiszonki & Kimchi'
      : '🫖 Kombucha & Żywe Octy';

  const motivationalSummaryPl = `Wyprodukowano łącznie ${batches.length} partii (sukces: ${successRate}%). W piwniczce dojrzewa ${activeAgingWheelsCount} krążków (${totalAgingCheeseWeightKg} kg sera). Zaoszczędzono ok. ${Math.round(totalSavings)} PLN względem delikatesów ekologicznych.`;

  const totalMilkProcessedLiters = Math.round(totalMilkLiters * 10) / 10;
  const totalEstimatedSavingsPln = Math.round(totalSavings);

  return {
    totalBatches: batches.length,
    activeBatches: batches.length - completedCount,
    completedBatches: completedCount,
    completedBatchesCount: completedCount,
    successRatePercentage: successRate,
    successRatePct: successRate,
    batchesByCategory: counts,
    cheeseBatches: counts.CHEESE,
    vegBatches: counts.VEG_FERMENT,
    bevBatches: counts.KOMBUCHA,
    totalMilkProcessedLiters,
    totalMilkVolumeL: totalMilkProcessedLiters,
    totalCheeseWheels,
    activeAgingWheelsCount,
    activeCaveWheels: activeAgingWheelsCount,
    totalAgingCheeseWeightKg,
    totalCaveWeightKg: totalAgingCheeseWeightKg,
    averageSensoryScore: avgSensory,
    avgSensoryScore: avgSensory,
    scoredBatchesCount: scoredCount,
    evaluatedCount: scoredCount,
    sensoryScoreDistribution: distribution,
    totalEstimatedSavingsPln,
    estimatedTotalSavingsPln: totalEstimatedSavingsPln,
    mostPopularCraftType: popularLabel,
    hasEnoughData: batches.length >= 2,
    motivationalSummaryPl,
  };
}
