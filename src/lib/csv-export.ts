// ============================================================================
// Apps4Brew Studio — FERMENT RFC 4180 CSV Production Log Export Engine
// Safe comma/quote escaping, multi-table exports & system share sheet integration
// ============================================================================

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Batch, CaveCheeseWheel, SensoryEvaluation, PantryItem } from '../data/db';

/**
 * Escapes CSV field according to RFC 4180
 */
export function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates CSV string for batches
 */
export function generateBatchesCsv(batches: Batch[]): string {
  const headers = ['ID', 'Numer Partii', 'Kategoria', 'Nazwa Stylu', 'Data Utworzenia', 'Status', 'Notatki'];
  const rows = batches.map((b) => [
    escapeCsvField(b.id),
    escapeCsvField(b.batchNumber),
    escapeCsvField(b.category),
    escapeCsvField(b.styleName),
    escapeCsvField(new Date(b.createdAt).toISOString()),
    escapeCsvField(b.status),
    escapeCsvField(b.notes || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates CSV string for cave cheese wheels
 */
export function generateCaveWheelsCsv(wheels: CaveCheeseWheel[]): string {
  const headers = [
    'ID',
    'ID Partii',
    'Tag Krążka',
    'Lokalizacja',
    'Waga Początkowa (g)',
    'Waga Obecna (g)',
    'Typ Skórki',
    'Dni Dojrzewania',
    'Ubytek (%)',
    'Ostatnio Obrócony',
    'Ostatnio Przemyty',
    'Ostatnio Oczyszczony',
  ];

  const rows = wheels.map((w) => [
    escapeCsvField(w.id),
    escapeCsvField(w.batchId),
    escapeCsvField(w.wheelTag),
    escapeCsvField(w.locationInCave),
    escapeCsvField(w.initialWeightGrams),
    escapeCsvField(w.currentWeightGrams),
    escapeCsvField(w.rindType),
    escapeCsvField(w.targetAgingDays),
    escapeCsvField(w.shrinkagePct.toFixed(1)),
    escapeCsvField(w.lastTurnedAt ? new Date(w.lastTurnedAt).toISOString() : ''),
    escapeCsvField(w.lastWashedAt ? new Date(w.lastWashedAt).toISOString() : ''),
    escapeCsvField(w.lastBrushedAt ? new Date(w.lastBrushedAt).toISOString() : ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates CSV string for sensory evaluations
 */
export function generateSensoryLogsCsv(evaluations: SensoryEvaluation[]): string {
  const headers = [
    'ID',
    'ID Partii',
    'Data Oceny',
    'Kwasowość (1-10)',
    'Słoność (1-10)',
    'Twardość (1-10)',
    'Kremowość (1-10)',
    'Ostrość (1-10)',
    'Orzechowość (1-10)',
    'Wynik Punktowy (0-100)',
    'Klasa Jakości',
    'Wykryte Wady',
    'Notatki Degustacyjne',
  ];

  const rows = evaluations.map((e) => [
    escapeCsvField(e.id),
    escapeCsvField(e.batchId),
    escapeCsvField(new Date(e.evaluatedAt).toISOString()),
    escapeCsvField(e.acidity),
    escapeCsvField(e.salinity),
    escapeCsvField(e.firmness),
    escapeCsvField(e.creaminess),
    escapeCsvField(e.pungency),
    escapeCsvField(e.nuttiness),
    escapeCsvField(e.overallScore || ''),
    escapeCsvField(e.grade || ''),
    escapeCsvField(e.flawsIdentified || ''),
    escapeCsvField(e.tastingNotes || e.notes || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates CSV string for pantry inventory
 */
export function generatePantryCsv(items: PantryItem[]): string {
  const headers = [
    'ID',
    'Nazwa Składnika',
    'Kategoria',
    'Ilość Dostępna',
    'Jednostka',
    'Moc / Stężenie',
    'Koszt PLN / Jedn.',
    'Data Ważności',
  ];

  const rows = items.map((i) => [
    escapeCsvField(i.id),
    escapeCsvField(i.itemName),
    escapeCsvField(i.category),
    escapeCsvField(i.quantityAvailable),
    escapeCsvField(i.unit),
    escapeCsvField(i.imcuOrConcentration || ''),
    escapeCsvField(i.costPerUnitPln || ''),
    escapeCsvField(i.expiryDate ? new Date(i.expiryDate).toISOString() : ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Saves CSV content to temporary document and shares via native share sheet
 */
export async function shareCsvExport(filename: string, csvContent: string): Promise<string> {
  const dir = (FileSystem as any).documentDirectory || '';
  const fileUri = `${dir}${filename.endsWith('.csv') ? filename : `${filename}.csv`}`;

  try {
    if ((FileSystem as any).writeAsStringAsync) {
      await (FileSystem as any).writeAsStringAsync(fileUri, csvContent, {
        encoding: (FileSystem as any).EncodingType?.UTF8 || 'utf8',
      });
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Eksportuj ${filename}`,
        UTI: 'public.comma-separated-values-text',
      });
    }
  } catch {
    // Fallback if native file system not present (e.g. web/test)
  }

  return fileUri;
}
