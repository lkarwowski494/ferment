// ============================================================================
// Apps4Brew Studio — SEROWAR Extended Release Test Suite
// Verifies Phage Rotation, Propionic Chamber, Sensor Telemetry, and Rind Vision
// ============================================================================

import {
  identifyPhageGroup,
  evaluatePhageRisk,
  recommendCultureRotation,
  PHAGE_GROUPS,
  PhageRiskLevel,
} from '../../src/core/phage-rotation-engine';

import {
  calculatePropionicKinetics,
  analyzeEyeDistribution,
  PropionicCheeseStyle,
  PropionicStage,
} from '../../src/core/propionic-chamber-engine';

import {
  decodeRuuviRawV2,
  decodeBTHomeAdvertisement,
  parseHygrometerCsvLog,
  assessCaveMicroclimateStability,
} from '../../src/core/sensor-telemetry-engine';

import {
  analyzeRindChromatics,
  assessRindCoverage,
  analyzeCrossSectionEyes,
  RindFloraType,
} from '../../src/core/rind-vision-engine';

describe('SEROWAR Extended Release Domain Engines', () => {
  // ==========================================================================
  // 1. Phage Rotation & Defense Engine
  // ==========================================================================
  describe('phage-rotation-engine', () => {
    test('identifyPhageGroup identifies standard commercial culture codes correctly', () => {
      expect(identifyPhageGroup('CHN-19')).toBe('GROUP_I_CHN');
      expect(identifyPhageGroup('Flora Danica')).toBe('GROUP_I_CHN');
      expect(identifyPhageGroup('R-703')).toBe('GROUP_II_LL');
      expect(identifyPhageGroup('MA 11')).toBe('GROUP_II_LL');
      expect(identifyPhageGroup('KAZU 100')).toBe('GROUP_III_KAZU');
      expect(identifyPhageGroup('MA 4001')).toBe('GROUP_III_KAZU');
      expect(identifyPhageGroup('STI-12')).toBe('GROUP_V_THERMO');
      expect(identifyPhageGroup('Twarogowa Probat')).toBe('GROUP_IV_MESO_HOMO');
      expect(identifyPhageGroup('')).toBe('GROUP_I_CHN');
    });

    test('evaluatePhageRisk detects LOW, MODERATE, and CRITICAL accumulation levels', () => {
      // Empty history
      const emptyEval = evaluatePhageRisk([]);
      expect(emptyEval.riskLevel).toBe('LOW');
      expect(emptyEval.consecutiveUsesCount).toBe(0);

      // Single use
      const singleEval = evaluatePhageRisk(['CHN-19']);
      expect(singleEval.riskLevel).toBe('LOW');
      expect(singleEval.consecutiveUsesCount).toBe(1);

      // Consecutive uses of same group -> MODERATE
      const modEval = evaluatePhageRisk(['R-703', 'CHN-19', 'Flora Danica']);
      expect(modEval.riskLevel).toBe('MODERATE');
      expect(modEval.consecutiveUsesCount).toBe(2);

      // 4 consecutive uses -> CRITICAL
      const critEval = evaluatePhageRisk(['CHN-11', 'CHN-19', 'CHN-22', 'Flora Danica']);
      expect(critEval.riskLevel).toBe('CRITICAL');
      expect(critEval.isDeadVatImminent).toBe(true);
      expect(critEval.sanitationProtocol).toContain('kwasem nadoctowym');
    });

    test('recommendCultureRotation suggests safe alternative groups and checks pantry', () => {
      const adviceWithPantry = recommendCultureRotation('CHN-19', ['Flora Danica', 'KAZU 100', 'STI-12']);
      expect(adviceWithPantry.currentCulture).toBe('CHN-19');
      expect(adviceWithPantry.nextRecommendedCultures).toContain('KAZU 100');
      expect(adviceWithPantry.availableInPantry).toContain('KAZU 100');

      // When pantry empty, suggests catalog cultures
      const adviceNoPantry = recommendCultureRotation('CHN-19', []);
      expect(adviceNoPantry.nextRecommendedCultures.length).toBeGreaterThan(0);
      expect(adviceNoPantry.rationale).toContain('katalogu');
    });

    test('PHAGE_GROUPS and PhageRiskLevel types are valid', () => {
      expect(PHAGE_GROUPS).toBeDefined();
      expect(PHAGE_GROUPS.GROUP_I_CHN.representativeCultures).toContain('CHN-19');
      const lowRisk: PhageRiskLevel = 'LOW';
      const modRisk: PhageRiskLevel = 'MODERATE';
      const critRisk: PhageRiskLevel = 'CRITICAL';
      expect([lowRisk, modRisk, critRisk]).toHaveLength(3);
    });
  });

  // ==========================================================================
  // 2. Propionic Warm Room & Eye Kinetics Engine
  // ==========================================================================
  describe('propionic-chamber-engine', () => {
    test('calculatePropionicKinetics progresses through stages and calculates gas volume', () => {
      // Day 0 -> PRE_COOLING
      const preCool = calculatePropionicKinetics({
        cheeseStyle: 'MAASDAM',
        initialWeightKg: 10,
        currentDayInWarmRoom: 0,
        tempCelsius: 21,
        relativeHumidityPct: 82,
        measuredDomeExpansionMm: 0,
      });
      expect(preCool.currentStage).toBe('PRE_COOLING');
      expect(preCool.estimatedCo2LitersProduced).toBe(0);

      // Mid warm room (Day 15) -> WARM_ROOM_ACTIVE
      const midWarm = calculatePropionicKinetics({
        cheeseStyle: 'EMMENTALER',
        initialWeightKg: 30,
        currentDayInWarmRoom: 18,
        tempCelsius: 23,
        relativeHumidityPct: 84,
        measuredDomeExpansionMm: 10,
      });
      expect(midWarm.currentStage).toBe('WARM_ROOM_ACTIVE');
      expect(midWarm.estimatedCo2LitersProduced).toBeGreaterThan(20);
      expect(midWarm.estimatedAverageEyeDiameterMm).toBeGreaterThanOrEqual(15);
      expect(midWarm.swellingSafetyStatus).toBe('ACTIVE_SWELLING');

      // Over-expansion -> BLOWOUT_CRITICAL
      const criticalBlowout = calculatePropionicKinetics({
        cheeseStyle: 'MAASDAM',
        initialWeightKg: 12,
        currentDayInWarmRoom: 24,
        tempCelsius: 24,
        relativeHumidityPct: 80,
        measuredDomeExpansionMm: 22, // exceeds max 16mm
      });
      expect(criticalBlowout.swellingSafetyStatus).toBe('BLOWOUT_CRITICAL');
      expect(criticalBlowout.thermalActionRecommendation).toContain('NATYCHMIAST PRZENIEŚ SER DO CHŁODNI');
    });

    test('analyzeEyeDistribution assesses uniformity and classifies defects', () => {
      // Empty measurements
      const emptyRes = analyzeEyeDistribution([], 'MAASDAM');
      expect(emptyRes.conformanceStatus).toBe('UNDER_DEVELOPED');

      // Perfect Emmentaler eyes (20mm, 22mm, 21mm, 23mm)
      const perfectRes = analyzeEyeDistribution([20, 22, 21, 23, 20], 'EMMENTALER');
      expect(perfectRes.conformanceStatus).toBe('PERFECT');
      expect(perfectRes.uniformityIndexPct).toBeGreaterThan(80);

      // Irregular pinholes (5mm, 28mm, 4mm, 22mm)
      const irregularRes = analyzeEyeDistribution([5, 28, 4, 22, 3], 'EMMENTALER');
      expect(irregularRes.conformanceStatus).toBe('IRREGULAR_PINHOLES');
    });

    test('PropionicCheeseStyle and PropionicStage types are valid', () => {
      const styles: PropionicCheeseStyle[] = ['EMMENTALER', 'MAASDAM', 'JARLSBERG', 'APPENZELLER'];
      const stages: PropionicStage[] = ['PRE_COOLING', 'WARM_ROOM_ACTIVE', 'POST_COOLING_STABILIZATION'];
      expect(styles).toHaveLength(4);
      expect(stages).toHaveLength(3);
    });
  });

  // ==========================================================================
  // 3. Sensor Telemetry & Smart Hygrometer Engine
  // ==========================================================================
  describe('sensor-telemetry-engine', () => {
    test('decodeRuuviRawV2 parses format 5 payload correctly', () => {
      // Sample RuuviTag v2 payload: 05 12FC 5394 C37C 0004 FFCC 0418 A636 65
      // 0x12FC = 4860 * 0.005 = 24.30°C
      // 0x5394 = 21396 * 0.0025% = 53.49%
      // 0xC37C = 50044 + 50000 = 100044 Pa = 1000.4 hPa
      const sampleHex = '0512fc5394c37c0004ffcc0418a6366500010203040506';
      const reading = decodeRuuviRawV2(sampleHex);
      expect(reading).not.toBeNull();
      if (reading) {
        expect(reading.sensorType).toBe('RUUVITAG');
        expect(reading.temperatureCelsius).toBeCloseTo(24.3, 1);
        expect(reading.relativeHumidityPct).toBeCloseTo(53.5, 1);
        expect(reading.pressureHpa).toBeCloseTo(1000.4, 1);
        expect(reading.batteryMilliVolts).toBeGreaterThan(2500);
      }

      // Invalid hex returns null
      expect(decodeRuuviRawV2('xyz')).toBeNull();
      expect(decodeRuuviRawV2('04001122')).toBeNull();
    });

    test('decodeBTHomeAdvertisement extracts temperature and humidity TLV', () => {
      // BTHome v2: 02 (temp 2 bytes) + 0x05 0x09 (0x0905 = 2309 * 0.01 = 23.09°C) + 03 (rh 2 bytes) + 0x20 0x1f (0x1f20 = 7968 * 0.01 = 79.68%)
      const sampleBTHome = '02050903201f0160';
      const reading = decodeBTHomeAdvertisement(sampleBTHome);
      expect(reading).not.toBeNull();
      if (reading) {
        expect(reading.sensorType).toBe('XIAOMI_BTHOME');
        expect(reading.temperatureCelsius).toBeCloseTo(23.09, 1);
        expect(reading.relativeHumidityPct).toBeCloseTo(79.7, 1);
        expect(reading.batteryPct).toBe(96);
      }

      expect(decodeBTHomeAdvertisement('')).toBeNull();
    });

    test('parseHygrometerCsvLog parses tabular logs from USB dataloggers', () => {
      const csv = `Timestamp,Temperature,Humidity\n2026-10-18 01:00,12.4,85.2\n2026-10-18 02:00,12.5,84.9\n2026-10-18 03:00,12.3,85.5`;
      const logs = parseHygrometerCsvLog(csv);
      expect(logs.length).toBe(3);
      expect(logs[0].temperatureCelsius).toBe(12.4);
      expect(logs[0].relativeHumidityPct).toBe(85.2);
      expect(logs[0].sensorType).toBe('CSV_LOGGER');

      expect(parseHygrometerCsvLog('')).toEqual([]);
    });

    test('assessCaveMicroclimateStability evaluates microclimate quality and stability score', () => {
      const stableReadings = [
        { temperatureCelsius: 12.0, relativeHumidityPct: 85.0 },
        { temperatureCelsius: 12.2, relativeHumidityPct: 85.5 },
        { temperatureCelsius: 12.1, relativeHumidityPct: 84.8 },
      ];
      const stableMetrics = assessCaveMicroclimateStability(stableReadings);
      expect(stableMetrics.stabilityScorePct).toBeGreaterThan(80);
      expect(stableMetrics.evaluation).toBe('EXCELLENT_CELLAR');

      // Erratic swings
      const erraticReadings = [
        { temperatureCelsius: 10.0, relativeHumidityPct: 90.0 },
        { temperatureCelsius: 16.5, relativeHumidityPct: 62.0 },
      ];
      const erraticMetrics = assessCaveMicroclimateStability(erraticReadings);
      expect(erraticMetrics.maxTemperatureSwingCelsius).toBe(6.5);
      expect(erraticMetrics.evaluation).toBe('ERRATIC_THERMAL_SWING');
    });
  });

  // ==========================================================================
  // 4. Rind Vision & Colorimetric Affinage Engine
  // ==========================================================================
  describe('rind-vision-engine', () => {
    test('analyzeRindChromatics classifies white mold and Brevibacterium smear', () => {
      // White mold Camembert samples (near 245, 245, 240)
      const whiteSamples = [
        { r: 242, g: 244, b: 238 },
        { r: 246, g: 245, b: 242 },
      ];
      const whiteAnalysis = analyzeRindChromatics(whiteSamples);
      expect(whiteAnalysis.dominantFlora).toBe('WHITE_MOLD_CAMEMBERT');
      expect(whiteAnalysis.floraConfidencePct).toBeGreaterThan(85);
      expect(whiteAnalysis.isContaminationSuspected).toBe(false);

      // Dark contamination (Mucor / pin mold defect)
      const darkSamples = [
        { r: 40, g: 42, b: 38 },
        { r: 50, g: 48, b: 45 },
      ];
      const darkAnalysis = analyzeRindChromatics(darkSamples);
      expect(darkAnalysis.dominantFlora).toBe('MUCOR_PIN_DEFECT');
      expect(darkAnalysis.isContaminationSuspected).toBe(true);
      expect(darkAnalysis.recommendedAction).toContain('solanką');
    });

    test('assessRindCoverage evaluates day vs target coverage percent', () => {
      const optimal = assessRindCoverage({
        currentCoveragePct: 75,
        dayInCave: 8,
        targetFlora: 'WHITE_MOLD_CAMEMBERT',
      });
      expect(optimal.status).toBe('OPTIMAL_PROGRESS');

      const lagging = assessRindCoverage({
        currentCoveragePct: 20,
        dayInCave: 10,
        targetFlora: 'WHITE_MOLD_CAMEMBERT',
      });
      expect(lagging.status).toBe('LAGGING_COVERAGE');
      expect(lagging.actionDirective).toContain('Zwiększ wilgotność');
    });

    test('analyzeCrossSectionEyes calculates porosity and commercial class', () => {
      // Empty eyes -> Blind cheese (Cheddar)
      const blind = analyzeCrossSectionEyes([]);
      expect(blind.openingType).toBe('BLIND_SOLID');

      // Swiss eyes (20mm, 22mm, 18mm)
      const swiss = analyzeCrossSectionEyes([20, 22, 18, 25]);
      expect(swiss.openingType).toBe('PROPIONIC_ROUND_EYES');
      expect(swiss.commercialGrade).toBe('EXTRA_CLASS');
      expect(swiss.porosityPct).toBeGreaterThan(5);

      // Coliform sponge defect (dense 1.5mm pinholes)
      const pinholes = Array(35).fill(1.8);
      const coliform = analyzeCrossSectionEyes(pinholes);
      expect(coliform.openingType).toBe('COLIFORM_SPONGE');
      expect(coliform.commercialGrade).toBe('DOWNGRADED');
    });

    test('RindFloraType enum covers all surface species', () => {
      const floraList: RindFloraType[] = [
        'WHITE_MOLD_CAMEMBERT',
        'GEOTRICHUM_WRINKLED',
        'WASHED_RIND_SMEAR',
        'BLUE_VEIN',
        'NATURAL_BRUSHED',
        'MUCOR_PIN_DEFECT',
        'CLEAN_UNRINDED',
      ];
      expect(floraList).toHaveLength(7);
    });
  });
});
