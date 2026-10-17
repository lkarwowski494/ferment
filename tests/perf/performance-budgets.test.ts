// ============================================================================
// Apps4Brew Studio — Performance Budgets & Stress Tests (GAP-PERF-01, W9/PERF)
// Budgets: 5k trajectory logs < 50ms, 1k batches filtering < 30ms, CSV export < 40ms
// ============================================================================

import { analyzeShrinkageTrajectory } from '../../src/core/cave-log-actions';
import { generateBatchesCsv } from '../../src/lib/csv-export';
import { Batch } from '../../src/data/db';

describe('CPU Performance Budgets & Large Data Stress (GAP-PERF-01, W9/PERF)', () => {
  it('PERF-01: shrinkage trajectory computation for 5,000 logs executes under 50ms', () => {
    const createdTimestamp = 1700000000000;
    const count = 5000;
    const logs = new Array(count);

    for (let i = 0; i < count; i++) {
      logs[i] = {
        loggedAt: createdTimestamp + (i + 1) * 3600 * 1000,
        weightGrams: 1000 - (i * 0.02), // Gradual drying
      };
    }

    const t0 = performance.now();
    const result = analyzeShrinkageTrajectory(1000, logs, createdTimestamp);
    const durationMs = performance.now() - t0;

    expect(result.totalShrinkagePct).toBeGreaterThan(0);
    expect(result.averageDailyRatePct).toBeGreaterThanOrEqual(0);
    expect(durationMs).toBeLessThan(50); // Hard CPU budget: < 50ms
  });

  it('PERF-02: filtering and sorting 1,000 artisan batches executes under 30ms', () => {
    const count = 1000;
    const categories: Batch['category'][] = ['CHEESE', 'HARD_CHEESE', 'VEG_FERMENT', 'KOMBUCHA', 'VINEGAR'];
    const statuses: Batch['status'][] = ['PREPARING', 'AGING', 'COMPLETED', 'DISCARDED'];

    const batches: Batch[] = new Array(count);
    for (let i = 0; i < count; i++) {
      batches[i] = {
        id: `batch_${i}`,
        batchNumber: `GOU-${(1000 + i).toString()}`,
        category: categories[i % categories.length],
        styleName: `Styl Serowarski #${i}`,
        createdAt: 1700000000000 + i * 60000,
        status: statuses[i % statuses.length],
        notes: `Notatka produkcyjna partii ${i}`,
      };
    }

    const t0 = performance.now();
    // Simulate user filtering by category 'CHEESE' and sorting by createdAt DESC
    const filtered = batches
      .filter((b) => b.category === 'CHEESE' && b.status === 'AGING')
      .sort((a, b) => b.createdAt - a.createdAt);

    const durationMs = performance.now() - t0;

    expect(filtered.length).toBeGreaterThan(0);
    expect(durationMs).toBeLessThan(30); // Hard CPU budget: < 30ms
  });

  it('PERF-03: RFC 4180 CSV export generation for 1,000 batches executes under 40ms', () => {
    const count = 1000;
    const batches: Batch[] = new Array(count);
    for (let i = 0; i < count; i++) {
      batches[i] = {
        id: `batch_${i}`,
        batchNumber: `BATCH-NO-${i}`,
        category: 'CHEESE',
        styleName: `Gouda Zagrodowa #${i}`,
        createdAt: 1700000000000 + i * 3600000,
        status: 'AGING',
        notes: 'Uwaga, skóra naturalna, obrót co 2 dni',
      };
    }

    const t0 = performance.now();
    const csv = generateBatchesCsv(batches);
    const durationMs = performance.now() - t0;

    expect(csv.length).toBeGreaterThan(10000);
    expect(durationMs).toBeLessThan(40); // Hard CPU budget: < 40ms
  });
});
