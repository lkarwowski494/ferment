import {
  diagnoseFermentDefect,
  getDefectById,
  getDefectsByCategory,
  getBiohazardDefects,
  FERMENTATION_DEFECTS,
} from '../../src/core/fermentation-diagnostics';

describe('Fermentation Diagnostics & Remediation Decision Tree ("Doktor Fermentacji")', () => {
  it('contains comprehensive database of craft defects across cheese, veg, kombucha, and vinegar', () => {
    expect(FERMENTATION_DEFECTS.length).toBeGreaterThanOrEqual(10);

    const cheeseDefects = getDefectsByCategory('CHEESE');
    expect(cheeseDefects.length).toBeGreaterThanOrEqual(4);

    const vegDefects = getDefectsByCategory('VEG_FERMENT');
    expect(vegDefects.length).toBeGreaterThanOrEqual(3);

    const kombuchaDefects = getDefectsByCategory('KOMBUCHA');
    expect(kombuchaDefects.length).toBeGreaterThanOrEqual(2);

    const vinegarDefects = getDefectsByCategory('VINEGAR');
    expect(vinegarDefects.length).toBeGreaterThanOrEqual(2);
  });

  it('diagnoses early blowing coliform defect accurately by keyword and symptoms', () => {
    const results = diagnoseFermentDefect('gąbka');
    expect(results.length).toBeGreaterThanOrEqual(1);

    const earlyBlow = results.find((d) => d.id === 'CH_EARLY_BLOWING');
    expect(earlyBlow).toBeDefined();
    expect(earlyBlow?.category).toBe('CHEESE');
    expect(earlyBlow?.safetyVerdict).toBe('BIOHAZARD_DISCARD');
    expect(earlyBlow?.rootCauseMicrobiology).toContain('Enterobacter');
    expect(earlyBlow?.stepByStepRemedy.length).toBeGreaterThan(0);
  });

  it('correctly diagnoses Kahm yeast as non-toxic cosmetic flaw', () => {
    const kahm = getDefectById('VG_KAHM_YEAST');
    expect(kahm).toBeDefined();
    expect(kahm?.safetyVerdict).toBe('COSMETIC_FLAW');
    expect(kahm?.stepByStepRemedy.some((step) => step.toLowerCase().includes('usuń'))).toBe(true);
  });

  it('filters defects by category and query together', () => {
    const results = diagnoseFermentDefect('pleśń', 'KOMBUCHA');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('KB_SCOBY_MOLD');
    expect(results[0].safetyVerdict).toBe('BIOHAZARD_DISCARD');
  });

  it('correctly aggregates all critical biohazard defects', () => {
    const biohazards = getBiohazardDefects();
    expect(biohazards.length).toBeGreaterThanOrEqual(3);
    expect(biohazards.every((b) => b.safetyVerdict === 'BIOHAZARD_DISCARD')).toBe(true);

    const ids = biohazards.map((b) => b.id);
    expect(ids).toContain('CH_EARLY_BLOWING');
    expect(ids).toContain('CH_LATE_BLOWING');
    expect(ids).toContain('VG_PUTRID_ROT');
    expect(ids).toContain('KB_SCOBY_MOLD');
  });

  it('diagnoses hydrogen sulfide odor in vinegar and suggests copper wire aeration remedy', () => {
    const results = diagnoseFermentDefect('siarkowodór');
    expect(results.length).toBeGreaterThanOrEqual(1);

    const sulfur = results.find((d) => d.id === 'VN_SULFUR_STINK');
    expect(sulfur).toBeDefined();
    expect(sulfur?.stepByStepRemedy.some((step) => step.includes('miedz'))).toBe(true);
  });
});
