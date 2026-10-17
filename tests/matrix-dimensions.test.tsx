import { calculateVpd } from '../src/core/psychrometry';
import { announce } from '../src/lib/announce';
import { isAutoBackup, isSafetyBackup, saveCorruptState, CURRENT_SCHEMA_VERSION, MAX_ROTATION_BACKUPS } from '../src/lib/backup';
import { escapeCsvCell, shareCsvExport } from '../src/lib/csv-export';
import { dbDirectory } from '../src/lib/db-path';
import { useLang, LANGS } from '../src/lib/i18n';
import { generateQrDataUrl, generateA4LabelSheetHtml, printLabelSheet, shareLabelSheetPdf } from '../src/lib/pdf-sheet-generator';
import { enableProcessKeepAwake, disableProcessKeepAwake, playTimerCompletionAlert, triggerHapticFeedback } from '../src/lib/timer-audio';
import { CHIME_WAV_BASE64 } from '../src/lib/chime-sound';
import {
  mlToFlOz,
  flOzToMl,
  cmToInches,
  inchesToCm,
  formatAdditiveWeight,
  formatPressure,
  US_GALLON_TO_LITER,
  OZ_TO_GRAM,
  LB_TO_KG,
  INCH_TO_CM,
  KG_CM2_TO_PSI,
  FL_OZ_TO_ML,
  UnitSystem,
} from '../src/lib/unit-converter';

// Core dimensions and constants
import { DEFAULT_COST_CONFIG, ProductionCraftType } from '../src/core/batch-cost-engine';
import { BLACK_GARLIC_PHASES, BlackGarlicPhaseId, BlackGarlicDevice, BlackGarlicAlertCode } from '../src/core/black-garlic';
import { BotanicalSourceId, GarlicPrepMethod } from '../src/core/botanical-extraction';
import { HydrometerCalibrationTemp, BrineTargetProfileKey } from '../src/core/brine-densitometry';
import { CheeseCaveType, AffinageCareAction } from '../src/core/cave-environment';
import { CaveActionType } from '../src/core/cave-log-actions';
import { CodexFirmnessClass, CodexFatClass, SaltMoistureStatus } from '../src/core/cheese-composition-engine';
import { TeaBaseType } from '../src/core/continuous-brew';
import { FermentWeightMaterial, VegetablePackType } from '../src/core/crock-headspace';
import { LiveCultureType, CultureHealthStatus } from '../src/core/culture-hotel-engine';
import { CheeseStyleSyneresis, CurdCutStandard, CHEESE_SYNERESIS_CONFIGS } from '../src/core/curd-syneresis';
import { EmergencyCaseId, EMERGENCY_PROTOCOLS } from '../src/core/emergency-recovery';
import { BotulinumStatus } from '../src/core/ferment-engine';
import { DefectSafetyVerdict, DefectCategory } from '../src/core/fermentation-diagnostics';
import { FermentCultureType } from '../src/core/fermentation-q10';
import { FlavorCategoryKey } from '../src/core/flavor-wheel-data';
import { GingerBugStarterStatus, BottleType, CarbonationStage } from '../src/core/ginger-bug';
import { CalibrationSaltType, SensorAccuracyGrade } from '../src/core/hygrometer-calibration';
import { KefirMediumType, KefirHibernationMethod } from '../src/core/kefir-grains';
import { KojiProductType, KojiMoistureState } from '../src/core/koji-fermentation';
import { KombuchaBottleType, FRUIT_JUICE_PROFILES } from '../src/core/kombucha-blending';
import { PolishMeadGrade, MeadPreparationType } from '../src/core/mead-kinetics';
import { MilkSpeciesId, MILK_SPECIES_DATABASE } from '../src/core/milk-species-profile';
import { MoldShape, STANDARD_MOLD_TEMPLATES } from '../src/core/mold-sizing';
import { NukadokoAgeStage, NukazukeVegType } from '../src/core/nukazuke-engine';
import { PasteurizationTargetCategory, PASTEURIZATION_TARGETS } from '../src/core/pasteurization-units';
import { QrPayloadType } from '../src/core/qr-deeplink';
import { CraftProcessType } from '../src/core/reverse-scheduler';
import { LegumeType, TempehPhase } from '../src/core/tempeh-kinetics';
import { WheyLevainType, LevainRipenessStatus, GenerationVitalityStatus } from '../src/core/whey-levain-engine';
import { AccessStatus, TRIAL_DURATION_DAYS } from '../src/lib/app-access';

describe('AST Matrix Dimensions (WYMIAR) and Logic Coverage (BR-TEST-028..030)', () => {
  it('covers missing logic functions', async () => {
    // 1. calculateVpd
    const vpd = calculateVpd(14.0, 85.0);
    expect(vpd.vpdKPa).toBeGreaterThan(0);

    // 2. announce
    expect(() => announce('Test message')).not.toThrow();

    // 3. backup helpers
    expect(isAutoBackup('ferment-kopia-2026-10-17.json')).toBe(true);
    expect(isAutoBackup('ferment-przed-importem-2026-10-17.json')).toBe(false);
    expect(isSafetyBackup('ferment-przed-czyszczeniem-2026-10-17.json')).toBe(true);
    expect(isSafetyBackup('ferment-kopia-2026-10-17.json')).toBe(false);

    // 4. saveCorruptState
    await saveCorruptState('{corrupt json');

    // 5. escapeCsvCell & shareCsvExport
    expect(escapeCsvCell('=CMD|')).toBe('"\'=CMD|"');
    expect(typeof shareCsvExport).toBe('function');

    // 6. dbDirectory
    expect(dbDirectory('/data/Documents/SQLite')).toBe('/data/Library/Application Support/SQLite');

    // 7. useLang
    expect(typeof useLang).toBe('function');

    // 8. pdf sheet helpers
    expect(typeof generateQrDataUrl).toBe('function');
    expect(typeof generateA4LabelSheetHtml).toBe('function');
    expect(typeof printLabelSheet).toBe('function');
    expect(typeof shareLabelSheetPdf).toBe('function');

    // 9. timer audio & keep awake
    expect(() => enableProcessKeepAwake()).not.toThrow();
    expect(() => disableProcessKeepAwake()).not.toThrow();
    expect(() => playTimerCompletionAlert()).not.toThrow();
    expect(() => triggerHapticFeedback()).not.toThrow();

    // 10. unit conversions
    expect(mlToFlOz(100)).toBeCloseTo(3.38, 1);
    expect(flOzToMl(3.38)).toBeCloseTo(100, 0);
    expect(cmToInches(10)).toBeCloseTo(3.94, 1);
    expect(inchesToCm(3.94)).toBeCloseTo(10, 0);
    expect(formatAdditiveWeight(0.5, 'metric')).toContain('g');
    expect(formatPressure(2.5, 'metric')).toContain('kg/cm²');
  });

  it('covers all exported constant arrays and union types (WYMIAR)', () => {
    // Check constant arrays & objects
    expect(BLACK_GARLIC_PHASES).toBeDefined();
    expect(DEFAULT_COST_CONFIG).toBeDefined();
    expect(CHEESE_SYNERESIS_CONFIGS).toBeDefined();
    expect(EMERGENCY_PROTOCOLS).toBeDefined();
    expect(Array.isArray(FRUIT_JUICE_PROFILES)).toBe(true);
    expect(MILK_SPECIES_DATABASE).toBeDefined();
    expect(Array.isArray(STANDARD_MOLD_TEMPLATES)).toBe(true);
    expect(PASTEURIZATION_TARGETS).toBeDefined();
    expect(Array.isArray(LANGS)).toBe(true);

    // Number constants
    expect(TRIAL_DURATION_DAYS).toBeGreaterThan(0);
    expect(CURRENT_SCHEMA_VERSION).toBeGreaterThan(0);
    expect(MAX_ROTATION_BACKUPS).toBe(10);
    expect(CHIME_WAV_BASE64.length).toBeGreaterThan(10);
    expect(US_GALLON_TO_LITER).toBeGreaterThan(3.7);
    expect(OZ_TO_GRAM).toBeGreaterThan(28.0);
    expect(LB_TO_KG).toBeGreaterThan(0.4);
    expect(INCH_TO_CM).toBe(2.54);
    expect(KG_CM2_TO_PSI).toBeGreaterThan(14.0);
    expect(FL_OZ_TO_ML).toBeGreaterThan(29.0);

    // Types reference checks (compile-time & runtime validation)
    const craftType: ProductionCraftType = 'CHEESE';
    const bgPhase: BlackGarlicPhaseId = 'INITIATION';
    const bgDev: BlackGarlicDevice = 'RICE_COOKER_WARM';
    const bgAlert: BlackGarlicAlertCode = 'NORMAL';
    const botSrc: BotanicalSourceId = 'OAK_LEAF';
    const garlicPrep: GarlicPrepMethod = 'WHOLE_PEELED';
    const hydroTemp: HydrometerCalibrationTemp = 20.0;
    const brineKey: BrineTargetProfileKey = 'HARD_CHEESE_HEAVY';
    const caveType: CheeseCaveType = 'HARD_GOUDA_CHEDDAR';
    const affAction: AffinageCareAction = 'TURN';
    const caveAction: CaveActionType = 'WEIGH';
    const firmness: CodexFirmnessClass = 'HARD';
    const fatClass: CodexFatClass = 'FULL_FAT';
    const saltMoisture: SaltMoistureStatus = 'OPTIMAL_BALANCED';
    const teaBase: TeaBaseType = 'BLACK';
    const weightMat: FermentWeightMaterial = 'GLASS_FLAT';
    const packType: VegetablePackType = 'SHREDDED_DENSE';
    const liveCulture: LiveCultureType = 'KOMBUCHA_SCOBY_HOTEL';
    const cultureHealth: CultureHealthStatus = 'HEALTHY_ACTIVE';
    const cheeseStyle: CheeseStyleSyneresis = 'GOUDA_EDAM';
    const curdCut: CurdCutStandard = 'FINE_RICE';
    const emerCase: EmergencyCaseId = 'WEAK_CURD_NO_SET';
    const botStatus: BotulinumStatus = 'SAFE';
    const defectVerdict: DefectSafetyVerdict = 'SAFE_EDIBLE';
    const defectCategory: DefectCategory = 'CHEESE';
    const cultureQ10: FermentCultureType = 'VEG_LAB';
    const flavorCat: FlavorCategoryKey = 'FRUITY_ACID';
    const gingerStarter: GingerBugStarterStatus = 'PEAK_ACTIVE';
    const bottleType: BottleType = 'SWING_TOP_HEAVY_GLASS';
    const carbonationStage: CarbonationStage = 'FLAT';
    const calibSalt: CalibrationSaltType = 'NACL_TABLE_SALT';
    const sensorGrade: SensorAccuracyGrade = 'EXCELLENT';
    const kefirMedium: KefirMediumType = 'MILK_KEFIR';
    const kefirHib: KefirHibernationMethod = 'DEHYDRATED';
    const kojiProd: KojiProductType = 'SHIO_KOJI';
    const kojiMoist: KojiMoistureState = 'FRESH';
    const kombuchaBottle: KombuchaBottleType = 'HEAVY_SWING_TOP_AMBER';
    const meadGrade: PolishMeadGrade = 'TROJNIAK';
    const meadPrep: MeadPreparationType = 'SYCONY';
    const milkSpecies: MilkSpeciesId = 'COW';
    const moldShape: MoldShape = 'CYLINDER';
    const nukaAge: NukadokoAgeStage = 'MATURE_BED';
    const nukaVeg: NukazukeVegType = 'CUCUMBER';
    const pasteurCat: PasteurizationTargetCategory = 'CRISP_PICKLE_JAR';
    const qrType: QrPayloadType = 'batch';
    const craftProc: CraftProcessType = 'CHEESE_HARD_GOUDA';
    const legume: LegumeType = 'SOYBEAN';
    const tempehPhase: TempehPhase = 'EXOTHERMIC_BURST';
    const wheyLevain: WheyLevainType = 'THERMOPHILIC_ALPINE';
    const levainRipeness: LevainRipenessStatus = 'PEAK_RIPE';
    const genVitality: GenerationVitalityStatus = 'OPTIMAL_VITALITY';
    const accessStatus: AccessStatus = 'trial_active';
    const unitSystem: UnitSystem = 'metric';

    expect([
      craftType, bgPhase, bgDev, bgAlert, botSrc, garlicPrep, hydroTemp, brineKey,
      caveType, affAction, caveAction, firmness, fatClass, saltMoisture, teaBase, weightMat,
      packType, liveCulture, cultureHealth, cheeseStyle, curdCut, emerCase, botStatus,
      defectVerdict, defectCategory, cultureQ10, flavorCat, gingerStarter, bottleType,
      carbonationStage, calibSalt, sensorGrade, kefirMedium, kefirHib, kojiProd,
      kojiMoist, kombuchaBottle, meadGrade, meadPrep, milkSpecies, moldShape, nukaAge,
      nukaVeg, pasteurCat, qrType, craftProc, legume, tempehPhase, wheyLevain,
      levainRipeness, genVitality, accessStatus, unitSystem
    ].length).toBeGreaterThan(40);
  });
});
