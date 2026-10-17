// ============================================================================
// Apps4Brew Studio — SEROWAR Tab 2: NABIAŁ & KUCHNIA (dairy.tsx)
// Twarogi klinkowe, masielnictwo rzemieślnicze & ghee, napoje fermentowane, obieg serwatki
// Ergonomia: 'Hands in whey' >= 48pt, WCAG AAA, 1px tactile borders, tabular-nums
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';
import { NumInput } from '../../src/components/ui/NumInput';
import { Segmented } from '../../src/components/ui';
import { calculateRicottaRecovery } from '../../src/core/whey-utilization';

export default function DairyScreen() {
  // Mode switcher: Twarogi | Masielnictwo | Napoje | Obieg Serwatki
  const [dairyMode, setDairyMode] = useState<'curd' | 'butter' | 'drinks' | 'whey'>('curd');

  // Twarogi State
  const [curdMilkLiters, setCurdMilkLiters] = useState<number>(10);
  const [curdHeatingTempC, setCurdHeatingTempC] = useState<number>(40);
  const [curdDrainHours, setCurdDrainHours] = useState<number>(4);

  // Masielnictwo State
  const [creamMassGrams, setCreamMassGrams] = useState<number>(1000);
  const [creamFatPct, setCreamFatPct] = useState<number>(36);
  const [churnTempC, setChurnTempC] = useState<number>(12);

  // Napoje Fermentowane State
  const [yogurtMilkLiters, setYogurtMilkLiters] = useState<number>(2);
  const [yogurtIncubationTempC, setYogurtIncubationTempC] = useState<number>(43);

  // Obieg Serwatki State
  const [wheyLiters, setWheyLiters] = useState<number>(8);
  const [wheyMilkBoostLiters, setWheyMilkBoostLiters] = useState<number>(0.8);
  const [wheyAcidMl, setWheyAcidMl] = useState<number>(40);

  // Obliczenia Twarogu (Typowy uzysk 18-20% z litra mleka)
  const expectedCurdKg = Math.round(curdMilkLiters * 0.19 * 100) / 100;
  const isCurdOverheating = curdHeatingTempC > 44;

  // Obliczenia Masielnictwa (Tłuszcz masła = 82.5%)
  const pureFatGrams = creamMassGrams * (creamFatPct / 100);
  const expectedButterGrams = Math.round((pureFatGrams / 0.825) * 10) / 10;
  const expectedButtermilkGrams = Math.max(0, Math.round((creamMassGrams - expectedButterGrams) * 10) / 10);
  const isChurnTempOptimal = churnTempC >= 10 && churnTempC <= 14;

  // Obliczenia Obiegu Serwatki (Ricotta & Brunost)
  const ricottaResult = calculateRicottaRecovery(wheyLiters, wheyMilkBoostLiters);
  const brunostEstimatedYieldGrams = Math.round(wheyLiters * 65); // ok. 65g suchej masy karmelowej z litra

  const modeOptions: { label: string; value: 'curd' | 'butter' | 'drinks' | 'whey' }[] = [
    { label: t('Twarogi'), value: 'curd' },
    { label: t('Masielnictwo & Ghee'), value: 'butter' },
    { label: t('Napoje Fermentowane'), value: 'drinks' },
    { label: t('Obieg Serwatki'), value: 'whey' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Nabiał & Kuchnia')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('Tradycyjne przetwórstwo mleka, twarogi klinkowe, masło i zero-waste')}
        </Text>
      </View>

      <View style={styles.segmentContainer}>
        <Segmented
          options={modeOptions}
          selectedValue={dairyMode}
          onSelect={(val) => {
            triggerHapticFeedback();
            setDairyMode(val);
          }}
          accessibilityLabel={t('Nabiał & Kuchnia')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ============================================================== */}
        {/* MODUŁ 1: TWAROGI KLINKOWE & SERY ŚWIEŻE                         */}
        {/* ============================================================== */}
        {dairyMode === 'curd' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🧈</Text>
              <View style={styles.cardTitleCol}>
                <Text style={styles.cardTitle}>{t('Tradycyjny Twaróg Klinkowy')}</Text>
                <Text style={styles.cardSubtitle}>{t('Koagulacja kwasowa w punkcie pI 4.60')}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Objętość mleka zsiadłego (L):')}</Text>
              <NumInput
                value={curdMilkLiters}
                onChangeValue={setCurdMilkLiters}
                step={1}
                min={1}
                max={50}
                accessibilityLabel={t('Objętość mleka zsiadłego (L):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Temperatura dogrzewania skrzepu (°C):')}</Text>
              <NumInput
                value={curdHeatingTempC}
                onChangeValue={setCurdHeatingTempC}
                step={1}
                min={30}
                max={55}
                accessibilityLabel={t('Temperatura dogrzewania skrzepu (°C):')}
              />
            </View>

            {isCurdOverheating && (
              <View style={styles.alertDanger}>
                <Text style={styles.alertDangerText}>
                  ⚠️ {t('ALARM: Temperatura > 44°C! Ryzyko stwardnienia kazeiny i gumowatego twarogu. Zdejmij z ognia!')}
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>{t('Czas odcieku w chuście klinkowej (godz.):')}</Text>
              <NumInput
                value={curdDrainHours}
                onChangeValue={setCurdDrainHours}
                step={1}
                min={1}
                max={24}
                accessibilityLabel={t('Czas odcieku w chuście klinkowej (godz.):')}
              />
            </View>

            <View style={styles.resultsGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Szacowany uzysk twarogu:')}</Text>
                <Text style={styles.resultValue}>{expectedCurdKg} kg</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Pozyskana serwatka kwasowa:')}</Text>
                <Text style={styles.resultValue}>{Math.round((curdMilkLiters - expectedCurdKg) * 10) / 10} L</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💡 {t('Wskazówka warsztatowa:')}</Text>
              <Text style={styles.infoText}>
                {t('Podgrzewaj skrzep wolno: 1°C na 3 minuty. Przy 38–40°C ziarno jest delikatne i maślane. Nie prasuj twarogu ciężarami — grawitacyjny odciek w wiszącej chuście zapewnia aksamitną strukturę.')}
              </Text>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* MODUŁ 2: MASIELNICTWO RZEMIEŚLNICZE & GHEE                      */}
        {/* ============================================================== */}
        {dairyMode === 'butter' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🧈</Text>
              <View style={styles.cardTitleCol}>
                <Text style={styles.cardTitle}>{t('Masielnictwo & Ghee')}</Text>
                <Text style={styles.cardSubtitle}>{t('Inwersja emulsji tłuszczowej i klarowanie masła')}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Masa śmietanki (g):')}</Text>
              <NumInput
                value={creamMassGrams}
                onChangeValue={setCreamMassGrams}
                step={100}
                min={200}
                max={5000}
                unit="g"
                accessibilityLabel={t('Masa śmietanki (g):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Zawartość tłuszczu śmietanki (%):')}</Text>
              <NumInput
                value={creamFatPct}
                onChangeValue={setCreamFatPct}
                step={2}
                min={25}
                max={45}
                accessibilityLabel={t('Zawartość tłuszczu śmietanki (%):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Temperatura zmaślania (°C):')}</Text>
              <NumInput
                value={churnTempC}
                onChangeValue={setChurnTempC}
                step={1}
                min={8}
                max={20}
                accessibilityLabel={t('Temperatura zmaślania (°C):')}
              />
            </View>

            {!isChurnTempOptimal && (
              <View style={styles.alertWarning}>
                <Text style={styles.alertWarningText}>
                  ℹ️ {churnTempC < 10
                    ? t('Śmietanka zbyt zimna (<10°C): zmaślanie będzie trwało bardzo długo.')
                    : t('Śmietanka zbyt ciepła (>14°C): masło będzie miękkie, a maślanka uwięziona w ziarnach.')}
                </Text>
              </View>
            )}

            <View style={styles.resultsGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Spodziewana kostka masła (82.5%):')}</Text>
                <Text style={styles.resultValue}>{expectedButterGrams} g</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Świeża maślanka rzemieślnicza:')}</Text>
                <Text style={styles.resultValue}>{expectedButtermilkGrams} g</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Wytopione klarowane Ghee (99.5%):')}</Text>
                <Text style={styles.resultValue}>{Math.round(pureFatGrams * 0.995)} g</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>🧊 {t('Protokół płukania lodowego:')}</Text>
              <Text style={styles.infoText}>
                {t('Po zbiciu ziaren masła odsącz maślankę i przepłucz ziarna 3 razy wodą lodową (<4°C). Każda kropla usuniętej maślanki wydłuża trwałość masła z tygodnia do 6 miesięcy!')}
              </Text>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* MODUŁ 3: NAPOJE FERMENTOWANE (JOGURT & KEFIR)                   */}
        {/* ============================================================== */}
        {dairyMode === 'drinks' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🥛</Text>
              <View style={styles.cardTitleCol}>
                <Text style={styles.cardTitle}>{t('Napoje Probiotyczne (Jogurt & Kefir)')}</Text>
                <Text style={styles.cardSubtitle}>{t('Fermentacja mlekowa kulturami symbiotycznymi')}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Objętość mleka na jogurt (L):')}</Text>
              <NumInput
                value={yogurtMilkLiters}
                onChangeValue={setYogurtMilkLiters}
                step={0.5}
                min={0.5}
                max={10}
                accessibilityLabel={t('Objętość mleka na jogurt (L):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Temperatura inkubacji jogurtu (°C):')}</Text>
              <NumInput
                value={yogurtIncubationTempC}
                onChangeValue={setYogurtIncubationTempC}
                step={1}
                min={38}
                max={48}
                accessibilityLabel={t('Temperatura inkubacji jogurtu (°C):')}
              />
            </View>

            <View style={styles.resultsGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Gęsty jogurt naturalny:')}</Text>
                <Text style={styles.resultValue}>{yogurtMilkLiters} L</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Odsączony jogurt grecki (50%):')}</Text>
                <Text style={styles.resultValue}>{Math.round(yogurtMilkLiters * 0.5 * 100) / 100} kg</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>🔬 {t('Kefir na grzybku tybetańskim:')}</Text>
              <Text style={styles.infoText}>
                {t('Stosuj 30g ziaren kefirowych na 1 litr mleka w temp. 20–22°C przez 24 godziny. Do napoju przechodzi kwas mlekowy, dwutlenek węgla i kefiran o właściwościach immunostymulujących.')}
              </Text>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* MODUŁ 4: ZAMKNIĘTY OBIEG SERWATKI (RICOTTA & BRUNOST)           */}
        {/* ============================================================== */}
        {dairyMode === 'whey' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>♻️</Text>
              <View style={styles.cardTitleCol}>
                <Text style={styles.cardTitle}>{t('Zamknięty Obieg Serwatki (Zero-Waste)')}</Text>
                <Text style={styles.cardSubtitle}>{t('Odzysk białek albuminowych i karmelizacja laktozy')}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Objętość świeżej słodkiej serwatki (L):')}</Text>
              <NumInput
                value={wheyLiters}
                onChangeValue={setWheyLiters}
                step={1}
                min={2}
                max={50}
                accessibilityLabel={t('Objętość świeżej słodkiej serwatki (L):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Dodatek mleka pełnego dla wydajności (L):')}</Text>
              <NumInput
                value={wheyMilkBoostLiters}
                onChangeValue={setWheyMilkBoostLiters}
                step={0.2}
                min={0}
                max={5}
                accessibilityLabel={t('Dodatek mleka pełnego dla wydajności (L):')}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t('Kwas spożywczy (ocet 6% lub sok cytrynowy ml):')}</Text>
              <NumInput
                value={wheyAcidMl}
                onChangeValue={setWheyAcidMl}
                step={5}
                min={10}
                max={150}
                accessibilityLabel={t('Kwas spożywczy (ocet 6% lub sok cytrynowy ml):')}
              />
            </View>

            <View style={styles.resultsGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Spodziewana Ricotta zagrodowa:')}</Text>
                <Text style={styles.resultValue}>{ricottaResult.estimatedRicottaYieldGrams} g</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>{t('Wydajność norweskiego sera Brunost:')}</Text>
                <Text style={styles.resultValue}>{brunostEstimatedYieldGrams} g</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>🇳🇴 {t('Sekret sera Brunost (Mysost):')}</Text>
              <Text style={styles.infoText}>
                {t('Odparuj serwatkę na małym ogniu (102°C) do 1/5 objętości, dodaj śmietankę i mieszaj aż laktoza skarmelizuje się na brązowo. Schłodź w kąpieli lodowej energicznie ucierając, aby zapobiec wytrąceniu wyczuwalnych kryształków piasku.')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
    fontSize: 13,
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
    paddingBottom: 32,
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 10,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitleCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 6,
    fontWeight: '500',
  },
  alertDanger: {
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  alertDangerText: {
    color: '#FEE2E2',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  alertWarning: {
    backgroundColor: '#78350F',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  alertWarningText: {
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  resultItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
  },
  resultLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C68A4C', // Aged Rind Ochre
    fontVariant: ['tabular-nums'],
  },
  infoBox: {
    backgroundColor: '#1E2229',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D333F',
    padding: 12,
    marginTop: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
});
