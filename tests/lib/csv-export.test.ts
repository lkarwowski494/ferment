// ============================================================================
// Apps4Brew Studio — FERMENT CSV Export Tests
// ============================================================================

import {
  escapeCsvField,
  generateBatchesCsv,
  generateCaveWheelsCsv,
  generateSensoryLogsCsv,
  generatePantryCsv,
} from '../../src/lib/csv-export';
import { Batch, CaveCheeseWheel, SensoryEvaluation, PantryItem } from '../../src/data/db';

describe('FERMENT RFC 4180 CSV Production Log Export', () => {
  it('escapes fields according to RFC 4180 standard', () => {
    expect(escapeCsvField('Prosty tekst')).toBe('Prosty tekst');
    expect(escapeCsvField('Tekst, z przecinkiem')).toBe('"Tekst, z przecinkiem"');
    expect(escapeCsvField('Tekst z "cudzysłowem"')).toBe('"Tekst z ""cudzysłowem"""');
    expect(escapeCsvField('Wiersz 1\nWiersz 2')).toBe('"Wiersz 1\nWiersz 2"');
    expect(escapeCsvField(null)).toBe('');
    expect(escapeCsvField(undefined)).toBe('');
    expect(escapeCsvField(123.45)).toBe('123.45');
  });

  it('generates batches CSV with valid headers and data', () => {
    const batches: Batch[] = [
      {
        id: 'b1',
        batchNumber: 'GOU-01',
        category: 'CHEESE',
        styleName: 'Gouda Zagrodowa, 10L',
        createdAt: 1776340000000,
        status: 'AGING',
        notes: 'Wymaga obrotu co 2 dni',
      },
    ];

    const csv = generateBatchesCsv(batches);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe('ID,Numer Partii,Kategoria,Nazwa Stylu,Data Utworzenia,Status,Notatki');
    expect(lines[1]).toContain('b1,GOU-01,CHEESE,"Gouda Zagrodowa, 10L"');
    expect(lines[1]).toContain('AGING');
  });

  it('generates cave cheese wheels CSV', () => {
    const wheels: CaveCheeseWheel[] = [
      {
        id: 'w1',
        batchId: 'b1',
        wheelTag: 'W-01',
        locationInCave: 'Półka Świerkowa A1',
        initialWeightGrams: 2000,
        currentWeightGrams: 1850,
        rindType: 'NATURAL',
        targetAgingDays: 60,
        shrinkagePct: 7.5,
      },
    ];

    const csv = generateCaveWheelsCsv(wheels);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('Tag Krążka');
    expect(lines[1]).toContain('W-01,Półka Świerkowa A1,2000,1850,NATURAL,60,7.5');
  });

  it('generates sensory evaluation logs CSV', () => {
    const evals: SensoryEvaluation[] = [
      {
        id: 's1',
        batchId: 'b1',
        evaluatedAt: 1776340000000,
        acidity: 6,
        salinity: 5,
        firmness: 8,
        creaminess: 7,
        pungency: 2,
        nuttiness: 6,
        overallScore: 88,
        grade: 'GOOD',
        flawsIdentified: 'Brak istotnych wad',
        tastingNotes: 'Maślany, czysty aromat',
      },
    ];

    const csv = generateSensoryLogsCsv(evals);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('Wynik Punktowy (0-100)');
    expect(lines[1]).toContain('s1,b1');
    expect(lines[1]).toContain('88,GOOD,Brak istotnych wad,"Maślany, czysty aromat"');
  });

  it('generates pantry inventory CSV', () => {
    const items: PantryItem[] = [
      {
        id: 'p1',
        itemName: 'Sól Kamienna Kłodawska',
        category: 'SALT',
        quantityAvailable: 1500,
        unit: 'g',
        costPerUnitPln: 0.005,
      },
    ];

    const csv = generatePantryCsv(items);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('Nazwa Składnika');
    expect(lines[1]).toContain('Sól Kamienna Kłodawska,SALT,1500,g,,0.005');
  });
});
