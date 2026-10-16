import { calculateBrineDiffusion } from '../../src/core/brine-diffusion';

describe('Salt Diffusion & Brining Penetration Time Engine (Fickian Mass Transfer)', () => {
  it('calculates optimal brining time and core equilibration for standard Gouda wheel', () => {
    const result = calculateBrineDiffusion({
      wheelWeightKg: 1.2,
      diameterCm: 15,
      heightCm: 6.5,
      brineSalinityPct: 20,
      brineTempC: 12,
      targetSaltInCheesePct: 1.8,
    });

    expect(result.recommendedBriningHours).toBeGreaterThan(7);
    expect(result.recommendedBriningHours).toBeLessThan(15);
    expect(result.totalSaltAbsorbedGrams).toBeCloseTo(21.6, 1);
    expect(result.distanceToCoreCm).toBe(3.25);
    expect(result.diffusionCoefficientCm2PerDay).toBeGreaterThan(0.2);
    expect(result.daysToCoreEquilibration).toBeGreaterThan(5);
    expect(result.daysToCoreEquilibration).toBeLessThan(20);
    expect(result.safetyWarningsPl.length).toBe(0);
    expect(result.equilibrationSchedulePl).toContain('dni');
  });

  it('demonstrates that a tall cylinder wheel requires significantly longer core equilibration than a flat disc', () => {
    // Flat disc (height 4 cm, diameter 22 cm, 2 kg)
    const flatDisc = calculateBrineDiffusion({
      wheelWeightKg: 2.0,
      diameterCm: 22,
      heightCm: 4.0,
      brineSalinityPct: 20,
    });

    // Tall cylinder (height 12 cm, diameter 14 cm, 2 kg)
    const tallCylinder = calculateBrineDiffusion({
      wheelWeightKg: 2.0,
      diameterCm: 14,
      heightCm: 12.0,
      brineSalinityPct: 20,
    });

    expect(tallCylinder.distanceToCoreCm).toBeGreaterThan(flatDisc.distanceToCoreCm);
    expect(tallCylinder.daysToCoreEquilibration).toBeGreaterThan(flatDisc.daysToCoreEquilibration * 3);
    expect(tallCylinder.recommendedBriningHours).toBeGreaterThan(flatDisc.recommendedBriningHours);
  });

  it('generates safety alert for under-saline brine (<16%) risking slimy rind', () => {
    const result = calculateBrineDiffusion({
      wheelWeightKg: 1.0,
      diameterCm: 14,
      heightCm: 6.0,
      brineSalinityPct: 14,
    });

    expect(result.safetyWarningsPl.some((w) => w.includes('ZBYT NISKIE ZASOLENIE'))).toBe(true);
  });

  it('generates safety alert for warm brine (>15°C)', () => {
    const result = calculateBrineDiffusion({
      wheelWeightKg: 1.0,
      diameterCm: 14,
      heightCm: 6.0,
      brineSalinityPct: 20,
      brineTempC: 18,
    });

    expect(result.safetyWarningsPl.some((w) => w.includes('PODWYŻSZONA TEMPERATURA'))).toBe(true);
  });

  it('throws error for invalid zero or negative dimensions', () => {
    expect(() =>
      calculateBrineDiffusion({
        wheelWeightKg: 0,
        diameterCm: 15,
        heightCm: 6.0,
        brineSalinityPct: 20,
      })
    ).toThrow('większe od 0');
  });
});
