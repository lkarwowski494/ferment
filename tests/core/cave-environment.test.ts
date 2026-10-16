// ============================================================================
// Apps4Brew Studio — Tests for Cave Environment & Affinage Engine
// ============================================================================

import {
  analyzeCaveEnvironment,
  getAffinageSchedule,
} from '../../src/core/cave-environment';

describe('Cave Environment & Psychrometric VPD Engine', () => {
  it('correctly calculates optimal environment at 12C and 85% RH', () => {
    const res = analyzeCaveEnvironment({
      tempCelsius: 12,
      relativeHumidityPct: 85,
      caveType: 'HARD_GOUDA_CHEDDAR',
    });

    expect(res.status).toBe('OPTIMAL');
    expect(res.isCaseHardeningImminent).toBe(false);
    expect(res.isCondensationRisk).toBe(false);
    expect(res.vaporPressureDeficitKpa).toBeGreaterThan(0.1);
    expect(res.vaporPressureDeficitKpa).toBeLessThan(0.3);
    expect(res.dewPointCelsius).toBeLessThan(12);
  });

  it('triggers Case Hardening warning when air is too dry (RH 65%)', () => {
    const res = analyzeCaveEnvironment({
      tempCelsius: 12,
      relativeHumidityPct: 65,
      caveType: 'HARD_GOUDA_CHEDDAR',
    });

    expect(res.status).toBe('CASE_HARDENING_WARNING');
    expect(res.isCaseHardeningImminent).toBe(true);
    expect(res.environmentalNotes).toContain('Case Hardening');
  });

  it('triggers condensation warning when air is near saturation (RH 98%)', () => {
    const res = analyzeCaveEnvironment({
      tempCelsius: 12,
      relativeHumidityPct: 98,
      caveType: 'HARD_GOUDA_CHEDDAR',
    });

    expect(res.status).toBe('CONDENSATION_MOLD_RISK');
    expect(res.isCondensationRisk).toBe(true);
  });

  it('returns valid affinage schedules for hard cheese and washed rind', () => {
    const hardSched = getAffinageSchedule('HARD_GOUDA_CHEDDAR');
    expect(hardSched.length).toBeGreaterThanOrEqual(4);
    expect(hardSched.some((s) => s.recommendedAction === 'TURN')).toBe(true);
    expect(hardSched.some((s) => s.recommendedAction === 'WAX_COATING')).toBe(true);

    const washedSched = getAffinageSchedule('WASHED_RIND_LINENS');
    expect(washedSched.some((s) => s.recommendedAction === 'WASH_BRINE')).toBe(true);
  });
});
