// ============================================================================
// Apps4Brew Studio — Tests for PDF Sticker & Label Sheet Generator (QA-02)
// ============================================================================

import {
  generateQrDataUrl,
  generateA4LabelSheetHtml,
  printLabelSheet,
  shareLabelSheetPdf,
  LabelItem,
} from '../../src/lib/pdf-sheet-generator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

describe('PDF Sheet Generator (QA-02, BR-REL-010)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleLabels: LabelItem[] = [
    {
      id: 'batch-001',
      batchNumber: 'GOU-2026-01',
      name: 'Gouda Zagrodowa Dojrzewająca',
      category: 'cheese',
      dateCreated: '2026-10-18T10:00:00.000Z',
      targetDate: '2027-01-18T10:00:00.000Z',
      safetyDetails: 'pH: 5.2 | Solanka: 18% | T_dp: 9.6°C',
      caveLocation: 'Półka C-02 (Dojrzewalnia)',
    },
    {
      id: 'batch-002',
      batchNumber: 'KIM-2026-04',
      name: 'Kimchi Tradycyjne z Rzodkwią',
      category: 'vegetable',
      dateCreated: '2026-10-15T12:00:00.000Z',
    },
    {
      id: 'batch-003',
      batchNumber: 'KOM-2026-08',
      name: 'Kombucha Sencha & Jaśmin',
      category: 'beverage',
      dateCreated: '2026-10-10T14:00:00.000Z',
      safetyDetails: 'pH < 3.8 [BEZPIECZNE]',
    },
  ];

  it('generates a valid QR code data URL', async () => {
    const dataUrl = await generateQrDataUrl('FERMENT-TEST-PAYLOAD');
    expect(typeof dataUrl).toBe('string');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('generates valid A4 sticker sheet HTML with all label cards and styling', async () => {
    const html = await generateA4LabelSheetHtml(sampleLabels);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>FERMENT — Arkusz Etykiet A4</title>');
    expect(html).toContain('Gouda Zagrodowa Dojrzewająca');
    expect(html).toContain('GOU-2026-01');
    expect(html).toContain('badge cheese');
    expect(html).toContain('Półka C-02');
    expect(html).toContain('Solanka: 18%');
    expect(html).toContain('Kimchi Tradycyjne z Rzodkwią');
    expect(html).toContain('Kombucha Sencha & Jaśmin');
    expect(html).toContain('Apps4Brew Studio');
    expect(html).toContain('data:image/png;base64,');
  });

  it('handles optional fields gracefully when omitted', async () => {
    const minimalLabels: LabelItem[] = [
      {
        id: 'min-1',
        batchNumber: 'MIN-01',
        name: 'Ser Młody',
        category: 'cheese',
        dateCreated: '2026-10-18T08:00:00.000Z',
      },
    ];

    const html = await generateA4LabelSheetHtml(minimalLabels);
    expect(html).toContain('MIN-01');
    expect(html).toContain('Ser Młody');
    expect(html).not.toContain('Miejsce:');
    expect(html).not.toContain('<div class="safety-box">');
    expect(html).not.toContain('Dojrzałość:');
  });

  it('invokes Print.printAsync with the generated HTML', async () => {
    await printLabelSheet(sampleLabels);

    expect(Print.printAsync).toHaveBeenCalledTimes(1);
    const callArgs = (Print.printAsync as jest.Mock).mock.calls[0][0];
    expect(callArgs.html).toContain('Gouda Zagrodowa Dojrzewająca');
  });

  it('exports label sheet to PDF and shares it via expo-sharing', async () => {
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);

    const uri = await shareLabelSheetPdf(sampleLabels);

    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.isAvailableAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///mock/print.pdf', {
      UTI: '.pdf',
      mimeType: 'application/pdf',
    });
    expect(uri).toBe('file:///mock/print.pdf');
  });

  it('does not call Sharing.shareAsync if sharing is unavailable', async () => {
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

    const uri = await shareLabelSheetPdf(sampleLabels);

    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.isAvailableAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).not.toHaveBeenCalled();
    expect(uri).toBe('file:///mock/print.pdf');
  });
});
