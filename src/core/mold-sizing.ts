// ============================================================================
// Apps4Brew Studio — FERMENT Mold Sizing & Curd Geometry Engine
// Volume calculation, compaction factors, curd yield & standard artisan molds
// ============================================================================

export type MoldShape = 'CYLINDER' | 'RECTANGULAR';

export interface StandardMoldTemplate {
  id: string;
  name: string;
  shape: MoldShape;
  diameterCm?: number;
  widthCm?: number;
  lengthCm?: number;
  heightCm: number;
  targetCheeseWeightKg: number;
  recommendedStyles: string[];
}

export const STANDARD_MOLD_TEMPLATES: StandardMoldTemplate[] = [
  {
    id: 'korycin_perforated',
    name: 'Forma Korycińska (Owalna perforowana)',
    shape: 'CYLINDER',
    diameterCm: 16,
    heightCm: 14,
    targetCheeseWeightKg: 1.2,
    recommendedStyles: ['Ser Koryciński', 'Ser Podpuszczkowy Świeży', 'Bundz'],
  },
  {
    id: 'kadova_gouda_1kg',
    name: 'Forma Kadova Gouda (z siatką) 1 kg',
    shape: 'CYLINDER',
    diameterCm: 14,
    heightCm: 11,
    targetCheeseWeightKg: 1.0,
    recommendedStyles: ['Gouda', 'Edam', 'Tilsit'],
  },
  {
    id: 'kadova_gouda_2kg',
    name: 'Forma Kadova Gouda (z siatką) 2 kg',
    shape: 'CYLINDER',
    diameterCm: 18,
    heightCm: 13,
    targetCheeseWeightKg: 2.0,
    recommendedStyles: ['Gouda Zagrodowa', 'Cheddar Mini', 'Gruyere Domowy'],
  },
  {
    id: 'camembert_perforated',
    name: 'Forma do Camemberta / Brie',
    shape: 'CYLINDER',
    diameterCm: 11,
    heightCm: 11,
    targetCheeseWeightKg: 0.25,
    recommendedStyles: ['Camembert', 'Brie', 'Valencay'],
  },
  {
    id: 'feta_rectangular_box',
    name: 'Forma Prostokątna do Fety / Twarogu',
    shape: 'RECTANGULAR',
    widthCm: 12,
    lengthCm: 20,
    heightCm: 10,
    targetCheeseWeightKg: 1.5,
    recommendedStyles: ['Feta w solance', 'Twaróg Wiejski', 'Bryndza'],
  },
];

export interface MoldVolumeResult {
  shape: MoldShape;
  volumeCm3: number;
  volumeLiters: number;
  maxPressedCheeseKg: number;
  maxRawCurdVolumeLiters: number;
}

export interface CurdRequirementResult {
  milkVolumeLiters: number;
  expectedYieldKg: number;
  rawCurdVolumeLiters: number;
  requiredMoldVolumeLiters: number;
  recommendedMold: StandardMoldTemplate;
  isMoldSufficient: boolean;
  fillPercentage: number;
}

/**
 * Calculates internal geometric volume of a cylindrical mold
 * V = pi * r^2 * h
 */
export function calculateCylindricalMoldVolume(diameterCm: number, heightCm: number): MoldVolumeResult {
  const safeD = Math.max(1, diameterCm);
  const safeH = Math.max(1, heightCm);
  const radius = safeD / 2.0;
  const volumeCm3 = Math.PI * radius * radius * safeH;
  const volumeLiters = volumeCm3 / 1000.0;

  // Density of pressed cheese is approx 1.06 kg/L
  // Max compressed cheese when mold is filled to 85% height
  const maxPressedCheeseKg = Math.round(volumeLiters * 0.85 * 1.06 * 100) / 100;
  // Unpressed curd has approx 1.7x the volume of fully pressed curd before whey drainage
  const maxRawCurdVolumeLiters = Math.round(volumeLiters * 1.0 * 100) / 100;

  return {
    shape: 'CYLINDER',
    volumeCm3: Math.round(volumeCm3 * 10) / 10,
    volumeLiters: Math.round(volumeLiters * 100) / 100,
    maxPressedCheeseKg,
    maxRawCurdVolumeLiters,
  };
}

/**
 * Calculates internal geometric volume of a rectangular mold
 * V = length * width * height
 */
export function calculateRectangularMoldVolume(lengthCm: number, widthCm: number, heightCm: number): MoldVolumeResult {
  const safeL = Math.max(1, lengthCm);
  const safeW = Math.max(1, widthCm);
  const safeH = Math.max(1, heightCm);
  const volumeCm3 = safeL * safeW * safeH;
  const volumeLiters = volumeCm3 / 1000.0;

  const maxPressedCheeseKg = Math.round(volumeLiters * 0.85 * 1.06 * 100) / 100;
  const maxRawCurdVolumeLiters = Math.round(volumeLiters * 1.0 * 100) / 100;

  return {
    shape: 'RECTANGULAR',
    volumeCm3: Math.round(volumeCm3 * 10) / 10,
    volumeLiters: Math.round(volumeLiters * 100) / 100,
    maxPressedCheeseKg,
    maxRawCurdVolumeLiters,
  };
}

/**
 * Calculates curd requirements for given milk volume and checks compatibility with a selected or recommended mold.
 * @param milkVolumeLiters Volume of milk in vat (L)
 * @param yieldPct Expected yield percentage (default 10.5% for cow milk)
 * @param selectedMoldId Optional mold template ID
 */
export function calculateCurdAndMoldFitting(
  milkVolumeLiters: number,
  yieldPct: number = 10.5,
  selectedMoldId?: string
): CurdRequirementResult {
  const safeMilk = Math.max(0.5, milkVolumeLiters);
  const safeYield = Math.max(5.0, Math.min(25.0, yieldPct));

  // Yield in kg: e.g. 10L milk * 10.5% = 1.05 kg
  const expectedYieldKg = Math.round(((safeMilk * safeYield) / 100.0) * 100) / 100;

  // Unpressed freshly ladled curd holds whey, occupying approx 1.6 - 1.8 L volume per 1 kg finished cheese
  const rawCurdVolumeLiters = Math.round(expectedYieldKg * 1.7 * 100) / 100;
  // Mold must accommodate at least unpressed curd volume before initial whey runoff
  const requiredMoldVolumeLiters = rawCurdVolumeLiters;

  // Select mold
  let mold: StandardMoldTemplate;
  if (selectedMoldId) {
    const found = STANDARD_MOLD_TEMPLATES.find((m) => m.id === selectedMoldId);
    mold = found || STANDARD_MOLD_TEMPLATES[1];
  } else {
    // Pick the closest matching standard mold by target weight
    const sorted = [...STANDARD_MOLD_TEMPLATES].sort(
      (a, b) => Math.abs(a.targetCheeseWeightKg - expectedYieldKg) - Math.abs(b.targetCheeseWeightKg - expectedYieldKg)
    );
    mold = sorted[0];
  }

  // Calculate mold volume
  let moldVolLiters = 0;
  if (mold.shape === 'CYLINDER' && mold.diameterCm) {
    moldVolLiters = calculateCylindricalMoldVolume(mold.diameterCm, mold.heightCm).volumeLiters;
  } else if (mold.lengthCm && mold.widthCm) {
    moldVolLiters = calculateRectangularMoldVolume(mold.lengthCm, mold.widthCm, mold.heightCm).volumeLiters;
  }

  const fillPercentage = Math.round((expectedYieldKg / (moldVolLiters * 1.06)) * 100);
  const isMoldSufficient = moldVolLiters >= expectedYieldKg / 1.06;

  return {
    milkVolumeLiters: safeMilk,
    expectedYieldKg,
    rawCurdVolumeLiters,
    requiredMoldVolumeLiters,
    recommendedMold: mold,
    isMoldSufficient,
    fillPercentage,
  };
}
