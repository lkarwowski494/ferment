// ============================================================================
// Apps4Brew Studio — FERMENT Milk Species Coagulation & Proteolysis Profile Engine
// Cow, Goat, Sheep & Buffalo: Casein fractions, fat globule size, rennet & multiplier scaling
// ============================================================================

export type MilkSpeciesId = 'COW' | 'GOAT' | 'SHEEP' | 'BUFFALO';

export interface MilkSpeciesProfile {
  id: MilkSpeciesId;
  namePl: string;
  scientificName: string;
  typicalFatPctRange: [number, number];
  typicalProteinPctRange: [number, number];
  caseinWheyRatio: string;
  dominantCaseinFraction: string;
  meanFatGlobuleDiameterMicrons: number;
  calciumMgPer100g: number;
  baseFreshYieldPct: number; // np. 10.5% dla krowiego, 20.0% dla owczego
  rennetDoseMultiplier: number; // 1.0 dla krowiego, 0.75 dla owczego (bogaty w kazeinę)
  flocculationMultiplierFactor: number; // 1.0 dla krowiego, 1.15 dla koziego (kruchy skrzep)
  optimalCoagulationTempRangeC: [number, number];
  curdFirmnessCharacteristicsPl: string;
  lipolysisAndFlavorNotesPl: string;
  artisanalHandlingRulesPl: string[];
}

export const MILK_SPECIES_DATABASE: Record<MilkSpeciesId, MilkSpeciesProfile> = {
  COW: {
    id: 'COW',
    namePl: 'Mleko krowie (Standard)',
    scientificName: 'Bos taurus',
    typicalFatPctRange: [3.8, 4.4],
    typicalProteinPctRange: [3.2, 3.5],
    caseinWheyRatio: '80:20',
    dominantCaseinFraction: 'α_s1-kazeina (stabilny, mocny żel)',
    meanFatGlobuleDiameterMicrons: 4.0,
    calciumMgPer100g: 120,
    baseFreshYieldPct: 10.5,
    rennetDoseMultiplier: 1.0,
    flocculationMultiplierFactor: 1.0,
    optimalCoagulationTempRangeC: [31, 33],
    curdFirmnessCharacteristicsPl: 'Wzorcowy, sprężysty skrzep podpuszczkowy o równomiernej elastyczności.',
    lipolysisAndFlavorNotesPl: 'Zrównoważony profil maślany (diacetyl), umiarkowane uwalnianie krótkołańcuchowych kwasów tłuszczowych.',
    artisanalHandlingRulesPl: [
      'Standardowe cięcie harfą po uzyskaniu czystego złomu (clean break).',
      'Dla mleka pasteryzowanego konieczna suplementacja chlorku wapnia (0.2 g/L CaCl2).',
    ],
  },
  GOAT: {
    id: 'GOAT',
    namePl: 'Mleko kozie (Delikatne & Lipolityczne)',
    scientificName: 'Capra hircus',
    typicalFatPctRange: [3.6, 4.6],
    typicalProteinPctRange: [3.1, 3.6],
    caseinWheyRatio: '78:22',
    dominantCaseinFraction: 'β-kazeina (brak lub minimalna ilość α_s1 — bardzo miękki skrzep)',
    meanFatGlobuleDiameterMicrons: 3.2,
    calciumMgPer100g: 130,
    baseFreshYieldPct: 9.5,
    rennetDoseMultiplier: 1.05,
    flocculationMultiplierFactor: 1.15, // Dłuższy czas koagulacji dla zwięzłości
    optimalCoagulationTempRangeC: [29, 31],
    curdFirmnessCharacteristicsPl: 'Skrzep bardzo kruchy, aksamitny i podatny na rozpad (friable curd).',
    lipolysisAndFlavorNotesPl: 'Wysoka zawartość lotnych kwasów tłuszczowych (kapronowy C6, kaprylowy C8, kaprynowy C10) dających charakterystyczny bukiet kozi.',
    artisanalHandlingRulesPl: [
      'Niższa temperatura zaprawiania (29-31°C), aby skrzep nie uległ przedwczesnemu zacięciu.',
      'Krojenie powolne i delikatne — agresywne ruchy powodują rozbicie ziaren i zmętnienie serwatki tłuszczem.',
      'Po pierwszym cięciu odczekaj 8–10 minut (zamiast 5 min) na osadzenie ziarna.',
    ],
  },
  SHEEP: {
    id: 'SHEEP',
    namePl: 'Mleko owcze (Wysokoekstraktowe / Podwójny Uzysk)',
    scientificName: 'Ovis aries',
    typicalFatPctRange: [6.5, 8.5],
    typicalProteinPctRange: [5.5, 6.8],
    caseinWheyRatio: '82:18',
    dominantCaseinFraction: 'Wysokie stężenie micelarne kazeiny i fosforanu wapnia',
    meanFatGlobuleDiameterMicrons: 3.3,
    calciumMgPer100g: 190,
    baseFreshYieldPct: 20.0, // Podwójny uzysk względem krowiego!
    rennetDoseMultiplier: 0.75, // Zmniejszona doza podpuszczki, bo mleko ścina się błyskawicznie
    flocculationMultiplierFactor: 0.85,
    optimalCoagulationTempRangeC: [30, 32],
    curdFirmnessCharacteristicsPl: 'Skrzep niezwykle gęsty, zwarty i sprężysty (bardzo szybka koagulacja).',
    lipolysisAndFlavorNotesPl: 'Bogaty, maślano-karmelowy profil z wysoką zawartością sprzężonego kwasu linolowego (CLA).',
    artisanalHandlingRulesPl: [
      'Zmniejsz dawkę podpuszczki o 20–25% (25 IMCU/L zamiast 35 IMCU/L), aby uniknąć gumowatości.',
      'Pilnuj punktu flokulacji — następuje nawet po 8–10 minutach!',
      'Wybitna wydajność: 10L mleka owczego daje aż 2.0–2.2 kg sera (np. Bundz, Bryndza, Oscypek, Pecorino).',
    ],
  },
  BUFFALO: {
    id: 'BUFFALO',
    namePl: 'Mleko bawole (Pasta Filata / Mozzarella)',
    scientificName: 'Bubalus bubalis',
    typicalFatPctRange: [7.5, 9.2],
    typicalProteinPctRange: [4.2, 4.8],
    caseinWheyRatio: '82:18',
    dominantCaseinFraction: 'Wysoka zawartość kazeiny i zjonizowanego wapnia',
    meanFatGlobuleDiameterMicrons: 5.0,
    calciumMgPer100g: 180,
    baseFreshYieldPct: 17.0,
    rennetDoseMultiplier: 0.85,
    flocculationMultiplierFactor: 0.90,
    optimalCoagulationTempRangeC: [34, 36],
    curdFirmnessCharacteristicsPl: 'Elastyczny, gęsty żel o unikalnej termoplastyczności (idealny do ugniatania i ciągnięcia w gorącej wodzie).',
    lipolysisAndFlavorNotesPl: 'Słodki, kremowy, porcelanowo-biały miąższ (brak beta-karotenu w tłuszczu bawoła).',
    artisanalHandlingRulesPl: [
      'Wyższa temperatura zaprawiania (34-36°C) dla wykształcenia termoplastycznej struktury micelarnej.',
      'Skrzep wymaga wolnego ocieku serwatki do osiągnięcia pH 5.00–5.20 przed próbą rozciągania (spinning test).',
    ],
  },
};

export interface MilkSpeciesCalculationInput {
  speciesId: MilkSpeciesId;
  milkVolumeLiters: number;
  baseRennetImcuPerLiter?: number; // Domyślnie 35 IMCU/L
  baseFlocculationMultiplier?: number; // Domyślnie 3.0 (np. Gouda)
  customFatPct?: number;
  customProteinPct?: number;
}

export interface MilkSpeciesCalculationResult {
  species: MilkSpeciesProfile;
  milkVolumeLiters: number;
  recommendedRennetImcuPerLiter: number;
  totalRennetImcuRequired: number;
  rennetVolumeMlLiquid200Imcu: number;
  effectiveFlocculationMultiplier: number;
  expectedCheeseYieldKg: number;
  yieldRatioPct: number;
  wheyProteinRecoveryPotentialGrams: number; // Potencjał na Ricottę
  calciumNeedClassification: 'UNNECESSARY' | 'MODERATE' | 'ESSENTIAL_PASTEURIZED';
  temperatureRecommendationsC: [number, number];
  craftNotes: string[];
}

/**
 * Calculates species-specific rennet scaling, flocculation multiplier, cheese yield, and curd rules.
 */
export function calculateMilkSpeciesKinetics(
  input: MilkSpeciesCalculationInput
): MilkSpeciesCalculationResult {
  const {
    speciesId,
    milkVolumeLiters,
    baseRennetImcuPerLiter = 35,
    baseFlocculationMultiplier = 3.0,
    customFatPct,
    customProteinPct,
  } = input;

  const profile = MILK_SPECIES_DATABASE[speciesId];
  const safeVolume = Math.max(0.5, milkVolumeLiters);

  // Adjusted rennet IMCU per liter
  const recommendedRennetImcu = Math.round(baseRennetImcuPerLiter * profile.rennetDoseMultiplier * 10) / 10;
  const totalImcu = Math.round(recommendedRennetImcu * safeVolume);
  const rennetVolumeMl = Math.round((totalImcu / 200) * 100) / 100; // 200 IMCU/ml standard liquid

  // Adjusted flocculation multiplier
  const effectiveMultiplier =
    Math.round(baseFlocculationMultiplier * profile.flocculationMultiplierFactor * 100) / 100;

  // Expected fresh cheese yield (accounting for custom fat/protein if given)
  let yieldRatio = profile.baseFreshYieldPct;
  if (customProteinPct !== undefined && customFatPct !== undefined) {
    const meanProtein = (profile.typicalProteinPctRange[0] + profile.typicalProteinPctRange[1]) / 2;
    const proteinDelta = customProteinPct - meanProtein;
    yieldRatio = Math.max(6.0, Math.round((yieldRatio + proteinDelta * 2.0) * 10) / 10);
  }

  const expectedYieldKg = Math.round((safeVolume * (yieldRatio / 100)) * 100) / 100;

  // Potential sweet whey ricotta recovery: approx 50-60g albumin per 10L cow, 90-110g per 10L sheep
  const wheyVolumeL = safeVolume * 0.88;
  const wheyProteinFactor = speciesId === 'SHEEP' ? 12 : speciesId === 'BUFFALO' ? 9 : 6;
  const wheyRicottaGrams = Math.round(wheyVolumeL * wheyProteinFactor);

  const craftNotes: string[] = [profile.curdFirmnessCharacteristicsPl, ...profile.artisanalHandlingRulesPl];

  if (speciesId === 'SHEEP') {
    craftNotes.push(
      `Wysoka zawartość tłuszczu (${profile.typicalFatPctRange[0]}–${profile.typicalFatPctRange[1]}%) i białka sprawia, że mleko owcze daje ${expectedYieldKg} kg sera z ${safeVolume} L mleka (prawie 2x więcej niż krowie!).`
    );
  } else if (speciesId === 'GOAT') {
    craftNotes.push(
      'Mleko kozie ma naturalnie małe kuleczki tłuszczowe (brak wyraźnej warstwy śmietanki). Skrzep jest delikatny, nie przecinaj go zbyt szybko.'
    );
  }

  return {
    species: profile,
    milkVolumeLiters: safeVolume,
    recommendedRennetImcuPerLiter: recommendedRennetImcu,
    totalRennetImcuRequired: totalImcu,
    rennetVolumeMlLiquid200Imcu: rennetVolumeMl,
    effectiveFlocculationMultiplier: effectiveMultiplier,
    expectedCheeseYieldKg: expectedYieldKg,
    yieldRatioPct: yieldRatio,
    wheyProteinRecoveryPotentialGrams: wheyRicottaGrams,
    calciumNeedClassification: speciesId === 'SHEEP' ? 'UNNECESSARY' : 'MODERATE',
    temperatureRecommendationsC: profile.optimalCoagulationTempRangeC,
    craftNotes,
  };
}
