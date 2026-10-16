import {
  encodeRecipeToShareUri,
  decodeRecipeFromShareUri,
} from '../../src/core/recipe-share';
import { CANONICAL_RECIPES } from '../../src/core/canonical-recipes';

describe('Offline Recipe Share Protocol', () => {
  it('should encode and decode a canonical recipe without data loss', () => {
    const original = CANONICAL_RECIPES[0];
    const shareUri = encodeRecipeToShareUri(original);

    expect(shareUri.startsWith('ferment://recipe?data=')).toBe(true);

    const decoded = decodeRecipeFromShareUri(shareUri);
    expect(decoded.id).toBe(original.id);
    expect(decoded.name).toBe(original.name);
    expect(decoded.category).toBe(original.category);
    expect(decoded.steps).toEqual(original.steps);
    expect(decoded.ingredients).toEqual(original.ingredients);
  });

  it('should decode from raw base64 string', () => {
    const original = CANONICAL_RECIPES[1];
    const shareUri = encodeRecipeToShareUri(original);
    const rawBase64 = decodeURIComponent(shareUri.replace('ferment://recipe?data=', ''));

    const decoded = decodeRecipeFromShareUri(rawBase64);
    expect(decoded.id).toBe(original.id);
    expect(decoded.name).toBe(original.name);
  });

  it('should throw an error on checksum mismatch', () => {
    const original = CANONICAL_RECIPES[0];
    const jsonStr = JSON.stringify({
      v: 1,
      app: 'FERMENT',
      recipe: { ...original, name: 'Sfałszowana Gouda' },
      checksum: 999999, // incorrect checksum
    });
    const base64 = Buffer.from(jsonStr, 'utf8').toString('base64');

    expect(() => decodeRecipeFromShareUri(`ferment://recipe?data=${encodeURIComponent(base64)}`)).toThrow(
      'Suma kontrolna receptury nie zgadza się'
    );
  });

  it('should throw an error on invalid format or broken base64', () => {
    expect(() => decodeRecipeFromShareUri('invalid_not_base64!!!')).toThrow();
  });
});
