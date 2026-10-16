// ============================================================================
// Apps4Brew Studio — FERMENT Settings, Apps4Brew Pass & Data Management
// Monetization state, i18n PL/EN, Metric/Imperial, 10-Rotation Backups & CSV Export
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { t, lang, setLang, Lang } from '../../src/lib/i18n';
import { useAppAccess } from '../../src/lib/app-access';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { getSqliteStore, setAppSetting, getAppSetting } from '../../src/data/sqlite-store';
import {
  createAutoBackup,
  listBackups,
  createSnapshotData,
  BackupFileInfo,
} from '../../src/lib/backup';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';

export default function SettingsScreen() {
  const {
    access,
    isPaywallVisible,
    setPaywallVisible,
    subscribe,
    restorePurchases,
  } = useAppAccess();

  const [currentLang, setCurrentLang] = useState<Lang>(lang());
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [backups, setBackups] = useState<BackupFileInfo[]>([]);

  const loadSettingsAndBackups = useCallback(async () => {
    const savedLang = await getAppSetting('app_lang');
    if (savedLang === 'en' || savedLang === 'pl') {
      setCurrentLang(savedLang);
    }
    const savedUnit = await getAppSetting('unit_system');
    if (savedUnit === 'imperial' || savedUnit === 'metric') {
      setUnitSystem(savedUnit);
    }
    const bList = await listBackups();
    setBackups(bList);
  }, []);

  useEffect(() => {
    loadSettingsAndBackups();
  }, [loadSettingsAndBackups]);

  const handleLangChange = async (newLang: Lang) => {
    triggerHapticFeedback();
    setCurrentLang(newLang);
    setLang(newLang);
    await setAppSetting('app_lang', newLang);
  };

  const handleUnitChange = async (newUnit: 'metric' | 'imperial') => {
    triggerHapticFeedback();
    setUnitSystem(newUnit);
    await setAppSetting('unit_system', newUnit);
  };

  const handleCreateBackup = async () => {
    triggerHapticFeedback();
    await createAutoBackup();
    await loadSettingsAndBackups();
    Alert.alert(t('Kopia Utworzona'), t('Nowy punkt przywracania został pomyślnie zapisany w pamięci urządzenia.'));
  };

  const handleExportJson = async () => {
    triggerHapticFeedback();
    const data = await createSnapshotData();
    const jsonStr = JSON.stringify(data, null, 2);
    const fileName = `ferment_export_${Date.now()}.json`;

    const fsAny = FileSystem as any;
    const docDir: string | undefined = fsAny.documentDirectory || fsAny.Paths?.document?.uri;

    if (docDir) {
      const filePath = `${docDir}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, jsonStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          UTI: 'public.json',
        });
      }
    } else {
      Alert.alert(t('Eksport JSON'), t('Plik JSON wygenerowany pomyślnie.'));
    }
  };

  const handleExportCsv = async () => {
    triggerHapticFeedback();
    const store = getSqliteStore();
    const batches = await store.getBatches();
    const wheels = await store.getCaveWheels();

    let csv = 'TYP,NUMER_PARTII,NAZWA,KATEGORIA,DATA,STATUS,WAGA_POCZATKOWA_G,WAGA_OBECNA_G,UBYTEK_PCT\n';

    for (const b of batches) {
      csv += `BATCH,"${b.batchNumber}","${b.styleName}","${b.category}","${new Date(b.createdAt).toISOString()}","${b.status}",,,\n`;
    }

    for (const w of wheels) {
      csv += `CAVE_WHEEL,"${w.wheelTag}","${w.rindType}","CHEESE",,"AGING",${w.initialWeightGrams},${w.currentWeightGrams},${w.shrinkagePct}%\n`;
    }

    const fileName = `ferment_history_${Date.now()}.csv`;
    const fsAny = FileSystem as any;
    const docDir: string | undefined = fsAny.documentDirectory || fsAny.Paths?.document?.uri;

    if (docDir) {
      const filePath = `${docDir}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          UTI: 'public.comma-separated-values-text',
        });
      }
    } else {
      Alert.alert(t('Eksport CSV'), t('Plik CSV wygenerowany pomyślnie.'));
    }
  };

  const handleRestoreBtn = async () => {
    triggerHapticFeedback();
    const res = await restorePurchases();
    if (res.restored) {
      Alert.alert(t('Przywrócono'), t('Zakup został pomyślnie przywrócony!'));
    } else {
      Alert.alert(t('Brak Zakupu'), t('Nie znaleziono zapisanego zakupu w bazie urządzenia.'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Ustawienia')}</Text>
        <Text style={styles.headerSub}>Apps4Brew Studio • FERMENT v1.0.0</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Apps4Brew Pass Section */}
        <View style={styles.cardPass}>
          <View style={styles.passHeader}>
            <Text style={styles.passTitle}>⭐ {t('Apps4Brew Pass')}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>
                {access.status === 'subscribed'
                  ? access.subscriptionTier.toUpperCase()
                  : access.status === 'trial_active'
                  ? `${access.trialDaysRemaining} ${t('dni próby')}`
                  : t('Read-Only')}
              </Text>
            </View>
          </View>

          <Text style={styles.passDesc}>
            {access.status === 'subscribed'
              ? t('Subskrypcja aktywna.')
              : access.status === 'trial_active'
              ? t('14-dniowy okres próbny jest aktywny. Wszystkie funkcje są w 100% odblokowane.')
              : t('Okres próbny wygasł. Twoje dane i historia partii pozostają w pełni dostępne (Read-Only).')}
          </Text>

          <View style={styles.pricingRow}>
            <Text style={styles.pricingItem}>3,99 zł / {t('Miesięczny')}</Text>
            <Text style={styles.pricingItem}>19,99 zł / {t('Roczny')}</Text>
            <Text style={styles.pricingItemGold}>59,99 zł {t('Dożywotni')}</Text>
          </View>

          <View style={styles.passBtnRow}>
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => {
                triggerHapticFeedback();
                setPaywallVisible(true);
              }}
            >
              <Text style={styles.upgradeBtnText}>
                {access.status === 'subscribed' ? t('Zmień plan') : t('Odblokuj Pełną Twórczość')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={handleRestoreBtn}>
              <Text style={styles.restoreBtnText}>{t('Przywróć zakup')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>🌐 {t('Język aplikacji')}</Text>
          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={[styles.selectorBtn, currentLang === 'pl' && styles.selectorBtnActive]}
              onPress={() => handleLangChange('pl')}
            >
              <Text style={[styles.selectorBtnText, currentLang === 'pl' && styles.selectorBtnTextActive]}>
                🇵🇱 Polski
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectorBtn, currentLang === 'en' && styles.selectorBtnActive]}
              onPress={() => handleLangChange('en')}
            >
              <Text style={[styles.selectorBtnText, currentLang === 'en' && styles.selectorBtnTextActive]}>
                🇬🇧 English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Unit System Selection */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>⚖️ {t('Układ Jednostek')}</Text>
          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={[styles.selectorBtn, unitSystem === 'metric' && styles.selectorBtnActive]}
              onPress={() => handleUnitChange('metric')}
            >
              <Text style={[styles.selectorBtnText, unitSystem === 'metric' && styles.selectorBtnTextActive]}>
                {t('Metryczny (L, kg, °C)')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectorBtn, unitSystem === 'imperial' && styles.selectorBtnActive]}
              onPress={() => handleUnitChange('imperial')}
            >
              <Text style={[styles.selectorBtnText, unitSystem === 'imperial' && styles.selectorBtnTextActive]}>
                {t('Imperialny (gal, lb, °F, PSI)')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Security & Backups */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>💾 {t('Kopia zapasowa')}</Text>
          <Text style={styles.cardDesc}>
            {t('Automatyczna rotacja 10 kopii bezpieczeństwa oraz natychmiastowy punkt przywracania.')}
          </Text>

          <View style={styles.backupActionsRow}>
            <TouchableOpacity style={styles.backupBtn} onPress={handleCreateBackup}>
              <Text style={styles.backupBtnText}>➕ {t('Utwórz Kopię')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backupBtnSecondary} onPress={handleExportJson}>
              <Text style={styles.backupBtnSecondaryText}>📤 {t('Eksport JSON')}</Text>
            </TouchableOpacity>
          </View>

          {/* Export CSV Free Forever */}
          <TouchableOpacity style={styles.csvBtn} onPress={handleExportCsv}>
            <Text style={styles.csvBtnText}>📊 {t('Eksport CSV')} ({t('Zawsze bezpłatny')})</Text>
          </TouchableOpacity>

          {/* List of local backup files */}
          {backups.length > 0 && (
            <View style={styles.backupList}>
              <Text style={styles.backupListTitle}>{t('Dostępne punkty przywracania:')}</Text>
              {backups.slice(0, 5).map((bf, idx) => (
                <View key={idx} style={styles.backupRow}>
                  <Text style={styles.backupName}>{bf.fileName}</Text>
                  <Text style={styles.backupSize}>{(bf.sizeBytes / 1024).toFixed(1)} KB</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Philosophy & Manifesto */}
        <View style={styles.manifestoCard}>
          <Text style={styles.manifestoTitle}>🌱 Apps4Brew Studio Manifesto</Text>
          <Text style={styles.manifestoText}>
            100% Offline-First. Zero Analityki. Twoje dane serowarskie i receptury należą wyłącznie do Ciebie.
          </Text>
        </View>
      </ScrollView>

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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardPass: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    marginBottom: 16,
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#78350F',
  },
  tierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  passDesc: {
    fontSize: 13,
    color: '#44403C',
    lineHeight: 18,
    marginBottom: 12,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  pricingItem: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  pricingItemGold: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  passBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  upgradeBtn: {
    flex: 2,
    height: 52,
    backgroundColor: '#78350F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  restoreBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  restoreBtnText: {
    color: '#44403C',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 12,
    color: '#78716C',
    lineHeight: 18,
    marginBottom: 12,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorBtnActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  selectorBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  selectorBtnTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  backupActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  backupBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#78350F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backupBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  backupBtnSecondary: {
    flex: 1,
    height: 48,
    backgroundColor: '#E7E5E4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backupBtnSecondaryText: {
    color: '#1C1917',
    fontSize: 13,
    fontWeight: '600',
  },
  csvBtn: {
    height: 48,
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 12,
  },
  csvBtnText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '700',
  },
  backupList: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 10,
    gap: 6,
  },
  backupListTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78716C',
    marginBottom: 4,
  },
  backupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  backupName: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#44403C',
  },
  backupSize: {
    fontSize: 11,
    color: '#A8A29E',
  },
  manifestoCard: {
    padding: 16,
    alignItems: 'center',
  },
  manifestoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78716C',
    marginBottom: 4,
  },
  manifestoText: {
    fontSize: 11,
    color: '#A8A29E',
    textAlign: 'center',
    lineHeight: 16,
  },
});
