// ============================================================================
// Apps4Brew Studio — FERMENT Brine Top-up & Dilution Recovery Engine
// Adjusts and restores brine bath salinity after water absorption or evaporation
// ============================================================================

export interface BrineTopupResult {
  currentVolumeLiters: number;
  currentSalinityPct: number;
  targetSalinityPct: number;
  addedVolumeLiters: number;
  newTotalVolumeLiters: number;
  totalSaltGramsToAdd: number;
  finalSalinityPct: number;
  warning?: string;
}

export interface BrineBoostResult {
  currentVolumeLiters: number;
  currentSalinityPct: number;
  targetSalinityPct: number;
  saltGramsToAdd: number;
  warning?: string;
}

/**
 * Oblicza ile soli należy dodać do istniejącej solanki, aby podnieść jej stężenie
 * (np. solanka serowarska rozcieńczona serwatką z 20% do 16.5%).
 */
export function calculateSaltToBoostBrine(
  currentVolumeLiters: number,
  currentSalinityPct: number,
  targetSalinityPct: number
): BrineBoostResult {
  if (currentVolumeLiters <= 0) throw new Error('Objętość solanki musi być większa od zera.');
  if (currentSalinityPct < 0 || currentSalinityPct > 26.4) {
    throw new Error('Obecne stężenie soli musi mieścić się w zakresie 0%–26.4%.');
  }
  if (targetSalinityPct <= currentSalinityPct || targetSalinityPct > 26.4) {
    throw new Error('Docelowe stężenie musi być wyższe od obecnego i nie przekraczać nasycenia (26.4%).');
  }

  // Przybliżona masa obecnej solanki: rho ≈ 1.0 + 0.0075 * S
  const currentDensity = 1.0 + (currentSalinityPct * 0.0075);
  const currentTotalMassKg = currentVolumeLiters * currentDensity;
  const currentSaltKg = currentTotalMassKg * (currentSalinityPct / 100.0);
  const waterMassKg = currentTotalMassKg - currentSaltKg;

  // Docelowa sól: m_soli_doc = (S_doc / (100 - S_doc)) * m_wody
  const targetSaltKg = (targetSalinityPct / (100.0 - targetSalinityPct)) * waterMassKg;
  const saltToAddKg = Math.max(0, targetSaltKg - currentSaltKg);
  const saltGramsToAdd = Math.round(saltToAddKg * 1000);

  let warning: string | undefined;
  if (targetSalinityPct > 24.0) {
    warning = 'Stężenie zbliża się do maksymalnego nasycenia NaCl (26.4%). Sól może krystalizować na dnie.';
  }

  return {
    currentVolumeLiters,
    currentSalinityPct,
    targetSalinityPct,
    saltGramsToAdd,
    warning,
  };
}

/**
 * Oblicza ile soli i wody dodać przy dolewce solanki (Top-up), aby utrzymać docelowe stężenie.
 */
export function calculateBrineTopupWithVolume(
  currentVolumeLiters: number,
  currentSalinityPct: number,
  targetSalinityPct: number,
  addedVolumeLiters: number
): BrineTopupResult {
  if (currentVolumeLiters <= 0) throw new Error('Objętość solanki musi być większa od zera.');
  if (addedVolumeLiters < 0) throw new Error('Dolewana objętość nie może być ujemna.');

  const boost = calculateSaltToBoostBrine(currentVolumeLiters, currentSalinityPct, targetSalinityPct);

  // Sól potrzebna na dolewany litraż wody: m_soli_dolewka = V_dodana * (S_doc / (100 - S_doc))
  const addedWaterSaltKg = addedVolumeLiters * (targetSalinityPct / (100.0 - targetSalinityPct));
  const addedWaterSaltGrams = Math.round(addedWaterSaltKg * 1000);

  const totalSaltGramsToAdd = boost.saltGramsToAdd + addedWaterSaltGrams;
  const newTotalVolumeLiters = currentVolumeLiters + addedVolumeLiters;

  let warning: string | undefined;
  if (currentSalinityPct < 15.0 && targetSalinityPct >= 18.0) {
    warning = 'Solanka była mocno rozcieńczona (<15%). Sprawdź pH kąpieli i dodaj chlorek wapnia (CaCl2), by zapobiec oślizgłości sera.';
  }

  return {
    currentVolumeLiters,
    currentSalinityPct,
    targetSalinityPct,
    addedVolumeLiters,
    newTotalVolumeLiters,
    totalSaltGramsToAdd,
    finalSalinityPct: targetSalinityPct,
    warning,
  };
}
