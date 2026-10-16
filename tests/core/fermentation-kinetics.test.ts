// ============================================================================
// Apps4Brew Studio — Tests for Fermentation Kinetics & Vinegar Acidity
// ============================================================================

import {
  evaluateLabFermentation,
  calculateVinegarTitration,
} from '../../src/core/fermentation-kinetics';

describe('Fermentation Kinetics & Vinegar Acidity Engine', () => {
  it('identifies safe optimal fermentation when pH drops below 4.60 within 48h', () => {
    const res = evaluateLabFermentation(48, 4.3);
    expect(res.status).toBe('OPTIMAL');
    expect(res.isBotulinumSafe).toBe(true);
    expect(res.isAcidificationOnTrack).toBe(true);
  });

  it('triggers slow risk when pH is still > 5.0 after 48h', () => {
    const res = evaluateLabFermentation(48, 5.4);
    expect(res.status).toBe('SLOW_RISK');
    expect(res.isBotulinumSafe).toBe(false);
    expect(res.isAcidificationOnTrack).toBe(false);
  });

  it('triggers critical hazard when pH is above 4.60 after 72h', () => {
    const res = evaluateLabFermentation(80, 4.9);
    expect(res.status).toBe('CRITICAL_HAZARD');
    expect(res.isBotulinumSafe).toBe(false);
    expect(res.message).toContain('ZAGROŻENIE BIOLOGICZNE');
  });

  it('calculates vinegar titratable acidity accurately for 1 ml sample', () => {
    // 1 ml sample, 8.5 ml of 0.1 M NaOH
    // Acetic acid = (8.5 * 0.0060052 / 1) * 100 = 5.10%
    const res = calculateVinegarTitration(1, 8.5);
    expect(res.aceticAcidPercentage).toBeCloseTo(5.1, 1);
    expect(res.isFoodGradeSafe).toBe(true);
    expect(res.classification).toBe('TABLE_VINEGAR');
  });

  it('detects sub-standard vinegar acidity when titratable acidity is below 5.0%', () => {
    // 1 ml sample, 6.0 ml NaOH => 3.6%
    const res = calculateVinegarTitration(1, 6.0);
    expect(res.aceticAcidPercentage).toBe(3.6);
    expect(res.isFoodGradeSafe).toBe(false);
    expect(res.classification).toBe('SUB_STANDARD');
  });
});
