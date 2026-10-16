// ============================================================================
// Apps4Brew Studio — FERMENT Sensory Evaluation & Organoleptic Scoring Engine
// 6-Axis profiling, style-specific balance analysis & artisan critique scoring
// ============================================================================

import { SensoryEvaluation, BatchCategory } from '../data/db';

export interface SensoryProfileScores {
  acidity: number;   // 1-10
  salinity: number;  // 1-10
  firmness: number;  // 1-10
  creaminess: number;// 1-10
  pungency: number;  // 1-10
  nuttiness: number; // 1-10
}

export interface SensoryScoringResult {
  overallScore: number; // 0-100 pts
  grade: 'EXEMPLARY' | 'GOOD' | 'ACCEPTABLE' | 'FLAWED';
  balanceAssessment: string;
  identifiedFlaws: string[];
  craftRecommendations: string[];
}

/**
 * Evaluates sensory profile against category standards and calculates 0-100 score.
 */
export function evaluateSensoryProfile(
  category: BatchCategory,
  profile: SensoryProfileScores
): SensoryScoringResult {
  const a = Math.max(1, Math.min(10, profile.acidity));
  const s = Math.max(1, Math.min(10, profile.salinity));
  const f = Math.max(1, Math.min(10, profile.firmness));
  const c = Math.max(1, Math.min(10, profile.creaminess));
  const p = Math.max(1, Math.min(10, profile.pungency));
  const n = Math.max(1, Math.min(10, profile.nuttiness));

  let penalty = 0;
  const identifiedFlaws: string[] = [];
  const craftRecommendations: string[] = [];

  if (category === 'CHEESE') {
    // Ideal cheese: moderate acidity (4-6), moderate salt (4-6), good creaminess & nuttiness
    if (a > 7) {
      penalty += (a - 7) * 8;
      identifiedFlaws.push('Nadmierna kwasowość (posmak kredowy/twarogowy w serze twardym).');
      craftRecommendations.push('Przepłucz gęstwę ciepłą wodą (washing the curd) w celu usunięcia nadmiaru laktozy.');
    }
    if (s > 7) {
      penalty += (s - 7) * 8;
      identifiedFlaws.push('Przesolony miąższ.');
      craftRecommendations.push('Skróć czas kąpieli w solance o 15–20%.');
    } else if (s < 3) {
      penalty += (3 - s) * 7;
      identifiedFlaws.push('Niedosolony (płaski smak, ryzyko rozwoju niepożądanych bakterii).');
      craftRecommendations.push('Zwiększ stężenie solanki do min. 18% lub wydłuż czas kąpieli.');
    }
    if (p > 7) {
      penalty += (p - 7) * 6;
      identifiedFlaws.push('Zbyt ostra, piekąca nuta (możliwa lipoliza lub zjełczenie tłuszczu).');
    }
  } else if (category === 'VEG_FERMENT' || category === 'KIMCHI') {
    // Ideal veg: crisp firmness (6-9), high lactic acidity (5-8), solid salt (4-7)
    if (f < 4) {
      penalty += (4 - f) * 10;
      identifiedFlaws.push('Miękkie, kapciowate warzywa (utrata chrupkości, rozkład pektyn).');
      craftRecommendations.push('Dodaj liście dębu, chrzanu lub porzeczki (bogate w garbniki) oraz fermentuj w niższej temperaturze (<20°C).');
    }
    if (a < 4) {
      penalty += (4 - a) * 9;
      identifiedFlaws.push('Zbyt niska kwasowość (fermentacja nie wystartowała prawidłowo).');
      craftRecommendations.push('Upewnij się, że naczynie stoi w temp. min. 19°C i nie używasz chlorowanej wody.');
    }
  } else {
    // Kombucha & Vinegars: crisp tartness, very low salinity
    if (s > 3) {
      penalty += (s - 3) * 12;
      identifiedFlaws.push('Niepożądana słoność w napoju fermentowanym.');
    }
    if (a < 4) {
      penalty += (4 - a) * 8;
      identifiedFlaws.push('Mdły, za słodki smak (niedokończona fermentacja octowa/glukonowa).');
      craftRecommendations.push('Wydłuż czas 1F o 3–5 dni i zapewnij lepszy dostęp tlenu.');
    }
  }

  const overallScore = Math.max(20, Math.min(100, Math.round(100 - penalty)));

  let grade: SensoryScoringResult['grade'] = 'GOOD';
  let balanceAssessment = 'Partia harmonijna, o czystym profilu fermentacyjnym.';

  if (overallScore >= 90) {
    grade = 'EXEMPLARY';
    balanceAssessment = 'Wybitna harmonia smakowa. Wzorcowa równowaga sensoryczna.';
  } else if (overallScore >= 75) {
    grade = 'GOOD';
    balanceAssessment = 'Bardzo dobry, zbalansowany wyrób rzemieślniczy.';
  } else if (overallScore >= 55) {
    grade = 'ACCEPTABLE';
    balanceAssessment = 'Wyrób akceptowalny, z wyczuwalnymi drobnymi dysproporcjami.';
  } else {
    grade = 'FLAWED';
    balanceAssessment = 'Wykryto istotne wady organoleptyczne wymagające korekty technologicznej.';
  }

  return {
    overallScore,
    grade,
    balanceAssessment,
    identifiedFlaws,
    craftRecommendations,
  };
}
