// ============================================================================
// Apps4Brew Studio — Tests for Brine Densitometry & Temp Compensation
// ============================================================================

import {
  calculateBrineDensitometry,
  specificGravityToPercentNacl,
  percentNaclToSpecificGravity,
  baumeToSpecificGravity,
  specificGravityToBaume,
  percentToSalometer,
  salometerToPercent,
  BRINE_TARGET_PROFILES,
} from '../../src/core/brine-densitometry';

describe('Brine Densitometry & Hydrometer Temp Compensation', () => {
  test('Pure water has 0% NaCl, 0 °Sal, 0 °Bé and SG 1.000', () => {
    const result = calculateBrineDensitometry({
      measuredValue: 1.000,
      unit: 'SPECIFIC_GRAVITY',
      sampleTempC: 20.0,
      calibrationTempC: 20.0,
    });

    expect(result.percentNacl).toBeCloseTo(0, 1);
    expect(result.salometerDegrees).toBeCloseTo(0, 1);
    expect(result.baumeDegrees).toBeCloseTo(0, 1);
    expect(result.temperatureCorrectedSg).toBe(1.000);
    expect(result.gramsNaclPerLiterWater).toBe(0);
    expect(result.status).toBe('TOO_DILUTE');
  });

  test('Gouda hard cheese heavy brine (20% NaCl) converts properly across units', () => {
    const result = calculateBrineDensitometry({
      measuredValue: 20.0,
      unit: 'PERCENT_WT',
      sampleTempC: 20.0,
      calibrationTempC: 20.0,
    });

    expect(result.percentNacl).toBe(20.0);
    expect(result.salometerDegrees).toBeCloseTo(75.8, 1);
    expect(result.baumeDegrees).toBeGreaterThanOrEqual(18.0);
    expect(result.baumeDegrees).toBeLessThanOrEqual(21.0);
    expect(result.temperatureCorrectedSg).toBeGreaterThan(1.14);
    expect(result.gramsNaclPerLiterWater).toBe(250); // 20 / 80 * 1000 = 250 g/L water
    expect(result.status).toBe('OPTIMAL');
  });

  test('Hydrometer reading in cold aging cave (10°C) is temperature compensated', () => {
    // A hydrometer calibrated at 20°C reads a denser liquid when cold at 10°C (deltaT = -10°C)
    // Offset is -0.0032 SG
    const result = calculateBrineDensitometry({
      measuredValue: 1.155,
      unit: 'SPECIFIC_GRAVITY',
      sampleTempC: 10.0,
      calibrationTempC: 20.0,
    });

    expect(result.thermalOffsetSg).toBeCloseTo(-0.0032, 4);
    expect(result.temperatureCorrectedSg).toBeCloseTo(1.155 - 0.0032, 4);
    expect(result.percentNacl).toBeLessThan(specificGravityToPercentNacl(1.155));
  });

  test('Hydrometer reading in warm room (26°C) is adjusted upward', () => {
    // Liquid expanded, hydrometer sank deeper, reading is too low.
    // deltaT = +6°C, offset is +0.00192 SG
    const result = calculateBrineDensitometry({
      measuredValue: 1.140,
      unit: 'SPECIFIC_GRAVITY',
      sampleTempC: 26.0,
      calibrationTempC: 20.0,
    });

    expect(result.thermalOffsetSg).toBeCloseTo(0.0019, 3);
    expect(result.temperatureCorrectedSg).toBeGreaterThan(1.140);
  });

  test('Salometer input unit calculates identical properties to percent input', () => {
    const salometerResult = calculateBrineDensitometry({
      measuredValue: 50.0, // 50 °Sal is half saturation = ~13.2% NaCl
      unit: 'SALOMETER',
      sampleTempC: 20.0,
    });

    expect(salometerResult.salometerDegrees).toBe(50.0);
    expect(salometerResult.percentNacl).toBeCloseTo(13.2, 1);
  });

  test('Calculates exact salt addition in grams to reach target salinity', () => {
    // 10 Liters of 15% NaCl brine, target 20% NaCl
    const result = calculateBrineDensitometry({
      measuredValue: 15.0,
      unit: 'PERCENT_WT',
      sampleTempC: 20.0,
      currentBrineVolumeLiters: 10,
      targetPercent: 20.0,
    });

    expect(result.saltAdjustmentGrams).toBeDefined();
    // 10 L of 15% brine: SG ~ 1.113, mass ~ 11.13 kg, water ~ 9.46 kg, salt ~ 1.67 kg
    // To make 20% brine with 9.46 kg water: target salt = 9.46 * (20/80) = 2.365 kg
    // Salt needed = 2.365 - 1.67 = ~0.695 kg = ~695g
    expect(result.saltAdjustmentGrams).toBeGreaterThan(600);
    expect(result.saltAdjustmentGrams).toBeLessThan(800);
  });

  test('Detects supersaturated brine with warning alert', () => {
    const result = calculateBrineDensitometry({
      measuredValue: 100.0, // 100 °Sal = saturation
      unit: 'SALOMETER',
      sampleTempC: 20.0,
    });

    expect(result.status).toBe('SUPER_SATURATED');
    expect(result.alertsPl.length).toBeGreaterThan(0);
    expect(result.alertsPl[0]).toContain('nasycona');
  });

  test('Conversion helper functions satisfy roundtrip fidelity', () => {
    const percent = 18.5;
    const sg = percentNaclToSpecificGravity(percent);
    const recoveredPercent = specificGravityToPercentNacl(sg);
    expect(recoveredPercent).toBeCloseTo(percent, 1);

    const baume = specificGravityToBaume(sg);
    const recoveredSg = baumeToSpecificGravity(baume);
    expect(recoveredSg).toBeCloseTo(sg, 3);

    const salometer = percentToSalometer(percent);
    const recoveredFromSal = salometerToPercent(salometer);
    expect(recoveredFromSal).toBeCloseTo(percent, 2);
  });

  test('Presets for cheese and vegetable brines exist and have coherent bounds', () => {
    expect(BRINE_TARGET_PROFILES.HARD_CHEESE_HEAVY.targetPercentMin).toBe(19.0);
    expect(BRINE_TARGET_PROFILES.FETA_STORAGE.targetPercentMin).toBe(7.0);
    expect(BRINE_TARGET_PROFILES.VEG_PICKLE_SOUR.targetPercentMin).toBe(5.0);
  });
});
