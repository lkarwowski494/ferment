// ============================================================================
// Apps4Brew Studio — FERMENT Diagnostic Decision Tree ("Doktor Fermentacji")
// Comprehensive root-cause diagnostics, microbial identification & safety triage
// Adapted from Apps4Brew Studio Standards (Doktor Oczka & Doktor Słoika).
// ============================================================================

export type DefectSafetyVerdict =
  | 'SAFE_EDIBLE'        // Safe to eat (minor cosmetic anomaly)
  | 'COSMETIC_FLAW'     // Safe after scraping / skimming
  | 'REPAIRABLE_RISK'   // Active risk requiring step-by-step technological rescue
  | 'BIOHAZARD_DISCARD'; // Unsafe / contaminated (mycotoxins, botulinum, putrefaction)

export type DefectCategory = 'CHEESE' | 'VEG_FERMENT' | 'KOMBUCHA' | 'VINEGAR';

export interface FermentationDefect {
  id: string;
  name: string;
  category: DefectCategory;
  symptomKeywords: string[];
  visualDescription: string;
  aromaDescription: string;
  textureDescription: string;
  rootCauseMicrobiology: string;
  safetyVerdict: DefectSafetyVerdict;
  stepByStepRemedy: string[];
  preventiveMeasures: string[];
}

export const FERMENTATION_DEFECTS: FermentationDefect[] = [
  // --------------------------------------------------------------------------
  // CHEESE DEFECTS
  // --------------------------------------------------------------------------
  {
    id: 'CH_EARLY_BLOWING',
    name: 'Wczesne Wzdęcie Sera (Gąbczasty Miąższ)',
    category: 'CHEESE',
    symptomKeywords: ['wzdęcie', 'bąble', 'gąbka', 'dziurki', 'coliform', 'wczesne', 'spuchnięty'],
    visualDescription: 'Miąższ ma setki drobnych dziurek przypominających gąbkę kąpielową już w 24–48h po sprasowaniu. Krążek wybrzusza się w solance lub osuszalni.',
    aromaDescription: 'Zapach nieczysty, lekko gnilny, fekalny lub drożdżowy.',
    textureDescription: 'Struktura elastyczno-gąbczasta, miękka, rozpadająca się.',
    rootCauseMicrobiology: 'Zakażenie bakteriami z grupy coli (Enterobacter aerogenes, Escherichia coli) lub drożdżami gazotwórczymi produkującymi gwałtownie CO2 i wodór H2 w obecności laktozy.',
    safetyVerdict: 'BIOHAZARD_DISCARD',
    stepByStepRemedy: [
      '1. Zbadaj zapach: jeśli jest ostry i fekalny, ser nie nadaje się do spożycia ze względu na ryzyko endotoksyn bakteryjnych.',
      '2. Krążek należy bezpiecznie zutylizować (nie podawać zwierzętom domowym).',
      '3. Przeprowadź pełną sanityzację kotła, form, chust i prasy roztworem kwasu nadoctowego lub wrzątkiem przez min. 15 minut.',
    ],
    preventiveMeasures: [
      'Stosuj pasteryzację niską mleka (63°C / 30 min lub 72°C / 15 s).',
      'Dbaj o higienę doju i sterylizację naczyń udojowych.',
      'Zadbaj o szybki rozwój kultur starterowych DVS (zakwaszenie pH < 5.30 w ciągu 6 godzin).',
    ],
  },
  {
    id: 'CH_LATE_BLOWING',
    name: 'Późne Wzdęcie Maślanowe (Pękanie Skórki po Tygodniach)',
    category: 'CHEESE',
    symptomKeywords: ['późne wzdęcie', 'maślanowe', 'clostridium', 'pęknięcie', 'cuchnący', 'wybrzuszenie'],
    visualDescription: 'Po 4–12 tygodniach leżakowania w piwnicy krążek pęcznieje jak piłka, a skórka pęka wzdłuż boków, odsłaniając poszarpane szczeliny.',
    aromaDescription: 'Intensywny, odrażający zapach zjełczałego masła, rzygów i kwasu masłowego.',
    textureDescription: 'Miąższ rozerwany, mazisty w centrum, gumowaty przy pęknięciach.',
    rootCauseMicrobiology: 'Beztlenowe laseczki przetrwalnikujące Clostridium tyrobutyricum pochodzące z kiszonek paszowych, które fermentują mleczan do kwasu masłowego, octowego, CO2 i H2.',
    safetyVerdict: 'BIOHAZARD_DISCARD',
    stepByStepRemedy: [
      '1. Nie próbuj ratować ani odkrawać fragmentów — Clostridium i kwas masłowy przenikają cały blok.',
      '2. Wyrzuć krążek do odpadów zmieszanych.',
      '3. Półkę w dojrzewalni przemyj 10% roztworem podchlorynu sodu lub zbuforowaną solanką i wysusz promieniowaniem UV.',
    ],
    preventiveMeasures: [
      'Nie używaj mleka od krów karmionych kiszonką złej jakości do serów długodojrzewających.',
      'Dodawaj naturalny lizozym z białka jaj lub bakterie ochronne Lactobacillus rhamnosus.',
    ],
  },
  {
    id: 'CH_BITTER_FLAVOR',
    name: 'Goryczka Kazeinowa w Serze (Nagromadzenie Hydrofobowych Peptydów)',
    category: 'CHEESE',
    symptomKeywords: ['gorzki', 'gorycz', 'gorzkie', 'podpuszczka', 'peptydy', 'sól'],
    visualDescription: 'Wygląd zewnętrzny prawidłowy, brak anomalii wizualnych.',
    aromaDescription: 'Aromat typowy serowy lub lekko metaliczny.',
    textureDescription: 'Tekstura często zbyt wilgotna i miękka (pastowata).',
    rootCauseMicrobiology: 'Nadmiar podpuszczki, zbyt niska dawka soli w wilgoci (S/M < 4.0%) lub szczepy kultur o słabej aktywności peptydazowej, które nie rozkładają gorzkich peptydów kazeiny.',
    safetyVerdict: 'SAFE_EDIBLE',
    stepByStepRemedy: [
      '1. Ser jest w 100% bezpieczny mikrobiologicznie, choć ma wadę smakową.',
      '2. Jeśli ser ma mniej niż 4 tygodnie: wydłuż dojrzewanie o 4–8 tygodni w temperaturze 13–14°C — enzymy wewnątrzkomórkowe (peptydazy) mogą z czasem rozłożyć gorzkie peptydy.',
      '3. W przypadku braku poprawy użyj sera do potraw na gorąco (zapiekanki, pizza, fondue), gdzie tłuszcz i przyprawy maskują goryczkę.',
    ],
    preventiveMeasures: [
      'Zmniejsz dawkę podpuszczki o 20–30% przy kolejnej partii.',
      'Zapewnij wskaźnik Salt-in-Moisture (S/M) na poziomie min. 4.5–5.5%.',
    ],
  },
  {
    id: 'CH_CASE_HARDENING',
    name: 'Zasklepienie Skórki Sera (Case Hardening / Twarda Skorupa)',
    category: 'CHEESE',
    symptomKeywords: ['zasklepienie', 'twarda skórka', 'case hardening', 'skorupa', 'vpd', 'suche'],
    visualDescription: 'Gruba, zrogowaciała, wysuszona skórka na zewnątrz, podczas gdy wnętrze krążka pozostaje maziste, wilgotne i pęczniejące.',
    aromaDescription: 'Kwaśny aromat uwięzionej serwatki wyciekającej przez mikropęknięcia.',
    textureDescription: 'Zewnętrze twarde jak drewno, centrum galaretowate.',
    rootCauseMicrobiology: 'Zbyt niski poziom wilgotności względnej (RH < 75%) lub zbyt duży przeciąg w dojrzewalni (Deficyt Prężności Pary VPD > 0.35 kPa). Woda z powierzchni odparowała szybciej, niż zdążyła dyfundować z rdzenia.',
    safetyVerdict: 'REPAIRABLE_RISK',
    stepByStepRemedy: [
      '1. Natychmiast podnieś wilgotność w piwniczce do 88–92% RH (zamknięty pojemnik dojrzewalniczy z tacką wody).',
      '2. Owiń ser lekko wilgotną, wyparzoną chustą serowarską nasączoną 3% solanką na 48 godzin, aby zmiękczyć zrogowaciałą warstwę.',
      '3. Obracaj krążek codziennie.',
    ],
    preventiveMeasures: [
      'Monitoruj VPD piwniczki i utrzymuj je w granicach 0.12–0.24 kPa.',
      'Unikaj bezpośredniego nawiewu wentylatora na krążki serowe.',
    ],
  },

  // --------------------------------------------------------------------------
  // VEGETABLE FERMENT DEFECTS
  // --------------------------------------------------------------------------
  {
    id: 'VG_KAHM_YEAST',
    name: 'Kożuszek Fermentacyjny (Drożdże Kożuchujące Kahm)',
    category: 'VEG_FERMENT',
    symptomKeywords: ['kahm', 'biały nalot', 'pofałdowany', 'film', 'kożuszek', 'błonka', 'drożdże'],
    visualDescription: 'Biała, matowa, cienka i pofałdowana błonka rozwijająca się na powierzchni solanki. Nie jest puchata ani zielona.',
    aromaDescription: 'Aromat lekko drożdżowy, chlebowy, niecuchnący.',
    textureDescription: 'Warzywa pod solanką zachowują prawidłową jędrność.',
    rootCauseMicrobiology: 'Tlenowe drożdże dzikie (Pichia, Debaryomyces, Candida), które zasiedlają powierzchnię naczynia przy nieszczelnym zamknięciu i dostępie powietrza.',
    safetyVerdict: 'COSMETIC_FLAW',
    stepByStepRemedy: [
      '1. Usuń dokładnie wyparzoną łyżką cały biały kożuch z powierzchni solanki.',
      '2. Przetrzyj ścianki słoika ręcznikiem papierowym nasączonym octem spirytusowym lub 20% solanką.',
      '3. Upewnij się, że wszystkie kawałki warzyw znajdują się całkowicie pod lustrem płynu (dociśnij ciężarkiem).',
      '4. Zamknij szczelnie naczynie lub załóż rurkę fermentacyjną, aby odciąć dopływ tlenu.',
    ],
    preventiveMeasures: [
      'Zapewnij warunki beztlenowe od pierwszego dnia.',
      'Stosuj stężenie soli min. 2.0–2.5% całkowitej masy.',
    ],
  },
  {
    id: 'VG_SOFT_MUSHY',
    name: 'Rozmiękanie i Rozpad Tkanek (Mushy Pickles / Pectinolysis)',
    category: 'VEG_FERMENT',
    symptomKeywords: ['rozmiękanie', 'miękkie', 'ciapowate', 'rozpad', 'pektyny', 'kapusta', 'ogórki'],
    visualDescription: 'Ogórki lub kapusta tracą chrupkość, stają się papkowate, rozpadają się w palcach pod lekkim naciskiem.',
    aromaDescription: 'Normalny kwasowy lub lekko mdły zapach.',
    textureDescription: 'Brak chrupkości, struktura rozgotowana / gąbczasta.',
    rootCauseMicrobiology: 'Działanie enzymów pektynolitycznych (pektynazy) wydzielanych przez grzyby na kwiatach ogórków, zbyt niska zawartość soli (<1.5%) lub temperatura fermentacji powyżej 26–28°C.',
    safetyVerdict: 'SAFE_EDIBLE',
    stepByStepRemedy: [
      '1. Warzywa są bezpieczne do zjedzenia, jeśli solanka nie cuchnie gniciem i ma pH < 4.60.',
      '2. Zblenduj miękkie ogórki na zupę ogórkową lub dip; kapustę wykorzystaj do farszu na pierogi lub bigosu.',
      '3. Tkanek nie da się już ponownie utwardzić w tej partii.',
    ],
    preventiveMeasures: [
      'Usuwaj końcówki kwiatowe ogórków (siedlisko pektynazy).',
      'Dodawaj liście zawierające taniny (dąb, wiśnia, chrzan, czarna porzeczka).',
      'Fermentuj w temperaturze 18–20°C i utrzymuj min. 2.0% soli.',
    ],
  },
  {
    id: 'VG_PUTRID_ROT',
    name: 'Zgnilizna Beztlenowa i Cuchnący Rozkład Białek',
    category: 'VEG_FERMENT',
    symptomKeywords: ['zgnilizna', 'smród', 'cuchnący', 'gnicie', 'śluz', 'czarne', 'toksyna'],
    visualDescription: 'Solanka mętna, brązowawa lub czerniejąca. Warzywa rozpadają się w śluzowatą maź.',
    aromaDescription: 'Odrażający fetor zgnilizny, siarkowodoru (zgniłe jaja), amoniaku i rozkładającego się białka.',
    textureDescription: 'Ciągnąca się, śluzowata ciecz.',
    rootCauseMicrobiology: 'Brak zakwaszenia poniżej bariery bezpieczeństwa (pH > 4.60) na skutek braku soli lub zanieczyszczenia ziemią. Dominacja bakterii gnilnych (Pseudomonas, Clostridium, Proteus).',
    safetyVerdict: 'BIOHAZARD_DISCARD',
    stepByStepRemedy: [
      '1. KRYTYCZNY ALARM BIOLOGICZNY: natychmiast wyrzuć całą partię!',
      '2. Pod żadnym pozorem nie próbuj ani nie kosztuj płynu (ryzyko botulizmu i zatruć bakteryjnych).',
      '3. Wyszoruj słoik i wygotuj we wrzątku przez 20 minut.',
    ],
    preventiveMeasures: [
      'Dokładnie myj warzywa z ziemi.',
      'Nigdy nie schodź poniżej 2.0% soli kamiennej niejodowanej.',
      'Sprawdzaj paskiem lakmusowym lub pH-metrem czy po 72h pH spadło < 4.60.',
    ],
  },

  // --------------------------------------------------------------------------
  // KOMBUCHA & BEVERAGE DEFECTS
  // --------------------------------------------------------------------------
  {
    id: 'KB_SCOBY_MOLD',
    name: 'Zakażenie Pleśnią Grzybka SCOBY (Aspergillus / Penicillium)',
    category: 'KOMBUCHA',
    symptomKeywords: ['pleśń', 'scoby', 'zielona', 'puchata', 'zarodniki', 'grzybek', 'kombucha'],
    visualDescription: 'Suche, puchate, zielone, niebieskie, czarne lub śnieżnobiałe plamy na powierzchni dysku SCOBY wystające ponad płyn.',
    aromaDescription: 'Zapach stęchły, piwniczny, pleśniowy.',
    textureDescription: 'Puchaty nalot pleśniowy z widoczną grzybnią.',
    rootCauseMicrobiology: 'Zarodniki pleśni powietrznej rozwijające się na skutek zbyt wysokiego początkowego pH (>4.2), braku zakwaszającego płynu startowego lub chłodnego otoczenia (<20°C).',
    safetyVerdict: 'BIOHAZARD_DISCARD',
    stepByStepRemedy: [
      '1. Cała partia napoju oraz dysk SCOBY muszą zostać bezwzględnie wyrzucone.',
      '2. Nie odkrawaj zapleśniałego fragmentu — mikotoksyny i strzępki grzybni przenikają całą objętość płynu.',
      '3. Słoik wyparz wrzątkiem, a nową partię nastaw ze świeżego startera o pH < 3.2 z Hotelu SCOBY.',
    ],
    preventiveMeasures: [
      'Zawsze dodawaj min. 10–12% mocno kwaśnego startera kombuchy, by obniżyć pH nastawu < 4.2 od minuty zero.',
      'Używaj gęstej tkaniny bawełnianej o splocie uniemożliwiającym przeniknięcie zarodników i muszek.',
    ],
  },
  {
    id: 'KB_GLUE_SOLVENT',
    name: 'Zapach Zmywacza do Paznokci / Octanu Etylu (Solvent Defect)',
    category: 'KOMBUCHA',
    symptomKeywords: ['zmywacz', 'aceton', 'octan etylu', 'klej', 'rozpuszczalnik', 'kombucha'],
    visualDescription: 'Wygląd normalny, SCOBY zdrowe i gładkie.',
    aromaDescription: 'Agresywny, gryzący zapach zmywacza do paznokci, kleju modelarskiego lub acetonu.',
    textureDescription: 'Płyn typowy dla kombuchy.',
    rootCauseMicrobiology: 'Nadmierna esteryfikacja kwasu octowego i etanolu do octanu etylu przez apikulatywne dzikie drożdże (Hanseniaspora uvarum, Pichia) w temperaturze >28°C.',
    safetyVerdict: 'REPAIRABLE_RISK',
    stepByStepRemedy: [
      '1. Napój nie jest toksyczny, ale nieprzyjemny sensorycznie.',
      '2. Przenieś naczynie do chłodniejszego pomieszczenia (21–23°C).',
      '3. Zlej 50% napoju, uzupełnij chłodną, świeżą herbatą z cukrem i pozwól bakteriom Acetobacter utlenić estry.',
      '4. W przypadku silnego stężenia użyj napoju jako octu gospodarczego do mycia naczyń i blatów.',
    ],
    preventiveMeasures: [
      'Nie stawiaj słoja z kombuchą na grzejniku ani na słońcu.',
      'Optymalna temperatura fermentacji kombuchy to 22–26°C.',
    ],
  },

  // --------------------------------------------------------------------------
  // VINEGAR DEFECTS
  // --------------------------------------------------------------------------
  {
    id: 'VN_SULFUR_STINK',
    name: 'Zapach Siarkowodoru w Occie / Cydrze (Stressed Yeast Sulfur)',
    category: 'VINEGAR',
    symptomKeywords: ['siarkowodór', 'zgniłe jaja', 'siarka', 'smród', 'ocet', 'jabłkowy'],
    visualDescription: 'Płyn mętny z obfitym osadem drożdżowym na dnie.',
    aromaDescription: 'Nieprzyjemny zapach zgniłych jaj, zapałek siarkowych lub ścieków.',
    textureDescription: 'Normalna ciecz.',
    rootCauseMicrobiology: 'Drożdże w fazie alkoholowej cierpią na niedobór azotu asymilowalnego (YAN) lub woda zawierała siarczany, co zmusza drożdże do syntezy H2S.',
    safetyVerdict: 'REPAIRABLE_RISK',
    stepByStepRemedy: [
      '1. Siarkowodór można skutecznie usunąć przez intensywne napowietrzanie (aerację) — przelewaj płyn wielokrotnie cienkim strumieniem z dzbanka do dzbanka.',
      '2. Mieszaj płyn wyparzoną miedzianą łyżką lub drucikiem (miedź Cu2+ wiąże siarkę w nierozpuszczalny siarczek miedzi, likwidując smród w 60 sekund).',
      '3. Zdekantuj płyn znad martwego osadu drożdżowego.',
    ],
    preventiveMeasures: [
      'Używaj dojrzałych owoców bogatych w składniki odżywcze.',
      'Nie przetrzymuj octu nad martwym osadem drożdżowym dłużej niż 3 tygodnie.',
    ],
  },
  {
    id: 'VN_STALLED_OXIDATION',
    name: 'Zatrzymanie Utleniania Octowego (Stalled Acetification)',
    category: 'VINEGAR',
    symptomKeywords: ['zatrzymanie', 'ocet', 'słodki', 'alkohol', 'nie kwaśnieje', 'brak matki'],
    visualDescription: 'Brak rozwoju błonki matki octowej na powierzchni płynu przez ponad 3 tygodnie.',
    aromaDescription: 'Aromat wina owocowego / cydru, brak narastającego zapachu kwasu octowego.',
    textureDescription: 'Rzadki płyn alkoholowy.',
    rootCauseMicrobiology: 'Zbyt wysokie stężenie alkoholu (>8–9% ABV hamuje bakterie Acetobacter), szczelne zamknięcie odcinające tlen lub dodatek konserwantów (pirosiarczynu).',
    safetyVerdict: 'REPAIRABLE_RISK',
    stepByStepRemedy: [
      '1. Sprawdź stężenie alkoholu: jeśli wino miało >8% ABV, rozcieńcz je przegotowaną, ostudzoną wodą 1:1, by uzyskać 4–5% ABV.',
      '2. Upewnij się, że słoik przykryty jest przewiewną tkaniną, a nie zakrętką!',
      '3. Zaszczep wino 150 ml żywego, niefiltrowanego octu jabłkowego ze sklepu ekologicznego lub z matecznika.',
    ],
    preventiveMeasures: [
      'Docelowe stężenie wyjściowego alkoholu do octu to 4.5–6.0% ABV.',
      'Bakterie kwasu octowego są bezwzględnymi tlenowcami — potrzebują stałego dostępu O2.',
    ],
  },
];

/**
 * Searches and diagnoses fermentation defects by keywords or free text query
 */
export function diagnoseFermentDefect(
  query: string,
  categoryFilter?: DefectCategory
): FermentationDefect[] {
  const q = (query || '').toLowerCase().trim();

  return FERMENTATION_DEFECTS.filter((defect) => {
    if (categoryFilter && defect.category !== categoryFilter) {
      return false;
    }

    if (!q) return true;

    // Check name
    if (defect.name.toLowerCase().includes(q)) return true;

    // Check keywords
    if (defect.symptomKeywords.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))) {
      return true;
    }

    // Check descriptions & cause
    if (
      defect.visualDescription.toLowerCase().includes(q) ||
      defect.aromaDescription.toLowerCase().includes(q) ||
      defect.rootCauseMicrobiology.toLowerCase().includes(q)
    ) {
      return true;
    }

    return false;
  });
}

export function getDefectById(id: string): FermentationDefect | undefined {
  return FERMENTATION_DEFECTS.find((d) => d.id === id);
}

export function getDefectsByCategory(category: DefectCategory): FermentationDefect[] {
  return FERMENTATION_DEFECTS.filter((d) => d.category === category);
}

export function getBiohazardDefects(): FermentationDefect[] {
  return FERMENTATION_DEFECTS.filter((d) => d.safetyVerdict === 'BIOHAZARD_DISCARD');
}
