import {
  calculateRennetDose,
  convertRennetRatioToImcu,
  calculateCacl2Dose,
  calculateFlocculationCutTime,
  calculatePressPressure,
  calculatePressWeightNeeded,
  calculateBrineComposition,
  calculateBrineTimeHours,
  calculateCurdCookingMinTime,
} from '../../src/core/cheese-engine';

describe('SEROWAR Cheese Engine (RD-01…RD-25)', () => {
  it('RD-01: calculates rennet dose in IMCU with test vector (20L, 35 IMCU/L, 200 IMCU/ml)', () => {
    const res = calculateRennetDose(20, 35, 200);
    expect(res.volumeMl).toBe(3.5);
    expect(res.drops).toBe(70);
    expect(res.imcuTotal).toBe(700);
  });

  it('RD-02: converts traditional rennet ratio to IMCU (1:15 000 -> 195 IMCU/ml)', () => {
    const imcu = convertRennetRatioToImcu(15000);
    expect(imcu).toBe(195.0);
  });

  it('RD-03: calculates CaCl2 supplementation for pasteurized milk (15L -> 3.0g dry, 7.0ml 33% solution)', () => {
    const res = calculateCacl2Dose(15, 'STORE_MICROFILTERED');
    expect(res.dryGrams).toBe(3.0);
    expect(res.solution33PercentMl).toBe(7.0);
    expect(res.warning).toBeUndefined();
  });

  it('RD-04: calculates flocculation multiplier time (tf = 12 min, multiplier = 4.5 -> wait 42 min)', () => {
    const tfSeconds = 12 * 60; // 720 s
    const res = calculateFlocculationCutTime(tfSeconds, 4.5);
    expect(res.totalCoagulationSeconds).toBe(54 * 60);
    expect(res.remainingSecondsAfterFloc).toBe(42 * 60);
    expect(res.warning).toBeUndefined();
  });

  it('RD-05: calculates pressing pressure and required weight correctly', () => {
    // 16 cm diameter form -> r = 8 cm -> Area ≈ 201.06 cm2
    // 10 kg weight, lever 3.5 -> force 35 kg -> P ≈ 0.174 kg/cm2
    const res = calculatePressPressure(10, 16, 3.5);
    expect(res.surfaceAreaCm2).toBeCloseTo(201.1, 1);
    expect(res.pressureKgCm2).toBeCloseTo(0.174, 3);
    expect(res.pressurePsi).toBeCloseTo(2.48, 2);

    // Reverse weight needed
    const weightNeeded = calculatePressWeightNeeded(0.174, 16, 3.5);
    expect(weightNeeded).toBeCloseTo(10.0, 1);
  });

  it('RD-07: calculates buffered saturated brine composition (10L water, 20% NaCl -> 2.5 kg salt, 15g CaCl2)', () => {
    const res = calculateBrineComposition(10, 20);
    expect(res.saltKg).toBe(2.5);
    expect(res.salinityPct).toBe(20);
    expect(res.cacl2DryGrams).toBe(15.0);
    expect(res.targetPhMin).toBe(5.20);
    expect(res.targetPhMax).toBe(5.40);
  });

  it('RD-08: calculates brining time duration (2 kg Gouda, K=4.5 -> 9.0 hours)', () => {
    const hours = calculateBrineTimeHours(2.0, 4.5, 8.0, 8.0);
    expect(hours).toBe(9.0);
  });

  it('RD-17: Case Hardening Guard — warns if curd cooking ramp is too rapid (< 2 min per 1°C)', () => {
    // 32°C to 38°C -> delta 6°C -> min recommended time = 12 min
    const resSafe = calculateCurdCookingMinTime(32, 38, 14);
    expect(resSafe.minRecommendedDurationMinutes).toBe(12);
    expect(resSafe.isTooFast).toBe(false);
    expect(resSafe.warning).toBeUndefined();

    const resTooFast = calculateCurdCookingMinTime(32, 38, 6);
    expect(resTooFast.isTooFast).toBe(true);
    expect(resTooFast.warning).toContain('Case Hardening');
  });
});
