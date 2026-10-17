// ============================================================================
// Apps4Brew Studio — Tests for Psychrometry & Cheese Cave Microclimate (GAP-LOG-02)
// Magnus-Tetens, Vapor Pressure Deficit (VPD), Condensation & Mold Guards
// ============================================================================

import {
  calculateDewPoint,
  calculateVpd,
  analyzeCaveMicroclimate,
} from '../../src/core/psychrometry';

describe('FERMENT Psychrometry & Cheese Cave Microclimate Engine (RD-06, RD-12)', () => {
  describe('calculateDewPoint (Magnus-Tetens)', () => {
    it('calculates dew point correctly at standard cave conditions (12°C, 85% RH)', () => {
      const dp = calculateDewPoint(12, 85);
      expect(dp).toBeCloseTo(9.6, 1);
    });

    it('returns air temperature at 100% relative humidity (saturation)', () => {
      const dp = calculateDewPoint(14.0, 100);
      expect(dp).toBeCloseTo(14.0, 1);
    });

    it('throws error when humidity is <= 0 or > 100', () => {
      expect(() => calculateDewPoint(12, 0)).toThrow(/Wilgotność/);
      expect(() => calculateDewPoint(12, -5)).toThrow(/Wilgotność/);
      expect(() => calculateDewPoint(12, 101)).toThrow(/Wilgotność/);
    });
  });

  describe('calculateVpd (Vapor Pressure Deficit in kPa)', () => {
    it('calculates es, ea, and vpd accurately at 12°C, 85% RH', () => {
      const res = calculateVpd(12, 85);
      expect(res.esKPa).toBeGreaterThan(1.0);
      expect(res.eaKPa).toBeGreaterThan(0.8);
      expect(res.vpdKPa).toBeCloseTo(0.21, 2);
      expect(res.vpdKPa).toBeLessThan(res.esKPa);
    });

    it('yields 0 kPa VPD at 100% relative humidity', () => {
      const res = calculateVpd(15, 100);
      expect(res.vpdKPa).toBe(0);
      expect(res.esKPa).toBe(res.eaKPa);
    });

    it('yields positive VPD for any RH < 100%', () => {
      const res = calculateVpd(10, 70);
      expect(res.vpdKPa).toBeGreaterThan(0.3);
    });
  });

  describe('analyzeCaveMicroclimate (Artisan Cave Safety Status)', () => {
    it('identifies CONDENSATION_DANGER when cheese surface is at or below dew point', () => {
      // Air 12C, 85% RH => dew point ~9.6C. Surface at 9.0C
      const analysis = analyzeCaveMicroclimate(12, 85, 9.0);
      expect(analysis.condensationRisk).toBe(true);
      expect(analysis.status).toBe('CONDENSATION_DANGER');
      expect(analysis.message).toContain('ALARM KONDENSACJI');
    });

    it('identifies TOO_DRY status when humidity is below 75% RH', () => {
      const analysis = analyzeCaveMicroclimate(12, 65, 12);
      expect(analysis.dryingRisk).toBe(true);
      expect(analysis.status).toBe('TOO_DRY');
      expect(analysis.message).toContain('ZBYT SUCHO');
    });

    it('identifies TOO_HUMID status when humidity exceeds 95% RH without condensation', () => {
      const analysis = analyzeCaveMicroclimate(12, 96, 12);
      expect(analysis.status).toBe('TOO_HUMID');
      expect(analysis.message).toContain('wysoka wilgotność');
    });

    it('identifies OPTIMAL status for 12°C, 85% RH with warm surface', () => {
      const analysis = analyzeCaveMicroclimate(12, 85, 12);
      expect(analysis.status).toBe('OPTIMAL');
      expect(analysis.condensationRisk).toBe(false);
      expect(analysis.dryingRisk).toBe(false);
      expect(analysis.message).toContain('optymalne');
    });

    it('defaults surface temperature to air temperature if omitted', () => {
      const analysis = analyzeCaveMicroclimate(12, 85);
      expect(analysis.condensationRisk).toBe(false);
      expect(analysis.status).toBe('OPTIMAL');
    });
  });
});
