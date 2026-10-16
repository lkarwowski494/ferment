// ============================================================================
// Apps4Brew Studio — Tests for Sensory Evaluation Engine
// ============================================================================

import { evaluateSensoryProfile } from '../../src/core/sensory-evaluation';

describe('Sensory Evaluation Engine', () => {
  it('awards high score to well-balanced artisan cheese', () => {
    const res = evaluateSensoryProfile('CHEESE', {
      acidity: 5,
      salinity: 5,
      firmness: 8,
      creaminess: 8,
      pungency: 2,
      nuttiness: 8,
    });

    expect(res.overallScore).toBeGreaterThanOrEqual(90);
    expect(res.grade).toBe('EXEMPLARY');
    expect(res.identifiedFlaws).toHaveLength(0);
  });

  it('penalizes over-salted and over-acidified cheese with remediation tips', () => {
    const res = evaluateSensoryProfile('CHEESE', {
      acidity: 9, // +2 over 7
      salinity: 9, // +2 over 7
      firmness: 5,
      creaminess: 4,
      pungency: 3,
      nuttiness: 3,
    });

    expect(res.overallScore).toBeLessThan(75);
    expect(res.identifiedFlaws).toContain('Nadmierna kwasowość (posmak kredowy/twarogowy w serze twardym).');
    expect(res.identifiedFlaws).toContain('Przesolony miąższ.');
    expect(res.craftRecommendations.some((r) => r.includes('solance'))).toBe(true);
  });

  it('detects soft soggy fermented vegetables and suggests tannin boost', () => {
    const res = evaluateSensoryProfile('VEG_FERMENT', {
      acidity: 6,
      salinity: 5,
      firmness: 2, // soggy
      creaminess: 1,
      pungency: 3,
      nuttiness: 1,
    });

    expect(res.overallScore).toBeLessThan(85);
    expect(res.identifiedFlaws.some((f) => f.includes('kapciowate'))).toBe(true);
    expect(res.craftRecommendations.some((r) => r.includes('dębu'))).toBe(true);
  });
});
