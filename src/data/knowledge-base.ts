// ============================================================================
// SEROWAR: Rzemieślnicze Przetwórstwo Mleka (src/data/knowledge-base.ts)
// Podręczny Przewodnik Terenowy Offline (In-App Field Guide Data)
// 100% Offline-Ready | Zero Cloud | Zgodność ze standardem Apps4Brew
// ============================================================================

export interface FieldGuideLesson {
  id: string;
  lessonNumber: number;
  title: string;
  pillSummary: string;
  content: string[];
  keyAdvice: string;
  scientificSources: string[];
}

export interface CraftGlossaryTerm {
  term: string;
  category: 'CHEESE' | 'DAIRY' | 'CHEMISTRY' | 'MICROBIOLOGY';
  definition: string;
  keywords: string[];
}

export interface ReferenceTable {
  id: string;
  title: string;
  description: string;
  headers: string[];
  rows: string[][];
  scientificSources: string[];
}

export const FIELD_GUIDE_LESSONS: FieldGuideLesson[] = [
  {
    id: 'lesson_01_casein',
    lessonNumber: 1,
    title: 'Biochemia Kazeiny i Cięcie Skrzepu',
    pillSummary: 'Podpuszczka odcina ochronny ogonek kappa-kazeiny, co sprawia, że micele łączą się w stabilną siatkę żelu.',
    content: [
      'Micele kazeinowe unoszą się w mleku dzięki ujemnemu ładunkowi powierzchniowemu frakcji kappa-kazeiny, odpychając się wzajemnie.',
      'Chymozyna (podpuszczka) przecina wiązanie Phe105-Met106. Gdy 85% ogonków zostanie odciętych, jony wapnia sczepiają micele w trójwymiarowy żel.',
      'Nigdy nie poruszaj garnkiem podczas koagulacji enzymatycznej — wstrząsy trwale niszczą mostki i powodują ucieczkę tłuszczu do serwatki.',
    ],
    keyAdvice: 'Czysty złom (Clean Break) to porcelanowe pęknięcie skrzepu odsłaniające przezroczystą, zielonkawą serwatkę.',
    scientificSources: ['Fox et al., "Cheese: Chemistry, Physics and Microbiology"', 'IDF Standard 157'],
  },
  {
    id: 'lesson_02_calcium',
    lessonNumber: 2,
    title: 'Rola Wapnia Koloidalnego i Mleko Sklepowe',
    pillSummary: 'Pasteryzacja niszczy wolne jony wapnia. Dodatek 0.1–0.4 g CaCl2 na litr ratuje skrzep w mleku mikrofiltrowanym.',
    content: [
      'Ogrzanie mleka powyżej 65°C powoduje przejście jonów Ca2+ w nierozpuszczalny fosforan trójwapniowy, osłabiając krzepnięcie.',
      'Mleko UHT jest trwale niezdatne do wyrobu sera ze względu na denaturację beta-laktoglobuliny blokującej kazeinę.',
      'Roztwór chlorku wapnia rozpuszczaj zawsze w chłodnej wodzie niechlorowanej przed dodaniem do garnka.',
    ],
    keyAdvice: 'Mleko prosto od krowy nie wymaga CaCl2; mleko pasteryzowane ze sklepu wymaga min. 0.2 g/L.',
    scientificSources: ['Lucey & Fox, "Rennet Coagulation of Milk"', 'Walstra et al., "Dairy Technology"'],
  },
  {
    id: 'lesson_03_cultures',
    lessonNumber: 3,
    title: 'Mezofile vs Termofile — Wybór Bakterii Starterowych',
    pillSummary: 'Mezofile pracują w 20–32°C (Gouda, Twaróg); termofile wymagają 38–45°C (Mozzarella, Jogurt, Sery Włoskie).',
    content: [
      'Kultury mezofilne (typ O i LD) odpowiadają za łagodne zakwaszenie i aromat maślany z diacetylu.',
      'Kultury termofilne (typ T) cechują się wysoką termoodpornością i wytrzymują dogrzewanie skrzepu alpejskiego do 55°C.',
      'Przed zadaniem startera liofilizowanego DVI pozwól mu uwadniać się na powierzchni mleka przez 20 minut.',
    ],
    keyAdvice: 'Podgrzanie mleka z mezofilami powyżej 40°C powoduje śmierć bakterii i zatrzymanie kwaszenia.',
    scientificSources: ['Chr. Hansen Dairy Culture Manual', 'Cogan & Hill, "Applied Dairy Microbiology"'],
  },
  {
    id: 'lesson_04_syneresis',
    lessonNumber: 4,
    title: 'Fizyka Synerezy — Oddawanie Serwatki',
    pillSummary: 'Im drobniej pokroisz skrzep i im wyżej go dogrzejesz, tym twardszy i suchszy ser otrzymasz.',
    content: [
      'Synereza to skurcz siatki białkowej wyciskający serwatkę pod wpływem cięcia, temperatury i kwasu.',
      'Rampa dogrzewania nie może przekraczać 1°C na 2 minuty, aby zapobiec zeszkeleniu powierzchni ziaren.',
      'Przemywanie gęstwy gorącą wodą wypłukuje laktozę i daje łagodne sery typu Gouda o niskiej kwasowości końcowej.',
    ],
    keyAdvice: 'Ziarno ściśnięte w dłoni powinno skleić się w bryłkę, a pod lekkim dotknięciem palca z powrotem rozsypać.',
    scientificSources: ['Kosikowski & Mistry, "Cheese and Fermented Milk Foods"', 'Dejmek & Walstra, "Syneresis of Curd"'],
  },
  {
    id: 'lesson_05_affinage',
    lessonNumber: 5,
    title: 'Ekologia Dojrzewalni i Pielęgnacja Skórki',
    pillSummary: 'Dojrzewanie to kontrolowana sukcesja biologiczna przy wilgotności 85–92% RH i temperaturze 11–13°C.',
    content: [
      'Sól wyciąga wilgoć ze skórki, obniża aktywność wody i chroni ser przed inwazją patogenów.',
      'Drożdże odkwaszają powierzchnię krążka, przygotowując grunt pod czerwoną maź Brevibacterium lub biały puszysty Camembert.',
      'Deski bukowe i świerkowe tworzą stabilny, pożyteczny mikrobiom odporny na zakażenia.',
    ],
    keyAdvice: 'Deficyt prężności pary (VPD) w komorze powinien wynosić 0.14–0.22 kPa, by zapobiec pękaniu skórki.',
    scientificSources: ['Berdagué et al., "Microbiology of Cheese Rinds"', 'USDA Cheese Aging Guidelines'],
  },
  {
    id: 'lesson_06_butter',
    lessonNumber: 6,
    title: 'Masielnictwo — Inwersja Emulsji i Płukanie Lodowe',
    pillSummary: 'Zmaślanie wymaga śmietanki schłodzonej do 10–13°C i trzykrotnego płukania wodą lodową (<6°C).',
    content: [
      'Podczas ubijania pęcherzyki powietrza rozbijają otoczki MFGM i sklejają kryształy tłuszczu w ziarna masła.',
      'Zbyt ciepła śmietanka (>16°C) daje maź zamiast masła; zbyt zimna (<8°C) nie zmaśli się wcale.',
      'Staranne wyciśnięcie resztek maślanki na desce serowarskiej decyduje o trwałości masła.',
    ],
    keyAdvice: 'Płucz masło w wodzie lodowej tak długo, aż zlewany płyn będzie idealnie przezroczysty.',
    scientificSources: ['Tetra Pak Dairy Processing Handbook', 'Codex Standard for Butter (CXS 279-1971)'],
  },
  {
    id: 'lesson_07_whey_loop',
    lessonNumber: 7,
    title: 'Zamknięty Obieg Serwatki — Ricotta i Norweski Brunost',
    pillSummary: 'Serwatka zawiera 50% wartości mleka. Ogrzanie do 88°C daje Ricottę, a odparowanie — karmelowy Brunost.',
    content: [
      'Białka serwatkowe (albuminy i globuliny) nie reagują na podpuszczkę, lecz ścinają się w wysokiej temperaturze 85–90°C.',
      'Dodatek 5–10% mleka pełnego do serwatki potraja wydajność i kremowość domowej Ricotty.',
      'Brunost powstaje przez odparowanie wody do 20% i karmelizację laktozy w reakcji Maillarda.',
    ],
    keyAdvice: 'Nigdy nie wylewaj serwatki do zlewu — to doskonały surowiec spożywczy i probiotyczny.',
    scientificSources: ['IDF Bulletin 389: Whey Processing', 'Røstad et al., "Traditional Norwegian Whey Cheese"'],
  },
];

export const CRAFT_GLOSSARY: CraftGlossaryTerm[] = [
  {
    term: 'Affinage',
    category: 'CHEESE',
    definition: 'Sztuka pielęgnacji i leżakowania sera w dojrzewalni: obracanie, przemywanie, szczotkowanie i kontrola mikroklimatu.',
    keywords: ['dojrzewanie', 'affinage', 'jaskinia', 'pielęgnacja', 'skórka'],
  },
  {
    term: 'Brevibacterium linens',
    category: 'MICROBIOLOGY',
    definition: 'Bakterie tlenowe tworzące lepką, pomarańczowo-czerwoną maź i charakterystyczny intensywny aromat na serach maziowych.',
    keywords: ['bakterie', 'maź', 'czerwona', 'linens', 'munster', 'tilsit'],
  },
  {
    term: 'Brunost (Mysost)',
    category: 'DAIRY',
    definition: 'Tradycyjny norweski ser serwatkowy o barwie i smaku karmelowego toffi, wytwarzany przez wielogodzinne odparowanie wody z serwatki.',
    keywords: ['brunost', 'mysost', 'serwatka', 'karmel', 'norweski', 'toffi'],
  },
  {
    term: 'Cheddaring',
    category: 'CHEESE',
    definition: 'Cięcie gęstwy serowej w bloki i układanie ich w stosy w ciepłym kotle w celu demineralizacji i uzyskania włóknistej struktury.',
    keywords: ['cheddar', 'cheddaring', 'bloki', 'włóknisty', 'stosy'],
  },
  {
    term: 'Chymozyna',
    category: 'CHEMISTRY',
    definition: 'Główny enzym podpuszczki, który selektywnie przecina kappa-kazeinę, inicjując koagulację mleka w skrzep.',
    keywords: ['chymozyna', 'podpuszczka', 'enzym', 'koagulacja', 'cięcie'],
  },
  {
    term: 'Clean Break (Czysty Złom)',
    category: 'CHEESE',
    definition: 'Moment, w którym nacięty nożem skrzep pęka gładko i równo, odsłaniając przejrzystą zielonkawą serwatkę bez kłaczków białka.',
    keywords: ['czysty złom', 'clean break', 'pęknięcie', 'próba noża', 'gotowy skrzep'],
  },
  {
    term: 'Cultured Butter (Masło Ukwaszone)',
    category: 'DAIRY',
    definition: 'Masło tradycyjne zmaślane ze śmietanki poddanej fermentacji mezofilnej, cechujące się wyrazistym aromatem diacetylu.',
    keywords: ['masło', 'cultured', 'śmietana', 'ukwaszona', 'diacetyl'],
  },
  {
    term: 'Curd Washing (Przemywanie Gęstwy)',
    category: 'CHEESE',
    definition: 'Częściowe zastąpienie serwatki gorącą wodą, co wypłukuje laktozę i hamuje nadmierne kwaszenie sera (styl Gouda/Edam).',
    keywords: ['przemywanie', 'washing', 'woda gorąca', 'gouda', 'łagodny'],
  },
  {
    term: 'Diacetyl',
    category: 'CHEMISTRY',
    definition: 'Naturalny związek organiczny o intensywnym zapachu masła, wytwarzany przez bakterie mlekowe ze szlaku cytrynianowego.',
    keywords: ['diacetyl', 'aromat', 'maślany', 'kultura', 'zapach'],
  },
  {
    term: 'DVI / DVS',
    category: 'MICROBIOLOGY',
    definition: 'Direct Vat Inoculation — liofilizowane kultury starterowe zadawane bezpośrednio do mleka bez przygotowywania zakwasu matki.',
    keywords: ['dvi', 'dvs', 'liofilizat', 'kultura', 'starter', 'szczepy'],
  },
  {
    term: 'Flocculation Point (Punkt Flokulacji tf)',
    category: 'CHEESE',
    definition: 'Czas od zadania podpuszczki do momentu, w którym wirująca miseczka na powierzchni mleka zatrzymuje się w miejscu.',
    keywords: ['flokulacja', 'miseczka', 'stoper', 'punkt', 'berridge'],
  },
  {
    term: 'Flocculation Multiplier (Mnożnik Flokulacji)',
    category: 'CHEESE',
    definition: 'Współczynnik (2.0x–5.0x), przez który mnoży się czas flokulacji, aby wyznaczyć optymalny moment krojenia skrzepu (t_cut = tf * M).',
    keywords: ['mnożnik', 'multiplier', 'cięcie', 't_cut', 'wilgotność'],
  },
  {
    term: 'Ghee (Masło Klarowane)',
    category: 'DAIRY',
    definition: 'Czysty bezwodny tłuszcz mleczny (>99.8%) o punkcie dymienia 250°C, powstały z powolnego wytopienia masła i odparowania wody.',
    keywords: ['ghee', 'klarowane', 'tłuszcz', 'wytapianie', 'smażenie'],
  },
  {
    term: 'IMCU',
    category: 'CHEMISTRY',
    definition: 'International Milk Clotting Units — znormalizowana międzynarodowa jednostka siły koagulacji podpuszczki według normy IDF 157.',
    keywords: ['imcu', 'jednostka', 'siła', 'moc', 'dawka podpuszczki'],
  },
  {
    term: 'Inwersja Emulsji',
    category: 'CHEMISTRY',
    definition: 'Przemiana fazowa ze śmietanki (tłuszcz w wodzie O/W) w masło (krople wody uwięzione w sieci krystalicznego tłuszczu W/O).',
    keywords: ['inwersja', 'emulsja', 'zmaślanie', 'faza', 'masło'],
  },
  {
    term: 'Kazeina',
    category: 'CHEMISTRY',
    definition: 'Główna frakcja białkowa mleka (ok. 80%), tworząca micele spajane przez fosforan wapnia i odpowiedzialna za powstawanie skrzepu.',
    keywords: ['kazeina', 'białko', 'micele', 'skrzep', 'wapń'],
  },
  {
    term: 'Klinek',
    category: 'DAIRY',
    definition: 'Trójkątna chusta ze stożkowym szpicem, służąca do grawitacyjnego odsączania i formowania tradycyjnego polskiego twarogu.',
    keywords: ['klinek', 'twaróg', 'chusta', 'odsączanie', 'trójkąt'],
  },
  {
    term: 'Labneh',
    category: 'DAIRY',
    definition: 'Bliskowschodni ser świeży otrzymywany przez odsączenie serwatki z jogurtu, często formowany w kulki zalewane oliwą ziołową.',
    keywords: ['labneh', 'jogurt', 'kulki', 'oliwa', 'świeży'],
  },
  {
    term: 'MFGM',
    category: 'CHEMISTRY',
    definition: 'Milk Fat Globule Membrane — otoczka kuleczek tłuszczowych bogata w fosfolipidy, rozbijana w trakcie ubijania śmietanki na masło.',
    keywords: ['mfgm', 'otoczka', 'tłuszcz', 'fosfolipidy', 'śmietana'],
  },
  {
    term: 'Penicillium candidum',
    category: 'MICROBIOLOGY',
    definition: 'Szlachetna pleśń serowarska tworząca aksamitną, śnieżnobiałą skórkę na serach Brie i Camembert.',
    keywords: ['candidum', 'camemberti', 'biała pleśń', 'brie', 'camembert'],
  },
  {
    term: 'Penicillium roqueforti',
    category: 'MICROBIOLOGY',
    definition: 'Niebiesko-zielona pleśń przerastająca wnętrze serów z błękitnym porostem, wymagająca tlenu wprowadzanego przez nakłuwanie krążków.',
    keywords: ['roqueforti', 'niebieska pleśń', 'błękitny', 'nakłuwanie', 'stilton'],
  },
  {
    term: 'Punkt Izoelektryczny (pI = 4.6)',
    category: 'CHEMISTRY',
    definition: 'Wartość pH mleka, przy której cząsteczki kazeiny tracą ładunek elektryczny i samoistnie koagulują, tworząc skrzep kwasowy twarogu.',
    keywords: ['punkt izoelektryczny', 'pi', 'kwasowość', 'twaróg', '4.6'],
  },
  {
    term: 'Ricotta',
    category: 'DAIRY',
    definition: 'Włoski miękki ser wytwarzany przez termiczną denaturację albumin serwatkowych w temperaturze 85–90°C przy lekkim zakwaszeniu.',
    keywords: ['ricotta', 'serwatka', 'albuminy', 'gotowanie', 'kremowy'],
  },
  {
    term: 'Synereza',
    category: 'CHEESE',
    definition: 'Aktywne wydzielanie i kurczenie się ziaren skrzepu pod wpływem temperatury, kwasowości i cięcia nożem serowarskim.',
    keywords: ['synereza', 'odciek', 'serwatka', 'kurczenie', 'ziarno'],
  },
  {
    term: 'VPD (Deficyt Prężności Pary)',
    category: 'CHEESE',
    definition: 'Vapour Pressure Deficit — fizyczna miara siły suszącej powietrza w piwniczce (kPa), kluczowa dla zapobiegania pękaniu skórki sera.',
    keywords: ['vpd', 'prężność pary', 'wilgotność', 'psychrometria', 'skórka'],
  },
];

export const REFERENCE_TABLES: ReferenceTable[] = [
  {
    id: 'table_pasteurization',
    title: 'Reżimy Pasteryzacji Mleka',
    description: 'Oficjalne reżimy temperaturowo-czasowe niszczenia patogenów w mleczarstwie zagrodowym.',
    headers: ['Metoda', 'Temperatura', 'Czas', 'Zastosowanie', 'Wapń CaCl2'],
    rows: [
      ['LTLT (Niska długa)', '63.0°C – 65.0°C', '30 min', 'Sery zagrodowe, kazeina nienaruszona', 'Opcjonalnie 0.1 g/L'],
      ['HTST (Wysoka krótka)', '72.0°C – 75.0°C', '15 s', 'Mleko sklepowe świeże', 'Zalecane 0.2–0.3 g/L'],
      ['Pasteryzacja Jogurtowa', '85.0°C – 90.0°C', '5–10 min', 'Wyłącznie jogurt (denaturacja serwatki)', 'Zakaz do sera!'],
      ['UHT', '135.0°C – 145.0°C', '2–4 s', 'Mleko kartonowe o długiej trwałości', 'Niezdatne do sera!'],
    ],
    scientificSources: ['FDA Grade A Pasteurized Milk Ordinance', 'IDF Bulletin 496/2019'],
  },
  {
    id: 'table_brine_saturation',
    title: 'Parametry Solanki Nasyconej',
    description: 'Gęstość, stężenie soli i czas kąpieli w roztworze nasyconym przy 15°C.',
    headers: ['Stężenie NaCl', 'Gęstość (g/cm³)', 'Stopnie Baumé', 'Skala Salometru', 'Czas na 1 kg sera'],
    rows: [
      ['16.0%', '1.118', '15.3°Bé', '60°Sal', '16–18 godzin'],
      ['18.0%', '1.134', '17.1°Bé', '68°Sal', '12–14 godzin'],
      ['20.0% (Optimum)', '1.151', '19.0°Bé', '76°Sal', '10–12 godzin'],
      ['22.0%', '1.168', '20.8°Bé', '83°Sal', '8–10 godzin'],
    ],
    scientificSources: ['Scott, Cheesemaking Practice', 'Guinee & Fox, Salt in Cheese'],
  },
  {
    id: 'table_cave_psychrometry',
    title: 'Mikroklimat Dojrzewalni Sera',
    description: 'Optymalne parametry temperatury, wilgotności i deficytu prężności pary dla stylów sera.',
    headers: ['Kategoria Sera', 'Temperatura', 'Wilgotność RH', 'VPD (kPa)', 'Ryzyko błędu'],
    rows: [
      ['Twarde (Alpejskie/Cheddar)', '10–13°C', '82–85%', '0.18–0.24 kPa', 'RH < 80%: pęknięcia; RH > 90%: brak skórki'],
      ['Półtwarde (Gouda/Tilsit)', '12–14°C', '86–90%', '0.14–0.18 kPa', 'RH < 84%: skorupa; RH > 92%: pleśń dzika'],
      ['Maziowe (Brevibacterium)', '13–15°C', '92–96%', '0.06–0.10 kPa', 'RH < 90%: wyschnięcie mazi'],
      ['Białe Pleśnie (Camembert)', '11–13°C', '90–94%', '0.08–0.12 kPa', 'RH < 88%: łysy porost; RH > 96%: śluz'],
      ['Błękitne (Roquefort)', '10–12°C', '90–95%', '0.07–0.11 kPa', 'Brak nakłuwania = brak pleśni w środku'],
    ],
    scientificSources: ['IDF Bulletin on Cheese Ripening Rooms', 'ASHRAE Handbook: Refrigeration'],
  },
];
