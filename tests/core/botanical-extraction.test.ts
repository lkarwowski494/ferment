import {
  BOTANICAL_DATABASE,
  calculateVegCrispnessProtection,
} from '../../src/core/botanical-extraction';

describe('Botanical Extraction & Pectinase Tannin Engine', () => {
  it('should define comprehensive database of crisping botanicals and 2F aromatics', () => {
    expect(Object.keys(BOTANICAL_DATABASE).length).toBeGreaterThanOrEqual(10);

    const oak = BOTANICAL_DATABASE.OAK_LEAF;
    expect(oak.tanninsMgPerGram).toBe(45);
    expect(oak.botanicalName).toBe('Quercus robur');

    const tea = BOTANICAL_DATABASE.BLACK_TEA_LEAF;
    expect(tea.tanninsMgPerGram).toBe(100);

    const garlic = BOTANICAL_DATABASE.GARLIC_CLOVE;
    expect(garlic.activeCompounds).toContain('allicynę');
  });

  it('should flag high mushiness risk when no crisping botanicals are present', () => {
    const res = calculateVegCrispnessProtection({
      vegetableWeightKg: 2.0,
      brineVolumeLiters: 1.5,
      botanicals: [],
    });

    expect(res.targetMinimumTanninsMg).toBe(160); // 2kg * 80mg
    expect(res.totalTanninsMg).toBe(0);
    expect(res.crispnessProtectionRatioPct).toBe(0);
    expect(res.crispnessVerdict).toBe('INADEQUATE_RISK_OF_MUSHY');
    expect(res.verdictLabelPl).toContain('Niedostateczna ochrona pektyn');
    expect(res.craftRecommendations.length).toBeGreaterThanOrEqual(1);
  });

  it('should calculate optimal crispness protection when oak and cherry leaves are added', () => {
    const res = calculateVegCrispnessProtection({
      vegetableWeightKg: 1.0,
      brineVolumeLiters: 1.0,
      botanicals: [
        { botanicalId: 'OAK_LEAF', weightGrams: 2.0 }, // 2g * 45 = 90mg
        { botanicalId: 'HORSERADISH_ROOT', weightGrams: 10.0 }, // 10g * 15 = 150mg
      ],
      garlicGrams: 15,
      garlicPrep: 'BRUISED_CRUSHED',
    });

    // Total tannins: 90 + 150 = 240mg vs target 80mg (1kg * 80)
    expect(res.totalTanninsMg).toBe(240);
    expect(res.targetMinimumTanninsMg).toBe(80);
    expect(res.crispnessProtectionRatioPct).toBeGreaterThanOrEqual(100);
    expect(res.crispnessVerdict).not.toBe('INADEQUATE_RISK_OF_MUSHY');
    expect(res.garlicAllicinOutputMg).toBeDefined();
    expect(res.garlicAllicinOutputMg).toBeGreaterThan(30);
  });

  it('should calculate allicin extraction efficiency based on garlic prep method', () => {
    // 10g garlic = 35mg total potential
    const unpeeled = calculateVegCrispnessProtection({
      vegetableWeightKg: 1.0,
      brineVolumeLiters: 1.0,
      botanicals: [],
      garlicGrams: 10,
      garlicPrep: 'WHOLE_UNPEELED',
    });
    expect(unpeeled.garlicAllicinOutputMg).toBe(1.8); // 35 * 0.05 = 1.75 -> 1.8
    expect(unpeeled.garlicImpactNotes).toContain('Ząbki w łupinie');

    const crushed = calculateVegCrispnessProtection({
      vegetableWeightKg: 1.0,
      brineVolumeLiters: 1.0,
      botanicals: [],
      garlicGrams: 10,
      garlicPrep: 'BRUISED_CRUSHED',
    });
    expect(crushed.garlicAllicinOutputMg).toBe(29.8); // 35 * 0.85 = 29.75 -> 29.8

    const minced = calculateVegCrispnessProtection({
      vegetableWeightKg: 1.0,
      brineVolumeLiters: 1.0,
      botanicals: [],
      garlicGrams: 10,
      garlicPrep: 'MINCED_GRATED',
    });
    expect(minced.garlicAllicinOutputMg).toBe(35.0); // 35 * 1.0 = 35.0
  });

  it('should detect over-astringent tannin level when dosage exceeds 200%', () => {
    const res = calculateVegCrispnessProtection({
      vegetableWeightKg: 0.5, // 0.5kg -> target 40mg
      brineVolumeLiters: 0.5,
      botanicals: [
        { botanicalId: 'BLACK_TEA_LEAF', weightGrams: 5.0 }, // 5g * 100 = 500mg (1250%!)
      ],
    });

    expect(res.crispnessVerdict).toBe('OVER_ASTRINGENT');
    expect(res.verdictLabelPl).toContain('Nadmiar garbników');
  });
});
