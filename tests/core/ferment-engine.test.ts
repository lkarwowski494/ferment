import {
  calculateTotalBatchSalinity,
  verifyBotulinumSafety,
  calculateKimchiPrep,
  calculateKombucha1F,
  calculateKombucha2FPressure,
  calculateVinegarConversion,
} from '../../src/core/ferment-engine';
import { calculateDewPoint, analyzeCaveMicroclimate } from '../../src/core/psychrometry';

describe('FERMENT Ferment Engine & Psychrometry (RD-26…RD-50)', () => {
  it('RD-26: Total Batch Salinity — calculates salt on total mass (1200g veg + 800g water at 2.2% -> 45.0g salt)', () => {
    const res = calculateTotalBatchSalinity(1200, 800, 2.2);
    expect(res.totalMassGrams).toBe(2000);
    expect(res.saltGrams).toBe(45.0);
    expect(res.effectiveSalinityPct).toBe(2.2);
    expect(res.warning).toBeUndefined();
  });

  it('RD-27: Botulinum Safety Guard — verifies pH barriers', () => {
    const safeRes = verifyBotulinumSafety(3.8, 48);
    expect(safeRes.status).toBe('SAFE');
    expect(safeRes.isSafe).toBe(true);

    const borderlineRes = verifyBotulinumSafety(4.5, 48);
    expect(borderlineRes.status).toBe('BORDERLINE');
    expect(borderlineRes.isSafe).toBe(true);

    const dangerRes = verifyBotulinumSafety(4.8, 75);
    expect(dangerRes.status).toBe('CRITICAL_DANGER');
    expect(dangerRes.isSafe).toBe(false);
  });

  it('RD-29: calculates kimchi cabbage wilting salt and paste proportions', () => {
    const res = calculateKimchiPrep(2000); // 2 kg cabbage
    expect(res.saltWeightGrams).toBe(170); // 8.5% of 2000g
    expect(res.minWiltHours).toBe(4);
    expect(res.paste.gochugaruGrams).toBe(70);
    expect(res.paste.garlicGrams).toBe(50);
  });

  it('RD-31: calculates Kombucha 1F ingredient weights and starter volume', () => {
    const res = calculateKombucha1F(5.0, 7.0, 65.0, 12.0); // 5 L water
    expect(res.teaGrams).toBe(35);
    expect(res.sugarGrams).toBe(325);
    expect(res.starterLiquidMl).toBe(600);
    expect(res.totalVolumeLiters).toBe(5.6);
  });

  it('RD-35: Kombucha Bottle Pressure Guard — detects explosion hazard', () => {
    // 3 days at room temp -> optimal to high
    const normalRes = calculateKombucha2FPressure(15, 3);
    expect(normalRes.riskLevel).toBe('HIGH');
    expect(normalRes.refrigerationRequired).toBe(true);

    // 6 days at room temp -> explosion hazard!
    const bombRes = calculateKombucha2FPressure(25, 6);
    expect(bombRes.riskLevel).toBe('EXPLOSION_HAZARD');
    expect(bombRes.refrigerationRequired).toBe(true);
    expect(bombRes.message).toContain('KRYTYCZNE ZAGROŻENIE ROZERWANIEM SZKŁA');
  });

  it('RD-32: calculates vinegar conversion and warns on ABV > 8%', () => {
    // 12 Brix -> 6.6% ABV -> ~5.6% acetic acid
    const normalVinegar = calculateVinegarConversion(12);
    expect(normalVinegar.estimatedAbvPct).toBe(6.6);
    expect(normalVinegar.expectedAceticAcidPct).toBe(5.6);
    expect(normalVinegar.isAbvTooHigh).toBe(false);

    // Wine 12% ABV -> Acetobacter inhibited -> dilution required
    const strongVinegar = calculateVinegarConversion(22, 12.0);
    expect(strongVinegar.isAbvTooHigh).toBe(true);
    expect(strongVinegar.waterDilutionMlNeededPerLiter).toBe(1000); // 1:1 dilution
    expect(strongVinegar.message).toContain('przekracza 8.0%');
  });

  it('RD-06 & RD-12: Psychrometry — calculates dew point and detects condensation danger in cheese cave', () => {
    // 12°C, 85% RH -> dew point ≈ 9.6°C
    const dp = calculateDewPoint(12, 85);
    expect(dp).toBe(9.6);

    // Cheese surface at 9.0°C (colder than 9.6°C) -> condensation risk!
    const analysis = analyzeCaveMicroclimate(12, 85, 9.0);
    expect(analysis.condensationRisk).toBe(true);
    expect(analysis.status).toBe('CONDENSATION_DANGER');
    expect(analysis.message).toContain('ALARM KONDENSACJI');
  });
});
