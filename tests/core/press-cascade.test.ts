// ============================================================================
// Apps4Brew Studio — Tests for Dutch Lever Press & Cascaded Pressing
// ============================================================================

import {
  calculateDutchLeverPress,
  generatePressingCascadeProgram,
} from '../../src/core/press-cascade';

describe('Dutch Lever Press & Pressing Cascade', () => {
  it('calculates mechanical advantage and tare force correctly', () => {
    // Arm length 60 cm, mold distance 20 cm => ratio = 3.0
    // Arm self weight = 2.0 kg => center of gravity at 30 cm
    // Tare force = 2.0 * 30 / 20 = 3.0 kg
    // Hung weight = 5.0 kg => weight force = 5.0 * 3.0 = 15.0 kg
    // Total force = 18.0 kg
    const res = calculateDutchLeverPress({
      armTotalLengthCm: 60,
      moldDistanceCm: 20,
      armSelfWeightKg: 2.0,
      weightHungKg: 5.0,
      moldDiameterCm: 14,
    });

    expect(res.mechanicalAdvantageRatio).toBe(3.0);
    expect(res.tareForceFromArmKg).toBe(3.0);
    expect(res.weightForceKg).toBe(15.0);
    expect(res.totalAppliedForceKg).toBe(18.0);
    expect(res.moldSurfaceAreaCm2).toBeCloseTo(153.9, 0);
    expect(res.pressurePsi).toBeGreaterThan(1.0);
  });

  it('generates a 3-stage pressing program with increasing force and flips', () => {
    const prog = generatePressingCascadeProgram('Gouda Zagrodowa', 1.5, 14);

    expect(prog.stages).toHaveLength(3);
    expect(prog.stages[0].targetForceKg).toBeLessThan(prog.stages[1].targetForceKg);
    expect(prog.stages[1].targetForceKg).toBeLessThan(prog.stages[2].targetForceKg);
    expect(prog.stages[1].isFlipRequired).toBe(true);
    expect(prog.stages[2].isFlipRequired).toBe(true);
    expect(prog.rindEntrapmentWarning).toContain('NIGDY');
    expect(prog.totalPressingMinutes).toBe(885);
  });
});
