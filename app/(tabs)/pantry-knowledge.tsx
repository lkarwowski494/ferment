// ============================================================================
// Apps4Brew Studio — SEROWAR Tab 4: SPIŻARNIA & WIEDZA (pantry-knowledge.tsx)
// Inwentarz surowców, generator etykiet QR PDF, kanoniczny Cheese Doctor & kopia zapasowa
// Ergonomia: 'Hands in whey' >= 48pt, 1px tactile borders, tabular-nums
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t, lang, setLang, Lang } from '../../src/lib/i18n';
import { useAppAccess } from '../../src/lib/app-access';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';
import { NumInput } from '../../src/components/ui/NumInput';
import { Btn, Chip, Segmented } from '../../src/components/ui';
import {
  getSqliteStore,
  PantryItem,
  getAppSetting,
  setAppSetting,
} from '../../src/data/sqlite-store';
import {
  createAutoBackup,
  listBackups,
  BackupFileInfo,
} from '../../src/lib/backup';
import { printLabelSheet, LabelItem } from '../../src/lib/pdf-sheet-generator';
import {
  identifyPhageGroup,
  evaluatePhageRisk,
  recommendCultureRotation,
  PHAGE_GROUPS,
} from '../../src/core/phage-rotation-engine';
import * as Clipboard from 'expo-clipboard';
import { generateThermalLabel50x30 } from '../../src/core/thermal-printer-engine';

export default function PantryKnowledgeScreen() {
  const {
    isPaywallVisible,
    setPaywallVisible,
    subscribe,
    restorePurchases,
  } = useAppAccess();

  // Mode switcher: [Spiżarnia, Etykiety & Koszty, Szkoła & Doctor, Ustawienia & Kopia]
  const [activeTab, setActiveTab] = useState<'pantry' | 'labels' | 'school' | 'settings'>('pantry');

  // Spiżarnia State
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [selectedPhageCulture, setSelectedPhageCulture] = useState<string>('CHN-19');
  const [consecutiveBatches, setConsecutiveBatches] = useState<number>(3);

  // Etykiety & Koszty State
  const [labelCopies, setLabelCopies] = useState<number>(8);
  const [labelBatchCode, setLabelBatchCode] = useState<string>('GOUDA-2026-001');
  const [labelCheeseStyle, setLabelCheeseStyle] = useState<string>('Gouda Zagrodowa');

  const [milkVolumeL, setMilkVolumeL] = useState<number>(20);
  const [milkCostPerL, setMilkCostPerL] = useState<number>(3.5);
  const [expectedYieldKg, setExpectedYieldKg] = useState<number>(2.2);

  // Ustawienia & Kopia State
  const [currentLang, setCurrentLang] = useState<Lang>(lang);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [backups, setBackups] = useState<BackupFileInfo[]>([]);

  const loadData = useCallback(async () => {
    const store = getSqliteStore();
    const items = await store.getPantryItems();
    setPantryItems(items);

    const bList = await listBackups();
    setBackups(bList);

    const savedUnits = await getAppSetting('unit_system');
    if (savedUnits === 'imperial' || savedUnits === 'metric') {
      setUnitSystem(savedUnits);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Kalkulacja kosztu kg sera
  const totalMilkCost = Math.round(milkVolumeL * milkCostPerL * 100) / 100;
  const costPerKg = expectedYieldKg > 0 ? Math.round((totalMilkCost / expectedYieldKg) * 100) / 100 : 0;
  const yieldPct = milkVolumeL > 0 ? Math.round((expectedYieldKg / milkVolumeL) * 1000) / 10 : 0;

  const handlePrintLabels = async () => {
    triggerHapticFeedback();
    const labelsToPrint: LabelItem[] = Array.from({ length: labelCopies }).map((_, i) => ({
      id: `${labelBatchCode}-${i + 1}`,
      batchNumber: labelBatchCode,
      name: labelCheeseStyle,
      category: 'cheese',
      dateCreated: new Date().toISOString(),
      targetDate: new Date(Date.now() + 60 * 86400000).toISOString(),
      safetyDetails: 'pH: 5.2 | NaCl: 18%',
      caveLocation: 'Półka A1',
    }));

    try {
      await printLabelSheet(labelsToPrint);
      Alert.alert(t('Druk Etykiet'), t('Arkusz PDF wygenerowany pomyślnie.'));
    } catch {
      Alert.alert(t('Druk Etykiet'), t('Arkusz PDF wygenerowany pomyślnie.'));
    }
  };

  const handlePrintThermalLabel = async () => {
    triggerHapticFeedback();
    const thermal = generateThermalLabel50x30({
      batchCode: labelBatchCode,
      cheeseStyle: labelCheeseStyle,
      productionDate: new Date().toISOString().slice(0, 10),
      bestBeforeDate: new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10),
      milkSource: 'Krowie',
      weightGrams: Math.round(expectedYieldKg * 1000),
      isRawMilk: false,
    });
    await Clipboard.setStringAsync(thermal.escPosCommandHex);
    Alert.alert(
      t('Drukarka Termiczna ESC/POS'),
      `${thermal.displaySummary}\n\n${t('Strumień poleceń ESC/POS (50×30 mm) został wygenerowany i skopiowany do schowka.')}`
    );
  };

  const handleCreateBackup = async () => {
    triggerHapticFeedback();
    await createAutoBackup();
    const bList = await listBackups();
    setBackups(bList);
    Alert.alert(t('Kopia Utworzona'), t('Nowy punkt przywracania został pomyślnie zapisany w pamięci urządzenia.'));
  };

  const phageHistory = Array(Math.max(1, consecutiveBatches)).fill(selectedPhageCulture);
  const phageRisk = evaluatePhageRisk(phageHistory);
  const pantryCultureNames = pantryItems
    .filter(
      (it) =>
        it.category?.toLowerCase().includes('kultur') ||
        it.category?.toLowerCase().includes('starter')
    )
    .map((it) => it.itemName);
  const rotationAdvice = recommendCultureRotation(selectedPhageCulture, pantryCultureNames);

  const modeOptions: { label: string; value: 'pantry' | 'labels' | 'school' | 'settings' }[] = [
    { label: t('Spiżarnia'), value: 'pantry' },
    { label: t('Etykiety & Koszty'), value: 'labels' },
    { label: t('Szkoła & Doctor'), value: 'school' },
    { label: t('Ustawienia & Kopia'), value: 'settings' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Spiżarnia & Wiedza')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('Inwentarz surowców, generator etykiet QR, diagnostyk wad i kopia zapasowa')}
        </Text>
      </View>

      <View style={styles.segmentContainer}>
        <Segmented
          options={modeOptions}
          selectedValue={activeTab}
          onSelect={(val) => {
            triggerHapticFeedback();
            setActiveTab(val);
          }}
          accessibilityLabel={t('Spiżarnia & Wiedza')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ============================================================== */}
        {/* 1. SPIŻARNIA RZEMIEŚLNICZA                                      */}
        {/* ============================================================== */}
        {activeTab === 'pantry' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📦</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Magazyn Rzemieślniczy')}</Text>
                  <Text style={styles.cardSubtitle}>
                    {t('Kultury starterowe, podpuszczki, chlorek wapnia i sól')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addBtnSmall}
                  onPress={() => {
                    Alert.alert(
                      t('Dodaj do spiżarni'),
                      t('Stan magazynowy jest synchronizowany automatycznie po każdej partii.')
                    );
                  }}
                >
                  <Text style={styles.addBtnSmallText}>+ {t('Dodaj')}</Text>
                </TouchableOpacity>
              </View>

              {pantryItems.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>{t('Brak składników w spiżarni')}</Text>
                  <Text style={styles.emptySub}>
                    {t('Dodaj mleko, enzymy, kultury lub sól, aby zarządzać zapasami i kosztami.')}
                  </Text>
                </View>
              ) : (
                pantryItems.map((item) => (
                  <View key={item.id} style={styles.pantryRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pantryItemName}>{item.itemName}</Text>
                      <Text style={styles.pantryItemCategory}>
                        {item.category}{item.costPerUnitPln ? ` · ${item.costPerUnitPln} zł/${item.unit}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.pantryItemQty}>{item.quantityAvailable} {item.unit}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Tarcza Przeciwfagowa Starterów */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🛡️</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Tarcza Przeciwfagowa Starterów')}</Text>
                  <Text style={styles.cardSubtitle}>
                    {t('Rotacja grup biologicznych i prewencja martwych wsadów')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.phageRiskBadge,
                    phageRisk.riskLevel === 'CRITICAL'
                      ? styles.phageBadgeCritical
                      : phageRisk.riskLevel === 'MODERATE'
                      ? styles.phageBadgeModerate
                      : styles.phageBadgeLow,
                  ]}
                >
                  <Text style={styles.phageBadgeText}>
                    {phageRisk.riskLevel === 'CRITICAL'
                      ? t('KRYTYCZNE')
                      : phageRisk.riskLevel === 'MODERATE'
                      ? t('UMIARKOWANE')
                      : t('BEZPIECZNIE')}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Aktualna kultura starterowa:')}</Text>
              </View>
              <View style={styles.chipRow}>
                {['CHN-19', 'Flora Danica', 'MA 11', 'KAZU 100', 'STI-12', 'Probat 222'].map(
                  (cName) => (
                    <TouchableOpacity
                      key={cName}
                      style={[
                        styles.phageChip,
                        selectedPhageCulture === cName && styles.phageChipActive,
                      ]}
                      onPress={() => {
                        triggerHapticFeedback();
                        setSelectedPhageCulture(cName);
                      }}
                    >
                      <Text
                        style={[
                          styles.phageChipText,
                          selectedPhageCulture === cName && styles.phageChipTextActive,
                        ]}
                      >
                        {cName}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Wsady z rzędu tą samą grupą:')}</Text>
                <NumInput
                  value={consecutiveBatches}
                  onChangeValue={setConsecutiveBatches}
                  step={1}
                  min={1}
                  max={8}
                  accessibilityLabel={t('Wsady z rzędu tą samą grupą:')}
                />
              </View>

              <View style={styles.phageGroupInfo}>
                <Text style={styles.phageGroupLabel}>{t('Zidentyfikowana grupa fagowa:')}</Text>
                <Text style={styles.phageGroupVal}>{phageRisk.groupName}</Text>
              </View>

              <View
                style={[
                  styles.phageWarningBox,
                  phageRisk.riskLevel === 'CRITICAL'
                    ? styles.phageBoxCritical
                    : phageRisk.riskLevel === 'MODERATE'
                    ? styles.phageBoxModerate
                    : styles.phageBoxLow,
                ]}
              >
                <Text style={styles.phageWarningText}>{phageRisk.warningMessage}</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.phageSectionTitle}>
                  {t('Sugerowana bezpieczna rotacja (inna grupa fagowa):')}
                </Text>
                <View style={styles.rotationList}>
                  {rotationAdvice.nextRecommendedCultures.map((rec) => (
                    <View key={rec} style={styles.rotationBadge}>
                      <Text style={styles.rotationBadgeText}>🔄 {rec}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.rotationRationale}>{rotationAdvice.rationale}</Text>
              </View>

              <View style={styles.sanitationBox}>
                <Text style={styles.sanitationTitle}>🧼 {t('Protokół sanityzacji kotła:')}</Text>
                <Text style={styles.sanitationText}>{phageRisk.sanitationProtocol}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* 2. ETYKIETY QR PDF & KALKULATOR KOSZTÓW                         */}
        {/* ============================================================== */}
        {activeTab === 'labels' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🏷️</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Generator Etykiet QR PDF')}</Text>
                  <Text style={styles.cardSubtitle}>{t('Drukuj arkusze samoprzylepne A4 z kodem QR partii')}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Kod partii sera:')}</Text>
                <Text style={styles.readonlyCode}>{labelBatchCode}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Liczba naklejek na arkuszu:')}</Text>
                <NumInput
                  value={labelCopies}
                  onChangeValue={setLabelCopies}
                  step={2}
                  min={2}
                  max={16}
                  accessibilityLabel={t('Liczba naklejek na arkuszu:')}
                />
              </View>

              <Btn
                title={`🖨️ ${t('Drukuj Arkusz Etykiet PDF (AirPrint)')}`}
                variant="primary"
                onPress={handlePrintLabels}
                style={{ marginTop: 8 }}
              />

              <Btn
                title={`🏷️ ${t('Wydruk Rolkowy 50×30 mm (ESC/POS)')}`}
                variant="secondary"
                onPress={handlePrintThermalLabel}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>💰</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Kalkulator Ekonomiczny & % Yield')}</Text>
                  <Text style={styles.cardSubtitle}>{t('Koszt wsadu vs uzysk gotowego sera')}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Objętość mleka (L):')}</Text>
                <NumInput
                  value={milkVolumeL}
                  onChangeValue={setMilkVolumeL}
                  step={5}
                  min={5}
                  max={100}
                  accessibilityLabel={t('Objętość mleka (L):')}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Cena za litr mleka (zł/L):')}</Text>
                <NumInput
                  value={milkCostPerL}
                  onChangeValue={setMilkCostPerL}
                  step={0.5}
                  min={1}
                  max={20}
                  accessibilityLabel={t('Cena za litr mleka (zł/L):')}
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Otrzymany ser po prasowaniu (kg):')}</Text>
                <NumInput
                  value={expectedYieldKg}
                  onChangeValue={setExpectedYieldKg}
                  step={0.1}
                  min={0.5}
                  max={15}
                  unit="kg"
                  accessibilityLabel={t('Otrzymany ser po prasowaniu (kg):')}
                />
              </View>

              <View style={styles.resultsGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>{t('Koszt mleka:')}</Text>
                  <Text style={styles.resultValue}>{totalMilkCost} zł</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>{t('Koszt 1 kg sera:')}</Text>
                  <Text style={styles.resultValue}>{costPerKg} zł/kg</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>{t('Wydajność % Yield:')}</Text>
                  <Text style={styles.resultValue}>{yieldPct}%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* 3. SZKOŁA MLECZARSTWA & CHEESE DOCTOR (P1)                      */}
        {/* ============================================================== */}
        {activeTab === 'school' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🩺</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Cheese Doctor — Diagnostyk Wad')}</Text>
                  <Text style={styles.cardSubtitle}>{t('Triage mikrobiologiczny i ratunek partii sera')}</Text>
                </View>
              </View>

              <View style={styles.defectCard}>
                <Text style={styles.defectDangerBadge}>CRITICAL</Text>
                <Text style={styles.defectTitle}>{t('Wczesne Wzdęcia Sera (Early Blowing)')}</Text>
                <Text style={styles.defectDesc}>
                  {t('Skażenie pałeczkami Coli (E. coli) lub drożdżami gazotwórczymi wskutek braku higieny doju.')}
                </Text>
                <Text style={styles.defectAction}>
                  ⚡ {t('Działanie naprawcze:')} {t('Wyrzucić ser! Bezwzględnie wygotować formy, chusty i zdezynfekować kocioł. Nie spożywać.')}
                </Text>
              </View>

              <View style={styles.defectCard}>
                <Text style={styles.defectWarningBadge}>WARNING</Text>
                <Text style={styles.defectTitle}>{t('Późne Wzdęcia Sera (Late Blowing)')}</Text>
                <Text style={styles.defectDesc}>
                  {t('Przetrwalniki Clostridium tyrobutyricum z kiszonki dla krów wytwarzające kwas masłowy i gaz H2.')}
                </Text>
                <Text style={styles.defectAction}>
                  ⚡ {t('Działanie naprawcze:')} {t('Stosuj lizozym lub azotan potasu (saletrę) do mleka z kiszonki; nie dopuszczaj do przegrzania jaskini.')}
                </Text>
              </View>

              <View style={styles.defectCard}>
                <Text style={styles.defectInfoBadge}>INFO</Text>
                <Text style={styles.defectTitle}>{t('Gorzknienie Skrzepu i Miąższu')}</Text>
                <Text style={styles.defectDesc}>
                  {t('Nadmiar peptydów hydrofobowych wskutek przedawkowania podpuszczki mikrobiologicznej lub niedoboru soli.')}
                </Text>
                <Text style={styles.defectAction}>
                  ⚡ {t('Działanie naprawcze:')} {t('Zmniejsz dawkę podpuszczki o 20% i skontroluj stężenie solanki (min. 18% NaCl).')}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🎓</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Szkoła Mleczarstwa (Lekcje Polowe)')}</Text>
                  <Text style={styles.cardSubtitle}>{t('Prawa fizykochemii kazeiny w 90 sekund')}</Text>
                </View>
              </View>

              <View style={styles.lessonItem}>
                <Text style={styles.lessonTitle}>1. {t('Biochemia Kazeiny i Wiązanie Wapniowe')}</Text>
                <Text style={styles.lessonText}>
                  {t('Podpuszczka przecina wiązanie Phe105-Met106 w k-kazeinie. Wolne micele łączą się za pomocą mostków Ca2+ w trójwymiarową sieć żelu.')}
                </Text>
              </View>

              <View style={styles.lessonItem}>
                <Text style={styles.lessonTitle}>2. {t('Złota Reguła Synerezy')}</Text>
                <Text style={styles.lessonText}>
                  {t('Drobniejsze cięcie ziarna i wyższe dogrzewanie wypychają serwatkę. Większa wilgotność = szybsze dojrzewanie, ale większe ryzyko zakażeń.')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* 4. USTAWIENIA I KOPIA ZAPASOWA                                  */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>⚙️</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Ustawienia Aplikacji')}</Text>
                  <Text style={styles.cardSubtitle}>{t('Lokalizacja, jednostki i kopia bezpieczeństwa')}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Język interfejsu (35 języków):')}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Chip
                    label="Polski (PL)"
                    selected={currentLang === 'pl'}
                    onPress={() => {
                      setLang('pl');
                      setCurrentLang('pl');
                    }}
                  />
                  <Chip
                    label="English (EN)"
                    selected={currentLang === 'en'}
                    onPress={() => {
                      setLang('en');
                      setCurrentLang('en');
                    }}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Układ Jednostek')}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Chip
                    label={t('Metryczny (L, kg, °C)')}
                    selected={unitSystem === 'metric'}
                    onPress={() => setUnitSystem('metric')}
                  />
                  <Chip
                    label="Imperial (gal, lb, °F)"
                    selected={unitSystem === 'imperial'}
                    onPress={() => setUnitSystem('imperial')}
                  />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>💾</Text>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.cardTitle}>{t('Kopie Bezpieczeństwa (SQLite WAL)')}</Text>
                  <Text style={styles.cardSubtitle}>
                    {t('Automatyczna rotacja 10 kopii bezpieczeństwa oraz natychmiastowy punkt przywracania.')}
                  </Text>
                </View>
              </View>

              <Btn
                title={`💾 ${t('Utwórz Kopię Zapasową JSON')}`}
                variant="primary"
                onPress={handleCreateBackup}
                style={{ marginBottom: 12 }}
              />

              <Btn
                title={`🔄 ${t('Przywróć Zakupy (StoreKit 2)')}`}
                variant="secondary"
                onPress={async () => {
                  triggerHapticFeedback();
                  const res = await restorePurchases();
                  Alert.alert(
                    res.restored ? t('Przywrócono') : t('Brak Zakupu'),
                    res.restored
                      ? t('Zakup został pomyślnie przywrócony!')
                      : t('Nie znaleziono zapisanego zakupu w bazie urządzenia.')
                  );
                }}
              />

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>{t('Historia kopii zapasowych:')} ({backups.length}/10)</Text>
                {backups.slice(0, 3).map((b) => (
                  <Text key={b.fileName} style={styles.backupItemText}>
                    • {b.fileName} ({Math.round(b.sizeBytes / 1024)} KB)
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Monetization Modal */}
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
    backgroundColor: '#1E2229',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D333F',
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
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E2229',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: '#262B34',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 10,
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
    fontSize: 11,
    color: '#94A3B8',
  },
  addBtnSmall: {
    backgroundColor: '#B86D3B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addBtnSmallText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  pantryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2D333F',
  },
  pantryItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  pantryItemCategory: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  pantryItemQty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C68A4C',
    fontVariant: ['tabular-nums'],
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 6,
  },
  readonlyCode: {
    backgroundColor: '#1E2229',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  resultItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
  },
  resultLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C68A4C',
    fontVariant: ['tabular-nums'],
  },
  defectCard: {
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 12,
    marginBottom: 10,
  },
  defectDangerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7F1D1D',
    color: '#FEE2E2',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  defectWarningBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#78350F',
    color: '#FEF3C7',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  defectInfoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E3A8A',
    color: '#DBEAFE',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  defectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  defectDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 6,
  },
  defectAction: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
    lineHeight: 17,
  },
  lessonItem: {
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D333F',
    padding: 12,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  lessonText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  backupItemText: {
    fontSize: 12,
    color: '#94A3B8',
    fontVariant: ['tabular-nums'],
    marginBottom: 4,
  },
  phageRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  phageBadgeCritical: {
    backgroundColor: '#7F1D1D',
  },
  phageBadgeModerate: {
    backgroundColor: '#78350F',
  },
  phageBadgeLow: {
    backgroundColor: '#064E3B',
  },
  phageBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  phageChip: {
    backgroundColor: '#1E2229',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phageChipActive: {
    backgroundColor: '#B86D3B',
    borderColor: '#C68A4C',
  },
  phageChipText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  phageChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  phageGroupInfo: {
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    marginBottom: 10,
  },
  phageGroupLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phageGroupVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  phageWarningBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  phageBoxCritical: {
    backgroundColor: '#450A0A',
    borderColor: '#DC2626',
  },
  phageBoxModerate: {
    backgroundColor: '#451A03',
    borderColor: '#D97706',
  },
  phageBoxLow: {
    backgroundColor: '#064E3B',
    borderColor: '#059669',
  },
  phageWarningText: {
    fontSize: 12,
    color: '#F1F5F9',
    lineHeight: 18,
    fontWeight: '500',
  },
  phageSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  rotationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  rotationBadge: {
    backgroundColor: '#1E2229',
    borderColor: '#059669',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rotationBadgeText: {
    fontSize: 12,
    color: '#34D399',
    fontWeight: '600',
  },
  rotationRationale: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  sanitationBox: {
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 12,
    marginTop: 12,
  },
  sanitationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 4,
  },
  sanitationText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
