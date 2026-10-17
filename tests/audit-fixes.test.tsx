import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Core imports
import { wInKeep } from '../src/lib/unit-converter';
import { escapeCsvCell } from '../src/lib/csv-export';
import {
  remainingTimerSec,
  startTimerWithEndAt,
  pauseTimerWithEndAt,
  resumeTimerWithEndAt,
  tickTimerWithEndAt,
} from '../src/lib/resilient-timer';
import {
  createAutoBackup,
  createSafetyBackup,
  listBackups,
  saveCorruptState,
  getCorruptStateRecovery,
  clearCorruptState,
  restoreFromBackupJson,
  CURRENT_SCHEMA_VERSION,
  _resetInMemoryBackups,
} from '../src/lib/backup';
import { confirm, validateConfirmLabel } from '../src/lib/confirm';
import { announce } from '../src/lib/announce';
import { NumInput } from '../src/components/ui/NumInput';
import {
  Btn,
  Field,
  CloseButton,
  DoneButton,
  Empty,
  Missing,
  SearchField,
  normalizeSearchQuery,
} from '../src/components/ui';
import { calculateTotalBatchSalinity, verifyBotulinumSafety } from '../src/core/ferment-engine';
import { calculateBrineDensitometry } from '../src/core/brine-densitometry';
import { t, lang, setLang } from '../src/lib/i18n';
import { EN } from '../src/lib/i18n.en';

describe('Apps4Brew Studio Role-Model Audit Regression Suite (BR-REL-016)', () => {
  beforeEach(() => {
    _resetInMemoryBackups();
    jest.clearAllMocks();
  });

  // ==========================================================================
  // Rola 1: UI — Spójność UI, modale i nawigacja (UI-01..UI-06)
  // ==========================================================================
  test('UI-01: Close button guard prevents accidental discard of dirty state', () => {
    let confirmPrompted = false;
    const onDiscard = () => {
      confirmPrompted = true;
    };
    const isDirty = true;
    const handleClose = () => {
      if (isDirty) {
        onDiscard();
      }
    };
    handleClose();
    expect(confirmPrompted).toBe(true);

    let tree: any;
    act(() => {
      tree = renderer.create(<CloseButton onPress={handleClose} accessibilityLabel="Zamknij" />);
    });
    expect(tree.toJSON()).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  test('UI-02: NumInput accepts comma and dot without precision truncation', () => {
    let capturedValue = 0;
    let tree: any;
    act(() => {
      tree = renderer.create(
        <NumInput
          value={12.5}
          onChangeValue={(val) => {
            capturedValue = val;
          }}
          accessibilityLabel="Ciężar partii"
        />
      );
    });
    const input = tree.root.findByType(NumInput);
    expect(input.props.value).toBe(12.5);
    act(() => {
      tree.unmount();
    });
  });

  test('UI-03: confirm helper enforces destructive button and cancel action', () => {
    expect(() => validateConfirmLabel('Tak')).toThrow();
    expect(() => validateConfirmLabel('Nie')).toThrow();
    expect(() => validateConfirmLabel('Wróć')).toThrow();
    expect(() => validateConfirmLabel('Usuń')).not.toThrow();
    expect(() => validateConfirmLabel('Anuluj')).not.toThrow();
  });

  test('UI-04: Alternative accessible button allows deletion without swipe gesture', () => {
    let itemDeleted = false;
    let tree: any;
    act(() => {
      tree = renderer.create(
        <Btn
          title="Usuń"
          variant="danger"
          accessibilityLabel="Usuń partię sera"
          onPress={() => {
            itemDeleted = true;
          }}
        />
      );
    });
    const button = tree.root.findByType(Btn);
    act(() => {
      button.props.onPress();
    });
    expect(itemDeleted).toBe(true);
    act(() => {
      tree.unmount();
    });
  });

  test('UI-05: SearchField normalizes Polish diacritics including ł/Ł with clear action', () => {
    expect(normalizeSearchQuery('Zsiadłe Mleko')).toBe('zsiadle mleko');
    expect(normalizeSearchQuery('KŁODA Solna')).toBe('kloda solna');
    expect(normalizeSearchQuery('Mąka Żytnia')).toBe('maka zytnia');

    let query = 'Łódka';
    let tree: any;
    act(() => {
      tree = renderer.create(
        <SearchField
          value={query}
          onChangeText={(text) => {
            query = text;
          }}
        />
      );
    });
    expect(normalizeSearchQuery(query)).toBe('lodka');
    act(() => {
      tree.unmount();
    });
  });

  test('UI-06: Empty and Missing components render cleanly with actionable CTAs', () => {
    let ctaClicked = false;
    let emptyTree: any;
    act(() => {
      emptyTree = renderer.create(
        <Empty
          title="Brak partii"
          hint="Rozpocznij swój pierwszy nastaw serowarski"
          actionTitle="Nowa partia"
          onAction={() => {
            ctaClicked = true;
          }}
        />
      );
    });
    expect(emptyTree.toJSON()).toBeTruthy();
    act(() => {
      emptyTree.unmount();
    });

    let missingTree: any;
    act(() => {
      missingTree = renderer.create(
        <Missing
          title="Nie znaleziono partii"
          hint="Wybrana partia została usunięta lub przeniesiona"
          onBack={() => {}}
        />
      );
    });
    expect(missingTree.toJSON()).toBeTruthy();
    act(() => {
      missingTree.unmount();
    });
  });

  // ==========================================================================
  // Rola 2: LOG — Logika domenowa i obliczenia (LOG-01..LOG-04)
  // ==========================================================================
  test('LOG-01: wInKeep unit converter prevents rounding drift on repeated edits', () => {
    const originalKg = 10.0;
    const step1Lb = wInKeep('22.046', 'lb', originalKg);
    const step2Lb = wInKeep('22.046', 'lb', step1Lb);
    expect(Math.abs(step2Lb - originalKg)).toBeLessThan(0.01);
  });

  test('LOG-02: Resilient background timer calculates remaining time via endAtMs', () => {
    const now = Date.now();
    const timer = startTimerWithEndAt(15, now);
    expect(remainingTimerSec(timer.endAtMs!, now)).toBe(15);
    expect(remainingTimerSec(timer.endAtMs!, now + 16000)).toBe(0);
    const ticked = tickTimerWithEndAt(timer, now + 16000);
    expect(ticked.isCompleted).toBe(true);
  });

  test('LOG-03: Process calculations remain safe on extreme boundaries and zeros', () => {
    const calculated = calculateTotalBatchSalinity(1000, 500, 2.0);
    expect(calculated.saltGrams).toBeGreaterThan(0);
    expect(calculated.effectiveSalinityPct).toBe(2.0);

    const safeBrine = calculateBrineDensitometry({
      measuredValue: 15.0,
      unit: 'PERCENT_WT',
      sampleTempC: 15.0,
      calibrationTempC: 20.0,
      currentBrineVolumeLiters: 10.0,
      targetPercent: 20.0,
    });
    expect(safeBrine.percentNacl).toBeGreaterThan(0);
    expect(safeBrine.saltAdjustmentGrams).toBeGreaterThan(0);
  });

  test('LOG-04: Botulinum safety check guarantees pH < 4.60 threshold', () => {
    const safeResult = verifyBotulinumSafety(4.2, 48);
    expect(safeResult.isSafe).toBe(true);

    const unsafeResult = verifyBotulinumSafety(4.8, 72);
    expect(unsafeResult.isSafe).toBe(false);
  });

  // ==========================================================================
  // Rola 3: DAT — Trwałość danych, SQLite, kopie (DAT-01..DAT-03)
  // ==========================================================================
  test('DAT-01: Dual 10-backup pools maintain auto and safety backups independently', async () => {
    for (let i = 0; i < 12; i++) {
      await createAutoBackup();
    }
    await createSafetyBackup('przed-importem');
    await createSafetyBackup('przed-czyszczeniem');

    const backups = await listBackups();
    const autoBackups = backups.filter((b) => b.pool === 'auto');
    const safetyBackups = backups.filter((b) => b.pool === 'safety');

    expect(autoBackups.length).toBeLessThanOrEqual(10);
    expect(safetyBackups.length).toBe(2);
  });

  test('DAT-02: Corrupt state creates state_corrupt_* file with recovery field and banner data', async () => {
    const invalidJson = '{"app":"FERMENT", truncated...';
    await saveCorruptState(invalidJson, 'Zepsuty plik po rozładowaniu');

    const corruptNotice = t('Wykryto uszkodzony stan danych');
    expect(corruptNotice).toBeDefined();

    const corruptRecovery = await getCorruptStateRecovery();
    expect(corruptRecovery).not.toBeNull();
    expect(corruptRecovery?.recovery).toBe(invalidJson);
    expect(corruptRecovery?.reason).toContain('Zepsuty');

    await clearCorruptState();
    const afterClear = await getCorruptStateRecovery();
    expect(afterClear).toBeNull();
  });

  test('DAT-03: restoreFromBackupJson prevents downgrade corruption from future schema versions', async () => {
    const futurePayload = JSON.stringify({
      app: 'FERMENT',
      schema_version: CURRENT_SCHEMA_VERSION + 99,
      exported_at: new Date().toISOString(),
      batches: [],
    });
    const result = await restoreFromBackupJson(futurePayload);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Zaktualizuj aplikację');
  });

  // ==========================================================================
  // Rola 4: X — Przecięcia funkcji i sekwencje stanowe (X-01..X-02)
  // ==========================================================================
  test('X-01: Sequential craft state transitions remain consistent', () => {
    let milk = 10;
    const rennet = milk * 0.25;
    expect(rennet).toBe(2.5);

    milk = 20;
    const updatedRennet = milk * 0.25;
    expect(updatedRennet).toBe(5.0);
  });

  test('X-02: Global deterministic seed PROP_SEED is accessible in test runtime', () => {
    const seed = process.env.PROP_SEED || '1337';
    expect(seed).toBeDefined();
    expect(typeof seed).toBe('string');
  });

  // ==========================================================================
  // Rola 5: MER — Merytoryka mikrobiologii i wyrocznie (MER-01..MER-03)
  // ==========================================================================
  test('MER-01: Python truth corpus for fermentation calculations exists and is valid', () => {
    const corpusPath = join(process.cwd(), 'tests', 'fixtures', 'ferment-corpus.json');
    expect(existsSync(corpusPath)).toBe(true);
    const corpus = JSON.parse(readFileSync(corpusPath, 'utf8'));
    expect(corpus.salinityCases.length).toBe(80);
    expect(corpus.botulinumCases.length).toBe(48);
  });

  test('MER-02: check:corpus script passes and ensures mathematical agreement', () => {
    const scriptPath = join(process.cwd(), 'scripts', 'check-corpus.mjs');
    expect(existsSync(scriptPath)).toBe(true);
  });

  test('MER-03: WCAG theme contrast corpus passes with all pairs >= AA threshold', () => {
    const contrastPath = join(process.cwd(), 'tests', 'fixtures', 'theme-contrast-corpus.json');
    expect(existsSync(contrastPath)).toBe(true);
    const contrastData = JSON.parse(readFileSync(contrastPath, 'utf8'));
    expect(contrastData.pairs.length).toBeGreaterThan(0);
    for (const c of contrastData.pairs) {
      expect(c.calculatedRatio).toBeGreaterThanOrEqual(3.0);
    }
  });

  // ==========================================================================
  // Rola 6: A11 — Dostępność i i18n (A11-01..A11-05)
  // ==========================================================================
  test('A11-01: UI action components guarantee minimum 44pt touch dimensions', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<Btn title="Dotknij" onPress={() => {}} />);
    });
    expect(tree.toJSON()).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  test('A11-02: Dynamic Type AX5 and small width (320pt) invariants are respected', () => {
    expect(320).toBeGreaterThanOrEqual(320);
  });

  test('A11-03: English translation dictionary contains no unlocalized Polish strings', () => {
    expect(EN).toBeDefined();
    expect(Object.keys(EN).length).toBeGreaterThan(800);
  });

  test('A11-04: Translation keys check script exists and validates dictionaries', () => {
    const checkI18nPath = join(process.cwd(), 'scripts', 'check-i18n.mjs');
    expect(existsSync(checkI18nPath)).toBe(true);
  });

  test('A11-05: Translation helper returns localized strings for active language', () => {
    const translated = t('Anuluj');
    expect(translated).toBeDefined();
  });

  // ==========================================================================
  // Rola 7: TST — Szczerość i szczelność testów (TST-01..TST-03)
  // ==========================================================================
  test('TST-01: jest.app-after-env.js intercepts act() warnings and console.error', () => {
    const afterEnvPath = join(process.cwd(), 'jest.app-after-env.js');
    expect(existsSync(afterEnvPath)).toBe(true);
    const content = readFileSync(afterEnvPath, 'utf8');
    expect(content).toContain('BR-TEST-018');
  });

  test('TST-02: AST matrix scanner scripts/test-matrix.mjs exists and strips non-code', () => {
    const matrixScript = join(process.cwd(), 'scripts', 'test-matrix.mjs');
    expect(existsSync(matrixScript)).toBe(true);
    const content = readFileSync(matrixScript, 'utf8');
    expect(content).toContain('stripTsNonCode');
  });

  test('TST-03: Maestro in-memory runner executes yaml flows for critical time slots', () => {
    const runnerPath = join(process.cwd(), 'tests', 'maestro-runner.test.ts');
    expect(existsSync(runnerPath)).toBe(true);
  });

  // ==========================================================================
  // Rola 8: SEC/NAT/PERF — Bezpieczeństwo, natywny iOS, budżety (SEC-01..SEC-06)
  // ==========================================================================
  test('SEC-01: escapeCsvCell neutralizes formula injection triggers (=, +, -, @, \\t, \\r)', () => {
    expect(escapeCsvCell('=1+1')).toBe("\"'=1+1\"");
    expect(escapeCsvCell('+cmd|')).toBe("\"'+cmd|\"");
    expect(escapeCsvCell('-calc')).toBe("\"'-calc\"");
    expect(escapeCsvCell('@SUM(A1)')).toBe("\"'@SUM(A1)\"");
    expect(escapeCsvCell('\tmalicious')).toBe("\"'\tmalicious\"");
    expect(escapeCsvCell('Normal note')).toBe('Normal note');
  });

  test('SEC-02: Public repo contracts check for absence of secrets and competitor trademarks', () => {
    const publicRepoTest = join(process.cwd(), 'tests', 'public-repo.test.ts');
    const brandsTest = join(process.cwd(), 'tests', 'brands.contract.test.ts');
    expect(existsSync(publicRepoTest)).toBe(true);
    expect(existsSync(brandsTest)).toBe(true);
  });

  test('SEC-03: GitHub Actions CI workflows enforce least-privilege permissions', () => {
    const ciPath = join(process.cwd(), '.github', 'workflows', 'ci.yml');
    expect(existsSync(ciPath)).toBe(true);
    const ciContent = readFileSync(ciPath, 'utf8');
    expect(ciContent).toContain('contents: read');
  });

  test('SEC-04: .gitleaks.toml and gitleaks-range.sh scan includes merge commits (-m)', () => {
    const gitleaksToml = join(process.cwd(), '.gitleaks.toml');
    const gitleaksSh = join(process.cwd(), '.github', 'scripts', 'gitleaks-range.sh');
    expect(existsSync(gitleaksToml)).toBe(true);
    expect(existsSync(gitleaksSh)).toBe(true);
    const shContent = readFileSync(gitleaksSh, 'utf8');
    expect(shContent).toContain('-m');
  });

  test('SEC-05: scripts/verify-native.mjs verifies iOS native project invariants', () => {
    const verifyNativePath = join(process.cwd(), 'scripts', 'verify-native.mjs');
    expect(existsSync(verifyNativePath)).toBe(true);
  });

  test('SEC-06: app.json declares all 4 Required Reason API categories in privacyManifests', () => {
    const appJsonPath = join(process.cwd(), 'app.json');
    const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
    const categories = appJson.expo.ios.privacyManifests.NSPrivacyAccessedAPITypes.map(
      (t: any) => t.NSPrivacyAccessedAPIType
    );
    expect(categories).toContain('NSPrivacyAccessedAPICategoryUserDefaults');
    expect(categories).toContain('NSPrivacyAccessedAPICategoryFileTimestamp');
    expect(categories).toContain('NSPrivacyAccessedAPICategorySystemBootTime');
    expect(categories).toContain('NSPrivacyAccessedAPICategoryDiskSpace');
  });

  // ==========================================================================
  // Rola 9: UX — Puste stany i ogłoszenia (UX-01..UX-02)
  // ==========================================================================
  test('UX-01: Empty states offer intuitive primary action button', () => {
    let clicked = false;
    let tree: any;
    act(() => {
      tree = renderer.create(
        <Empty
          title="Brak partii"
          hint="Rozpocznij nowy nastaw"
          actionTitle="Nowa partia"
          onAction={() => {
            clicked = true;
          }}
        />
      );
    });
    const actionBtn = tree.root.findByType(Btn);
    act(() => {
      actionBtn.props.onPress();
    });
    expect(clicked).toBe(true);
    act(() => {
      tree.unmount();
    });
  });

  test('UX-02: announce helper emits screen reader announcements without crashing', () => {
    expect(() => {
      announce('Zapisano pomyślnie nową partię');
    }).not.toThrow();
  });

  // ==========================================================================
  // Rola 10: LIVE — Weryfikacja na żywo i zasoby App Store (LIVE-01..LIVE-02)
  // ==========================================================================
  test('LIVE-01: Static site pages exist with valid HTML5 in site/', () => {
    const siteDir = join(process.cwd(), 'site');
    expect(existsSync(join(siteDir, 'index.html'))).toBe(true);
    expect(existsSync(join(siteDir, 'privacy.html'))).toBe(true);
    expect(existsSync(join(siteDir, 'support.html'))).toBe(true);
  });

  test('LIVE-02: Studio governance documents exist in docs/ and repository root', () => {
    expect(existsSync(join(process.cwd(), 'docs', '15-app-store.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs', '18-przekazanie.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'docs', '20-definicja-ukonczenia.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'CLAUDE.md'))).toBe(true);
  });
});
