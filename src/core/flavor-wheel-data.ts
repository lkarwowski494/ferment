// ============================================================================
// Apps4Brew Studio — FERMENT Microbiological Flavor Wheel Data
// Sensory lexicon for artisanal cheeses, lactic ferments, kombuchas and vinegars
// ============================================================================

export interface FlavorDescriptor {
  id: string;
  category: 'LACTIC' | 'FRUITY_ACID' | 'NUTTY_CARAMEL' | 'EARTHY_FUNGAL' | 'ANIMAL_PUNGENT';
  subcategory: string;
  label: string;
  description: string;
  chemicalOrigin: string; // e.g. Diacetyl, Acetic acid, 1-octen-3-ol
}

export const FLAVOR_CATEGORIES = [
  { id: 'LACTIC', label: 'Mleczne & Maślane', color: '#FEF3C7' },
  { id: 'FRUITY_ACID', label: 'Kwasowo-Owocowe', color: '#DCFCE7' },
  { id: 'NUTTY_CARAMEL', label: 'Orzechowo-Karmelowe', color: '#FED7AA' },
  { id: 'EARTHY_FUNGAL', label: 'Ziemisto-Grzybowe', color: '#E2E8F0' },
  { id: 'ANIMAL_PUNGENT', label: 'Zwierzęco-Pikantne', color: '#FEE2E2' },
] as const;

export const FLAVOR_DESCRIPTORS: FlavorDescriptor[] = [
  // 1. LACTIC
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

  // 2. FRUITY_ACID
  {
    id: 'fl_green_apple',
    category: 'FRUITY_ACID',
    subcategory: 'Jabłkowe',
    label: 'Zielone jabłko / Kwas jabłkowy',
    description: 'Wyrazista kwasowość typowa dla młodego cydru, octów jabłkowych i wczesnej kombuchy.',
    chemicalOrigin: 'Kwas jabłkowy, octan etylu',
  },
  {
    id: 'fl_sharp_acetic',
    category: 'FRUITY_ACID',
    subcategory: 'Octowe',
    label: 'Czysty kwas octowy',
    description: 'Przeszywająca, lotna kwasowość w żywych octach i dojrzałej kombusze.',
    chemicalOrigin: 'Kwas octowy (Acetobacter)',
  },
  {
    id: 'fl_tropical_ester',
    category: 'FRUITY_ACID',
    subcategory: 'Tropikalne',
    label: 'Ananas / Dojrzała marakuja',
    description: 'Estry wytwarzane przez drożdże podczas refermentacji kombuchy z owocami.',
    chemicalOrigin: 'Maślan etylu, heksanian etylu',
  },

  // 3. NUTTY_CARAMEL
  {
    id: 'fl_toasted_hazelnut',
    category: 'NUTTY_CARAMEL',
    subcategory: 'Orzechowe',
    label: 'Prażony orzech laskowy',
    description: 'Głęboki, ciepły ton dojrzałych serów twardych (Gouda Old, Gruyere, Cheddar).',
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
    description: 'Drożdżowo-zbożowy aromat towarzyszący zakwasom i dojrzałym kombuchom.',
    chemicalOrigin: '2-acetylo-1-pirolina',
  },

  // 4. EARTHY_FUNGAL
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

  // 5. ANIMAL_PUNGENT
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
    description: 'Ciężki, arystokratyczny aromat wiekowych serów twardych leżakujących na deskach świerkowych.',
    chemicalOrigin: 'p-krezol, skatol',
  },
  {
    id: 'fl_fermented_garlic',
    category: 'ANIMAL_PUNGENT',
    subcategory: 'Siarkowe',
    label: 'Fermentowany czosnek / Kimchi',
    description: 'Głęboki, umami-pikantny posmak czosnku przekształconego w procesie mlekowej fermentacji.',
    chemicalOrigin: 'Dwusiarczek allilu, tiole',
  },
];

export function getDescriptorsByCategory(category: FlavorDescriptor['category']): FlavorDescriptor[] {
  return FLAVOR_DESCRIPTORS.filter((d) => d.category === category);
}
