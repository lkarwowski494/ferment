import {
  remainingTimerSec,
  startTimerWithEndAt,
  pauseTimerWithEndAt,
  resumeTimerWithEndAt,
  tickTimerWithEndAt,
} from '../../src/lib/resilient-timer';

describe('Background-Resilient Timer Engine (RD-ENG-06, NFR-PERF-004)', () => {
  it('correctly calculates remaining seconds using RD-ENG-06 test vectors', () => {
    // Vector 1: Start 180s at 10:00:00, wake at 10:02:15 -> 45s
    const t0 = new Date('2026-10-17T10:00:00Z').getTime();
    const tEnd180 = t0 + 180 * 1000;
    const tWake1 = new Date('2026-10-17T10:02:15Z').getTime();
    expect(remainingTimerSec(tEnd180, tWake1)).toBe(45);

    // Vector 2: Start 60s at 10:00:00, wake at 10:05:00 -> 0s
    const tEnd60 = t0 + 60 * 1000;
    const tWake2 = new Date('2026-10-17T10:05:00Z').getTime();
    expect(remainingTimerSec(tEnd60, tWake2)).toBe(0);
  });

  it('handles pause, resume and tick transitions after background sleep', () => {
    const t0 = 1000000;
    let timer = startTimerWithEndAt(100, t0);
    expect(timer.isRunning).toBe(true);

    // Sleep 40s in background
    timer = tickTimerWithEndAt(timer, t0 + 40000);
    expect(timer.isRunning).toBe(true);
    expect(remainingTimerSec(timer.endAtMs!, t0 + 40000)).toBe(60);

    // Pause at 40s
    timer = pauseTimerWithEndAt(timer, t0 + 40000);
    expect(timer.isRunning).toBe(false);
    expect(timer.pausedRemainingSec).toBe(60);

    // Sleep while paused
    const tResume = t0 + 100000;
    timer = resumeTimerWithEndAt(timer, tResume);
    expect(timer.isRunning).toBe(true);
    expect(remainingTimerSec(timer.endAtMs!, tResume)).toBe(60);

    // Complete timer after remaining 60s
    timer = tickTimerWithEndAt(timer, tResume + 65000);
    expect(timer.isRunning).toBe(false);
    expect(timer.isCompleted).toBe(true);
  });
});
