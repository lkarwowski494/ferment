// ============================================================================
// Apps4Brew Studio — FERMENT Cave Log Actions & Shrinkage Tracker
// Affinage action logger, shrinkage calculations, daily loss rate & moisture guards
// ============================================================================

import { CaveCheeseWheel, CaveActionLog, CaveActionType } from '../data/db';

export { CaveActionType };

export interface ActionRecordResult {
  updatedWheel: CaveCheeseWheel;
  actionLog: CaveActionLog;
  shrinkageDeltaPct?: number;
  alert?: string;
}

export interface ShrinkageDataPoint {
  loggedAt: number;
  dayInCave: number;
  weightGrams: number;
  shrinkagePct: number;
  dailyRatePct?: number;
}

export interface ShrinkageTrajectoryAnalysis {
  initialWeightGrams: number;
  currentWeightGrams: number;
  totalShrinkagePct: number;
  averageDailyRatePct: number;
  isDesiccationRisk: boolean; // Losing weight too quickly
  isRetentionRisk: boolean;   // Not drying at all
  assessment: string;
}

/**
 * Records an affinage action on a cheese wheel (weigh, turn, wash, brush, wax, clothbound)
 * and produces updated wheel state with audit log.
 */
export function recordAffinageAction(
  wheel: CaveCheeseWheel,
  actionType: CaveActionType,
  newWeightGrams?: number,
  notes?: string,
  nowTimestamp: number = Date.now()
): ActionRecordResult {
  let updatedWeight = wheel.currentWeightGrams;
  let updatedShrinkage = wheel.shrinkagePct;
  let shrinkageDelta: number | undefined;
  let alert: string | undefined;

  if (newWeightGrams !== undefined && newWeightGrams > 0) {
    updatedWeight = Math.round(newWeightGrams * 10) / 10;
    const initial = Math.max(1, wheel.initialWeightGrams);
    const calculatedShrinkage = Math.round(((initial - updatedWeight) / initial) * 1000) / 10;
    shrinkageDelta = Math.round((calculatedShrinkage - wheel.shrinkagePct) * 10) / 10;
    updatedShrinkage = Math.max(0, calculatedShrinkage);

    if (updatedShrinkage > 20) {
      alert = 'UWAGA: Całkowity ubytek wagi przekroczył 20%. Ryzyko przesuszenia miąższu i stwardnienia skórki!';
    }
  }

  const updatedWheel: CaveCheeseWheel = {
    ...wheel,
    currentWeightGrams: updatedWeight,
    shrinkagePct: updatedShrinkage,
    lastTurnedAt: actionType === 'TURN' ? nowTimestamp : wheel.lastTurnedAt,
    lastWashedAt: actionType === 'WASH_BRINE' ? nowTimestamp : wheel.lastWashedAt,
    lastBrushedAt: actionType === 'DRY_BRUSH' ? nowTimestamp : wheel.lastBrushedAt,
  };

  const actionLog: CaveActionLog = {
    id: `action_${nowTimestamp}_${Math.floor(Math.random() * 10000)}`,
    wheelId: wheel.id,
    actionType,
    loggedAt: nowTimestamp,
    weightGrams: newWeightGrams,
    shrinkagePct: updatedShrinkage,
    notes,
  };

  return {
    updatedWheel,
    actionLog,
    shrinkageDeltaPct: shrinkageDelta,
    alert,
  };
}

/**
 * Analyzes sequence of weight logs to evaluate drying trajectory.
 */
export function analyzeShrinkageTrajectory(
  initialWeightGrams: number,
  logs: Array<{ loggedAt: number; weightGrams: number }>,
  createdTimestamp: number
): ShrinkageTrajectoryAnalysis {
  const initial = Math.max(1, initialWeightGrams);
  if (logs.length === 0) {
    return {
      initialWeightGrams: initial,
      currentWeightGrams: initial,
      totalShrinkagePct: 0,
      averageDailyRatePct: 0,
      isDesiccationRisk: false,
      isRetentionRisk: false,
      assessment: 'Brak zarejestrowanych ważeń.',
    };
  }

  const sortedLogs = [...logs].sort((a, b) => a.loggedAt - b.loggedAt);
  const latest = sortedLogs[sortedLogs.length - 1];
  const currentWeight = latest.weightGrams;
  const totalShrinkagePct = Math.round(((initial - currentWeight) / initial) * 1000) / 10;

  const totalDays = Math.max(1, (latest.loggedAt - createdTimestamp) / (1000 * 60 * 60 * 24));
  const averageDailyRate = Math.round((totalShrinkagePct / totalDays) * 100) / 100;

  // Normal loss for hard cheese: 0.1% to 0.35% per day during month 1
  const isDesiccationRisk = averageDailyRate > 0.45;
  const isRetentionRisk = totalDays > 14 && totalShrinkagePct < 2.0;

  let assessment = 'Prawidłowa kinetyka utraty wody.';
  if (isDesiccationRisk) {
    assessment = `Alarm przesuszenia! Średni ubytek ${averageDailyRate}%/dzień jest zbyt gwałtowny. Zwiększ wilgotność w piwniczce.`;
  } else if (isRetentionRisk) {
    assessment = 'Słabe odparowanie wody. Ser może być zbyt wilgotny, co sprzyja rozwojowi gnicia pod skórką.';
  }

  return {
    initialWeightGrams: initial,
    currentWeightGrams: currentWeight,
    totalShrinkagePct,
    averageDailyRatePct: averageDailyRate,
    isDesiccationRisk,
    isRetentionRisk,
    assessment,
  };
}
