// ============================================================================
// Apps4Brew Studio — FERMENT A4 Label Sheet Generator
// Printable QR code sticker grid for cheese wheels and ferment jars
// ============================================================================

import QRCode from 'qrcode';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface LabelItem {
  id: string;
  batchNumber: string;
  name: string;
  category: 'cheese' | 'vegetable' | 'beverage';
  dateCreated: string;
  targetDate?: string;
  safetyDetails?: string; // e.g. "pH: 5.2 | Solanka: 20%" or "pH < 4.4 [BEZPIECZNE]"
  caveLocation?: string;
}

/**
 * Generates an offline data URL QR code string for a given batch ID or code
 */
export async function generateQrDataUrl(payload: string): Promise<string> {
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
    color: {
      dark: '#1C1917', // Apps4Brew stone-900
      light: '#FFFFFF',
    },
  });
}

/**
 * Generates HTML for an A4 sticker sheet (2 columns x 4 rows = 8 labels per page)
 */
export async function generateA4LabelSheetHtml(labels: LabelItem[]): Promise<string> {
  const qrCodes = await Promise.all(
    labels.map(l => generateQrDataUrl(JSON.stringify({ id: l.id, batch: l.batchNumber })))
  );

  const labelCardsHtml = labels
    .map((l, idx) => {
      const qrUri = qrCodes[idx];
      return `
      <div class="label-card">
        <div class="label-header">
          <span class="badge ${l.category}">${l.category.toUpperCase()}</span>
          <span class="batch-no">${l.batchNumber}</span>
        </div>
        <div class="label-body">
          <div class="qr-col">
            <img src="${qrUri}" class="qr-img" alt="QR" />
          </div>
          <div class="info-col">
            <h2 class="title">${l.name}</h2>
            <p class="dates"><strong>Utworzono:</strong> ${l.dateCreated.slice(0, 10)}</p>
            ${l.targetDate ? `<p class="dates"><strong>Dojrzałość:</strong> ${l.targetDate.slice(0, 10)}</p>` : ''}
            ${l.caveLocation ? `<p class="location"><strong>Miejsce:</strong> ${l.caveLocation}</p>` : ''}
            ${l.safetyDetails ? `<div class="safety-box">${l.safetyDetails}</div>` : ''}
          </div>
        </div>
        <div class="label-footer">
          <span>FERMENT — Ser & Flora Domowa</span>
          <span>Apps4Brew Studio</span>
        </div>
      </div>
    `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>FERMENT — Arkusz Etykiet A4</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      color: #1C1917;
      -webkit-print-color-adjust: exact;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 8mm;
      box-sizing: border-box;
    }
    .label-card {
      border: 1.5px dashed #A8A29E;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 62mm;
      box-sizing: border-box;
      background: #FAFAF9;
      page-break-inside: avoid;
    }
    .label-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E7E5E4;
      padding-bottom: 4px;
    }
    .badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge.cheese { background: #FEF3C7; color: #92400E; }
    .badge.vegetable { background: #DCFCE7; color: #166534; }
    .badge.beverage { background: #F3E8FF; color: #6B21A8; }
    .batch-no {
      font-family: monospace;
      font-weight: 700;
      font-size: 11px;
      color: #44403C;
    }
    .label-body {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 6px 0;
      gap: 10px;
      flex: 1;
    }
    .qr-col {
      width: 70px;
      height: 70px;
      flex-shrink: 0;
    }
    .qr-img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .info-col {
      flex: 1;
      overflow: hidden;
    }
    .title {
      font-size: 13px;
      font-weight: 700;
      margin: 0 0 3px 0;
      color: #1C1917;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dates, .location {
      font-size: 9px;
      margin: 1px 0;
      color: #57534E;
    }
    .safety-box {
      font-size: 8.5px;
      font-weight: 600;
      background: #F5F5F4;
      border-left: 3px solid #0284C7;
      padding: 2px 5px;
      margin-top: 4px;
      color: #0369A1;
    }
    .label-footer {
      display: flex;
      justify-content: space-between;
      font-size: 7.5px;
      color: #A8A29E;
      border-top: 1px solid #E7E5E4;
      padding-top: 3px;
    }
  </style>
</head>
<body>
  <div class="grid">
    ${labelCardsHtml}
  </div>
</body>
</html>
  `;
}

/**
 * Directly prints the generated label sheet via iOS AirPrint / Android Print
 */
export async function printLabelSheet(labels: LabelItem[]): Promise<void> {
  const html = await generateA4LabelSheetHtml(labels);
  await Print.printAsync({ html });
}

/**
 * Exports label sheet to PDF file and opens system share dialog
 */
export async function shareLabelSheetPdf(labels: LabelItem[]): Promise<string> {
  const html = await generateA4LabelSheetHtml(labels);
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }
  return uri;
}
