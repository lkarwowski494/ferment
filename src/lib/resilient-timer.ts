// ============================================================================
// Apps4Brew Studio — FERMENT Background-Resilient Timer Engine
// Calculates remaining seconds from absolute timestamp endAtMs - Date.now()
// Implements RD-ENG-06 and NFR-PERF-004
// ============================================================================

export interface ResilientTimerState {
  durationSec: number;
  endAtMs: number | null;
  pausedRemainingSec: number | null;
  isRunning: boolean;
  isCompleted: boolean;
}

/**
 * RD-ENG-06: Oblicza pozostałe sekundy timera ze znacznika końca endAtMs i bieżącej chwili nowMs
 */
export function remainingTimerSec(endAtMs: number, nowMs: number = Date.now()): number {
  if (nowMs >= endAtMs) return 0;
  return Math.max(0, Math.ceil((endAtMs - nowMs) / 1000));
}

/**
 * Uruchamia timer na durationSec sekund w chwili startMs
 */
export function startTimerWithEndAt(durationSec: number, startMs: number = Date.now()): ResilientTimerState {
  const endAtMs = startMs + durationSec * 1000;
  return {
    durationSec,
    endAtMs,
    pausedRemainingSec: null,
    isRunning: true,
    isCompleted: false,
  };
}

/**
 * Wstrzymuje timer w chwili pauseMs
 */
export function pauseTimerWithEndAt(timer: ResilientTimerState, pauseMs: number = Date.now()): ResilientTimerState {
  if (!timer.isRunning || !timer.endAtMs) return timer;
  const rem = remainingTimerSec(timer.endAtMs, pauseMs);
  return {
    ...timer,
    endAtMs: null,
    pausedRemainingSec: rem,
    isRunning: false,
    isCompleted: rem <= 0,
  };
}

/**
 * Wznawia wstrzymany timer w chwili resumeMs
 */
export function resumeTimerWithEndAt(timer: ResilientTimerState, resumeMs: number = Date.now()): ResilientTimerState {
  if (timer.isRunning || timer.pausedRemainingSec === null) return timer;
  const rem = timer.pausedRemainingSec;
  if (rem <= 0) {
    return {
      ...timer,
      isRunning: false,
      isCompleted: true,
    };
  }
  const endAtMs = resumeMs + rem * 1000;
  return {
    ...timer,
    endAtMs,
    pausedRemainingSec: null,
    isRunning: true,
    isCompleted: false,
  };
}

/**
 * Sprawdza stan timera w dowolnej chwili nowMs (np. po AppState -> 'active')
 */
export function tickTimerWithEndAt(timer: ResilientTimerState, nowMs: number = Date.now()): ResilientTimerState {
  if (!timer.isRunning || !timer.endAtMs) return timer;
  const rem = remainingTimerSec(timer.endAtMs, nowMs);
  if (rem <= 0) {
    return {
      ...timer,
      endAtMs: null,
      pausedRemainingSec: 0,
      isRunning: false,
      isCompleted: true,
    };
  }
  return timer;
}
