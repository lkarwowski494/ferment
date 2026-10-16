// ============================================================================
// Apps4Brew Studio — FERMENT Dynamic Fermentation Timeline & Milestone Engine
// Temperature kinetic scaling (Q10), turbulent CO2 jar burping & tasting gates
// Adapted from Apps4Brew Studio Standards (Słoik & Piekarz).
// ============================================================================

import { CANONICAL_RECIPES, CanonicalRecipe } from './canonical-recipes';

export interface CalculatedMilestone {
  day: number;
  title: string;
  description: string;
  estimatedTimestamp: number;
  formattedDate: string;
  isActionRequired: boolean;
  isTastingCheckpoint: boolean;
  isBurpingRequired: boolean;
}

export interface FermentationTimelineResult {
  recipeId: string;
  recipeName: string;
  category: CanonicalRecipe['category'];
  startedAtTimestamp: number;
  ambientTempC: number;
  speedMultiplier: number;
  nominalDays: number;
  adjustedDays: number;
  estimatedCompletionTimestamp: number;

  burpingDays: number[];
  milestones: CalculatedMilestone[];
  tastingCheckpointTimestamp?: number;
  coldStorageRecommendedTimestamp?: number;

  summaryAdvicePl: string;
}

export interface FermentationTimelineInput {
  recipeId: string;
  startedAtTimestamp: number;
  ambientTempC?: number;
}

const CATEGORY_MILESTONES: Record<
  CanonicalRecipe['category'],
  Array<{ day: number; title: string; description: string; actionRequired?: string; isTastingCheckpoint?: boolean }>
> = {
  CHEESE: [
    { day: 1, title: 'Kąpiel w Solance & Osuszanie', description: 'Solankowanie krążka i wstępne obsuszanie skórki w przewiewnym miejscu.', actionRequired: 'Przełóż do solanki' },
    { day: 3, title: 'Affinage: Pierwsze Obrócenie', description: 'Obróć krążek w piwniczce o 180° i skontroluj wilgotność podkładki.', actionRequired: 'Obróć krążek' },
    { day: 14, title: 'Przegląd Skórki & Pielęgnacja', description: 'Szczotkowanie lub przemycie solanką zbuforowaną; ewentualne nałożenie wosku lub polioctanu.', actionRequired: 'Zbadaj stan skórki' },
    { day: 30, title: 'Próba Organoleptyczna (Młody Ser)', description: 'Ocena konsystencji, aromatu maślanego i ubytku masy (% shrinkage).', isTastingCheckpoint: true },
    { day: 60, title: 'Dojrzałość Konsumpcyjna', description: 'Pełen bukiet smakowy, proteoliza kazeiny, stabilna elastyczna struktura.' },
  ],
  VEG_FERMENT: [
    { day: 1, title: 'Faza Burzliwa (Leuconostoc)', description: 'Intensywne wydzielanie CO2 i mętna solanka. Odgazuj słoik (burping).', actionRequired: 'Uchyl wieczko / odgazuj słoik' },
    { day: 3, title: 'Bariera pH 4.60 (Lactobacillus plantarum)', description: 'Spadek pH poniżej 4.60. Bezpieczeństwo biologiczne i pierwsza próba kwasowości.', isTastingCheckpoint: true },
    { day: 7, title: 'Ugaszenie Burzliwości & Chłodzenie', description: 'Koniec intensywnego gazowania. Przenieś słoje do chłodu/lodówki (4°C) by spowolnić zakwaszanie.', actionRequired: 'Przenieś do lodówki (4°C)' },
    { day: 14, title: 'Dojrzałość Stołowa', description: 'Pełna chrupkość, harmonijna kwasowość, idealna do podania.' },
  ],
  KOMBUCHA: [
    { day: 3, title: 'Formowanie Nowego SCOBY', description: 'Na powierzchni pojawia się cienka, przezroczysta błonka celulozy.', actionRequired: 'Nie poruszaj naczynia' },
    { day: 7, title: 'Próba Balansu Cukier-Kwas', description: 'Ocena balansu słodyczy herbaty i kwasu octowego/glukonowego.', isTastingCheckpoint: true },
    { day: 10, title: 'Koniec 1F & Rozlew 2F', description: 'Zlanie kombuchy do szczelnych butelek z dodatkiem soków owocowych lub imbiru.', actionRequired: 'Rozlej do butelek 2F' },
    { day: 13, title: 'Wysycenie CO2 & Schłodzenie', description: 'Nagazowanie w butelkach. Schłodź do 4°C przed otwarciem.', actionRequired: 'Wstaw do lodówki' },
  ],
  VINEGAR: [
    { day: 7, title: 'Rozwój Błony Mycoderma aceti', description: 'Kożuszek matki octowej pokrywa powierzchnię wina/cydru.', actionRequired: 'Sprawdź dopływ powietrza' },
    { day: 28, title: 'Próba Miareczkowa Kwasu Octowego', description: 'Miareczkowanie 0.1M NaOH — weryfikacja czy kwasowość osiągnęła >= 5%.', isTastingCheckpoint: true },
    { day: 60, title: 'Koniec Fermentacji & Butelkowanie', description: 'Zlanie octu znad osadu (dekantacja) i dojrzewanie beztlenowe.' },
  ],
};

/**
 * Calculates adaptive fermentation timeline, milestone events and jar burping schedule
 */
export function calculateFermentationTimeline(input: FermentationTimelineInput): FermentationTimelineResult {
  const { recipeId, startedAtTimestamp, ambientTempC = 20 } = input;

  const recipe = CANONICAL_RECIPES.find((r) => r.id === recipeId);
  if (!recipe) {
    throw new Error(`Nie znaleziono receptury o identyfikatorze: ${recipeId}`);
  }

  const clampedTemp = Math.max(12, Math.min(32, ambientTempC));

  // Determine Q10 factor by category: 2.2 for LAB, 2.0 for Kombucha SCOBY, 2.1 for cheese
  let q10 = 2.1;
  if (recipe.category === 'VEG_FERMENT') q10 = 2.2;
  else if (recipe.category === 'KOMBUCHA') q10 = 2.0;

  const tempDelta = clampedTemp - 20.0;
  const speedMultiplier = Math.round(Math.pow(q10, tempDelta / 10.0) * 100) / 100;
  const safeVelocity = Math.max(0.1, speedMultiplier);

  const nominalDays = Math.max(1, recipe.agingDays || 7);
  const adjustedDays = Math.max(1, Math.round((nominalDays / safeVelocity) * 10) / 10);
  const totalDurationMs = adjustedDays * 24 * 60 * 60 * 1000;
  const estimatedCompletionTimestamp = startedAtTimestamp + totalDurationMs;

  const burpingDays: number[] = [];
  const calculatedMilestones: CalculatedMilestone[] = [];
  let tastingCheckpointTimestamp: number | undefined;
  let coldStorageRecommendedTimestamp: number | undefined;

  // For sealed anaerobic vegetable ferments or kombucha 2F, turbulent gas release occurs during first 3-5 days
  if (recipe.category === 'VEG_FERMENT' || recipe.category === 'KOMBUCHA') {
    const burpDaysLimit = Math.min(adjustedDays, Math.max(2, Math.round(4 / safeVelocity)));
    for (let d = 1; d <= burpDaysLimit; d++) {
      burpingDays.push(d);
    }
  }

  const baseMilestones = CATEGORY_MILESTONES[recipe.category] || CATEGORY_MILESTONES.VEG_FERMENT;

  for (const m of baseMilestones) {
    const adjustedDay = Math.max(1, Math.round((m.day / safeVelocity) * 10) / 10);
    const milestoneTimestamp = startedAtTimestamp + adjustedDay * 24 * 60 * 60 * 1000;

    const dateObj = new Date(milestoneTimestamp);
    const dayStr = String(dateObj.getDate()).padStart(2, '0');
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const formattedDate = `${dayStr}.${monthStr}`;

    const isBurping = burpingDays.includes(Math.round(adjustedDay));
    const isUrgent = Boolean(m.actionRequired);

    calculatedMilestones.push({
      day: adjustedDay,
      title: m.title,
      description: m.description,
      estimatedTimestamp: milestoneTimestamp,
      formattedDate,
      isActionRequired: isUrgent,
      isTastingCheckpoint: Boolean(m.isTastingCheckpoint),
      isBurpingRequired: isBurping,
    });

    if (m.isTastingCheckpoint && !tastingCheckpointTimestamp) {
      tastingCheckpointTimestamp = milestoneTimestamp;
    }

    if (
      (m.actionRequired?.toLowerCase().includes('lodów') ||
        m.actionRequired?.toLowerCase().includes('chłod') ||
        m.actionRequired?.toLowerCase().includes('piwnic')) &&
      !coldStorageRecommendedTimestamp
    ) {
      coldStorageRecommendedTimestamp = milestoneTimestamp;
    }
  }

  let summaryAdvicePl = '';
  if (safeVelocity > 1.25) {
    summaryAdvicePl = `Przyspieszona fermentacja (${safeVelocity}x) z powodu podwyższonej temperatury (${clampedTemp}°C). Kontroluj odgazowywanie słoików codziennie.`;
  } else if (safeVelocity < 0.8) {
    summaryAdvicePl = `Spowolniona fermentacja (${safeVelocity}x) w chłodnym otoczeniu (${clampedTemp}°C). Zalecane docieplenie naczynia do 20–22°C.`;
  } else {
    summaryAdvicePl = `Standardowe tempo fermentacji w optymalnej temperaturze pokojowej (${clampedTemp}°C).`;
  }

  return {
    recipeId: recipe.id,
    recipeName: recipe.name,
    category: recipe.category,
    startedAtTimestamp,
    ambientTempC: clampedTemp,
    speedMultiplier: safeVelocity,
    nominalDays,
    adjustedDays,
    estimatedCompletionTimestamp,
    burpingDays,
    milestones: calculatedMilestones,
    tastingCheckpointTimestamp,
    coldStorageRecommendedTimestamp,
    summaryAdvicePl,
  };
}

/**
 * Convenience helper to calculate dynamic timeline for any batch from SQLite store
 */
export function getTimelineForBatch(
  batch: { category: string; styleName?: string; createdAt: number },
  ambientTempC: number = 20
): FermentationTimelineResult {
  const styleLower = (batch.styleName || '').toLowerCase();
  let matchedRecipe = CANONICAL_RECIPES.find(
    (r) =>
      r.name.toLowerCase().includes(styleLower) ||
      styleLower.includes(r.name.toLowerCase()) ||
      r.id.toLowerCase() === styleLower
  );

  if (!matchedRecipe) {
    if (batch.category === 'CHEESE') {
      matchedRecipe = CANONICAL_RECIPES.find((r) => r.id === 'rec_gouda_zagrodowa');
    } else if (batch.category === 'VEG_FERMENT' || batch.category === 'KIMCHI') {
      matchedRecipe = CANONICAL_RECIPES.find((r) => r.id === 'rec_kimchi_baechu');
    } else if (batch.category === 'KOMBUCHA') {
      matchedRecipe = CANONICAL_RECIPES.find((r) => r.id === 'rec_kombucha_sencha');
    } else if (batch.category === 'VINEGAR') {
      matchedRecipe = CANONICAL_RECIPES.find((r) => r.id === 'rec_ocet_jablkowy');
    }
  }

  const recipeId = matchedRecipe?.id || 'rec_gouda_zagrodowa';
  return calculateFermentationTimeline({
    recipeId,
    startedAtTimestamp: batch.createdAt,
    ambientTempC,
  });
}
