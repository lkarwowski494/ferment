// ============================================================================
// Apps4Brew Studio — FERMENT Batches & Cave Aging Log (Cave Log)
// Wheel aging management, shrinkage tracking, turn/wash schedules & QR scanner
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { useAppAccess } from '../../src/lib/app-access';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { QrScannerModal } from '../../src/components/QrScannerModal';
import {
  getSqliteStore,
  Batch,
  CaveWheel,
  CaveActionLog,
  SensoryEvaluation,
} from '../../src/data/sqlite-store';
import { createAutoBackup } from '../../src/lib/backup';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';
import {
  analyzeCaveEnvironment,
  getAffinageSchedule,
  CheeseCaveType,
} from '../../src/core/cave-environment';
import {
  recordAffinageAction,
  CaveActionType,
} from '../../src/core/cave-log-actions';
import {
  evaluateSensoryProfile,
  SensoryProfileScores,
} from '../../src/core/sensory-evaluation';
import { parseDeepLinkOrQr } from '../../src/core/qr-deeplink';
import {
  generateBatchesCsv,
  generateCaveWheelsCsv,
  shareCsvExport,
} from '../../src/lib/csv-export';
import { calculateFermentationStatistics } from '../../src/core/fermentation-statistics';
import { getTimelineForBatch } from '../../src/core/fermentation-timeline';

export default function BatchesScreen() {
  const {
    isPaywallVisible,
    setPaywallVisible,
    requireActionAccess,
    subscribe,
    restorePurchases,
  } = useAppAccess();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [caveWheels, setCaveWheels] = useState<CaveWheel[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CHEESE' | 'VEG' | 'BEV'>('ALL');
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'batches' | 'cave'>('batches');

  // Weighing modal state
  const [weighWheelId, setWeighWheelId] = useState<string | null>(null);
  const [newWeightInput, setNewWeightInput] = useState<string>('');

  // Cave Environment Psychrometry State
  const [isCaveEnvOpen, setIsCaveEnvOpen] = useState<boolean>(true);
  const [caveTemp, setCaveTemp] = useState<number>(12);
  const [caveRh, setCaveRh] = useState<number>(85);
  const [caveType, setCaveType] = useState<CheeseCaveType>('HARD_GOUDA_CHEDDAR');

  // Sensory Evaluation State
  const [evaluatingBatch, setEvaluatingBatch] = useState<Batch | null>(null);
  const [sensoryScores, setSensoryScores] = useState<SensoryProfileScores>({
    acidity: 5,
    salinity: 5,
    firmness: 5,
    creaminess: 5,
    pungency: 2,
    nuttiness: 5,
  });
  const [sensoryNotes, setSensoryNotes] = useState<string>('');
  const [sensoryEvaluationsMap, setSensoryEvaluationsMap] = useState<Record<string, SensoryEvaluation>>({});

  // Cave Action History state
  const [expandedWheelHistoryId, setExpandedWheelHistoryId] = useState<string | null>(null);
  const [wheelActionsMap, setWheelActionsMap] = useState<Record<string, CaveActionLog[]>>({});

  // Artisan Statistics Dashboard State
  const [isStatsExpanded, setIsStatsExpanded] = useState<boolean>(true);

  const caveEnvResult = analyzeCaveEnvironment({
    tempCelsius: caveTemp,
    relativeHumidityPct: caveRh,
    caveType,
  });
  const affinageSchedule = getAffinageSchedule(caveType);
  const fermentationStats = calculateFermentationStatistics(batches, caveWheels);

  const loadData = useCallback(async () => {
    const store = getSqliteStore();
    const b = await store.getBatches();
    const w = await store.getCaveWheels();
    setBatches(b);
    setCaveWheels(w);

    const sMap: Record<string, SensoryEvaluation> = {};
    for (const batch of b) {
      const evalObj = await store.getSensoryEvaluation(batch.id);
      if (evalObj) sMap[batch.id] = evalObj;
    }
    setSensoryEvaluationsMap(sMap);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleWheelHistory = async (wheelId: string) => {
    triggerHapticFeedback();
    if (expandedWheelHistoryId === wheelId) {
      setExpandedWheelHistoryId(null);
    } else {
      const store = getSqliteStore();
      const acts = await store.getCaveActions(wheelId);
      setWheelActionsMap((prev) => ({ ...prev, [wheelId]: acts }));
      setExpandedWheelHistoryId(wheelId);
    }
  };

  const handleAffinageAction = (
    wheel: CaveWheel,
    actionType: CaveActionType,
    weight?: number,
    notes?: string
  ) => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const { updatedWheel, actionLog, alert } = recordAffinageAction(
        wheel,
        actionType,
        weight,
        notes,
        Date.now()
      );
      const store = getSqliteStore();
      await store.saveCaveWheel(updatedWheel);
      await store.logCaveAction(actionLog);
      await createAutoBackup();
      await loadData();

      if (expandedWheelHistoryId === wheel.id) {
        const acts = await store.getCaveActions(wheel.id);
        setWheelActionsMap((prev) => ({ ...prev, [wheel.id]: acts }));
      }

      if (alert) {
        Alert.alert(t('Ostrzeżenie o ubytku wagi'), alert);
      } else {
        const titles: Record<CaveActionType, string> = {
          TURN: t('Krążek Obrócony'),
          WASH_BRINE: t('Krążek Przemyty'),
          DRY_BRUSH: t('Krążek Oczyszczony'),
          WAX_COATING: t('Krążek Zawoskowany'),
          CLOTHBOUND: t('Bandażowanie Zapisane'),
          WEIGH: t('Ważenie Zapisane!'),
        };
        Alert.alert(
          titles[actionType] || t('Akcja Zapisana'),
          `${wheel.wheelTag}: ${t('Zapisano wpis w dzienniku piwniczki.')}`
        );
      }
    });
  };

  const handleSaveWeight = (wheel: CaveWheel) => {
    const weightNum = parseFloat(newWeightInput);
    if (!weightNum || weightNum <= 0) {
      Alert.alert(t('Błąd'), t('Wpisz prawidłową wagę w gramach.'));
      return;
    }
    setWeighWheelId(null);
    setNewWeightInput('');
    handleAffinageAction(wheel, 'WEIGH', weightNum);
  };

  const handleDeleteWheel = (wheel: CaveWheel) => {
    requireActionAccess(() => {
      Alert.alert(
        t('Usuń krążek z piwniczki'),
        `${t('Czy na pewno chcesz usunąć krążek')} ${wheel.wheelTag}?`,
        [
          { text: t('Anuluj'), style: 'cancel' },
          {
            text: t('Usuń'),
            style: 'destructive',
            onPress: async () => {
              triggerHapticFeedback();
              const store = getSqliteStore();
              await store.deleteCaveWheel(wheel.id);
              await createAutoBackup();
              await loadData();
            },
          },
        ]
      );
    });
  };

  const handleUpdateBatchStatus = (batch: Batch, newStatus: Batch['status']) => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      await store.updateBatchStatus(batch.id, newStatus);
      await createAutoBackup();
      await loadData();
      Alert.alert(t('Status Zaktualizowany'), `${batch.batchNumber}: ${newStatus}`);
    });
  };

  const handleDeleteBatch = (batch: Batch) => {
    requireActionAccess(() => {
      Alert.alert(
        t('Usuń Partię'),
        `${t('Czy na pewno chcesz usunąć partię')} ${batch.batchNumber} (${batch.styleName})?`,
        [
          { text: t('Anuluj'), style: 'cancel' },
          {
            text: t('Usuń'),
            style: 'destructive',
            onPress: async () => {
              triggerHapticFeedback();
              const store = getSqliteStore();
              await store.deleteBatch(batch.id);
              await createAutoBackup();
              await loadData();
            },
          },
        ]
      );
    });
  };

  const handleSaveSensory = () => {
    if (!evaluatingBatch) return;
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const result = evaluateSensoryProfile(evaluatingBatch.category, sensoryScores);
      const store = getSqliteStore();
      const evaluation: SensoryEvaluation = {
        id: `sensory_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        batchId: evaluatingBatch.id,
        evaluatedAt: Date.now(),
        acidity: sensoryScores.acidity,
        salinity: sensoryScores.salinity,
        firmness: sensoryScores.firmness,
        creaminess: sensoryScores.creaminess,
        pungency: sensoryScores.pungency,
        nuttiness: sensoryScores.nuttiness,
        overallScore: result.overallScore,
        grade: result.grade,
        flawsIdentified: JSON.stringify(result.identifiedFlaws),
        notes: sensoryNotes || result.balanceAssessment,
      };
      await store.saveSensoryEvaluation(evaluation);
      await createAutoBackup();
      setEvaluatingBatch(null);
      setSensoryNotes('');
      await loadData();
      Alert.alert(
        t('Ocena Sensoryczna Zapisana!'),
        `${result.overallScore}/100 pkt (${result.grade})\n${result.balanceAssessment}`
      );
    });
  };

  const filteredBatches = batches.filter((b) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CHEESE') return b.category === 'CHEESE';
    if (selectedFilter === 'VEG') return b.category === 'VEG_FERMENT' || b.category === 'KIMCHI';
    if (selectedFilter === 'BEV') return b.category === 'KOMBUCHA' || b.category === 'VINEGAR';
    return true;
  });

  const liveSensoryResult = evaluatingBatch
    ? evaluateSensoryProfile(evaluatingBatch.category, sensoryScores)
    : null;

  const handleQrScanResult = (scannedCode: string) => {
    setIsScannerVisible(false);
    triggerHapticFeedback();

    const parsed = parseDeepLinkOrQr(scannedCode);
    const targetId = (parsed.id || parsed.raw || '').toLowerCase().trim();

    // Check if matching wheel
    const matchedWheel = caveWheels.find(
      (w) => w.id.toLowerCase() === targetId || w.wheelTag.toLowerCase() === targetId
    );

    // Check if matching batch
    const matchedBatch = batches.find(
      (b) => b.id.toLowerCase() === targetId || b.batchNumber.toLowerCase() === targetId
    );

    if (parsed.type === 'wheel' || (matchedWheel && !matchedBatch)) {
      if (matchedWheel) {
        setActiveTabSection('cave');
        toggleWheelHistory(matchedWheel.id);
        Alert.alert(
          `${t('Znaleziono Krążek:')} ${matchedWheel.wheelTag}`,
          `${t('Waga:')} ${matchedWheel.currentWeightGrams}g | ${t('Ubytek:')} ${matchedWheel.shrinkagePct.toFixed(1)}%\n${t('Wybierz szybką akcję pielęgnacyjną:')}`,
          [
            { text: t('Obróć'), onPress: () => handleAffinageAction(matchedWheel, 'TURN') },
            { text: t('Zważ'), onPress: () => setWeighWheelId(matchedWheel.id) },
            { text: t('OK'), style: 'cancel' },
          ]
        );
      } else {
        Alert.alert(
          t('Nie Znaleziono Krążka'),
          `${t('Nie odnaleziono krążka o identyfikatorze:')} ${parsed.id || scannedCode}`
        );
      }
      return;
    }

    if (parsed.type === 'batch' || matchedBatch) {
      if (matchedBatch) {
        setActiveTabSection('batches');
        Alert.alert(
          `${t('Znaleziono Partię:')} ${matchedBatch.batchNumber}`,
          `${matchedBatch.styleName}\n${t('Status:')} ${matchedBatch.status}\n${t('Czy chcesz otworzyć ocenę sensoryczną tej partii?')}`,
          [
            {
              text: t('⭐ Oceń Sensorycznie'),
              onPress: () => {
                setEvaluatingBatch(matchedBatch);
              },
            },
            { text: t('OK'), style: 'cancel' },
          ]
        );
      } else {
        Alert.alert(
          t('Nie Znaleziono Partii'),
          `${t('Nie odnaleziono partii o identyfikatorze:')} ${parsed.id || scannedCode}`
        );
      }
      return;
    }

    // Fallback for general QR code
    Alert.alert(t('Odczytano Kod QR'), `${t('Dane:')} ${scannedCode}`);
  };

  const handleExportCsv = async () => {
    triggerHapticFeedback();
    if (activeTabSection === 'batches') {
      const csv = generateBatchesCsv(batches);
      await shareCsvExport(`ferment_partie_${new Date().toISOString().slice(0, 10)}.csv`, csv);
    } else {
      const csv = generateCaveWheelsCsv(caveWheels);
      await shareCsvExport(`ferment_piwniczka_${new Date().toISOString().slice(0, 10)}.csv`, csv);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('Dziennik Partii & Cave Log')}</Text>
          <Text style={styles.headerSub}>
            {batches.length} {t('partii')} | {caveWheels.length} {t('krążków w piwniczce')}
          </Text>
        </View>

        <View style={styles.headerBtnRow}>
          <TouchableOpacity
            style={styles.csvButton}
            onPress={handleExportCsv}
            accessibilityRole="button"
          >
            <Text style={styles.csvButtonText}>📤 CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => {
              triggerHapticFeedback();
              setIsScannerVisible(true);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.qrButtonText}>📷 QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Switch between Batches and Cave Log */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sectionTab, activeTabSection === 'batches' && styles.sectionTabActive]}
          onPress={() => {
            triggerHapticFeedback();
            setActiveTabSection('batches');
          }}
        >
          <Text style={[styles.sectionTabText, activeTabSection === 'batches' && styles.sectionTabTextActive]}>
            📋 {t('Wszystkie Partie')} ({batches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTab, activeTabSection === 'cave' && styles.sectionTabActive]}
          onPress={() => {
            triggerHapticFeedback();
            setActiveTabSection('cave');
          }}
        >
          <Text style={[styles.sectionTabText, activeTabSection === 'cave' && styles.sectionTabTextActive]}>
            🧀 {t('Piwniczka Sera (Cave Log)')} ({caveWheels.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* =================================================================== */}
        {/* BATCHES VIEW */}
        {/* =================================================================== */}
        {activeTabSection === 'batches' && (
          <View>
            {/* Artisan Analytics & Productivity Dashboard */}
            <View style={styles.statsCard}>
              <TouchableOpacity
                style={styles.statsCardHeader}
                onPress={() => {
                  triggerHapticFeedback();
                  setIsStatsExpanded(!isStatsExpanded);
                }}
                accessibilityRole="button"
              >
                <View>
                  <Text style={styles.statsCardTitle}>📊 {t('Statystyki Produkcji & Rzemiosła')}</Text>
                  <Text style={styles.statsCardSub}>
                    {batches.length} {t('partii łącznie')} • {fermentationStats.successRatePct}% {t('sukcesu')}
                  </Text>
                </View>
                <Text style={styles.statsToggleText}>{isStatsExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isStatsExpanded && (
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{fermentationStats.totalBatches}</Text>
                    <Text style={styles.statBoxLabel}>{t('Partie Razem')}</Text>
                    <Text style={styles.statBoxSub}>
                      {fermentationStats.activeBatches} {t('akt.')} / {fermentationStats.completedBatches} {t('zak.')}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{fermentationStats.successRatePct}%</Text>
                    <Text style={styles.statBoxLabel}>{t('Wskaźnik Sukcesu')}</Text>
                    <Text style={styles.statBoxSub}>
                      {fermentationStats.completedBatches}/{fermentationStats.totalBatches || 1} {t('udanych')}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{fermentationStats.totalMilkVolumeL} L</Text>
                    <Text style={styles.statBoxLabel}>{t('Przetworzone Mleko')}</Text>
                    <Text style={styles.statBoxSub}>
                      {fermentationStats.cheeseBatches} {t('warzeń sera')}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{fermentationStats.activeCaveWheels}</Text>
                    <Text style={styles.statBoxLabel}>{t('Krążki w Piwnicy')}</Text>
                    <Text style={styles.statBoxSub}>
                      {fermentationStats.totalCaveWeightKg.toFixed(1)} kg {t('dojrzewa')}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>
                      {fermentationStats.evaluatedCount > 0 ? `${fermentationStats.avgSensoryScore}/100` : '-'}
                    </Text>
                    <Text style={styles.statBoxLabel}>{t('Średnia Ocena')}</Text>
                    <Text style={styles.statBoxSub}>
                      {fermentationStats.evaluatedCount} {t('ocenionych partii')}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={[styles.statBoxVal, { color: '#166534' }]}>
                      ~{fermentationStats.estimatedTotalSavingsPln} zł
                    </Text>
                    <Text style={styles.statBoxLabel}>{t('Oszczędność vs Sklep')}</Text>
                    <Text style={styles.statBoxSub}>{t('70-85% oszczędności')}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Filter Pills */}
            <View style={styles.filterRow}>
              {(['ALL', 'CHEESE', 'VEG', 'BEV'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterPill, selectedFilter === filter && styles.filterPillActive]}
                  onPress={() => {
                    triggerHapticFeedback();
                    setSelectedFilter(filter);
                  }}
                >
                  <Text style={[styles.filterPillText, selectedFilter === filter && styles.filterPillTextActive]}>
                    {filter === 'ALL'
                      ? t('Wszystkie')
                      : filter === 'CHEESE'
                      ? t('Sery')
                      : filter === 'VEG'
                      ? t('Kiszonki')
                      : t('Napoje')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredBatches.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🧀</Text>
                <Text style={styles.emptyTitle}>{t('Brak zapisanych partii')}</Text>
                <Text style={styles.emptyDesc}>
                  {t('Przejdź do zakładki Kalkulator, aby stworzyć swój pierwszy ser, kiszonkę lub kombuchę.')}
                </Text>
              </View>
            ) : (
              filteredBatches.map((b) => {
                const isEvaluating = evaluatingBatch?.id === b.id;
                const existingSensory = sensoryEvaluationsMap[b.id];
                const statuses: Batch['status'][] = [
                  'PREPARING',
                  'COAGULATING',
                  'PRESSING',
                  'BRINING',
                  'AGING',
                  'COMPLETED',
                ];

                return (
                  <View key={b.id} style={styles.batchCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.batchCode}>{b.batchNumber}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{b.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.batchTitle}>{b.styleName}</Text>
                    <Text style={styles.batchDate}>
                      {t('Data nastawienia:')} {new Date(b.createdAt).toLocaleDateString()}
                    </Text>

                    {/* Status Row & Switcher */}
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>{t('Status:')}</Text>
                      <Text style={styles.statusValue}>{b.status}</Text>
                    </View>

                    <Text style={[styles.statusLabel, { marginTop: 8, marginBottom: 4 }]}>
                      {t('Zmień status:')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusPillsScroll}>
                      {statuses.map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[styles.statusPill, b.status === st && styles.statusPillActive]}
                          onPress={() => handleUpdateBatchStatus(b, st)}
                        >
                          <Text style={[styles.statusPillText, b.status === st && styles.statusPillTextActive]}>
                            {st}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* Dynamic Fermentation Timeline & Jar Burping Scheduler */}
                    {b.status !== 'COMPLETED' && b.status !== 'DISCARDED' && (() => {
                      const timeline = getTimelineForBatch(b);
                      const now = Date.now();
                      const upcomingMilestone =
                        timeline.milestones.find((m) => m.estimatedTimestamp > now) ||
                        timeline.milestones[timeline.milestones.length - 1];

                      return (
                        <View style={styles.timelineBadgeBox}>
                          <View style={styles.timelineHeaderRow}>
                            <Text style={styles.timelineTitle}>
                              ⏱️ {t('Harmonogram:')} {timeline.adjustedDays} {t('dni')} ({timeline.speedMultiplier}x {t('tempo')})
                            </Text>
                            {timeline.burpingDays.length > 0 && (
                              <View style={styles.burpTag}>
                                <Text style={styles.burpTagText}>
                                  💨 {t('Odgazowanie 1-')}
                                  {timeline.burpingDays.length} {t('d')}
                                </Text>
                              </View>
                            )}
                          </View>
                          {upcomingMilestone && (
                            <View style={styles.timelineNextStepRow}>
                              <Text style={styles.timelineNextStepTitle}>
                                📍 {t('Następny krok:')} {upcomingMilestone.title} ({upcomingMilestone.formattedDate})
                              </Text>
                              <Text style={styles.timelineNextStepDesc}>
                                {upcomingMilestone.description}
                              </Text>
                            </View>
                          )}
                          <Text style={styles.timelineAdvice}>{timeline.summaryAdvicePl}</Text>
                        </View>
                      );
                    })()}

                    {/* Existing Sensory Summary */}
                    {existingSensory && !isEvaluating && (
                      <View style={styles.sensorySummaryBadge}>
                        <Text style={styles.sensorySummaryText}>
                          ⭐ {t('Ocena sensoryczna:')} {existingSensory.overallScore}/100 pkt
                        </Text>
                        {existingSensory.notes ? (
                          <Text style={styles.sensorySummaryNotes}>{existingSensory.notes}</Text>
                        ) : null}
                      </View>
                    )}

                    {/* Action Buttons for Batch: Sensory & Delete */}
                    <View style={styles.batchActionsRow}>
                      <TouchableOpacity
                        style={[styles.batchSmallBtn, isEvaluating && styles.batchSmallBtnActive]}
                        onPress={() => {
                          triggerHapticFeedback();
                          if (isEvaluating) {
                            setEvaluatingBatch(null);
                          } else {
                            setEvaluatingBatch(b);
                            if (existingSensory) {
                              setSensoryScores({
                                acidity: existingSensory.acidity,
                                salinity: existingSensory.salinity,
                                firmness: existingSensory.firmness,
                                creaminess: existingSensory.creaminess,
                                pungency: existingSensory.pungency,
                                nuttiness: existingSensory.nuttiness,
                              });
                              setSensoryNotes(existingSensory.notes || existingSensory.tastingNotes || '');
                            }
                          }
                        }}
                        accessibilityRole="button"
                      >
                        <Text style={[styles.batchSmallBtnText, isEvaluating && styles.batchSmallBtnTextActive]}>
                          {isEvaluating ? t('⭐ Zamknij ocenę') : t('⭐ Ocena sensoryczna')}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.batchDeleteBtn}
                        onPress={() => handleDeleteBatch(b)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.batchDeleteBtnText}>🗑️ {t('Usuń')}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Inline Sensory Scorecard when evaluating this batch */}
                    {isEvaluating && liveSensoryResult && (
                      <View style={styles.sensoryScorecard}>
                        <Text style={styles.sensoryTitle}>
                          🔬 {t('Profil Sensoryczny & Balans Organoleptyczny')}
                        </Text>
                        <Text style={styles.sensorySub}>
                          {t('6-osiowy profil smakowo-teksturalny i analiza wad rzemieślniczych')}
                        </Text>

                        <View style={styles.sensoryScoreBanner}>
                          <Text style={styles.sensoryScoreLarge}>
                            {liveSensoryResult.overallScore}/100 pkt
                          </Text>
                          <Text style={styles.sensoryGradeBadge}>
                            {liveSensoryResult.grade}
                          </Text>
                          <Text style={styles.sensoryAssessment}>
                            {liveSensoryResult.balanceAssessment}
                          </Text>
                        </View>

                        {/* 6 Stepper Rows */}
                        {[
                          { key: 'acidity' as const, label: t('Kwasowość (1-10):') },
                          { key: 'salinity' as const, label: t('Słoność (1-10):') },
                          { key: 'firmness' as const, label: t('Zwartość / Chrupkość (1-10):') },
                          { key: 'creaminess' as const, label: t('Kremowość / Tekstura (1-10):') },
                          { key: 'pungency' as const, label: t('Pikantność / Ostrość (1-10):') },
                          { key: 'nuttiness' as const, label: t('Orzechowość / Czystość (1-10):') },
                        ].map(({ key, label }) => (
                          <View key={key} style={styles.sensoryStepperRow}>
                            <Text style={styles.sensoryStepperLabel}>{label}</Text>
                            <View style={styles.stepperCtrl}>
                              <TouchableOpacity
                                style={styles.stepperMiniBtn}
                                onPress={() => {
                                  triggerHapticFeedback();
                                  setSensoryScores((prev) => ({
                                    ...prev,
                                    [key]: Math.max(1, prev[key] - 1),
                                  }));
                                }}
                              >
                                <Text style={styles.stepperMiniBtnText}>-</Text>
                              </TouchableOpacity>
                              <Text style={styles.stepperMiniVal}>{sensoryScores[key]}</Text>
                              <TouchableOpacity
                                style={styles.stepperMiniBtn}
                                onPress={() => {
                                  triggerHapticFeedback();
                                  setSensoryScores((prev) => ({
                                    ...prev,
                                    [key]: Math.min(10, prev[key] + 1),
                                  }));
                                }}
                              >
                                <Text style={styles.stepperMiniBtnText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}

                        {/* Flaws / recommendations */}
                        {liveSensoryResult.identifiedFlaws.length > 0 && (
                          <View style={styles.flawsBox}>
                            <Text style={styles.flawsTitle}>⚠️ {t('Zidentyfikowane wady:')}</Text>
                            {liveSensoryResult.identifiedFlaws.map((flaw, idx) => (
                              <Text key={idx} style={styles.flawsText}>• {flaw}</Text>
                            ))}
                            <Text style={[styles.flawsTitle, { marginTop: 6 }]}>💡 {t('Rekomendacje technologiczne:')}</Text>
                            {liveSensoryResult.craftRecommendations.map((rec, idx) => (
                              <Text key={idx} style={styles.recText}>• {rec}</Text>
                            ))}
                          </View>
                        )}

                        <Text style={[styles.inputLabelMini, { marginTop: 8 }]}>
                          {t('Notatki degustacyjne (opcjonalnie):')}
                        </Text>
                        <TextInput
                          style={styles.sensoryNotesInput}
                          value={sensoryNotes}
                          onChangeText={setSensoryNotes}
                          placeholder={t('Wpisz własne spostrzeżenia...')}
                          placeholderTextColor="#A8A29E"
                        />

                        <TouchableOpacity
                          style={styles.saveSensoryBtn}
                          onPress={handleSaveSensory}
                          accessibilityRole="button"
                        >
                          <Text style={styles.saveSensoryBtnText}>
                            💾 {t('Zapisz profil sensoryczny')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* CAVE LOG VIEW */}
        {/* =================================================================== */}
        {activeTabSection === 'cave' && (
          <View>
            {/* Psychrometric VPD & Cave Climate Guard */}
            <View style={styles.wheelCard}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => {
                  triggerHapticFeedback();
                  setIsCaveEnvOpen(!isCaveEnvOpen);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.wheelTag}>🌡️ {t('Klimat Piwniczki (Psychrometria & VPD)')}</Text>
                  <Text style={styles.wheelLocation}>
                    {t('VPD:')} {caveEnvResult.vaporPressureDeficitKpa} kPa | {t('Punkt rosy:')} {caveEnvResult.dewPointCelsius}°C
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#78716C' }}>{isCaveEnvOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isCaveEnvOpen && (
                <View style={{ marginTop: 8, gap: 8 }}>
                  <View style={styles.sectionTabs}>
                    <TouchableOpacity
                      style={[styles.sectionTab, caveType === 'HARD_GOUDA_CHEDDAR' && styles.sectionTabActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setCaveType('HARD_GOUDA_CHEDDAR');
                      }}
                    >
                      <Text style={[styles.sectionTabText, caveType === 'HARD_GOUDA_CHEDDAR' && styles.sectionTabTextActive]}>
                        🧀 {t('Gouda / Cheddar')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sectionTab, caveType === 'WASHED_RIND_LINENS' && styles.sectionTabActive]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setCaveType('WASHED_RIND_LINENS');
                      }}
                    >
                      <Text style={[styles.sectionTabText, caveType === 'WASHED_RIND_LINENS' && styles.sectionTabTextActive]}>
                        🟧 {t('Ser Maziowy (B. linens)')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: '#78716C', marginBottom: 2 }}>{t('Temperatura (°C):')}</Text>
                      <TextInput
                        style={styles.inlineWeighInput}
                        keyboardType="numeric"
                        value={String(caveTemp)}
                        onChangeText={(v) => setCaveTemp(parseFloat(v) || 0)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: '#78716C', marginBottom: 2 }}>{t('Wilgotność RH (%):')}</Text>
                      <TextInput
                        style={styles.inlineWeighInput}
                        keyboardType="numeric"
                        value={String(caveRh)}
                        onChangeText={(v) => setCaveRh(parseFloat(v) || 0)}
                      />
                    </View>
                  </View>

                  <View style={[
                    styles.weightBox,
                    caveEnvResult.status === 'CASE_HARDENING_WARNING' && { backgroundColor: '#FEF2F2', borderColor: '#EF4444', borderWidth: 1 },
                    caveEnvResult.status === 'CONDENSATION_MOLD_RISK' && { backgroundColor: '#FEF2F2', borderColor: '#F59E0B', borderWidth: 1 }
                  ]}>
                    <Text style={[
                      { fontSize: 13, fontWeight: '700', color: '#166534' },
                      caveEnvResult.status !== 'OPTIMAL' && { color: '#DC2626' }
                    ]}>
                      {caveEnvResult.status === 'CASE_HARDENING_WARNING'
                        ? `⚠️ ${t('ALARM: Zagrożenie Case Hardening!')}`
                        : caveEnvResult.status === 'CONDENSATION_MOLD_RISK'
                        ? `⚠️ ${t('ALARM: Ryzyko Kondensacji i Pleśni!')}`
                        : `✅ ${t('Klimat Optymalny (Brak Ryzyka)')}`}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#44403C', marginTop: 4 }}>
                      {caveEnvResult.environmentalNotes}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#78350F', fontWeight: '600', marginTop: 4 }}>
                      💡 {caveEnvResult.recommendation}
                    </Text>
                  </View>

                  {/* Affinage Schedule */}
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#44403C', marginTop: 4 }}>
                    📅 {t('Rekomendowany Harmonogram Pielęgnacji (Affinage):')}
                  </Text>
                  {affinageSchedule.map((s) => (
                    <View key={s.dayInCave} style={{ backgroundColor: '#FAF8F5', padding: 8, borderRadius: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#78350F' }}>{s.title}</Text>
                      <Text style={{ fontSize: 11, color: '#57534E', marginTop: 2 }}>{s.instructions}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            {caveWheels.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🪵</Text>
                <Text style={styles.emptyTitle}>{t('Brak krążków w piwniczce')}</Text>
                <Text style={styles.emptyDesc}>
                  {t('Dodaj partię sera twardego lub dojrzewającego, aby monitorować obracanie i wilgotność.')}
                </Text>
              </View>
            ) : (
              caveWheels.map((w) => (
                <View key={w.id} style={styles.wheelCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.wheelTag}>{w.wheelTag}</Text>
                    <View style={styles.rindBadge}>
                      <Text style={styles.rindBadgeText}>{w.rindType}</Text>
                    </View>
                  </View>

                  <Text style={styles.wheelLocation}>📍 {w.locationInCave}</Text>

                  {/* Weight & Shrinkage bar */}
                  <View style={styles.weightBox}>
                    <View style={styles.weightCol}>
                      <Text style={styles.weightLabel}>{t('Waga początkowa')}</Text>
                      <Text style={styles.weightVal}>{w.initialWeightGrams} g</Text>
                    </View>
                    <View style={styles.weightCol}>
                      <Text style={styles.weightLabel}>{t('Waga obecna')}</Text>
                      <Text style={styles.weightValHighlight}>{w.currentWeightGrams} g</Text>
                    </View>
                    <View style={styles.weightCol}>
                      <Text style={styles.weightLabel}>{t('Ubytek (Shrinkage)')}</Text>
                      <Text style={[styles.weightVal, w.shrinkagePct > 15 && styles.textRed]}>
                        {w.shrinkagePct}%
                      </Text>
                    </View>
                  </View>

                  {/* Turning and washing history */}
                  <View style={styles.historyRow}>
                    <Text style={styles.historyText}>
                      🔄 {t('Obrócono:')}{' '}
                      {w.lastTurnedAt ? new Date(w.lastTurnedAt).toLocaleDateString() : t('Brak')}
                    </Text>
                    <Text style={styles.historyText}>
                      🧽 {t('Przemyto:')}{' '}
                      {w.lastWashedAt ? new Date(w.lastWashedAt).toLocaleDateString() : t('Brak')}
                    </Text>
                  </View>

                  {/* Quick Action Buttons for Dirty Hands ergonomics (>=56pt) */}
                  <View style={styles.wheelActionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleAffinageAction(w, 'TURN')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🔄 {t('Obróć')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleAffinageAction(w, 'WASH_BRINE')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🧽 {t('Solanka')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleAffinageAction(w, 'DRY_BRUSH')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🧹 {t('Szczotkuj')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleAffinageAction(w, 'WAX_COATING')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🕯️ {t('Woskuj')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnGold]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setWeighWheelId(w.id);
                        setNewWeightInput(String(w.currentWeightGrams));
                      }}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnTextGold}>⚖️ {t('Zważ')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Inline weigh input */}
                  {weighWheelId === w.id && (
                    <View style={styles.inlineWeighInputBox}>
                      <Text style={styles.inlineWeighLabel}>{t('Nowa waga krążka (g):')}</Text>
                      <TextInput
                        style={styles.inlineWeighInput}
                        keyboardType="numeric"
                        value={newWeightInput}
                        onChangeText={setNewWeightInput}
                      />
                      <TouchableOpacity
                        style={styles.inlineWeighSaveBtn}
                        onPress={() => handleSaveWeight(w)}
                      >
                        <Text style={styles.inlineWeighSaveText}>{t('Zapisz')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Care History Toggle & Delete Wheel */}
                  <View style={[styles.rowBetween, { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F5F5F4' }]}>
                    <TouchableOpacity
                      style={styles.historyToggleBtn}
                      onPress={() => toggleWheelHistory(w.id)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.historyToggleText}>
                        📜 {expandedWheelHistoryId === w.id ? t('Ukryj historię') : `${t('Historia pielęgnacji')} (${(wheelActionsMap[w.id] || []).length} ${t('wpisów')})`}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.batchDeleteBtn}
                      onPress={() => handleDeleteWheel(w)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.batchDeleteBtnText}>🗑️ {t('Usuń')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Care History Timeline */}
                  {expandedWheelHistoryId === w.id && (
                    <View style={styles.historyTimelineBox}>
                      {(wheelActionsMap[w.id] || []).length === 0 ? (
                        <Text style={styles.historyEmptyText}>{t('Brak wpisów historii pielęgnacji.')}</Text>
                      ) : (
                        (wheelActionsMap[w.id] || []).map((a) => (
                          <View key={a.id} style={styles.historyTimelineItem}>
                            <View style={styles.rowBetween}>
                              <Text style={styles.historyActionTitle}>
                                {a.actionType === 'TURN'
                                  ? `🔄 ${t('Obrócenie')}`
                                  : a.actionType === 'WASH_BRINE'
                                  ? `🧽 ${t('Przemycie solanką')}`
                                  : a.actionType === 'DRY_BRUSH'
                                  ? `🧹 ${t('Szczotkowanie')}`
                                  : a.actionType === 'WAX_COATING'
                                  ? `🕯️ ${t('Woskowanie')}`
                                  : a.actionType === 'CLOTHBOUND'
                                  ? `🧵 ${t('Bandażowanie')}`
                                  : `⚖️ ${t('Ważenie')}`}
                              </Text>
                              <Text style={styles.historyActionDate}>
                                {new Date(a.loggedAt).toLocaleDateString()} {new Date(a.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                            </View>
                            {a.weightGrams !== undefined && (
                              <Text style={styles.historyActionDetails}>
                                {t('Waga obecna')}: {a.weightGrams} g | {t('Ubytek (Shrinkage)')}: {a.shrinkagePct || 0}%
                              </Text>
                            )}
                            {a.notes ? (
                              <Text style={styles.historyActionNotes}>"{a.notes}"</Text>
                            ) : null}
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* QR Scanner Modal */}
      <QrScannerModal
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScanSuccess={handleQrScanResult}
      />

      {/* Apps4Brew Paywall Modal */}
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
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
  },
  headerSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  headerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  csvButton: {
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#0F766E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  csvButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  qrButton: {
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: '#78350F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  sectionTab: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7E5E4',
    borderRadius: 10,
  },
  sectionTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  sectionTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  sectionTabTextActive: {
    color: '#78350F',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F4',
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  filterPillTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 20,
  },
  batchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  batchCode: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 14,
    color: '#78350F',
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  batchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  batchDate: {
    fontSize: 12,
    color: '#78716C',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#A8A29E',
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  wheelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 14,
  },
  wheelTag: {
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 16,
    color: '#1C1917',
  },
  rindBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rindBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  wheelLocation: {
    fontSize: 12,
    color: '#78716C',
    marginBottom: 10,
  },
  weightBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  weightCol: {
    flex: 1,
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 10,
    color: '#78716C',
    marginBottom: 2,
  },
  weightVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  weightValHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  textRed: {
    color: '#DC2626',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyText: {
    fontSize: 11,
    color: '#57534E',
  },
  wheelActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 56, // >=56pt touch target
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#44403C',
  },
  actionBtnGold: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  actionBtnTextGold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  inlineWeighInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    gap: 8,
  },
  inlineWeighLabel: {
    fontSize: 12,
    color: '#44403C',
    flex: 1,
  },
  inlineWeighInput: {
    width: 80,
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
  inlineWeighSaveBtn: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#78350F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineWeighSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statusPillsScroll: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    marginRight: 6,
  },
  statusPillActive: {
    backgroundColor: '#15803D',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  statusPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sensorySummaryBadge: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  sensorySummaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  sensorySummaryNotes: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
  },
  batchActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    alignItems: 'center',
  },
  batchSmallBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchSmallBtnActive: {
    backgroundColor: '#D97706',
  },
  batchSmallBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  batchSmallBtnTextActive: {
    color: '#FFFFFF',
  },
  batchDeleteBtn: {
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchDeleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  sensoryScorecard: {
    marginTop: 12,
    backgroundColor: '#FAF8F5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  sensoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
  sensorySub: {
    fontSize: 11,
    color: '#78716C',
    marginBottom: 8,
  },
  sensoryScoreBanner: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  sensoryScoreLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: '#78350F',
  },
  sensoryGradeBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    marginVertical: 2,
  },
  sensoryAssessment: {
    fontSize: 11,
    color: '#44403C',
    textAlign: 'center',
  },
  sensoryStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sensoryStepperLabel: {
    fontSize: 12,
    color: '#44403C',
    flex: 1,
  },
  stepperCtrl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperMiniBtn: {
    width: 34,
    height: 34,
    backgroundColor: '#E7E5E4',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMiniBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  stepperMiniVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
    minWidth: 20,
    textAlign: 'center',
  },
  flawsBox: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  flawsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  flawsText: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
  recText: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
  },
  inputLabelMini: {
    fontSize: 11,
    fontWeight: '700',
    color: '#57534E',
    marginBottom: 2,
  },
  sensoryNotesInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1C1917',
    marginBottom: 10,
  },
  saveSensoryBtn: {
    height: 48,
    backgroundColor: '#78350F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveSensoryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyToggleBtn: {
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    justifyContent: 'center',
  },
  historyToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#57534E',
  },
  historyTimelineBox: {
    marginTop: 8,
    backgroundColor: '#FAF8F5',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  historyEmptyText: {
    fontSize: 11,
    color: '#A8A29E',
    textAlign: 'center',
    paddingVertical: 4,
  },
  historyTimelineItem: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  historyActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  historyActionDate: {
    fontSize: 10,
    color: '#A8A29E',
  },
  historyActionDetails: {
    fontSize: 11,
    color: '#78350F',
    fontWeight: '600',
    marginTop: 2,
  },
  historyActionNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#57534E',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statsCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
  },
  statsCardSub: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  statsToggleText: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FAF8F5',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  statBoxVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F',
  },
  statBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
    marginTop: 2,
  },
  statBoxSub: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 2,
  },
  timelineBadgeBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginVertical: 8,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    flex: 1,
  },
  burpTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  burpTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  timelineNextStepRow: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  timelineNextStepTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14532D',
  },
  timelineNextStepDesc: {
    fontSize: 10,
    color: '#166534',
    marginTop: 1,
  },
  timelineAdvice: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#15803D',
    marginTop: 4,
  },
});
