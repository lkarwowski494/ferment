// ============================================================================
// Apps4Brew Studio — FERMENT Canonical Artisan Recipe Library
// Heritage formulas with exact bio-chemical parameters, timings and steps
// ============================================================================

export interface IngredientSpecification {
  name: string;
  category: 'MILK' | 'RENNET' | 'CULTURE' | 'SALT' | 'MINERAL' | 'TEA' | 'SUGAR' | 'VEG' | 'SPICE';
  quantityPerUnit: number;
  unit: string;
}

export interface CanonicalRecipe {
  id: string;
  code: string;
  name: string;
  category: 'CHEESE' | 'VEG_FERMENT' | 'KOMBUCHA' | 'VINEGAR';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetYieldPer10Units: string; // e.g. "1.0 - 1.1 kg sera z 10L mleka"
  totalProcessTime: string;
  agingDays: number;
  ingredients: IngredientSpecification[];
  optimalConditions: {
    targetTempC: string;
    targetRhPct?: string;
    phMilestone: string;
  };
  keyTechnique: string;
  steps: string[];
}

export const CANONICAL_RECIPES: CanonicalRecipe[] = [
  {
    id: 'rec_gouda_zagrodowa',
    code: 'CH-GOUDA-01',
    name: 'Gouda Zagrodowa Półtwarda',
    category: 'CHEESE',
    difficulty: 'INTERMEDIATE',
    targetYieldPer10Units: '1.05 kg sera z 10L mleka',
    totalProcessTime: '6 godzin produkcji + 6–12 tygodni dojrzewania',
    agingDays: 60,
    ingredients: [
      { name: 'Świeże mleko pełne (krowie)', category: 'MILK', quantityPerUnit: 1.0, unit: 'L' },
      { name: 'Kultury mezofilne gazotwórcze LD', category: 'CULTURE', quantityPerUnit: 0.1, unit: 'g' },
      { name: 'Podpuszczka naturalna 200 IMCU', category: 'RENNET', quantityPerUnit: 0.25, unit: 'ml' },
      { name: 'Chlorek wapnia CaCl2 (33%)', category: 'MINERAL', quantityPerUnit: 0.5, unit: 'ml' },
      { name: 'Sól kamienna niejodowana do solanki', category: 'SALT', quantityPerUnit: 250, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '11–13°C (piwniczka)',
      targetRhPct: '82–86% RH',
      phMilestone: 'pH 5.25 po prasowaniu',
    },
    keyTechnique: 'Przemywanie ziarna wodą o temp. 55°C (curd washing) obniża zawartość laktozy, dając słodki, maślany finisz i elastyczną strukturę.',
    steps: [
      'Podgrzej mleko do 31°C i zaszczep kulturami mezofilnymi na 45 min.',
      'Dodaj CaCl2 i podpuszczkę; odczekaj do flokulacji (ok. 12-14 min x 3.5 = ~45 min).',
      'Pokrój skrzep na ziarno wielkości grochu, odczekaj 5 min na leczenie.',
      'Wymieszaj powoli przez 15 min, po czym odlej 30% serwatki.',
      'Dolewaj gorącą wodę (55-60°C) do osiągnięcia 38°C gęstwy w czasie min. 15 min.',
      'Prasuj pod serwatką 20 min, następnie przełóż do formy i prasuj (1h lekko, 3h średnio, noc mocno).',
      'Kąp w 20% solance przez 9 godzin na każdy kilogram masy sera.',
      'Osusz i dojrzewaj w piwnicy (12°C, 85% RH) obracając codziennie w pierwszym miesiącu.',
    ],
  },
  {
    id: 'rec_korycinski_swojski',
    code: 'CH-KORYCIN-02',
    name: 'Ser Koryciński Swojski z Ziołami',
    category: 'CHEESE',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '1.25 kg sera z 10L mleka',
    totalProcessTime: '3 godziny + 2–4 tygodnie dojrzewania',
    agingDays: 21,
    ingredients: [
      { name: 'Mleko krowie niepasteryzowane', category: 'MILK', quantityPerUnit: 1.0, unit: 'L' },
      { name: 'Kultury mezofilne maślankowe', category: 'CULTURE', quantityPerUnit: 0.1, unit: 'g' },
      { name: 'Podpuszczka 200 IMCU', category: 'RENNET', quantityPerUnit: 0.3, unit: 'ml' },
      { name: 'Czarnuszka lub kozieradka', category: 'SPICE', quantityPerUnit: 3.0, unit: 'g' },
      { name: 'Sól kłodawska do nacierania', category: 'SALT', quantityPerUnit: 25, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '14–16°C',
      targetRhPct: '80–85%',
      phMilestone: 'pH 5.40',
    },
    keyTechnique: 'Brak mechanicznej prasy! Ziarno ocieka grawitacyjnie w koszyku korycińskim, tworząc charakterystyczne prążkowanie i nieregularne oczka.',
    steps: [
      'Ogrzej mleko do 36°C, dodaj kultury i odczekaj 30 min.',
      'Zapraw podpuszczką, odczekaj 30–35 min na czysty złom.',
      'Pokrój skrzep w grubą kostkę (1.5-2 cm) i delikatnie przemieszaj z uprażoną czarnuszką.',
      'Przełóż do koszyka serowarskiego i obracaj: po 15 min, 30 min, 1h, 2h i 4h.',
      'Następnego dnia nacieraj krążek suchą solą lub zanurz w 16% solance na 4 godziny.',
      'Dojrzewaj w chłodzie, przemywając lekko osoloną wodą.',
    ],
  },
  {
    id: 'rec_feta_zagrodowa',
    code: 'CH-FETA-03',
    name: 'Feta Zagrodowa w Solance Oliwnej',
    category: 'CHEESE',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '1.30 kg sera z 10L mleka koziego/krowiego',
    totalProcessTime: '4 godziny + 3 dni ociekania + 30 dni w zalewie',
    agingDays: 30,
    ingredients: [
      { name: 'Mleko kozie lub krowie', category: 'MILK', quantityPerUnit: 1.0, unit: 'L' },
      { name: 'Kultury termofilno-mezofilne typ Feta', category: 'CULTURE', quantityPerUnit: 0.1, unit: 'g' },
      { name: 'Podpuszczka 200 IMCU', category: 'RENNET', quantityPerUnit: 0.3, unit: 'ml' },
      { name: 'Sól morska do zalewy 10-12%', category: 'SALT', quantityPerUnit: 110, unit: 'g' },
      { name: 'Oliwa z oliwek i zioła prowansalskie', category: 'SPICE', quantityPerUnit: 10, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '10–14°C',
      phMilestone: 'pH 4.80 (krucha i słona)',
    },
    keyTechnique: 'Długie osadzanie kwasowości i leżakowanie w 10–12% zbuforowanej solance zapobiega rozpuszczaniu kazeiny.',
    steps: [
      'Podgrzej mleko do 34°C, dodaj kultury i zakwaszaj przez 60 min.',
      'Dodaj podpuszczkę, odczekaj 45 min na mocny, ścięty skrzep.',
      'Pokrój w kostkę 2x2 cm, mieszaj przez 15 min i wylej do chusty serowarskiej.',
      'Wieszaj chustę do odcieknięcia na 24h w temperaturze 18-20°C (odwróć dwukrotnie).',
      'Pokrój zwarty blok w kostki 3x3 cm i posól suchą solą na tacy na 48 godzin.',
      'Przełóż kostki do słoja, zalej 10% solanką z dodatkiem 1% CaCl2 lub zamarynuj w oliwie.',
    ],
  },
  {
    id: 'rec_kimchi_baechu',
    code: 'VG-KIMCHI-01',
    name: 'Tradycyjne Kimchi z Kapusty Pekińskiej (Baechu-Kimchi)',
    category: 'VEG_FERMENT',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '1.8 kg kimchi z 2 kg kapusty',
    totalProcessTime: '5 godzin przygotowania + 3 dni 1F + 4 tygodnie chłód',
    agingDays: 28,
    ingredients: [
      { name: 'Kapusta pekińska', category: 'VEG', quantityPerUnit: 1000, unit: 'g' },
      { name: 'Niejodowana sól morska do więdnięcia (8.5%)', category: 'SALT', quantityPerUnit: 85, unit: 'g' },
      { name: 'Mąka ryżowa słodka', category: 'SPICE', quantityPerUnit: 15, unit: 'g' },
      { name: 'Papryka koreańska Gochugaru', category: 'SPICE', quantityPerUnit: 35, unit: 'g' },
      { name: 'Czosnek świeży ząbki', category: 'VEG', quantityPerUnit: 25, unit: 'g' },
      { name: 'Świeży korzeń imbiru', category: 'VEG', quantityPerUnit: 10, unit: 'g' },
      { name: 'Sos rybny lub sos sojowy', category: 'SPICE', quantityPerUnit: 25, unit: 'ml' },
    ],
    optimalConditions: {
      targetTempC: '18–20°C (3 dni) -> 2–4°C (lodówka)',
      phMilestone: 'pH < 4.20 po 72h (Botulinum Safe)',
    },
    keyTechnique: 'Zasolenie 8.5% na sucho usuwa nadmiar wody z tkanek kapusty, gwarantując niezrównaną chrupkość przez wiele miesięcy.',
    steps: [
      'Rozetnij kapusty wzdłuż na ćwiartki i natrzyj suchą solą każdy liść przy głąbie.',
      'Pozostaw na 4 godziny w misce, odwracając ćwiartki co 2 godziny.',
      'Wypłucz kapustę 3-krotnie pod zimną wodą i pozostaw na sicie do całkowitego odcieknięcia (min. 1h).',
      'Ugotuj kleik: wymieszaj mąkę ryżową z wodą (1:10), zagotuj do zgęstnienia, ostudź.',
      'Zblenduj czosnek, imbir, cebulę, sos rybny, połącz z kleikiem i płatkami Gochugaru.',
      'Wcieraj pastę dokładnie pod każdy liść kapusty, zwiń w ciasne pakiety.',
      'Ubประ ciasno w słoju, usuwając pęcherzyki powietrza; dociąż dociskiem fermentacyjnym.',
      'Fermentuj 3 dni w temp. pokojowej, po czym schłodź do 2–4°C.',
    ],
  },
  {
    id: 'rec_zakwas_buraczany',
    code: 'VG-KVASS-02',
    name: 'Staropolski Zakwas z Buraków',
    category: 'VEG_FERMENT',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '1.5 litra żywego zakwasu z 1 kg buraków',
    totalProcessTime: '30 minut przygotowania + 5–7 dni fermentacji',
    agingDays: 7,
    ingredients: [
      { name: 'Buraki ćwikłowe jędrne', category: 'VEG', quantityPerUnit: 1000, unit: 'g' },
      { name: 'Woda niechlorowana przegotowana', category: 'MILK', quantityPerUnit: 1000, unit: 'ml' },
      { name: 'Kłodawska sól kamienna niejodowana (2.2%)', category: 'SALT', quantityPerUnit: 44, unit: 'g' },
      { name: 'Czosnek polski główka', category: 'VEG', quantityPerUnit: 15, unit: 'g' },
      { name: 'Liść laurowy, ziele angielskie, majeranek', category: 'SPICE', quantityPerUnit: 5, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '20–22°C',
      phMilestone: 'pH 3.60 – 3.80 (intensywny rubin)',
    },
    keyTechnique: 'Zasolenie całkowitej masy (buraki + woda) na 2.2% wyklucza rozwój zgnilizny, faworyzując czysty kwas mlekowy.',
    steps: [
      'Umyj i obierz buraki, pokrój w grube plastry lub półksiężyce.',
      'Ułóż w wyparzonym słoju na przemian z ząbkami czosnku, liściem laurowym i zielem.',
      'Rozpuść 44g soli w 1000ml letniej wody i zalej buraki.',
      'Kluczowe: dociąż buraki wyparzonym kamieniem lub szklanym krążkiem, aby żaden kawałek nie wystawał ponad solankę!',
      'Zamknij słoik rurką fermentacyjną lub gazą z gumką.',
      'Po 5–7 dniach, gdy zakwas ma głęboki smak i pH < 3.8, zlej do butelek i wstaw do lodówki.',
    ],
  },
  {
    id: 'rec_kombucha_sencha',
    code: 'KB-SENCHA-01',
    name: 'Kombucha Rzemieślnicza na Zielonej Herbacie Sencha',
    category: 'KOMBUCHA',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '3.3 litra napoju probiotycznego z 3L wody',
    totalProcessTime: '45 minut zaparzenia + 10–12 dni fermentacji tlenowej',
    agingDays: 12,
    ingredients: [
      { name: 'Woda filtrowana niechlorowana', category: 'MILK', quantityPerUnit: 1.0, unit: 'L' },
      { name: 'Herbata zielona Sencha liściasta', category: 'TEA', quantityPerUnit: 7.0, unit: 'g' },
      { name: 'Cukier trzcinowy nierafinowany', category: 'SUGAR', quantityPerUnit: 65, unit: 'g' },
      { name: 'Starter SCOBY (kwaśna kombucha z poprzedniej partii)', category: 'RENNET', quantityPerUnit: 120, unit: 'ml' },
      { name: 'Grzybek symbiotyczny SCOBY', category: 'CULTURE', quantityPerUnit: 50, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '22–26°C',
      phMilestone: 'pH startowe < 4.2 -> pH końcowe 2.8–3.2',
    },
    keyTechnique: 'Zadanie min. 12% płynu startowego o pH < 3.2 zabezpiecza napar przed pleśnią od pierwszej minuty.',
    steps: [
      'Zaparz herbatę Sencha w 80°C przez 6 minut, odcedź liście.',
      'Rozpuść cukier w gorącym naparze, po czym ostudź do temperatury pokojowej (<26°C).',
      'Wlej ostudzoną herbatę do słoja, dodaj starter i połóż na wierzchu krążek SCOBY.',
      'Zabezpiecz słoik gęstą tkaniną bawełnianą z gumką.',
      'Odstaw w ciemne, przewiewne miejsce (22–26°C) na 10–12 dni.',
      'Gdy smak osiągnie pożądany balans słodyczy i kwasu, przelej do butelek na refermentację 2F.',
    ],
  },
  {
    id: 'rec_ocet_jablkowy',
    code: 'VN-APPLE-01',
    name: 'Żywy Niefiltrowany Ocet Jabłkowy (ACV)',
    category: 'VINEGAR',
    difficulty: 'BEGINNER',
    targetYieldPer10Units: '2.5 litra żywego octu z 2.5 kg jabłek',
    totalProcessTime: '1h przygotowania + 3 tyg. fermentacji alkoholowej + 6 tyg. octowej',
    agingDays: 60,
    ingredients: [
      { name: 'Jabłka ekologiczne (odmiany kwaśne)', category: 'VEG', quantityPerUnit: 1000, unit: 'g' },
      { name: 'Woda niechlorowana przegotowana', category: 'MILK', quantityPerUnit: 1000, unit: 'ml' },
      { name: 'Cukier trzcinowy lub miód pszczeli', category: 'SUGAR', quantityPerUnit: 50, unit: 'g' },
      { name: 'Żywa matka octowa (Mycoderma aceti)', category: 'CULTURE', quantityPerUnit: 50, unit: 'g' },
    ],
    optimalConditions: {
      targetTempC: '20–25°C (stały dostęp tlenu)',
      phMilestone: 'pH 2.80–3.20 (min. 5% kwasu octowego)',
    },
    keyTechnique: 'Zapewnienie stałego napowietrzania z gęstą tkaniną i ochrona przed muszkami owocówkami umożliwia bakteriom Acetobacter pełne utlenienie etanolu do kwasu octowego.',
    steps: [
      'Umyj jabłka, pokrój w kostkę razem ze gniazdami nasiennymi i skórką.',
      'Włóż owoce do słoja, zalej wodą z rozpuszczonym cukrem (owoce muszą być całkowicie przykryte).',
      'Zabezpiecz słoik tkaniną z gumką i mieszaj codziennie przez pierwsze 10 dni.',
      'Gdy owoce opadną na dno (zakończenie fermentacji burzliwej), odcedź płyn od cząstek owoców.',
      'Dodaj matkę octową lub 100 ml żywego octu jabłkowego, aby przyspieszyć fermentację octową.',
      'Pozostaw na 4–6 tygodni w spokoju, aż na powierzchni uformuje się galaretowaty dysk matki octowej i osiągniesz pH < 3.2.',
    ],
  },
];

export function getCanonicalRecipe(id: string): CanonicalRecipe | undefined {
  return CANONICAL_RECIPES.find((r) => r.id === id);
}

export function getRecipesByCategory(category: CanonicalRecipe['category']): CanonicalRecipe[] {
  return CANONICAL_RECIPES.filter((r) => r.category === category);
}
