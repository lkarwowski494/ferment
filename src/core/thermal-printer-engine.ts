// ============================================================================
// Apps4Brew Studio — SEROWAR Compact Thermal Label & ESC/POS Engine
// Formats direct label layouts for 50x30mm and 58mm Bluetooth thermal roll printers
// used at artisan farm stands and cheese markets.
// ============================================================================

export interface ThermalLabelParams {
  batchCode: string;
  cheeseStyle: string;
  productionDate: string;
  bestBeforeDate: string;
  milkSource: string;
  weightGrams?: number;
  qrPayload?: string;
  isRawMilk?: boolean;
}

export interface FormattedThermalLabel {
  widthMm: number;
  heightMm: number;
  rawTextLines: string[];
  escPosCommandHex: string;
  displaySummary: string;
}

/**
 * Standard ASCII/ESC-POS control byte constants
 */
export const ESC_POS_CONSTANTS = {
  ESC: '\x1B',
  GS: '\x1D',
  INIT: '\x1B\x40',
  ALIGN_CENTER: '\x1B\x61\x01',
  ALIGN_LEFT: '\x1B\x61\x00',
  BOLD_ON: '\x1B\x45\x01',
  BOLD_OFF: '\x1B\x45\x00',
  DOUBLE_HEIGHT: '\x1B\x21\x10',
  NORMAL_TEXT: '\x1B\x21\x00',
  FEED_AND_CUT: '\x1D\x56\x42\x00',
};

/**
 * Generates an ESC/POS command stream and text preview for 50x30mm roll printers.
 */
export function generateThermalLabel50x30(params: ThermalLabelParams): FormattedThermalLabel {
  const lines: string[] = [];
  lines.push('================================');
  lines.push(`SEROWAR RZEMIEŚLNICZY: ${params.cheeseStyle.toUpperCase()}`);
  lines.push('--------------------------------');
  lines.push(`Partia:    ${params.batchCode}`);
  lines.push(`Mleko:     ${params.milkSource} ${params.isRawMilk ? '(SUROWE)' : '(PAST.)'}`);
  lines.push(`Uwarzono:  ${params.productionDate}`);
  lines.push(`Najlepiej: ${params.bestBeforeDate}`);
  if (params.weightGrams) {
    lines.push(`Masa:      ${(params.weightGrams / 1000).toFixed(2)} kg (${params.weightGrams} g)`);
  }
  lines.push('--------------------------------');
  lines.push(`QR: ${params.qrPayload || params.batchCode}`);
  lines.push('================================');

  // Build simulated ESC/POS hex payload
  const hexParts: string[] = [];
  hexParts.push('1B40'); // Init
  hexParts.push('1B6101'); // Center
  hexParts.push('1B4501'); // Bold on
  hexParts.push(Buffer.from(params.cheeseStyle.substring(0, 24) + '\n', 'utf-8').toString('hex'));
  hexParts.push('1B4500'); // Bold off
  hexParts.push('1B6100'); // Align left
  hexParts.push(Buffer.from(`Partia: ${params.batchCode}\n`, 'utf-8').toString('hex'));
  hexParts.push(Buffer.from(`Data: ${params.productionDate}\n`, 'utf-8').toString('hex'));
  if (params.weightGrams) {
    hexParts.push(Buffer.from(`Masa: ${params.weightGrams}g\n`, 'utf-8').toString('hex'));
  }
  hexParts.push('1D564200'); // Feed and cut

  const summary = `${params.cheeseStyle} [${params.batchCode}] — ${params.productionDate} · 50x30mm`;

  return {
    widthMm: 50,
    heightMm: 30,
    rawTextLines: lines,
    escPosCommandHex: hexParts.join(''),
    displaySummary: summary,
  };
}

/**
 * Validates whether label parameters meet food safety and RHD artisan requirements.
 */
export function validateArtisanLabelRequirements(params: ThermalLabelParams): {
  isValid: boolean;
  missingFields: string[];
} {
  const missing: string[] = [];
  if (!params.batchCode || params.batchCode.trim().length === 0) missing.push('Kod partii');
  if (!params.cheeseStyle || params.cheeseStyle.trim().length === 0) missing.push('Nazwa gatunku sera');
  if (!params.productionDate || params.productionDate.trim().length === 0) missing.push('Data produkcji');
  if (!params.bestBeforeDate || params.bestBeforeDate.trim().length === 0) missing.push('Data minimalnej trwałości');
  if (!params.milkSource || params.milkSource.trim().length === 0) missing.push('Gatunek mleka');

  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
}
