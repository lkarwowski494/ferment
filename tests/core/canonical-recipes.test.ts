import {
  CANONICAL_RECIPES,
  getCanonicalRecipe,
  getRecipesByCategory,
} from '../../src/core/canonical-recipes';

describe('Canonical Artisan Recipe Library', () => {
  it('should include all foundational recipes for cheese, veg, and kombucha', () => {
    expect(CANONICAL_RECIPES.length).toBeGreaterThanOrEqual(6);

    const gouda = CANONICAL_RECIPES.find((r) => r.id === 'rec_gouda_zagrodowa');
    expect(gouda).toBeDefined();
    expect(gouda?.category).toBe('CHEESE');
    expect(gouda?.agingDays).toBe(60);
    expect(gouda?.steps.length).toBeGreaterThanOrEqual(5);

    const kimchi = CANONICAL_RECIPES.find((r) => r.id === 'rec_kimchi_baechu');
    expect(kimchi).toBeDefined();
    expect(kimchi?.category).toBe('VEG_FERMENT');
  });

  it('should retrieve recipe by id', () => {
    const korycin = getCanonicalRecipe('rec_korycinski_swojski');
    expect(korycin).toBeDefined();
    expect(korycin?.name).toContain('Koryciński');

    const nonExistent = getCanonicalRecipe('unknown_id');
    expect(nonExistent).toBeUndefined();
  });

  it('should filter recipes by category', () => {
    const cheeses = getRecipesByCategory('CHEESE');
    expect(cheeses.length).toBeGreaterThanOrEqual(3);
    expect(cheeses.every((c) => c.category === 'CHEESE')).toBe(true);

    const veg = getRecipesByCategory('VEG_FERMENT');
    expect(veg.length).toBeGreaterThanOrEqual(2);
    expect(veg.every((v) => v.category === 'VEG_FERMENT')).toBe(true);

    const kombucha = getRecipesByCategory('KOMBUCHA');
    expect(kombucha.length).toBeGreaterThanOrEqual(1);
    expect(kombucha.every((k) => k.category === 'KOMBUCHA')).toBe(true);

    const vinegar = getRecipesByCategory('VINEGAR');
    expect(vinegar.length).toBeGreaterThanOrEqual(1);
    expect(vinegar.every((v) => v.category === 'VINEGAR')).toBe(true);
  });
});
