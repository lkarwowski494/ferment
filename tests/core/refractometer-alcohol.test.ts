// ============================================================================
// Apps4Brew Studio — FERMENT Refractometer & Alcohol Engine Tests
// ============================================================================

import {
  brixToSg,
  analyzeRefractometerBrix,
} from '../../src/core/refractometer-alcohol';

describe('FERMENT Optical Refractometer & Alcohol Engine', () => {
  it('converts unfermented Brix to Specific Gravity', () => {
    expect(brixToSg(0)).toBe(1.000);
    expect(brixToSg(10)).toBeCloseTo(1.040, 2);
    expect(brixToSg(12)).toBeCloseTo(1.048, 2);
    expect(brixToSg(20)).toBeCloseTo(1.083, 2);
  });

  it('corrects optical refractometer distortion for fermented cider into vinegar base', () => {
    // Apple cider: Original Brix 12.0°Bx (~1.048 SG). Current reading 5.5°Bx.
    // Alcohol presence distorts reading; true SG is around 1.006, ABV ~5.5%
    const res = analyzeRefractometerBrix({
      originalBrix: 12.0,
      currentBrix: 5.5,
      purpose: 'VINEGAR_CIDER',
    });

    expect(res.originalSg).toBe(1.048);
    expect(res.correctedFinalSg).toBeLessThan(1.015);
    expect(res.correctedFinalSg).toBeGreaterThan(1.000);
    expect(res.abvPct).toBeGreaterThanOrEqual(4.5);
    expect(res.abvPct).toBeLessThanOrEqual(6.5);
    expect(res.isVinegarSafe).toBe(true);
    expect(res.classification).toContain('Idealny Wsad Octowy');
  });

  it('warns about alcohol toxicity for Acetobacter when ABV > 8%', () => {
    // High sugar fruit must: Original Brix 22.0°Bx, Current Brix 7.0°Bx -> ABV ~10%
    const res = analyzeRefractometerBrix({
      originalBrix: 22.0,
      currentBrix: 7.0,
      purpose: 'VINEGAR_CIDER',
    });

    expect(res.abvPct).toBeGreaterThan(8.0);
    expect(res.isVinegarSafe).toBe(false);
    expect(res.warnings.some((w) => w.includes('KRYTYCZNE ZAGROŻENIE DLA MATKI OCTOWEJ'))).toBe(true);
    expect(res.recommendation).toContain('Rozcieńcz nastaw');
  });

  it('evaluates non-alcoholic status in kombucha 2F', () => {
    // Kombucha 1F: Original Brix 6.0°Bx (sweetened tea). Current 5.8°Bx -> minor fermentation (<0.5% ABV)
    const nonAlcoholic = analyzeRefractometerBrix({
      originalBrix: 6.0,
      currentBrix: 5.8,
      purpose: 'KOMBUCHA',
    });

    expect(nonAlcoholic.abvPct).toBeLessThanOrEqual(0.5);
    expect(nonAlcoholic.isNonAlcoholicKombucha).toBe(true);
    expect(nonAlcoholic.classification).toContain('Kombucha Bezalkoholowa');

    // Kombucha with fruit juice: Original 9.0°Bx, current 5.5°Bx -> ABV > 1.2%
    const boozy = analyzeRefractometerBrix({
      originalBrix: 9.0,
      currentBrix: 5.5,
      purpose: 'KOMBUCHA',
    });

    expect(boozy.abvPct).toBeGreaterThan(1.2);
    expect(boozy.isNonAlcoholicKombucha).toBe(false);
    expect(boozy.warnings.some((w) => w.includes('Podwyższone stężenie alkoholu'))).toBe(true);
  });

  it('validates physical constraints', () => {
    expect(() =>
      analyzeRefractometerBrix({
        originalBrix: 0,
        currentBrix: 5.0,
        purpose: 'KOMBUCHA',
      })
    ).toThrow();

    expect(() =>
      analyzeRefractometerBrix({
        originalBrix: 10,
        currentBrix: -1,
        purpose: 'KOMBUCHA',
      })
    ).toThrow();
  });
});
