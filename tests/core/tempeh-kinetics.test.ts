// ============================================================================
// Apps4Brew Studio — Tests for Tempeh Solid-State Mycelium Fermentation
// ============================================================================

import { calculateTempehKinetics } from '../../src/core/tempeh-kinetics';

describe('Tempeh Solid-State Mycelium Fermentation Kinetics', () => {
  test('Standard 500g dry soybeans in initial lag phase calculates proper hydration and vinegar dose', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'SOYBEAN',
      soakVinegarMl5Pct: 15,
      incubationHours: 6,
      currentCoreTempC: 31.0,
      ambientTempC: 28.0,
      bagWidthCm: 15,
      bagLengthCm: 20,
    });

    expect(result.hydratedLegumeWeightGrams).toBe(1075);
    expect(result.recommendedStarterGrams).toBe(1.8);
    expect(result.soakVinegarRecommendedMl).toBe(15);
    expect(result.isSoakAcidSafe).toBe(true);
    expect(result.mycelialPhase).toBe('LAG_INOCULATION');
    expect(result.isExothermicBurstActive).toBe(false);
    expect(result.recommendedIncubatorTempC).toBe(31.0);
    expect(result.thermalStatus).toBe('OPTIMAL');
    expect(result.perforationHolesRecommended).toBeGreaterThan(100);
    expect(result.alertsPl).toHaveLength(0);
  });

  test('Missing vinegar triggers critical Bacillus cereus bio-safety alert', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'SOYBEAN',
      soakVinegarMl5Pct: 0, // no vinegar!
      incubationHours: 6,
      currentCoreTempC: 31.0,
      ambientTempC: 28.0,
    });

    expect(result.isSoakAcidSafe).toBe(false);
    expect(result.alertsPl[0]).toContain('Bacillus cereus');
  });

  test('Exothermic burst phase (18h) instructs to lower incubator heat', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'SOYBEAN',
      soakVinegarMl5Pct: 15,
      incubationHours: 18,
      currentCoreTempC: 34.0,
      ambientTempC: 25.0,
    });

    expect(result.mycelialPhase).toBe('EXOTHERMIC_BURST');
    expect(result.isExothermicBurstActive).toBe(true);
    expect(result.recommendedIncubatorTempC).toBe(25.0); // dial back incubator!
    expect(result.thermalStatus).toBe('OPTIMAL');
  });

  test('Core temperature of 39°C triggers overheating warning', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'SOYBEAN',
      soakVinegarMl5Pct: 15,
      incubationHours: 20,
      currentCoreTempC: 39.0,
      ambientTempC: 25.0,
    });

    expect(result.thermalStatus).toBe('OVERHEATING_WARNING');
    expect(result.alertsPl[0]).toContain('przegrzaniu');
  });

  test('Core temperature of 43°C triggers critical mycelium death alert', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'SOYBEAN',
      soakVinegarMl5Pct: 15,
      incubationHours: 22,
      currentCoreTempC: 43.0,
      ambientTempC: 25.0,
    });

    expect(result.thermalStatus).toBe('CRITICAL_DEATH');
    expect(result.alertsPl[0]).toContain('PRZEGRZANIE RDZENIA');
  });

  test('Mature cake phase after 28h confirms completed mycelial knit', () => {
    const result = calculateTempehKinetics({
      dryLegumeWeightGrams: 500,
      legumeType: 'CHICKPEA',
      soakVinegarMl5Pct: 15,
      incubationHours: 28,
      currentCoreTempC: 30.0,
      ambientTempC: 24.0,
    });

    expect(result.mycelialPhase).toBe('MATURE_DENSE_CAKE');
    expect(result.hydratedLegumeWeightGrams).toBe(1025); // chickpea 2.05x
  });
});
