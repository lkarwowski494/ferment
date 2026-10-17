// ============================================================================
// Apps4Brew Studio — FERMENT Nukazuke Rice Bran Fermentation Bed Engine
// Traditional Japanese Nukadoko biochemistry, moisture-salt balance & Te-ire
// ============================================================================

export type NukadokoAgeStage =
  | 'INITIAL_SETUP' // Dni 1-14 (Sutezuke - warzywa rozruchowe do wyrzucenia)
  | 'YOUNG_ACTIVE' // Dni 15-60 (Zbalansowane zakwaszenie, lekkie kiszenie)
  | 'MATURE_BED'; // Powyżej 60 dni (Głęboki profil umami, stabilna mikrobiologia)

export type NukazukeVegType =
  | 'CUCUMBER' // Ogórek (6-12h)
  | 'EGGPLANT' // Bakłażan (12-24h, tarcie solą)
  | 'DAIKON_RADISH' // Rzodkiew Daikon (12-24h)
  | 'CARROT' // Marchew (18-36h)
  | 'AVOCADO_BOILED_EGG'; // Awokado / jajko na twardo (4-8h)

export interface NukadokoSetupInput {
  riceBranGrams: number;
  targetSalinityPct?: number; // domyślnie 13.0%
}

export interface NukadokoSetupResult {
  waterGrams: number;
  saltGrams: number;
  totalBedMassGrams: number;
  effectiveSalinityPct: number;
  aromaticsGrams: {
    konbuGrams: number;
    driedChiliGrams: number;
    gingerSlicesGrams: number;
  };
  sutezukeDurationDays: number;
  sutezukeInstructionsPl: string[];
}

export interface NukadokoMaintenanceInput {
  bedTotalMassGrams: number;
  currentEstimatedSalinityPct: number;
  moistureExcessStatus: 'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY';
  ambientTempC: number;
}

export interface NukadokoMaintenanceResult {
  teireFrequencyDaily: number;
  teireInstructionPl: string;
  teireInstructionEn: string;
  saltTopupGrams: number;
  dryBranTopupGrams: number;
  status: 'HEALTHY' | 'RISK_ANAEROBIC_BUTYRIC' | 'RISK_SURFACE_MOLD';
  alertsPl: string[];
  alertsEn: string[];
}

export interface NukazukePicklingTimeResult {
  vegType: NukazukeVegType;
  durationHoursMin: number;
  durationHoursMax: number;
  prepAdvicePl: string;
}

/**
 * Kalkulator zakładania nowego łoża Nukadoko.
 */
export function calculateNukadokoSetup(input: NukadokoSetupInput): NukadokoSetupResult {
  const bran = Math.max(200, input.riceBranGrams);
  const targetSalinity = input.targetSalinityPct ?? 13.0;

  // Tradycyjne proporcje: 1000g prażonych otrębów ryżowych + ok. 850-1000g wody
  const waterGrams = Math.round(bran * 0.90);

  // Zawartość soli w całej masie:
  // Salinity = Salt / (Bran + Water + Salt)  =>  Salt = (Bran + Water) * S / (1 - S)
  const baseMass = bran + waterGrams;
  const sFraction = targetSalinity / 100;
  const saltGrams = Math.round(baseMass * (sFraction / (1 - sFraction)));
  const totalBedMassGrams = baseMass + saltGrams;
  const effectiveSalinityPct = Number(((saltGrams / totalBedMassGrams) * 100).toFixed(1));

  // Dodatki aromatyczne i funkcyjne:
  // Glon kombu dostarcza kwas glutaminowy (umami) i pochłania nadmiar wody
  const konbuGrams = Math.round(bran * 0.02); // 20g na 1kg otrębów
  const driedChiliGrams = Math.max(2, Math.round(bran * 0.004)); // kapsaicyna hamuje pleśnie
  const gingerSlicesGrams = Math.round(bran * 0.015);

  const sutezukeInstructionsPl = [
    '1. Praż otręby ryżowe na suchym woku/patelni na małym ogniu przez 5-8 min (do orzechowego aromatu), ostudź.',
    '2. Rozpuść sól w ciepłej przegotowanej wodzie i stopniowo dolewaj do otrębów, ugniatając do konsystencji mokrego piasku z plaży.',
    '3. Włóż glon konbu, suszone papryczki chili (takano-tsume) i plasterki imbiru.',
    '4. FAZA SUTEZUKE: Zakop w łożu twarde odpady warzywne (liście kapusty, skórki marchwi/daikona). Wymieniaj je co 2-3 dni przez 10-14 dni.',
    '5. Warzywa ze sutezuke wchłoną nadmiar soli i zaszczepią łoże dzikimi bakteriami LAB. Są niejadalne (zbyt słone).',
  ];

  return {
    waterGrams,
    saltGrams,
    totalBedMassGrams,
    effectiveSalinityPct,
    aromaticsGrams: {
      konbuGrams,
      driedChiliGrams,
      gingerSlicesGrams,
    },
    sutezukeDurationDays: 12,
    sutezukeInstructionsPl,
  };
}

/**
 * Pielęgnacja łoża: kontrola częstotliwości mieszania dłonią (Te-ire) i dolewki/odsączania.
 */
export function calculateNukadokoMaintenance(input: NukadokoMaintenanceInput): NukadokoMaintenanceResult {
  const temp = input.ambientTempC;
  const currentSalinity = input.currentEstimatedSalinityPct;
  const isSlushy = input.moistureExcessStatus === 'VERY_SLUSHY';
  const isWet = input.moistureExcessStatus === 'SLIGHTLY_WET';

  // Częstotliwość mieszania ręką (Te-ire):
  // Letnia wysoka temp (>25°C): 2 razy dziennie (rano i wieczorem)
  // Temp pokojowa (18-24°C): 1 raz dziennie
  // Zima / chłód (<16°C): raz na 2-3 dni
  // Lodówka (4-6°C): raz w tygodniu
  let teireFrequencyDaily = 1.0;
  let teireInstructionPl = 'Przemieszaj łoże dłonią raz dziennie od spodu ku górze, aby napowietrzyć spód i wtłoczyć tlen.';
  let teireInstructionEn = 'Stir the bed by hand once daily from bottom to top to aerate the base and introduce oxygen.';

  if (temp >= 25.0) {
    teireFrequencyDaily = 2.0;
    teireInstructionPl = 'Mieszaj dłonią 2 razy dziennie (rano i wieczorem). Wysoka temperatura sprzyja gwałtownemu rozwojowi drożdży kożuchujących i anaerobów!';
    teireInstructionEn = 'Stir twice daily (morning and evening). Warm weather accelerates wild yeasts and anaerobic spoilage!';
  } else if (temp < 16.0) {
    teireFrequencyDaily = 0.4; // raz na 2.5 dnia
    teireInstructionPl = 'Łoże w chłodzie: wystarczy przemieszać raz na 2–3 dni.';
    teireInstructionEn = 'Cold bed: stirring once every 2–3 days is sufficient.';
  }

  // Uzupełnianie soli i otrębów w razie rozcieńczenia przez sok z warzyw
  let saltTopupGrams = 0;
  let dryBranTopupGrams = 0;
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];
  let status: NukadokoMaintenanceResult['status'] = 'HEALTHY';

  if (isSlushy) {
    // łoże stało się błotniste: dodaj prażone otręby i sól
    dryBranTopupGrams = Math.round(input.bedTotalMassGrams * 0.15);
    saltTopupGrams = Math.round(dryBranTopupGrams * 0.13 + (input.bedTotalMassGrams * 0.02));
    alertsPl.push('Nadmiar wilgoci (błotniste łoże): Odsącz kałużę ceramicznym kubkiem lub ręcznikiem i dosyp prażonych otrębów z solą.');
    alertsEn.push('Excessive moisture (slushy bed): Drain liquid pool with cup/towel and add roasted bran with salt.');
  } else if (isWet) {
    dryBranTopupGrams = Math.round(input.bedTotalMassGrams * 0.08);
    saltTopupGrams = Math.round(dryBranTopupGrams * 0.13);
  }

  if (currentSalinity < 10.0) {
    status = 'RISK_ANAEROBIC_BUTYRIC';
    alertsPl.push('KRYTYCZNIE NISKIE ZASOLENIE (<10%): Ryzyko rozwoju bakterii maślanych (Clostridium) powodujących zapach wymiocin/rancid.');
    alertsEn.push('CRITICALLY LOW SALINITY (<10%): Risk of butyric acid bacteria (Clostridium) causing rancid/vomit off-odors.');
  }

  return {
    teireFrequencyDaily,
    teireInstructionPl,
    teireInstructionEn,
    saltTopupGrams,
    dryBranTopupGrams,
    status,
    alertsPl,
    alertsEn,
  };
}

/**
 * Wyliczenie czasu kiszenia poszczególnych warzyw w Nukadoko.
 */
export function getPicklingTimeForVeg(veg: NukazukeVegType, ambientTempC: number): NukazukePicklingTimeResult {
  const isWarm = ambientTempC >= 22;
  switch (veg) {
    case 'CUCUMBER':
      return {
        vegType: 'CUCUMBER',
        durationHoursMin: isWarm ? 6 : 10,
        durationHoursMax: isWarm ? 12 : 20,
        prepAdvicePl: 'Umyj, osusz, natrzyj szczyptą soli i zakop w całości. Przed jedzeniem opłucz z otrębów pod zimną wodą.',
      };
    case 'EGGPLANT':
      return {
        vegType: 'EGGPLANT',
        durationHoursMin: isWarm ? 12 : 18,
        durationHoursMax: isWarm ? 24 : 36,
        prepAdvicePl: 'Przekrój wzdłuż na pół, natrzyj solą (lub kawałkiem żelaza / gwoździem serowarskim), aby zachować purpurową barwę.',
      };
    case 'DAIKON_RADISH':
      return {
        vegType: 'DAIKON_RADISH',
        durationHoursMin: isWarm ? 12 : 16,
        durationHoursMax: isWarm ? 24 : 36,
        prepAdvicePl: 'Pokrój w słupki o grubości 2 cm i lekko podsusz na sitku przez 2 godziny przed zakopaniem.',
      };
    case 'CARROT':
      return {
        vegType: 'CARROT',
        durationHoursMin: isWarm ? 18 : 24,
        durationHoursMax: isWarm ? 36 : 48,
        prepAdvicePl: 'Obierz, przekrój wzdłuż; jako twarde warzywo wymaga dłuższego czasu penetracji.',
      };
    case 'AVOCADO_BOILED_EGG':
      return {
        vegType: 'AVOCADO_BOILED_EGG',
        durationHoursMin: 4,
        durationHoursMax: 8,
        prepAdvicePl: 'Ugotowane na twardo obrane jajko lub połówka twardego awokado. Nie trzymaj dłużej niż 8h.',
      };
  }
}
