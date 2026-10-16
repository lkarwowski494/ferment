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
} from '../../src/data/sqlite-store';
import { createAutoBackup } from '../../src/lib/backup';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';

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

  const loadData = useCallback(async () => {
    const store = getSqliteStore();
    const b = await store.getBatches();
    const w = await store.getCaveWheels();
    setBatches(b);
    setCaveWheels(w);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTurnWheel = (wheel: CaveWheel) => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const updated: CaveWheel = {
        ...wheel,
        lastTurnedAt: Date.now(),
      };
      await store.saveCaveWheel(updated);
      await createAutoBackup();
      await loadData();
      Alert.alert(t('Krążek Obrócony'), `${wheel.wheelTag}: ${t('Zapisano datę obrócenia.')}`);
    });
  };

  const handleWashWheel = (wheel: CaveWheel) => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const updated: CaveWheel = {
        ...wheel,
        lastWashedAt: Date.now(),
      };
      await store.saveCaveWheel(updated);
      await createAutoBackup();
      await loadData();
      Alert.alert(t('Krążek Przemyty'), `${wheel.wheelTag}: ${t('Przemyto solanką.')}`);
    });
  };

  const handleSaveWeight = (wheel: CaveWheel) => {
    requireActionAccess(async () => {
      const weightNum = parseFloat(newWeightInput);
      if (!weightNum || weightNum <= 0) {
        Alert.alert(t('Błąd'), t('Wpisz prawidłową wagę w gramach.'));
        return;
      }

      triggerHapticFeedback();
      const store = getSqliteStore();
      const shrinkagePct = Math.round(((wheel.initialWeightGrams - weightNum) / wheel.initialWeightGrams) * 1000) / 10;

      const updated: CaveWheel = {
        ...wheel,
        currentWeightGrams: weightNum,
        shrinkagePct: Math.max(0, shrinkagePct),
      };

      await store.saveCaveWheel(updated);
      await createAutoBackup();
      setWeighWheelId(null);
      setNewWeightInput('');
      await loadData();

      Alert.alert(
        t('Ważenie Zapisane!'),
        `${wheel.wheelTag}\n${t('Ubytek wagi (shrinkage):')} ${shrinkagePct}%`
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('Dziennik Partii & Cave Log')}</Text>
          <Text style={styles.headerSub}>
            {batches.length} {t('partii')} | {caveWheels.length} {t('krążków w piwniczce')}
          </Text>
        </View>

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
              filteredBatches.map((b) => (
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
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>{t('Status:')}</Text>
                    <Text style={styles.statusValue}>{b.status}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* CAVE LOG VIEW */}
        {/* =================================================================== */}
        {activeTabSection === 'cave' && (
          <View>
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
                      onPress={() => handleTurnWheel(w)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🔄 {t('Obróć')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleWashWheel(w)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionBtnText}>🧽 {t('Solanka')}</Text>
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
        onScanSuccess={(scannedCode) => {
          Alert.alert(t('Odczytano Kod QR'), `${t('Partia / Krążek:')} ${scannedCode}`);
        }}
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
  qrButton: {
    height: 48,
    paddingHorizontal: 16,
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
});
