// ============================================================================
// Apps4Brew Studio — FERMENT Main Crafting Assistant & Dynamic Calculators
// 1-Tap Beginner Simplicity + Collapsible Pro Biochemical Accordion
// Ergonomics: Dirty/Wet hands >= 56pt, Keep-Awake, WAV PCM Bell Chimes
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { createAutoBackup, getCorruptStateRecovery, clearCorruptState, CorruptRecoveryInfo } from '../../src/lib/backup';
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
import { styles } from '../../src/components/calculator/calculator.styles';
import { CanonicalRecipesCard } from '../../src/components/calculator/CanonicalRecipesCard';
import { ReverseSchedulerCard } from '../../src/components/calculator/ReverseSchedulerCard';
import { CheeseCraftSection } from '../../src/components/calculator/CheeseCraftSection';
import { VegCraftSection } from '../../src/components/calculator/VegCraftSection';
import { BeverageCraftSection } from '../../src/components/calculator/BeverageCraftSection';



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
  const [corruptRecovery, setCorruptRecovery] = useState<CorruptRecoveryInfo | null>(null);

  useEffect(() => {
    getCorruptStateRecovery().then((info) => {
      if (info) setCorruptRecovery(info);
    });
  }, []);

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
        {corruptRecovery && (
          <View
            testID="corrupt-recovery-banner"
            accessibilityRole="alert"
            style={{
              backgroundColor: '#7F1D1D',
              padding: 14,
              marginBottom: 16,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#EF4444',
            }}
          >
            <Text style={{ color: '#FEE2E2', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>
              ⚠️ {t('Wykryto uszkodzony stan danych')}
            </Text>
            <Text style={{ color: '#FECACA', fontSize: 13, marginBottom: 10 }}>
              {corruptRecovery.reason} ({corruptRecovery.timestamp})
            </Text>
            <TouchableOpacity
              testID="dismiss-corrupt-recovery"
              accessibilityRole="button"
              accessibilityLabel={t('Zamknij')}
              onPress={async () => {
                await clearCorruptState();
                setCorruptRecovery(null);
              }}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#EF4444',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 6,
                minHeight: 44,
                minWidth: 44,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{t('Zamknij')}</Text>
            </TouchableOpacity>
          </View>
        )}

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
        <CanonicalRecipesCard
          activeRecipes={activeRecipes}
          selectedRecipeId={selectedRecipeId}
          selectedRecipe={selectedRecipe}
          handleSelectRecipe={handleSelectRecipe}
          handleCopyShareLink={handleCopyShareLink}
          handleImportRecipeFromClipboard={handleImportRecipeFromClipboard}
        />

        {/* Reverse Production Scheduler (Anti-Fatigue Guard) */}
        <ReverseSchedulerCard
          isSchedulerOpen={isSchedulerOpen}
          setIsSchedulerOpen={setIsSchedulerOpen}
          schedulerProcess={schedulerProcess}
          setSchedulerProcess={setSchedulerProcess}
          targetFinishHour={targetFinishHour}
          setTargetFinishHour={setTargetFinishHour}
          reverseScheduleCalc={reverseScheduleCalc}
        />

        {/* MODE 1: CHEESEMAKING */}
        {craftMode === 'cheese' && (
          <CheeseCraftSection
            milkLiters={milkLiters}
            setMilkLiters={setMilkLiters}
            milkType={milkType}
            setMilkType={setMilkType}
            rennetCalc={rennetCalc}
            cacl2Calc={cacl2Calc}
            isProExpanded={isProExpanded}
            setIsProExpanded={setIsProExpanded}
            flocMultiplier={flocMultiplier}
            flocSecInput={flocSecInput}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            handleStartTimer={handleStartTimer}
            handleStopTimer={handleStopTimer}
            flocCalc={flocCalc}
            moldFittingCalc={moldFittingCalc}
            selectedMoldTemplateId={selectedMoldTemplateId}
            setSelectedMoldTemplateId={setSelectedMoldTemplateId}
            setMoldDiamCm={setMoldDiamCm}
            pressMechanism={pressMechanism}
            setPressMechanism={setPressMechanism}
            moldDiamCm={moldDiamCm}
            pressWeightKg={pressWeightKg}
            setPressWeightKg={setPressWeightKg}
            armLengthCm={armLengthCm}
            setArmLengthCm={setArmLengthCm}
            moldDistCm={moldDistCm}
            setMoldDistCm={setMoldDistCm}
            armWeightKg={armWeightKg}
            setArmWeightKg={setArmWeightKg}
            dutchLeverCalc={dutchLeverCalc}
            pressCalc={pressCalc}
            isPressCascadeOpen={isPressCascadeOpen}
            setIsPressCascadeOpen={setIsPressCascadeOpen}
            pressingCascadeProg={pressingCascadeProg}
            brineWaterLiters={brineWaterLiters}
            brineSalinityPct={brineSalinityPct}
            brineWaterPh={brineWaterPh}
            setBrineWaterPh={setBrineWaterPh}
            brineAcidCalc={brineAcidCalc}
            currentBrineSalinity={currentBrineSalinity}
            setCurrentBrineSalinity={setCurrentBrineSalinity}
            targetBrineSalinity={targetBrineSalinity}
            setTargetBrineSalinity={setTargetBrineSalinity}
            brineBoostCalc={brineBoostCalc}
            brineDensitometryCalc={brineDensitometryCalc}
            brineDensityUnit={brineDensityUnit}
            setBrineDensityUnit={setBrineDensityUnit}
            brineMeasuredValue={brineMeasuredValue}
            setBrineMeasuredValue={setBrineMeasuredValue}
            brineSampleTempC={brineSampleTempC}
            setBrineSampleTempC={setBrineSampleTempC}
            brineVolumeLitersInput={brineVolumeLitersInput}
            setBrineVolumeLitersInput={setBrineVolumeLitersInput}
            brineTargetProfile={brineTargetProfile}
            setBrineTargetProfile={setBrineTargetProfile}
            cookingRampCalc={cookingRampCalc}
            cookStartTemp={cookStartTemp}
            cookEndTemp={cookEndTemp}
            cookDurationMin={cookDurationMin}
            washWheyDrainedLiters={washWheyDrainedLiters}
            setWashWheyDrainedLiters={setWashWheyDrainedLiters}
            washHotWaterTempC={washHotWaterTempC}
            setWashHotWaterTempC={setWashHotWaterTempC}
            washTargetTempC={washTargetTempC}
            setWashTargetTempC={setWashTargetTempC}
            curdWashCalc={curdWashCalc}
            cheddarCurdGrams={cheddarCurdGrams}
            setCheddarCurdGrams={setCheddarCurdGrams}
            cheddarTargetSalinityPct={cheddarTargetSalinityPct}
            setCheddarTargetSalinityPct={setCheddarTargetSalinityPct}
            cheddarSaltingCalc={cheddarSaltingCalc}
            sweetWheyLiters={sweetWheyLiters}
            wheyMilkBoostLiters={wheyMilkBoostLiters}
            setWheyMilkBoostLiters={setWheyMilkBoostLiters}
            ricottaCalc={ricottaCalc}
            wheyDrinkCalc={wheyDrinkCalc}
            wheyLevainCalc={wheyLevainCalc}
            wheyLevainType={wheyLevainType}
            setWheyLevainType={setWheyLevainType}
            setWheyIncubationTempC={setWheyIncubationTempC}
            wheyVolumeMl={wheyVolumeMl}
            setWheyVolumeMl={setWheyVolumeMl}
            wheyIncubationTempC={wheyIncubationTempC}
            wheyHoursIncubated={wheyHoursIncubated}
            setWheyHoursIncubated={setWheyHoursIncubated}
            wheyCurrentPh={wheyCurrentPh}
            setWheyCurrentPh={setWheyCurrentPh}
            wheyGeneration={wheyGeneration}
            setWheyGeneration={setWheyGeneration}
            coatingType={coatingType}
            setCoatingType={setCoatingType}
            coatingWheelHeightCm={coatingWheelHeightCm}
            setCoatingWheelHeightCm={setCoatingWheelHeightCm}
            coatingLayers={coatingLayers}
            setCoatingLayers={setCoatingLayers}
            wheelCoatingCalc={wheelCoatingCalc}
            cheeseMoisturePct={cheeseMoisturePct}
            setCheeseMoisturePct={setCheeseMoisturePct}
            cheeseFatPct={cheeseFatPct}
            setCheeseFatPct={setCheeseFatPct}
            cheeseSaltPct={cheeseSaltPct}
            setCheeseSaltPct={setCheeseSaltPct}
            cheeseCompositionCalc={cheeseCompositionCalc}
            diffWheelWeightKg={diffWheelWeightKg}
            setDiffWheelWeightKg={setDiffWheelWeightKg}
            diffDiameterCm={diffDiameterCm}
            setDiffDiameterCm={setDiffDiameterCm}
            diffHeightCm={diffHeightCm}
            setDiffHeightCm={setDiffHeightCm}
            diffBrineSalinityPct={diffBrineSalinityPct}
            setDiffBrineSalinityPct={setDiffBrineSalinityPct}
            diffBrineTempC={diffBrineTempC}
            setDiffBrineTempC={setDiffBrineTempC}
            brineDiffusionCalc={brineDiffusionCalc}
            milkSpeciesCalc={milkSpeciesCalc}
            curdSyneresisCalc={curdSyneresisCalc}
            syneresisStyle={syneresisStyle}
            setSyneresisStyle={setSyneresisStyle}
            setSyneresisCutSizeMm={setSyneresisCutSizeMm}
            setSyneresisInitTempC={setSyneresisInitTempC}
            setSyneresisTargetTempC={setSyneresisTargetTempC}
            syneresisCutSizeMm={syneresisCutSizeMm}
            syneresisTargetTempC={syneresisTargetTempC}
            syneresisHeatingMinutes={syneresisHeatingMinutes}
            setSyneresisHeatingMinutes={setSyneresisHeatingMinutes}
            syneresisStirMinutes={syneresisStirMinutes}
            setSyneresisStirMinutes={setSyneresisStirMinutes}
            syneresisDrainPh={syneresisDrainPh}
            setSyneresisDrainPh={setSyneresisDrainPh}
          />
        )}

        {/* MODE 2: VEGETABLE FERMENT & KIMCHI */}
        {craftMode === 'veg' && (
          <VegCraftSection
            vegGrams={vegGrams}
            setVegGrams={setVegGrams}
            waterGrams={waterGrams}
            setWaterGrams={setWaterGrams}
            targetSalinity={targetSalinity}
            setTargetSalinity={setTargetSalinity}
            totalSalinityCalc={totalSalinityCalc}
            isProExpanded={isProExpanded}
            setIsProExpanded={setIsProExpanded}
            measuredPh={measuredPh}
            setMeasuredPh={setMeasuredPh}
            fermentHours={fermentHours}
            setFermentHours={setFermentHours}
            botulinumSafety={botulinumSafety}
            labKineticsCalc={labKineticsCalc}
            cabbageGrams={cabbageGrams}
            setCabbageGrams={setCabbageGrams}
            kimchiPrep={kimchiPrep}
            ambientTempC={ambientTempC}
            setAmbientTempC={setAmbientTempC}
            q10VegCalc={q10VegCalc}
            jarCapacityMl={jarCapacityMl}
            setJarCapacityMl={setJarCapacityMl}
            stoneWeightGrams={stoneWeightGrams}
            setStoneWeightGrams={setStoneWeightGrams}
            crockHeadspaceCalc={crockHeadspaceCalc}
            selectedBotanical={selectedBotanical}
            setSelectedBotanical={setSelectedBotanical}
            botanicalGrams={botanicalGrams}
            setBotanicalGrams={setBotanicalGrams}
            garlicGramsInput={garlicGramsInput}
            setGarlicGramsInput={setGarlicGramsInput}
            garlicPrepInput={garlicPrepInput}
            setGarlicPrepInput={setGarlicPrepInput}
            vegCrispnessCalc={vegCrispnessCalc}
            kojiMode={kojiMode}
            setKojiMode={setKojiMode}
            kojiMassGrams={kojiMassGrams}
            setKojiMassGrams={setKojiMassGrams}
            kojiState={kojiState}
            setKojiState={setKojiState}
            kojiTempC={kojiTempC}
            setKojiTempC={setKojiTempC}
            amazakeCookedRiceGrams={amazakeCookedRiceGrams}
            setAmazakeCookedRiceGrams={setAmazakeCookedRiceGrams}
            amazakeTempC={amazakeTempC}
            setAmazakeTempC={setAmazakeTempC}
            misoSoyGrams={misoSoyGrams}
            setMisoSoyGrams={setMisoSoyGrams}
            misoTypeInput={misoTypeInput}
            setMisoTypeInput={setMisoTypeInput}
            kojiCalc={kojiCalc}
            nukadokoTab={nukadokoTab}
            setNukadokoTab={setNukadokoTab}
            nukaBranGrams={nukaBranGrams}
            setNukaBranGrams={setNukaBranGrams}
            nukaBedMassGrams={nukaBedMassGrams}
            setNukaBedMassGrams={setNukaBedMassGrams}
            nukaSalinityPct={nukaSalinityPct}
            setNukaSalinityPct={setNukaSalinityPct}
            nukaMoistureStatus={nukaMoistureStatus}
            setNukaMoistureStatus={setNukaMoistureStatus}
            nukaSelectedVeg={nukaSelectedVeg}
            setNukaSelectedVeg={setNukaSelectedVeg}
            nukadokoCalc={nukadokoCalc}
            tempehLegumeType={tempehLegumeType}
            setTempehLegumeType={setTempehLegumeType}
            tempehDryGrams={tempehDryGrams}
            setTempehDryGrams={setTempehDryGrams}
            tempehVinegarMl={tempehVinegarMl}
            setTempehVinegarMl={setTempehVinegarMl}
            tempehHours={tempehHours}
            setTempehHours={setTempehHours}
            tempehCoreTempC={tempehCoreTempC}
            setTempehCoreTempC={setTempehCoreTempC}
            tempehCalc={tempehCalc}
            bgRawGrams={bgRawGrams}
            setBgRawGrams={setBgRawGrams}
            bgCurrentDay={bgCurrentDay}
            setBgCurrentDay={setBgCurrentDay}
            bgChamberTempC={bgChamberTempC}
            setBgChamberTempC={setBgChamberTempC}
            bgChamberRhPct={bgChamberRhPct}
            setBgChamberRhPct={setBgChamberRhPct}
            blackGarlicCalc={blackGarlicCalc}
          />
        )}

        {/* MODE 3: KOMBUCHA & LIVING VINEGARS */}
        {craftMode === 'beverage' && (
          <BeverageCraftSection
            kombuchaWaterLiters={kombuchaWaterLiters}
            setKombuchaWaterLiters={setKombuchaWaterLiters}
            kombucha1F={kombucha1F}
            isProExpanded={isProExpanded}
            setIsProExpanded={setIsProExpanded}
            selectedJuiceId={selectedJuiceId}
            setSelectedJuiceId={setSelectedJuiceId}
            juiceVolumeMl={juiceVolumeMl}
            setJuiceVolumeMl={setJuiceVolumeMl}
            kombuchaBottleType={kombuchaBottleType}
            setKombuchaBottleType={setKombuchaBottleType}
            daysIn2F={daysIn2F}
            setDaysIn2F={setDaysIn2F}
            kombuchaBlendingCalc={kombuchaBlendingCalc}
            vinegarBrix={vinegarBrix}
            setVinegarBrix={setVinegarBrix}
            vinegarCalc={vinegarCalc}
            vinegarSampleMl={vinegarSampleMl}
            setVinegarSampleMl={setVinegarSampleMl}
            naohTiterMl={naohTiterMl}
            setNaohTiterMl={setNaohTiterMl}
            vinegarTitrationCalc={vinegarTitrationCalc}
            ambientTempC={ambientTempC}
            setAmbientTempC={setAmbientTempC}
            q10KombuchaCalc={q10KombuchaCalc}
            originalBrixInput={originalBrixInput}
            setOriginalBrixInput={setOriginalBrixInput}
            currentBrixInput={currentBrixInput}
            setCurrentBrixInput={setCurrentBrixInput}
            refractometerAlcoholCalc={refractometerAlcoholCalc}
            hotelCultureType={hotelCultureType}
            setHotelCultureType={setHotelCultureType}
            hotelDaysSinceFed={hotelDaysSinceFed}
            setHotelDaysSinceFed={setHotelDaysSinceFed}
            hotelVolumeMl={hotelVolumeMl}
            setHotelVolumeMl={setHotelVolumeMl}
            hotelSludgeDepthCm={hotelSludgeDepthCm}
            setHotelSludgeDepthCm={setHotelSludgeDepthCm}
            cultureHotelCalc={cultureHotelCalc}
            cbVesselLiters={cbVesselLiters}
            setCbVesselLiters={setCbVesselLiters}
            cbDrawLiters={cbDrawLiters}
            setCbDrawLiters={setCbDrawLiters}
            cbTempCelsius={cbTempCelsius}
            setCbTempCelsius={setCbTempCelsius}
            cbCyclesSincePurge={cbCyclesSincePurge}
            setCbCyclesSincePurge={setCbCyclesSincePurge}
            cbPreDrawPh={cbPreDrawPh}
            setCbPreDrawPh={setCbPreDrawPh}
            cbTeaBase={cbTeaBase}
            setCbTeaBase={setCbTeaBase}
            continuousBrewPlan={continuousBrewPlan}
            puCategory={puCategory}
            setPuCategory={setPuCategory}
            puWaterBathTempC={puWaterBathTempC}
            setPuWaterBathTempC={setPuWaterBathTempC}
            puHoldMinutes={puHoldMinutes}
            setPuHoldMinutes={setPuHoldMinutes}
            puBottleVolumeMl={puBottleVolumeMl}
            setPuBottleVolumeMl={setPuBottleVolumeMl}
            puPlanCalc={puPlanCalc}
            vinRawAcidity={vinRawAcidity}
            setVinRawAcidity={setVinRawAcidity}
            vinRawVolumeL={vinRawVolumeL}
            setVinRawVolumeL={setVinRawVolumeL}
            vinTargetAcidity={vinTargetAcidity}
            setVinTargetAcidity={setVinTargetAcidity}
            vinVesselDiameterCm={vinVesselDiameterCm}
            setVinVesselDiameterCm={setVinVesselDiameterCm}
            vinInitialAbv={vinInitialAbv}
            setVinInitialAbv={setVinInitialAbv}
            vinegarStdCalc={vinegarStdCalc}
            vinegarStoichCalc={vinegarStoichCalc}
            vinegarAerationCalc={vinegarAerationCalc}
            kefirMedium={kefirMedium}
            setKefirMedium={setKefirMedium}
            kefirLiquidVolumeMl={kefirLiquidVolumeMl}
            setKefirLiquidVolumeMl={setKefirLiquidVolumeMl}
            kefirGrainWeightGrams={kefirGrainWeightGrams}
            setKefirGrainWeightGrams={setKefirGrainWeightGrams}
            kefir1FCalc={kefir1FCalc}
            kefir2FCalc={kefir2FCalc}
            meadGrade={meadGrade}
            setMeadGrade={setMeadGrade}
            meadTargetVolumeL={meadTargetVolumeL}
            setMeadTargetVolumeL={setMeadTargetVolumeL}
            meadPrepType={meadPrepType}
            setMeadPrepType={setMeadPrepType}
            meadCalc={meadCalc}
            gbStarterDays={gbStarterDays}
            setGbStarterDays={setGbStarterDays}
            gbDaysSinceFeed={gbDaysSinceFeed}
            setGbDaysSinceFeed={setGbDaysSinceFeed}
            gbHasBubbles={gbHasBubbles}
            setGbHasBubbles={setGbHasBubbles}
            gbBatchVolumeL={gbBatchVolumeL}
            setGbBatchVolumeL={setGbBatchVolumeL}
            gbHoursInBottle={gbHoursInBottle}
            setGbHoursInBottle={setGbHoursInBottle}
            gingerBugStarterCalc={gingerBugStarterCalc}
            gingerBeerBatchCalc={gingerBeerBatchCalc}
          />
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

