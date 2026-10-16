// ============================================================================
// Apps4Brew Studio — FERMENT Emergency Recovery & Critical Rescue Protocols
// Step-by-step triage procedures for stalled curd, over-acidification, slimy rind, and mold
// ============================================================================

export type EmergencyCaseId =
  | 'WEAK_CURD_NO_SET'
  | 'OVERSOUR_CURD_ACID_RUNAWAY'
  | 'SLIMY_BRINE_RIND_DEFECT'
  | 'KAHM_SURFACE_OUTBREAK'
  | 'SCOBY_MOLD_INFESTATION'
  | 'VINEGAR_ALCOHOL_INHIBITION';

export interface EmergencyRescueProtocol {
  id: EmergencyCaseId;
  title: string;
  category: 'CHEESE' | 'VEG' | 'BEV';
  severity: 'CAUTION' | 'CRITICAL' | 'FATAL_DISCARD';
  symptoms: string;
  rootCause: string;
  stepByStepRescue: string[];
  preventiveAdvice: string;
  isDiscardMandatory: boolean;
}

export const EMERGENCY_PROTOCOLS: Record<EmergencyCaseId, EmergencyRescueProtocol> = {
  WEAK_CURD_NO_SET: {
    id: 'WEAK_CURD_NO_SET',
    title: 'Brak Zestalenia Skrzepu po 45 Minutach (Płynne Mleko)',
    category: 'CHEESE',
    severity: 'CRITICAL',
    symptoms: 'Mleko po 45 minutach od podania enzymu nadal ma konsystencję płynną lub rzadkiej śmietanki.',
    rootCause: 'Zbyt niska temperatura (<30°C), przeterminowana/zdenaturowana podpuszczka, brak jonów Ca2+ (mleko sklepowe) lub zakłócenie spoczynku.',
    stepByStepRescue: [
      '1. Zmierz temperaturę mleka: jeśli spadła poniżej 31°C, powoli podgrzej kocioł w kąpieli wodnej do 34–35°C bez intensywnego mieszania.',
      '2. Rozpuść 2.0g chlorku wapnia (CaCl2) w 40 ml letniej, przegotowanej wody i delikatnie wlej do garnka, wykonując 3 powolne ruchy.',
      '3. Przygotuj 50% świeżej dawki podpuszczki, rozcieńcz w 30 ml chłodnej wody niechlorowanej i równomiernie rozprowadź.',
      '4. Zatrzymaj ruch wirowy mleka płaską stroną łyżki, zamknij pokrywę i odczekaj 35 minut bez poruszania garnkiem.',
      '5. Jeśli skrzep nadal nie powstał: mleko było prawdopodobnie poddane sterylizacji UHT. Nie utworzy skrzepu serowarskiego — przerób je na twaróg kwasowy przez podgrzanie do 45°C.',
    ],
    preventiveAdvice: 'Nigdy nie używaj mleka UHT. Do mleka pasteryzowanego w niskiej temperaturze zawsze dodawaj CaCl2 przed podpuszczką.',
    isDiscardMandatory: false,
  },
  OVERSOUR_CURD_ACID_RUNAWAY: {
    id: 'OVERSOUR_CURD_ACID_RUNAWAY',
    title: 'Gwałtowne Przekwaszenie Skrzepu / Ucieczka Kwasowości (pH < 5.0)',
    category: 'CHEESE',
    severity: 'CRITICAL',
    symptoms: 'Skrzep jest kruchy, skrzypi w zębach, puszcza mleczno-mętną kwaśną serwatkę, nie chce sklejać się w prasie.',
    rootCause: 'Zbyt wysoka temperatura w pomieszczeniu, za duża dawka kultur starterowych lub przeciągnięty czas obróbki w kotle.',
    stepByStepRescue: [
      '1. Natychmiast zlej całą kwaśną serwatkę z kociołka.',
      '2. Wlej ciepłą wodę (36–38°C) w ilości równej 40% objętości odlanej serwatki i delikatnie przepłukuj ziarno przez 10 minut (tzw. pranie skrzepu / curd washing).',
      '3. Zlej wodę z wypłukaną laktozą — zatrzyma to dalszą produkcję kwasu mlekowego przez bakterie.',
      '4. Włóż ziarno do formy i prasuj w ciepłym otoczeniu (22–24°C) z 20% większym obciążeniem początkowym.',
      '5. Skróć czas solenia w solance o 25%, ponieważ kwaśny ser wchłania sól dwukrotnie szybciej!',
    ],
    preventiveAdvice: 'Kontroluj czas zakwaszania stoperem i mierz pH. Nie przekraczaj zalecanych dawek kultur DVS.',
    isDiscardMandatory: false,
  },
  SLIMY_BRINE_RIND_DEFECT: {
    id: 'SLIMY_BRINE_RIND_DEFECT',
    title: 'Śluzowata, Miękka Skórka Sera w Kąpieli Solankowej',
    category: 'CHEESE',
    severity: 'CAUTION',
    symptoms: 'Powierzchnia sera po wyjęciu z solanki staje się śliska, galaretowata, a skórka schodzi pod palcem.',
    rootCause: 'Brak buforu wapniowego w solance: woda wyciąga jony Ca2+ z białek sera do roztworu (zjawisko osmotyczne).',
    stepByStepRescue: [
      '1. Ostrożnie wyjmij ser z solanki i osusz czystym ręcznikiem bawełnianym.',
      '2. Do solanki natychmiast dodaj 15g suchego CaCl2 (lub 45 ml roztworu 33%) na każde 10 litrów kąpieli.',
      '3. Sprawdź pH solanki: jeśli wynosi > 5.5, dodaj 50 ml białego octu lub 100 ml serwatki, by wyrównać pH do 5.2–5.4.',
      '4. Posyp miękkie miejsca krążka drobną niejodowaną solą morską i pozostaw na desce do obeschnięcia w 12–14°C przez 24 godziny.',
    ],
    preventiveAdvice: 'Zawsze buforuj nową solankę chlorkiem wapnia (0.15%) i doprowadzaj pH do poziomu zbliżonego do sera.',
    isDiscardMandatory: false,
  },
  KAHM_SURFACE_OUTBREAK: {
    id: 'KAHM_SURFACE_OUTBREAK',
    title: 'Gruby Biały Kożuszek Drożdżowy (Kahm) w Kiszonce lub Occie',
    category: 'VEG',
    severity: 'CAUTION',
    symptoms: 'Kredowy, matowy, geometryczny biały nalot na powierzchni płynu fermentacyjnego.',
    rootCause: 'Tlenowe drożdże pichia/candida rozwijające się przy dostępie powietrza lub zbyt niskim stężeniu soli (<2.0%).',
    stepByStepRescue: [
      '1. Zmierz pH kiszonki paskiem lub pehametrem: jeśli pH < 4.4, wsad jest całkowicie bezpieczny biologicznie!',
      '2. Zbierz cały kożuszek wyparzoną łyżką lub papierem ręcznikowym przeciągniętym po powierzchni.',
      '3. Jeśli warzywa wystają ponad płyn, dociąż je wyparzonym dyskiem szklanym lub woreczkiem z solanką.',
      '4. Dolej 2.5% solanki pod sam gwint słoika i zamknij szczelnie rurką fermentacyjną, by wyprzeć tlen dwutlenkiem węgla.',
      '5. Przenieś słoik w chłodniejsze miejsce (16–18°C), aby spowolnić metabolizm drożdży.',
    ],
    preventiveAdvice: 'Dbaj o całkowite zanurzenie warzyw pod solanką i stosuj szczelne naczynia z rurką fermentacyjną.',
    isDiscardMandatory: false,
  },
  SCOBY_MOLD_INFESTATION: {
    id: 'SCOBY_MOLD_INFESTATION',
    title: 'Prawdziwa Pleśń na Grzybku SCOBY (Zarodnie Zielone/Czarne)',
    category: 'BEV',
    severity: 'FATAL_DISCARD',
    symptoms: 'Puszyste, suche, odstające zielone, niebieskie, biało-szare lub czarne plamy na wierzchu kombuchy.',
    rootCause: 'Zbyt wysokie pH początkowe (>4.5), za mało płynu startowego, zakażenie zarodnikami z powietrza lub owoców.',
    stepByStepRescue: [
      '1. ALARM: Pleśń wytwarza niebezpieczne mykotoksyny penetrujące całą ciecz!',
      '2. BEZWZGLĘDNIE WYRZUĆ cały nastaw wraz z grzybkiem SCOBY do śmieci. Nie próbuj odkrawać ani płukać!',
      '3. Wyszoruj słoik i wyparz wrzątkiem lub zdezynfekuj roztworem pirosiarczynu / Star San.',
      '4. Nowy nastaw przygotuj z mocniejszym starterem: min. 15% objętości kwaśnej kombuchy o pH < 3.5.',
    ],
    preventiveAdvice: 'Nigdy nie oszczędzaj na płynie startowym. W chłodne dni zakwaszaj napar odrobiną octu jabłkowego.',
    isDiscardMandatory: true,
  },
  VINEGAR_ALCOHOL_INHIBITION: {
    id: 'VINEGAR_ALCOHOL_INHIBITION',
    title: 'Zatrzymana Fermentacja Octowa (Mocny Alkohol, Brak Kwasu)',
    category: 'BEV',
    severity: 'CRITICAL',
    symptoms: 'Po 4–6 tygodniach nastaw octowy pachnie winem, nie kwaśnieje, matka octowa opada na dno.',
    rootCause: 'Stężenie alkoholu w winie/cydrze przekroczyło 8.0% ABV (zatrucie bakterii Acetobacter) lub brak dopływu tlenu.',
    stepByStepRescue: [
      '1. Rozcieńcz wsad czystą, niechlorowaną wodą o ok. 30–50%, aby obniżyć stężenie alkoholu do optymalnego 5.0–6.0% ABV.',
      '2. Zapewnij szeroką powierzchnię parowania: zamiast wąskiej butli użyj słoja z szerokim wlotem.',
      '3. Zdejmij nakrętkę i zabezpiecz wlot gęstą gazą bawełnianą z gumką (Acetobacter jest bezwzględnym tlenowcem!).',
      '4. Zaszczep nastaw 100 ml niepasteryzowanego żywego octu jabłkowego z "matką".',
      '5. Utrzymuj temperaturę w optymalnym zakresie 24–28°C.',
    ],
    preventiveAdvice: 'Nie używaj mocnych win sklepowych (>12% ABV) bez wcześniejszego rozcieńczenia wodą w proporcji 1:1.',
    isDiscardMandatory: false,
  },
};

/**
 * Zwraca protokół ratunkowy dla zadanego przypadku
 */
export function getEmergencyRescueProtocol(id: EmergencyCaseId): EmergencyRescueProtocol {
  const protocol = EMERGENCY_PROTOCOLS[id];
  if (!protocol) throw new Error(`Nieznany protokół ratunkowy: ${id}`);
  return protocol;
}

/**
 * Przeszukuje procedury ratunkowe po słowach kluczowych
 */
export function searchEmergencyProtocols(query: string): EmergencyRescueProtocol[] {
  const q = query.toLowerCase().trim();
  if (!q) return Object.values(EMERGENCY_PROTOCOLS);

  return Object.values(EMERGENCY_PROTOCOLS).filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.symptoms.toLowerCase().includes(q) ||
    p.rootCause.toLowerCase().includes(q)
  );
}
