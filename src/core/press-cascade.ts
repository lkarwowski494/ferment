// ============================================================================
// Apps4Brew Studio — FERMENT Dutch Lever Press & Cascaded Pressing Engine
// Tare compensation, mechanical advantage leverage, PSI calculation & rind protection
// ============================================================================

export interface DutchLeverParameters {
  armTotalLengthCm: number;       // Distance from pivot to weight hanger (L_arm)
  moldDistanceCm: number;         // Distance from pivot to center of mold (L_mold)
  armSelfWeightKg: number;        // Mass of the wooden/steel lever arm itself
  weightHungKg: number;           // Weight attached to the hanger
  moldDiameterCm: number;         // Diameter of cylindrical cheese mold
}

export interface DutchLeverResult {
  mechanicalAdvantageRatio: number; // L_arm / L_mold
  tareForceFromArmKg: number;       // Effective force exerted solely by arm weight
  weightForceKg: number;            // Force exerted by hanging weight
  totalAppliedForceKg: number;      // Total downward force on follower
  moldSurfaceAreaCm2: number;       // pi * r^2
  pressureKgPerCm2: number;         // Force / Area
  pressurePsi: number;              // PSI (1 kg/cm2 = 14.2233 psi)
}

export interface PressingCascadeStage {
  stageNumber: number;
  name: string;
  durationMinutes: number;
  recommendedPressurePsi: number;
  recommendedForcePerWeightRatio: number; // e.g. 1.5x cheese weight
  targetForceKg: number;
  actionInstruction: string;
  isFlipRequired: boolean;
  clothAction: 'WET_CLOTH' | 'WRUNG_CLOTH' | 'SMOOTH_CLOTH' | 'NO_CLOTH';
}

export interface PressingCascadeProgram {
  cheeseStyleName: string;
  estimatedCheeseWeightKg: number;
  moldDiameterCm: number;
  stages: PressingCascadeStage[];
  totalPressingMinutes: number;
  rindEntrapmentWarning?: string;
}

/**
 * Calculates physics for a Dutch lever cheese press with tare compensation.
 */
export function calculateDutchLeverPress(params: DutchLeverParameters): DutchLeverResult {
  const safeArmLen = Math.max(10, params.armTotalLengthCm);
  const safeMoldDist = Math.max(5, Math.min(safeArmLen, params.moldDistanceCm));
  const safeArmMass = Math.max(0, params.armSelfWeightKg);
  const safeWeight = Math.max(0, params.weightHungKg);
  const safeDiameter = Math.max(5, params.moldDiameterCm);

  // Mechanical advantage ratio: L_arm / L_mold
  const mechanicalAdvantageRatio = Math.round((safeArmLen / safeMoldDist) * 100) / 100;

  // Assuming uniform mass distribution, center of gravity is at L_arm / 2
  // Torque_arm = safeArmMass * (safeArmLen / 2)
  // Force_tare = Torque_arm / safeMoldDist
  const tareForceFromArmKg = Math.round(((safeArmMass * (safeArmLen / 2.0)) / safeMoldDist) * 100) / 100;

  // Force from weight = safeWeight * (safeArmLen / safeMoldDist)
  const weightForceKg = Math.round((safeWeight * mechanicalAdvantageRatio) * 100) / 100;

  const totalAppliedForceKg = Math.round((weightForceKg + tareForceFromArmKg) * 100) / 100;

  const radiusCm = safeDiameter / 2.0;
  const moldSurfaceAreaCm2 = Math.round(Math.PI * radiusCm * radiusCm * 10) / 10;

  const pressureKgPerCm2 = Math.round((totalAppliedForceKg / moldSurfaceAreaCm2) * 1000) / 1000;
  const pressurePsi = Math.round(pressureKgPerCm2 * 14.2233 * 100) / 100;

  return {
    mechanicalAdvantageRatio,
    tareForceFromArmKg,
    weightForceKg,
    totalAppliedForceKg,
    moldSurfaceAreaCm2,
    pressureKgPerCm2,
    pressurePsi,
  };
}

/**
 * Generates a 3-stage cascaded pressing program for artisan semi-hard / hard cheeses.
 * Prevents rind entrapment (premature skin sealing trapping sour whey in core).
 */
export function generatePressingCascadeProgram(
  cheeseStyleName: string,
  estimatedCheeseWeightKg: number,
  moldDiameterCm: number
): PressingCascadeProgram {
  const safeWeight = Math.max(0.5, estimatedCheeseWeightKg);
  const safeDiameter = Math.max(8, moldDiameterCm);
  const radius = safeDiameter / 2.0;
  const area = Math.PI * radius * radius;

  // Stage 1: Initial settle & knit (1.5x cheese weight)
  const stage1Force = Math.round(safeWeight * 1.5 * 10) / 10;
  const stage1Psi = Math.round((stage1Force / area) * 14.2233 * 100) / 100;

  // Stage 2: Intermediate consolidation (3.5x cheese weight)
  const stage2Force = Math.round(safeWeight * 3.5 * 10) / 10;
  const stage2Psi = Math.round((stage2Force / area) * 14.2233 * 100) / 100;

  // Stage 3: Full rind closure & consolidation (7.5x cheese weight)
  const stage3Force = Math.round(safeWeight * 7.5 * 10) / 10;
  const stage3Psi = Math.round((stage3Force / area) * 14.2233 * 100) / 100;

  const stages: PressingCascadeStage[] = [
    {
      stageNumber: 1,
      name: 'Faza 1: Wstępne Ułożenie Gęstwy',
      durationMinutes: 45,
      recommendedPressurePsi: stage1Psi,
      recommendedForcePerWeightRatio: 1.5,
      targetForceKg: stage1Force,
      actionInstruction: 'Lekki docisk grawitacyjny w mokrej chuście serowarskiej. Pozwala na swobodny odpływ serwatki bez zamykania porów.',
      isFlipRequired: false,
      clothAction: 'WET_CLOTH',
    },
    {
      stageNumber: 2,
      name: 'Faza 2: Pierwszy Obrót i Formowanie Skórki',
      durationMinutes: 120, // 2h
      recommendedPressurePsi: stage2Psi,
      recommendedForcePerWeightRatio: 3.5,
      targetForceKg: stage2Force,
      actionInstruction: 'Wyjmij ser, odwróć do góry dnem, wygładź chustę. Umiarkowany nacisk formuje równą powierzchnię walca.',
      isFlipRequired: true,
      clothAction: 'WRUNG_CLOTH',
    },
    {
      stageNumber: 3,
      name: 'Faza 3: Zamknięcie Struktury i Ostateczny Docisk',
      durationMinutes: 720, // 12h
      recommendedPressurePsi: stage3Psi,
      recommendedForcePerWeightRatio: 7.5,
      targetForceKg: stage3Force,
      actionInstruction: 'Drugi obrót, dokładne wygładzenie chusty lub prasowanie bez chusty (np. w formie Kadova). Pełny docisk zamyka mikroszczeliny.',
      isFlipRequired: true,
      clothAction: 'SMOOTH_CLOTH',
    },
  ];

  return {
    cheeseStyleName,
    estimatedCheeseWeightKg: safeWeight,
    moldDiameterCm: safeDiameter,
    stages,
    totalPressingMinutes: 45 + 120 + 720, // 885 min (14h 45m)
    rindEntrapmentWarning: 'NIGDY nie stosuj maksymalnego obciążenia w fazie 1! Zbyt wysoki nacisk zasklepi zewnętrzną warstwę, uwięzi serwatkę w rdzeniu i doprowadzi do przekwaszenia oraz pękania krążka.',
  };
}
