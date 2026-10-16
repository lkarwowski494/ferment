// ============================================================================
// Apps4Brew Studio — FERMENT Koji, Shio Koji & Amazake Hydrolysis Engine
// Aspergillus oryzae enzymatic kinetics, thermal windows & safe formulations
// ============================================================================

export type KojiProductType = 'SHIO_KOJI' | 'AMAZAKE' | 'SHIRO_MISO' | 'AKAMISO';

export type KojiMoistureState = 'DRIED' | 'FRESH'; // Koji suszone vs świeże (nama-koji)

export interface ShioKojiRecipeInput {
  kojiMassGrams: number;
  kojiState: KojiMoistureState;
  targetSalinityPercent?: number; // domyślnie 11.5% (bezpieczny standard)
  fermentationTempC?: number; // 22°C (ambient) lub 58°C (sous-vide / termogarnki)
}

export interface ShioKojiRecipeResult {
  waterGrams: number;
  saltGrams: number;
  totalBatchMassGrams: number;
  effectiveSalinityPercent: number;
  fermentationDurationHours: number;
  fermentationMethodPl: string;
  fermentationMethodEn: string;
  dailyStirringRequired: boolean;
  meatTenderizingDoseGrams: (meatWeightGrams: number) => number;
  alertsPl: string[];
  alertsEn: string[];
}

export interface AmazakeRecipeInput {
  kojiMassGrams: number;
  cookedRiceMassGrams: number;
  targetWaterGrams?: number;
  incubationTempC: number;
  incubationHours?: number;
}

export interface AmazakeRecipeResult {
  waterGrams: number;
  totalMassGrams: number;
  incubationHours: number;
  safetyStatus: 'OPTIMAL' | 'RISK_OF_LACTIC_SOURING' | 'CRITICAL_AMYLASE_DENATURATION';
  recommendedTempRangeC: { min: number; max: number };
  expectedBrixSweetness: number;
  alertsPl: string[];
  alertsEn: string[];
  instructionsPl: string[];
}

export interface MisoFormulationInput {
  cookedSoybeansGrams: number;
  kojiGrams: number;
  misoType: 'SHIRO_MISO' | 'AKAMISO';
  saltGrams?: number;
}

export interface MisoFormulationResult {
  saltGrams: number;
  saltPercent: number;
  pressWeightGrams: number; // zalecane obciążenie (kamień / ciężar)
  fermentationDurationMonths: number;
  safetyStatus: 'SAFE' | 'LOW_SALT_SPOILAGE_RISK' | 'EXCESSIVE_SALT';
  alertsPl: string[];
  alertsEn: string[];
}

/**
 * Obliczenia proporcji Shio Koji (słonej pasty enzymatycznej do marynowania).
 */
export function calculateShioKoji(input: ShioKojiRecipeInput): ShioKojiRecipeResult {
  const koji = Math.max(10, input.kojiMassGrams);
  const isFresh = input.kojiState === 'FRESH';
  const targetSalinity = input.targetSalinityPercent ?? 11.5;
  const tempC = input.fermentationTempC ?? 22.0;

  // Świeże koji zawiera ~35% wilgoci, suszone ~10%.
  // Suszone wymaga proporcjonalnie więcej wody (1.35x masy koji vs 1.1x dla świeżego).
  const waterRatio = isFresh ? 1.10 : 1.35;
  const waterGrams = Math.round(koji * waterRatio);

  // Docelowa zawartość soli w całej masie:
  // Salinity = Salt / (Koji + Water + Salt)  =>  Salt = (Koji + Water) * S / (1 - S)
  const baseMass = koji + waterGrams;
  const sFraction = targetSalinity / 100;
  const saltGrams = Math.round(baseMass * (sFraction / (1 - sFraction)));
  const totalMass = baseMass + saltGrams;
  const effectiveSalinity = Number(((saltGrams / totalMass) * 100).toFixed(1));

  const alertsPl: string[] = [];
  const alertsEn: string[] = [];

  if (effectiveSalinity < 9.0) {
    alertsPl.push('Zasolenie poniżej 9% — wysokie ryzyko niekontrolowanej fermentacji mlekowej i zepsucia wsadu.');
    alertsEn.push('Salinity below 9% — high risk of uncontrolled lactic souring and spoilage.');
  } else if (effectiveSalinity > 15.0) {
    alertsPl.push('Zasolenie powyżej 15% — silna inhibicja enzymów proteolitycznych koji, słabe kruszenie mięsa.');
    alertsEn.push('Salinity above 15% — severe inhibition of koji proteolytic enzymes, weak meat tenderizing.');
  }

  const isAccelerated = tempC >= 52 && tempC <= 62;
  const fermentationDurationHours = isAccelerated ? 8 : (tempC >= 25 ? 168 : 240); // 8h sous-vide vs 7-10 dni ambient
  const dailyStirringRequired = !isAccelerated;

  const fermentationMethodPl = isAccelerated
    ? `Szybka hydroliza termiczna (${tempC}°C sous-vide / garnek wielofunkcyjny)`
    : `Tradycyjna fermentacja pokojowa (${tempC}°C, 7–10 dni z codziennym napowietrzaniem)`;

  const fermentationMethodEn = isAccelerated
    ? `Accelerated thermal hydrolysis (${tempC}°C sous-vide / multicooker)`
    : `Traditional ambient fermentation (${tempC}°C, 7–10 days with daily stirring)`;

  return {
    waterGrams,
    saltGrams,
    totalBatchMassGrams: totalMass,
    effectiveSalinityPercent: effectiveSalinity,
    fermentationDurationHours,
    fermentationMethodPl,
    fermentationMethodEn,
    dailyStirringRequired,
    meatTenderizingDoseGrams: (meatWeight: number) => Math.round(meatWeight * 0.10), // 10% wagi mięsa
    alertsPl,
    alertsEn,
  };
}

/**
 * Kalkulator słodkiego napoju ryżowego Amazake i weryfikacja okna amylolitycznego.
 */
export function calculateAmazake(input: AmazakeRecipeInput): AmazakeRecipeResult {
  const koji = Math.max(10, input.kojiMassGrams);
  const cookedRice = Math.max(0, input.cookedRiceMassGrams);
  const water = input.targetWaterGrams ?? Math.round((koji + cookedRice) * 0.8);
  const totalMass = koji + cookedRice + water;
  const temp = input.incubationTempC;
  const hours = input.incubationHours ?? 8;

  let safetyStatus: AmazakeRecipeResult['safetyStatus'] = 'OPTIMAL';
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];
  const instructionsPl: string[] = [];

  if (temp < 52.0) {
    safetyStatus = 'RISK_OF_LACTIC_SOURING';
    alertsPl.push(`KRYTYCZNE RYZYKO KWAŚNIENIA: Temperatura ${temp}°C sprzyja namnażaniu dzikich bakterii kwasu mlekowego. Amazake skwaśnieje zamiast osiągnąć głęboką słodycz.`);
    alertsEn.push(`CRITICAL SOURING RISK: Incubation at ${temp}°C promotes wild lactic acid bacteria. Amazake will turn sour instead of naturally sweet.`);
  } else if (temp > 63.0) {
    safetyStatus = 'CRITICAL_AMYLASE_DENATURATION';
    alertsPl.push(`KRYTYCZNA DENATURACJA ENZYMÓW: Temperatura ${temp}°C nieodwracalnie niszczy alfa-amylazę i glukoamylazę Aspergillus oryzae. Hydroliza skrobi ustanie.`);
    alertsEn.push(`CRITICAL ENZYME DENATURATION: Incubation at ${temp}°C permanently destroys koji amylases. Starch saccharification will halt.`);
  } else {
    safetyStatus = 'OPTIMAL';
  }

  // W temperaturze optymalnej (55-60°C) następuje pełna konwersja skrobi na glukozę
  const expectedBrixSweetness = safetyStatus === 'OPTIMAL' ? 24.0 : (temp < 52 ? 14.0 : 6.0);

  instructionsPl.push('1. Wymieszaj ugotowany ryż z ciepłą wodą i ostudź do 60°C przed dodaniem koji (aby nie ubić enzymów).');
  instructionsPl.push('2. Umieść w termosie, sous-vide lub jogurtownicy i utrzymuj stabilne 55–60°C przez 6–10 godzin.');
  instructionsPl.push('3. Po zakończeniu podgrzej do 80°C na 5 minut (blanszowanie enzymów), aby zatrzymać dalsze rozrzedzanie i utrwalić smak w lodówce.');

  return {
    waterGrams: water,
    totalMassGrams: totalMass,
    incubationHours: hours,
    safetyStatus,
    recommendedTempRangeC: { min: 55.0, max: 60.0 },
    expectedBrixSweetness,
    alertsPl,
    alertsEn,
    instructionsPl,
  };
}

/**
 * Bilansowanie formulacji Miso (Shiro vs Akamiso) i zapobieganie zepsuciu.
 */
export function calculateMisoFormulation(input: MisoFormulationInput): MisoFormulationResult {
  const soy = Math.max(10, input.cookedSoybeansGrams);
  const koji = Math.max(10, input.kojiGrams);
  const isShiro = input.misoType === 'SHIRO_MISO';

  // Standard soli: Shiro 5.5% masy ogólnej, Akamiso 12.0%
  const defaultSaltPercent = isShiro ? 5.5 : 12.0;
  const substrateMass = soy + koji;

  let saltGrams = input.saltGrams;
  if (saltGrams === undefined) {
    const sFraction = defaultSaltPercent / 100;
    saltGrams = Math.round(substrateMass * (sFraction / (1 - sFraction)));
  }

  const totalMass = substrateMass + saltGrams;
  const saltPercent = Number(((saltGrams / totalMass) * 100).toFixed(1));

  let safetyStatus: MisoFormulationResult['safetyStatus'] = 'SAFE';
  const alertsPl: string[] = [];
  const alertsEn: string[] = [];

  if (saltPercent < 4.5) {
    safetyStatus = 'LOW_SALT_SPOILAGE_RISK';
    alertsPl.push('KRYTYCZNIE NISKIE ZASOLENIE (<4.5%): Grozi rozwojem pleśni powierzchniowych i bakterii gnilnych.');
    alertsEn.push('CRITICALLY LOW SALT (<4.5%): High risk of surface molds and putrefactive bacteria.');
  } else if (saltPercent > 14.5) {
    safetyStatus = 'EXCESSIVE_SALT';
    alertsPl.push('Bardzo wysokie zasolenie (>14.5%): Może drastycznie spowolnić proteolizę i nadać dominujący słony smak.');
    alertsEn.push('Excessive salt (>14.5%): May drastically slow proteolysis and taste excessively salty.');
  }

  // Ciężar dociskowy: zazwyczaj 20-30% wagi całkowitej miso
  const pressWeightGrams = Math.round(totalMass * (isShiro ? 0.20 : 0.30));
  const fermentationDurationMonths = isShiro ? 1.5 : 12;

  return {
    saltGrams,
    saltPercent,
    pressWeightGrams,
    fermentationDurationMonths,
    safetyStatus,
    alertsPl,
    alertsEn,
  };
}
