// ============================================================================
// Apps4Brew Studio — FERMENT Brine Acidification & Calcium Buffer Engine
// Lactic acid titration, calcium equilibrium & slimy rind prevention
// ============================================================================

export interface BrineAcidificationParams {
  brineWaterLiters: number;
  initialWaterPh: number;        // e.g. 7.5 for typical tap water
  targetPh: number;              // default 5.20 for Gouda/Cheddar
  lacticAcidConcentrationPct: number; // typically 80%
  targetSalinityPct: number;     // e.g. 20%
}

export interface BrineAcidificationResult {
  waterLiters: number;
  saltKg: number;
  lacticAcidMlNeeded: number;
  cacl2GramsNeeded: number;
  isBufferingCritical: boolean;
  equilibriumExplanation: string;
}

/**
 * Calculates acid and calcium chloride required to create a chemically balanced cheese brine.
 * Prevents calcium leaching from cheese curd into brine (the root cause of slimy slippery rinds).
 */
export function calculateBrineAcidification(params: BrineAcidificationParams): BrineAcidificationResult {
  const water = Math.max(0.5, params.brineWaterLiters);
  const currentPh = Math.max(4.0, Math.min(9.0, params.initialWaterPh));
  const targetPh = Math.max(4.8, Math.min(5.6, params.targetPh));
  const acidConc = Math.max(10, Math.min(100, params.lacticAcidConcentrationPct));
  const salinity = Math.max(10, Math.min(26, params.targetSalinityPct));

  // Salt needed: S = (water * salinity) / (100 - salinity)
  const saltKg = Math.round(((water * salinity) / (100 - salinity)) * 100) / 100;

  // Lactic acid requirement:
  // Tap water with typical bicarbonate buffer (~10 dKH) requires approx 2.2 ml of 80% lactic acid per liter
  // to shift pH from ~7.5 to 5.20.
  const deltaPh = Math.max(0, currentPh - targetPh);
  const baseMlPerLiterForDelta2 = 2.2 * (80.0 / acidConc);
  const mlPerLiter = (deltaPh / 2.3) * baseMlPerLiterForDelta2;
  const lacticAcidMlNeeded = Math.round(water * mlPerLiter * 10) / 10;

  // Calcium chloride: 2.0 grams dry pure CaCl2 per liter (or 6 ml of 33% solution per liter)
  // This matches the ionic calcium concentration of the cheese curd.
  const cacl2GramsNeeded = Math.round(water * 2.0 * 10) / 10;

  return {
    waterLiters: water,
    saltKg,
    lacticAcidMlNeeded,
    cacl2GramsNeeded,
    isBufferingCritical: true,
    equilibriumExplanation:
      'Chlorek wapnia (2 g/L) i kwas mlekowy (pH 5.20) stabilizują osmotyczną wymianę jonów. ' +
      'Brak CaCl2 w solance spowoduje wyciąganie wapnia z kazeiny i utworzenie obślizgłej, rozmiękczonej warstwy na serze.',
  };
}
