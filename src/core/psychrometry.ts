// ============================================================================
// Apps4Brew Studio — FERMENT Psychrometry & Cheese Cave Microclimate
// Mathematical Tier 1 Rigor (Magnus-Tetens Approximation / VPD Physics)
// ============================================================================

export interface PsychrometricAnalysisResult {
  temperatureC: number;
  humidityRhPct: number;
  dewPointC: number;
  saturatedVaporPressureKPa: number;
  actualVaporPressureKPa: number;
  vaporPressureDeficitKPa: number;
  condensationRisk: boolean;
  dryingRisk: boolean;
  status: 'OPTIMAL' | 'TOO_DRY' | 'TOO_HUMID' | 'CONDENSATION_DANGER';
  message: string;
}

/**
 * RD-06: Oblicza temperaturę punktu rosy (°C) wg formuły Magnusa-Tetensa.
 */
export function calculateDewPoint(temperatureC: number, humidityRhPct: number): number {
  if (humidityRhPct <= 0 || humidityRhPct > 100) {
    throw new Error('Wilgotność względna musi mieścić się w przedziale 0–100%.');
  }

  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temperatureC) / (b + temperatureC) + Math.log(humidityRhPct / 100.0);
  const dewPoint = (b * alpha) / (a - alpha);

  return Math.round(dewPoint * 10) / 10;
}

/**
 * Oblicza nasyconą prężność pary wodnej (es) oraz deficyt prężności pary (VPD) w kPa.
 */
export function calculateVpd(temperatureC: number, humidityRhPct: number): {
  esKPa: number;
  eaKPa: number;
  vpdKPa: number;
} {
  // Tetens formula dla nasyconej prężności pary w kPa
  const esKPa = 0.61078 * Math.exp((17.27 * temperatureC) / (temperatureC + 237.3));
  const eaKPa = esKPa * (humidityRhPct / 100.0);
  const vpdKPa = Math.max(0, esKPa - eaKPa);

  return {
    esKPa: Math.round(esKPa * 1000) / 1000,
    eaKPa: Math.round(eaKPa * 1000) / 1000,
    vpdKPa: Math.round(vpdKPa * 1000) / 1000,
  };
}

/**
 * RD-12: Kompleksowa analiza mikroklimatu jaskini serowej (Cheese Cave / Komora dojrzewalnicza).
 */
export function analyzeCaveMicroclimate(
  temperatureC: number,
  humidityRhPct: number,
  cheeseSurfaceTempC?: number
): PsychrometricAnalysisResult {
  const dewPointC = calculateDewPoint(temperatureC, humidityRhPct);
  const { esKPa, eaKPa, vpdKPa } = calculateVpd(temperatureC, humidityRhPct);

  const surfaceTemp = cheeseSurfaceTempC !== undefined ? cheeseSurfaceTempC : temperatureC;
  const condensationRisk = surfaceTemp <= dewPointC;
  const dryingRisk = humidityRhPct < 75.0;

  let status: PsychrometricAnalysisResult['status'];
  let message: string;

  if (condensationRisk) {
    status = 'CONDENSATION_DANGER';
    message = `ALARM KONDENSACJI: Temperatura powierzchni sera (${surfaceTemp}°C) jest niższa lub równa punktowi rosy (${dewPointC}°C). Na krążku skrapla się woda — wysokie ryzyko czarnej pleśni (Mucor)! Zwiększ cyrkulację powietrza.`;
  } else if (dryingRisk) {
    status = 'TOO_DRY';
    message = `ZBYT SUCHO: Wilgotność ${humidityRhPct}% RH jest za niska dla skórki naturalnej. Ryzyko pękania boków krążka i zablokowania dojrzewania. Zwiększ wilgotność do 82–88% RH.`;
  } else if (humidityRhPct > 95.0) {
    status = 'TOO_HUMID';
    message = `Bardzo wysoka wilgotność (${humidityRhPct}% RH). Ryzyko zaparzenia skórki i gnicia maziowego. Otwórz komorę na 15 minut w celu przewietrzenia.`;
  } else {
    status = 'OPTIMAL';
    message = `Warunki optymalne (Temp: ${temperatureC}°C, RH: ${humidityRhPct}%, Punkt rosy: ${dewPointC}°C, VPD: ${vpdKPa} kPa). Prawidłowy mikroklimat leżakowania sera.`;
  }

  return {
    temperatureC,
    humidityRhPct,
    dewPointC,
    saturatedVaporPressureKPa: esKPa,
    actualVaporPressureKPa: eaKPa,
    vaporPressureDeficitKPa: vpdKPa,
    condensationRisk,
    dryingRisk,
    status,
    message,
  };
}
