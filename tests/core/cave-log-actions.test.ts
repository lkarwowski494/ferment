// ============================================================================
// Apps4Brew Studio — Tests for Cave Log Actions & Shrinkage Tracker (GAP-LOG-03)
// ============================================================================

import {
  recordAffinageAction,
  analyzeShrinkageTrajectory,
} from '../../src/core/cave-log-actions';
import { CaveCheeseWheel } from '../../src/data/db';

describe('Cave Log Actions & Shrinkage Engine (RD-CAVE-01..03)', () => {
  const mockWheel: CaveCheeseWheel = {
    id: 'wheel_1',
    batchId: 'batch_1',
    wheelTag: 'GOUDA-01',
    locationInCave: 'Półka Świerkowa A-1',
    initialWeightGrams: 1000,
    currentWeightGrams: 1000,
    rindType: 'NATURAL',
    targetAgingDays: 90,
    shrinkagePct: 0,
  };

  it('updates wheel state and records TURN action log', () => {
    const timestamp = 1700000000000;
    const res = recordAffinageAction(mockWheel, 'TURN', undefined, 'Obrót poranny', timestamp);

    expect(res.updatedWheel.lastTurnedAt).toBe(timestamp);
    expect(res.updatedWheel.currentWeightGrams).toBe(1000);
    expect(res.actionLog.actionType).toBe('TURN');
    expect(res.actionLog.wheelId).toBe('wheel_1');
    expect(res.actionLog.notes).toBe('Obrót poranny');
  });

  it('updates timestamp on WASH_BRINE and DRY_BRUSH actions', () => {
    const timestamp = 1700000000000;
    const washRes = recordAffinageAction(mockWheel, 'WASH_BRINE', undefined, 'Mycie solanką 3%', timestamp);
    expect(washRes.updatedWheel.lastWashedAt).toBe(timestamp);

    const brushRes = recordAffinageAction(mockWheel, 'DRY_BRUSH', undefined, 'Szczotkowanie pleśni', timestamp + 1000);
    expect(brushRes.updatedWheel.lastBrushedAt).toBe(timestamp + 1000);
  });

  it('calculates shrinkage delta and updates weight on WEIGH action', () => {
    const res = recordAffinageAction(mockWheel, 'WEIGH', 920);

    expect(res.updatedWheel.currentWeightGrams).toBe(920);
    expect(res.updatedWheel.shrinkagePct).toBe(8.0);
    expect(res.shrinkageDeltaPct).toBe(8.0);
    expect(res.actionLog.weightGrams).toBe(920);
  });

  it('handles weight gain (moisture absorption) without negative shrinkagePct', () => {
    // Wheel absorbs moisture or brine wash
    const res = recordAffinageAction(mockWheel, 'WEIGH', 1050);

    expect(res.updatedWheel.currentWeightGrams).toBe(1050);
    expect(res.updatedWheel.shrinkagePct).toBe(0); // Clamped to min 0
    expect(res.actionLog.weightGrams).toBe(1050);
  });

  it('triggers alert if total shrinkage exceeds 20%', () => {
    const res = recordAffinageAction(mockWheel, 'WEIGH', 780);

    expect(res.updatedWheel.shrinkagePct).toBe(22.0);
    expect(res.alert).toBeDefined();
    expect(res.alert).toContain('20%');
  });

  it('handles empty logs in analyzeShrinkageTrajectory gracefully', () => {
    const analysis = analyzeShrinkageTrajectory(1000, [], Date.now() - 5 * 86400000);
    expect(analysis.totalShrinkagePct).toBe(0);
    expect(analysis.averageDailyRatePct).toBe(0);
    expect(analysis.isDesiccationRisk).toBe(false);
    expect(analysis.isRetentionRisk).toBe(false);
    expect(analysis.assessment).toContain('Brak zarejestrowanych ważeń');
  });

  it('analyzes shrinkage trajectory and detects rapid desiccation', () => {
    const created = Date.now() - 10 * 24 * 3600 * 1000; // 10 days ago
    const logs = [
      { loggedAt: created + 5 * 24 * 3600 * 1000, weightGrams: 950 },
      { loggedAt: created + 10 * 24 * 3600 * 1000, weightGrams: 900 }, // 10% in 10 days = 1.0%/day
    ];

    const analysis = analyzeShrinkageTrajectory(1000, logs, created);
    expect(analysis.totalShrinkagePct).toBe(10.0);
    expect(analysis.averageDailyRatePct).toBeCloseTo(1.0, 1);
    expect(analysis.isDesiccationRisk).toBe(true);
    expect(analysis.assessment).toContain('Alarm przesuszenia');
  });

  it('detects moisture retention risk when cheese does not dry after 14 days', () => {
    const created = Date.now() - 20 * 24 * 3600 * 1000; // 20 days ago
    const logs = [
      { loggedAt: created + 10 * 24 * 3600 * 1000, weightGrams: 995 },
      { loggedAt: created + 20 * 24 * 3600 * 1000, weightGrams: 990 }, // only 1% in 20 days = 0.05%/day
    ];

    const analysis = analyzeShrinkageTrajectory(1000, logs, created);
    expect(analysis.totalShrinkagePct).toBe(1.0);
    expect(analysis.isRetentionRisk).toBe(true);
    expect(analysis.assessment).toContain('Słabe odparowanie wody');
  });
});
