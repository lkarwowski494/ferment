// ============================================================================
// Apps4Brew Studio — SEROWAR Tab 3: DOJRZEWALNIA (cave.tsx)
// Cyfrowa piwniczka serowarska, dozór mikroklimatu, proaktywny feed zabiegów (P6)
// Ergonomia: 'Hands in whey' >= 48pt, 1px tactile borders, tabular-nums
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';
import { NumInput } from '../../src/components/ui/NumInput';
import { Btn, Chip, Segmented } from '../../src/components/ui';
import { RindType } from '../../src/data/db';
import {
  getCaveWheels,
  saveCaveWheel,
  logCaveAction,
  CaveCheeseWheel,
  CaveActionLog,
} from '../../src/data/sqlite-store';
import {
  analyzeCaveEnvironment,
  CheeseCaveType,
} from '../../src/core/cave-environment';
import { recordAffinageAction } from '../../src/core/cave-log-actions';

export default function CaveScreen() {
  const [wheels, setWheels] = useState<CaveCheeseWheel[]>([]);
  const [caveTemp, setCaveTemp] = useState<number>(12);
  const [caveRh, setCaveRh] = useState<number>(85);
  const [caveType, setCaveType] = useState<CheeseCaveType>('HARD_GOUDA_CHEDDAR');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [undoAction, setUndoAction] = useState<{ wheel: CaveCheeseWheel; prevTime?: number } | null>(null);

  // Modal Dodawania Krążka
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newWheelTag, setNewWheelTag] = useState<string>('GOUDA-01');
  const [newWheelWeight, setNewWheelWeight] = useState<number>(1200);
  const [newWheelDays, setNewWheelDays] = useState<number>(60);
  const [newRindType, setNewRindType] = useState<RindType>('NATURAL');

  const loadWheels = useCallback(async () => {
    const list = await getCaveWheels();
    setWheels(list);
  }, []);

  useEffect(() => {
    loadWheels();
  }, [loadWheels]);

  // Analiza mikroklimatu jaskini
  const envResult = analyzeCaveEnvironment({
    tempCelsius: caveTemp,
    relativeHumidityPct: caveRh,
    caveType,
  });

  // Filtrowanie krążków
  const filteredWheels = wheels.filter((w) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'WASHED') return w.rindType === 'SMEAR_BREVI';
    if (selectedFilter === 'WHITE') return w.rindType === 'BLOOMY_WHITE';
    if (selectedFilter === 'NATURAL') return w.rindType === 'NATURAL';
    return true;
  });

  const [isMutating, setIsMutating] = useState<boolean>(false);
  const isMutatingRef = useRef<boolean>(false);

  // Krążki wymagające obrotu na dziś (P6)
  const wheelsNeedingTurnToday = wheels.filter((w) => {
    if (!w.lastTurnedAt) return true;
    const elapsed = Date.now() - w.lastTurnedAt;
    if (elapsed < 0) return false; // Clock skew protection
    return elapsed > 24 * 3600 * 1000;
  });

  // Szybka akcja obrotu z natychmiastowym zapisem i opcją Undo (P10)
  const handleTurnWheel = async (wheel: CaveCheeseWheel) => {
    if (isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsMutating(true);
    try {
      triggerHapticFeedback();
      const prevTurn = wheel.lastTurnedAt;
      const now = Date.now();
      const result = recordAffinageAction(wheel, 'TURN', undefined, undefined, now);

      await saveCaveWheel(result.updatedWheel);
      await logCaveAction(result.actionLog);
      setUndoAction({ wheel, prevTime: prevTurn });
      await loadWheels();
    } finally {
      isMutatingRef.current = false;
      setIsMutating(false);
    }
  };

  const handleUndoTurn = async () => {
    if (!undoAction || isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsMutating(true);
    try {
      triggerHapticFeedback();
      const reverted: CaveCheeseWheel = {
        ...undoAction.wheel,
        lastTurnedAt: undoAction.prevTime,
      };
      await saveCaveWheel(reverted);
      setUndoAction(null);
      await loadWheels();
    } finally {
      isMutatingRef.current = false;
      setIsMutating(false);
    }
  };

  const handleAddNewWheel = async () => {
    if (isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsMutating(true);
    try {
      triggerHapticFeedback();
      const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newWheel: CaveCheeseWheel = {
        id: `wheel-${uniqueSuffix}`,
        batchId: `batch-${uniqueSuffix}`,
        wheelTag: newWheelTag.trim() || `SER-${uniqueSuffix.slice(-6)}`,
        locationInCave: 'Półka A1',
        initialWeightGrams: newWheelWeight,
        currentWeightGrams: newWheelWeight,
        rindType: newRindType,
        targetAgingDays: newWheelDays,
        shrinkagePct: 0,
      };
      await saveCaveWheel(newWheel);
      setIsAddModalOpen(false);
      await loadWheels();
    } finally {
      isMutatingRef.current = false;
      setIsMutating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{t('Dojrzewalnia')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('Dozór mikroklimatu jaskini, affinage i kartoteka krążków')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            accessibilityRole="button"
            accessibilityLabel={t('Dodaj krążek sera')}
            onPress={() => {
              triggerHapticFeedback();
              setIsAddModalOpen(true);
            }}
          >
            <Text style={styles.addButtonText}>+ {t('Nowy Krążek')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ============================================================== */}
        {/* 1. PASEK MIKROKLIMATU I PUNKTU ROSY (VPD)                      */}
        {/* ============================================================== */}
        <View style={styles.climateCard}>
          <View style={styles.climateHeader}>
            <Text style={styles.cardIcon}>🏔️</Text>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>{t('Mikroklimat Piwniczki Serowarskiej')}</Text>
              <Text style={styles.cardSubtitle}>
                {t('Psychrometria: punkt rosy T_dp i ochrona przed kondensacją')}
              </Text>
            </View>
          </View>

          <View style={styles.climateInputsRow}>
            <View style={styles.climateInputCol}>
              <Text style={styles.inputMiniLabel}>{t('Temperatura (°C):')}</Text>
              <NumInput
                value={caveTemp}
                onChangeValue={setCaveTemp}
                step={1}
                min={4}
                max={22}
                accessibilityLabel={t('Temperatura (°C):')}
              />
            </View>
            <View style={styles.climateInputCol}>
              <Text style={styles.inputMiniLabel}>{t('Wilgotność RH (%):')}</Text>
              <NumInput
                value={caveRh}
                onChangeValue={setCaveRh}
                step={2}
                min={50}
                max={99}
                accessibilityLabel={t('Wilgotność RH (%):')}
              />
            </View>
          </View>

          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('Punkt rosy:')}</Text>
              <Text style={styles.metricValue}>{Math.round(envResult.dewPointCelsius * 10) / 10}°C</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('Deficyt VPD:')}</Text>
              <Text style={styles.metricValue}>{Math.round(envResult.vaporPressureDeficitKpa * 100) / 100} kPa</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('Status:')}</Text>
              <Text style={[styles.metricValue, { color: envResult.isCondensationRisk ? '#EF4444' : '#10B981' }]}>
                {envResult.isCondensationRisk ? t('Kondensacja!') : t('BEZPIECZNY')}
              </Text>
            </View>
          </View>

          {envResult.isCondensationRisk && (
            <View style={styles.alertDanger}>
              <Text style={styles.alertDangerText}>
                ⚠️ {t('ALARM: Ryzyko Kondensacji i Pleśni! Wilgoć skrapla się na skórce. Obniż wilgotność lub przewietrz.')}
              </Text>
            </View>
          )}
        </View>

        {/* ============================================================== */}
        {/* 2. PROAKTYWNY FEED: ZADANIA NA DZIŚ (P6)                       */}
        {/* ============================================================== */}
        <View style={styles.feedCard}>
          <View style={styles.feedHeaderRow}>
            <Text style={styles.feedTitle}>⚡ {t('Zadania Pielęgnacyjne na Dziś')}</Text>
            <Text style={styles.feedBadge}>
              {wheelsNeedingTurnToday.length} {t('krążków')}
            </Text>
          </View>

          {undoAction && (
            <View style={styles.undoBar}>
              <Text style={styles.undoText}>
                ✅ {t('Obrócono krążek')} {undoAction.wheel.wheelTag}
              </Text>
              <TouchableOpacity onPress={handleUndoTurn} style={styles.undoButton}>
                <Text style={styles.undoButtonText}>{t('Cofnij')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {wheelsNeedingTurnToday.length === 0 ? (
            <Text style={styles.feedEmptyText}>
              ✓ {t('Wszystkie krążki zostały dziś pomyślnie obrócone. Dojrzewalnia odpoczywa!')}
            </Text>
          ) : (
            wheelsNeedingTurnToday.slice(0, 5).map((w) => (
              <View key={w.id} style={styles.feedItem}>
                <View style={styles.feedItemInfo}>
                  <Text style={styles.feedItemTag}>{w.wheelTag}</Text>
                  <Text style={styles.feedItemSub}>
                    {w.currentWeightGrams} g · {w.locationInCave} · {w.rindType}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionTurnBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('Obróć krążek')} ${w.wheelTag}`}
                  onPress={() => handleTurnWheel(w)}
                >
                  <Text style={styles.actionTurnBtnText}>🔄 {t('Obróć')}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* ============================================================== */}
        {/* 3. FILTRY I KARTOTEKA KRĄŻKÓW (P2)                             */}
        {/* ============================================================== */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('Aktywne Krążki w Jaskini')}</Text>
          <Text style={styles.sectionCount}>({filteredWheels.length})</Text>
        </View>

        <View style={styles.filtersRow}>
          <Chip
            label={t('Wszystkie')}
            selected={selectedFilter === 'ALL'}
            onPress={() => setSelectedFilter('ALL')}
          />
          <Chip
            label={t('Maziowe')}
            selected={selectedFilter === 'WASHED'}
            onPress={() => setSelectedFilter('WASHED')}
          />
          <Chip
            label={t('Pleśń Biała')}
            selected={selectedFilter === 'WHITE'}
            onPress={() => setSelectedFilter('WHITE')}
          />
          <Chip
            label={t('Naturalne')}
            selected={selectedFilter === 'NATURAL'}
            onPress={() => setSelectedFilter('NATURAL')}
          />
        </View>

        {filteredWheels.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧀</Text>
            <Text style={styles.emptyTitle}>{t('Brak krążków w dojrzewalni')}</Text>
            <Text style={styles.emptyHint}>
              {t('Przenieś ser po soleniu z Zakładki 1 (SEROWAR) lub dodaj krążek ręcznie.')}
            </Text>
            <Btn
              title={`+ ${t('Dodaj Pierwszy Krążek')}`}
              onPress={() => setIsAddModalOpen(true)}
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          filteredWheels.map((wheel) => {
            const shrinkageDelta = Math.round(
              ((wheel.initialWeightGrams - wheel.currentWeightGrams) / Math.max(1, wheel.initialWeightGrams)) * 100
            );
            return (
              <View key={wheel.id} style={styles.wheelCard}>
                <View style={styles.wheelCardTop}>
                  <View>
                    <Text style={styles.wheelTagText}>{wheel.wheelTag}</Text>
                    <Text style={styles.wheelMetaText}>
                      {wheel.locationInCave} · {wheel.targetAgingDays} {t('dni dojrzewania')}
                    </Text>
                  </View>
                  <View style={styles.shrinkageBadge}>
                    <Text style={styles.shrinkageText}>-{shrinkageDelta}% {t('ubytek')}</Text>
                  </View>
                </View>

                <View style={styles.wheelStatsRow}>
                  <View style={styles.wheelStat}>
                    <Text style={styles.wheelStatLabel}>{t('Waga początkowa:')}</Text>
                    <Text style={styles.wheelStatValue}>{wheel.initialWeightGrams} g</Text>
                  </View>
                  <View style={styles.wheelStat}>
                    <Text style={styles.wheelStatLabel}>{t('Waga bieżąca:')}</Text>
                    <Text style={styles.wheelStatValue}>{wheel.currentWeightGrams} g</Text>
                  </View>
                  <View style={styles.wheelStat}>
                    <Text style={styles.wheelStatLabel}>{t('Typ skórki:')}</Text>
                    <Text style={styles.wheelStatValue}>{wheel.rindType}</Text>
                  </View>
                </View>

                <View style={styles.wheelActionsRow}>
                  <TouchableOpacity
                    style={styles.wheelActionSubtle}
                    onPress={() => handleTurnWheel(wheel)}
                  >
                    <Text style={styles.wheelActionSubtleText}>🔄 {t('Obrócono')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.wheelActionSubtle}
                    onPress={() => {
                      triggerHapticFeedback();
                      Alert.alert(
                        t('Pielęgnacja Skórki'),
                        `${t('Krążek')} ${wheel.wheelTag}: ${t('Przemyto 18% solanką maziową B. linens.')}`
                      );
                    }}
                  >
                    <Text style={styles.wheelActionSubtleText}>🧴 {t('Przemyj mazią')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* MODAL DODAWANIA KRĄŻKA */}
      {isAddModalOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Dodaj Nowy Krążek do Jaskini')}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Waga początkowa sera (g):')}</Text>
              <NumInput
                value={newWheelWeight}
                onChangeValue={setNewWheelWeight}
                step={50}
                min={200}
                max={15000}
                unit="g"
                accessibilityLabel={t('Waga początkowa sera (g):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Planowany czas dojrzewania (dni):')}</Text>
              <NumInput
                value={newWheelDays}
                onChangeValue={setNewWheelDays}
                step={7}
                min={14}
                max={720}
                accessibilityLabel={t('Planowany czas dojrzewania (dni):')}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <Btn
                title={t('Anuluj')}
                variant="ghost"
                onPress={() => setIsAddModalOpen(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Btn
                title={t('Dodaj')}
                variant="primary"
                onPress={handleAddNewWheel}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2229',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2D333F',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#B86D3B', // Copper Vat
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  climateCard: {
    backgroundColor: '#262B34',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 14,
    marginBottom: 16,
  },
  climateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  cardTitleCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  climateInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  climateInputCol: {
    flex: 1,
  },
  inputMiniLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    marginBottom: 4,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  alertDanger: {
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  alertDangerText: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: '600',
  },
  feedCard: {
    backgroundColor: '#262B34',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B86D3B', // Copper Vat highlight
    padding: 14,
    marginBottom: 16,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  feedBadge: {
    fontSize: 12,
    color: '#C68A4C',
    fontWeight: '600',
  },
  feedEmptyText: {
    fontSize: 13,
    color: '#10B981',
    paddingVertical: 6,
  },
  feedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    marginBottom: 8,
  },
  feedItemInfo: {
    flex: 1,
  },
  feedItemTag: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  feedItemSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  actionTurnBtn: {
    backgroundColor: '#B86D3B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  actionTurnBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  undoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  undoText: {
    fontSize: 12,
    color: '#D1FAE5',
    fontWeight: '500',
  },
  undoButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  undoButtonText: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sectionCount: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 6,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#262B34',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  wheelCard: {
    backgroundColor: '#262B34',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 14,
    marginBottom: 12,
  },
  wheelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  wheelTagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  wheelMetaText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  shrinkageBadge: {
    backgroundColor: '#1E2229',
    borderWidth: 1,
    borderColor: '#C68A4C',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  shrinkageText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C68A4C',
    fontVariant: ['tabular-nums'],
  },
  wheelStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    marginBottom: 10,
  },
  wheelStat: {
    alignItems: 'center',
  },
  wheelStatLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  wheelStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  wheelActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wheelActionSubtle: {
    flex: 1,
    backgroundColor: '#1E2229',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 7,
    alignItems: 'center',
  },
  wheelActionSubtleText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#262B34',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C68A4C',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 6,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
