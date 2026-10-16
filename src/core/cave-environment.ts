// ============================================================================
// Apps4Brew Studio — FERMENT Cave Environment & Psychrometric VPD Engine
// Vapor Pressure Deficit (VPD), Dew Point, Case Hardening Guard & Rind Affinage Care
// ============================================================================

export type CheeseCaveType = 'HARD_GOUDA_CHEDDAR' | 'WHITE_MOLD_CAMEMBERT' | 'WASHED_RIND_LINENS' | 'ALPINE_GRUYERE';

export interface CaveEnvironmentParams {
  tempCelsius: number;
  relativeHumidityPct: number;
  caveType: CheeseCaveType;
}

export interface CaveEnvironmentResult {
  saturatedVaporPressureKpa: number; // VP_sat
  actualVaporPressureKpa: number;    // VP_act
  vaporPressureDeficitKpa: number;   // VPD
  dewPointCelsius: number;           // T_dp
  spreadToDewPointCelsius: number;   // T - T_dp
  status: 'OPTIMAL' | 'CASE_HARDENING_WARNING' | 'CONDENSATION_MOLD_RISK' | 'TOO_COLD' | 'TOO_WARM';
  isCaseHardeningImminent: boolean;
  isCondensationRisk: boolean;
  environmentalNotes: string;
  recommendation: string;
}

export type AffinageCareAction =
  | 'TURN'
  | 'WASH_BRINE'
  | 'DRY_BRUSH'
  | 'WAX_COATING'
  | 'CLOTHBOUND'
  | 'SALT_RUB';

export interface AffinageScheduleRecommendation {
  dayInCave: number;
  recommendedAction: AffinageCareAction;
  title: string;
  instructions: string;
  brineConcentrationPct?: number;
}

/**
 * Calculates psychrometric parameters: saturated vapor pressure, actual VP, VPD, and dew point.
 * Evaluates biological risks for specific cheese affinage styles.
 */
export function analyzeCaveEnvironment(params: CaveEnvironmentParams): CaveEnvironmentResult {
  const t = params.tempCelsius;
  const rh = Math.max(10, Math.min(100, params.relativeHumidityPct));

  // Magnus-Tetens formula for saturation vapor pressure over water (kPa):
  // VP_sat = 0.61078 * exp((17.27 * T) / (T + 237.3))
  const vpSat = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
  const vpAct = vpSat * (rh / 100.0);
  const vpd = Math.max(0, vpSat - vpAct);

  // Dew point formula
  const gamma = (17.27 * t) / (t + 237.3) + Math.log(rh / 100.0);
  const dewPoint = (237.3 * gamma) / (17.27 - gamma);
  const spreadToDewPoint = t - dewPoint;

  let isCaseHardeningImminent = false;
  let isCondensationRisk = false;
  let status: CaveEnvironmentResult['status'] = 'OPTIMAL';
  let environmentalNotes = '';
  let recommendation = '';

  // Thermal thresholds
  if (t < 8) {
    status = 'TOO_COLD';
    environmentalNotes = 'Zbyt niska temperatura (<8°C). Spowolnienie dojrzewania i aktywności enzymów.';
    recommendation = 'Podnieś temperaturę do 10–13°C, aby umożliwić prawidłową proteolizę.';
  } else if (t > 16) {
    status = 'TOO_WARM';
    environmentalNotes = 'Zbyt wysoka temperatura (>16°C). Ryzyko topnienia tłuszczu (wytapianie) i namnażania gazotwórczych bakterii Clostridium.';
    recommendation = 'Schłodź dojrzewalnię do 10–14°C.';
  } else if (rh < 75 || vpd > 0.32) {
    // Air is too dry, moisture escapes rapidly from wheel surface
    status = 'CASE_HARDENING_WARNING';
    isCaseHardeningImminent = true;
    environmentalNotes = `Alarm Case Hardening (VPD: ${vpd.toFixed(2)} kPa, RH: ${rh}%). Skórka schnie zbyt gwałtownie, tworząc nieprzepuszczalną skorupę!`;
    recommendation = 'Zwiększ wilgotność (wstaw kuwetę z wodą, zamgławiacz lub zamknij ser w wentylowanym pojemniku dojrzewalniczym).';
  } else if (rh > 94 || spreadToDewPoint < 1.0) {
    // Air is near saturation, water droplets condense on cheese surface
    status = 'CONDENSATION_MOLD_RISK';
    isCondensationRisk = true;
    environmentalNotes = `Ryzyko kondensacji i czarnej pleśni (RH: ${rh}%, Delta do punktu rosy: ${spreadToDewPoint.toFixed(1)}°C). Kropelki wody osiadają na krążku.`;
    recommendation = 'Zwiększ mikro-wentylację lub delikatnie obniż wilgotność do 82–88%, osuszając ściany pojemnika.';
  } else {
    status = 'OPTIMAL';
    environmentalNotes = `Środowisko optymalne (VPD: ${vpd.toFixed(2)} kPa, T: ${t}°C, RH: ${rh}%). Stabilna dyfuzja wilgoci.`;
    recommendation = 'Utrzymuj bieżący reżim wietrzenia i harmonogram obracania krążków.';
  }

  return {
    saturatedVaporPressureKpa: Math.round(vpSat * 1000) / 1000,
    actualVaporPressureKpa: Math.round(vpAct * 1000) / 1000,
    vaporPressureDeficitKpa: Math.round(vpd * 1000) / 1000,
    dewPointCelsius: Math.round(dewPoint * 10) / 10,
    spreadToDewPointCelsius: Math.round(spreadToDewPoint * 10) / 10,
    status,
    isCaseHardeningImminent,
    isCondensationRisk,
    environmentalNotes,
    recommendation,
  };
}

/**
 * Generates an affinage care schedule for Gouda/Cheddar hard cheese aging.
 */
export function getAffinageSchedule(caveType: CheeseCaveType): AffinageScheduleRecommendation[] {
  if (caveType === 'WASHED_RIND_LINENS') {
    return [
      {
        dayInCave: 1,
        recommendedAction: 'TURN',
        title: 'Dzień 1: Obrót krążka',
        instructions: 'Obróć krążek na świeżą, czystą matę lub deseczkę świerkową.',
      },
      {
        dayInCave: 3,
        recommendedAction: 'WASH_BRINE',
        title: 'Dzień 3: Przemycie lekką solanką z B. linens',
        instructions: 'Przemyj wilgotną ściereczką nasączoną 4% solanką z dodatkiem kultur maziowych.',
        brineConcentrationPct: 4,
      },
      {
        dayInCave: 7,
        recommendedAction: 'WASH_BRINE',
        title: 'Dzień 7: Drugie przemycie solanką',
        instructions: 'Delikatne przemycie boków i wierzchu. Tworzenie pomarańczowej mazi.',
        brineConcentrationPct: 4,
      },
      {
        dayInCave: 14,
        recommendedAction: 'TURN',
        title: 'Dzień 14: Obrót i ocena aromatu',
        instructions: 'Obróć krążek. Charakterystyczny aromat orzechowo-grzybowy.',
      },
    ];
  }

  // Default: HARD_GOUDA_CHEDDAR
  return [
    {
      dayInCave: 1,
      recommendedAction: 'TURN',
      title: 'Dzień 1: Codzienny obrót',
      instructions: 'Obróć ser o 180°. Zapobiega osiadaniu wilgoci na spodzie krążka.',
    },
    {
      dayInCave: 4,
      recommendedAction: 'WASH_BRINE',
      title: 'Dzień 4: Przetarcie solanką 18%',
      instructions: 'Lekkie przetarcie w celu usunięcia zarodników dzikich pleśni i utwardzenia skórki.',
      brineConcentrationPct: 18,
    },
    {
      dayInCave: 7,
      recommendedAction: 'TURN',
      title: 'Dzień 7: Obrót i inspekcja skórki',
      instructions: 'Sprawdź czy powierzchnia jest sucha, gładka i nie pęka.',
    },
    {
      dayInCave: 14,
      recommendedAction: 'DRY_BRUSH',
      title: 'Dzień 14: Szczotkowanie na sucho',
      instructions: 'Wyszczotkuj miękką szczotką serowarską ewentualne białe kropki pleśni.',
    },
    {
      dayInCave: 21,
      recommendedAction: 'WAX_COATING',
      title: 'Dzień 21: Woskowanie lub powłoka polioctanowa',
      instructions: 'Jeśli skórka jest w 100% sucha, zanurz krążek w gorącym wosku (65°C) lub nałóż powłokę serowarską.',
    },
  ];
}
