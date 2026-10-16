import {
  calculateWheyLevainPlan,
  WheyLevainInput,
} from '../../src/core/whey-levain-engine';

describe('Mother Whey Levain & Starter Propagation Engine (Sierroinnesto)', () => {
  const baseAlpineInput: WheyLevainInput = {
    levainType: 'THERMOPHILIC_ALPINE',
    wheyVolumeMl: 500,
    incubationTempCelsius: 43,
    hoursIncubated: 10,
    generationPassage: 3,
    targetMilkVolumeLiters: 10,
  };

  it('should calculate nominal incubation hours and inoculum dose for Alpine thermophilic starter', () => {
    const plan = calculateWheyLevainPlan(baseAlpineInput);

    expect(plan.levainType).toBe('THERMOPHILIC_ALPINE');
    expect(plan.optimalIncubationHours).toBe(20);
    expect(plan.remainingHours).toBe(10); // 20 - 10
    expect(plan.inoculumRatioPct).toBe(2.5);
    expect(plan.requiredStarterMl).toBe(250); // 2.5% of 10L = 250ml
    expect(plan.targetPhMin).toBe(3.4);
    expect(plan.targetPhMax).toBe(3.65);
    expect(plan.passageHealth.status).toBe('OPTIMAL_VITALITY');
    expect(plan.passageHealth.warning).toBeUndefined();
  });

  it('should scale required starter volume when target milk volume changes', () => {
    const plan50L = calculateWheyLevainPlan({
      ...baseAlpineInput,
      targetMilkVolumeLiters: 50,
    });
    expect(plan50L.requiredStarterMl).toBe(1250); // 2.5% of 50L = 1250ml
  });

  it('should dynamically assess ripeness state based on measured pH', () => {
    // Early stage
    const warming = calculateWheyLevainPlan({
      ...baseAlpineInput,
      currentPh: 4.8,
    });
    expect(warming.currentStatus).toBe('WARMING_UP');
    expect(warming.isReadyForInoculation).toBe(false);

    // Active acidifying
    const active = calculateWheyLevainPlan({
      ...baseAlpineInput,
      currentPh: 3.9,
    });
    expect(active.currentStatus).toBe('ACTIVE_ACIDIFYING');
    expect(active.isReadyForInoculation).toBe(false);

    // Peak ripe (target 3.4 - 3.65)
    const peak = calculateWheyLevainPlan({
      ...baseAlpineInput,
      currentPh: 3.52,
    });
    expect(peak.currentStatus).toBe('PEAK_RIPE');
    expect(peak.isReadyForInoculation).toBe(true);
    expect(peak.statusLabelPl).toContain('GOTOWY');

    // Over-acidified
    const over = calculateWheyLevainPlan({
      ...baseAlpineInput,
      currentPh: 3.2,
    });
    expect(over.currentStatus).toBe('OVER_ACIDIFIED');
    expect(over.isReadyForInoculation).toBe(false);
  });

  it('should estimate ripeness by elapsed incubation time when pH is omitted', () => {
    const early = calculateWheyLevainPlan({
      ...baseAlpineInput,
      hoursIncubated: 4,
    });
    expect(early.currentStatus).toBe('WARMING_UP');

    const mid = calculateWheyLevainPlan({
      ...baseAlpineInput,
      hoursIncubated: 14,
    });
    expect(mid.currentStatus).toBe('ACTIVE_ACIDIFYING');

    const ready = calculateWheyLevainPlan({
      ...baseAlpineInput,
      hoursIncubated: 21,
    });
    expect(ready.currentStatus).toBe('PEAK_RIPE');
    expect(ready.isReadyForInoculation).toBe(true);
  });

  it('should adjust incubation rate with thermal Q10 acceleration', () => {
    // Cold incubation at 38°C (5°C below optimum 43°C)
    const coldPlan = calculateWheyLevainPlan({
      ...baseAlpineInput,
      incubationTempCelsius: 38,
    });
    expect(coldPlan.optimalIncubationHours).toBeGreaterThan(20);

    // Warm incubation at 46°C (3°C above optimum)
    const warmPlan = calculateWheyLevainPlan({
      ...baseAlpineInput,
      incubationTempCelsius: 46,
    });
    expect(warmPlan.optimalIncubationHours).toBeLessThan(20);
  });

  it('should calculate Farmhouse Mesophilic profile parameters', () => {
    const mesoPlan = calculateWheyLevainPlan({
      levainType: 'MESOPHILIC_FARMHOUSE',
      wheyVolumeMl: 400,
      incubationTempCelsius: 30,
      hoursIncubated: 24,
      targetMilkVolumeLiters: 10,
    });

    expect(mesoPlan.optimalIncubationHours).toBe(24);
    expect(mesoPlan.inoculumRatioPct).toBe(2.0);
    expect(mesoPlan.requiredStarterMl).toBe(200);
    expect(mesoPlan.targetPhMin).toBe(3.8);
    expect(mesoPlan.targetPhMax).toBe(4.1);
    expect(mesoPlan.currentStatus).toBe('PEAK_RIPE');
  });

  it('should flag generation passage degradation and phage risks', () => {
    const gen15 = calculateWheyLevainPlan({
      ...baseAlpineInput,
      generationPassage: 15,
    });
    expect(gen15.passageHealth.status).toBe('VIGILANCE_MONITOR');
    expect(gen15.passageHealth.warning).toContain('monitoruj czas koagulacji');

    const gen22 = calculateWheyLevainPlan({
      ...baseAlpineInput,
      generationPassage: 22,
    });
    expect(gen22.passageHealth.status).toBe('DEGENERATION_RESET_REQUIRED');
    expect(gen22.passageHealth.warning).toContain('bakteriofagów serowarskich');
  });
});
