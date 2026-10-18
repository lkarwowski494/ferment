// ============================================================================
// Apps4Brew Studio — SEROWAR iOS Widget & Live Activity Timeline Provider
// Formats structured timelines for iOS Lock Screen widgets, Home widgets,
// and Dynamic Island ActivityKit notifications.
// ============================================================================

export interface CaveWidgetInput {
  temperatureCelsius: number;
  relativeHumidityPct: number;
  dewPointCelsius: number;
  isCondensationRisk: boolean;
  activeWheelsCount: number;
  wheelsToTurnToday: number;
  caveName?: string;
}

export interface LockscreenWidgetData {
  primaryTitle: string;
  metricLine: string;
  dewPointMargin: string;
  statusBadge: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  statusLabel: string;
  pendingTasksText: string;
  renderedAtIso: string;
}

export interface LiveActivityTimerInput {
  batchId: string;
  cheeseName: string;
  stepName: string;
  startAtMs: number;
  endAtMs: number;
  nowMs?: number;
  isPaused?: boolean;
}

export interface LiveActivityState {
  activityId: string;
  title: string;
  stepDescription: string;
  progressFraction: number; // 0.0 to 1.0
  remainingSeconds: number;
  timeFormatted: string;
  isComplete: boolean;
  statusText: string;
}

/**
 * Generates data structure for iOS Lock Screen and Home Screen widgets.
 */
export function generateCaveLockscreenWidgetData(
  input: CaveWidgetInput,
  nowIso: string = new Date().toISOString()
): LockscreenWidgetData {
  const temp = input.temperatureCelsius.toFixed(1);
  const rh = Math.round(input.relativeHumidityPct);
  const dewMargin = (input.temperatureCelsius - input.dewPointCelsius).toFixed(1);

  let statusBadge: LockscreenWidgetData['statusBadge'] = 'OPTIMAL';
  let statusLabel = 'Mikroklimat stabilny';

  if (input.isCondensationRisk) {
    statusBadge = 'CRITICAL';
    statusLabel = 'ALARM: Ryzyko rosy!';
  } else if (input.relativeHumidityPct < 75 || input.relativeHumidityPct > 92) {
    statusBadge = 'WARNING';
    statusLabel = 'Wilgotność poza normą';
  }

  const pendingText = input.wheelsToTurnToday > 0
    ? `${input.wheelsToTurnToday} do obrócenia`
    : 'Wszystkie obrócone';

  return {
    primaryTitle: input.caveName || 'Dojrzewalnia',
    metricLine: `${temp}°C · ${rh}% RH`,
    dewPointMargin: `ΔTdp +${dewMargin}°C`,
    statusBadge,
    statusLabel,
    pendingTasksText: pendingText,
    renderedAtIso: nowIso,
  };
}

/**
 * Generates Dynamic Island / Live Activity real-time state for crafting steps.
 */
export function generateLiveActivityTimerData(
  input: LiveActivityTimerInput
): LiveActivityState {
  const now = input.nowMs || Date.now();
  const totalMs = Math.max(1000, input.endAtMs - input.startAtMs);
  const remainingMs = Math.max(0, input.endAtMs - now);
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  const progressFraction = Math.min(1.0, Math.max(0.0, 1.0 - (remainingMs / totalMs)));

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const isComplete = remainingSeconds === 0;
  const statusText = isComplete
    ? 'Czas minął!'
    : input.isPaused
    ? 'Wstrzymany'
    : 'W toku...';

  return {
    activityId: `activity-${input.batchId}`,
    title: `${input.cheeseName} — ${input.stepName}`,
    stepDescription: isComplete ? 'Wykonaj cięcie / obrót skrzepu' : `Pozostało ${timeFormatted}`,
    progressFraction: Math.round(progressFraction * 100) / 100,
    remainingSeconds,
    timeFormatted,
    isComplete,
    statusText,
  };
}
