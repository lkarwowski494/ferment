// ============================================================================
// Apps4Brew Studio — Tests for Koji, Shio Koji & Amazake Hydrolysis Engine
// ============================================================================

import {
  calculateShioKoji,
  calculateAmazake,
  calculateMisoFormulation,
} from '../../src/core/koji-fermentation';

describe('Koji, Shio Koji & Amazake Hydrolysis Engine', () => {
  describe('Shio Koji Formulation & Kinetics', () => {
    test('Calculates standard dried rice koji recipe with safe ~11.5% salinity', () => {
      const result = calculateShioKoji({
        kojiMassGrams: 200,
        kojiState: 'DRIED',
        targetSalinityPercent: 11.5,
        fermentationTempC: 22.0,
      });

      expect(result.waterGrams).toBe(270); // 200 * 1.35 = 270g
      expect(result.saltGrams).toBeGreaterThanOrEqual(60);
      expect(result.effectiveSalinityPercent).toBeCloseTo(11.5, 1);
      expect(result.dailyStirringRequired).toBe(true);
      expect(result.fermentationDurationHours).toBeGreaterThanOrEqual(168); // 7+ days
      expect(result.alertsPl).toHaveLength(0);
      expect(result.meatTenderizingDoseGrams(500)).toBe(50); // 10% of 500g
    });

    test('Fresh (nama) koji requires less water due to inherent moisture', () => {
      const dried = calculateShioKoji({ kojiMassGrams: 200, kojiState: 'DRIED' });
      const fresh = calculateShioKoji({ kojiMassGrams: 200, kojiState: 'FRESH' });

      expect(fresh.waterGrams).toBeLessThan(dried.waterGrams);
      expect(fresh.waterGrams).toBe(220); // 200 * 1.10
    });

    test('Accelerated sous-vide hydrolysis (58°C) finishes in 8 hours without daily stirring', () => {
      const result = calculateShioKoji({
        kojiMassGrams: 100,
        kojiState: 'DRIED',
        fermentationTempC: 58.0,
      });

      expect(result.fermentationDurationHours).toBe(8);
      expect(result.dailyStirringRequired).toBe(false);
      expect(result.fermentationMethodPl).toContain('sous-vide');
    });

    test('Warns if salinity is too low (<9%) or too high (>15%)', () => {
      const lowSalt = calculateShioKoji({
        kojiMassGrams: 100,
        kojiState: 'DRIED',
        targetSalinityPercent: 7.0,
      });
      expect(lowSalt.alertsPl.length).toBeGreaterThan(0);
      expect(lowSalt.alertsPl[0]).toContain('poniżej 9%');

      const highSalt = calculateShioKoji({
        kojiMassGrams: 100,
        kojiState: 'DRIED',
        targetSalinityPercent: 18.0,
      });
      expect(highSalt.alertsPl.length).toBeGreaterThan(0);
      expect(highSalt.alertsPl[0]).toContain('powyżej 15%');
    });
  });

  describe('Amazake Saccharification & Thermal Window', () => {
    test('Optimal 58°C incubation provides safe status and high Brix sweetness', () => {
      const result = calculateAmazake({
        kojiMassGrams: 200,
        cookedRiceMassGrams: 200,
        incubationTempC: 58.0,
      });

      expect(result.safetyStatus).toBe('OPTIMAL');
      expect(result.expectedBrixSweetness).toBe(24.0);
      expect(result.alertsPl).toHaveLength(0);
      expect(result.instructionsPl.length).toBeGreaterThanOrEqual(3);
    });

    test('Low temperature (<52°C) triggers lactic souring alert', () => {
      const result = calculateAmazake({
        kojiMassGrams: 200,
        cookedRiceMassGrams: 200,
        incubationTempC: 45.0,
      });

      expect(result.safetyStatus).toBe('RISK_OF_LACTIC_SOURING');
      expect(result.alertsPl[0]).toContain('RYZYKO KWAŚNIENIA');
      expect(result.expectedBrixSweetness).toBeLessThan(20.0);
    });

    test('High temperature (>63°C) triggers enzyme denaturation alert', () => {
      const result = calculateAmazake({
        kojiMassGrams: 200,
        cookedRiceMassGrams: 200,
        incubationTempC: 70.0,
      });

      expect(result.safetyStatus).toBe('CRITICAL_AMYLASE_DENATURATION');
      expect(result.alertsPl[0]).toContain('DENATURACJA');
    });
  });

  describe('Miso Formulation & Safety', () => {
    test('Shiro Miso has lower salt (~5.5%) and shorter duration than Akamiso', () => {
      const shiro = calculateMisoFormulation({
        cookedSoybeansGrams: 500,
        kojiGrams: 500,
        misoType: 'SHIRO_MISO',
      });

      const aka = calculateMisoFormulation({
        cookedSoybeansGrams: 500,
        kojiGrams: 500,
        misoType: 'AKAMISO',
      });

      expect(shiro.saltPercent).toBeCloseTo(5.5, 1);
      expect(aka.saltPercent).toBeCloseTo(12.0, 1);
      expect(shiro.fermentationDurationMonths).toBeLessThan(aka.fermentationDurationMonths);
      expect(shiro.safetyStatus).toBe('SAFE');
      expect(aka.safetyStatus).toBe('SAFE');
    });

    test('Alerts on critically low salt in miso formulation (<4.5%)', () => {
      const unsafe = calculateMisoFormulation({
        cookedSoybeansGrams: 500,
        kojiGrams: 500,
        misoType: 'SHIRO_MISO',
        saltGrams: 30, // 30 / (1000 + 30) = ~2.9%
      });

      expect(unsafe.safetyStatus).toBe('LOW_SALT_SPOILAGE_RISK');
      expect(unsafe.alertsPl[0]).toContain('KRYTYCZNIE NISKIE ZASOLENIE');
    });
  });
});
