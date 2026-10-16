import {
  convertRennetForm,
  getCultureNaturalSubstitute,
  convertCacl2Forms,
} from '../../src/core/ingredient-substitutions';

describe('Ingredient Substitutions & Equivalents Engine', () => {
  describe('convertRennetForm', () => {
    it('should convert rennet dose correctly for 10L of milk', () => {
      const liquid = convertRennetForm(10, 'LIQUID_200_IMCU');
      expect(liquid.milkLiters).toBe(10);
      expect(liquid.targetImcuTotal).toBe(350);
      expect(liquid.requiredAmount).toBe(1.75);
      expect(liquid.unit).toBe('ml');

      const powder = convertRennetForm(10, 'POWDER_MICROBIAL_2000');
      expect(powder.requiredAmount).toBe(0.175);
      expect(powder.unit).toBe('g');

      const tablet = convertRennetForm(10, 'MEITO_TABLET');
      expect(tablet.requiredAmount).toBe(0.2);
      expect(tablet.unit).toBe('tabl.');

      const paste = convertRennetForm(10, 'PASTE_ANIMAL');
      expect(paste.requiredAmount).toBe(3.5);
      expect(paste.unit).toBe('g');
    });

    it('should reject non-positive milk volume', () => {
      expect(() => convertRennetForm(0, 'LIQUID_200_IMCU')).toThrow(
        'Objętość mleka musi być większa od zera.'
      );
      expect(() => convertRennetForm(-5, 'LIQUID_200_IMCU')).toThrow();
    });
  });

  describe('getCultureNaturalSubstitute', () => {
    it('should calculate natural mesophilic buttermilk equivalent for 10L', () => {
      const meso = getCultureNaturalSubstitute(10, 'MESOPHILIC');
      expect(meso.commercialDvsGrams).toBe(1.0);
      expect(meso.naturalSubstituteAmount).toBe(180);
      expect(meso.naturalSubstituteUnit).toBe('ml');
      expect(meso.naturalSubstituteName).toContain('maślanka');
    });

    it('should calculate natural thermophilic yogurt equivalent for 10L', () => {
      const thermo = getCultureNaturalSubstitute(10, 'THERMOPHILIC');
      expect(thermo.commercialDvsGrams).toBe(1.0);
      expect(thermo.naturalSubstituteAmount).toBe(150);
      expect(thermo.naturalSubstituteUnit).toBe('g');
      expect(thermo.naturalSubstituteName).toContain('jogurt');
    });

    it('should reject non-positive milk volume', () => {
      expect(() => getCultureNaturalSubstitute(0, 'MESOPHILIC')).toThrow();
    });
  });

  describe('convertCacl2Forms', () => {
    it('should calculate anhydrous, dihydrate and liquid solution amounts for 10L', () => {
      const cacl2 = convertCacl2Forms(10, 0.2);
      expect(cacl2.dryAnhydrousGrams).toBe(2.0);
      expect(cacl2.dryDihydrateGrams).toBe(2.64);
      expect(cacl2.liquid33PercentMl).toBe(4.7);
      expect(cacl2.liquid10PercentMl).toBe(18.5);
    });

    it('should reject non-positive volume', () => {
      expect(() => convertCacl2Forms(-1)).toThrow();
    });
  });
});
