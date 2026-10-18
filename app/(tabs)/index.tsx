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
  AppState,
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
  enableProcessKeepAwake,
  disableProcessKeepAwake,
  playTimerCompletionAlert,
  triggerHapticFeedback,
} from '../../src/lib/timer-audio';
import * as Clipboard from 'expo-clipboard';
import {
  CANONICAL_RECIPES,
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
} from '../../src/core/brine-topup';
import {
  encodeRecipeToShareUri,
  decodeRecipeFromShareUri,
} from '../../src/core/recipe-share';
import {
  calculateCurdAndMoldFitting,
} from '../../src/core/mold-sizing';
import {
  calculateDutchLeverPress,
  generatePressingCascadeProgram,
} from '../../src/core/press-cascade';
import {
  calculateBrineAcidification,
} from '../../src/core/brine-acidification';
import {
  calculateCurdWashWater,
  calculateCurdMillingSalting,
  calculateWheelCoating,
} from '../../src/core/curd-washing-and-salting';
import { calculateCheeseComposition } from '../../src/core/cheese-composition-engine';
import { calculateBrineDiffusion } from '../../src/core/brine-diffusion';
import {
  calculateWheyLevainPlan,
  WheyLevainType,
} from '../../src/core/whey-levain-engine';
import {
  calculateCurdSyneresis,
  CheeseStyleSyneresis,
} from '../../src/core/curd-syneresis';
import {
  calculateMilkSpeciesKinetics,
  MilkSpeciesId,
} from '../../src/core/milk-species-profile';
import {
  calculateBrineDensitometry,
  BRINE_TARGET_PROFILES,
  BrineTargetProfileKey,
} from '../../src/core/brine-densitometry';
import { styles } from '../../src/components/calculator/calculator.styles';
import { CanonicalRecipesCard } from '../../src/components/calculator/CanonicalRecipesCard';
import { ReverseSchedulerCard } from '../../src/components/calculator/ReverseSchedulerCard';
import { CheeseCraftSection } from '../../src/components/calculator/CheeseCraftSection';

export default function CalculatorScreen() {
  const {
    isPaywallVisible,
    setPaywallVisible,
    requireActionAccess,
    subscribe,
    restorePurchases,
  } = useAppAccess();

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

  // --- CANONICAL RECIPES & SCHEDULER ---
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

  // --- BRINE ACIDIFICATION & BUFFER ---
  const [brineWaterPh, setBrineWaterPh] = useState<number>(7.5);
  const [targetBrinePh, setTargetBrinePh] = useState<number>(5.2);
  const [lacticAcidConc, setLacticAcidConc] = useState<number>(80);

  // --- CURD WASHING, CHEDDAR SALTING & COATING ---
  const [washWheyDrainedLiters, setWashWheyDrainedLiters] = useState<number>(3.0);
  const [washHotWaterTempC, setWashHotWaterTempC] = useState<number>(60);
  const [washTargetTempC, setWashTargetTempC] = useState<number>(37);
  const [cheddarCurdGrams, setCheddarCurdGrams] = useState<number>(1050);
  const [cheddarTargetSalinityPct, setCheddarTargetSalinityPct] = useState<number>(2.0);
  const [coatingType, setCoatingType] = useState<'CHEESE_WAX' | 'POLYVINYL_BREATHABLE'>('CHEESE_WAX');
  const [coatingWheelHeightCm, setCoatingWheelHeightCm] = useState<number>(8.0);
  const [coatingLayers, setCoatingLayers] = useState<number>(2);

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

  // --- CURD SYNERESIS & CASEIN SHRINKAGE KINETICS ---
  const [syneresisStyle, setSyneresisStyle] = useState<CheeseStyleSyneresis>('GOUDA_EDAM');
  const [syneresisCutSizeMm, setSyneresisCutSizeMm] = useState<number>(8);
  const [syneresisInitTempC, setSyneresisInitTempC] = useState<number>(31);
  const [syneresisTargetTempC, setSyneresisTargetTempC] = useState<number>(38);
  const [syneresisHeatingMinutes, setSyneresisHeatingMinutes] = useState<number>(20);
  const [syneresisStirMinutes, setSyneresisStirMinutes] = useState<number>(25);
  const [syneresisDrainPh, setSyneresisDrainPh] = useState<number>(6.40);

  // --- BRINE DENSITOMETRY & HYDROMETER TEMP COMPENSATION ---
  const [brineDensityUnit, setBrineDensityUnit] = useState<'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY'>('PERCENT_WT');
  const [brineMeasuredValue, setBrineMeasuredValue] = useState<number>(20.0);
  const [brineSampleTempC, setBrineSampleTempC] = useState<number>(12.0);
  const [brineTargetProfile, setBrineTargetProfile] = useState<BrineTargetProfileKey>('HARD_CHEESE_HEAVY');
  const [brineVolumeLitersInput, setBrineVolumeLitersInput] = useState<number>(10.0);

  // Active Flocculation Timer (Background-resilient via absolute timestamp & AppState sync)
  const [timerStartMs, setTimerStartMs] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerStartMs !== null) {
      const syncElapsed = () => {
        const elapsed = Math.max(0, Math.floor((Date.now() - timerStartMs) / 1000));
        setTimerSeconds(elapsed);
      };

      syncElapsed();
      interval = setInterval(syncElapsed, 1000);

      const sub = AppState.addEventListener('change', (nextState) => {
        if (nextState === 'active') {
          syncElapsed();
        }
      });

      return () => {
        if (interval) clearInterval(interval);
        sub.remove();
      };
    }
  }, [isTimerRunning, timerStartMs]);

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
    const now = Date.now();
    setTimerStartMs(now);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    if (!isKeepAwake) {
      toggleKeepAwake(true);
    }
  };

  const handleStopTimer = () => {
    triggerHapticFeedback();
    setIsTimerRunning(false);
    const finalElapsed = timerStartMs ? Math.max(0, Math.floor((Date.now() - timerStartMs) / 1000)) : timerSeconds;
    setTimerSeconds(finalElapsed);
    setTimerStartMs(null);
    playTimerCompletionAlert();
    setFlocSecInput(finalElapsed);
  };

  const handleSelectRecipe = (recipe: CanonicalRecipe) => {
    triggerHapticFeedback();
    setSelectedRecipeId(recipe.id);
    setMilkLiters(10);
    setSchedulerProcess('CHEESE_HARD_GOUDA');
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
    } catch (err) {
      const message = err instanceof Error ? err.message : t('Nieprawidłowe dane receptury.');
      Alert.alert(t('Błąd Importu'), message);
    }
  };

  // Calculations
  const rennetCalc = calculateRennetDose(milkLiters, 40, 200);
  const cacl2Calc = calculateCacl2Dose(milkLiters, 'STORE_MICROFILTERED');
  const flocCalc = calculateFlocculationCutTime(flocSecInput, flocMultiplier);
  const pressCalc = calculatePressPressure(pressWeightKg, moldDiamCm, leverRatio);
  const brineCalc = calculateBrineComposition(brineWaterLiters, brineSalinityPct);
  const cookingRampCalc = calculateCurdCookingMinTime(cookStartTemp, cookEndTemp, cookDurationMin);

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

  const activeRecipes = getRecipesByCategory('CHEESE');
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
  const brineAcidCalc = calculateBrineAcidification({
    brineWaterLiters,
    initialWaterPh: brineWaterPh,
    targetPh: targetBrinePh,
    lacticAcidConcentrationPct: lacticAcidConc,
    targetSalinityPct: brineSalinityPct,
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

  const handleSaveBatch = () => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const now = Date.now();
      const code = `BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const name = selectedRecipe
        ? selectedRecipe.name
        : `${t('Ser')} ${milkType === 'COW' ? t('Krowi') : milkType === 'GOAT' ? t('Kozi') : t('Owcza')} (${milkLiters}L)`;
      const category: Batch['category'] = 'CHEESE';

      // Prepare recipe requirements for auto-depletion (BR-MAG-005)
      const requirements: RecipeRequirement[] = [];

      if (selectedRecipe) {
        for (const ing of selectedRecipe.ingredients) {
          if (['MILK', 'RENNET', 'CULTURE', 'SALT', 'MINERAL'].includes(ing.category)) {
            requirements.push({
              name: ing.name,
              category: ing.category as RecipeRequirement['category'],
              quantity: Math.round(ing.quantityPerUnit * milkLiters * 100) / 100,
              unit: ing.unit,
            });
          }
        }
      } else {
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

  const handleTransferToCave = async () => {
    triggerHapticFeedback();
    const store = getSqliteStore();
    const now = Date.now();
    const wheelWeightGrams = Math.round(milkLiters * 100);
    const wheelName = selectedRecipe?.name || `${t('Ser')} #${now.toString().slice(-4)}`;

    await store.saveCaveWheel({
      id: `wheel_${now}`,
      batchId: `batch_${now}`,
      wheelTag: wheelName,
      locationInCave: 'Półka A1',
      initialWeightGrams: wheelWeightGrams,
      currentWeightGrams: wheelWeightGrams,
      rindType: 'NATURAL',
      targetAgingDays: 60,
      lastTurnedAt: now,
      shrinkagePct: 0,
    });

    Alert.alert(
      t('Przekazano do Dojrzewalni!'),
      `${wheelName}\n${t('Waga początkowa:')} ${wheelWeightGrams} g\n${t('Krążek czeka w Zakładce 3 (Dojrzewalnia).')}`,
      [{ text: t('OK') }]
    );
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
                minHeight: 48,
                minWidth: 48,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{t('Zamknij')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>SEROWAR</Text>
          <Text style={styles.appSubtitle}>{t('Rzemieślniczy Warsztat Serowarski')}</Text>
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

        {/* CHEESEMAKING WORKSHOP */}
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

        {/* Direct Handoff CTA to Cave Log (BR-BPR-001) */}
        <TouchableOpacity
          style={[styles.saveBatchButton, { backgroundColor: '#B86D3B', marginTop: 16 }]}
          onPress={handleTransferToCave}
          accessibilityRole="button"
        >
          <Text style={styles.saveBatchButtonText}>
            🏔️ {t('Przenieś krążek do Dojrzewalni (Cave Log)')}
          </Text>
        </TouchableOpacity>

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

