// ============================================================================
// Apps4Brew Studio — FERMENT Unit Converter & Physical Quantity Systems
// Metric <-> Imperial & Chemico-Physical Scales (Baumé, Salometer, PSI)
// ============================================================================

export type UnitSystem = 'metric' | 'imperial';

// Conversion constants
export const US_GALLON_TO_LITER = 3.785411784;
export const OZ_TO_GRAM = 28.349523125;
export const LB_TO_KG = 0.45359237;
export const INCH_TO_CM = 2.54;
export const KG_CM2_TO_PSI = 14.2233433;
export const FL_OZ_TO_ML = 29.5735295625;

/**
 * Volume conversions
 */
export function litersToGallons(liters: number): number {
  return liters / US_GALLON_TO_LITER;
}

export function gallonsToLiters(gallons: number): number {
  return gallons * US_GALLON_TO_LITER;
}

export function mlToFlOz(ml: number): number {
  return ml / FL_OZ_TO_ML;
}

export function flOzToMl(flOz: number): number {
  return flOz * FL_OZ_TO_ML;
}

/**
 * Weight conversions
 */
export function kgToLb(kg: number): number {
  return kg / LB_TO_KG;
}

export function lbToKg(lb: number): number {
  return lb * LB_TO_KG;
}

export function gramsToOz(grams: number): number {
  return grams / OZ_TO_GRAM;
}

export function ozToGrams(oz: number): number {
  return oz * OZ_TO_GRAM;
}

/**
 * Length conversions
 */
export function cmToInches(cm: number): number {
  return cm / INCH_TO_CM;
}

export function inchesToCm(inches: number): number {
  return inches * INCH_TO_CM;
}

/**
 * Temperature conversions
 */
export function celsiusToFahrenheit(c: number): number {
  return c * 1.8 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return (f - 32) / 1.8;
}

/**
 * Pressure conversions
 */
export function kgCm2ToPsi(kgCm2: number): number {
  return kgCm2 * KG_CM2_TO_PSI;
}

export function psiToKgCm2(psi: number): number {
  return psi / KG_CM2_TO_PSI;
}

/**
 * Brine Hydrometer Scales:
 * - Salometer (°Sal): 0°Sal = 0% NaCl, 100°Sal = 26.4% NaCl (saturation at 15.5°C)
 * - Baumé (°Bé): traditional hydrometer scale for heavy liquids
 */
export function salinityPctToSalometer(salinityPct: number): number {
  if (salinityPct <= 0) return 0;
  return (salinityPct / 26.395) * 100;
}

export function salometerToSalinityPct(salometerDeg: number): number {
  if (salometerDeg <= 0) return 0;
  return (salometerDeg / 100) * 26.395;
}

export function salinityPctToBaume(salinityPct: number): number {
  if (salinityPct <= 0) return 0;
  // Approximate brine density at 15.5°C: rho ≈ 1.0 + 0.0072 * salinityPct
  const density = 1.0 + 0.0072 * salinityPct;
  const baume = 145.0 - (145.0 / density);
  return Math.max(0, Math.round(baume * 10) / 10);
}

export function baumeToSalinityPct(baumeDeg: number): number {
  if (baumeDeg <= 0) return 0;
  const density = 145.0 / (145.0 - baumeDeg);
  const salinityPct = (density - 1.0) / 0.0072;
  return Math.max(0, Math.round(salinityPct * 10) / 10);
}

/**
 * Universal Formatter helper respecting user's active UnitSystem
 */
export function formatMilkVolume(liters: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const gal = litersToGallons(liters);
    return `${gal.toFixed(2)} gal`;
  }
  return `${liters.toFixed(1)} L`;
}

export function formatCheeseWeight(kg: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const lb = kgToLb(kg);
    return `${lb.toFixed(2)} lb`;
  }
  if (kg < 1.0) {
    return `${Math.round(kg * 1000)} g`;
  }
  return `${kg.toFixed(2)} kg`;
}

export function formatAdditiveWeight(grams: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const oz = gramsToOz(grams);
    return `${oz.toFixed(2)} oz`;
  }
  return `${grams.toFixed(1)} g`;
}

export function formatTemperature(celsius: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const f = celsiusToFahrenheit(celsius);
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius * 10) / 10}°C`;
}

export function formatPressure(kgCm2: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const psi = kgCm2ToPsi(kgCm2);
    return `${psi.toFixed(2)} PSI`;
  }
  return `${kgCm2.toFixed(3)} kg/cm²`;
}
