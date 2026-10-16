import {
  calculateFermentationTimeline,
  getTimelineForBatch,
} from '../../src/core/fermentation-timeline';

describe('Fermentation Timeline & Milestone Engine', () => {
  const startedAt = 1770000000000;

  it('calculates baseline timeline for Kimchi at 20°C', () => {
    const result = calculateFermentationTimeline({
      recipeId: 'rec_kimchi_baechu',
      startedAtTimestamp: startedAt,
      ambientTempC: 20,
    });

    expect(result.recipeId).toBe('rec_kimchi_baechu');
    expect(result.speedMultiplier).toBe(1.0);
    expect(result.burpingDays.length).toBeGreaterThanOrEqual(2);
    expect(result.milestones.length).toBeGreaterThan(0);
    expect(result.summaryAdvicePl).toContain('Standardowe tempo');
  });

  it('scales timeline and milestones faster when ambient temperature is elevated (25°C)', () => {
    const result = calculateFermentationTimeline({
      recipeId: 'rec_kimchi_baechu',
      startedAtTimestamp: startedAt,
      ambientTempC: 25,
    });

    // Speed multiplier Q10 = 2.2^(5/10) ~ 1.48
    expect(result.speedMultiplier).toBeGreaterThan(1.3);
    expect(result.adjustedDays).toBeLessThan(result.nominalDays);
    expect(result.summaryAdvicePl).toContain('Przyspieszona');
  });

  it('scales timeline slower in cold environment (15°C)', () => {
    const result = calculateFermentationTimeline({
      recipeId: 'rec_gouda_zagrodowa',
      startedAtTimestamp: startedAt,
      ambientTempC: 15,
    });

    expect(result.speedMultiplier).toBeLessThan(0.8);
    expect(result.adjustedDays).toBeGreaterThan(result.nominalDays);
    expect(result.summaryAdvicePl).toContain('Spowolniona');
  });

  it('throws error when recipe id is invalid', () => {
    expect(() =>
      calculateFermentationTimeline({
        recipeId: 'unknown_recipe',
        startedAtTimestamp: startedAt,
      })
    ).toThrow('Nie znaleziono receptury');
  });

  it('matches batch to canonical timeline using getTimelineForBatch', () => {
    const batch = {
      category: 'VEG_FERMENT',
      styleName: 'Tradycyjne Kimchi',
      createdAt: startedAt,
    };
    const timeline = getTimelineForBatch(batch, 22);
    expect(timeline.recipeId).toBe('rec_kimchi_baechu');
    expect(timeline.burpingDays.length).toBeGreaterThan(0);
    expect(timeline.milestones.length).toBeGreaterThan(0);
  });
});
