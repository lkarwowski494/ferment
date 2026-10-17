import {
  litersToGallons,
  gallonsToLiters,
  gramsToOz,
  ozToGrams,
  kgToLb,
  lbToKg,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  kgCm2ToPsi,
  psiToKgCm2,
  salinityPctToSalometer,
  salometerToSalinityPct,
  salinityPctToBaume,
  baumeToSalinityPct,
  formatMilkVolume,
  formatCheeseWeight,
  formatTemperature,
  wInKeep,
} from '../../src/lib/unit-converter';

describe('FERMENT Unit Converter & Physical Quantity Systems', () => {
  it('converts volume accurately between liters and US gallons', () => {
    expect(litersToGallons(3.78541)).toBeCloseTo(1.0, 3);
    expect(gallonsToLiters(2.5)).toBeCloseTo(9.4635, 2);
  });

  it('converts weight accurately between grams/oz and kg/lb', () => {
    expect(gramsToOz(28.3495)).toBeCloseTo(1.0, 3);
    expect(ozToGrams(2.0)).toBeCloseTo(56.7, 1);

    expect(kgToLb(1.0)).toBeCloseTo(2.20462, 3);
    expect(lbToKg(5.0)).toBeCloseTo(2.268, 2);
  });

  it('converts temperature between Celsius and Fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(32)).toBe(89.6);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(89.6)).toBeCloseTo(32, 1);
  });

  it('converts pressure between kg/cm² and PSI', () => {
    expect(kgCm2ToPsi(0.174)).toBeCloseTo(2.475, 2);
    expect(psiToKgCm2(2.475)).toBeCloseTo(0.174, 3);
  });

  it('calculates brine hydrometer scales (Salometer and Baumé)', () => {
    // Saturated brine ~26.4% NaCl = 100°Sal
    expect(salinityPctToSalometer(26.395)).toBeCloseTo(100.0, 1);
    expect(salometerToSalinityPct(50.0)).toBeCloseTo(13.2, 1);

    // Standard 20% brine in Baumé
    const baume20 = salinityPctToBaume(20);
    expect(baume20).toBeGreaterThan(15);
    expect(baume20).toBeLessThan(25);
    expect(baumeToSalinityPct(baume20)).toBeCloseTo(20, 0);
  });

  it('formats values correctly according to active UnitSystem', () => {
    expect(formatMilkVolume(15.0, 'metric')).toBe('15.0 L');
    expect(formatMilkVolume(15.0, 'imperial')).toContain('gal');

    expect(formatCheeseWeight(2.5, 'metric')).toBe('2.50 kg');
    expect(formatCheeseWeight(0.45, 'metric')).toBe('450 g');
    expect(formatCheeseWeight(2.5, 'imperial')).toContain('lb');

    expect(formatTemperature(12.5, 'metric')).toBe('12.5°C');
    expect(formatTemperature(12.5, 'imperial')).toBe('55°F');
  });

  it('converts without drift using wInKeep (RD-ENG-01, BR-TEST-005)', () => {
    // Vector 1: 135 lb with prev 61.23 kg -> keeps 61.23 (no drift to 61.25)
    expect(wInKeep('135', 'lb', 61.23)).toBe(61.23);

    // Vector 2: 135,0 lb with comma -> keeps 61.23
    expect(wInKeep('135,0', 'lb', 61.23)).toBe(61.23);

    // Vector 3: 140 lb with prev 61.23 kg -> recalculates to 63.5
    expect(wInKeep('140', 'lb', 61.23)).toBe(63.5);

    // Vector 4: 80,5 kg with prev 80 kg -> 80.5
    expect(wInKeep('80,5', 'kg', 80)).toBe(80.5);
  });
});
