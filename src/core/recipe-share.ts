// ============================================================================
// Apps4Brew Studio — FERMENT Offline Recipe Share Protocol
// Compact Base64 URI & QR code payload serialization/deserialization
// ============================================================================

import { CanonicalRecipe } from './canonical-recipes';

export interface SharedRecipePayload {
  v: number; // protocol version 1
  app: 'FERMENT';
  recipe: CanonicalRecipe;
  checksum: number;
}

/**
 * Prosty szybki hash CRC32 / DJB2 do weryfikacji integralności receptury
 */
function computeChecksum(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Koduje recepturę do kompaktowego ciągu Base64 zdatnego do QR lub deep-linku
 */
export function encodeRecipeToShareUri(recipe: CanonicalRecipe): string {
  const jsonStr = JSON.stringify(recipe);
  const checksum = computeChecksum(jsonStr);

  const payload: SharedRecipePayload = {
    v: 1,
    app: 'FERMENT',
    recipe,
    checksum,
  };

  const payloadJson = JSON.stringify(payload);
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(payloadJson, 'utf8').toString('base64')
    : btoa(unescape(encodeURIComponent(payloadJson)));

  return `ferment://recipe?data=${encodeURIComponent(base64)}`;
}

/**
 * Dekoduje i weryfikuje recepturę z ciągu Base64 lub URI
 */
export function decodeRecipeFromShareUri(uriOrPayload: string): CanonicalRecipe {
  let base64 = uriOrPayload.trim();

  if (base64.startsWith('ferment://recipe?data=')) {
    const rawParam = base64.replace('ferment://recipe?data=', '');
    base64 = decodeURIComponent(rawParam);
  }

  let jsonStr = '';
  try {
    jsonStr = typeof Buffer !== 'undefined'
      ? Buffer.from(base64, 'base64').toString('utf8')
      : decodeURIComponent(escape(atob(base64)));
  } catch {
    throw new Error('Nieprawidłowy format danych Base64 receptury.');
  }

  let parsed: SharedRecipePayload;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('Błąd parsowania JSON receptury.');
  }

  if (parsed.app !== 'FERMENT' || parsed.v !== 1 || !parsed.recipe) {
    throw new Error('Niezgodny format protokołu wymiany receptur FERMENT.');
  }

  const recipeJson = JSON.stringify(parsed.recipe);
  const expectedChecksum = computeChecksum(recipeJson);

  if (parsed.checksum !== expectedChecksum) {
    throw new Error('Suma kontrolna receptury nie zgadza się! Dane mogły ulec uszkodzeniu.');
  }

  return parsed.recipe;
}
