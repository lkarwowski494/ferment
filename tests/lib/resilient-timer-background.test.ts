// ============================================================================
// Apps4Brew Studio — Tests for Background Timer Continuity (GAP-RESIL-01)
// Simulates backgrounding, screen sleep, and time jumps (Zero Lost Time)
// ============================================================================

import {
  startTimerWithEndAt,
  tickTimerWithEndAt,
  pauseTimerWithEndAt,
  resumeTimerWithEndAt,
  remainingTimerSec,
} from '../../src/lib/resilient-timer';

describe('Background-Resilient Timer Engine (RD-ENG-06, GAP-RESIL-01)', () => {
  it('correctly calculates remaining time after simulated 15-minute background app sleep', () => {
    const startMs = 1700000000000;
    const durationSec = 1800; // 30 minutes
    const timer = startTimerWithEndAt(durationSec, startMs);

    expect(timer.isRunning).toBe(true);
    expect(timer.endAtMs).toBe(startMs + 1800 * 1000);

    // App is suspended in background for 900 seconds (15 minutes)
    const afterSleepMs = startMs + 900 * 1000;
    const remaining = remainingTimerSec(timer.endAtMs!, afterSleepMs);

    // Exactly 900 seconds remaining!
    expect(remaining).toBe(900);

    const ticked = tickTimerWithEndAt(timer, afterSleepMs);
    expect(ticked.isRunning).toBe(true);
    expect(ticked.isCompleted).toBe(false);
  });

  it('marks timer as completed if elapsed time exceeds duration during background sleep', () => {
    const startMs = 1700000000000;
    const durationSec = 300; // 5 minutes
    const timer = startTimerWithEndAt(durationSec, startMs);

    // User comes back 10 minutes later (600 seconds)
    const afterSleepMs = startMs + 600 * 1000;
    const remaining = remainingTimerSec(timer.endAtMs!, afterSleepMs);
    expect(remaining).toBe(0);

    const ticked = tickTimerWithEndAt(timer, afterSleepMs);
    expect(ticked.isCompleted).toBe(true);
    expect(ticked.isRunning).toBe(false);
  });

  it('preserves paused remaining time even if clock advances while paused', () => {
    const startMs = 1700000000000;
    const durationSec = 600; // 10 minutes
    const timer = startTimerWithEndAt(durationSec, startMs);

    // Pause after 200 seconds
    const pauseMs = startMs + 200 * 1000;
    const paused = pauseTimerWithEndAt(timer, pauseMs);

    expect(paused.isRunning).toBe(false);
    expect(paused.pausedRemainingSec).toBe(400);

    // 2 hours pass while paused!
    const resumeMs = pauseMs + 7200 * 1000;
    const resumed = resumeTimerWithEndAt(paused, resumeMs);

    expect(resumed.isRunning).toBe(true);
    expect(resumed.endAtMs).toBe(resumeMs + 400 * 1000);

    // Immediately after resume, 400 seconds remain
    expect(remainingTimerSec(resumed.endAtMs!, resumeMs)).toBe(400);
  });
});
