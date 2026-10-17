import {
  FIELD_GUIDE_LESSONS,
  CRAFT_GLOSSARY,
  REFERENCE_TABLES,
} from '../../src/data/knowledge-base';

describe('In-App Field Guide & Knowledge Base Data (src/data/knowledge-base.ts)', () => {
  it('contains exactly 7 craft lessons covering full dairy cycle', () => {
    expect(FIELD_GUIDE_LESSONS).toHaveLength(7);

    const lessonTitles = FIELD_GUIDE_LESSONS.map((l) => l.title);
    expect(lessonTitles).toContain('Biochemia Kazeiny i Cięcie Skrzepu');
    expect(lessonTitles).toContain('Rola Wapnia Koloidalnego i Mleko Sklepowe');
    expect(lessonTitles).toContain('Mezofile vs Termofile — Wybór Bakterii Starterowych');
    expect(lessonTitles).toContain('Fizyka Synerezy — Oddawanie Serwatki');
    expect(lessonTitles).toContain('Ekologia Dojrzewalni i Pielęgnacja Skórki');
    expect(lessonTitles).toContain('Masielnictwo — Inwersja Emulsji i Płukanie Lodowe');
    expect(lessonTitles).toContain('Zamknięty Obieg Serwatki — Ricotta i Norweski Brunost');

    // Every lesson must have scientific sources verified (min. 2 sources)
    expect(FIELD_GUIDE_LESSONS.every((l) => l.scientificSources.length >= 2)).toBe(true);
    // Every lesson has a concise pill summary
    expect(FIELD_GUIDE_LESSONS.every((l) => l.pillSummary.length > 20)).toBe(true);
  });

  it('contains comprehensive Craft Glossary of 25 dairy terms', () => {
    expect(CRAFT_GLOSSARY).toHaveLength(25);

    const terms = CRAFT_GLOSSARY.map((g) => g.term);
    expect(terms).toContain('Affinage');
    expect(terms).toContain('Brevibacterium linens');
    expect(terms).toContain('Brunost (Mysost)');
    expect(terms).toContain('Chymozyna');
    expect(terms).toContain('Clean Break (Czysty Złom)');
    expect(terms).toContain('Cultured Butter (Masło Ukwaszone)');
    expect(terms).toContain('Curd Washing (Przemywanie Gęstwy)');
    expect(terms).toContain('Flocculation Point (Punkt Flokulacji tf)');
    expect(terms).toContain('Flocculation Multiplier (Mnożnik Flokulacji)');
    expect(terms).toContain('Ghee (Masło Klarowane)');
    expect(terms).toContain('IMCU');
    expect(terms).toContain('Klinek');
    expect(terms).toContain('Labneh');
    expect(terms).toContain('Punkt Izoelektryczny (pI = 4.6)');
    expect(terms).toContain('Ricotta');
    expect(terms).toContain('Synereza');
    expect(terms).toContain('VPD (Deficyt Prężności Pary)');

    // Every term must have search keywords
    expect(CRAFT_GLOSSARY.every((g) => g.keywords.length >= 3)).toBe(true);
  });

  it('contains verified reference tables: pasteurization, brine, and psychrometry', () => {
    expect(REFERENCE_TABLES).toHaveLength(3);

    const tableIds = REFERENCE_TABLES.map((t) => t.id);
    expect(tableIds).toContain('table_pasteurization');
    expect(tableIds).toContain('table_brine_saturation');
    expect(tableIds).toContain('table_cave_psychrometry');

    const brineTable = REFERENCE_TABLES.find((t) => t.id === 'table_brine_saturation');
    expect(brineTable).toBeDefined();
    expect(brineTable?.rows.length).toBeGreaterThanOrEqual(4);
    expect(brineTable?.scientificSources.length).toBeGreaterThanOrEqual(2);
  });
});
