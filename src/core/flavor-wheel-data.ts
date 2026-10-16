// ============================================================================
// Apps4Brew Studio — FERMENT Microbiological Flavor Wheel Data
// Sensory lexicon for artisanal cheeses, lactic ferments, kombuchas and vinegars
// 40 Descriptors across 5 Fundamental Microbial Flavor Vectors
// ============================================================================

export type FlavorCategoryKey = 'LACTIC' | 'FRUITY_ACID' | 'NUTTY_CARAMEL' | 'EARTHY_FUNGAL' | 'ANIMAL_PUNGENT';

export interface FlavorDescriptor {
  id: string;
  category: FlavorCategoryKey;
  subcategory: string;
  label: string;
  description: string;
  chemicalOrigin: string; // e.g. Diacetyl, Acetic acid, 1-octen-3-ol
}

export interface FlavorCategoryMeta {
  id: FlavorCategoryKey;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  icon: string;
}

export const FLAVOR_CATEGORIES: FlavorCategoryMeta[] = [
  {
    id: 'LACTIC',
    label: 'Mleczne & Maślane',
    description: 'Pierwotne nuty laktozowe, maślane i kwasomlekowe fermentacji LAB',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeBorder: '#FDE68A',
    icon: '🥛',
  },
  {
    id: 'FRUITY_ACID',
    label: 'Kwasowo-Owocowe',
    description: 'Estry drożdżowe, kwas jabłkowy, cytrynowy i lotna kwasowość octowa',
    color: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeBorder: '#BBF7D0',
    icon: '🍏',
  },
  {
    id: 'NUTTY_CARAMEL',
    label: 'Orzechowo-Karmelowe',
    description: 'Produkty zaawansowanej proteolizy, reakcji Maillarda i dojrzewania',
    color: '#EA580C',
    badgeBg: '#FFEDD5',
    badgeBorder: '#FED7AA',
    icon: '🌰',
  },
  {
    id: 'EARTHY_FUNGAL',
    label: 'Ziemisto-Grzybowe',
    description: 'Metabolity pleśni szlachetnych (Penicillium) i mikroklimatu jaskini',
    color: '#475569',
    badgeBg: '#F1F5F9',
    badgeBorder: '#CBD5E1',
    icon: '🍄',
  },
  {
    id: 'ANIMAL_PUNGENT',
    label: 'Zwierzęco-Pikantne',
    description: 'Bakterie maziowe (Brevibacterium), tiole czosnkowe, lipoliza kwasów tłuszczowych',
    color: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeBorder: '#FECACA',
    icon: '🧀',
  },
];

export const FLAVOR_DESCRIPTORS: FlavorDescriptor[] = [
  // 1. LACTIC (8 descriptors)
  {
    id: 'fl_fresh_milk',
    category: 'LACTIC',
    subcategory: 'Słodkie mleko',
    label: 'Świeże mleko / Śmietanka',
    description: 'Łagodny, słodkawy profil typowy dla młodych serów nieprasowanych i skrzepu.',
    chemicalOrigin: 'Laktoza, trójglicerydy mleka',
  },
  {
    id: 'fl_butter_diacetyl',
    category: 'LACTIC',
    subcategory: 'Maślane',
    label: 'Świeże masło / Diacetyl',
    description: 'Aksamitny, maślany posmak charakterystyczny dla kultur mezofilnych typu LD.',
    chemicalOrigin: 'Diacetyl (2,3-butanodion)',
  },
  {
    id: 'fl_cultured_buttermilk',
    category: 'LACTIC',
    subcategory: 'Kwasomlekowe',
    label: 'Maślanka / Zsiadłe mleko',
    description: 'Czysty, świeży kwas mlekowy dający rześkość i strukturę w serach korycińskich i twarogach.',
    chemicalOrigin: 'Kwas L-mlekowy',
  },
  {
    id: 'fl_sweet_whey',
    category: 'LACTIC',
    subcategory: 'Serwatkowe',
    label: 'Słodka serwatka / Ricotta',
    description: 'Subtelny, mleczno-albuminowy aromat świeżej ricotty i odciekającej serwatki.',
    chemicalOrigin: 'Laktoza, beta-laktoglobulina',
  },
  {
    id: 'fl_condensed_milk',
    category: 'LACTIC',
    subcategory: 'Karmelizowane mleko',
    label: 'Mleko skondensowane / Dulce',
    description: 'Gęsty, mleczno-słodkawy profil serów serwatkowych typu Brunost (Gjetost).',
    chemicalOrigin: 'Skarmelizowana laktoza, laktuloza',
  },
  {
    id: 'fl_greek_yogurt',
    category: 'LACTIC',
    subcategory: 'Jogurtowe',
    label: 'Gęsty jogurt / Acydofilne',
    description: 'Rześki, głęboki kwas z termofilnych kultur jogurtowych.',
    chemicalOrigin: 'Kwas D/L-mlekowy, acetaldehyd',
  },
  {
    id: 'fl_quark_cream',
    category: 'LACTIC',
    subcategory: 'Twarogowe',
    label: 'Kremowy twaróg / Quark',
    description: 'Klasyczny kwasowo-kremowy profil tradycyjnego polskiego twarogu klinkowego.',
    chemicalOrigin: 'Lactococcus lactis, kwas mlekowy',
  },
  {
    id: 'fl_clarified_ghee',
    category: 'LACTIC',
    subcategory: 'Gotowane masło',
    label: 'Topione masło / Ghee',
    description: 'Głęboki, orzechowo-maślany profil podsuszanego skrzepu.',
    chemicalOrigin: 'Delta-laktony, laktony gamma',
  },

  // 2. FRUITY_ACID (8 descriptors)
  {
    id: 'fl_green_apple',
    category: 'FRUITY_ACID',
    subcategory: 'Jabłkowe',
    label: 'Zielone jabłko / Kwas jabłkowy',
    description: 'Wyrazista, orzeźwiająca kwasowość w młodym cydrze, octach jabłkowych i wczesnej kombusze.',
    chemicalOrigin: 'Kwas jabłkowy, octan etylu',
  },
  {
    id: 'fl_sharp_acetic',
    category: 'FRUITY_ACID',
    subcategory: 'Octowe',
    label: 'Czysty kwas octowy',
    description: 'Przeszywająca, lotna kwasowość w żywych octach rzemieślniczych i dojrzałej kombusze.',
    chemicalOrigin: 'Kwas octowy (Acetobacter aceti)',
  },
  {
    id: 'fl_tropical_ester',
    category: 'FRUITY_ACID',
    subcategory: 'Tropikalne',
    label: 'Ananas / Dojrzała marakuja',
    description: 'Estry wytwarzane przez drożdże podczas refermentacji kombuchy (2F) z owocami.',
    chemicalOrigin: 'Maślan etylu, heksanian etylu',
  },
  {
    id: 'fl_citrus_zest',
    category: 'FRUITY_ACID',
    subcategory: 'Cytrusowe',
    label: 'Skórka cytryny / Limonka',
    description: 'Jasna, wibrująca kwasowość w kiszonkach cytrynowych i lekkich kombuchach ziołowych.',
    chemicalOrigin: 'Kwas cytrynowy, limonen',
  },
  {
    id: 'fl_pickled_plum',
    category: 'FRUITY_ACID',
    subcategory: 'Śliwkowe',
    label: 'Kiszona śliwka / Umeboshi',
    description: 'Złożona, owocowo-słona kwasowość kiszonych owoców pestkowych.',
    chemicalOrigin: 'Kwas mlekowy, benzaldehyd',
  },
  {
    id: 'fl_red_currant',
    category: 'FRUITY_ACID',
    subcategory: 'Jagodowe',
    label: 'Czerwona porzeczka / Cierpkość',
    description: 'Świeża, cierpko-owocowa nuta z fermentacji jagód i octu porzeczkowego.',
    chemicalOrigin: 'Polifenole, kwas jabłkowy',
  },
  {
    id: 'fl_tartaric_wine',
    category: 'FRUITY_ACID',
    subcategory: 'Winne',
    label: 'Kwas winowy / Cydrowy',
    description: 'Dojrzały, wytrawny profil octu winnego i leżakowanego cydru jabłkowego.',
    chemicalOrigin: 'Kwas winowy, bursztynian diacetylu',
  },
  {
    id: 'fl_ripe_pear',
    category: 'FRUITY_ACID',
    subcategory: 'Gruszkowe',
    label: 'Dojrzała gruszka / Banan',
    description: 'Słodki estr owocowy spotykany w refermentowanej kombusze z herbat biało-zielonych.',
    chemicalOrigin: 'Octan izoamylu',
  },

  // 3. NUTTY_CARAMEL (8 descriptors)
  {
    id: 'fl_toasted_hazelnut',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Orzechowe',
    label: 'Prażony orzech laskowy',
    description: 'Głęboki, ciepły ton dojrzałych serów twardych (Gouda Old, Gruyère, Cheddar).',
    chemicalOrigin: 'Pirazyny, laktony',
  },
  {
    id: 'fl_brown_butter',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Karmelowe',
    label: 'Palone masło / Toffee',
    description: 'Karmelowy posmak powstający w długo dojrzewających serach (min. 6-12 miesięcy).',
    chemicalOrigin: 'Produkty proteolizy i reakcji Maillarda',
  },
  {
    id: 'fl_bread_crust',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Piekarnicze',
    label: 'Skórka chleba na zakwasie',
    description: 'Drożdżowo-zbożowy aromat towarzyszący zakwasom chlebowym i dojrzałej kombusze.',
    chemicalOrigin: '2-acetylo-1-pirolina',
  },
  {
    id: 'fl_roasted_almond',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Migdałowe',
    label: 'Prażone migdały / Marcepan',
    description: 'Słodkawy, elegancki ton serów alpejskich (Emmentaler, Comté) z propionowej fermentacji.',
    chemicalOrigin: 'Benzaldehyd, kwas propionowy',
  },
  {
    id: 'fl_sweet_caramel',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Słodkie',
    label: 'Ciemny karmel / Melasa',
    description: 'Głęboka słodycz w kombusze parzonej na cukrze trzcinowym lub leżakowanym occie balsamicznym.',
    chemicalOrigin: 'Maltol, furany',
  },
  {
    id: 'fl_walnut_skin',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Goryczkowe',
    label: 'Skórka orzecha włoskiego / Tanina',
    description: 'Subtelna, orzechowa taniczność z czarnej herbaty lub leżakowania w drewnie.',
    chemicalOrigin: 'Polifenole, kwasy fenolowe',
  },
  {
    id: 'fl_malted_barley',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Słodowe',
    label: 'Prażony słód jęczmienny',
    description: 'Głęboki ton zbożowo-słodowy w zakwasie żytnim i kombuchach słodowanych.',
    chemicalOrigin: 'Izomaltol, pirazyny',
  },
  {
    id: 'fl_buckwheat_honey',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Miodowe',
    label: 'Miód gryczany / Pierzga',
    description: 'Ciemne, żywiczne nuty miodowe w junie (kombusze miodowej) i starych octach.',
    chemicalOrigin: 'Kwas fenylooctowy, estry fenolowe',
  },

  // 4. EARTHY_FUNGAL (8 descriptors)
  {
    id: 'fl_fresh_mushroom',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Grzybowe',
    label: 'Świeża pieczarka / Borowik',
    description: 'Aromat porostu Camemberta i Brie wywołany grzybnią Penicillium camemberti.',
    chemicalOrigin: '1-okten-3-ol',
  },
  {
    id: 'fl_damp_cave',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Piwniczne',
    label: 'Wilgotna piwnica / Kamień',
    description: 'Ziemisty zapach mikroklimatu jaskini serowarskiej i naturalnej skórki maziowej.',
    chemicalOrigin: 'Geosmina',
  },
  {
    id: 'fl_forest_moss',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Leśne',
    label: 'Leśna ściółka / Mech',
    description: 'Głębokie, wilgotne nuty podszytu leśnego charakterystyczne dla serów w liściach kasztanowca.',
    chemicalOrigin: '2-metyloizoborneol',
  },
  {
    id: 'fl_blue_truffle',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Pleśnie błękitne',
    label: 'Błękitna trufla / Roquefort',
    description: 'Penetrujący, grzybowo-pikantny aromat błękitnych żyłek Penicillium roqueforti.',
    chemicalOrigin: 'Dwusiarczek dimetylu, 2-heptanon',
  },
  {
    id: 'fl_oak_bark',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Drzewne',
    label: 'Kora dębowa / Świerkowa deska',
    description: 'Aromat desek świerkowych z jaskini dojrzewalniczej lub dębowej beczki octowej.',
    chemicalOrigin: 'Elagotaniny, laktony dębowe',
  },
  {
    id: 'fl_cellar_limestone',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Mineralne',
    label: 'Wapienna ściana / Krzemień',
    description: 'Czysta, chłodna mineralność w serach z jaskiń krasowych i twardych serach górskich.',
    chemicalOrigin: 'Węglan wapnia, mineralne jony',
  },
  {
    id: 'fl_root_parsnip',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Korzenne',
    label: 'Korzeń pietruszki / Pasternak',
    description: 'Ziemisto-słodkawy zapach kiszonek korzeniowych (marchew, pietruszka, rzepa).',
    chemicalOrigin: 'Terpeny, mirystycyna',
  },
  {
    id: 'fl_humus_peat',
    category: 'EARTHY_FUNGAL',
    subcategory: 'Torfowe',
    label: 'Ciemny torf / Humus',
    description: 'Ciężka, wilgotna ziemistość kiszonek z zakwasu buraczanego o długiej fermentacji.',
    chemicalOrigin: 'Związki humusowe, fenole glebowe',
  },

  // 5. ANIMAL_PUNGENT (8 descriptors)
  {
    id: 'fl_capric_goat',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Kozie',
    label: 'Dojrzały kozi charakter',
    description: 'Wyrazisty, ostry profil serów z mleka koziego po kilku tygodniach w piwnicy.',
    chemicalOrigin: 'Kwas kapronowy, kaprylowy i kaprynowy',
  },
  {
    id: 'fl_aged_leather',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Skórzane',
    label: 'Skóra juchtowa / Stare drewno',
    description: 'Ciężki, szlachetny aromat wiekowych serów twardych leżakujących na deskach świerkowych.',
    chemicalOrigin: 'p-krezol, skatol',
  },
  {
    id: 'fl_fermented_garlic',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Siarkowe',
    label: 'Fermentowany czosnek / Kimchi',
    description: 'Głęboki, umami-pikantny posmak czosnku przekształconego w procesie fermentacji mlekowej.',
    chemicalOrigin: 'Dwusiarczek allilu, tiole',
  },
  {
    id: 'fl_washed_rind_coryne',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Maziowe',
    label: 'Czerwona maź / Brevibacterium',
    description: 'Lepka, pomarańczowa skórka serów maziowych (Munster, Taleggio, Limburski).',
    chemicalOrigin: 'Metanotiol, Brevibacterium linens',
  },
  {
    id: 'fl_peppery_mustard',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Pikantne',
    label: 'Ostra gorczyca / Chrzan',
    description: 'Przeszywająca ostrość w kiszonkach z kapusty i rzodkwi (baechu kimchi, kkakdugi).',
    chemicalOrigin: 'Glukozynolany, alliloizotiocyjanian',
  },
  {
    id: 'fl_ammoniacal_aged',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Amoniakalne',
    label: 'Ostry amoniak / Przejrzałość',
    description: 'Intensywny, szczypiący aromat mocno przejrzałych serów z białą pleśnią.',
    chemicalOrigin: 'Amoniak (deaminacja aminokwasów)',
  },
  {
    id: 'fl_barnyard_hay',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Zagrodowe',
    label: 'Zagroda / Wiejskie siano',
    description: 'Rustykalny, tradycyjny profil surowego mleka od krów wypasanych na łąkach.',
    chemicalOrigin: 'Kwas izowalerianowy',
  },
  {
    id: 'fl_smoked_phenolic',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Dymne',
    label: 'Wędzarnia / Kora olchowa',
    description: 'Tradycyjny aromat serów parzonych wędzonych dymem drzew liściastych (Oscypek, Gołka).',
    chemicalOrigin: 'Gwajakol, siringol, eugenol',
  },
];

export function getDescriptorsByCategory(category: FlavorCategoryKey): FlavorDescriptor[] {
  return FLAVOR_DESCRIPTORS.filter((d) => d.category === category);
}

export function findDescriptorById(id: string): FlavorDescriptor | undefined {
  return FLAVOR_DESCRIPTORS.find((d) => d.id === id);
}

export function searchDescriptors(query: string): FlavorDescriptor[] {
  const q = query.trim().toLowerCase();
  if (!q) return FLAVOR_DESCRIPTORS;
  return FLAVOR_DESCRIPTORS.filter(
    (d) =>
      d.label.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.chemicalOrigin.toLowerCase().includes(q) ||
      d.subcategory.toLowerCase().includes(q)
  );
}

export interface CategoryDistribution {
  category: FlavorCategoryKey;
  label: string;
  count: number;
  percentage: number;
}

export function calculateCategoryDistribution(selectedIds: string[]): CategoryDistribution[] {
  const total = selectedIds.length;
  const counts: Record<FlavorCategoryKey, number> = {
    LACTIC: 0,
    FRUITY_ACID: 0,
    NUTTY_CARAMEL: 0,
    EARTHY_FUNGAL: 0,
    ANIMAL_PUNGENT: 0,
  };

  selectedIds.forEach((id) => {
    const desc = findDescriptorById(id);
    if (desc) {
      counts[desc.category] += 1;
    }
  });

  return FLAVOR_CATEGORIES.map((cat) => ({
    category: cat.id,
    label: cat.label,
    count: counts[cat.id],
    percentage: total > 0 ? Math.round((counts[cat.id] / total) * 100) : 0,
  }));
}

export function formatDescriptorNotes(selectedIds: string[]): string {
  if (selectedIds.length === 0) return '';
  const descriptors = selectedIds
    .map((id) => findDescriptorById(id))
    .filter((d): d is FlavorDescriptor => Boolean(d));

  const items = descriptors.map((d) => `${d.label} (${d.chemicalOrigin})`);
  return `[Koło Smaków: ${items.join(', ')}]`;
}
