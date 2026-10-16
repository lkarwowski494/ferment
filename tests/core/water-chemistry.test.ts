import {
  calculateDechlorination,
  analyzeWaterHardnessForFerment,
} from '../../src/core/water-chemistry';

describe('FERMENT Water Chemistry & Dechlorination Engine', () => {
  it('calculates dechlorination and chloramine mitigation with vitamin C', () => {
    const resFree = calculateDechlorination(10, false);
    expect(resFree.freeChlorineDegassingHours).toBe(24);
    expect(resFree.boilingMinutesNeeded).toBe(15);
    expect(resFree.vitaminCMgNeededForChloramine).toBe(80);

    const resChloramine = calculateDechlorination(25, true);
    expect(resChloramine.recommendation).toContain('chloraminą NIE ulatnia się');
    expect(resChloramine.vitaminCMgNeededForChloramine).toBe(200);
  });

  it('evaluates water mineral hardness and buffering capacity', () => {
    // Soft tap water: 30 ppm Ca, 10 ppm Mg, 50 ppm alkalinity
    const soft = analyzeWaterHardnessForFerment(30, 10, 50);
    expect(soft.suitabilityForCheese).toBe('NEEDS_CACL2');
    expect(soft.cacl2DryAdditionGramsPerLiterNeeded).toBe(0.15);
    expect(soft.suitabilityForKombuchaAndVeg).toBe('OPTIMAL');

    // Hard, heavily buffered water: 120 ppm Ca, 40 ppm Mg, 280 ppm alkalinity
    const hard = analyzeWaterHardnessForFerment(120, 40, 280);
    expect(hard.suitabilityForCheese).toBe('EXCELLENT');
    expect(hard.suitabilityForKombuchaAndVeg).toBe('TOO_BUFFERED');
    expect(hard.notes).toContain('buforuje kwas');
  });
});
