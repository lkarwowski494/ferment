// ============================================================================
// Apps4Brew Studio — Tests for Nukazuke Rice Bran Bed Engine
// ============================================================================

import {
  calculateNukadokoSetup,
  calculateNukadokoMaintenance,
  getPicklingTimeForVeg,
} from '../../src/core/nukazuke-engine';

describe('Nukazuke Rice Bran Bed Fermentation Engine', () => {
  describe('Nukadoko Bed Initialization', () => {
    test('Calculates standard 1000g bran setup with 13% target salinity and aromatics', () => {
      const result = calculateNukadokoSetup({
        riceBranGrams: 1000,
        targetSalinityPct: 13.0,
      });

      expect(result.waterGrams).toBe(900);
      expect(result.effectiveSalinityPct).toBeCloseTo(13.0, 1);
      expect(result.saltGrams).toBeGreaterThan(250);
      expect(result.totalBedMassGrams).toBeGreaterThan(2000);
      expect(result.aromaticsGrams.konbuGrams).toBe(20);
      expect(result.aromaticsGrams.driedChiliGrams).toBe(4);
      expect(result.sutezukeDurationDays).toBe(12);
      expect(result.sutezukeInstructionsPl.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Nukadoko Maintenance & Te-ire Aeration', () => {
    test('Warm temperature (26°C) requires twice-daily hand turning', () => {
      const result = calculateNukadokoMaintenance({
        bedTotalMassGrams: 2000,
        currentEstimatedSalinityPct: 12.5,
        moistureExcessStatus: 'OPTIMAL_SAND',
        ambientTempC: 26.0,
      });

      expect(result.teireFrequencyDaily).toBe(2.0);
      expect(result.teireInstructionPl).toContain('2 razy dziennie');
      expect(result.status).toBe('HEALTHY');
      expect(result.saltTopupGrams).toBe(0);
      expect(result.dryBranTopupGrams).toBe(0);
    });

    test('Slushy bed prompts for dry bran and salt topup to absorb excess vegetable water', () => {
      const result = calculateNukadokoMaintenance({
        bedTotalMassGrams: 2000,
        currentEstimatedSalinityPct: 11.0,
        moistureExcessStatus: 'VERY_SLUSHY',
        ambientTempC: 20.0,
      });

      expect(result.dryBranTopupGrams).toBeGreaterThan(250);
      expect(result.saltTopupGrams).toBeGreaterThan(50);
      expect(result.alertsPl[0]).toContain('błotniste');
    });

    test('Critically low salinity (<10%) raises anaerobic butyric risk alert', () => {
      const result = calculateNukadokoMaintenance({
        bedTotalMassGrams: 2000,
        currentEstimatedSalinityPct: 8.5,
        moistureExcessStatus: 'OPTIMAL_SAND',
        ambientTempC: 21.0,
      });

      expect(result.status).toBe('RISK_ANAEROBIC_BUTYRIC');
      expect(result.alertsPl[0]).toContain('Clostridium');
    });
  });

  describe('Pickling Time For Vegetables', () => {
    test('Calculates faster turnaround for cucumber than carrot', () => {
      const cucumber = getPicklingTimeForVeg('CUCUMBER', 22.0);
      const carrot = getPicklingTimeForVeg('CARROT', 22.0);

      expect(cucumber.durationHoursMax).toBeLessThan(carrot.durationHoursMin);
      expect(cucumber.prepAdvicePl).toContain('soli');
      expect(carrot.prepAdvicePl).toContain('Obierz');
    });

    test('Avocado and boiled egg has short immersion window', () => {
      const quick = getPicklingTimeForVeg('AVOCADO_BOILED_EGG', 20.0);
      expect(quick.durationHoursMax).toBeLessThanOrEqual(8);
    });
  });
});
