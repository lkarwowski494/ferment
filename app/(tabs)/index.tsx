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
  const [milkType, setMilkType] = useState<'COW' | 'GOAT' | 'SHEEP'>('COW');
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

      Alert.alert(
        t('Partia Zapisana!'),
        `${name}\n${t('Numer partii:')} ${code}`,
        [{ text: t('OK') }]
      );
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
                {(['COW', 'GOAT', 'SHEEP'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typePill, milkType === type && styles.typePillActive]}
                    onPress={() => {
                      triggerHapticFeedback();
                      setMilkType(type);
                    }}
                  >
                    <Text style={[styles.typePillText, milkType === type && styles.typePillTextActive]}>
                      {type === 'COW' ? t('Krowie') : type === 'GOAT' ? t('Kozie') : t('Owcze')}
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

                {/* 3. Saturated Brine Buffer */}
                <View style={styles.proCard}>
                  <Text style={styles.proCardTitle}>🧂 {t('Zbuforowana Solanka Serowarska')}</Text>
                  <Text style={styles.proCardDesc}>
                    {t('Woda:')} {brineWaterLiters}L | {t('Stężenie:')} {brineSalinityPct}% NaCl
                  </Text>
                  <View style={styles.brineResultBox}>
                    <Text style={styles.brineText}>
                      • {t('Ilość soli:')} <Text style={styles.boldText}>{brineCalc.saltKg} kg</Text>
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Dodatek CaCl2:')} <Text style={styles.boldText}>{brineCalc.cacl2DryGrams}g</Text> ({t('zapobiega mięknięciu skórki')})
                    </Text>
                    <Text style={styles.brineText}>
                      • {t('Docelowe pH:')} <Text style={styles.boldText}>5.20 – 5.40</Text>
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
                {/* 2F Pressure Guard */}
                <View style={[styles.proCard, kombucha2F.riskLevel === 'EXPLOSION_HAZARD' && styles.cardDanger]}>
                  <Text style={styles.proCardTitle}>🍾 {t('Kombucha 2F Bottle Pressure Guard')}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.inlineLabel}>{t('Cukier resztkowy / owocowy (g/L):')}</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      value={String(residualSugar)}
                      onChangeText={(v) => setResidualSugar(parseFloat(v) || 0)}
                    />
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
                      {t('Szacowane CO2:')} <Text style={styles.boldText}>{kombucha2F.estimatedCo2Volumes} vol</Text>
                    </Text>
                    <Text style={[styles.riskAlertText, kombucha2F.riskLevel === 'EXPLOSION_HAZARD' && styles.riskAlertDanger]}>
                      {kombucha2F.message}
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
