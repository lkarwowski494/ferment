// ============================================================================
// Apps4Brew Studio — FERMENT Main Crafting Assistant & Dynamic Calculators
// 1-Tap Beginner Simplicity + Collapsible Pro Biochemical Accordion
// Ergonomics: Dirty/Wet hands >= 56pt, Keep-Awake, WAV PCM Bell Chimes
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { useAppAccess } from '../../src/lib/app-access';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { getSqliteStore, Batch } from '../../src/data/sqlite-store';
import { createAutoBackup } from '../../src/lib/backup';
import { processPantryDepletion, RecipeRequirement } from '../../src/core/inventory';
import {
  calculateRennetDose,
  calculateCacl2Dose,
  calculateFlocculationCutTime,
  calculatePressPressure,
  calculateBrineComposition,
  calculateCurdCookingMinTime,
} from '../../src/core/cheese-engine';
import {
  calculateTotalBatchSalinity,
  verifyBotulinumSafety,
  calculateKimchiPrep,
  calculateKombucha1F,
  calculateKombucha2FPressure,
  calculateVinegarConversion,
} from '../../src/core/ferment-engine';
import {
  enableProcessKeepAwake,
  disableProcessKeepAwake,
  playTimerCompletionAlert,
  triggerHapticFeedback,
} from '../../src/lib/timer-audio';
import * as Clipboard from 'expo-clipboard';
import {
  CANONICAL_RECIPES,
  getCanonicalRecipe,
  getRecipesByCategory,
  CanonicalRecipe,
} from '../../src/core/canonical-recipes';
import {
  calculateReverseSchedule,
  CraftProcessType,
} from '../../src/core/reverse-scheduler';
import {
  calculateRicottaRecovery,
  calculateWheyIsotonicDrink,
} from '../../src/core/whey-utilization';
import {
  calculateSaltToBoostBrine,
  calculateBrineTopupWithVolume,
} from '../../src/core/brine-topup';
import {
  encodeRecipeToShareUri,
  decodeRecipeFromShareUri,
} from '../../src/core/recipe-share';
import {
  calculateCylindricalMoldVolume,
  calculateCurdAndMoldFitting,
  STANDARD_MOLD_TEMPLATES,
} from '../../src/core/mold-sizing';
import {
  calculateDutchLeverPress,
  generatePressingCascadeProgram,
} from '../../src/core/press-cascade';
import {
  evaluateLabFermentation,
  calculateVinegarTitration,
} from '../../src/core/fermentation-kinetics';
import {
  calculateBrineAcidification,
} from '../../src/core/brine-acidification';
import {
  calculateKombucha2FBlending,
  KombuchaBottleType,
} from '../../src/core/kombucha-blending';
import {
  calculateCurdWashWater,
  calculateCurdMillingSalting,
  calculateWheelCoating,
} from '../../src/core/curd-washing-and-salting';
import { calculateFermentationQ10 } from '../../src/core/fermentation-q10';
import { calculateCrockHeadspace } from '../../src/core/crock-headspace';
import { analyzeRefractometerBrix } from '../../src/core/refractometer-alcohol';
import { calculateCheeseComposition } from '../../src/core/cheese-composition-engine';
import { analyzeCultureHotel, LiveCultureType } from '../../src/core/culture-hotel-engine';
import { calculateBrineDiffusion } from '../../src/core/brine-diffusion';
import {
  calculateContinuousBrewPlan,
  TeaBaseType,
} from '../../src/core/continuous-brew';
import {
  calculateWheyLevainPlan,
  WheyLevainType,
} from '../../src/core/whey-levain-engine';
import {
  calculateCurdSyneresis,
  CheeseStyleSyneresis,
  CHEESE_SYNERESIS_CONFIGS,
} from '../../src/core/curd-syneresis';
import {
  calculateVegCrispnessProtection,
  BOTANICAL_DATABASE,
  BotanicalSourceId,
  GarlicPrepMethod,
} from '../../src/core/botanical-extraction';
import {
  calculatePasteurizationPlan,
  PASTEURIZATION_TARGETS,
  PasteurizationTargetCategory,
} from '../../src/core/pasteurization-units';
import {
  calculateMilkSpeciesKinetics,
  MilkSpeciesId,
  MILK_SPECIES_DATABASE,
} from '../../src/core/milk-species-profile';
import {
  calculateVinegarStandardization,
  calculateVinegarStoichiometry,
  calculateVesselAeration,
} from '../../src/core/vinegar-standardization';
import {
  calculateBrineDensitometry,
  BRINE_TARGET_PROFILES,
  BrineTargetProfileKey,
} from '../../src/core/brine-densitometry';
import {
  calculateShioKoji,
  calculateAmazake,
  calculateMisoFormulation,
  KojiMoistureState,
} from '../../src/core/koji-fermentation';
import {
  calculateKefir1F,
  calculateKefir2F,
  KefirMediumType,
} from '../../src/core/kefir-grains';
import {
  calculateNukadokoSetup,
  calculateNukadokoMaintenance,
  getPicklingTimeForVeg,
  NukazukeVegType,
} from '../../src/core/nukazuke-engine';
import {
  calculateTempehKinetics,
  LegumeType,
} from '../../src/core/tempeh-kinetics';
import {
  calculateMeadBatch,
  PolishMeadGrade,
  MeadPreparationType,
  MEAD_GRADE_CONFIGS,
} from '../../src/core/mead-kinetics';
import {
  calculateBlackGarlic,
} from '../../src/core/black-garlic';
import {
  evaluateGingerBugStarter,
  calculateGingerBeerBatch,
  BottleType as GingerBottleType,
} from '../../src/core/ginger-bug';



export default function CalculatorScreen() {
  const {
    isPaywallVisible,
    setPaywallVisible,
    requireActionAccess,
    subscribe,
    restorePurchases,
  } = useAppAccess();

  // Mode Switcher: 🧀 Serowarstwo | 🥬 Kiszonki & Kimchi | 🫖 Kombucha & Ocet
  const [craftMode, setCraftMode] = useState<'cheese' | 'veg' | 'beverage'>('cheese');
  const [isProExpanded, setIsProExpanded] = useState<boolean>(false);
  const [isKeepAwake, setIsKeepAwake] = useState<boolean>(false);

  // --- CHEESE STATE ---
  const [milkLiters, setMilkLiters] = useState<number>(10);
  const [milkType, setMilkType] = useState<MilkSpeciesId>('COW');

  const [flocSecInput, setFlocSecInput] = useState<number>(720); // 12 min
  const [flocMultiplier, setFlocMultiplier] = useState<number>(3.5);
  const [pressWeightKg, setPressWeightKg] = useState<number>(8);
  const [moldDiamCm, setMoldDiamCm] = useState<number>(14);
  const [leverRatio, setLeverRatio] = useState<number>(3.0);
  const [brineWaterLiters, setBrineWaterLiters] = useState<number>(5);
  const [brineSalinityPct, setBrineSalinityPct] = useState<number>(20);
  const [cookStartTemp, setCookStartTemp] = useState<number>(32);
  const [cookEndTemp, setCookEndTemp] = useState<number>(38);
  const [cookDurationMin, setCookDurationMin] = useState<number>(15);

  // --- VEG & KIMCHI STATE ---
  const [vegGrams, setVegGrams] = useState<number>(1500);
  const [waterGrams, setWaterGrams] = useState<number>(1000);
  const [targetSalinity, setTargetSalinity] = useState<number>(2.2);
  const [measuredPh, setMeasuredPh] = useState<number>(4.2);
  const [fermentHours, setFermentHours] = useState<number>(48);
  const [cabbageGrams, setCabbageGrams] = useState<number>(2000);

  // --- KOMBUCHA & VINEGAR STATE ---
  const [kombuchaWaterLiters, setKombuchaWaterLiters] = useState<number>(3);
  const [residualSugar, setResidualSugar] = useState<number>(12);
  const [daysIn2F, setDaysIn2F] = useState<number>(3);
  const [vinegarBrix, setVinegarBrix] = useState<number>(12);

  // --- KOMBUCHA CONTINUOUS BREW STATE ---
  const [cbVesselLiters, setCbVesselLiters] = useState<number>(10);
  const [cbDrawLiters, setCbDrawLiters] = useState<number>(2.5);
  const [cbTempCelsius, setCbTempCelsius] = useState<number>(24);
  const [cbTeaBase, setCbTeaBase] = useState<TeaBaseType>('BLACK');
  const [cbCyclesSincePurge, setCbCyclesSincePurge] = useState<number>(3);
  const [cbPreDrawPh, setCbPreDrawPh] = useState<number>(3.0);

  // --- SISTER MODULE STATES (napar, piekarz, słoik, oczko) ---
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState<boolean>(false);
  const [targetFinishHour, setTargetFinishHour] = useState<number>(22);
  const [schedulerProcess, setSchedulerProcess] = useState<CraftProcessType>('CHEESE_HARD_GOUDA');
  const [wheyMilkBoostLiters, setWheyMilkBoostLiters] = useState<number>(1);
  const [currentBrineSalinity, setCurrentBrineSalinity] = useState<number>(16);
  const [targetBrineSalinity, setTargetBrineSalinity] = useState<number>(20);

  // --- MOLD SIZING & PRESS CASCADE ---
  const [selectedMoldTemplateId, setSelectedMoldTemplateId] = useState<string>('kadova_gouda_1kg');
  const [isPressCascadeOpen, setIsPressCascadeOpen] = useState<boolean>(false);
  const [pressMechanism, setPressMechanism] = useState<'DIRECT' | 'DUTCH_LEVER'>('DUTCH_LEVER');
  const [armLengthCm, setArmLengthCm] = useState<number>(60);
  const [moldDistCm, setMoldDistCm] = useState<number>(20);
  const [armWeightKg, setArmWeightKg] = useState<number>(2.0);

  // --- VINEGAR TITRATION STATE ---
  const [vinegarSampleMl, setVinegarSampleMl] = useState<number>(1);
  const [naohTiterMl, setNaohTiterMl] = useState<number>(8.5);

  // --- BRINE ACIDIFICATION & BUFFER ---
  const [brineWaterPh, setBrineWaterPh] = useState<number>(7.5);
  const [targetBrinePh, setTargetBrinePh] = useState<number>(5.2);
  const [lacticAcidConc, setLacticAcidConc] = useState<number>(80);

  // --- KOMBUCHA 2F BLENDING & BOTTLE DYNAMICS ---
  const [selectedJuiceId, setSelectedJuiceId] = useState<string>('apple');
  const [juiceVolumeMl, setJuiceVolumeMl] = useState<number>(150);
  const [kombuchaBottleType, setKombuchaBottleType] = useState<KombuchaBottleType>('HEAVY_SWING_TOP_AMBER');
  const [kombuchaTemp, setKombuchaTemp] = useState<number>(22);

  // --- CURD WASHING, CHEDDAR SALTING & COATING ---
  const [washWheyDrainedLiters, setWashWheyDrainedLiters] = useState<number>(3.0);
  const [washHotWaterTempC, setWashHotWaterTempC] = useState<number>(60);
  const [washTargetTempC, setWashTargetTempC] = useState<number>(37);
  const [cheddarCurdGrams, setCheddarCurdGrams] = useState<number>(1050);
  const [cheddarTargetSalinityPct, setCheddarTargetSalinityPct] = useState<number>(2.0);
  const [coatingType, setCoatingType] = useState<'CHEESE_WAX' | 'POLYVINYL_BREATHABLE'>('CHEESE_WAX');
  const [coatingWheelHeightCm, setCoatingWheelHeightCm] = useState<number>(8.0);
  const [coatingLayers, setCoatingLayers] = useState<number>(2);

  // --- Q10 FERMENTATION TEMPERATURE STATE ---
  const [ambientTempC, setAmbientTempC] = useState<number>(21);

  // --- CROCK & JAR HEADSPACE STATE ---
  const [jarCapacityMl, setJarCapacityMl] = useState<number>(1000);
  const [stoneWeightGrams, setStoneWeightGrams] = useState<number>(150);

  // --- OPTICAL REFRACTOMETER ALCOHOL STATE ---
  const [originalBrixInput, setOriginalBrixInput] = useState<number>(12);
  const [currentBrixInput, setCurrentBrixInput] = useState<number>(5.5);

  // --- CHEESE COMPOSITION (CODEX ALIMENTARIUS) ---
  const [cheeseMoisturePct, setCheeseMoisturePct] = useState<number>(42.0);
  const [cheeseFatPct, setCheeseFatPct] = useState<number>(28.0);
  const [cheeseSaltPct, setCheeseSaltPct] = useState<number>(2.0);

  // --- BRINE DIFFUSION & CORE PENETRATION TIME (FICK'S LAW) ---
  const [diffWheelWeightKg, setDiffWheelWeightKg] = useState<number>(1.2);
  const [diffDiameterCm, setDiffDiameterCm] = useState<number>(15.0);
  const [diffHeightCm, setDiffHeightCm] = useState<number>(6.5);
  const [diffBrineSalinityPct, setDiffBrineSalinityPct] = useState<number>(20.0);
  const [diffBrineTempC, setDiffBrineTempC] = useState<number>(12);
  const [diffTargetSaltPct, setDiffTargetSaltPct] = useState<number>(1.8);

  // --- MOTHER WHEY LEVAIN STATE ---
  const [wheyLevainType, setWheyLevainType] = useState<WheyLevainType>('THERMOPHILIC_ALPINE');
  const [wheyVolumeMl, setWheyVolumeMl] = useState<number>(500);
  const [wheyIncubationTempC, setWheyIncubationTempC] = useState<number>(43);
  const [wheyHoursIncubated, setWheyHoursIncubated] = useState<number>(10);
  const [wheyCurrentPh, setWheyCurrentPh] = useState<number>(3.8);
  const [wheyGeneration, setWheyGeneration] = useState<number>(3);

  // --- LIVE CULTURE HOTEL & MOTHER COLONY ---
  const [hotelCultureType, setHotelCultureType] = useState<LiveCultureType>('KOMBUCHA_SCOBY_HOTEL');
  const [hotelDaysSinceFed, setHotelDaysSinceFed] = useState<number>(14);
  const [hotelVolumeMl, setHotelVolumeMl] = useState<number>(2000);
  const [hotelSludgeDepthCm, setHotelSludgeDepthCm] = useState<number>(0.8);
  const [hotelPh, setHotelPh] = useState<number>(2.8);

  // --- CURD SYNERESIS & CASEIN SHRINKAGE KINETICS ---
  const [syneresisStyle, setSyneresisStyle] = useState<CheeseStyleSyneresis>('GOUDA_EDAM');
  const [syneresisCutSizeMm, setSyneresisCutSizeMm] = useState<number>(8);
  const [syneresisInitTempC, setSyneresisInitTempC] = useState<number>(31);
  const [syneresisTargetTempC, setSyneresisTargetTempC] = useState<number>(38);
  const [syneresisHeatingMinutes, setSyneresisHeatingMinutes] = useState<number>(20);
  const [syneresisStirMinutes, setSyneresisStirMinutes] = useState<number>(25);
  const [syneresisDrainPh, setSyneresisDrainPh] = useState<number>(6.40);

  // --- BOTANICAL EXTRACTION & VEG CRISPNESS ENGINE ---
  const [selectedBotanical, setSelectedBotanical] = useState<BotanicalSourceId>('OAK_LEAF');
  const [botanicalGrams, setBotanicalGrams] = useState<number>(3);
  const [garlicGramsInput, setGarlicGramsInput] = useState<number>(15);
  const [garlicPrepInput, setGarlicPrepInput] = useState<GarlicPrepMethod>('BRUISED_CRUSHED');

  // --- PASTEURIZATION UNITS (PU) & THERMAL STABILIZATION ---
  const [puCategory, setPuCategory] = useState<PasteurizationTargetCategory>('KOMBUCHA_STABILIZATION');
  const [puWaterBathTempC, setPuWaterBathTempC] = useState<number>(65);
  const [puHoldMinutes, setPuHoldMinutes] = useState<number>(15);
  const [puBottleVolumeMl, setPuBottleVolumeMl] = useState<number>(500);

  // --- VINEGAR STANDARDIZATION & SURFACE AERATION ---
  const [vinRawAcidity, setVinRawAcidity] = useState<number>(7.2);
  const [vinRawVolumeL, setVinRawVolumeL] = useState<number>(5.0);
  const [vinTargetAcidity, setVinTargetAcidity] = useState<number>(5.0);
  const [vinVesselDiameterCm, setVinVesselDiameterCm] = useState<number>(24);
  const [vinInitialAbv, setVinInitialAbv] = useState<number>(6.5);

  // --- BRINE DENSITOMETRY & HYDROMETER TEMP COMPENSATION ---
  const [brineDensityUnit, setBrineDensityUnit] = useState<'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY'>('PERCENT_WT');
  const [brineMeasuredValue, setBrineMeasuredValue] = useState<number>(20.0);
  const [brineSampleTempC, setBrineSampleTempC] = useState<number>(12.0);
  const [brineTargetProfile, setBrineTargetProfile] = useState<BrineTargetProfileKey>('HARD_CHEESE_HEAVY');
  const [brineVolumeLitersInput, setBrineVolumeLitersInput] = useState<number>(10.0);

  // --- KOJI, SHIO KOJI & AMAZAKE ENZYMATIC HYDROLYSIS ---
  const [kojiMode, setKojiMode] = useState<'SHIO_KOJI' | 'AMAZAKE' | 'MISO'>('SHIO_KOJI');
  const [kojiMassGrams, setKojiMassGrams] = useState<number>(200);
  const [kojiState, setKojiState] = useState<KojiMoistureState>('DRIED');
  const [kojiSalinityTarget, setKojiSalinityTarget] = useState<number>(11.5);
  const [kojiTempC, setKojiTempC] = useState<number>(22.0);
  const [amazakeCookedRiceGrams, setAmazakeCookedRiceGrams] = useState<number>(200);
  const [amazakeTempC, setAmazakeTempC] = useState<number>(58.0);
  const [misoTypeInput, setMisoTypeInput] = useState<'SHIRO_MISO' | 'AKAMISO'>('SHIRO_MISO');
  const [misoSoyGrams, setMisoSoyGrams] = useState<number>(500);

  // --- KEFIR GRAINS & TIBICOS KINETICS (1F/2F) ---
  const [kefirMedium, setKefirMedium] = useState<KefirMediumType>('MILK_KEFIR');
  const [kefirLiquidVolumeMl, setKefirLiquidVolumeMl] = useState<number>(1000);
  const [kefirGrainWeightGrams, setKefirGrainWeightGrams] = useState<number>(35);
  const [kefir2FDurationHours, setKefir2FDurationHours] = useState<number>(18);
  const [kefir2FFlavor, setKefir2FFlavor] = useState<'CITRUS_PEEL' | 'BERRIES' | 'VANILLA_CHAI' | 'NONE'>('CITRUS_PEEL');

  // --- NUKAZUKE RICE BRAN BED (NUKADOKO) ---
  const [nukadokoTab, setNukadokoTab] = useState<'SETUP' | 'MAINTENANCE' | 'VEG_TIME'>('SETUP');
  const [nukaBranGrams, setNukaBranGrams] = useState<number>(1000);
  const [nukaBedMassGrams, setNukaBedMassGrams] = useState<number>(2000);
  const [nukaSalinityPct, setNukaSalinityPct] = useState<number>(12.0);
  const [nukaMoistureStatus, setNukaMoistureStatus] = useState<'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY'>('OPTIMAL_SAND');
  const [nukaSelectedVeg, setNukaSelectedVeg] = useState<NukazukeVegType>('CUCUMBER');

  // --- TEMPEH MYCELIAL FERMENTATION KINETICS ---
  const [tempehLegumeType, setTempehLegumeType] = useState<LegumeType>('SOYBEAN');
  const [tempehDryGrams, setTempehDryGrams] = useState<number>(500);
  const [tempehHours, setTempehHours] = useState<number>(16);
  const [tempehCoreTempC, setTempehCoreTempC] = useState<number>(33.0);
  const [tempehVinegarMl, setTempehVinegarMl] = useState<number>(15);

  // --- TRADITIONAL POLISH MEAD (MIODOSYTNIK) ---
  const [meadGrade, setMeadGrade] = useState<PolishMeadGrade>('TROJNIAK');
  const [meadTargetVolumeL, setMeadTargetVolumeL] = useState<number>(15.0);
  const [meadPrepType, setMeadPrepType] = useState<MeadPreparationType>('NIESYCONY');

  // --- BLACK GARLIC & MAILLARD AGING ---
  const [bgRawGrams, setBgRawGrams] = useState<number>(500);
  const [bgCurrentDay, setBgCurrentDay] = useState<number>(18);
  const [bgChamberTempC, setBgChamberTempC] = useState<number>(68.0);
  const [bgChamberRhPct, setBgChamberRhPct] = useState<number>(75);

  // --- GINGER BUG & WILD SODA CARBONATION ---
  const [gbStarterDays, setGbStarterDays] = useState<number>(5);
  const [gbDaysSinceFeed, setGbDaysSinceFeed] = useState<number>(1);
  const [gbHasBubbles, setGbHasBubbles] = useState<boolean>(true);
  const [gbBatchVolumeL, setGbBatchVolumeL] = useState<number>(2.0);
  const [gbHoursInBottle, setGbHoursInBottle] = useState<number>(24);
  const [gbBottleType, setGbBottleType] = useState<GingerBottleType>('SWING_TOP_HEAVY_GLASS');

  // Active Flocculation Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const toggleKeepAwake = (val: boolean) => {
    setIsKeepAwake(val);
    if (val) {
      enableProcessKeepAwake();
    } else {
      disableProcessKeepAwake();
    }
    triggerHapticFeedback();
  };

  const handleStartTimer = () => {
    triggerHapticFeedback();
    setIsTimerRunning(true);
    setTimerSeconds(0);
    if (!isKeepAwake) {
      toggleKeepAwake(true);
    }
  };

  const handleStopTimer = () => {
    triggerHapticFeedback();
    setIsTimerRunning(false);
    playTimerCompletionAlert();
    setFlocSecInput(timerSeconds);
  };

  const handleSelectRecipe = (recipe: CanonicalRecipe) => {
    triggerHapticFeedback();
    setSelectedRecipeId(recipe.id);
    if (recipe.category === 'CHEESE') {
      setMilkLiters(10);
      setCraftMode('cheese');
      setSchedulerProcess('CHEESE_HARD_GOUDA');
    } else if (recipe.category === 'VEG_FERMENT') {
      setVegGrams(1000);
      setWaterGrams(1000);
      setCraftMode('veg');
      setSchedulerProcess('KIMCHI_TRADITIONAL');
    } else {
      setKombuchaWaterLiters(3);
      setCraftMode('beverage');
      setSchedulerProcess('KOMBUCHA_1F');
    }
  };

  const handleCopyShareLink = async (recipe: CanonicalRecipe) => {
    triggerHapticFeedback();
    const uri = encodeRecipeToShareUri(recipe);
    await Clipboard.setStringAsync(uri);
    Alert.alert(
      t('Receptura Skopiowana!'),
      `${recipe.name}\n${t('Link offline (ferment://) ze sprawdzoną sumą kontrolną skopiowano do schowka.')}`
    );
  };

  const handleImportRecipeFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (!text || !text.includes('ferment://recipe?data=')) {
        Alert.alert(
          t('Brak Receptury'),
          t('W schowku nie znaleziono prawidłowego linku receptury ferment://')
        );
        return;
      }
      triggerHapticFeedback();
      const decoded = decodeRecipeFromShareUri(text);
      setSelectedRecipeId(decoded.id);
      Alert.alert(
        t('Wczytano Recepturę!'),
        `${decoded.name} (${decoded.code})\n${t('Pomyślnie zweryfikowano sumę kontrolną integralności.')}`
      );
    } catch (err: any) {
      Alert.alert(t('Błąd Importu'), err.message || t('Nieprawidłowe dane receptury.'));
    }
  };

  // Calculations
  const rennetCalc = calculateRennetDose(milkLiters, 40, 200);
  const cacl2Calc = calculateCacl2Dose(milkLiters, 'STORE_MICROFILTERED');
  const flocCalc = calculateFlocculationCutTime(flocSecInput, flocMultiplier);
  const pressCalc = calculatePressPressure(pressWeightKg, moldDiamCm, leverRatio);
  const brineCalc = calculateBrineComposition(brineWaterLiters, brineSalinityPct);
  const cookingRampCalc = calculateCurdCookingMinTime(cookStartTemp, cookEndTemp, cookDurationMin);

  const totalSalinityCalc = calculateTotalBatchSalinity(vegGrams, waterGrams, targetSalinity);
  const botulinumSafety = verifyBotulinumSafety(measuredPh, fermentHours);
  const kimchiPrep = calculateKimchiPrep(cabbageGrams);

  const kombucha1F = calculateKombucha1F(kombuchaWaterLiters);
  const kombucha2F = calculateKombucha2FPressure(residualSugar, daysIn2F);
  const vinegarCalc = calculateVinegarConversion(vinegarBrix);

  const sweetWheyLiters = Math.max(1, milkLiters * 0.9);
  const ricottaCalc = calculateRicottaRecovery(sweetWheyLiters, wheyMilkBoostLiters);
  const wheyDrinkCalc = calculateWheyIsotonicDrink(sweetWheyLiters);
  const brineBoostCalc = calculateSaltToBoostBrine(brineWaterLiters, currentBrineSalinity, targetBrineSalinity);

  const targetDateForSchedule = (() => {
    const d = new Date();
    d.setHours(targetFinishHour, 0, 0, 0);
    return d;
  })();
  const reverseScheduleCalc = calculateReverseSchedule(schedulerProcess, targetDateForSchedule);

  const activeRecipes = getRecipesByCategory(
    craftMode === 'cheese' ? 'CHEESE' : craftMode === 'veg' ? 'VEG_FERMENT' : 'KOMBUCHA'
  );
  const selectedRecipe = CANONICAL_RECIPES.find((r) => r.id === selectedRecipeId);

  const moldFittingCalc = calculateCurdAndMoldFitting(milkLiters, 10.5, selectedMoldTemplateId);
  const dutchLeverCalc = calculateDutchLeverPress({
    armTotalLengthCm: armLengthCm,
    moldDistanceCm: moldDistCm,
    armSelfWeightKg: armWeightKg,
    weightHungKg: pressWeightKg,
    moldDiameterCm: moldDiamCm,
  });
  const pressingCascadeProg = generatePressingCascadeProgram(
    selectedRecipe ? selectedRecipe.name : 'Gouda Zagrodowa',
    moldFittingCalc.expectedYieldKg,
    moldDiamCm
  );
  const labKineticsCalc = evaluateLabFermentation(fermentHours, measuredPh);
  const vinegarTitrationCalc = calculateVinegarTitration(vinegarSampleMl, naohTiterMl);
  const brineAcidCalc = calculateBrineAcidification({
    brineWaterLiters,
    initialWaterPh: brineWaterPh,
    targetPh: targetBrinePh,
    lacticAcidConcentrationPct: lacticAcidConc,
    targetSalinityPct: brineSalinityPct,
  });
  const kombuchaBlendingCalc = calculateKombucha2FBlending({
    baseKombuchaLiters: kombuchaWaterLiters,
    juiceProfileId: selectedJuiceId,
    juiceVolumeMl,
    bottleType: kombuchaBottleType,
    temperatureC: kombuchaTemp,
    daysAtRoomTemp: daysIn2F,
  });

  const curdWashCalc = (() => {
    try {
      const safeDrained = Math.min(milkLiters * 0.8, Math.max(0.5, washWheyDrainedLiters));
      const safeTarget = Math.max(32, Math.min(washHotWaterTempC - 1, washTargetTempC));
      return calculateCurdWashWater({
        milkVolumeLiters: milkLiters,
        initialCurdTempC: 31,
        wheyDrainedLiters: safeDrained,
        hotWaterTempC: washHotWaterTempC,
        targetCookingTempC: safeTarget,
        cultureType: 'MESOPHILIC',
      });
    } catch {
      return null;
    }
  })();

  const cheddarSaltingCalc = (() => {
    try {
      return calculateCurdMillingSalting({
        curdWeightGrams: cheddarCurdGrams,
        targetSalinityPct: cheddarTargetSalinityPct,
        wheyRunoffLossPct: 33.0,
      });
    } catch {
      return null;
    }
  })();

  const wheelCoatingCalc = (() => {
    try {
      return calculateWheelCoating({
        diameterCm: moldDiamCm,
        heightCm: coatingWheelHeightCm,
        coatingType,
        layersCount: coatingLayers,
      });
    } catch {
      return null;
    }
  })();

  const q10VegCalc = (() => {
    try {
      return calculateFermentationQ10({
        cultureType: 'VEG_LAB',
        ambientTempC,
        nominalDaysAt20C: Math.max(1, Math.round(fermentHours / 24)),
      });
    } catch {
      return null;
    }
  })();

  const q10KombuchaCalc = (() => {
    try {
      return calculateFermentationQ10({
        cultureType: 'KOMBUCHA_SCOBY',
        ambientTempC,
        nominalDaysAt20C: 10,
      });
    } catch {
      return null;
    }
  })();

  const crockHeadspaceCalc = (() => {
    try {
      return calculateCrockHeadspace({
        jarCapacityMl,
        vegetableWeightGrams: vegGrams,
        brineWaterMl: waterGrams,
        weightMassGrams: stoneWeightGrams,
      });
    } catch {
      return null;
    }
  })();

  const refractometerAlcoholCalc = (() => {
    try {
      return analyzeRefractometerBrix({
        originalBrix: originalBrixInput,
        currentBrix: currentBrixInput,
        purpose: craftMode === 'beverage' ? 'KOMBUCHA' : 'VINEGAR_CIDER',
      });
    } catch {
      return null;
    }
  })();

  const cheeseCompositionCalc = (() => {
    try {
      return calculateCheeseComposition({
        moisturePercentage: cheeseMoisturePct,
        fatPercentage: cheeseFatPct,
        saltPercentage: cheeseSaltPct,
      });
    } catch {
      return null;
    }
  })();

  const brineDiffusionCalc = (() => {
    try {
      return calculateBrineDiffusion({
        wheelWeightKg: diffWheelWeightKg,
        diameterCm: diffDiameterCm,
        heightCm: diffHeightCm,
        brineSalinityPct: diffBrineSalinityPct,
        brineTempC: diffBrineTempC,
        targetSaltInCheesePct: diffTargetSaltPct,
      });
    } catch {
      return null;
    }
  })();

  const cultureHotelCalc = (() => {
    try {
      const now = Date.now();
      return analyzeCultureHotel({
        cultureType: hotelCultureType,
        lastFedTimestamp: now - hotelDaysSinceFed * 24 * 60 * 60 * 1000,
        nowTimestamp: now,
        currentTempC: ambientTempC,
        measuredPh: hotelPh,
        currentLiquidVolumeMl: hotelVolumeMl,
        yeastSludgeDepthCm: hotelSludgeDepthCm,
      });
    } catch {
      return null;
    }
  })();

  const continuousBrewPlan = (() => {
    try {
      return calculateContinuousBrewPlan({
        system: {
          id: 'cb_active',
          name: 'Continuous Brew Vessel',
          vesselCapacityLiters: cbVesselLiters,
          currentVolumeLiters: cbVesselLiters,
          ambientTempCelsius: cbTempCelsius,
          teaBaseType: cbTeaBase,
          totalCyclesCompleted: cbCyclesSincePurge + 4,
          cyclesSinceLastPurge: cbCyclesSincePurge,
        },
        drawVolumeLiters: cbDrawLiters,
        currentPreDrawPh: cbPreDrawPh,
      });
    } catch {
      return null;
    }
  })();

  const wheyLevainCalc = (() => {
    try {
      return calculateWheyLevainPlan({
        levainType: wheyLevainType,
        wheyVolumeMl,
        incubationTempCelsius: wheyIncubationTempC,
        currentPh: wheyCurrentPh,
        hoursIncubated: wheyHoursIncubated,
        generationPassage: wheyGeneration,
        targetMilkVolumeLiters: milkLiters,
      });
    } catch {
      return null;
    }
  })();

  const curdSyneresisCalc = (() => {
    try {
      return calculateCurdSyneresis({
        cheeseStyle: syneresisStyle,
        curdCutSizeMm: syneresisCutSizeMm,
        initialTempC: syneresisInitTempC,
        targetCookingTempC: syneresisTargetTempC,
        heatingDurationMinutes: syneresisHeatingMinutes,
        stirringDurationMinutes: syneresisStirMinutes,
        drainPh: syneresisDrainPh,
      });
    } catch {
      return null;
    }
  })();

  const vegCrispnessCalc = (() => {
    try {
      return calculateVegCrispnessProtection({
        vegetableWeightKg: Math.max(0.1, vegGrams / 1000),
        brineVolumeLiters: Math.max(0.1, waterGrams / 1000),
        botanicals: [{ botanicalId: selectedBotanical, weightGrams: botanicalGrams }],
        garlicGrams: garlicGramsInput,
        garlicPrep: garlicPrepInput,
      });
    } catch {
      return null;
    }
  })();

  const puPlanCalc = (() => {
    try {
      return calculatePasteurizationPlan({
        category: puCategory,
        waterBathTempCelsius: puWaterBathTempC,
        holdTimeMinutes: puHoldMinutes,
        bottleVolumeMl: puBottleVolumeMl,
      });
    } catch {
      return null;
    }
  })();

  const milkSpeciesCalc = (() => {
    try {
      return calculateMilkSpeciesKinetics({
        speciesId: milkType,
        milkVolumeLiters: milkLiters,
        baseRennetImcuPerLiter: 38,
        baseFlocculationMultiplier: flocMultiplier,
      });
    } catch {
      return null;
    }
  })();

  const vinegarStdCalc = (() => {
    try {
      return calculateVinegarStandardization({
        rawAcidityPct: vinRawAcidity,
        rawVolumeLiters: vinRawVolumeL,
        targetAcidityPct: vinTargetAcidity,
        dilutionLiquid: 'DISTILLED_WATER',
      });
    } catch {
      return null;
    }
  })();

  const vinegarStoichCalc = (() => {
    try {
      return calculateVinegarStoichiometry({
        initialAbvPct: vinInitialAbv,
        batchVolumeLiters: vinRawVolumeL,
      });
    } catch {
      return null;
    }
  })();

  const vinegarAerationCalc = (() => {
    try {
      return calculateVesselAeration({
        vesselType: 'WIDE_CROCK',
        surfaceDiameterCm: vinVesselDiameterCm,
        liquidVolumeLiters: vinRawVolumeL,
      });
    } catch {
      return null;
    }
  })();

  const brineDensitometryCalc = (() => {
    try {
      const targetPct = BRINE_TARGET_PROFILES[brineTargetProfile]?.targetPercentMin ?? 20.0;
      return calculateBrineDensitometry({
        measuredValue: brineMeasuredValue,
        unit: brineDensityUnit,
        sampleTempC: brineSampleTempC,
        calibrationTempC: 20.0,
        currentBrineVolumeLiters: brineVolumeLitersInput,
        targetPercent: targetPct,
      });
    } catch {
      return null;
    }
  })();

  const kojiCalc = (() => {
    try {
      if (kojiMode === 'SHIO_KOJI') {
        return {
          type: 'SHIO_KOJI' as const,
          data: calculateShioKoji({
            kojiMassGrams,
            kojiState,
            targetSalinityPercent: kojiSalinityTarget,
            fermentationTempC: kojiTempC,
          }),
        };
      } else if (kojiMode === 'AMAZAKE') {
        return {
          type: 'AMAZAKE' as const,
          data: calculateAmazake({
            kojiMassGrams,
            cookedRiceMassGrams: amazakeCookedRiceGrams,
            incubationTempC: amazakeTempC,
          }),
        };
      } else {
        return {
          type: 'MISO' as const,
          data: calculateMisoFormulation({
            cookedSoybeansGrams: misoSoyGrams,
            kojiGrams: kojiMassGrams,
            misoType: misoTypeInput,
          }),
        };
      }
    } catch {
      return null;
    }
  })();

  const kefir1FCalc = (() => {
    try {
      return calculateKefir1F({
        medium: kefirMedium,
        liquidVolumeMl: kefirLiquidVolumeMl,
        grainWeightGrams: kefirGrainWeightGrams,
        ambientTempC,
      });
    } catch {
      return null;
    }
  })();

  const kefir2FCalc = (() => {
    try {
      return calculateKefir2F({
        medium: kefirMedium,
        ripenedLiquidVolumeMl: kefirLiquidVolumeMl,
        flavorAddition: kefir2FFlavor,
        temperatureC: ambientTempC,
        durationHours: kefir2FDurationHours,
        isHermeticVessel: true,
      });
    } catch {
      return null;
    }
  })();

  const nukadokoCalc = (() => {
    try {
      if (nukadokoTab === 'SETUP') {
        return {
          tab: 'SETUP' as const,
          data: calculateNukadokoSetup({
            riceBranGrams: nukaBranGrams,
            targetSalinityPct: 13.0,
          }),
        };
      } else if (nukadokoTab === 'MAINTENANCE') {
        return {
          tab: 'MAINTENANCE' as const,
          data: calculateNukadokoMaintenance({
            bedTotalMassGrams: nukaBedMassGrams,
            currentEstimatedSalinityPct: nukaSalinityPct,
            moistureExcessStatus: nukaMoistureStatus,
            ambientTempC,
          }),
        };
      } else {
        return {
          tab: 'VEG_TIME' as const,
          data: getPicklingTimeForVeg(nukaSelectedVeg, ambientTempC),
        };
      }
    } catch {
      return null;
    }
  })();

  const tempehCalc = (() => {
    try {
      return calculateTempehKinetics({
        dryLegumeWeightGrams: tempehDryGrams,
        legumeType: tempehLegumeType,
        soakVinegarMl5Pct: tempehVinegarMl,
        incubationHours: tempehHours,
        currentCoreTempC: tempehCoreTempC,
        ambientTempC,
      });
    } catch {
      return null;
    }
  })();

  const meadCalc = (() => {
    try {
      return calculateMeadBatch({
        grade: meadGrade,
        targetTotalVolumeLiters: meadTargetVolumeL,
        preparation: meadPrepType,
        ambientTempC,
      });
    } catch {
      return null;
    }
  })();

  const blackGarlicCalc = (() => {
    try {
      return calculateBlackGarlic({
        rawWeightGrams: bgRawGrams,
        currentDay: bgCurrentDay,
        chamberTempC: bgChamberTempC,
        chamberRhPct: bgChamberRhPct,
      });
    } catch {
      return null;
    }
  })();

  const gingerBugStarterCalc = (() => {
    try {
      return evaluateGingerBugStarter({
        starterAgeDays: gbStarterDays,
        daysSinceLastFeed: gbDaysSinceFeed,
        temperatureC: ambientTempC,
        hasBubbles: gbHasBubbles,
        hasFizzOnStir: gbHasBubbles,
        isRefrigerated: false,
      });
    } catch {
      return null;
    }
  })();

  const gingerBeerBatchCalc = (() => {
    try {
      return calculateGingerBeerBatch({
        batchVolumeLiters: gbBatchVolumeL,
        targetSugarGramsPerLiter: 70,
        bottlingTempC: ambientTempC,
        hoursInBottle: gbHoursInBottle,
        bottleType: gbBottleType,
      });
    } catch {
      return null;
    }
  })();



  const handleSaveBatch = () => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const now = Date.now();
      const code = `BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      let name = '';
      let category: Batch['category'] = 'CHEESE';

      if (craftMode === 'cheese') {
        name = `${t('Ser')} ${milkType === 'COW' ? t('Krowi') : milkType === 'GOAT' ? t('Kozi') : t('Owcza')} (${milkLiters}L)`;
        category = 'CHEESE';
      } else if (craftMode === 'veg') {
        name = `${t('Kiszonka Warzywna')} (${((vegGrams + waterGrams) / 1000).toFixed(1)}kg)`;
        category = 'VEG_FERMENT';
      } else {
        name = `${t('Nastaw Kombuchy')} (${kombuchaWaterLiters}L)`;
        category = 'KOMBUCHA';
      }

      // Prepare recipe requirements for auto-depletion (BR-MAG-005)
      const requirements: RecipeRequirement[] = [];

      if (selectedRecipe) {
        const scale =
          craftMode === 'cheese'
            ? milkLiters
            : craftMode === 'veg'
            ? vegGrams / 1000
            : kombuchaWaterLiters;

        for (const ing of selectedRecipe.ingredients) {
          if (['MILK', 'RENNET', 'CULTURE', 'SALT', 'MINERAL', 'TEA', 'SUGAR'].includes(ing.category)) {
            requirements.push({
              name: ing.name,
              category: ing.category as any,
              quantity: Math.round(ing.quantityPerUnit * scale * 100) / 100,
              unit: ing.unit,
            });
          }
        }
      } else {
        if (craftMode === 'cheese') {
          requirements.push({
            name:
              milkType === 'COW'
                ? t('Mleko Krowie')
                : milkType === 'GOAT'
                ? t('Mleko Kozie')
                : milkType === 'SHEEP'
                ? t('Mleko Owcze')
                : t('Mleko Bawole'),
            category: 'MILK',
            quantity: milkLiters,
            unit: 'L',

          });
          if (rennetCalc.volumeMl > 0) {
            requirements.push({
              name: t('Podpuszczka'),
              category: 'RENNET',
              quantity: Math.round(rennetCalc.volumeMl * 100) / 100,
              unit: 'ml',
            });
          }
          if (cacl2Calc.solution33PercentMl > 0) {
            requirements.push({
              name: t('Chlorek Wapnia'),
              category: 'MINERAL',
              quantity: Math.round(cacl2Calc.solution33PercentMl * 100) / 100,
              unit: 'ml',
            });
          }
        } else if (craftMode === 'veg') {
          if (totalSalinityCalc.saltGrams > 0) {
            requirements.push({
              name: t('Sól Kamienna'),
              category: 'SALT',
              quantity: totalSalinityCalc.saltGrams,
              unit: 'g',
            });
          }
        } else {
          if (kombucha1F.sugarGrams > 0) {
            requirements.push({
              name: t('Cukier'),
              category: 'SUGAR',
              quantity: kombucha1F.sugarGrams,
              unit: 'g',
            });
          }
          if (kombucha1F.teaGrams > 0) {
            requirements.push({
              name: t('Herbata'),
              category: 'TEA',
              quantity: kombucha1F.teaGrams,
              unit: 'g',
            });
          }
        }
      }

      const currentPantry = await store.getPantryItems();
      const depletion = processPantryDepletion(requirements, currentPantry);

      if (depletion.items.length > 0) {
        await store.applyPantryDepletion(depletion.items);
      }

      await store.saveBatch({
        id: `batch_${now}`,
        batchNumber: code,
        category,
        styleName: name,
        createdAt: now,
        status: 'PREPARING',
        notes: t('Utworzono z kalkulatora głównego.'),
      });

      await createAutoBackup();

      let alertMsg = `${name}\n${t('Numer partii:')} ${code}`;
      if (depletion.items.length > 0) {
        const deductedList = depletion.items
          .filter((i) => i.deductedQty > 0)
          .map((i) => `• ${i.name}: -${i.deductedQty} ${i.unit}`)
          .join('\n');
        if (deductedList) {
          alertMsg += `\n\n📦 ${t('Odpisano ze spiżarni:')}\n${deductedList}`;
        }
      }
      if (depletion.deficitWarnings.length > 0) {
        alertMsg += `\n\n⚠️ ${t('Braki w spiżarni:')}\n${depletion.deficitWarnings.join('\n')}`;
      }

      Alert.alert(t('Partia Zapisana!'), alertMsg, [{ text: t('OK') }]);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>FERMENT</Text>
          <Text style={styles.appSubtitle}>{t('Serowarstwo & Flora Domowa')}</Text>
        </View>

        {/* 3-Mode Craft Switcher */}
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[styles.modeButton, craftMode === 'cheese' && styles.modeButtonActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCraftMode('cheese');
            }}
            accessibilityRole="tab"
          >
            <Text style={[styles.modeText, craftMode === 'cheese' && styles.modeTextActive]}>
              🧀 {t('Ser')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, craftMode === 'veg' && styles.modeButtonActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCraftMode('veg');
            }}
            accessibilityRole="tab"
          >
            <Text style={[styles.modeText, craftMode === 'veg' && styles.modeTextActive]}>
              🥬 {t('Kiszonki')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, craftMode === 'beverage' && styles.modeButtonActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCraftMode('beverage');
            }}
            accessibilityRole="tab"
          >
            <Text style={[styles.modeText, craftMode === 'beverage' && styles.modeTextActive]}>
              🫖 {t('Kombucha')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Keep-Awake Screen Toggle */}
        <View style={styles.keepAwakeRow}>
          <View>
            <Text style={styles.keepAwakeTitle}>{t('Tryb Mokrych Rąk (Ekran Zawsze Włączony)')}</Text>
            <Text style={styles.keepAwakeDesc}>{t('Zapobiega wygaszaniu ekranu podczas pracy przy garnku')}</Text>
          </View>
          <Switch
            value={isKeepAwake}
            onValueChange={toggleKeepAwake}
            trackColor={{ false: '#D6D3D1', true: '#B45309' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Canonical Recipes Presets & Offline Sharing */}
        <View style={styles.card}>
          <Text style={styles.cardMiniTitle}>📜 {t('Receptury Kanoniczne & Wymiana')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {activeRecipes.map((r) => {
              const isSel = r.id === selectedRecipeId;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.presetPill, isSel && styles.presetPillActive]}
                  onPress={() => handleSelectRecipe(r)}
                >
                  <Text style={[styles.presetPillText, isSel && styles.presetPillTextActive]}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedRecipe && (
            <View style={styles.recipeDetailCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.recipeDetailName}>{selectedRecipe.name}</Text>
                <Text style={styles.recipeDetailCode}>{selectedRecipe.code}</Text>
              </View>
              <Text style={styles.recipeDetailText}>
                • {t('Wydajność:')} <Text style={styles.boldText}>{selectedRecipe.targetYieldPer10Units}</Text>
              </Text>
              <Text style={styles.recipeDetailText}>
                • {t('Dojrzewanie:')} <Text style={styles.boldText}>{selectedRecipe.agingDays} dni</Text> ({selectedRecipe.optimalConditions.targetTempC})
              </Text>
              <Text style={styles.recipeDetailText}>
                • pH: <Text style={styles.boldText}>{selectedRecipe.optimalConditions.phMilestone}</Text>
              </Text>
              <Text style={styles.recipeKeyTechnique}>
                💡 {t('Kluczowa technika:')} {selectedRecipe.keyTechnique}
              </Text>
              <View style={styles.recipeBtnRow}>
                <TouchableOpacity
                  style={styles.recipeShareBtn}
                  onPress={() => handleCopyShareLink(selectedRecipe)}
                >
                  <Text style={styles.recipeShareBtnText}>🔗 {t('Kopiuj Link Receptury (ferment://)')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.recipeImportBtn}
                  onPress={handleImportRecipeFromClipboard}
                >
                  <Text style={styles.recipeImportBtnText}>📥 {t('Wczytaj ze Schowka')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Reverse Production Scheduler (Anti-Fatigue Guard) */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.rowBetween}
            onPress={() => {
              triggerHapticFeedback();
              setIsSchedulerOpen(!isSchedulerOpen);
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardMiniTitle}>
                ⏰ {t('Harmonogram Odwrócony Produkcji (Anti-Fatigue Guard)')}
              </Text>
              <Text style={styles.cardDescMini}>
                {t('Oblicz godzinę startu na podstawie planowanego zakończenia, aby nie przerywać snu.')}
              </Text>
            </View>
            <Text style={styles.accordionArrow}>{isSchedulerOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {isSchedulerOpen && (
            <View style={styles.schedulerBody}>
              <Text style={styles.inputLabelMini}>{t('Typ procesu:')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                {[
                  { id: 'CHEESE_HARD_GOUDA' as const, label: t('Gouda (15.5h)') },
                  { id: 'CHEESE_PASTA_FILATA_MOZZARELLA' as const, label: t('Mozzarella (4.5h)') },
                  { id: 'CHEESE_FRESH_KORYCIN' as const, label: t('Ser Koryciński') },
                  { id: 'KIMCHI_TRADITIONAL' as const, label: t('Kimchi (5h)') },
                  { id: 'KOMBUCHA_1F' as const, label: t('Kombucha 1F (1h)') },
                  { id: 'BEET_KVASS' as const, label: t('Zakwas Buraczany') },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.presetPill, schedulerProcess === item.id && styles.presetPillActive]}
                    onPress={() => {
                      triggerHapticFeedback();
                      setSchedulerProcess(item.id);
                    }}
                  >
                    <Text style={[styles.presetPillText, schedulerProcess === item.id && styles.presetPillTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.rowBetween}>
                <Text style={styles.inlineLabel}>{t('Docelowa godzina ukończenia:')}</Text>
                <View style={styles.miniStepper}>
                  <TouchableOpacity
                    style={styles.miniStepperBtn}
                    onPress={() => {
                      triggerHapticFeedback();
                      setTargetFinishHour((h) => (h === 0 ? 23 : h - 1));
                    }}
                  >
                    <Text style={styles.miniStepperBtnText}>-1h</Text>
                  </TouchableOpacity>
                  <Text style={styles.miniStepperVal}>{String(targetFinishHour).padStart(2, '0')}:00</Text>
                  <TouchableOpacity
                    style={styles.miniStepperBtn}
                    onPress={() => {
                      triggerHapticFeedback();
                      setTargetFinishHour((h) => (h === 23 ? 0 : h + 1));
                    }}
                  >
                    <Text style={styles.miniStepperBtnText}>+1h</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.schedulerResultBox}>
                <Text style={styles.schedulerStartLabel}>{t('Rozpocznij produkcję:')}</Text>
                <Text style={styles.schedulerStartHour}>
                  {String(reverseScheduleCalc.startTime.getHours()).padStart(2, '0')}:
                  {String(reverseScheduleCalc.startTime.getMinutes()).padStart(2, '0')}
                </Text>
                <Text style={styles.schedulerSubText}>
                  {t('Całkowity czas trwania:')} {Math.floor(reverseScheduleCalc.totalDurationMinutes / 60)}h{' '}
                  {reverseScheduleCalc.totalDurationMinutes % 60}m
                </Text>

                {reverseScheduleCalc.hasNightConflict && (
                  <View style={styles.nightWarningBox}>
                    <Text style={styles.nightWarningTitle}>
                      ⚠️ {t('Konflikt Nocny (23:00 – 06:00)!')}
                    </Text>
                    {reverseScheduleCalc.nightConflictWarnings.map((w, idx) => (
                      <Text key={idx} style={styles.nightWarningLine}>• {w}</Text>
                    ))}
                    <Text style={styles.nightWarningRec}>
                      💡 {reverseScheduleCalc.recommendation}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.inputLabelMini}>{t('Kroki procesu:')}</Text>
              {reverseScheduleCalc.steps.map((st, idx) => (
                <View key={idx} style={styles.timelineRow}>
                  <Text style={styles.timelineTime}>
                    {String(st.scheduledTime.getHours()).padStart(2, '0')}:{String(st.scheduledTime.getMinutes()).padStart(2, '0')}
                  </Text>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineName}>{st.name} ({st.durationMinutes} min)</Text>
                    <Text style={styles.timelineDesc}>{st.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* =================================================================== */}
        {/* MODE 1: CHEESEMAKING */}
        {/* =================================================================== */}
        {craftMode === 'cheese' && (
          <View style={styles.craftSection}>
            <Text style={styles.sectionHeader}>{t('Kalkulator Podpuszczki i Mleka')}</Text>

            {/* Stepper for Milk Volume */}
            <View style={styles.card}>
              <Text style={styles.inputLabel}>{t('Objętość mleka (L):')}</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setMilkLiters((p) => Math.max(1, p - 5));
                  }}
                >
                  <Text style={styles.stepperBtnText}>-5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setMilkLiters((p) => Math.max(1, p - 1));
                  }}
                >
                  <Text style={styles.stepperBtnText}>-1</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{milkLiters} L</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setMilkLiters((p) => p + 1);
                  }}
                >
                  <Text style={styles.stepperBtnText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setMilkLiters((p) => p + 5);
                  }}
                >
                  <Text style={styles.stepperBtnText}>+5</Text>
                </TouchableOpacity>
              </View>

              {/* Milk Type Selector */}
              <View style={styles.typeSelectorRow}>
                {(['COW', 'GOAT', 'SHEEP', 'BUFFALO'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typePill, milkType === type && styles.typePillActive]}
                    onPress={() => {
                      triggerHapticFeedback();
                      setMilkType(type);
                    }}
                  >
                    <Text style={[styles.typePillText, milkType === type && styles.typePillTextActive]}>
                      {type === 'COW'
                        ? t('Krowie')
                        : type === 'GOAT'
                        ? t('Kozie')
                        : type === 'SHEEP'
                        ? t('Owcze')
                        : t('Bawole')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </View>

            {/* Instant 1-Tap Result Cards */}
            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Dawka Podpuszczki')}</Text>
                <Text style={styles.resultValueHighlight}>{rennetCalc.volumeMl} ml</Text>
                <Text style={styles.resultSub}>{rennetCalc.imcuTotal} IMCU (200 IMCU/ml)</Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Chlorek Wapnia (CaCl2)')}</Text>
                <Text style={styles.resultValue}>{cacl2Calc.solution33PercentMl} ml</Text>
                <Text style={styles.resultSub}>{t('roztwór 33%')} ({cacl2Calc.dryGrams}g)</Text>
              </View>
            </View>

            {/* Pro Collapsible Accordion */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => {
                triggerHapticFeedback();
                setIsProExpanded(!isProExpanded);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.accordionTitle}>
                🔬 {t('Zaawansowane Parametry Biochemiczne')}
              </Text>
              <Text style={styles.accordionArrow}>{isProExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isProExpanded && (
              <View style={styles.proAccordionBody}>
                {/* 1. Flocculation Berridge Timer */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>
                    ⏱️ {t('Punkt Flokulacji (Czas Zestalania Berridge\'a)')}
                  </Text>
                  <Text style={styles.proCardDesc}>
                    {t('Mnożnik K')} = {flocMultiplier}x. {t('Czas flokulacji:')} {Math.floor(flocSecInput / 60)}m {flocSecInput % 60}s.
                  </Text>
                  <View style={styles.timerDisplay}>
                    <Text style={styles.timerDigits}>
                      {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                      {String(timerSeconds % 60).padStart(2, '0')}
                    </Text>
                    {isTimerRunning ? (
                      <TouchableOpacity style={styles.timerStopBtn} onPress={handleStopTimer}>
                        <Text style={styles.timerBtnText}>{t('Zatrzymaj (Flokulacja!)')}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.timerStartBtn} onPress={handleStartTimer}>
                        <Text style={styles.timerBtnText}>{t('Start Stopera')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.flocResultBox}>
                    <Text style={styles.flocResultText}>
                      {t('Całkowity czas do cięcia:')}{' '}
                      <Text style={styles.boldText}>{Math.floor(flocCalc.totalCoagulationSeconds / 60)} min</Text>
                    </Text>
                    <Text style={styles.flocResultSub}>
                      {t('Pozostało po zestaleniu:')} {Math.floor(flocCalc.remainingSecondsAfterFloc / 60)} min
                    </Text>
                  </View>
                </View>

                {/* Mold Sizing & Curd Geometry */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧀 {t('Dobór i Geometria Formy Serowarskiej')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Oczekiwany uzysk:')} <Text style={styles.boldText}>{moldFittingCalc.expectedYieldKg} kg</Text> {t('sera z')} {milkLiters}L {t('mleka')}
                  </Text>
                  <Text style={styles.inputLabelMini}>{t('Wybierz formę standardową:')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                    {STANDARD_MOLD_TEMPLATES.map((m) => {
                      const isSel = m.id === selectedMoldTemplateId;
                      return (
                        <TouchableOpacity
                          key={m.id}
                          style={[styles.presetPill, isSel && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setSelectedMoldTemplateId(m.id);
                            if (m.diameterCm) setMoldDiamCm(m.diameterCm);
                          }}
                        >
                          <Text style={[styles.presetPillText, isSel && styles.presetPillTextActive]}>
                            {m.name} ({m.targetCheeseWeightKg} kg)
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  <View style={styles.flocResultBox}>
                    <Text style={styles.flocResultText}>
                      • {t('Objętość świeżego skrzepu przed odciekiem:')}{' '}
                      <Text style={styles.boldText}>{moldFittingCalc.rawCurdVolumeLiters} L</Text>
                    </Text>
                    <Text style={styles.flocResultSub}>
                      • {t('Stopień wypełnienia formy:')} {moldFittingCalc.fillPercentage}% (
                      {moldFittingCalc.isMoldSufficient ? t('Pojemność wystarczająca') : t('Uwaga: Forma może być za mała!')})
                    </Text>
                  </View>
                </View>

                {/* 2. Pressing Pressure & Dutch Lever */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>⚖️ {t('Kalkulator Nacisku i Dźwigni Prasy')}</Text>
                  <View style={styles.typeSelectorRow}>
                    <TouchableOpacity
                      style={[styles.typePill, pressMechanism === 'DUTCH_LEVER' && styles.typePillActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setPressMechanism('DUTCH_LEVER');
                      }}
                    >
                      <Text style={[styles.typePillText, pressMechanism === 'DUTCH_LEVER' && styles.typePillTextActive]}>
                        {t('Dźwignia Holenderska (z tarą)')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.typePill, pressMechanism === 'DIRECT' && styles.typePillActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setPressMechanism('DIRECT');
                      }}
                    >
                      <Text style={[styles.typePillText, pressMechanism === 'DIRECT' && styles.typePillTextActive]}>
                        {t('Nacisk Bezpośredni / Śruba')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Średnica formy (cm):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(moldDiamCm)}
                      onChangeText={(v) => setMoldDiamCm(parseFloat(v) || 1)}
                    />
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Masa obciążnika (kg):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(pressWeightKg)}
                      onChangeText={(v) => setPressWeightKg(parseFloat(v) || 0)}
                    />
                  </View>

                  {pressMechanism === 'DUTCH_LEVER' && (
                    <View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.inlineLabel}>{t('Długość ramienia (cm):')}</Text>
                        <TextInput
                          style={styles.numInput}
                          keyboardType="numeric"
                          value={String(armLengthCm)}
                          onChangeText={(v) => setArmLengthCm(parseFloat(v) || 10)}
                        />
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.inlineLabel}>{t('Odległość formy od osi (cm):')}</Text>
                        <TextInput
                          style={styles.numInput}
                          keyboardType="numeric"
                          value={String(moldDistCm)}
                          onChangeText={(v) => setMoldDistCm(parseFloat(v) || 5)}
                        />
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.inlineLabel}>{t('Masa własna belki (tara kg):')}</Text>
                        <TextInput
                          style={styles.numInput}
                          keyboardType="numeric"
                          value={String(armWeightKg)}
                          onChangeText={(v) => setArmWeightKg(parseFloat(v) || 0)}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.pressureResultBox}>
                    <Text style={styles.pressureValue}>
                      {pressMechanism === 'DUTCH_LEVER'
                        ? `${dutchLeverCalc.pressureKgPerCm2.toFixed(3)} kg/cm² (${dutchLeverCalc.pressurePsi.toFixed(2)} PSI)`
                        : `${pressCalc.pressureKgCm2.toFixed(3)} kg/cm² (${pressCalc.pressurePsi.toFixed(2)} PSI)`}
                    </Text>
                    <Text style={styles.pressureSub}>
                      {pressMechanism === 'DUTCH_LEVER'
                        ? `${t('Przełożenie:')} ${dutchLeverCalc.mechanicalAdvantageRatio}x | ${t('Tara ramienia:')} +${dutchLeverCalc.tareForceFromArmKg} kg | ${t('Siła łączna:')} ${dutchLeverCalc.totalAppliedForceKg} kg`
                        : `${t('Powierzchnia:')} ${pressCalc.surfaceAreaCm2.toFixed(1)} cm² | ${t('Siła:')} ${pressCalc.appliedForceKg.toFixed(1)} kg`}
                    </Text>
                  </View>

                  {/* 3-Stage Cascaded Pressing Schedule */}
                  <TouchableOpacity
                    style={[styles.rowBetween, { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E7E5E4' }]}
                    onPress={() => {
                      triggerHapticFeedback();
                      setIsPressCascadeOpen(!isPressCascadeOpen);
                    }}
                  >
                    <Text style={styles.cardMiniTitle}>📋 {t('Kaskadowy Program Prasowania')}</Text>
                    <Text style={styles.accordionArrow}>{isPressCascadeOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {isPressCascadeOpen && (
                    <View style={{ marginTop: 6, gap: 8 }}>
                      {pressingCascadeProg.stages.map((st) => (
                        <View key={st.stageNumber} style={styles.timelineRow}>
                          <Text style={styles.timelineTime}>{st.durationMinutes} m</Text>
                          <View style={styles.timelineContent}>
                            <Text style={styles.timelineName}>{st.name} ({st.targetForceKg} kg / {st.recommendedPressurePsi} PSI)</Text>
                            <Text style={styles.timelineDesc}>{st.actionInstruction}</Text>
                          </View>
                        </View>
                      ))}
                      <View style={styles.warningAlert}>
                        <Text style={styles.warningAlertText}>⚠️ {pressingCascadeProg.rindEntrapmentWarning}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* 3. Saturated Brine Buffer & Acidification */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧂 {t('Zbuforowana Solanka Serowarska')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Woda:')} {brineWaterLiters}L | {t('Stężenie:')} {brineSalinityPct}% NaCl
                  </Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('pH wody kranowej:')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(brineWaterPh)}
                      onChangeText={(v) => setBrineWaterPh(parseFloat(v) || 7.0)}
                    />
                  </View>
                  <View style={styles.brineResultBox}>
                    <Text style={styles.brineText}>
                      • {t('Ilość soli:')} <Text style={styles.boldText}>{brineAcidCalc.saltKg} kg</Text>
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Wymagany CaCl2 (2 g/L):')} <Text style={styles.boldText}>{brineAcidCalc.cacl2GramsNeeded}g</Text> ({t('zapobiega mięknięciu skórki')})
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Kwas mlekowy 80% (do pH 5.20):')} <Text style={styles.boldText}>{brineAcidCalc.lacticAcidMlNeeded} {t('ml kwasu')}</Text>
                    </Text>
                    <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                      💡 {brineAcidCalc.equilibriumExplanation}
                    </Text>
                  </View>
                </View>

                {/* 4. Case Hardening Guard */}
                <View style={[styles.proCard, cookingRampCalc.isTooFast && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>🔥 {t('Dogrzewanie Gęstwy & Case Hardening Guard')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Z')} {cookStartTemp}°C {t('do')} {cookEndTemp}°C {t('w')} {cookDurationMin} min
                  </Text>
                  {cookingRampCalc.warning ? (
                    <View style={styles.warningAlert}>
                      <Text style={styles.warningAlertText}>⚠️ {cookingRampCalc.warning}</Text>
                    </View>
                  ) : (
                    <Text style={styles.safeStatusText}>
                      ✅ {t('Tempo dogrzewania bezpieczne (min. 2 min / 1°C).')}
                    </Text>
                  )}
                </View>

                {/* 5. Brine Salinity Boost & Regeneration */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧂 {t('Regeneracja i Wzmocnienie Stężenia Solanki')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Aktualne stężenie solanki (%):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(currentBrineSalinity)}
                      onChangeText={(v) => setCurrentBrineSalinity(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Docelowe stężenie solanki (%):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(targetBrineSalinity)}
                      onChangeText={(v) => setTargetBrineSalinity(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.brineResultBox}>
                    <Text style={styles.brineText}>
                      • {t('Sól do dosypania w celu przywrócenia stężenia:')}{' '}
                      <Text style={styles.boldText}>{brineBoostCalc.saltGramsToAdd} g</Text>
                    </Text>
                    <Text style={styles.recipeDetailText}>
                      {t('Rozpuść sól bezpośrednio w solance bez wylewania roztworu.')}
                    </Text>
                  </View>
                </View>

                {/* 6. Whey Zero-Waste & Ricotta Recovery */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>♻️ {t('Odzysk Serwatki & Zero-Waste (Ricotta / Izotonik)')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Dostępna serwatka słodka:')} <Text style={styles.boldText}>{sweetWheyLiters.toFixed(1)} L</Text>
                  </Text>
                  <Text style={styles.inputLabelMini}>{t('Dodatek pełnego mleka (wzmocnienie uzysku):')}</Text>
                  <View style={styles.typeSelectorRow}>
                    {[
                      { boost: 0, label: t('Brak (czysta serwatka)') },
                      { boost: 1, label: '+1 L (+10%)' },
                      { boost: 2, label: '+2 L (+20%)' },
                    ].map((opt) => (
                      <TouchableOpacity
                        key={opt.boost}
                        style={[styles.typePill, wheyMilkBoostLiters === opt.boost && styles.typePillActive]}
                        onPress={() => {
                          triggerHapticFeedback();
                          setWheyMilkBoostLiters(opt.boost);
                        }}
                      >
                        <Text style={[styles.typePillText, wheyMilkBoostLiters === opt.boost && styles.typePillTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.brineResultBox}>
                    <Text style={styles.brineText}>
                      • {t('Przewidywany uzysk słodkiej Ricotty:')}{' '}
                      <Text style={styles.boldText}>{ricottaCalc.estimatedRicottaYieldGrams} g</Text>
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Dawka kwasu cytrynowego:')}{' '}
                      <Text style={styles.boldText}>{ricottaCalc.citricAcidGramsNeeded} g</Text>
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Docelowa temperatura koagulacji serwatki:')}{' '}
                      <Text style={styles.boldText}>{ricottaCalc.heatingTargetTempC}°C</Text>
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Napój izotoniczny z serwatki (Rivella):')}{' '}
                      <Text style={styles.boldText}>{(wheyDrinkCalc.wheyLiters + wheyDrinkCalc.waterDilutionMl / 1000).toFixed(1)} L</Text> ({t('z dodatkiem soku jabłkowego 1:1')})
                    </Text>
                  </View>
                </View>

                {/* 7. Curd Washing / Delactosing */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>💧 {t('Przemywanie Ziarna & Odlaktozowanie (Gouda/Edam)')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Obniżanie kwasowości i regulacja elastyczności miąższu dolewaniem gorącej wody')}
                  </Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Odlana serwatka (L):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(washWheyDrainedLiters)}
                      onChangeText={(v) => setWashWheyDrainedLiters(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Temp. dolewanej wody (°C):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(washHotWaterTempC)}
                      onChangeText={(v) => setWashHotWaterTempC(parseFloat(v) || 50)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Docelowa temp. gęstwy (°C):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(washTargetTempC)}
                      onChangeText={(v) => setWashTargetTempC(parseFloat(v) || 36)}
                    />
                  </View>
                  {curdWashCalc && (
                    <View style={styles.brineResultBox}>
                      <Text style={styles.brineText}>
                        • {t('Wymagana objętość gorącej wody:')}{' '}
                        <Text style={styles.boldText}>{curdWashCalc.waterVolumeLiters} L</Text>
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Stopień odlaktozowania wsadu:')}{' '}
                        <Text style={styles.boldText}>{curdWashCalc.delactosingRatioPct}%</Text>
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {curdWashCalc.techniqueRecommendation}
                      </Text>
                      {curdWashCalc.warnings.map((w, idx) => (
                        <View key={idx} style={[styles.warningAlert, { marginTop: 6 }]}>
                          <Text style={styles.warningAlertText}>⚠️ {w}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* 8. Cheddar Curd Milling & Dry Salting */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧂 {t('Solenie Ziarna w Masie (Milling Cheddara)')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Precyzyjne solenie na sucho z uwzględnieniem odcieku pod prasą')}
                  </Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Masa pociętego ziarna (g):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(cheddarCurdGrams)}
                      onChangeText={(v) => setCheddarCurdGrams(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Docelowa słoność sera (%):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(cheddarTargetSalinityPct)}
                      onChangeText={(v) => setCheddarTargetSalinityPct(parseFloat(v) || 0)}
                    />
                  </View>
                  {cheddarSaltingCalc && (
                    <View style={styles.brineResultBox}>
                      <Text style={styles.brineText}>
                        • {t('Całkowita sól do zadania na sucho:')}{' '}
                        <Text style={styles.boldText}>{cheddarSaltingCalc.totalSaltToApplyGrams} g</Text> ({t('w tym sól związana:')} {cheddarSaltingCalc.netSaltRetainedGrams}g)
                      </Text>
                      <View style={{ marginTop: 6 }}>
                        {cheddarSaltingCalc.additions.map((step) => (
                          <Text key={step.step} style={[styles.brineText, { fontSize: 13, marginBottom: 3 }]}>
                            {step.step}. <Text style={styles.boldText}>{step.grams} g</Text> — {step.instruction}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* 9. Cheese Wheel Coating & Wax Calculator */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🛡️ {t('Woskowanie & Powłoki Ochronne Krążka')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Obliczanie powierzchni krążka i zapotrzebowania na wosk serowarski lub polioctan')}
                  </Text>
                  <View style={styles.typeSelectorRow}>
                    <TouchableOpacity
                      style={[styles.typePill, coatingType === 'CHEESE_WAX' && styles.typePillActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setCoatingType('CHEESE_WAX');
                      }}
                    >
                      <Text style={[styles.typePillText, coatingType === 'CHEESE_WAX' && styles.typePillTextActive]}>
                        🧀 {t('Wosk Serowarski')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.typePill, coatingType === 'POLYVINYL_BREATHABLE' && styles.typePillActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setCoatingType('POLYVINYL_BREATHABLE');
                      }}
                    >
                      <Text style={[styles.typePillText, coatingType === 'POLYVINYL_BREATHABLE' && styles.typePillTextActive]}>
                        🛡️ {t('Powłoka Polioctanowa')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Wysokość krążka (cm):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(coatingWheelHeightCm)}
                      onChangeText={(v) => setCoatingWheelHeightCm(parseFloat(v) || 1)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Liczba warstw (1-3):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(coatingLayers)}
                      onChangeText={(v) => setCoatingLayers(parseInt(v, 10) || 1)}
                    />
                  </View>
                  {wheelCoatingCalc && (
                    <View style={styles.brineResultBox}>
                      <Text style={styles.brineText}>
                        • {t('Powierzchnia całkowita krążka:')}{' '}
                        <Text style={styles.boldText}>{wheelCoatingCalc.surfaceAreaCm2} cm²</Text>
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Zapotrzebowanie na wosk/powłokę:')}{' '}
                        <Text style={styles.boldText}>{wheelCoatingCalc.totalGramsNeeded} g</Text> ({coatingLayers} {t('warstwy')})
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {wheelCoatingCalc.recommendation}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 10. Codex Alimentarius Composition & S/M Ratio */}
                {cheeseCompositionCalc && (
                  <View style={[styles.proCard, cheeseCompositionCalc.smStatus !== 'OPTIMAL_BALANCED' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>⚖️ {t('Skład Biochemiczny & Klasyfikacja Codex Alimentarius')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Standard CODEX STAN 283-1978: MFFB, FDM oraz relacja Salt-in-Moisture (S/M)')}
                    </Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Szacowana wilgotność sera (%):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cheeseMoisturePct)}
                        onChangeText={(v) => setCheeseMoisturePct(parseFloat(v) || 1)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Zawartość tłuszczu w serze (%):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cheeseFatPct)}
                        onChangeText={(v) => setCheeseFatPct(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Stężenie soli w serze (%):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cheeseSaltPct)}
                        onChangeText={(v) => setCheeseSaltPct(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.brineResultBox}>
                      <Text style={styles.brineText}>
                        • {t('MFFB (woda w masie beztłuszczowej):')}{' '}
                        <Text style={styles.boldText}>{cheeseCompositionCalc.mffbPercentage}%</Text> → {cheeseCompositionCalc.firmnessLabelPl}
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('FDM (tłuszcz w suchej masie):')}{' '}
                        <Text style={styles.boldText}>{cheeseCompositionCalc.fdmPercentage}%</Text> → {cheeseCompositionCalc.fatLabelPl}
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Salt-in-Moisture (S/M):')}{' '}
                        <Text style={styles.boldText}>{cheeseCompositionCalc.saltInMoisturePercentage}%</Text> ({cheeseCompositionCalc.dryMatterPercentage}% {t('suchej masy')})
                      </Text>
                      <Text style={[
                        styles.safetyStatus,
                        cheeseCompositionCalc.smStatus !== 'OPTIMAL_BALANCED' && styles.safetyDanger,
                        { marginTop: 4 }
                      ]}>
                        {cheeseCompositionCalc.smMessagePl}
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {cheeseCompositionCalc.recommendations[0]}
                      </Text>
                    </View>
                  </View>
                )}

                {/* 11. Salt Diffusion & Brining Penetration Time (Fick's Second Law) */}
                {brineDiffusionCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>🧂 {t('Dyfuzja Soli & Czas Solankowania (Prawo Ficka)')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Nieustalona dyfuzja NaCl w głąb kazeiny, penetracja rdzenia krążka i zapobieganie przesoleniu')}
                    </Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa krążka sera (kg):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(diffWheelWeightKg)}
                        onChangeText={(v) => setDiffWheelWeightKg(parseFloat(v) || 0.1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Średnica krążka (cm):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(diffDiameterCm)}
                        onChangeText={(v) => setDiffDiameterCm(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Wysokość krążka (cm):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(diffHeightCm)}
                        onChangeText={(v) => setDiffHeightCm(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Zasolenie solanki (%):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(diffBrineSalinityPct)}
                        onChangeText={(v) => setDiffBrineSalinityPct(parseFloat(v) || 10)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura solanki (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(diffBrineTempC)}
                        onChangeText={(v) => setDiffBrineTempC(parseFloat(v) || 5)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={styles.brineText}>
                        • {t('Optymalny czas w solance:')}{' '}
                        <Text style={styles.boldText}>{brineDiffusionCalc.recommendedBriningHours} {t('godz.')}</Text> ({brineDiffusionCalc.recommendedBriningDays} {t('dni')})
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Tempo pochłaniania soli:')}{' '}
                        <Text style={styles.boldText}>{brineDiffusionCalc.saltUptakeRateGramsPerHour} g/godz.</Text> ({t('łącznie:')} {brineDiffusionCalc.totalSaltAbsorbedGrams}g NaCl)
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Odległość do rdzenia geometrycznego:')}{' '}
                        <Text style={styles.boldText}>{brineDiffusionCalc.distanceToCoreCm} cm</Text> ({t('współczynnik dyfuzji:')} {brineDiffusionCalc.diffusionCoefficientCm2PerDay} cm²/d)
                      </Text>
                      <Text style={styles.brineText}>
                        • {t('Czas wyrównania stężenia w rdzeniu:')}{' '}
                        <Text style={styles.boldText}>{brineDiffusionCalc.daysToCoreEquilibration} {t('dni')}</Text>
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        ℹ️ {brineDiffusionCalc.equilibrationSchedulePl}
                      </Text>
                      {brineDiffusionCalc.safetyWarningsPl.map((warn, i) => (
                        <Text key={i} style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                          ⚠️ {warn}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* 12. Mother Whey Levain & Starter Propagation (Sierroinnesto) */}
                {wheyLevainCalc && (
                  <View style={[styles.proCard, wheyLevainCalc.passageHealth.status === 'DEGENERATION_RESET_REQUIRED' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🫙 {t('Zakwas Serwatkowy & Sierroinnesto (Mother Whey Levain)')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Tradycyjna propagacja kultur matecznych z nieposolonej serwatki z poprzedniego warzenia')}
                    </Text>

                    {/* Culture Type Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'THERMOPHILIC_ALPINE' as const, label: t('Sierroinnesto Alpejskie (43°C)') },
                        { id: 'MESOPHILIC_FARMHOUSE' as const, label: t('Mezofilne Zagrodowe (30°C)') },
                        { id: 'HIGHLAND_SMOKED' as const, label: t('Tatrzańskie / Oscypek (37°C)') },
                        { id: 'VEGETABLE_BRINE_BACKSLOP' as const, label: t('Zakwas z Kiszonki (20°C)') },
                      ].map((tItem) => (
                        <TouchableOpacity
                          key={tItem.id}
                          style={[styles.presetPill, wheyLevainType === tItem.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setWheyLevainType(tItem.id);
                            if (tItem.id === 'THERMOPHILIC_ALPINE') setWheyIncubationTempC(43);
                            else if (tItem.id === 'MESOPHILIC_FARMHOUSE') setWheyIncubationTempC(30);
                            else if (tItem.id === 'HIGHLAND_SMOKED') setWheyIncubationTempC(37);
                            else if (tItem.id === 'VEGETABLE_BRINE_BACKSLOP') setWheyIncubationTempC(20);
                          }}
                        >
                          <Text style={[styles.presetPillText, wheyLevainType === tItem.id && styles.presetPillTextActive]}>
                            {tItem.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość serwatki (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(wheyVolumeMl)}
                        onChangeText={(v) => setWheyVolumeMl(parseFloat(v) || 100)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura inkubacji (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(wheyIncubationTempC)}
                        onChangeText={(v) => setWheyIncubationTempC(parseFloat(v) || 20)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Czas inkubacji (godz.):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(wheyHoursIncubated)}
                        onChangeText={(v) => setWheyHoursIncubated(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Aktualne pH serwatki:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(wheyCurrentPh)}
                        onChangeText={(v) => setWheyCurrentPh(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Pasaż / Generacja starteru:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(wheyGeneration)}
                        onChangeText={(v) => setWheyGeneration(parseInt(v, 10) || 1)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        wheyLevainCalc.isReadyForInoculation ? { color: '#15803D' } : { color: '#B45309' }
                      ]}>
                        • {t('Stan starteru:')} {wheyLevainCalc.statusLabelPl}
                      </Text>

                      <Text style={styles.brineText}>
                        • {t('Doza do mleka:')} <Text style={styles.boldText}>{wheyLevainCalc.requiredStarterMl} ml</Text> ({wheyLevainCalc.inoculumRatioPct}% v/v {t('na')} {milkLiters}L {t('mleka')})
                      </Text>

                      <Text style={styles.brineText}>
                        • {t('Optymalny czas inkubacji:')} <Text style={styles.boldText}>{wheyLevainCalc.optimalIncubationHours} {t('godz.')}</Text> ({t('pozostało')} {wheyLevainCalc.remainingHours}h {t('do')} pH {wheyLevainCalc.targetPhMin}–{wheyLevainCalc.targetPhMax})
                      </Text>

                      {wheyLevainCalc.passageHealth.warning && (
                        <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                          ⚠️ {wheyLevainCalc.passageHealth.warning}
                        </Text>
                      )}

                      {wheyLevainCalc.craftRecommendations.map((rec, i) => (
                        <Text key={i} style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Curd Syneresis & Casein Shrinkage Kinetics */}
                {curdSyneresisCalc && (
                  <View style={[styles.proCard, curdSyneresisCalc.caseHardeningVerdict === 'CRITICAL_CASE_HARDENING' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🔪 {t('Kinetyka Synerezy Skrzepu & Dogrzewanie Ziarna')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Wielkość ziarna (3-35mm), tempo podgrzewania (°C/min), ochrona przed zasklepieniem kazeiny i pH ocieku')}
                    </Text>

                    {/* Cheese Style Horizontal Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'PARMESAN_GRANA' as const, label: t('Parmezan (3mm)') },
                        { id: 'ALPINE_GRUYERE' as const, label: t('Alpejski (4mm)') },
                        { id: 'GOUDA_EDAM' as const, label: t('Gouda (8mm)') },
                        { id: 'CHEDDAR' as const, label: t('Cheddar (10mm)') },
                        { id: 'CAMEMBERT_BRIE' as const, label: t('Camembert (18mm)') },
                        { id: 'FETA_FRESH' as const, label: t('Feta / Świeży (28mm)') },
                      ].map((st) => (
                        <TouchableOpacity
                          key={st.id}
                          style={[styles.presetPill, syneresisStyle === st.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setSyneresisStyle(st.id);
                            const cfg = CHEESE_SYNERESIS_CONFIGS[st.id];
                            setSyneresisCutSizeMm(cfg.recommendedCutSizeMm);
                            setSyneresisInitTempC(cfg.initialTempC);
                            setSyneresisTargetTempC(cfg.maxCookingTempC);
                          }}
                        >
                          <Text style={[styles.presetPillText, syneresisStyle === st.id && styles.presetPillTextActive]}>
                            {st.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Rozmiar cięcia ziarna (mm):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(syneresisCutSizeMm)}
                        onChangeText={(v) => setSyneresisCutSizeMm(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura docelowa (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(syneresisTargetTempC)}
                        onChangeText={(v) => setSyneresisTargetTempC(parseFloat(v) || 30)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Czas dogrzewania (min):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(syneresisHeatingMinutes)}
                        onChangeText={(v) => setSyneresisHeatingMinutes(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Czas mieszania po dogrzaniu (min):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(syneresisStirMinutes)}
                        onChangeText={(v) => setSyneresisStirMinutes(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('pH serwatki przy ocieku:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(syneresisDrainPh)}
                        onChangeText={(v) => setSyneresisDrainPh(parseFloat(v) || 6.4)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        curdSyneresisCalc.caseHardeningVerdict === 'CRITICAL_CASE_HARDENING'
                          ? styles.safetyDanger
                          : curdSyneresisCalc.caseHardeningVerdict === 'BORDERLINE_RATE'
                          ? { color: '#B45309' }
                          : { color: '#15803D' }
                      ]}>
                        • {t('Tempo dogrzewania:')} {curdSyneresisCalc.actualRampRateCPerMin}°C/min ({t('maks. zalecane:')} {curdSyneresisCalc.maxSafeRampRateCPerMin}°C/min)
                      </Text>
                      <Text style={styles.brineText}>
                        • {curdSyneresisCalc.caseHardeningAlertPl}
                      </Text>

                      <Text style={[styles.brineText, { marginTop: 6 }]}>
                        • {t('Wskaźnik synerezy:')} <Text style={styles.boldText}>{curdSyneresisCalc.syneresisIntensityIndex}/100</Text> | {t('Szacowana wilgotność:')} <Text style={styles.boldText}>{curdSyneresisCalc.expectedMoisturePct}%</Text> ({t('wzorzec:')} {curdSyneresisCalc.expectedMoistureMinPct}%–{curdSyneresisCalc.expectedMoistureMaxPct}%)
                      </Text>

                      <Text style={[
                        styles.safetyStatus,
                        curdSyneresisCalc.calciumRetentionVerdict !== 'OPTIMAL_MINERAL_BALANCE'
                          ? { color: '#B45309' }
                          : { color: '#15803D' },
                        { marginTop: 4 }
                      ]}>
                        • {t('Wapń koloidalny:')} {curdSyneresisCalc.calciumImpactMessagePl}
                      </Text>

                      {curdSyneresisCalc.recommendations.map((rec, i) => (
                        <Text key={i} style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Milk Species Coagulation & Proteolysis Profile */}
                {milkSpeciesCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🐑 {t('Morfologia Gatunkowa Mleka & Kazeina')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Frakcje kazeiny, średnica kuleczek tłuszczu, dynamika enzymatyczna i szacowany uzysk sera')}
                    </Text>

                    <View style={styles.brineResultBox}>
                      <Text style={[styles.safetyStatus, { color: '#15803D' }]}>
                        • {milkSpeciesCalc.species.namePl} ({milkSpeciesCalc.species.scientificName})
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Dominująca frakcja kazeiny:')} <Text style={styles.boldText}>{milkSpeciesCalc.species.dominantCaseinFraction}</Text>
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Średnia kuleczek tłuszczowych:')} <Text style={styles.boldText}>{milkSpeciesCalc.species.meanFatGlobuleDiameterMicrons} µm</Text> | {t('Wapń:')} {milkSpeciesCalc.species.calciumMgPer100g} mg/100g
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Doza podpuszczki:')} <Text style={styles.boldText}>{milkSpeciesCalc.recommendedRennetImcuPerLiter} IMCU/L</Text> ({milkSpeciesCalc.rennetVolumeMlLiquid200Imcu} ml {t('na')} {milkLiters}L)
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Skorygowany mnożnik flokulacji:')} <Text style={styles.boldText}>{milkSpeciesCalc.effectiveFlocculationMultiplier}x</Text>
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Oczekiwany uzysk sera:')} <Text style={styles.boldText}>{milkSpeciesCalc.expectedCheeseYieldKg} kg</Text> ({milkSpeciesCalc.yieldRatioPct}%)
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Odzysk Ricotty z serwatki:')} <Text style={styles.boldText}>~{milkSpeciesCalc.wheyProteinRecoveryPotentialGrams} g</Text>
                      </Text>

                      <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
                        💡 {milkSpeciesCalc.species.lipolysisAndFlavorNotesPl}
                      </Text>

                      {milkSpeciesCalc.craftNotes.map((note, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                          • {note}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Brine Densitometry & Hydrometer Temp Compensation */}
                {brineDensitometryCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      ⚖️ {t('Areometria Solanki & Kompensacja Temperatury')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Przeliczanie stopni Salometru (°Sal), Baumé (°Bé), gęstości SG i % NaCl z korektą termiczną')}
                    </Text>

                    {/* Unit selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Jednostka pomiaru:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'PERCENT_WT' as const, label: '% NaCl (wag.)' },
                        { id: 'SALOMETER' as const, label: '°Sal (Salometr)' },
                        { id: 'BAUME' as const, label: '°Bé (Baumé)' },
                        { id: 'SPECIFIC_GRAVITY' as const, label: 'SG (Gęstość)' },
                      ].map((u) => (
                        <TouchableOpacity
                          key={u.id}
                          style={[styles.presetPill, brineDensityUnit === u.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setBrineDensityUnit(u.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, brineDensityUnit === u.id && styles.presetPillTextActive]}>
                            {u.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Odczyt areometru:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(brineMeasuredValue)}
                        onChangeText={(v) => setBrineMeasuredValue(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura solanki (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(brineSampleTempC)}
                        onChangeText={(v) => setBrineSampleTempC(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość solanki (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(brineVolumeLitersInput)}
                        onChangeText={(v) => setBrineVolumeLitersInput(parseFloat(v) || 0)}
                      />
                    </View>

                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Profil docelowy solanki:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {(Object.keys(BRINE_TARGET_PROFILES) as BrineTargetProfileKey[]).map((pk) => {
                        const prof = BRINE_TARGET_PROFILES[pk];
                        return (
                          <TouchableOpacity
                            key={pk}
                            style={[styles.presetPill, brineTargetProfile === pk && styles.presetPillActive]}
                            onPress={() => {
                              triggerHapticFeedback();
                              setBrineTargetProfile(pk);
                            }}
                          >
                            <Text style={[styles.presetPillText, brineTargetProfile === pk && styles.presetPillTextActive]}>
                              {prof.namePl.split(' (')[0]}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        brineDensitometryCalc.status === 'SUPER_SATURATED' || brineDensitometryCalc.status === 'TOO_DILUTE'
                          ? styles.safetyDanger
                          : { color: '#15803D' }
                      ]}>
                        • {t('Status roztworu:')} {brineDensitometryCalc.status}
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Gęstość skorygowana SG:')} <Text style={styles.boldText}>{brineDensitometryCalc.temperatureCorrectedSg}</Text> ({t('Korekta termiczna SG:')} {brineDensitometryCalc.thermalOffsetSg > 0 ? `+${brineDensitometryCalc.thermalOffsetSg}` : brineDensitometryCalc.thermalOffsetSg})
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Zasolenie NaCl:')} <Text style={styles.boldText}>{brineDensitometryCalc.percentNacl}%</Text> | {t('Stopnie Salometru:')} <Text style={styles.boldText}>{brineDensitometryCalc.salometerDegrees}°Sal</Text> | {t('Stopnie Baumé:')} <Text style={styles.boldText}>{brineDensitometryCalc.baumeDegrees}°Bé</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('NaCl na litr solanki:')} <Text style={styles.boldText}>{brineDensitometryCalc.gramsNaclPerLiterBrine} g/L</Text> ({t('NaCl na litr wody:')} {brineDensitometryCalc.gramsNaclPerLiterWater} g/L)
                      </Text>

                      {brineDensitometryCalc.saltAdjustmentGrams !== undefined && (
                        <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
                          🧂 {t('Dodatek soli do celu:')} <Text style={styles.boldText}>{brineDensitometryCalc.saltAdjustmentGrams} g</Text> ({t('do')} {BRINE_TARGET_PROFILES[brineTargetProfile].namePl})
                        </Text>
                      )}

                      {brineDensitometryCalc.alertsPl.map((alert, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                          ⚠️ {alert}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* MODE 2: VEGETABLE FERMENT & KIMCHI */}
        {/* =================================================================== */}
        {craftMode === 'veg' && (
          <View style={styles.craftSection}>
            <Text style={styles.sectionHeader}>{t('Kalkulator Solanki Warzywnej')}</Text>

            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>{t('Masa warzyw (g):')}</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(vegGrams)}
                  onChangeText={(v) => setVegGrams(parseFloat(v) || 0)}
                />
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>{t('Masa wody do zalewy (g):')}</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(waterGrams)}
                  onChangeText={(v) => setWaterGrams(parseFloat(v) || 0)}
                />
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.inputLabel}>{t('Docelowe stężenie soli (%):')}</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="numeric"
                  value={String(targetSalinity)}
                  onChangeText={(v) => setTargetSalinity(parseFloat(v) || 0)}
                />
              </View>
            </View>

            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Wymagana Sól Całkowita')}</Text>
                <Text style={styles.resultValueHighlight}>{totalSalinityCalc.saltGrams} g</Text>
                <Text style={styles.resultSub}>
                  {totalSalinityCalc.effectiveSalinityPct}% {t('masy wsadu')}
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Masa Całkowita Wsadu')}</Text>
                <Text style={styles.resultValue}>{totalSalinityCalc.totalMassGrams} g</Text>
                <Text style={styles.resultSub}>{t('warzywa + woda')}</Text>
              </View>
            </View>

            {/* Pro Accordion for Veg */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => {
                triggerHapticFeedback();
                setIsProExpanded(!isProExpanded);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.accordionTitle}>
                🔬 {t('Zaawansowane Parametry Biochemiczne')}
              </Text>
              <Text style={styles.accordionArrow}>{isProExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isProExpanded && (
              <View style={styles.proAccordionBody}>
                {/* Botulinum Guard */}
                <View style={[styles.proCard, !botulinumSafety.isSafe && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>🛡️ {t('Botulinum Guard (Bariera pH 4.60)')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Zmierzone pH:')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(measuredPh)}
                      onChangeText={(v) => setMeasuredPh(parseFloat(v) || 7)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Godzin od nastawienia:')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(fermentHours)}
                      onChangeText={(v) => setFermentHours(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.safetyBox}>
                    <Text style={[styles.safetyStatus, !botulinumSafety.isSafe && styles.safetyDanger]}>
                      {botulinumSafety.message}
                    </Text>
                  </View>
                </View>

                {/* LAB Acidification Kinetics */}
                <View style={[styles.proCard, labKineticsCalc.status === 'CRITICAL_HAZARD' && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>📈 {t('Kinetyka Kwasowa LAB (Monitor Zakwaszania)')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Oczekiwane pH po')} {fermentHours}h: <Text style={styles.boldText}>{labKineticsCalc.expectedPh}</Text> | {t('Zmierzone:')} <Text style={styles.boldText}>{measuredPh}</Text>
                  </Text>
                  <View style={styles.safetyBox}>
                    <Text style={[styles.safetyStatus, labKineticsCalc.status !== 'OPTIMAL' && styles.safetyDanger]}>
                      {labKineticsCalc.message}
                    </Text>
                    <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                      💡 {labKineticsCalc.recommendedAction}
                    </Text>
                  </View>
                </View>

                {/* Kimchi Assistant */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🥬 {t('Asystent Tradycyjnego Kimchi')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Masa kapusty pekińskiej (g):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(cabbageGrams)}
                      onChangeText={(v) => setCabbageGrams(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.kimchiBox}>
                    <Text style={styles.kimchiLine}>
                      • {t('Sól na sucho do więdnięcia (8.5%):')}{' '}
                      <Text style={styles.boldText}>{kimchiPrep.saltWeightGrams} g</Text>
                    </Text>
                    <Text style={styles.kimchiLine}>
                      • {t('Mąka ryżowa do kleiku:')} {kimchiPrep.paste.riceFlourGrams} g
                    </Text>
                    <Text style={styles.kimchiLine}>
                      • {t('Woda do kleiku:')} {kimchiPrep.paste.waterForPorridgeMl} ml
                    </Text>
                    <Text style={styles.kimchiLine}>
                      • {t('Papryka Gochugaru:')} {kimchiPrep.paste.gochugaruGrams} g
                    </Text>
                    <Text style={styles.kimchiLine}>
                      • {t('Czosnek i Imbir:')} {kimchiPrep.paste.garlicGrams}g / {kimchiPrep.paste.gingerGrams}g
                    </Text>
                  </View>
                </View>

                {/* Q10 Fermentation Kinetics */}
                {q10VegCalc && (
                  <View style={[styles.proCard, (q10VegCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10VegCalc.zone === 'DORMANT_SLUGGISH') && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🌡️ {t('Kompensacja Temperatury Q10 (Kinetyka Pokojowa)')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(ambientTempC)}
                        onChangeText={(v) => setAmbientTempC(parseFloat(v) || 20)}
                      />
                    </View>
                    <View style={styles.safetyBox}>
                      <Text style={styles.proCardDesc}>
                        • {t('Mnożnik kinetyki:')} <Text style={styles.boldText}>{q10VegCalc.velocityMultiplier}x</Text> {t('(względem 20°C)')}
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Skorygowany czas fermentacji:')} <Text style={styles.boldText}>{q10VegCalc.adjustedDays} {t('dni')}</Text> ({q10VegCalc.adjustedHours} {t('godz.')})
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Szacowana bariera pH 4.60 po:')} <Text style={styles.boldText}>{q10VegCalc.botulinumSafeHourEstimated} {t('godz.')}</Text>
                      </Text>
                      <Text style={[styles.safetyStatus, (q10VegCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10VegCalc.zone === 'DORMANT_SLUGGISH') && styles.safetyDanger, { marginTop: 4 }]}>
                        {t('Strefa termiczna:')} {q10VegCalc.zoneLabel}
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {q10VegCalc.flavorProfileImpact}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Crock & Jar Headspace Guard */}
                {crockHeadspaceCalc && (
                  <View style={[styles.proCard, crockHeadspaceCalc.status !== 'OPTIMAL' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🏺 {t('Pojemność Słoja & Wolna Przestrzeń (Headspace Guard)')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Pojemność słoja (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(jarCapacityMl)}
                        onChangeText={(v) => setJarCapacityMl(parseFloat(v) || 1000)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa docisku (kamień/szkło g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(stoneWeightGrams)}
                        onChangeText={(v) => setStoneWeightGrams(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.safetyBox}>
                      <Text style={styles.proCardDesc}>
                        • {t('Objętość wsadu z dociskiem:')} <Text style={styles.boldText}>{crockHeadspaceCalc.totalSubstanceVolumeMl} ml</Text>
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Pozostała wolna przestrzeń:')} <Text style={styles.boldText}>{crockHeadspaceCalc.remainingHeadspaceMl} ml</Text> ({crockHeadspaceCalc.headspacePercentage}%)
                      </Text>
                      <Text style={[styles.safetyStatus, crockHeadspaceCalc.status !== 'OPTIMAL' && styles.safetyDanger, { marginTop: 4 }]}>
                        {crockHeadspaceCalc.summaryAlert}
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {crockHeadspaceCalc.recommendations[0]}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Botanical Extraction & Crispness Engine */}
                {vegCrispnessCalc && (
                  <View style={[styles.proCard, vegCrispnessCalc.crispnessVerdict === 'INADEQUATE_RISK_OF_MUSHY' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🌿 {t('Ekstrakcja Botaniczna & Ochrona Chrupkości')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Denaturacja pektynaz garbnikami roślinnymi (dąb, wiśnia, chrzan) i kinetyka allicyny')}
                    </Text>

                    {/* Botanical source pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'OAK_LEAF' as const, label: t('Liść dębu (45mg/g)') },
                        { id: 'SOUR_CHERRY_LEAF' as const, label: t('Liść wiśni (30mg/g)') },
                        { id: 'BLACKCURRANT_LEAF' as const, label: t('Porzeczka (25mg/g)') },
                        { id: 'HORSERADISH_ROOT' as const, label: t('Chrzan korzeń (12mg/g)') },
                        { id: 'HORSERADISH_LEAF' as const, label: t('Chrzan liść (15mg/g)') },
                        { id: 'BAY_LEAF' as const, label: t('Liść laurowy (20mg/g)') },
                        { id: 'GRAPE_LEAF' as const, label: t('Liść winorośli (35mg/g)') },
                        { id: 'BLACK_TEA_LEAF' as const, label: t('Czarna herbata (80mg/g)') },
                      ].map((bot) => (
                        <TouchableOpacity
                          key={bot.id}
                          style={[styles.presetPill, selectedBotanical === bot.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setSelectedBotanical(bot.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, selectedBotanical === bot.id && styles.presetPillTextActive]}>
                            {bot.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa dodatku botanicznego (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(botanicalGrams)}
                        onChangeText={(v) => setBotanicalGrams(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Czosnek do wsadu (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(garlicGramsInput)}
                        onChangeText={(v) => setGarlicGramsInput(parseFloat(v) || 0)}
                      />
                    </View>

                    {/* Garlic prep selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Przygotowanie czosnku:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'BRUISED_CRUSHED' as const, label: t('Zgnieciony nożem (85% allicyny)') },
                        { id: 'WHOLE_PEELED' as const, label: t('Całe ząbki obrane (20% allicyny)') },
                        { id: 'MINCED_GRATED' as const, label: t('Posiekany / starty (100% allicyny)') },
                        { id: 'WHOLE_UNPEELED' as const, label: t('W łupinie (5% allicyny)') },
                      ].map((gp) => (
                        <TouchableOpacity
                          key={gp.id}
                          style={[styles.presetPill, garlicPrepInput === gp.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setGarlicPrepInput(gp.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, garlicPrepInput === gp.id && styles.presetPillTextActive]}>
                            {gp.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.safetyBox}>
                      <Text style={[
                        styles.safetyStatus,
                        vegCrispnessCalc.crispnessVerdict === 'INADEQUATE_RISK_OF_MUSHY'
                          ? styles.safetyDanger
                          : vegCrispnessCalc.crispnessVerdict === 'OVER_ASTRINGENT'
                          ? { color: '#B45309' }
                          : { color: '#15803D' }
                      ]}>
                        • {t('Ochrona chrupkości:')} {vegCrispnessCalc.verdictLabelPl} ({vegCrispnessCalc.crispnessProtectionRatioPct}%)
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Podaż garbników:')} <Text style={styles.boldText}>{vegCrispnessCalc.totalTanninsMg} mg</Text> ({vegCrispnessCalc.tanninConcentrationMgPerKg} mg/kg {t('wsadu')}, {t('cel')} &ge; {vegCrispnessCalc.targetMinimumTanninsMg} mg)
                      </Text>

                      {vegCrispnessCalc.garlicAllicinOutputMg !== undefined && (
                        <Text style={styles.proCardDesc}>
                          • {t('Aktywna allicyna:')} <Text style={styles.boldText}>{vegCrispnessCalc.garlicAllicinOutputMg} mg</Text>
                        </Text>
                      )}

                      {vegCrispnessCalc.garlicImpactNotes && (
                        <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          🧄 {vegCrispnessCalc.garlicImpactNotes}
                        </Text>
                      )}

                      {vegCrispnessCalc.dominantActiveCompounds.length > 0 && (
                        <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          🔬 {t('Związki aktywne:')} {vegCrispnessCalc.dominantActiveCompounds.join(', ')}
                        </Text>
                      )}

                      {vegCrispnessCalc.craftRecommendations.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Koji, Shio Koji & Amazake Hydrolysis */}
                {kojiCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🌾 {t('Enzymatyka Koji, Shio Koji & Amazake')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Hydroliza enzymatyczna Aspergillus oryzae: shio koji, amazake i miso z kontrolą okna termicznego')}
                    </Text>

                    {/* Mode selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Tryb Koji:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'SHIO_KOJI' as const, label: t('Shio Koji (Słona pasta)') },
                        { id: 'AMAZAKE' as const, label: t('Amazake (Słodki napój ryżowy)') },
                        { id: 'MISO' as const, label: t('Miso (Pasta sojowa)') },
                      ].map((km) => (
                        <TouchableOpacity
                          key={km.id}
                          style={[styles.presetPill, kojiMode === km.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setKojiMode(km.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, kojiMode === km.id && styles.presetPillTextActive]}>
                            {km.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa koji (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(kojiMassGrams)}
                        onChangeText={(v) => setKojiMassGrams(parseFloat(v) || 0)}
                      />
                    </View>

                    {kojiMode === 'SHIO_KOJI' && (
                      <>
                        <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Stan koji:')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                          {[
                            { id: 'DRIED' as const, label: t('Suszone') },
                            { id: 'FRESH' as const, label: t('Świeże (nama)') },
                          ].map((ks) => (
                            <TouchableOpacity
                              key={ks.id}
                              style={[styles.presetPill, kojiState === ks.id && styles.presetPillActive]}
                              onPress={() => {
                                triggerHapticFeedback();
                                setKojiState(ks.id);
                              }}
                            >
                              <Text style={[styles.presetPillText, kojiState === ks.id && styles.presetPillTextActive]}>
                                {ks.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Temperatura hydrolizy (°C):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(kojiTempC)}
                            onChangeText={(v) => setKojiTempC(parseFloat(v) || 0)}
                          />
                        </View>

                        {kojiCalc.type === 'SHIO_KOJI' && (
                          <View style={styles.brineResultBox}>
                            <Text style={styles.proCardDesc}>
                              • {t('Wymagana woda:')} <Text style={styles.boldText}>{kojiCalc.data.waterGrams} g</Text> | {t('Wymagana sól:')} <Text style={styles.boldText}>{kojiCalc.data.saltGrams} g</Text>
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Masa całkowita wsadu:')} <Text style={styles.boldText}>{kojiCalc.data.totalBatchMassGrams} g</Text> ({t('Zasolenie efektywne:')} <Text style={styles.boldText}>{kojiCalc.data.effectiveSalinityPercent}%</Text>)
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Czas fermentacji:')} <Text style={styles.boldText}>{kojiCalc.data.fermentationDurationHours}h</Text> ({kojiCalc.data.fermentationMethodPl})
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Codzienne mieszanie:')} <Text style={styles.boldText}>{kojiCalc.data.dailyStirringRequired ? t('Wymagane (napowietrzanie)') : t('Zbędne (sous-vide)')}</Text>
                            </Text>
                            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                              🥩 {t('Dawka do kruszenia mięsa:')} <Text style={styles.boldText}>~{kojiCalc.data.meatTenderizingDoseGrams(500)} g</Text> {t('na 500g mięsa / tofu (10%)')}
                            </Text>
                            {kojiCalc.data.alertsPl.map((alert, idx) => (
                              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                                ⚠️ {alert}
                              </Text>
                            ))}
                          </View>
                        )}
                      </>
                    )}

                    {kojiMode === 'AMAZAKE' && (
                      <>
                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Masa ugotowanego ryżu (g):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(amazakeCookedRiceGrams)}
                            onChangeText={(v) => setAmazakeCookedRiceGrams(parseFloat(v) || 0)}
                          />
                        </View>

                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Temperatura hydrolizy (°C):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(amazakeTempC)}
                            onChangeText={(v) => setAmazakeTempC(parseFloat(v) || 0)}
                          />
                        </View>

                        {kojiCalc.type === 'AMAZAKE' && (
                          <View style={styles.brineResultBox}>
                            <Text style={[
                              styles.safetyStatus,
                              kojiCalc.data.safetyStatus !== 'OPTIMAL' ? styles.safetyDanger : { color: '#15803D' }
                            ]}>
                              • {t('Status bezpieczeństwa termicznego:')} {kojiCalc.data.safetyStatus}
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Wymagana woda:')} <Text style={styles.boldText}>{kojiCalc.data.waterGrams} g</Text> ({t('Masa całkowita wsadu:')} {kojiCalc.data.totalMassGrams} g)
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Szacowana słodycz Brix:')} <Text style={styles.boldText}>{kojiCalc.data.expectedBrixSweetness} °Bx</Text> | {t('Czas fermentacji:')} {kojiCalc.data.incubationHours}h
                            </Text>
                            {kojiCalc.data.alertsPl.map((alert, idx) => (
                              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                                ⚠️ {alert}
                              </Text>
                            ))}
                            {kojiCalc.data.instructionsPl.map((inst, idx) => (
                              <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                                💡 {inst}
                              </Text>
                            ))}
                          </View>
                        )}
                      </>
                    )}

                    {kojiMode === 'MISO' && (
                      <>
                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Masa gotowanej soi (g):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(misoSoyGrams)}
                            onChangeText={(v) => setMisoSoyGrams(parseFloat(v) || 0)}
                          />
                        </View>

                        <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ miso:')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                          {[
                            { id: 'SHIRO_MISO' as const, label: t('Shiro Miso (Jasne, słodkie, 1.5 mies.)') },
                            { id: 'AKAMISO' as const, label: t('Akamiso (Ciemne, wytrawne, 12 mies.)') },
                          ].map((mt) => (
                            <TouchableOpacity
                              key={mt.id}
                              style={[styles.presetPill, misoTypeInput === mt.id && styles.presetPillActive]}
                              onPress={() => {
                                triggerHapticFeedback();
                                setMisoTypeInput(mt.id);
                              }}
                            >
                              <Text style={[styles.presetPillText, misoTypeInput === mt.id && styles.presetPillTextActive]}>
                                {mt.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        {kojiCalc.type === 'MISO' && (
                          <View style={styles.brineResultBox}>
                            <Text style={[
                              styles.safetyStatus,
                              kojiCalc.data.safetyStatus !== 'SAFE' ? styles.safetyDanger : { color: '#15803D' }
                            ]}>
                              • {t('Status bezpieczeństwa:')} {kojiCalc.data.safetyStatus}
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Wymagana sól:')} <Text style={styles.boldText}>{kojiCalc.data.saltGrams} g</Text> ({t('Zasolenie efektywne:')} <Text style={styles.boldText}>{kojiCalc.data.saltPercent}%</Text>)
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Zalecany ciężar docisku:')} <Text style={styles.boldText}>{kojiCalc.data.pressWeightGrams} g</Text> (otoshiguta + kamień)
                            </Text>
                            <Text style={styles.proCardDesc}>
                              • {t('Czas fermentacji:')} <Text style={styles.boldText}>~{kojiCalc.data.fermentationDurationMonths} {t('miesięcy')}</Text>
                            </Text>
                            {kojiCalc.data.alertsPl.map((alert, idx) => (
                              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                                ⚠️ {alert}
                              </Text>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                )}

                {/* Japońskie Łoże Otrębowe Nukadoko */}
                {nukadokoCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🥢 {t('Japońskie Łoże Otrębowe Nukadoko')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Tradycyjna fermentacja w prażonych otrębach ryżowych: zakładanie (sutezuke), aeracja Te-ire i czasy kiszenia')}
                    </Text>

                    {/* Sub-tab selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Krok procesu:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'SETUP' as const, label: t('Zakładanie łoża (Sutezuke)') },
                        { id: 'MAINTENANCE' as const, label: t('Pielęgnacja & Aeracja (Te-ire)') },
                        { id: 'VEG_TIME' as const, label: t('Czas kiszenia warzyw') },
                      ].map((tb) => (
                        <TouchableOpacity
                          key={tb.id}
                          style={[styles.presetPill, nukadokoTab === tb.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setNukadokoTab(tb.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, nukadokoTab === tb.id && styles.presetPillTextActive]}>
                            {tb.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {nukadokoTab === 'SETUP' && nukadokoCalc.tab === 'SETUP' && (
                      <>
                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Masa prażonych otrębów (g):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(nukaBranGrams)}
                            onChangeText={(v) => setNukaBranGrams(parseFloat(v) || 0)}
                          />
                        </View>

                        <View style={styles.brineResultBox}>
                          <Text style={styles.proCardDesc}>
                            • {t('Wymagana woda:')} <Text style={styles.boldText}>{nukadokoCalc.data.waterGrams} g</Text> | {t('Wymagana sól kamienna:')} <Text style={styles.boldText}>{nukadokoCalc.data.saltGrams} g</Text>
                          </Text>
                          <Text style={styles.proCardDesc}>
                            • {t('Masa całkowita łoża:')} <Text style={styles.boldText}>{nukadokoCalc.data.totalBedMassGrams} g</Text> ({t('Docelowe zasolenie:')} <Text style={styles.boldText}>{nukadokoCalc.data.effectiveSalinityPct}%</Text>)
                          </Text>
                          <Text style={styles.proCardDesc}>
                            • {t('Aromatyki:')} Konbu {nukadokoCalc.data.aromaticsGrams.konbuGrams}g, Chili {nukadokoCalc.data.aromaticsGrams.driedChiliGrams}g, Imbir {nukadokoCalc.data.aromaticsGrams.gingerSlicesGrams}g
                          </Text>
                          <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                            ⏳ {t('Czas rozruchu ze sutezuke:')} <Text style={styles.boldText}>{nukadokoCalc.data.sutezukeDurationDays} {t('dni')}</Text>
                          </Text>
                          {nukadokoCalc.data.sutezukeInstructionsPl.map((inst, idx) => (
                            <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                              💡 {inst}
                            </Text>
                          ))}
                        </View>
                      </>
                    )}

                    {nukadokoTab === 'MAINTENANCE' && nukadokoCalc.tab === 'MAINTENANCE' && (
                      <>
                        <View style={styles.rowBetween}>
                          <Text style={styles.inlineLabel}>{t('Aktualna masa łoża (g):')}</Text>
                          <TextInput
                            style={styles.numInput}
                            keyboardType="numeric"
                            value={String(nukaBedMassGrams)}
                            onChangeText={(v) => setNukaBedMassGrams(parseFloat(v) || 0)}
                          />
                        </View>

                        <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Wilgotność łoża:')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                          {[
                            { id: 'OPTIMAL_SAND' as const, label: t('Optymalna (wilgotny piasek)') },
                            { id: 'SLIGHTLY_WET' as const, label: t('Lekko mokre') },
                            { id: 'VERY_SLUSHY' as const, label: t('Bardzo błotniste (kałuża)') },
                          ].map((ms) => (
                            <TouchableOpacity
                              key={ms.id}
                              style={[styles.presetPill, nukaMoistureStatus === ms.id && styles.presetPillActive]}
                              onPress={() => {
                                triggerHapticFeedback();
                                setNukaMoistureStatus(ms.id);
                              }}
                            >
                              <Text style={[styles.presetPillText, nukaMoistureStatus === ms.id && styles.presetPillTextActive]}>
                                {ms.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        <View style={styles.brineResultBox}>
                          <Text style={[
                            styles.safetyStatus,
                            nukadokoCalc.data.status !== 'HEALTHY' ? styles.safetyDanger : { color: '#15803D' }
                          ]}>
                            • {t('Status zdrowotny łoża:')} {nukadokoCalc.data.status}
                          </Text>
                          <Text style={styles.proCardDesc}>
                            • {t('Częstotliwość mieszania ręką (Te-ire):')} <Text style={styles.boldText}>{nukadokoCalc.data.teireFrequencyDaily}x {t('dziennie')}</Text>
                          </Text>
                          <Text style={[styles.recipeDetailText, { marginTop: 2 }]}>
                            ✋ {nukadokoCalc.data.teireInstructionPl}
                          </Text>
                          {(nukadokoCalc.data.dryBranTopupGrams > 0 || nukadokoCalc.data.saltTopupGrams > 0) && (
                            <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
                              • {t('Wymagane dosypanie:')} <Text style={styles.boldText}>{nukadokoCalc.data.dryBranTopupGrams} g</Text> {t('prażonych otrębów')} + <Text style={styles.boldText}>{nukadokoCalc.data.saltTopupGrams} g</Text> {t('soli')}
                            </Text>
                          )}
                          {nukadokoCalc.data.alertsPl.map((alert, idx) => (
                            <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                              ⚠️ {alert}
                            </Text>
                          ))}
                        </View>
                      </>
                    )}

                    {nukadokoTab === 'VEG_TIME' && nukadokoCalc.tab === 'VEG_TIME' && (
                      <>
                        <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Wybierz warzywo do zakopania:')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                          {[
                            { id: 'CUCUMBER' as const, label: t('Ogórek') },
                            { id: 'EGGPLANT' as const, label: t('Bakłażan') },
                            { id: 'DAIKON_RADISH' as const, label: t('Daikon (Rzodkiew)') },
                            { id: 'CARROT' as const, label: t('Marchew') },
                            { id: 'AVOCADO_BOILED_EGG' as const, label: t('Awokado / Jajko') },
                          ].map((vg) => (
                            <TouchableOpacity
                              key={vg.id}
                              style={[styles.presetPill, nukaSelectedVeg === vg.id && styles.presetPillActive]}
                              onPress={() => {
                                triggerHapticFeedback();
                                setNukaSelectedVeg(vg.id);
                              }}
                            >
                              <Text style={[styles.presetPillText, nukaSelectedVeg === vg.id && styles.presetPillTextActive]}>
                                {vg.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        <View style={styles.brineResultBox}>
                          <Text style={styles.proCardDesc}>
                            • {t('Czas kiszenia:')} <Text style={styles.boldText}>{nukadokoCalc.data.durationHoursMin}–{nukadokoCalc.data.durationHoursMax} {t('godzin')}</Text> ({t('w temp.')} {ambientTempC}°C)
                          </Text>
                          <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                            🥒 {nukadokoCalc.data.prepAdvicePl}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                )}

                {/* Kinetyka Mycelium Tempehu & Ochrona Przed Przegrzaniem */}
                {tempehCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🌱 {t('Kinetyka Mycelium Tempehu (Rhizopus)')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Stało-fazowa fermentacja strączków: bariera kwasowa Bacillus cereus, faza egzotermiczna i perforacja torebek')}
                    </Text>

                    {/* Legume type selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Rodzaj nasion strączkowych:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'SOYBEAN' as const, label: t('Soja (Tradycyjna)') },
                        { id: 'CHICKPEA' as const, label: t('Ciecierzyca') },
                        { id: 'LENTIL' as const, label: t('Soczewica') },
                        { id: 'BLACK_BEAN' as const, label: t('Czarna fasola') },
                      ].map((lg) => (
                        <TouchableOpacity
                          key={lg.id}
                          style={[styles.presetPill, tempehLegumeType === lg.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setTempehLegumeType(lg.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, tempehLegumeType === lg.id && styles.presetPillTextActive]}>
                            {lg.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa suchych nasion (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(tempehDryGrams)}
                        onChangeText={(v) => setTempehDryGrams(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Ocet 5% do moczenia/gotowania (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(tempehVinegarMl)}
                        onChangeText={(v) => setTempehVinegarMl(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Godzina inkubacji (0-36h):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(tempehHours)}
                        onChangeText={(v) => setTempehHours(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura rdzenia wsadu (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(tempehCoreTempC)}
                        onChangeText={(v) => setTempehCoreTempC(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        !tempehCalc.isSoakAcidSafe || tempehCalc.thermalStatus === 'CRITICAL_DEATH'
                          ? styles.safetyDanger
                          : tempehCalc.thermalStatus === 'OVERHEATING_WARNING'
                          ? { color: '#B45309' }
                          : { color: '#15803D' }
                      ]}>
                        • {tempehCalc.phaseLabelPl}
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Masa po namoczeniu/ugotowaniu:')} <Text style={styles.boldText}>{tempehCalc.hydratedLegumeWeightGrams} g</Text> | {t('Doza startera Ragi:')} <Text style={styles.boldText}>{tempehCalc.recommendedStarterGrams} g</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Nastawa inkubatora:')} <Text style={styles.boldText}>{tempehCalc.recommendedIncubatorTempC}°C</Text> {tempehCalc.isExothermicBurstActive ? `(${t('Wyłącz/obniż grzanie!')})` : ''}
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Otwory perforacyjne w torebce:')} <Text style={styles.boldText}>~{tempehCalc.perforationHolesRecommended}</Text> ({t('nakłucia igłą co 1.5 cm')})
                      </Text>

                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        🛡️ {t('Bariera kwasowa:')} {tempehCalc.isSoakAcidSafe ? t('Zabezpieczona (pH < 4.80)') : t('ZAGROŻONA (dolej octu!)')} ({t('min. zalecane:')} {tempehCalc.soakVinegarRecommendedMl} ml)
                      </Text>

                      {tempehCalc.alertsPl.map((alert, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                          ⚠️ {alert}
                        </Text>
                      ))}

                      {tempehCalc.recommendationsPl.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Czarny Czosnek (Black Garlic & Reakcja Maillarda) */}
                {blackGarlicCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🧄 {t('Czarny Czosnek (Black Garlic & Wolna Reakcja Maillarda)')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Termiczna transformacja allicyny w przeciwutleniającą S-allilocysteinę (SAC) i karmelizację melanoidynową bez pirolizy')}
                    </Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa surowego czosnku (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(bgRawGrams)}
                        onChangeText={(v) => setBgRawGrams(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Aktualny dzień cyklu (1-50):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(bgCurrentDay)}
                        onChangeText={(v) => setBgCurrentDay(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura komory (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(bgChamberTempC)}
                        onChangeText={(v) => setBgChamberTempC(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Wilgotność względna (% RH):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(bgChamberRhPct)}
                        onChangeText={(v) => setBgChamberRhPct(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        blackGarlicCalc.alerts.some((a) => a.severity === 'CRITICAL')
                          ? styles.safetyDanger
                          : blackGarlicCalc.alerts.some((a) => a.severity === 'WARNING')
                          ? { color: '#B45309' }
                          : { color: '#15803D' }
                      ]}>
                        • {blackGarlicCalc.currentPhase.namePl} ({blackGarlicCalc.progressPct}%)
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Szacowana waga:')} <Text style={styles.boldText}>{blackGarlicCalc.estimatedCurrentWeightGrams} g</Text> ({t('ubytek wody:')} {blackGarlicCalc.estimatedWeightLossPct}%) | {t('Pozostało:')} <Text style={styles.boldText}>{blackGarlicCalc.remainingDays} {t('dni')}</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Przyrost antyoksydantu SAC:')} <Text style={styles.boldText}>{blackGarlicCalc.sacMultiplier}x</Text> | {t('Cukry fruktozowe:')} <Text style={styles.boldText}>~{blackGarlicCalc.expectedSugarBrix}°Bx</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Tekstura ząbków:')} <Text style={styles.boldText}>{blackGarlicCalc.textureEstimatePl}</Text>
                      </Text>

                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        🍯 {t('Profil bukietu:')} {blackGarlicCalc.flavorProfilePl}
                      </Text>

                      {blackGarlicCalc.alerts.map((al, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: al.severity === 'CRITICAL' ? '#B91C1C' : '#B45309', marginTop: 4 }}>
                          ⚠️ {al.messagePl}
                        </Text>
                      ))}

                      {blackGarlicCalc.recommendedActionsPl.map((act, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
                          💡 {act}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* MODE 3: KOMBUCHA & LIVING VINEGARS */}
        {/* =================================================================== */}
        {craftMode === 'beverage' && (
          <View style={styles.craftSection}>
            <Text style={styles.sectionHeader}>{t('Kalkulator Kombuchy 1F')}</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>{t('Objętość nastawu wody (L):')}</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setKombuchaWaterLiters((p) => Math.max(1, p - 1));
                  }}
                >
                  <Text style={styles.stepperBtnText}>-1</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{kombuchaWaterLiters} L</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => {
                    triggerHapticFeedback();
                    setKombuchaWaterLiters((p) => p + 1);
                  }}
                >
                  <Text style={styles.stepperBtnText}>+1</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Herbata')}</Text>
                <Text style={styles.resultValueHighlight}>{kombucha1F.teaGrams} g</Text>
                <Text style={styles.resultSub}>7 g / litr</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Cukier')}</Text>
                <Text style={styles.resultValueHighlight}>{kombucha1F.sugarGrams} g</Text>
                <Text style={styles.resultSub}>65 g / litr</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{t('Starter SCOBY')}</Text>
                <Text style={styles.resultValue}>{kombucha1F.starterLiquidMl} ml</Text>
                <Text style={styles.resultSub}>12% {t('objętości')}</Text>
              </View>
            </View>

            {/* Pro Accordion for Beverage */}
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => {
                triggerHapticFeedback();
                setIsProExpanded(!isProExpanded);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.accordionTitle}>
                🔬 {t('Zaawansowane Parametry Biochemiczne')}
              </Text>
              <Text style={styles.accordionArrow}>{isProExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isProExpanded && (
              <View style={styles.proAccordionBody}>
                {/* 2F Pressure & Fruit Blending Guard */}
                <View style={[styles.proCard, kombuchaBlendingCalc.isExplosionHazard && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>🍾 {t('Mieszanie Owocowe 2F & Dynamika Wysycenia')}</Text>

                  <Text style={styles.inputLabelMini}>{t('Profil soku / owocu:')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                    {[
                      { id: 'apple', label: t('Sok jabłkowy (11.5°Bx)') },
                      { id: 'raspberry', label: t('Sok malinowy (7.5°Bx)') },
                      { id: 'ginger_lemon', label: t('Imbir-cytryna z miodem (14°Bx)') },
                      { id: 'pomegranate', label: t('Sok z granatu (13°Bx)') },
                      { id: 'pure_cane_sugar', label: t('Syrop cukrowy (65°Bx)') },
                    ].map((j) => (
                      <TouchableOpacity
                        key={j.id}
                        style={[styles.presetPill, selectedJuiceId === j.id && styles.presetPillActive]}
                        onPress={() => {
                          triggerHapticFeedback();
                          setSelectedJuiceId(j.id);
                        }}
                      >
                        <Text style={[styles.presetPillText, selectedJuiceId === j.id && styles.presetPillTextActive]}>
                          {j.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Ilość soku owocowego (ml):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(juiceVolumeMl)}
                      onChangeText={(v) => setJuiceVolumeMl(parseFloat(v) || 0)}
                    />
                  </View>

                  <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ butelki:')}</Text>
                  <View style={{ gap: 4, marginVertical: 4 }}>
                    {[
                      { id: 'HEAVY_SWING_TOP_AMBER' as const, label: t('Butelka z pałąkiem (Swing-Top) [max 4.5 vol]') },
                      { id: 'CROWN_CAP_BEER_BOTTLE' as const, label: t('Kapslowana butelka do piwa [max 3.5 vol]') },
                      { id: 'CHAMPAGNE_HEAVY' as const, label: t('Ciężka butelka do szampana [max 6.0 vol]') },
                      { id: 'SQUARE_DECORATIVE' as const, label: t('Kwadratowa ozdobna [ZAGROŻENIE EKSPLOZJĄ! max 1.8 vol]') },
                    ].map((bType) => (
                      <TouchableOpacity
                        key={bType.id}
                        style={[
                          styles.presetPill,
                          kombuchaBottleType === bType.id && styles.presetPillActive,
                          bType.id === 'SQUARE_DECORATIVE' && { borderColor: '#EF4444' }
                        ]}
                        onPress={() => {
                          triggerHapticFeedback();
                          setKombuchaBottleType(bType.id);
                        }}
                      >
                        <Text style={[
                          styles.presetPillText,
                          kombuchaBottleType === bType.id && styles.presetPillTextActive,
                          bType.id === 'SQUARE_DECORATIVE' && { color: '#DC2626', fontWeight: '700' }
                        ]}>
                          {bType.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Dni w temp. pokojowej:')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(daysIn2F)}
                      onChangeText={(v) => setDaysIn2F(parseFloat(v) || 0)}
                    />
                  </View>

                  <View style={styles.pressureBox}>
                    <Text style={styles.pressureVolText}>
                      {t('Szacowane CO2:')} <Text style={styles.boldText}>{kombuchaBlendingCalc.estimatedCo2Volumes} vol</Text> | {t('Szacowane ciśnienie (20°C):')} <Text style={styles.boldText}>{kombuchaBlendingCalc.estimatedPressureBarAt20C} bar</Text>
                    </Text>
                    <Text style={styles.recipeDetailText}>
                      • {t('Cukier dodany z owoców:')} <Text style={styles.boldText}>{kombuchaBlendingCalc.sugarAddedGrams} g</Text> ({kombuchaBlendingCalc.effectiveSugarGramsPerLiter} g/L)
                    </Text>
                    <Text style={[
                      styles.riskAlertText,
                      kombuchaBlendingCalc.isExplosionHazard && styles.riskAlertDanger
                    ]}>
                      {kombuchaBlendingCalc.warningMessage}
                    </Text>
                    <Text style={[styles.recipeDetailText, { marginTop: 4, color: '#15803D' }]}>
                      💡 {kombuchaBlendingCalc.refrigerationAdvice}
                    </Text>
                  </View>
                </View>

                {/* Living Vinegar */}
                <View style={[styles.proCard, vinegarCalc.isAbvTooHigh && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>🍎 {t('Żywe Octy Owocowe & ABV Inhibition Guard')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Początkowe °Brix owoców:')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(vinegarBrix)}
                      onChangeText={(v) => setVinegarBrix(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.vinegarBox}>
                    <Text style={styles.vinegarText}>
                      • {t('Przewidywany alkohol:')} <Text style={styles.boldText}>{vinegarCalc.estimatedAbvPct}% ABV</Text>
                    </Text>
                    <Text style={styles.vinegarText}>
                      • {t('Przewidywany kwas octowy:')}{' '}
                      <Text style={styles.boldText}>{vinegarCalc.expectedAceticAcidPct}%</Text>
                    </Text>
                    <Text style={[styles.vinegarAlert, vinegarCalc.isAbvTooHigh && styles.vinegarAlertDanger]}>
                      {vinegarCalc.message}
                    </Text>
                  </View>
                </View>

                {/* Titratable Acidity (TA) with 0.1M NaOH */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧪 {t('Miareczkowanie Kwasowości Octu (TA z NaOH 0.1M)')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Objętość próbki octu (ml):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(vinegarSampleMl)}
                      onChangeText={(v) => setVinegarSampleMl(parseFloat(v) || 1)}
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Zużyty 0.1M NaOH (ml do różu):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(naohTiterMl)}
                      onChangeText={(v) => setNaohTiterMl(parseFloat(v) || 0)}
                    />
                  </View>
                  <View style={styles.vinegarBox}>
                    <Text style={styles.vinegarText}>
                      • {t('Kwasowość całkowita:')}{' '}
                      <Text style={styles.boldText}>{vinegarTitrationCalc.aceticAcidPercentage}% {t('kwasu octowego')}</Text>
                    </Text>
                    <Text style={styles.vinegarText}>
                      • {t('Klasyfikacja:')} <Text style={styles.boldText}>{vinegarTitrationCalc.classification}</Text>
                    </Text>
                    <Text style={[styles.vinegarAlert, !vinegarTitrationCalc.isFoodGradeSafe && styles.vinegarAlertDanger]}>
                      {vinegarTitrationCalc.notes}
                    </Text>
                  </View>
                </View>

                {/* Q10 Kombucha Kinetics */}
                {q10KombuchaCalc && (
                  <View style={[styles.proCard, (q10KombuchaCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10KombuchaCalc.zone === 'DORMANT_SLUGGISH') && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🌡️ {t('Kompensacja Temperatury Q10 dla Kombuchy (Czas 1F)')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(ambientTempC)}
                        onChangeText={(v) => setAmbientTempC(parseFloat(v) || 20)}
                      />
                    </View>
                    <View style={styles.safetyBox}>
                      <Text style={styles.proCardDesc}>
                        • {t('Mnożnik kinetyki:')} <Text style={styles.boldText}>{q10KombuchaCalc.velocityMultiplier}x</Text> {t('(względem 20°C)')}
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Skorygowany czas 1F:')} <Text style={styles.boldText}>{q10KombuchaCalc.adjustedDays} {t('dni')}</Text> ({q10KombuchaCalc.adjustedHours} {t('godz.')})
                      </Text>
                      <Text style={[styles.safetyStatus, (q10KombuchaCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10KombuchaCalc.zone === 'DORMANT_SLUGGISH') && styles.safetyDanger, { marginTop: 4 }]}>
                        {t('Strefa termiczna:')} {q10KombuchaCalc.zoneLabel}
                      </Text>
                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {q10KombuchaCalc.flavorProfileImpact}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Optical Refractometer & Alcohol Engine */}
                {refractometerAlcoholCalc && (
                  <View style={[styles.proCard, !refractometerAlcoholCalc.isVinegarSafe && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🔍 {t('Korektor Refraktometru Optycznego (°Bx → SG → ABV)')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Początkowy odczyt (°Bx):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(originalBrixInput)}
                        onChangeText={(v) => setOriginalBrixInput(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Aktualny odczyt (°Bx):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(currentBrixInput)}
                        onChangeText={(v) => setCurrentBrixInput(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.safetyBox}>
                      <Text style={styles.proCardDesc}>
                        • {t('Skorygowana gęstość rzeczywista:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.correctedFinalSg} SG</Text> ({refractometerAlcoholCalc.realExtractPlato}°P)
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Zawartość alkoholu:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.abvPct}% ABV</Text>
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Klasyfikacja:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.classification}</Text>
                      </Text>
                      <Text style={[
                        styles.safetyStatus,
                        !refractometerAlcoholCalc.isVinegarSafe ? styles.safetyDanger : !refractometerAlcoholCalc.isNonAlcoholicKombucha ? { color: '#B45309' } : { color: '#15803D' },
                        { marginTop: 4 }
                      ]}>
                        {refractometerAlcoholCalc.recommendation}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Live Culture Hotel & Mother Colony Preservation */}
                {cultureHotelCalc && (
                  <View style={[styles.proCard, (cultureHotelCalc.healthStatus === 'STARVATION_RISK' || cultureHotelCalc.isMoldHazard) && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🏨 {t('Hotel SCOBY & Matecznik Kultur Żywych')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Zarządzanie rezerwą starterową, dokarmianiem i zabezpieczeniem przed pleśnią')}
                    </Text>

                    {/* Culture Type Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'KOMBUCHA_SCOBY_HOTEL' as const, label: t('Hotel SCOBY') },
                        { id: 'VINEGAR_MOTHER' as const, label: t('Matka Octowa') },
                        { id: 'MILK_KEFIR_GRAINS' as const, label: t('Kefir Mleczny') },
                        { id: 'WATER_KEFIR_TIBICOS' as const, label: t('Kefir Wodny (Tibicos)') },
                        { id: 'WHEY_STARTER_LEVAIN' as const, label: t('Serwatka Mateczna') },
                      ].map((cult) => (
                        <TouchableOpacity
                          key={cult.id}
                          style={[styles.presetPill, hotelCultureType === cult.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setHotelCultureType(cult.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, hotelCultureType === cult.id && styles.presetPillTextActive]}>
                            {cult.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Dni od ostatniego zasilenia:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(hotelDaysSinceFed)}
                        onChangeText={(v) => setHotelDaysSinceFed(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość płynu w słoiku (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(hotelVolumeMl)}
                        onChangeText={(v) => setHotelVolumeMl(parseFloat(v) || 100)}
                      />
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Osad drożdżowy na dnie (cm):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(hotelSludgeDepthCm)}
                        onChangeText={(v) => setHotelSludgeDepthCm(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.safetyBox}>
                      <Text style={[
                        styles.safetyStatus,
                        cultureHotelCalc.healthStatus === 'STARVATION_RISK' || cultureHotelCalc.isMoldHazard
                          ? styles.safetyDanger
                          : cultureHotelCalc.healthStatus === 'DUE_FOR_FEEDING'
                          ? { color: '#B45309' }
                          : { color: '#15803D' }
                      ]}>
                        • {t('Stan kolonii:')} {cultureHotelCalc.statusLabelPl}
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Planowane zasilenie:')} {cultureHotelCalc.feedingSchedule.feedLiquidVolumeMl} ml {t('płynu')} ({cultureHotelCalc.feedingSchedule.feedSugarGrams}g {t('cukru')})
                      </Text>
                      <Text style={styles.recipeDetailText}>
                        💡 {cultureHotelCalc.feedingSchedule.recommendedFeedingRatioPl}
                      </Text>
                      {cultureHotelCalc.actionAlerts.map((alert, idx) => (
                        <Text key={idx} style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                          ⚠️ {alert}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Kombucha Continuous Brew Siphon & Maintenance Engine */}
                {continuousBrewPlan && (
                  <View style={[styles.proCard, !continuousBrewPlan.isDrawSafe && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🚰 {t('Kombucha Ciągła (Continuous Brew Siphon & Serwis)')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Model tygodniowego rozlewu z kranika (20-30%), uzupełnianie słodkiej herbaty i osad')}
                    </Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Pojemność słoja (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cbVesselLiters)}
                        onChangeText={(v) => setCbVesselLiters(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Pobór do rozlewu (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cbDrawLiters)}
                        onChangeText={(v) => setCbDrawLiters(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cbTempCelsius)}
                        onChangeText={(v) => setCbTempCelsius(parseFloat(v) || 20)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Cykle od czyszczenia dna:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cbCyclesSincePurge)}
                        onChangeText={(v) => setCbCyclesSincePurge(parseInt(v, 10) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Aktualne pH przed zlaniem:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(cbPreDrawPh)}
                        onChangeText={(v) => setCbPreDrawPh(parseFloat(v) || 3.0)}
                      />
                    </View>

                    {/* Tea Base Type */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Baza herbaty:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'BLACK' as const, label: t('Czarna klasyczna') },
                        { id: 'GREEN' as const, label: t('Zielona Sencha') },
                        { id: 'OOLONG' as const, label: t('Oolong / Turkusowa') },
                        { id: 'WHITE' as const, label: t('Biała Pai Mu Tan') },
                        { id: 'HERBAL_BLEND' as const, label: t('Mieszanka ziołowa') },
                      ].map((tea) => (
                        <TouchableOpacity
                          key={tea.id}
                          style={[styles.presetPill, cbTeaBase === tea.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setCbTeaBase(tea.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, cbTeaBase === tea.id && styles.presetPillTextActive]}>
                            {tea.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* Calculations / Output */}
                    <View style={styles.safetyBox}>
                      <Text style={[
                        styles.safetyStatus,
                        !continuousBrewPlan.isDrawSafe ? styles.safetyDanger : { color: '#15803D' }
                      ]}>
                        • {t('Wskaźnik poboru:')} {continuousBrewPlan.drawRatioPct}% ({continuousBrewPlan.drawVolumeLiters}L {t('z')} {cbVesselLiters}L) — {continuousBrewPlan.isDrawSafe ? t('BEZPIECZNY') : t('NIEBEZPIECZNY')}
                      </Text>
                      {continuousBrewPlan.safetyWarning && (
                        <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                          ⚠️ {continuousBrewPlan.safetyWarning}
                        </Text>
                      )}

                      <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
                        • {t('Do uzupełnienia:')} <Text style={styles.boldText}>{continuousBrewPlan.sweetTeaVolumeLiters} L</Text> {t('słodkiej herbaty')} ({t('zostaje')} {continuousBrewPlan.reserveVolumeLiters}L {t('bazy starterowej')})
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Składniki słodkiej herbaty:')} <Text style={styles.boldText}>{continuousBrewPlan.sugarTotalGrams} g</Text> {t('cukru')} (70 g/L) + <Text style={styles.boldText}>{continuousBrewPlan.teaLeavesTotalGrams} g</Text> {t('herbaty')} (5 g/L)
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Czas parzenia:')} <Text style={styles.boldText}>{continuousBrewPlan.recommendedSteepTimeMinutes} min</Text> | {t('Chłodzenie do:')} &le; {continuousBrewPlan.recommendedCoolingTempCelsius}°C
                      </Text>
                      {continuousBrewPlan.estimatedPostRefillPh !== undefined && (
                        <Text style={styles.proCardDesc}>
                          • {t('Szacowane pH po dolaniu:')} <Text style={styles.boldText}>pH {continuousBrewPlan.estimatedPostRefillPh}</Text> ({t('ochrona przed pleśnią')} &le; 4.0)
                        </Text>
                      )}
                      <Text style={styles.proCardDesc}>
                        • {t('Kolejny rozlew za:')} <Text style={styles.boldText}>{continuousBrewPlan.estimatedCycleDays} {t('dni')}</Text> ({t('w temp.')} {cbTempCelsius}°C)
                      </Text>

                      {/* Trub Alert */}
                      {continuousBrewPlan.trubPurgeAlert && continuousBrewPlan.trubPurgeAlert.urgency !== 'NONE' && (
                        <View style={{ marginTop: 8, padding: 8, borderRadius: 8, backgroundColor: continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '#FEF2F2' : '#FFFBEB' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '#991B1B' : '#92400E' }}>
                            {continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '🚨' : '⏳'} {continuousBrewPlan.trubPurgeAlert.reason}
                          </Text>
                          {continuousBrewPlan.trubPurgeAlert.actionSteps.map((step, idx) => (
                            <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                              {idx + 1}. {step}
                            </Text>
                          ))}
                        </View>
                      )}

                      {continuousBrewPlan.recommendations.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 4 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Pasteurization Units (PU) & Thermal Stabilization Engine */}
                {puPlanCalc && (
                  <View style={[styles.proCard, puPlanCalc.thermalSafetyStatus === 'SENSORY_HEAT_DAMAGE_RISK' && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🔥 {t('Jednostki Pasteryzacji (PU) & Termiczna Stabilizacja')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Model Bigelowa, dezaktywacja drożdży w kombusze 2F, ochrona matki octowej i chrupkości')}
                    </Text>

                    {/* Category Selector Pills */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'KOMBUCHA_STABILIZATION' as const, label: t('Kombucha 2F (15-25 PU)') },
                        { id: 'LIVING_VINEGAR_PRESERVATION' as const, label: t('Żywy ocet (20-30 PU)') },
                        { id: 'FERMENTED_HOT_SAUCE' as const, label: t('Sos chili (50-100 PU)') },
                        { id: 'CRISP_PICKLE_JAR' as const, label: t('Kiszonki słoik (100-180 PU)') },
                      ].map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[styles.presetPill, puCategory === cat.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setPuCategory(cat.id);
                            const meta = PASTEURIZATION_TARGETS[cat.id];
                            setPuWaterBathTempC(meta.referenceTempC + 4);
                          }}
                        >
                          <Text style={[styles.presetPillText, puCategory === cat.id && styles.presetPillTextActive]}>
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Temperatura łaźni wodnej (°C):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(puWaterBathTempC)}
                        onChangeText={(v) => setPuWaterBathTempC(parseFloat(v) || 50)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Czas w kąpieli wodnej (min):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(puHoldMinutes)}
                        onChangeText={(v) => setPuHoldMinutes(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Pojemność butelki / słoika (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(puBottleVolumeMl)}
                        onChangeText={(v) => setPuBottleVolumeMl(parseFloat(v) || 500)}
                      />
                    </View>

                    <View style={styles.safetyBox}>
                      <Text style={[
                        styles.safetyStatus,
                        puPlanCalc.thermalSafetyStatus === 'SENSORY_HEAT_DAMAGE_RISK'
                          ? styles.safetyDanger
                          : puPlanCalc.isTargetAchieved
                          ? { color: '#15803D' }
                          : { color: '#B45309' }
                      ]}>
                        • {t('Akumulacja PU:')} {puPlanCalc.actualAccumulatedPu ?? 0} PU / {t('cel')} {puPlanCalc.targetPu} PU ({puPlanCalc.isTargetAchieved ? t('OSIĄGNIĘTY') : t('W TRAKCIE / ZA MAŁO')})
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Wymagany czas przetrzymania:')} <Text style={styles.boldText}>{puPlanCalc.requiredHoldTimeMinutes} min</Text> ({t('tempo:')} {puPlanCalc.puAccumulationRatePerMinute} PU/min)
                      </Text>

                      <Text style={styles.brineText}>
                        • {puPlanCalc.statusMessagePl}
                      </Text>

                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {puPlanCalc.sensoryPreservationAdvice}
                      </Text>

                      {puPlanCalc.recommendedWaterBathProtocol.map((step, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                          {idx + 1}. {step}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Vinegar Standardization & Surface Aeration Engine */}
                {vinegarStdCalc && vinegarStoichCalc && vinegarAerationCalc && (
                  <View style={[styles.proCard, (vinegarStoichCalc.isAlcoholTooHighWarning || vinegarAerationCalc.aerationRating === 'STAGNANT_SUFFOCATION') && styles.cardDanger]}>
                    <Text style={styles.proCardTitle}>🧪 {t('Standaryzacja Octu & Aeracja Lustra (Grain Strength)')}</Text>
                    <Text style={styles.proCardDesc}>
                      {t('Moc w stopniach Grain (10 grain = 1%), rozcieńczanie kwadratem Pearsona i aeracja naczynia')}
                    </Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Kwasowość surowa (% / Grain):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(vinRawAcidity)}
                        onChangeText={(v) => setVinRawAcidity(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość surowego octu (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(vinRawVolumeL)}
                        onChangeText={(v) => setVinRawVolumeL(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Docelowa kwasowość (% / Grain):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(vinTargetAcidity)}
                        onChangeText={(v) => setVinTargetAcidity(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Średnica lustra cieczy (cm):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(vinVesselDiameterCm)}
                        onChangeText={(v) => setVinVesselDiameterCm(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Początkowy alkohol cydru/wina (% ABV):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(vinInitialAbv)}
                        onChangeText={(v) => setVinInitialAbv(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.safetyBox}>
                      <Text style={[
                        styles.safetyStatus,
                        vinegarStdCalc.legalFoodGradeClassification === 'SUB_STANDARD_LOW' ? styles.safetyDanger : { color: '#15803D' }
                      ]}>
                        • {t('Moc:')} {vinegarStdCalc.rawGrainStrength} Grain ({vinRawAcidity}%) &rarr; {vinegarStdCalc.targetGrainStrength} Grain ({vinTargetAcidity}%) — {vinegarStdCalc.classificationLabelPl}
                      </Text>

                      {vinegarStdCalc.isDilutionNeeded ? (
                        <Text style={styles.proCardDesc}>
                          • {t('Dolewka wody niechlorowanej:')} <Text style={styles.boldText}>{vinegarStdCalc.dilutionLiquidVolumeLiters} L</Text> ({t('objętość końcowa:')} {vinegarStdCalc.totalFinishedVolumeLiters} L)
                        </Text>
                      ) : (
                        <Text style={styles.proCardDesc}>
                          • {t('Rozcieńczenie zbędne (kwasowość &le; docelowej)')}
                        </Text>
                      )}

                      <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                        💡 {vinegarStdCalc.motherPreservationAdvice}
                      </Text>

                      {/* Stoichiometry */}
                      <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
                        • {t('Potencjał kwasowy z')} {vinInitialAbv}% ABV: <Text style={styles.boldText}>{vinegarStoichCalc.expectedActualAcidityPct}%</Text> ({vinegarStoichCalc.expectedGrainStrength} Grain, {t('max teor.')} {vinegarStoichCalc.theoreticalMaxAcidityPct}%)
                      </Text>

                      {vinegarStoichCalc.potentialSpoilageRisk && (
                        <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                          ⚠️ {vinegarStoichCalc.potentialSpoilageRisk}
                        </Text>
                      )}

                      {/* Aeration */}
                      <Text style={[
                        styles.safetyStatus,
                        vinegarAerationCalc.aerationRating === 'STAGNANT_SUFFOCATION' ? styles.safetyDanger : { color: '#15803D' },
                        { marginTop: 6 }
                      ]}>
                        • {t('Wskaźnik natlenienia A/V:')} {vinegarAerationCalc.surfaceToVolumeRatioCm2PerLiter} cm²/L — {vinegarAerationCalc.ratingLabelPl} ({vinegarAerationCalc.estimatedFermentationWeeks.min}–{vinegarAerationCalc.estimatedFermentationWeeks.max} {t('tyg.')})
                      </Text>
                      <Text style={styles.recipeDetailText}>
                        🧫 {vinegarAerationCalc.motherPellicleHealthAdvice}
                      </Text>

                      {vinegarAerationCalc.actionableRecommendations.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 2 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Ziarna Kefirowe & Tibicos 1F/2F */}
                {kefir1FCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🥛 {t('Ziarna Kefirowe & Tibicos (1F/2F)')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Symbiotyczna matryca kefiranu, inokulacja (2.5-5%), kinetyka trawienia laktozy i nasycenie CO2')}
                    </Text>

                    {/* Medium selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ kefiru:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'MILK_KEFIR' as const, label: t('Kefir Mleczny (Ziarna tybetańskie)') },
                        { id: 'WATER_KEFIR_TIBICOS' as const, label: t('Kefir Wodny (Kryształki Tibicos)') },
                      ].map((km) => (
                        <TouchableOpacity
                          key={km.id}
                          style={[styles.presetPill, kefirMedium === km.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setKefirMedium(km.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, kefirMedium === km.id && styles.presetPillTextActive]}>
                            {km.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość płynu (ml):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(kefirLiquidVolumeMl)}
                        onChangeText={(v) => setKefirLiquidVolumeMl(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Masa ziaren kefirowych (g):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(kefirGrainWeightGrams)}
                        onChangeText={(v) => setKefirGrainWeightGrams(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={[
                        styles.safetyStatus,
                        kefir1FCalc.status !== 'OPTIMAL' ? styles.safetyDanger : { color: '#15803D' }
                      ]}>
                        • {t('Status inokulacji 1F:')} {kefir1FCalc.status} ({kefir1FCalc.inoculationRatioPct}%)
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Zalecana masa ziaren:')} <Text style={styles.boldText}>{kefir1FCalc.recommendedGrainWeightMinG}–{kefir1FCalc.recommendedGrainWeightMaxG} g</Text> ({t('na')} {kefirLiquidVolumeMl} ml)
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Szacowany czas 1F:')} <Text style={styles.boldText}>~{kefir1FCalc.estimatedFermentationHours} {t('godzin')}</Text> ({t('w temp.')} {ambientTempC}°C)
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Redukcja laktozy w 1F:')} <Text style={styles.boldText}>~{kefir1FCalc.expectedLactoseReductionPct}%</Text> | {t('Przyrost biomasy ziaren:')} <Text style={styles.boldText}>+{kefir1FCalc.biomassGrowthPotentialGrams} g/dobę</Text>
                      </Text>

                      {kefir1FCalc.alertsPl.map((alert, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                          ⚠️ {alert}
                        </Text>
                      ))}

                      {kefir1FCalc.recommendationsPl.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
                          💡 {rec}
                        </Text>
                      ))}

                      {/* 2F Secondary Fermentation Section */}
                      {kefir2FCalc && (
                        <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
                          <Text style={[styles.proCardTitle, { fontSize: 13 }]}>
                            🍾 {t('Refermentacja Wtórna 2F (Bez ziaren):')}
                          </Text>
                          <Text style={styles.proCardDesc}>
                            • {t('Nasycenie CO2:')} <Text style={styles.boldText}>{kefir2FCalc.carbonationLevelVol} vol</Text> | {t('Ostateczna redukcja laktozy:')} <Text style={styles.boldText}>{kefir2FCalc.finalLactoseReductionPct}%</Text> ({t('praktycznie bezlaktozowy')})
                          </Text>
                          <Text style={styles.proCardDesc}>
                            • {t('Wzrost kwasu foliowego (B9):')} <Text style={styles.boldText}>+{kefir2FCalc.folateIncreasePct}%</Text>
                          </Text>
                          <Text style={[styles.recipeDetailText, { marginTop: 2 }]}>
                            💡 {kefir2FCalc.servingNotesPl}
                          </Text>
                          {kefir2FCalc.alertsPl.map((alert, idx) => (
                            <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 3 }}>
                              ⚠️ {alert}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Tradycyjne Miodosytnictwo & Ekstrakt Brzeczki */}
                {meadCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🍯 {t('Tradycyjne Miodosytnictwo (Półtorak/Trójniak)')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Polska klasyfikacja miodów pitnych: bilans miodu i wody, szok osmotyczny, partionowanie i protokół TOSNA 3.0')}
                    </Text>

                    {/* Grade selector */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Klasa miodu pitnego:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {(['POLTORAK', 'DWOJNIAK', 'TROJNIAK', 'CZWORNIAK'] as PolishMeadGrade[]).map((mg) => (
                        <TouchableOpacity
                          key={mg}
                          style={[styles.presetPill, meadGrade === mg && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setMeadGrade(mg);
                          }}
                        >
                          <Text style={[styles.presetPillText, meadGrade === mg && styles.presetPillTextActive]}>
                            {MEAD_GRADE_CONFIGS[mg].namePl.split(' (')[0]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Docelowa objętość brzeczki (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(meadTargetVolumeL)}
                        onChangeText={(v) => setMeadTargetVolumeL(parseFloat(v) || 1)}
                      />
                    </View>

                    {/* Preparation method */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Metoda przygotowania brzeczki:')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                      {[
                        { id: 'NIESYCONY' as const, label: t('Niesycony (Na zimno, aromatyczny)') },
                        { id: 'SYCONY' as const, label: t('Sycony (Gotowany z szumowaniem)') },
                      ].map((pr) => (
                        <TouchableOpacity
                          key={pr.id}
                          style={[styles.presetPill, meadPrepType === pr.id && styles.presetPillActive]}
                          onPress={() => {
                            triggerHapticFeedback();
                            setMeadPrepType(pr.id);
                          }}
                        >
                          <Text style={[styles.presetPillText, meadPrepType === pr.id && styles.presetPillTextActive]}>
                            {pr.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <View style={styles.brineResultBox}>
                      <Text style={[styles.safetyStatus, { color: '#15803D' }]}>
                        • {meadCalc.gradeNamePl} — {MEAD_GRADE_CONFIGS[meadGrade].honeyToWaterRatio}
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Miód pszczeli:')} <Text style={styles.boldText}>{meadCalc.honeyLiters} L</Text> ({meadCalc.honeyWeightKg} kg) | {t('Woda niechlorowana:')} <Text style={styles.boldText}>{meadCalc.waterLiters} L</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Ekstrakt brzeczki:')} <Text style={styles.boldText}>{meadCalc.initialBallingDegrees} °Blg</Text> (SG {meadCalc.initialSpecificGravity}) &rarr; {t('Docelowy alkohol:')} <Text style={styles.boldText}>~{meadCalc.expectedAbvPct}% ABV</Text>
                      </Text>

                      <Text style={styles.proCardDesc}>
                        • {t('Okres leżakowania:')} <Text style={styles.boldText}>{meadCalc.expectedAgingYears.min}–{meadCalc.expectedAgingYears.max} {t('lat')}</Text>
                      </Text>

                      {meadCalc.isStepFeedingMandatory && (
                        <View style={{ marginTop: 6, padding: 6, backgroundColor: '#FEF3C7', borderRadius: 6 }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: '#B45309' }}>
                            ⚠️ {t('Wymagane partionowanie miodu (Step-Feeding):')}
                          </Text>
                          <Text style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>
                            {t('Podziel')} {meadCalc.honeyLiters} L {t('miodu na')} {meadCalc.stepFeedingDosesLiters.length} {t('dawki:')} {meadCalc.stepFeedingDosesLiters.map((d, i) => `${i + 1}. doza: ${d}L`).join(', ')}
                          </Text>
                        </View>
                      )}

                      <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
                        🍯 {meadCalc.preparationAdvicePl}
                      </Text>

                      {/* TOSNA 3.0 Nutrient schedule */}
                      <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
                        <Text style={[styles.proCardTitle, { fontSize: 12 }]}>
                          🧪 {t('Protokół Odżywczy TOSNA 3.0 (Fermaid O):')} {meadCalc.tosnaNutrientGramsTotal} g {t('łącznie')}
                        </Text>
                        {meadCalc.tosnaAdditionsSchedulePl.map((sch, idx) => (
                          <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>
                            • {sch}
                          </Text>
                        ))}
                      </View>

                      {meadCalc.alertsPl.map((alert, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                          ⚠️ {alert}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Dziki Starter Imbirowy & Piwo Imbirowe */}
                {gingerBugStarterCalc && gingerBeerBatchCalc && (
                  <View style={styles.proCard}>
                    <Text style={styles.proCardTitle}>
                      🫚 {t('Dziki Starter Imbirowy (Ginger Bug & Piwo Imbirowe)')}
                    </Text>
                    <Text style={styles.proCardDesc}>
                      {t('Dzikie drożdże i bakterie kwasu mlekowego z korzenia imbiru, proporcje nastawu oraz kontrola ciśnienia CO2 (Bottle Burst Guard)')}
                    </Text>

                    {/* Starter status section */}
                    <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>🌱 {t('Kondycja startera (Słoik-Matka):')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Wiek startera (dni):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(gbStarterDays)}
                        onChangeText={(v) => setGbStarterDays(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Dni od ostatniego karmienia:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(gbDaysSinceFeed)}
                        onChangeText={(v) => setGbDaysSinceFeed(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Widoczne bąbelki i musowanie:')}</Text>
                      <TouchableOpacity
                        style={[styles.presetPill, gbHasBubbles ? styles.presetPillActive : null]}
                        onPress={() => {
                          triggerHapticFeedback();
                          setGbHasBubbles(!gbHasBubbles);
                        }}
                      >
                        <Text style={[styles.presetPillText, gbHasBubbles ? styles.presetPillTextActive : null]}>
                          {gbHasBubbles ? t('TAK (Aktywny)') : t('NIE (Brak piany)')}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.safetyBox, { marginTop: 6 }]}>
                      <Text style={[
                        styles.safetyStatus,
                        gingerBugStarterCalc.isReadyForBrewing ? { color: '#15803D' } : { color: '#B45309' }
                      ]}>
                        • {gingerBugStarterCalc.statusLabelPl} ({t('Witalność:')} {gingerBugStarterCalc.starterHealthScore}/100)
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Następne karmienie:')} <Text style={styles.boldText}>{gingerBugStarterCalc.nextFeedGingerGrams} g {t('startego imbiru ze skórką')}</Text> + <Text style={styles.boldText}>{gingerBugStarterCalc.nextFeedSugarGrams} g {t('cukru')}</Text> + <Text style={styles.boldText}>{gingerBugStarterCalc.nextFeedWaterMl} ml {t('wody')}</Text>
                      </Text>
                      {gingerBugStarterCalc.recommendationsPl.map((rec, idx) => (
                        <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
                          💡 {rec}
                        </Text>
                      ))}
                    </View>

                    {/* Batch brewing section */}
                    <Text style={[styles.inputLabelMini, { marginTop: 10 }]}>🍾 {t('Nastaw Partii Piwa Imbirowego:')}</Text>
                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Objętość partii (L):')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(gbBatchVolumeL)}
                        onChangeText={(v) => setGbBatchVolumeL(parseFloat(v) || 1)}
                      />
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.inlineLabel}>{t('Godziny refermentacji w butelce:')}</Text>
                      <TextInput
                        style={styles.numInput}
                        keyboardType="numeric"
                        value={String(gbHoursInBottle)}
                        onChangeText={(v) => setGbHoursInBottle(parseFloat(v) || 0)}
                      />
                    </View>

                    <View style={styles.brineResultBox}>
                      <Text style={styles.proCardDesc}>
                        • {t('Aktywny odcedzony starter:')} <Text style={styles.boldText}>{gingerBeerBatchCalc.requiredStarterVolumeMl} ml</Text> (10% {t('nastawu')})
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Cukier do nastawu:')} <Text style={styles.boldText}>{gingerBeerBatchCalc.totalSugarGrams} g</Text> | {t('Świeży imbir na wywar:')} <Text style={styles.boldText}>{gingerBeerBatchCalc.freshGingerDecoctionGrams} g</Text>
                      </Text>
                      <Text style={styles.proCardDesc}>
                        • {t('Sok ze świeżej cytryny:')} <Text style={styles.boldText}>{gingerBeerBatchCalc.lemonJuiceMl} ml</Text> ({t('dla pH 3.8')})
                      </Text>

                      <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
                        <Text style={[
                          styles.safetyStatus,
                          gingerBeerBatchCalc.burstRiskSeverity === 'CRITICAL'
                            ? styles.safetyDanger
                            : gingerBeerBatchCalc.burstRiskSeverity === 'WARNING'
                            ? { color: '#B45309' }
                            : { color: '#15803D' }
                        ]}>
                          • {t('Nasycenie CO2:')} {gingerBeerBatchCalc.estimatedCo2Volumes} vol ({gingerBeerBatchCalc.carbonationStage})
                        </Text>
                        <Text style={styles.proCardDesc}>
                          • {t('Do optymalnego nagazowania:')} <Text style={styles.boldText}>~{gingerBeerBatchCalc.estimatedHoursToOptimalCo2} {t('godzin')}</Text> ({t('w')} {ambientTempC}°C)
                        </Text>
                      </View>

                      {gingerBeerBatchCalc.alertsPl.map((al, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                          ⚠️ {al}
                        </Text>
                      ))}

                      {gingerBeerBatchCalc.stepsPl.map((step, idx) => (
                        <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                          {idx + 1}. {step}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Save As Batch Button */}
        <TouchableOpacity
          style={styles.saveBatchButton}
          onPress={handleSaveBatch}
          accessibilityRole="button"
        >
          <Text style={styles.saveBatchButtonText}>
            📥 {t('Zapisz jako Nową Partię')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Zero-Tolerance Apps4Brew Monetization Modal */}
      <Apps4BrewPassModal
        visible={isPaywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSubscribe={subscribe}
        onRestore={restorePurchases}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5', // Linen & Whey
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#78350F', // Amber 900
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '600',
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E7E5E4',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  modeTextActive: {
    color: '#78350F',
    fontWeight: '700',
  },
  keepAwakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 16,
  },
  keepAwakeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  keepAwakeDesc: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  craftSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44403C',
    marginBottom: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  stepperBtn: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#78350F',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 12,
  },
  typePill: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
  },
  typePillActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  typePillTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
    marginBottom: 4,
  },
  resultValueHighlight: {
    fontSize: 22,
    fontWeight: '800',
    color: '#B45309',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1917',
  },
  resultSub: {
    fontSize: 11,
    color: '#A8A29E',
    marginTop: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 12,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#44403C',
  },
  accordionArrow: {
    fontSize: 12,
    color: '#78716C',
  },
  proAccordionBody: {
    gap: 12,
    marginBottom: 16,
  },
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cardDanger: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  proCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  proCardDesc: {
    fontSize: 12,
    color: '#78716C',
    marginBottom: 10,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  timerDigits: {
    fontSize: 28,
    fontWeight: '900',
    color: '#78350F',
    fontVariant: ['tabular-nums'],
  },
  timerStartBtn: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#15803D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerStopBtn: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  flocResultBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
  },
  flocResultText: {
    fontSize: 13,
    color: '#92400E',
  },
  flocResultSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  inlineLabel: {
    fontSize: 13,
    color: '#44403C',
    flex: 1,
  },
  numInput: {
    width: 90,
    height: 44,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  pressureResultBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  pressureValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#166534',
  },
  pressureSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  brineResultBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  brineText: {
    fontSize: 12,
    color: '#334155',
  },
  boldText: {
    fontWeight: '700',
  },
  warningAlert: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    padding: 8,
    borderRadius: 4,
  },
  warningAlertText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
  },
  safeStatusText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
  safetyBox: {
    backgroundColor: '#F5F5F4',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  safetyStatus: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  safetyDanger: {
    color: '#DC2626',
  },
  kimchiBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  kimchiLine: {
    fontSize: 12,
    color: '#14532D',
  },
  pressureBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  pressureVolText: {
    fontSize: 13,
    color: '#334155',
  },
  riskAlertText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  riskAlertDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
  vinegarBox: {
    backgroundColor: '#FEFCE8',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  vinegarText: {
    fontSize: 12,
    color: '#713F12',
  },
  vinegarAlert: {
    fontSize: 11,
    color: '#854D0E',
    marginTop: 2,
  },
  vinegarAlertDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
  saveBatchButton: {
    height: 56,
    backgroundColor: '#78350F', // Amber 900
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBatchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardMiniTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 8,
  },
  cardDescMini: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '700',
    color: '#57534E',
    marginTop: 8,
    marginBottom: 4,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  presetPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#B45309',
  },
  presetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  presetPillTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  recipeDetailCard: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  recipeDetailName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  recipeDetailCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 3,
  },
  recipeKeyTechnique: {
    fontSize: 11,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  recipeBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  recipeShareBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  recipeShareBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  recipeImportBtn: {
    flex: 1,
    backgroundColor: '#78350F',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  recipeImportBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  schedulerBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
  },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniStepperBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#F5F5F4',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  miniStepperBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  miniStepperVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
    minWidth: 50,
    textAlign: 'center',
  },
  schedulerResultBox: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  schedulerStartLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  schedulerStartHour: {
    fontSize: 28,
    fontWeight: '900',
    color: '#14532D',
    marginVertical: 2,
  },
  schedulerSubText: {
    fontSize: 11,
    color: '#15803D',
  },
  nightWarningBox: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  nightWarningTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 4,
  },
  nightWarningLine: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
  },
  nightWarningRec: {
    fontSize: 11,
    color: '#7F1D1D',
    fontWeight: '600',
    marginTop: 4,
    fontStyle: 'italic',
  },
  timelineRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  timelineTime: {
    width: 50,
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  timelineContent: {
    flex: 1,
  },
  timelineName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  timelineDesc: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 1,
  },
});
