// ============================================================================
// Apps4Brew Studio — Tests for Kombucha 2F Blending & Pressure Engine
// ============================================================================

import {
  calculateKombucha2FBlending,
  FRUIT_JUICE_PROFILES,
} from '../../src/core/kombucha-blending';

describe('Kombucha 2F Blending & Pressure Engine', () => {
  it('calculates safe carbonation in heavy swing-top bottles with apple juice', () => {
    const res = calculateKombucha2FBlending({
      baseKombuchaLiters: 3,
      juiceProfileId: 'apple',
      juiceVolumeMl: 300,
      bottleType: 'HEAVY_SWING_TOP_AMBER',
      temperatureC: 22,
      daysAtRoomTemp: 3,
    });

    expect(res.totalBeverageVolumeLiters).toBe(3.3);
    expect(res.sugarAddedGrams).toBeGreaterThan(30);
    expect(res.estimatedCo2Volumes).toBeGreaterThan(1.5);
    expect(res.isExplosionHazard).toBe(false);
    expect(res.refrigerationAdvice).toContain('lodówki');
  });

  it('triggers EXPLOSION_HAZARD when square decorative bottles are chosen', () => {
    const res = calculateKombucha2FBlending({
      baseKombuchaLiters: 2,
      juiceProfileId: 'apple',
      juiceVolumeMl: 200,
      bottleType: 'SQUARE_DECORATIVE',
      temperatureC: 22,
      daysAtRoomTemp: 2,
    });

    expect(res.isExplosionHazard).toBe(true);
    expect(res.alertLevel).toBe('EXPLOSION_HAZARD');
    expect(res.warningMessage).toContain('KRYTYCZNE RYZYKO');
  });
});
