import {
  FLAVOR_CATEGORIES,
  FLAVOR_DESCRIPTORS,
  getDescriptorsByCategory,
  findDescriptorById,
  searchDescriptors,
  calculateCategoryDistribution,
  formatDescriptorNotes,
} from '../../src/core/flavor-wheel-data';

describe('Microbial Flavor Wheel Lexicon & Engine', () => {
  it('should define all 5 core sensory categories with icons and color styling', () => {
    expect(FLAVOR_CATEGORIES).toHaveLength(5);
    const ids = FLAVOR_CATEGORIES.map((c) => c.id);
    expect(ids).toEqual(['LACTIC', 'FRUITY_ACID', 'NUTTY_CARAMEL', 'EARTHY_FUNGAL', 'ANIMAL_PUNGENT']);

    FLAVOR_CATEGORIES.forEach((cat) => {
      expect(cat.label.length).toBeGreaterThan(0);
      expect(cat.description.length).toBeGreaterThan(0);
      expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(cat.badgeBg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(cat.icon).toBeTruthy();
    });
  });

  it('should contain 40 descriptors, exactly 8 per category', () => {
    expect(FLAVOR_DESCRIPTORS).toHaveLength(40);

    const categories = ['LACTIC', 'FRUITY_ACID', 'NUTTY_CARAMEL', 'EARTHY_FUNGAL', 'ANIMAL_PUNGENT'] as const;
    categories.forEach((cat) => {
      const items = getDescriptorsByCategory(cat);
      expect(items).toHaveLength(8);
      items.forEach((item) => {
        expect(item.category).toBe(cat);
        expect(item.id).toMatch(/^fl_/);
        expect(item.label.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(0);
        expect(item.chemicalOrigin.length).toBeGreaterThan(0);
        expect(item.subcategory.length).toBeGreaterThan(0);
      });
    });
  });

  it('should retrieve individual descriptors by ID', () => {
    const diacetyl = findDescriptorById('fl_butter_diacetyl');
    expect(diacetyl).toBeDefined();
    expect(diacetyl?.label).toContain('Diacetyl');
    expect(diacetyl?.chemicalOrigin).toContain('2,3-butanodion');

    const geosmin = findDescriptorById('fl_damp_cave');
    expect(geosmin).toBeDefined();
    expect(geosmin?.chemicalOrigin).toBe('Geosmina');

    const unknown = findDescriptorById('fl_non_existent');
    expect(unknown).toBeUndefined();
  });

  it('should perform text searches across label, chemical origin, and description', () => {
    const diacetylSearch = searchDescriptors('Diacetyl');
    expect(diacetylSearch.length).toBeGreaterThanOrEqual(1);
    expect(diacetylSearch.some((d) => d.id === 'fl_butter_diacetyl')).toBe(true);

    const esterSearch = searchDescriptors('estry');
    expect(esterSearch.length).toBeGreaterThanOrEqual(1);

    const moldSearch = searchDescriptors('Penicillium');
    expect(moldSearch.length).toBeGreaterThanOrEqual(2); // camemberti and roqueforti

    const emptySearch = searchDescriptors('');
    expect(emptySearch).toHaveLength(40);
  });

  it('should calculate category distribution accurately for radar charts', () => {
    const selected = ['fl_fresh_milk', 'fl_butter_diacetyl', 'fl_green_apple'];
    const dist = calculateCategoryDistribution(selected);

    expect(dist).toHaveLength(5);
    const lactic = dist.find((d) => d.category === 'LACTIC');
    const fruity = dist.find((d) => d.category === 'FRUITY_ACID');
    const earthy = dist.find((d) => d.category === 'EARTHY_FUNGAL');

    expect(lactic?.count).toBe(2);
    expect(lactic?.percentage).toBe(67); // 2/3 = 66.66% -> 67%
    expect(fruity?.count).toBe(1);
    expect(fruity?.percentage).toBe(33); // 1/3 = 33.33% -> 33%
    expect(earthy?.count).toBe(0);
    expect(earthy?.percentage).toBe(0);
  });

  it('should format selected descriptors into structured tasting notes', () => {
    const selected = ['fl_fresh_mushroom', 'fl_oak_bark'];
    const notes = formatDescriptorNotes(selected);

    expect(notes).toContain('[Koło Smaków:');
    expect(notes).toContain('Świeża pieczarka / Borowik (1-okten-3-ol)');
    expect(notes).toContain('Kora dębowa / Świerkowa deska (Elagotaniny, laktony dębowe)');

    expect(formatDescriptorNotes([])).toBe('');
  });
});
