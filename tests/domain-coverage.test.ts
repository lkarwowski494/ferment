// ============================================================================
// Apps4Brew / FERMENT — Domain Coverage 100% (BR-TEST-001..002, DEC-06)
// Systematic tests for all edge branches, exception handlers and domain logic
// ============================================================================

import {
  calculateDewPoint,
  calculateVpd,
  analyzeCaveMicroclimate,
} from '../src/core/psychrometry';

import {
  calculateCurdSyneresis,
} from '../src/core/curd-syneresis';

import {
  calculateCheeseComposition,
  estimateCurdMoistureAndYield,
} from '../src/core/cheese-composition-engine';

import {
  processPantryDepletion,
  calculateBatchYieldAndEconomics,
  RecipeRequirement,
} from '../src/core/inventory';

import {
  calculateCurdAndMoldFitting,
  calculateRectangularMoldVolume,
} from '../src/core/mold-sizing';

import {
  calculateNukadokoMaintenance,
  getPicklingTimeForVeg,
} from '../src/core/nukazuke-engine';

import {
  calculateRicottaRecovery,
  calculateWheyIsotonicDrink,
  calculateScobyZeroWaste,
} from '../src/core/whey-utilization';

import {
  evaluateSensoryProfile,
} from '../src/core/sensory-evaluation';

import {
  parseDeepLinkOrQr,
} from '../src/core/qr-deeplink';

import {
  analyzeRefractometerBrix,
  brixToSg,
} from '../src/core/refractometer-alcohol';

import {
  getEmergencyRescueProtocol,
  searchEmergencyProtocols,
} from '../src/core/emergency-recovery';

import {
  calculateTotalBatchSalinity,
  verifyBotulinumSafety,
  calculateKombucha2FPressure,
  calculateVinegarConversion,
} from '../src/core/ferment-engine';

import {
  calculateCacl2Dose,
  calculateFlocculationCutTime,
} from '../src/core/cheese-engine';

import {
  calculateVinegarStandardization,
  calculateVesselAeration,
} from '../src/core/vinegar-standardization';

import {
  calculateBlackGarlic,
} from '../src/core/black-garlic';

import {
  calculateVegCrispnessProtection,
} from '../src/core/botanical-extraction';

import {
  calculateBrineDensitometry,
} from '../src/core/brine-densitometry';

import {
  analyzeCaveEnvironment,
} from '../src/core/cave-environment';

import {
  calculateBatchCost,
} from '../src/core/batch-cost-engine';

import {
  calculateBrineDiffusion,
} from '../src/core/brine-diffusion';

import {
  calculateSaltToBoostBrine,
  calculateBrineTopupWithVolume,
} from '../src/core/brine-topup';

import {
  estimateContinuousBrewCycleDays,
  estimatePostRefillPh,
  calculateContinuousBrewPlan,
} from '../src/core/continuous-brew';

import {
  calculateCrockHeadspace,
} from '../src/core/crock-headspace';

import {
  analyzeCultureHotel,
} from '../src/core/culture-hotel-engine';

import {
  calculateCurdWashWater,
  calculateCurdMillingSalting,
  calculateWheelCoating,
} from '../src/core/curd-washing-and-salting';

import {
  diagnoseFermentDefect,
  getDefectById,
  getDefectsByCategory,
  getBiohazardDefects,
} from '../src/core/fermentation-diagnostics';

import {
  evaluateLabFermentation,
  calculateVinegarTitration,
} from '../src/core/fermentation-kinetics';

import {
  calculateFermentationQ10,
} from '../src/core/fermentation-q10';

import {
  calculateFermentationStatistics,
} from '../src/core/fermentation-statistics';

import {
  calculateFermentationTimeline,
  getTimelineForBatch,
} from '../src/core/fermentation-timeline';

import {
  getDescriptorsByCategory,
  findDescriptorById,
  searchDescriptors,
  calculateCategoryDistribution,
  formatDescriptorNotes,
  FLAVOR_CATEGORIES,
} from '../src/core/flavor-wheel-data';

import {
  evaluateGingerBugStarter,
  calculateGingerBeerBatch,
} from '../src/core/ginger-bug';

import {
  getAstmEquilibriumRh,
  calculateSinglePointCalibration,
  calculateTwoPointCalibration,
} from '../src/core/hygrometer-calibration';

import {
  calculateKefir1F,
  calculateKefir2F,
  getKefirHibernationPlan,
} from '../src/core/kefir-grains';

import {
  calculateShioKoji,
  calculateAmazake,
  calculateMisoFormulation,
} from '../src/core/koji-fermentation';

import {
  calculateKombucha2FBlending,
} from '../src/core/kombucha-blending';

import {
  calculateMilkSpeciesKinetics,
  MILK_SPECIES_DATABASE,
} from '../src/core/milk-species-profile';

import {
  calculatePasteurizationPlan,
  calculateInstantaneousPuRate,
} from '../src/core/pasteurization-units';

import {
  encodeRecipeToShareUri,
  decodeRecipeFromShareUri,
} from '../src/core/recipe-share';

import {
  CANONICAL_RECIPES,
} from '../src/core/canonical-recipes';

import {
  calculateReverseSchedule,
  calculateForwardSchedule,
} from '../src/core/reverse-scheduler';

import {
  calculateTempehKinetics,
} from '../src/core/tempeh-kinetics';

import {
  calculateDechlorination,
  analyzeWaterHardnessForFerment,
} from '../src/core/water-chemistry';

import {
  calculateWheyLevainPlan,
} from '../src/core/whey-levain-engine';

import {
  recordAffinageAction,
  analyzeShrinkageTrajectory,
} from '../src/core/cave-log-actions';

describe('Domain Coverage 100% Suite (src/core/**/*.ts)', () => {

  describe('psychrometry.ts', () => {
    test('calculateDewPoint error on out of range humidity', () => {
      expect(() => calculateDewPoint(12, 0)).toThrow('Wilgotność względna musi mieścić się w przedziale 0–100%.');
      expect(() => calculateDewPoint(12, 101)).toThrow('Wilgotność względna musi mieścić się w przedziale 0–100%.');
    });

    test('calculateVpd returns valid vapor pressures', () => {
      const vpd = calculateVpd(12, 85);
      expect(vpd.esKPa).toBeGreaterThan(0);
      expect(vpd.eaKPa).toBeGreaterThan(0);
      expect(vpd.vpdKPa).toBeGreaterThanOrEqual(0);
    });

    test('analyzeCaveMicroclimate evaluates all microclimate status branches', () => {
      // 1. Condensation danger
      const rCond = analyzeCaveMicroclimate(14, 90, 8);
      expect(rCond.status).toBe('CONDENSATION_DANGER');
      expect(rCond.condensationRisk).toBe(true);

      // 2. Too dry
      const rDry = analyzeCaveMicroclimate(12, 65);
      expect(rDry.status).toBe('TOO_DRY');
      expect(rDry.dryingRisk).toBe(true);

      // 3. Too humid
      const rHumid = analyzeCaveMicroclimate(12, 98, 15);
      expect(rHumid.status).toBe('TOO_HUMID');

      // 4. Optimal
      const rOpt = analyzeCaveMicroclimate(12, 85, 12);
      expect(rOpt.status).toBe('OPTIMAL');
      expect(rOpt.message).toContain('Warunki optymalne');
    });
  });

  describe('curd-syneresis.ts', () => {
    test('covers borderline ramp rate, cut size warnings, and stirring recommendations', () => {
      const resBorderline = calculateCurdSyneresis({
        cheeseStyle: 'GOUDA_EDAM',
        initialTempC: 32,
        targetCookingTempC: 38,
        heatingDurationMinutes: 11,
        stirringDurationMinutes: 10,
        curdCutSizeMm: 25,
        drainPh: 6.15,
      });
      expect(resBorderline.caseHardeningVerdict).toBe('BORDERLINE_RATE');
      expect(resBorderline.recommendations.some(r => r.includes('Wydłuż czas dogrzewania'))).toBe(true);
      expect(resBorderline.recommendations.some(r => r.includes('jest znacznie większe'))).toBe(true);
      expect(resBorderline.recommendations.some(r => r.includes('zaleca się minimum 20-30 min mieszania'))).toBe(true);

      const resTiny = calculateCurdSyneresis({
        cheeseStyle: 'CHEDDAR',
        initialTempC: 31,
        targetCookingTempC: 39,
        heatingDurationMinutes: 30,
        stirringDurationMinutes: 30,
        curdCutSizeMm: 3,
        drainPh: 6.1,
      });
      expect(resTiny.recommendations.some(r => r.includes('bardzo drobne'))).toBe(true);
    });
  });

  describe('cheese-composition-engine.ts', () => {
    test('throws validation errors on invalid percentages and volumes', () => {
      expect(() => calculateCheeseComposition({ moisturePercentage: 0, fatPercentage: 25, saltPercentage: 2 })).toThrow();
      expect(() => calculateCheeseComposition({ moisturePercentage: 45, fatPercentage: -1, saltPercentage: 2 })).toThrow();
      expect(() => calculateCheeseComposition({ moisturePercentage: 45, fatPercentage: 25, saltPercentage: -1 })).toThrow();
      expect(() => calculateCheeseComposition({ moisturePercentage: 60, fatPercentage: 45, saltPercentage: 2 })).toThrow();
      expect(() => estimateCurdMoistureAndYield({
        milkVolumeLiters: 0,
        milkFatPct: 3.8,
        milkProteinPct: 3.2,
        curdCutSize: 'PEA_LENTIL',
        pressDurationHours: 12,
        cookingFinalTempC: 38,
      })).toThrow();
    });

    test('classifies SEMI_SOFT, SOFT, LOW_FAT, and SKIM', () => {
      const rSemiSoft = calculateCheeseComposition({ moisturePercentage: 46, fatPercentage: 28, saltPercentage: 2 });
      expect(rSemiSoft.firmnessClass).toBe('SEMI_SOFT');

      const rSoft = calculateCheeseComposition({ moisturePercentage: 70, fatPercentage: 1, saltPercentage: 1 });
      expect(rSoft.firmnessClass).toBe('SOFT');

      const rLowFat = calculateCheeseComposition({ moisturePercentage: 60, fatPercentage: 6, saltPercentage: 1 });
      expect(rLowFat.fatClass).toBe('LOW_FAT');

      const rSkim = calculateCheeseComposition({ moisturePercentage: 60, fatPercentage: 2, saltPercentage: 1 });
      expect(rSkim.fatClass).toBe('SKIM');
    });

    test('estimates curd moisture and yield across all 4 curd cut sizes', () => {
      for (const cut of ['RICE_GRAIN', 'PEA_LENTIL', 'HAZELNUT', 'WALNUT_LARGE'] as const) {
        const est = estimateCurdMoistureAndYield({
          milkVolumeLiters: 10,
          milkFatPct: 3.8,
          milkProteinPct: 3.2,
          curdCutSize: cut,
          pressDurationHours: 6,
          cookingFinalTempC: 38,
        });
        expect(est.expectedFreshCurdKg).toBeGreaterThan(0);
        expect(est.expectedAgedCheeseKg).toBeGreaterThan(0);
        expect(est.suggestedAffinageDays).toBeGreaterThan(0);
      }
    });
  });

  describe('inventory.ts', () => {
    test('handles count units, direct count deficits, and missing pantry items', () => {
      const requirements: RecipeRequirement[] = [
        { name: 'Kultura Starterowa', category: 'CULTURE', quantity: 3, unit: 'szt' },
        { name: 'Chlorek Wapnia', category: 'MINERAL', quantity: 50, unit: 'g' },
      ];
      const pantry = [
        { id: '1', itemName: 'Kultura Starterowa', category: 'CULTURE' as const, quantityAvailable: 1, unit: 'szt', costPerUnitPln: 15 },
      ];
      const summary = processPantryDepletion(requirements, pantry);
      expect(summary.hasDeficits).toBe(true);
      expect(summary.deficitWarnings.length).toBe(2);
      expect(summary.totalIngredientCost).toBe(15);
    });

    test('calculates batch yield economics across single inputs', () => {
      const rLow = calculateBatchYieldAndEconomics(100, 20, 1.5);
      expect(rLow.comment).toContain('Niska wydajność');

      const rKg = calculateBatchYieldAndEconomics(60, undefined, 2);
      expect(rKg.comment).toContain('Koszt jednostkowy wyprodukowanego sera/wsadu: 30.00 PLN/kg');

      const rL = calculateBatchYieldAndEconomics(80, 20, undefined);
      expect(rL.comment).toContain('Koszt jednostkowy na litr mleka/napoju: 4.00 PLN/L');
    });
  });

  describe('mold-sizing.ts', () => {
    test('falls back when selectedMoldId is not found', () => {
      const res = calculateCurdAndMoldFitting(10, 10, 'NON_EXISTENT_MOLD');
      expect(res.recommendedMold).toBeDefined();
      expect(res.isMoldSufficient).toBeDefined();
    });

    test('calculates rectangular mold volume properly', () => {
      const rectVol = calculateRectangularMoldVolume(20, 10, 10);
      expect(rectVol.volumeLiters).toBe(2.0);
    });
  });

  describe('nukazuke-engine.ts', () => {
    test('handles cool temperature bed maintenance (<16C) and wet bed', () => {
      const m = calculateNukadokoMaintenance({
        bedTotalMassGrams: 2000,
        currentEstimatedSalinityPct: 13,
        ambientTempC: 14,
        moistureExcessStatus: 'VERY_SLUSHY',
      });
      expect(m.teireFrequencyDaily).toBe(0.4);
      expect(m.dryBranTopupGrams).toBeGreaterThan(0);
      expect(m.saltTopupGrams).toBeGreaterThan(0);
    });

    test('returns pickling times for all vegetables in warm and cool environments', () => {
      const vegs = ['CUCUMBER', 'EGGPLANT', 'DAIKON_RADISH', 'CARROT', 'AVOCADO_BOILED_EGG'] as const;
      for (const v of vegs) {
        const warm = getPicklingTimeForVeg(v, 24);
        const cool = getPicklingTimeForVeg(v, 18);
        expect(warm.durationHoursMin).toBeDefined();
        expect(cool.durationHoursMin).toBeDefined();
        expect(warm.prepAdvicePl).toBeTruthy();
      }
    });
  });

  describe('whey-utilization.ts', () => {
    test('calculateRicottaRecovery handles default addedWholeMilk and throws on invalid inputs', () => {
      expect(() => calculateRicottaRecovery(0)).toThrow();
      expect(() => calculateRicottaRecovery(10, -1)).toThrow();
      const r = calculateRicottaRecovery(10);
      expect(r.addedWholeMilkLiters).toBe(0);
      expect(r.estimatedRicottaYieldGrams).toBe(380);
    });

    test('calculateWheyIsotonicDrink and calculateScobyZeroWaste throw on non-positive inputs', () => {
      expect(() => calculateWheyIsotonicDrink(0)).toThrow();
      expect(() => calculateScobyZeroWaste(0)).toThrow();
      const drink = calculateWheyIsotonicDrink(2);
      expect(drink.honeyOrSugarGrams).toBe(70);
      const scoby = calculateScobyZeroWaste(500);
      expect(scoby.dehydratedJerkyGrams).toBe(40);
    });
  });

  describe('sensory-evaluation.ts', () => {
    test('evaluates CHEESE flaws (undersalted and pungent) and grades FLAWED / EXEMPLARY', () => {
      const resFlawed = evaluateSensoryProfile('CHEESE', {
        acidity: 10,
        salinity: 1,
        firmness: 5,
        creaminess: 5,
        pungency: 10,
        nuttiness: 5,
      });
      expect(resFlawed.identifiedFlaws.some(f => f.includes('Niedosolony'))).toBe(true);
      expect(resFlawed.identifiedFlaws.some(f => f.includes('Zbyt ostra'))).toBe(true);
      expect(resFlawed.grade).toBe('FLAWED');

      const resExemplary = evaluateSensoryProfile('CHEESE', {
        acidity: 5,
        salinity: 5,
        firmness: 6,
        creaminess: 7,
        pungency: 4,
        nuttiness: 8,
      });
      expect(resExemplary.grade).toBe('EXEMPLARY');
      expect(resExemplary.overallScore).toBeGreaterThanOrEqual(90);
    });

    test('evaluates VEG_FERMENT flaws (soft, low acidity)', () => {
      const resVeg = evaluateSensoryProfile('VEG_FERMENT', {
        acidity: 3,
        salinity: 5,
        firmness: 3,
        creaminess: 5,
        pungency: 4,
        nuttiness: 4,
      });
      expect(resVeg.identifiedFlaws.some(f => f.includes('Miękkie, kapciowate'))).toBe(true);
      expect(resVeg.identifiedFlaws.some(f => f.includes('Zbyt niska kwasowość'))).toBe(true);
    });

    test('evaluates KOMBUCHA flaws (salty, flat sweet)', () => {
      const resKombucha = evaluateSensoryProfile('KOMBUCHA', {
        acidity: 3,
        salinity: 5,
        firmness: 5,
        creaminess: 5,
        pungency: 4,
        nuttiness: 4,
      });
      expect(resKombucha.identifiedFlaws.some(f => f.includes('Niepożądana słoność'))).toBe(true);
      expect(resKombucha.identifiedFlaws.some(f => f.includes('Mdły, za słodki'))).toBe(true);
    });
  });

  describe('qr-deeplink.ts', () => {
    test('parses recipe deep link and various JSON tags', () => {
      expect(parseDeepLinkOrQr('ferment://recipe/cheddar-2026').id).toBe('cheddar-2026');
      expect(parseDeepLinkOrQr(JSON.stringify({ wheelTag: 'W-99' })).id).toBe('W-99');
      expect(parseDeepLinkOrQr(JSON.stringify({ batchId: 'B-101' })).id).toBe('B-101');
      expect(parseDeepLinkOrQr(JSON.stringify({ batch: 'B-102' })).id).toBe('B-102');
      expect(parseDeepLinkOrQr(JSON.stringify({ id: 'wheel_special' })).type).toBe('wheel');
      expect(parseDeepLinkOrQr(JSON.stringify({ id: 'batch_special' })).type).toBe('batch');
      expect(parseDeepLinkOrQr('{ not valid json }').type).toBe('unknown');
    });
  });

  describe('refractometer-alcohol.ts', () => {
    test('throws on invalid input Brix', () => {
      expect(() => analyzeRefractometerBrix({ originalBrix: -1, currentBrix: 5, purpose: 'KOMBUCHA' })).toThrow();
      expect(() => analyzeRefractometerBrix({ originalBrix: 10, currentBrix: -1, purpose: 'KOMBUCHA' })).toThrow();
      expect(brixToSg(0)).toBe(1.0);
      expect(brixToSg(12)).toBeGreaterThan(1.0);
    });

    test('handles VINEGAR_CIDER low alcohol, KOMBUCHA standard, and generic wine', () => {
      const noFerm = analyzeRefractometerBrix({ originalBrix: 10, currentBrix: 10, purpose: 'KOMBUCHA' });
      expect(noFerm.abvPct).toBe(0);

      const rVin = analyzeRefractometerBrix({ originalBrix: 7, currentBrix: 5, purpose: 'VINEGAR_CIDER' });
      expect(rVin.classification).toContain('Zbyt Niski Potencjał Kwasowy');

      const highVin = analyzeRefractometerBrix({ originalBrix: 25, currentBrix: 5, purpose: 'VINEGAR_CIDER' });
      expect(highVin.classification).toContain('Toksyczność');

      const optVin = analyzeRefractometerBrix({ originalBrix: 12, currentBrix: 2, purpose: 'VINEGAR_CIDER' });
      expect(optVin.classification).toContain('Idealny Wsad');

      const rKom = analyzeRefractometerBrix({ originalBrix: 6, currentBrix: 5, purpose: 'KOMBUCHA' });
      expect(rKom.classification).toContain('Standardowa Kombucha Domowa');

      const highKom = analyzeRefractometerBrix({ originalBrix: 10, currentBrix: 2, purpose: 'KOMBUCHA' });
      expect(highKom.classification).toContain('Wysoki Alkohol');

      const naKom = analyzeRefractometerBrix({ originalBrix: 6, currentBrix: 5.5, purpose: 'KOMBUCHA' });
      expect(naKom.classification).toContain('Kombucha Bezalkoholowa');

      const rWine = analyzeRefractometerBrix({ originalBrix: 18, currentBrix: 4, purpose: 'FRUIT_WINE' });
      expect(rWine.classification).toContain('Wino Owocowe / Cydr');
    });
  });

  describe('emergency-recovery.ts', () => {
    test('throws when protocol is missing and searches keywords', () => {
      expect(() => getEmergencyRescueProtocol('NON_EXISTENT' as any)).toThrow();
      
      const all = searchEmergencyProtocols('');
      expect(all.length).toBeGreaterThan(0);
      
      const found = searchEmergencyProtocols('kożuszek');
      expect(found.length).toBeGreaterThan(0);
      
      const bySymptoms = searchEmergencyProtocols('śluzowata');
      expect(bySymptoms.length).toBeGreaterThan(0);
    });
  });

  describe('ferment-engine.ts', () => {
    test('throws on out of range salinity and warns on low salinity', () => {
      expect(() => calculateTotalBatchSalinity(1000, 500, 0)).toThrow();
      expect(() => calculateTotalBatchSalinity(1000, 500, 25)).toThrow();
      
      const low = calculateTotalBatchSalinity(1000, 500, 1.2);
      expect(low.warning).toContain('Stężenie soli < 1.5%');
    });

    test('verifyBotulinumSafety throws on invalid pH and checks high pH after 48h', () => {
      expect(() => verifyBotulinumSafety(-1)).toThrow();
      expect(() => verifyBotulinumSafety(15)).toThrow();

      const stalled = verifyBotulinumSafety(4.8, 72);
      expect(stalled.isSafe).toBe(false);
      expect(stalled.status).toBe('CRITICAL_DANGER');
    });

    test('calculateKombucha2FPressure returns OPTIMAL and LOW risk levels', () => {
      const opt = calculateKombucha2FPressure(5, 2);
      expect(opt.riskLevel).toBe('OPTIMAL');
      expect(opt.refrigerationRequired).toBe(false);

      const low = calculateKombucha2FPressure(1, 1);
      expect(low.riskLevel).toBe('LOW');
    });

    test('calculateVinegarConversion checks weak expected acidity (<5%)', () => {
      const weak = calculateVinegarConversion(6, 4.0);
      expect(weak.message).toContain('zbyt łagodna do długiej konserwacji');
    });
  });

  describe('cheese-engine.ts', () => {
    test('calculateCacl2Dose handles raw milk winter dose and high dose warning', () => {
      const rawWinter = calculateCacl2Dose(10, 'RAW', true);
      expect(rawWinter.dryGrams).toBe(1.0);

      const highDose = calculateCacl2Dose(10, 'PASTEURIZED_LOW');
      expect(highDose.dryGrams).toBe(2.0);
    });

    test('calculateFlocculationCutTime warns on fast (<8m) and slow (>22m) coagulation', () => {
      expect(() => calculateFlocculationCutTime(600, 0.5)).toThrow();

      const fast = calculateFlocculationCutTime(300, 3);
      expect(fast.warning).toContain('Flokulacja zaszła zbyt szybko');

      const slow = calculateFlocculationCutTime(1500, 3);
      expect(slow.warning).toContain('Flokulacja opóźniona');
    });
  });

  describe('vinegar-standardization.ts', () => {
    test('calculateVinegarStandardization covers sub-standard and high grain classifications', () => {
      const sub = calculateVinegarStandardization({
        rawVolumeLiters: 10,
        rawAcidityPct: 3.5,
        targetAcidityPct: 3.5,
        dilutionLiquid: 'DISTILLED_WATER',
      });
      expect(sub.legalFoodGradeClassification).toBe('SUB_STANDARD_LOW');

      const high = calculateVinegarStandardization({
        rawVolumeLiters: 10,
        rawAcidityPct: 7.0,
        targetAcidityPct: 7.0,
        dilutionLiquid: 'DISTILLED_WATER',
      });
      expect(high.legalFoodGradeClassification).toBe('PICKLING_PRESERVE_60_GRAIN');

      const dilutedLow = calculateVinegarStandardization({
        rawVolumeLiters: 10,
        rawAcidityPct: 6.0,
        targetAcidityPct: 4.0,
        dilutionLiquid: 'DISTILLED_WATER',
      });
      expect(dilutedLow.legalFoodGradeClassification).toBe('SUB_STANDARD_LOW');
    });

    test('calculateVesselAeration covers moderate and excessive evaporation', () => {
      const mod = calculateVesselAeration({ vesselType: 'GLASS_JAR', surfaceDiameterCm: 10, liquidVolumeLiters: 2 });
      expect(mod.aerationRating).toBe('MODERATE_SLOW');

      const evap = calculateVesselAeration({ vesselType: 'GLASS_JAR', surfaceDiameterCm: 30, liquidVolumeLiters: 2 });
      expect(evap.aerationRating).toBe('EXCESSIVE_EVAPORATION');

      const opt = calculateVesselAeration({ vesselType: 'GLASS_JAR', surfaceDiameterCm: 15, liquidVolumeLiters: 2 });
      expect(opt.aerationRating).toBe('OPTIMAL_ARTISAN');
      expect(opt.actionableRecommendations.some(r => r.includes('ciemnym, ciepłym miejscu'))).toBe(true);
    });
  });

  describe('black-garlic.ts', () => {
    test('calculateBlackGarlic alerts on suboptimal low and high temperatures', () => {
      const low = calculateBlackGarlic({
        currentDay: 5,
        chamberTempC: 65,
        chamberRhPct: 85,
        rawWeightGrams: 500,
      });
      expect(low.alerts.some(a => a.code === 'TEMPERATURE_SUBOPTIMAL_LOW')).toBe(true);

      const high = calculateBlackGarlic({
        currentDay: 35,
        chamberTempC: 70,
        chamberRhPct: 70,
        rawWeightGrams: 500,
      });
      expect(high.alerts.some(a => a.code === 'TEMPERATURE_SUBOPTIMAL_HIGH')).toBe(true);
    });
  });

  describe('botanical-extraction.ts', () => {
    test('calculateVegCrispnessProtection covers optimal crisp, moderate protection, whole peeled garlic, and high minced garlic', () => {
      const opt = calculateVegCrispnessProtection({
        vegetableWeightKg: 2,
        brineVolumeLiters: 2,
        botanicals: [{ botanicalId: 'OAK_LEAF', weightGrams: 4 }],
        garlicGrams: 10,
        garlicPrep: 'WHOLE_PEELED',
      });
      expect(opt.crispnessVerdict).toBe('OPTIMAL_CRISP');

      const mod = calculateVegCrispnessProtection({
        vegetableWeightKg: 2,
        brineVolumeLiters: 2,
        botanicals: [{ botanicalId: 'OAK_LEAF', weightGrams: 2 }],
        garlicGrams: 50,
        garlicPrep: 'MINCED_GRATED',
      });
      expect(mod.crispnessVerdict).toBe('MODERATE_PROTECTION');
      expect(mod.garlicImpactNotes).toContain('Bardzo wysoka dawka allicyny');
    });
  });

  describe('brine-densitometry.ts', () => {
    test('covers BAUME unit, zero adjustment, supersaturated and too dilute statuses', () => {
      const bme = calculateBrineDensitometry({
        measuredValue: 10,
        unit: 'BAUME',
        sampleTempC: 20,
      });
      expect(bme.temperatureCorrectedSg).toBeGreaterThan(1.0);

      const noAdj = calculateBrineDensitometry({
        measuredValue: 1.15,
        unit: 'SPECIFIC_GRAVITY',
        sampleTempC: 20,
        currentBrineVolumeLiters: 5,
        targetPercent: 10,
      });
      expect(noAdj.saltAdjustmentGrams).toBe(0);

      const superSat = calculateBrineDensitometry({
        measuredValue: 1.21,
        unit: 'SPECIFIC_GRAVITY',
        sampleTempC: 20,
      });
      expect(superSat.status).toBe('SUPER_SATURATED');

      const dilute = calculateBrineDensitometry({
        measuredValue: 1.02,
        unit: 'SPECIFIC_GRAVITY',
        sampleTempC: 20,
      });
      expect(dilute.status).toBe('TOO_DILUTE');
    });
  });

  describe('cave-environment.ts', () => {
    test('covers TOO_COLD and TOO_WARM cave environment statuses', () => {
      const cold = analyzeCaveEnvironment({ tempCelsius: 5, relativeHumidityPct: 85, caveType: 'HARD_GOUDA_CHEDDAR' });
      expect(cold.status).toBe('TOO_COLD');

      const warm = analyzeCaveEnvironment({ tempCelsius: 18, relativeHumidityPct: 85, caveType: 'HARD_GOUDA_CHEDDAR' });
      expect(warm.status).toBe('TOO_WARM');
    });
  });

  describe('remaining domain modules edge branches', () => {
    test('batch-cost-engine: single unit packaging edge', () => {
      const cost = calculateBatchCost({
        craftType: 'CHEESE',
        baseVolumeOrWeight: 10,
        basePricePerUnit: 3.5,
        culturesAndEnzymesCost: 5.0,
        expectedFinishedKgOrLiters: 1.0,
      });
      expect(cost.costPerKgOrLiter).toBeGreaterThan(0);
    });

    test('brine-diffusion & topup: edge conditions', () => {
      const diff = calculateBrineDiffusion({
        wheelWeightKg: 1.5,
        diameterCm: 14,
        heightCm: 10,
        brineSalinityPct: 18.0,
      });
      expect(diff.totalSaltAbsorbedGrams).toBeGreaterThan(0);

      const topup = calculateSaltToBoostBrine(10, 15, 18);
      expect(topup.saltGramsToAdd).toBeGreaterThan(0);

      const withVol = calculateBrineTopupWithVolume(10, 15, 18, 2);
      expect(withVol.targetSalinityPct).toBe(18);
    });

    test('continuous brew and crock headspace: safety thresholds', () => {
      const days = estimateContinuousBrewCycleDays(22);
      expect(days).toBeGreaterThan(0);

      const ph = estimatePostRefillPh(2.8, 8, 5.0, 2);
      expect(ph).toBeGreaterThan(0);

      const plan = calculateContinuousBrewPlan({
        system: {
          id: 'cb-1',
          name: 'Main Kombucha Crock',
          vesselCapacityLiters: 10,
          currentVolumeLiters: 8,
          ambientTempCelsius: 22,
          teaBaseType: 'BLACK',
          totalCyclesCompleted: 5,
          cyclesSinceLastPurge: 2,
        },
        drawVolumeLiters: 2,
        currentPreDrawPh: 2.8,
      });
      expect(plan.sweetTeaVolumeLiters).toBe(2);

      const hs = calculateCrockHeadspace({
        jarCapacityMl: 5000,
        vegetableWeightGrams: 3000,
        brineWaterMl: 1500,
        weightMassGrams: 200,
      });
      expect(hs.headspacePercentage).toBeDefined();
    });

    test('culture hotel and curd washing', () => {
      const hotel = analyzeCultureHotel({
        cultureType: 'KOMBUCHA_SCOBY_HOTEL',
        lastFedTimestamp: Date.now() - 7 * 86400 * 1000,
        currentLiquidVolumeMl: 1000,
        currentTempC: 6, // cold hibernation
      });
      expect(hotel.healthStatus).toBe('DORMANT_REFRIGERATED');

      const wash = calculateCurdWashWater({
        milkVolumeLiters: 20,
        initialCurdTempC: 32,
        wheyDrainedLiters: 6,
        hotWaterTempC: 50,
        targetCookingTempC: 38,
      });
      expect(wash.waterVolumeLiters).toBeGreaterThan(0);

      const mill = calculateCurdMillingSalting({
        curdWeightGrams: 5000,
        targetSalinityPct: 2.0,
      });
      expect(mill.totalSaltToApplyGrams).toBeGreaterThan(0);

      const coating = calculateWheelCoating({
        diameterCm: 16,
        heightCm: 10,
        coatingType: 'CHEESE_WAX',
      });
      expect(coating.totalGramsNeeded).toBeGreaterThan(0);
    });

    test('diagnostics, kinetics, q10, statistics, timeline', () => {
      const diag = diagnoseFermentDefect('drożdże');
      expect(diag.length).toBeGreaterThan(0);

      expect(getDefectById('VG_KAHM_YEAST')).toBeDefined();
      expect(getDefectsByCategory('CHEESE').length).toBeGreaterThan(0);
      expect(getBiohazardDefects().length).toBeGreaterThan(0);

      const lab = evaluateLabFermentation(24, 4.2);
      expect(lab.status).toBeDefined();

      const titr = calculateVinegarTitration(10, 8.5);
      expect(titr.aceticAcidPercentage).toBeGreaterThan(0);

      const q10 = calculateFermentationQ10({
        cultureType: 'VEG_LAB',
        ambientTempC: 25,
        nominalDaysAt20C: 7,
      });
      expect(q10.velocityMultiplier).toBeGreaterThan(0);

      const stats = calculateFermentationStatistics([
        {
          id: 'b-1',
          name: 'Gouda',
          craftType: 'CHEESE',
          status: 'COMPLETED',
          createdAt: '2026-10-01',
          milkVolumeLiters: 10,
          sensoryScore: 85,
        } as any,
      ]);
      expect(stats.totalBatches).toBe(1);

      const tl = calculateFermentationTimeline({
        recipeId: CANONICAL_RECIPES[0].id,
        startedAtTimestamp: Date.now(),
        ambientTempC: 20,
      });
      expect(tl.adjustedDays).toBeGreaterThan(0);

      const btl = getTimelineForBatch({ category: 'CHEESE', createdAt: Date.now() }, 20);
      expect(btl.milestones.length).toBeGreaterThan(0);
    });

    test('flavor wheel, ginger bug, hygrometer calibration, kefir grains, koji, kombucha blending', () => {
      expect(FLAVOR_CATEGORIES.length).toBeGreaterThan(0);
      expect(getDescriptorsByCategory('LACTIC').length).toBeGreaterThan(0);
      expect(findDescriptorById('fl_butter_diacetyl')).toBeDefined();
      expect(searchDescriptors('masło').length).toBeGreaterThan(0);
      expect(calculateCategoryDistribution(['fl_butter_diacetyl']).length).toBeGreaterThan(0);
      expect(formatDescriptorNotes(['fl_butter_diacetyl'])).toBeTruthy();

      const bug = evaluateGingerBugStarter({
        starterAgeDays: 3,
        daysSinceLastFeed: 1,
        temperatureC: 22,
        hasBubbles: true,
        hasFizzOnStir: true,
        isRefrigerated: false,
      });
      expect(bug.status).toBeDefined();

      const gBeer = calculateGingerBeerBatch({
        batchVolumeLiters: 4,
        hoursInBottle: 24,
      });
      expect(gBeer.totalSugarGrams).toBeGreaterThan(0);

      expect(getAstmEquilibriumRh('NACL_TABLE_SALT', 20)).toBeGreaterThan(70);
      const cal1 = calculateSinglePointCalibration({
        saltType: 'NACL_TABLE_SALT',
        chamberTempC: 20,
        rawSensorReadingPct: 71,
      });
      expect(cal1.offsetPct).toBeGreaterThan(0);
      const cal2 = calculateTwoPointCalibration({
        lowSalt: 'MGCL2_MAGNESIUM_CHLORIDE',
        lowSaltTempC: 20,
        lowRawSensorReadingPct: 30,
        highSalt: 'NACL_TABLE_SALT',
        highSaltTempC: 20,
        highRawSensorReadingPct: 71,
      });
      expect(cal2.slopeA).toBeGreaterThan(0);

      const k1f = calculateKefir1F({ medium: 'MILK_KEFIR', liquidVolumeMl: 1000, grainWeightGrams: 50, ambientTempC: 22 });
      expect(k1f.estimatedFermentationHours).toBeGreaterThan(0);
      const k2f = calculateKefir2F({ medium: 'MILK_KEFIR', ripenedLiquidVolumeMl: 1000, flavorAddition: 'NONE', temperatureC: 20, durationHours: 24, isHermeticVessel: true });
      expect(k2f.carbonationLevelVol).toBeDefined();
      expect(getKefirHibernationPlan('FRIDGE_LIQUID')).toBeDefined();

      const koji = calculateShioKoji({ kojiMassGrams: 200, kojiState: 'DRIED' });
      expect(koji.saltGrams).toBeGreaterThan(0);
      const amazake = calculateAmazake({ kojiMassGrams: 200, cookedRiceMassGrams: 300, incubationTempC: 58 });
      expect(amazake.waterGrams).toBeGreaterThan(0);
      const miso = calculateMisoFormulation({ cookedSoybeansGrams: 1000, kojiGrams: 500, misoType: 'SHIRO_MISO' });
      expect(miso.saltGrams).toBeGreaterThan(0);

      const blend = calculateKombucha2FBlending({
        baseKombuchaLiters: 5,
        juiceProfileId: 'apple',
        juiceVolumeMl: 500,
        bottleType: 'HEAVY_SWING_TOP_AMBER',
        temperatureC: 22,
        daysAtRoomTemp: 3,
      });
      expect(blend.totalBeverageVolumeLiters).toBeGreaterThan(5);
    });

    test('milk species, pasteurization units, recipe share, reverse scheduler, tempeh, water, whey levain, cave actions', () => {
      const milkKin = calculateMilkSpeciesKinetics({
        speciesId: 'GOAT',
        milkVolumeLiters: 10,
        customFatPct: 4.5,
        customProteinPct: 3.8,
      });
      expect(milkKin.effectiveFlocculationMultiplier).toBeGreaterThan(0);
      expect(MILK_SPECIES_DATABASE.SHEEP).toBeDefined();

      const puRate = calculateInstantaneousPuRate(65, 60, 7);
      expect(puRate).toBeGreaterThan(0);
      const puPlan = calculatePasteurizationPlan({
        category: 'KOMBUCHA_STABILIZATION',
        waterBathTempCelsius: 65,
        holdTimeMinutes: 10,
      });
      expect(puPlan.requiredHoldTimeMinutes).toBeGreaterThan(0);

      const shareUrl = encodeRecipeToShareUri(CANONICAL_RECIPES[0]);
      expect(shareUrl).toContain('ferment://');
      const parsed = decodeRecipeFromShareUri(shareUrl);
      expect(parsed?.name).toBe(CANONICAL_RECIPES[0].name);

      const rev = calculateReverseSchedule(
        'CHEESE_HARD_GOUDA',
        new Date('2026-10-25T18:00:00Z')
      );
      expect(rev.startTime).toBeDefined();

      const fwd = calculateForwardSchedule(
        'CHEESE_HARD_GOUDA',
        new Date('2026-10-20T10:00:00Z')
      );
      expect(fwd.completionTime).toBeDefined();

      const tempeh = calculateTempehKinetics({
        dryLegumeWeightGrams: 500,
        legumeType: 'SOYBEAN',
        soakVinegarMl5Pct: 25,
        incubationHours: 20,
        currentCoreTempC: 31,
        ambientTempC: 26,
      });
      expect(tempeh.hydratedLegumeWeightGrams).toBeGreaterThan(0);

      const dechl = calculateDechlorination(10, true);
      expect(dechl.vitaminCMgNeededForChloramine).toBeGreaterThan(0);

      const water = analyzeWaterHardnessForFerment(80, 20, 150);
      expect(water.dGhTotalHardness).toBeGreaterThan(0);

      const levain = calculateWheyLevainPlan({
        levainType: 'MESOPHILIC_FARMHOUSE',
        wheyVolumeMl: 500,
        incubationTempCelsius: 30,
        hoursIncubated: 12,
      });
      expect(levain.requiredStarterMl).toBeGreaterThan(0);

      const action = recordAffinageAction(
        {
          id: 'w-1',
          batchId: 'b-1',
          name: 'Gouda',
          initialWeightGrams: 2000,
          currentWeightGrams: 1900,
          shrinkagePct: 5,
          createdAt: Date.now(),
        } as any,
        'WASH_BRINE',
        1890,
        'Wash with 3% light brine'
      );
      expect(action.actionLog.actionType).toBe('WASH_BRINE');

      const shrink = analyzeShrinkageTrajectory(
        2000,
        [{ loggedAt: Date.now(), weightGrams: 1800 }],
        Date.now() - 30 * 86400 * 1000
      );
      expect(shrink.totalShrinkagePct).toBeGreaterThan(0);
    });
  });

});
