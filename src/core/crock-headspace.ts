// ============================================================================
// Apps4Brew Studio — FERMENT Crock & Jar Headspace Sizing Engine
// Vegetable packing volume, stone weight displacement & gas overflow prevention
// ============================================================================

export type FermentWeightMaterial = 'GLASS_FLAT' | 'CERAMIC_SPLIT' | 'GRANITE_SMOOTH';
export type VegetablePackType = 'SHREDDED_DENSE' | 'CHUNKY_KIMCHI' | 'WHOLE_PICKLES';

export interface CrockHeadspaceParams {
  jarCapacityMl: number;          // Nominal volume of jar/crock (e.g. 1000 ml, 2000 ml, 5000 ml)
  vegetableWeightGrams: number;   // Weight of cabbage/cucumbers (g)
  brineWaterMl: number;           // Volume of added brine (ml)
  weightMassGrams: number;        // Weight of fermentation stone/glass (g)
  weightMaterial?: FermentWeightMaterial;
  packType?: VegetablePackType;
  jarInnerDiameterCm?: number;    // Diameter of jar for headspace height calculation
}

export interface CrockHeadspaceResult {
  jarCapacityMl: number;
  totalSubstanceVolumeMl: number;
  displacedWeightVolumeMl: number;
  remainingHeadspaceMl: number;
  headspacePercentage: number;
  headspaceHeightCm?: number;
  isSafeFromOverflow: boolean;
  isExcessiveHeadspace: boolean;
  status: 'OPTIMAL' | 'RISK_OVERFLOW' | 'RISK_EXCESS_OXYGEN' | 'CRITICAL_SPILL';
  summaryAlert: string;
  recommendations: string[];
}

/**
 * Density constants for materials (g/cm3 = g/ml)
 */
const MATERIAL_DENSITY: Record<FermentWeightMaterial, number> = {
  GLASS_FLAT: 2.50,
  CERAMIC_SPLIT: 2.30,
  GRANITE_SMOOTH: 2.70,
};

/**
 * Vegetable specific volume (ml per gram) depending on packing style
 */
const PACK_SPECIFIC_VOLUME: Record<VegetablePackType, number> = {
  SHREDDED_DENSE: 0.95, // Compacted shredded cabbage
  CHUNKY_KIMCHI: 1.05,  // Cut quarters of Napa cabbage
  WHOLE_PICKLES: 1.15,  // Whole pickling cucumbers with interstitial spaces
};

/**
 * Calculates jar fill level, stone weight displacement and headspace safety
 */
export function calculateCrockHeadspace(params: CrockHeadspaceParams): CrockHeadspaceResult {
  const {
    jarCapacityMl,
    vegetableWeightGrams,
    brineWaterMl,
    weightMassGrams,
    weightMaterial = 'GLASS_FLAT',
    packType = 'SHREDDED_DENSE',
    jarInnerDiameterCm = 9.5, // Standard wide-mouth Mason / Weck jar
  } = params;

  if (jarCapacityMl <= 0) {
    throw new Error('Pojemność słoja/kamionki musi być większa od zera.');
  }
  if (vegetableWeightGrams <= 0) {
    throw new Error('Waga warzyw musi być większa od zera.');
  }
  if (brineWaterMl < 0) {
    throw new Error('Objętość solanki nie może być ujemna.');
  }
  if (weightMassGrams < 0) {
    throw new Error('Waga docisku nie może być ujemna.');
  }

  // 1. Calculate physical volumes
  const vegVolumeMl = Math.round(vegetableWeightGrams * PACK_SPECIFIC_VOLUME[packType]);
  const density = MATERIAL_DENSITY[weightMaterial] || 2.50;
  const displacedWeightVolumeMl = weightMassGrams > 0 ? Math.round(weightMassGrams / density) : 0;

  const totalSubstanceVolumeMl = Math.round(vegVolumeMl + brineWaterMl + displacedWeightVolumeMl);
  const remainingHeadspaceMl = Math.round(jarCapacityMl - totalSubstanceVolumeMl);
  const headspacePercentage = Math.round((remainingHeadspaceMl / jarCapacityMl) * 1000) / 10;

  // Headspace height in cm: h = V / (pi * r^2)
  let headspaceHeightCm: number | undefined;
  if (jarInnerDiameterCm > 0) {
    const radius = jarInnerDiameterCm / 2;
    const baseAreaCm2 = Math.PI * Math.pow(radius, 2);
    headspaceHeightCm = Math.round((remainingHeadspaceMl / baseAreaCm2) * 10) / 10;
  }

  const recommendations: string[] = [];
  let status: CrockHeadspaceResult['status'] = 'OPTIMAL';
  let isSafeFromOverflow = true;
  let isExcessiveHeadspace = false;
  let summaryAlert = '';

  if (remainingHeadspaceMl < 0) {
    status = 'CRITICAL_SPILL';
    isSafeFromOverflow = false;
    summaryAlert = `Przelew naczynia! Zawartość przekracza pojemność słoja o ${Math.abs(remainingHeadspaceMl)} ml.`;
    recommendations.push(
      'Użyj większego słoja lub odlej część solanki i zmniejsz wsad warzyw.',
      'Docisk z kamienia/szkła wyprze ciecz poza krawędź naczynia.'
    );
  } else if (remainingHeadspaceMl < 40 || headspacePercentage < 4.0) {
    status = 'RISK_OVERFLOW';
    isSafeFromOverflow = false;
    summaryAlert = `Zagrożenie wykipieniem! Zbyt mała przestrzeń wolna (${remainingHeadspaceMl} ml / ${headspacePercentage}%).`;
    recommendations.push(
      'W pierwszych 48h burzliwa produkcja CO2 uniesie solankę i zaleje uszczelkę lub rurkę fermentacyjną.',
      'Zapewnij minimum 2–3 cm (ok. 60–80 ml) wolnej przestrzeni pod pokrywką.'
    );
  } else if (headspacePercentage > 25.0) {
    status = 'RISK_EXCESS_OXYGEN';
    isExcessiveHeadspace = true;
    summaryAlert = `Zbyt duża poduszka powietrzna (${remainingHeadspaceMl} ml / ${headspacePercentage}%). Ryzyko kożuszka Kahm i pleśni.`;
    recommendations.push(
      'Nadmiar tlenu w słoju utrudnia szybkie wytworzenie warunków beztlenowych przez bakterie mlekowe.',
      'Przełóż kiszonkę do mniejszego naczynia lub dolej więcej zbuforowanej solanki.'
    );
  } else {
    status = 'OPTIMAL';
    summaryAlert = `Optymalna przestrzeń wolna: ${remainingHeadspaceMl} ml (${headspacePercentage}% objętości słoja).`;
    recommendations.push(
      'Prawidłowy bufor na rozprężanie gazów fermentacyjnych bez ryzyka wykipienia.',
      'Kamień dociskowy zapewnia pełne zanurzenie warzyw pod solanką.'
    );
  }

  return {
    jarCapacityMl,
    totalSubstanceVolumeMl,
    displacedWeightVolumeMl,
    remainingHeadspaceMl,
    headspacePercentage,
    headspaceHeightCm,
    isSafeFromOverflow,
    isExcessiveHeadspace,
    status,
    summaryAlert,
    recommendations,
  };
}
