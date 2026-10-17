/**
 * Black Garlic & Slow Maillard Aging Engine (src/core/black-garlic.ts)
 *
 * Silnik termicznego dojrzewania czarnego czosnku w oparciu o wolną reakcję
 * Maillarda (nieenzymatyczne brązowienie) oraz degradację allicyny do rozpuszczalnej
 * w wodzie S-allilocysteiny (SAC).
 *
 * Standardy biochemiczne:
 * - Zakres optymalny temperatur: 60°C - 78°C (poniżej 55°C ryzyko gnicia bakteryjnego, powyżej 82°C piroliza i gorycz).
 * - Zakres wilgotności względnej (RH): 65% - 85% zapobiegający wysuszeniu na kamień lub rozmoczeniu.
 * - Konwersja allicyny: 5- do 8-krotny przyrost S-allilocysteiny (SAC) o silnym potencjale przeciwutleniającym.
 * - Ubytek masy przez ewaporację wody komórkowej: 40% - 55% masy wyjściowej.
 */

export type BlackGarlicPhaseId = 'INITIATION' | 'MAILLARD_ACTIVE' | 'BALSAMIC_AGING' | 'REST_DRYING';

export type BlackGarlicDevice = 'RICE_COOKER_WARM' | 'FERMENTATION_CHAMBER' | 'DEHYDRATOR_ENCLOSED' | 'SLOW_COOKER';

export interface BlackGarlicPhase {
  id: BlackGarlicPhaseId;
  namePl: string;
  nameEn: string;
  dayRange: [number, number];
  targetTempC: [number, number];
  targetRhPct: [number, number];
  chemicalFocusPl: string;
  chemicalFocusEn: string;
}

export const BLACK_GARLIC_PHASES: Record<BlackGarlicPhaseId, BlackGarlicPhase> = {
  INITIATION: {
    id: 'INITIATION',
    namePl: 'Inicjacja i Enzymatyczna Inaktywacja (Dni 1–10)',
    nameEn: 'Initiation & Enzyme Inactivation (Days 1–10)',
    dayRange: [1, 10],
    targetTempC: [72, 78],
    targetRhPct: [80, 90],
    chemicalFocusPl: 'Rozpad enzymu allinazy, degradacja piekącej allicyny, początek hydrolizy polisacharydów.',
    chemicalFocusEn: 'Alliinase enzyme denaturation, pungent allicin breakdown, initiation of fructan hydrolysis.',
  },
  MAILLARD_ACTIVE: {
    id: 'MAILLARD_ACTIVE',
    namePl: 'Intensywna Reakcja Maillarda & Synteza SAC (Dni 11–28)',
    nameEn: 'Active Maillard Reaction & SAC Synthesis (Days 11–28)',
    dayRange: [11, 28],
    targetTempC: [68, 74],
    targetRhPct: [75, 85],
    chemicalFocusPl: 'Reakcja grup aminowych z cukrami redukującymi, synteza melanoidyn (czarna barwa) oraz kumulacja S-allilocysteiny (SAC).',
    chemicalFocusEn: 'Amino group condensation with reducing sugars, melanoidin formation (pitch black hue) and S-allyl-cysteine accumulation.',
  },
  BALSAMIC_AGING: {
    id: 'BALSAMIC_AGING',
    namePl: 'Dojrzewanie Balsamiczne & Aromatyzacja (Dni 29–42)',
    nameEn: 'Balsamic Maturation & Aroma Development (Days 29–42)',
    dayRange: [29, 42],
    targetTempC: [62, 68],
    targetRhPct: [65, 75],
    chemicalFocusPl: 'Konwersja do słodkich nut suszonych śliwek, melasy, tamaryndowca i octu balsamicznego; redukcja kwasowości.',
    chemicalFocusEn: 'Transformation into sweet prune, molasses, tamarind, and balsamic notes; acid stabilization.',
  },
  REST_DRYING: {
    id: 'REST_DRYING',
    namePl: 'Wietrzenie, Odpoczynek & Krystalizacja Truflowa (Dni 43–50)',
    nameEn: 'Rest, Aeration & Truffle Texture Setting (Days 43–50)',
    dayRange: [43, 50],
    targetTempC: [18, 24],
    targetRhPct: [45, 60],
    chemicalFocusPl: 'Stabilizacja struktury w temperaturze pokojowej, odparowanie nadmiaru lepkiej wilgoci do konsystencji miękkiej żelki/trufli.',
    chemicalFocusEn: 'Ambient stabilization, evaporation of surface stickiness down to pliable jelly / soft truffle texture.',
  },
};

export interface BlackGarlicInput {
  rawWeightGrams: number;
  currentDay: number;
  chamberTempC: number;
  chamberRhPct: number;
  deviceType?: BlackGarlicDevice;
  totalProgramDays?: number;
}

export type BlackGarlicAlertCode =
  | 'TEMPERATURE_CRITICAL_LOW'
  | 'TEMPERATURE_SUBOPTIMAL_LOW'
  | 'TEMPERATURE_CRITICAL_HIGH'
  | 'TEMPERATURE_SUBOPTIMAL_HIGH'
  | 'RH_CRITICAL_LOW'
  | 'RH_CRITICAL_HIGH'
  | 'NORMAL';

export interface BlackGarlicAlert {
  code: BlackGarlicAlertCode;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  titlePl: string;
  titleEn: string;
  messagePl: string;
  messageEn: string;
}

export interface BlackGarlicResult {
  currentPhase: BlackGarlicPhase;
  progressPct: number;
  remainingDays: number;
  estimatedCurrentWeightGrams: number;
  estimatedWeightLossPct: number;
  sacMultiplier: number;
  expectedSugarBrix: number;
  textureEstimatePl: string;
  textureEstimateEn: string;
  flavorProfilePl: string;
  flavorProfileEn: string;
  alerts: BlackGarlicAlert[];
  recommendedActionsPl: string[];
  recommendedActionsEn: string[];
}

/**
 * Główny kalkulator kinetyki starzenia czarnego czosnku
 */
export function calculateBlackGarlic(input: BlackGarlicInput): BlackGarlicResult {
  const {
    rawWeightGrams,
    currentDay,
    chamberTempC,
    chamberRhPct,
    totalProgramDays = 45,
  } = input;

  // 1. Określenie fazy
  let phase: BlackGarlicPhase;
  if (currentDay <= 10) {
    phase = BLACK_GARLIC_PHASES.INITIATION;
  } else if (currentDay <= 28) {
    phase = BLACK_GARLIC_PHASES.MAILLARD_ACTIVE;
  } else if (currentDay <= 42) {
    phase = BLACK_GARLIC_PHASES.BALSAMIC_AGING;
  } else {
    phase = BLACK_GARLIC_PHASES.REST_DRYING;
  }

  // 2. Postęp i ubytek wagi
  const safeDay = Math.max(0, currentDay);
  const progressPct = Math.min(100, Math.round((safeDay / totalProgramDays) * 100));
  const remainingDays = Math.max(0, totalProgramDays - safeDay);

  // Model ubytku wagi z wody: do ~45% ubytku przy 45 dniach
  const maxLossPct = 48.0;
  const currentLossPct = Math.min(maxLossPct, (safeDay / totalProgramDays) * maxLossPct);
  const estimatedCurrentWeightGrams = Math.round(rawWeightGrams * (1 - currentLossPct / 100));

  // Wzrost SAC (S-allilocysteiny) w funkcji czasu: od 1.0x do 7.5x
  const sacMultiplier = Number((1.0 + Math.min(6.5, (safeDay / 35) * 6.5)).toFixed(1));

  // Cukry redukujące (Brix ekwiwalent rozpuszczalnych węglowodanów z fruktozy)
  const expectedSugarBrix = Number((14.0 + Math.min(26.0, (safeDay / 35) * 26.0)).toFixed(1));

  // 3. Ocena tekstury i profilu smakowego
  let textureEstimatePl = 'Jędrne, chrupkie ząbki surowego czosnku.';
  let textureEstimateEn = 'Crisp, firm raw garlic cloves.';
  let flavorProfilePl = 'Ostry, palący, siarkowy zapach allicyny.';
  let flavorProfileEn = 'Pungent, burning, sulfurous allicin profile.';

  if (safeDay >= 1 && safeDay <= 10) {
    textureEstimatePl = 'Zmiękczone, żółtawo-jasnobrązowe, wilgotne.';
    textureEstimateEn = 'Softened, yellowish-light brown, moist.';
    flavorProfilePl = 'Utrata palącego smaku, wyczuwalna lekka kwaskowatość i gotowany czosnek.';
    flavorProfileEn = 'Loss of pungency, mild acidity and cooked garlic notes.';
  } else if (safeDay > 10 && safeDay <= 28) {
    textureEstimatePl = 'Ciemnobrązowe do czarnych, miękkie, elastyczne.';
    textureEstimateEn = 'Dark brown to pitch black, soft, pliable.';
    flavorProfilePl = 'Karmel, pieczone owoce, pierwsze nuty umami, zanik siarki.';
    flavorProfileEn = 'Caramel, roasted fruit, early umami notes, disappearance of sulfur.';
  } else if (safeDay > 28 && safeDay <= 42) {
    textureEstimatePl = 'Głęboka czerń, smarowne jak pasta truflowa, miękkie żelki.';
    textureEstimateEn = 'Deep obsidian black, spreadable like truffle paste, soft jelly.';
    flavorProfilePl = 'Słodkie suszone śliwki, melasa, balsamico, tamaryndowiec, potężne umami bez zapachu z ust.';
    flavorProfileEn = 'Sweet dried prunes, molasses, balsamico, tamarind, immense umami with zero garlic breath.';
  } else if (safeDay > 42) {
    textureEstimatePl = 'Sprężysta, zwięzła żelka truflowa, skórka sucha, łatwe obieranie.';
    textureEstimateEn = 'Supple, set truffle confection, dry paper skin, easy peel.';
    flavorProfilePl = 'Koncentrat słodyczy balsamicznej, rodzynek i szlachetnego umami.';
    flavorProfileEn = 'Essence of balsamic sweetness, raisins, and noble umami.';
  }

  // 4. Weryfikacja parametrów komory i generowanie alertów
  const alerts: BlackGarlicAlert[] = [];
  const recommendedActionsPl: string[] = [];
  const recommendedActionsEn: string[] = [];

  // Alerty temperaturowe (jeśli w fazie grzania 1-3)
  if (phase.id !== 'REST_DRYING') {
    if (chamberTempC < 55) {
      alerts.push({
        code: 'TEMPERATURE_CRITICAL_LOW',
        severity: 'CRITICAL',
        titlePl: 'Krytycznie niska temperatura (<55°C)',
        titleEn: 'Critically Low Temperature (<55°C)',
        messagePl: 'Temperatura poniżej 55°C stwarza wysokie ryzyko rozwoju bakterii fermentacji kwasu masłowego i gnicia. Zwiększ grzanie!',
        messageEn: 'Temperature below 55°C creates high risk of bacterial spoilage and putrefaction. Increase heating immediately!',
      });
      recommendedActionsPl.push('Pilnie podnieś temperaturę komory/urządzenia powyżej 65°C.');
      recommendedActionsEn.push('Urgently raise chamber/device temperature above 65°C.');
    } else if (chamberTempC < phase.targetTempC[0]) {
      alerts.push({
        code: 'TEMPERATURE_SUBOPTIMAL_LOW',
        severity: 'WARNING',
        titlePl: 'Temperatura poniżej optimum fazy',
        titleEn: 'Suboptimal Low Temperature',
        messagePl: `Zalecana temperatura dla fazy "${phase.namePl}" to ${phase.targetTempC[0]}–${phase.targetTempC[1]}°C. Proces Maillarda ulegnie spowolnieniu.`,
        messageEn: `Recommended temperature for phase "${phase.nameEn}" is ${phase.targetTempC[0]}–${phase.targetTempC[1]}°C. Maillard browning will slow down.`,
      });
      recommendedActionsPl.push(`Skoryguj termostat na zakres ${phase.targetTempC[0]}–${phase.targetTempC[1]}°C.`);
      recommendedActionsEn.push(`Adjust thermostat to ${phase.targetTempC[0]}–${phase.targetTempC[1]}°C.`);
    }

    if (chamberTempC > 82) {
      alerts.push({
        code: 'TEMPERATURE_CRITICAL_HIGH',
        severity: 'CRITICAL',
        titlePl: 'Krytyczne przegrzanie (>82°C) — Ryzyko Pirolizy',
        titleEn: 'Critical Overheating (>82°C) — Pyrolysis Hazard',
        messagePl: 'Temperatura powyżej 82°C prowadzi do pirolizy, przypalenia cukrów, gorzkiego smaku spalenizny i akrylamidu. Natychmiast obniż temperaturę!',
        messageEn: 'Temperature above 82°C triggers pyrolysis, sugar scorching, bitter charcoal notes and acrylamide. Lower temperature immediately!',
      });
      recommendedActionsPl.push('Natychmiast obniż nastawę komory do 68–72°C.');
      recommendedActionsEn.push('Instantly decrease device setpoint to 68–72°C.');
    } else if (chamberTempC > phase.targetTempC[1]) {
      alerts.push({
        code: 'TEMPERATURE_SUBOPTIMAL_HIGH',
        severity: 'WARNING',
        titlePl: 'Temperatura powyżej optimum fazy',
        titleEn: 'Suboptimal High Temperature',
        messagePl: `Temperatura jest wyższa niż zalecane ${phase.targetTempC[1]}°C. Może dojść do przedwczesnego wysuszenia ząbków.`,
        messageEn: `Temperature exceeds the recommended ${phase.targetTempC[1]}°C. Risk of premature clove desiccation.`,
      });
    }

    // Alerty wilgotności
    if (chamberRhPct < 60) {
      alerts.push({
        code: 'RH_CRITICAL_LOW',
        severity: 'CRITICAL',
        titlePl: 'Zbyt niska wilgotność (<60% RH) — Ryzyko Skamienienia',
        titleEn: 'Critically Low Humidity (<60% RH) — Desiccation Hazard',
        messagePl: 'Przy niskiej wilgotności czosnek traci wodę zbyt szybko i twardnieje w nienadający się do spożycia kamień. Owiń główki szczelnie folią aluminiową lub użyj woreczków próżniowych/naczynia parowego.',
        messageEn: 'Garlic loses water too quickly under low RH and turns into rock-hard inedible nuggets. Wrap tightly in heavy foil or use vacuum heat-seal bags.',
      });
      recommendedActionsPl.push('Zapewnij szczelne owinięcie folią aluminiową (min. 2–3 warstwy) lub worek do sous-vide.');
      recommendedActionsEn.push('Wrap heads tightly in heavy-duty aluminum foil (2-3 layers) or use vacuum sous-vide pouches.');
    } else if (chamberRhPct > 92) {
      alerts.push({
        code: 'RH_CRITICAL_HIGH',
        severity: 'WARNING',
        titlePl: 'Zbyt wysoka wilgotność (>92% RH) — Zagrożenie Rozmoczeniem',
        titleEn: 'Excessive Humidity (>92% RH) — Waterlogging Hazard',
        messagePl: 'Kondensacja pary wodnej w komorze może spowodować rozmoczenie ząbków w kwaśnej mazi. Zapewnij mikro-odpowietrzenie.',
        messageEn: 'Steam condensation inside chamber may result in soggy, acidic mush. Ensure slight micro-venting.',
      });
      recommendedActionsPl.push('Wytrzyj skropliny z pokrywy i uchyl zawór parowy na 1 mm.');
      recommendedActionsEn.push('Wipe inner lid condensation and slightly crack the steam valve 1 mm.');
    }
  }

  // Wskazówki standardowe jeśli brak błędów krytycznych
  if (recommendedActionsPl.length === 0) {
    if (phase.id === 'INITIATION') {
      recommendedActionsPl.push('Utrzymuj szczelne owinięcie folią; sprawdzaj zapach raz na 3–4 dni (silna woń czosnku w pomieszczeniu to norma).');
      recommendedActionsEn.push('Maintain sealed foil wrapping; check aroma every 3–4 days (strong room scent is normal).');
    } else if (phase.id === 'MAILLARD_ACTIVE') {
      recommendedActionsPl.push('Skontroluj miękkość 1 główki kontrolnej; ząbki powinny być elastyczne i miękkie w dotyku przez folię.');
      recommendedActionsEn.push('Gently squeeze 1 control bulb; cloves should feel pliable and soft through foil.');
    } else if (phase.id === 'BALSAMIC_AGING') {
      recommendedActionsPl.push('Obniż temperaturę do ~65°C, pozwalając na powolną koncentrację fruktozy i łagodzenie kwasów organicznych.');
      recommendedActionsEn.push('Dial temp down to ~65°C, facilitating slow fructose concentration and acid mellowing.');
    } else {
      recommendedActionsPl.push('Rozpakuj czosnek z folii i ułóż na przewiewnej siatce w temperaturze pokojowej na 5–7 dni do osuszenia skórki.');
      recommendedActionsEn.push('Unwrap garlic bulbs and lay on an airy drying rack at room temp for 5–7 days to cure the outer paper.');
    }
  }

  return {
    currentPhase: phase,
    progressPct,
    remainingDays,
    estimatedCurrentWeightGrams,
    estimatedWeightLossPct: Number(currentLossPct.toFixed(1)),
    sacMultiplier,
    expectedSugarBrix,
    textureEstimatePl,
    textureEstimateEn,
    flavorProfilePl,
    flavorProfileEn,
    alerts,
    recommendedActionsPl,
    recommendedActionsEn,
  };
}
