import {
  calculateReverseSchedule,
  calculateForwardSchedule,
} from '../../src/core/reverse-scheduler';

describe('FERMENT Reverse Production Scheduler & Anti-Fatigue Timing', () => {
  it('calculates reverse schedule for Gouda ending at Saturday 22:00', () => {
    // 2026-10-17 22:00:00
    const targetDate = new Date('2026-10-17T22:00:00');
    const schedule = calculateReverseSchedule('CHEESE_HARD_GOUDA', targetDate);

    expect(schedule.processType).toBe('CHEESE_HARD_GOUDA');
    expect(schedule.totalDurationMinutes).toBe(930); // 15h 30min total
    expect(schedule.steps.length).toBe(10);
    expect(schedule.completionTime.toISOString()).toBe(targetDate.toISOString());

    // Start time must be 15h 30m earlier = 06:30
    expect(schedule.startTime.getHours()).toBe(6);
    expect(schedule.startTime.getMinutes()).toBe(30);
  });

  it('detects night sleep conflict when an active step falls between 23:00 and 06:00', () => {
    // Finishing at 03:00 AM forces active steps deep in the night
    const badTargetDate = new Date('2026-10-17T03:00:00');
    const schedule = calculateReverseSchedule('CHEESE_PASTA_FILATA_MOZZARELLA', badTargetDate);

    expect(schedule.hasNightConflict).toBe(true);
    expect(schedule.nightConflictWarnings.length).toBeGreaterThan(0);
    expect(schedule.recommendation).toContain('koliduje ze snem');
  });

  it('calculates forward schedule starting from morning 08:00', () => {
    const startDate = new Date('2026-10-17T08:00:00');
    const schedule = calculateForwardSchedule('KIMCHI_TRADITIONAL', startDate);

    expect(schedule.startTime.getHours()).toBe(8);
    expect(schedule.totalDurationMinutes).toBe(390); // 6.5 hours
    expect(schedule.completionTime.getHours()).toBe(14);
    expect(schedule.completionTime.getMinutes()).toBe(30);
  });
});
