// ============================================================================
// Apps4Brew Studio — FERMENT Botanical Extraction & Pectinase Tannin Engine
// Crispness retention, enzyme denaturation, garlic allicin kinetics, and 2F botanicals
// ============================================================================

export type BotanicalSourceId =
  | 'OAK_LEAF' // Liść dębu (Quercus robur)
  | 'SOUR_CHERRY_LEAF' // Liść wiśni (Prunus cerasus)
  | 'BLACKCURRANT_LEAF' // Liść czarnej porzeczki (Ribes nigrum)
  | 'HORSERADISH_ROOT' // Korzeń chrzanu (Armoracia rusticana)
  | 'HORSERADISH_LEAF' // Liść chrzanu
  | 'GARLIC_CLOVE' // Czosnek (Allium sativum)
  | 'BAY_LEAF' // Liść laurowy (Laurus nobilis)
  | 'GRAPE_LEAF' // Liść winorośli (Vitis vinifera)
  | 'BLACK_TEA_LEAF' // Liście czarnej herbaty (Camellia sinensis)
  | 'HOP_PELLETS' // Granulat chmielowy (Humulus lupulus)
  | 'DRIED_LAVENDER' // Suszona lawenda (Lavandula angustifolia)
  | 'HIBISCUS_FLOWERS' // Kwiat hibiskusa (Hibiscus sabdariffa)
  | 'FRESH_GINGER'; // Świeży imbir (Zingiber officinale)

export type GarlicPrepMethod =
  | 'WHOLE_UNPEELED' // Ząbki w łupinie (5% allicyny)
  | 'WHOLE_PEELED' // Ząbki obrane w całości (20% allicyny)
  | 'BRUISED_CRUSHED' // Ząbki zgniecione nożem (85% allicyny)
  | 'MINCED_GRATED'; // Ząbki drobno posiekane/starte (100% allicyny)

export interface BotanicalMeta {
  id: BotanicalSourceId;
  namePl: string;
  botanicalName: string;
  category: 'VEG_CRISPNESS' | 'ANTIMICROBIAL' | 'BEVERAGE_2F';
  tanninsMgPerGram: number; // Zawartość garbników w mg/g surowca
  activeCompounds: string;
  typicalDoseDescription: string;
}

export const BOTANICAL_DATABASE: Record<BotanicalSourceId, BotanicalMeta> = {
  OAK_LEAF: {
    id: 'OAK_LEAF',
    namePl: 'Liście dębu szypułkowego',
    botanicalName: 'Quercus robur',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 45,
    activeCompounds: 'Elagotaniny, kwas galusowy',
    typicalDoseDescription: '2-4 świeże lub suszone liście na 1 kg warzyw',
  },
  SOUR_CHERRY_LEAF: {
    id: 'SOUR_CHERRY_LEAF',
    namePl: 'Liście wiśni',
    botanicalName: 'Prunus cerasus',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 30,
    activeCompounds: 'Garbniki skondensowane, estry kumarynowe',
    typicalDoseDescription: '3-5 liści na słoik 1L ogórków',
  },
  BLACKCURRANT_LEAF: {
    id: 'BLACKCURRANT_LEAF',
    namePl: 'Liście czarnej porzeczki',
    botanicalName: 'Ribes nigrum',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 25,
    activeCompounds: 'Polifenole, kwercetyna, witamina C',
    typicalDoseDescription: '3-6 liści na słoik; dodaje świeżego aromatu cassis',
  },
  HORSERADISH_ROOT: {
    id: 'HORSERADISH_ROOT',
    namePl: 'Korzeń chrzanu',
    botanicalName: 'Armoracia rusticana',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 15,
    activeCompounds: 'Synigryna (izotiocyjanian allilu), peroksydaza',
    typicalDoseDescription: '10-20 g korzenia pociętego w słupki na 1 kg warzyw',
  },
  HORSERADISH_LEAF: {
    id: 'HORSERADISH_LEAF',
    namePl: 'Liście chrzanu',
    botanicalName: 'Armoracia rusticana',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 20,
    activeCompounds: 'Glukozynolany, flawonoidy',
    typicalDoseDescription: '1 duży liść do wyścielenia dna lub przykrycia słoja od góry',
  },
  GARLIC_CLOVE: {
    id: 'GARLIC_CLOVE',
    namePl: 'Czosnek pospolity',
    botanicalName: 'Allium sativum',
    category: 'ANTIMICROBIAL',
    tanninsMgPerGram: 2,
    activeCompounds: 'Alliina przekształcana w allicynę przez alliinazę',
    typicalDoseDescription: '10-20 g (3-5 ząbków) na 1 kg kiszonki',
  },
  BAY_LEAF: {
    id: 'BAY_LEAF',
    namePl: 'Liść laurowy (Wawrzyn)',
    botanicalName: 'Laurus nobilis',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 22,
    activeCompounds: 'Eugenol, 1,8-cyneol, garbniki katechinowe',
    typicalDoseDescription: '1-2 liście na słój',
  },
  GRAPE_LEAF: {
    id: 'GRAPE_LEAF',
    namePl: 'Liście winorośli',
    botanicalName: 'Vitis vinifera',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 35,
    activeCompounds: 'Resweratrol, garbniki skondensowane',
    typicalDoseDescription: '2-4 liście na słój (klasyk śródziemnomorski)',
  },
  BLACK_TEA_LEAF: {
    id: 'BLACK_TEA_LEAF',
    namePl: 'Czarna herbata (Mocny ekstrakt)',
    botanicalName: 'Camellia sinensis',
    category: 'VEG_CRISPNESS',
    tanninsMgPerGram: 100,
    activeCompounds: 'Teaflawiny, tearubiginy, katechiny',
    typicalDoseDescription: 'Awaryjny dodatek dla mieszczuchów: 1-2 g suszu na 1L zalewy',
  },
  HOP_PELLETS: {
    id: 'HOP_PELLETS',
    namePl: 'Chmiel aromatyczny (Granulat)',
    botanicalName: 'Humulus lupulus',
    category: 'BEVERAGE_2F',
    tanninsMgPerGram: 40,
    activeCompounds: 'Humulon, lupulon, mircen, linalol',
    typicalDoseDescription: '1-2 g/L kombuchy na zimno (dry-hopping 48h)',
  },
  DRIED_LAVENDER: {
    id: 'DRIED_LAVENDER',
    namePl: 'Kwiaty lawendy suszone',
    botanicalName: 'Lavandula angustifolia',
    category: 'BEVERAGE_2F',
    tanninsMgPerGram: 18,
    activeCompounds: 'Linalol, octan linalilu',
    typicalDoseDescription: 'Maks. 0.5-1 g/L kombuchy (ostrożnie, profil mydlany!)',
  },
  HIBISCUS_FLOWERS: {
    id: 'HIBISCUS_FLOWERS',
    namePl: 'Kwiaty hibiskusa (Karkadeh)',
    botanicalName: 'Hibiscus sabdariffa',
    category: 'BEVERAGE_2F',
    tanninsMgPerGram: 35,
    activeCompounds: 'Antocyjany, kwas cytrynowy, kwas hibiskusowy',
    typicalDoseDescription: '3-5 g/L w 2F dla rubinowego koloru i rześkiej kwasowości',
  },
  FRESH_GINGER: {
    id: 'FRESH_GINGER',
    namePl: 'Świeży imbir (Plasterki)',
    botanicalName: 'Zingiber officinale',
    category: 'BEVERAGE_2F',
    tanninsMgPerGram: 8,
    activeCompounds: 'Gingerole, szoagole, cyngiberen',
    typicalDoseDescription: '5-10 g/L w 2F dla rozgrzewającej ostrości',
  },
};

export interface BotanicalDoseInput {
  botanicalId: BotanicalSourceId;
  weightGrams: number;
}

export interface VegCrispnessCalculationInput {
  vegetableWeightKg: number;
  brineVolumeLiters: number;
  botanicals: BotanicalDoseInput[];
  garlicGrams?: number;
  garlicPrep?: GarlicPrepMethod;
}

export interface VegCrispnessResult {
  totalTanninsMg: number;
  tanninConcentrationMgPerKg: number;
  targetMinimumTanninsMg: number;
  crispnessProtectionRatioPct: number;
  crispnessVerdict: 'INADEQUATE_RISK_OF_MUSHY' | 'MODERATE_PROTECTION' | 'OPTIMAL_CRISP' | 'OVER_ASTRINGENT';
  verdictLabelPl: string;
  garlicAllicinOutputMg?: number;
  garlicImpactNotes?: string;
  dominantActiveCompounds: string[];
  craftRecommendations: string[];
}

/**
 * Calculates tannin enzyme denaturation threshold and garlic allicin kinetics.
 */
export function calculateVegCrispnessProtection(input: VegCrispnessCalculationInput): VegCrispnessResult {
  const {
    vegetableWeightKg,
    brineVolumeLiters,
    botanicals,
    garlicGrams = 0,
    garlicPrep = 'BRUISED_CRUSHED',
  } = input;

  const totalVegMassKg = Math.max(0.2, vegetableWeightKg);
  // Target: 80 mg active tannins per kg of vegetables to fully complex pectinolytic enzymes
  const targetMinimumTanninsMg = Math.round(totalVegMassKg * 80);

  let totalTanninsMg = 0;
  const activeCompoundsSet = new Set<string>();

  botanicals.forEach((b) => {
    const meta = BOTANICAL_DATABASE[b.botanicalId];
    if (meta) {
      const extractedTannins = b.weightGrams * meta.tanninsMgPerGram;
      totalTanninsMg += extractedTannins;
      meta.activeCompounds.split(',').forEach((c) => activeCompoundsSet.add(c.trim()));
    }
  });

  totalTanninsMg = Math.round(totalTanninsMg * 10) / 10;
  const tanninConcentrationMgPerKg = Math.round((totalTanninsMg / totalVegMassKg) * 10) / 10;
  const crispnessProtectionRatioPct = Math.round((totalTanninsMg / targetMinimumTanninsMg) * 100);

  let crispnessVerdict: VegCrispnessResult['crispnessVerdict'] = 'INADEQUATE_RISK_OF_MUSHY';
  let verdictLabelPl = 'Niedostateczna ochrona pektyn — wysokie ryzyko miękkich/papkowatych kiszonek!';

  if (crispnessProtectionRatioPct > 200) {
    crispnessVerdict = 'OVER_ASTRINGENT';
    verdictLabelPl = 'Nadmiar garbników (> 200%) — ryzyko cierpkiego posmaku i ściągania języka.';
  } else if (crispnessProtectionRatioPct >= 90) {
    crispnessVerdict = 'OPTIMAL_CRISP';
    verdictLabelPl = 'Optymalna dawka garbników — enzymy pektynazy w pełni zdenaturowane (idealna chrupkość)!';
  } else if (crispnessProtectionRatioPct >= 50) {
    crispnessVerdict = 'MODERATE_PROTECTION';
    verdictLabelPl = 'Umiarkowana ochrona — zadowalająca, lecz dodaj 2 liście dębu lub wiśni dla pełnej trwałości.';
  }

  // Garlic allicin calculation
  let garlicAllicinOutputMg: number | undefined;
  let garlicImpactNotes: string | undefined;

  if (garlicGrams > 0) {
    let extractionEfficiency = 0.85; // default crushed
    switch (garlicPrep) {
      case 'WHOLE_UNPEELED':
        extractionEfficiency = 0.05;
        break;
      case 'WHOLE_PEELED':
        extractionEfficiency = 0.2;
        break;
      case 'BRUISED_CRUSHED':
        extractionEfficiency = 0.85;
        break;
      case 'MINCED_GRATED':
        extractionEfficiency = 1.0;
        break;
    }

    // 1g raw garlic contains ~3.5 mg allicin potential
    garlicAllicinOutputMg = Math.round(garlicGrams * 3.5 * extractionEfficiency * 10) / 10;

    const allicinPerLiterBrine = brineVolumeLiters > 0 ? garlicAllicinOutputMg / brineVolumeLiters : 0;
    if (garlicPrep === 'MINCED_GRATED' && garlicGrams > totalVegMassKg * 20) {
      garlicImpactNotes =
        `Bardzo wysoka dawka allicyny (${garlicAllicinOutputMg} mg)! Drobno starty czosnek może spowolnić początkowy start pożytecznych bakterii kwasu mlekowego (LAB).`;
    } else if (garlicPrep === 'WHOLE_UNPEELED') {
      garlicImpactNotes =
        'Ząbki w łupinie uwalniają tylko 5% allicyny. Zmiażdż ząbki płazem noża, aby aktywować alliinazę przed włożeniem do słoika.';
    } else {
      garlicImpactNotes =
        `Aktywna allicyna: ${garlicAllicinOutputMg} mg (${allicinPerLiterBrine.toFixed(1)} mg/L). Bezpieczna tarcza bakteriobójcza przeciwko coliformom bez hamowania bakterii Lactobacillus.`;
    }
    activeCompoundsSet.add('Allicyna');
    activeCompoundsSet.add('Dwusiarczek allilu');
  }

  // Recommendations
  const craftRecommendations: string[] = [];
  if (crispnessVerdict === 'INADEQUATE_RISK_OF_MUSHY') {
    craftRecommendations.push(
      'Dodaj 2-4 świeże liście dębu, wiśni lub czarnej porzeczki. Zawarte w nich garbniki hydrolizujące tworzą kompleksy z enzymami pektolitycznymi, chroniąc ścianki komórkowe ogórków przed rozpadem.'
    );
  }
  if (!botanicals.some((b) => b.botanicalId === 'HORSERADISH_ROOT' || b.botanicalId === 'HORSERADISH_LEAF')) {
    craftRecommendations.push(
      'Warto dodać 10-15g korzenia chrzanu — synigryna wydziela izotiocyjanian allilu, naturalny fitoncyd zapobiegający kożuchowaniu przez drożdże Kahm.'
    );
  }

  return {
    totalTanninsMg,
    tanninConcentrationMgPerKg,
    targetMinimumTanninsMg,
    crispnessProtectionRatioPct,
    crispnessVerdict,
    verdictLabelPl,
    garlicAllicinOutputMg,
    garlicImpactNotes,
    dominantActiveCompounds: Array.from(activeCompoundsSet),
    craftRecommendations,
  };
}
