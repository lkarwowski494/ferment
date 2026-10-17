import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { LegumeType, TempehResult } from '../../core/tempeh-kinetics';

interface TempehCardProps {
  legumeType: LegumeType;
  setLegumeType: (v: LegumeType) => void;
  dryGrams: number;
  setDryGrams: (v: number) => void;
  vinegarMl: number;
  setVinegarMl: (v: number) => void;
  incubationHours: number;
  setIncubationHours: (v: number) => void;
  coreTempC: number;
  setCoreTempC: (v: number) => void;
  tempehCalc: TempehResult | null;
}

export const TempehCard: React.FC<TempehCardProps> = ({
  legumeType,
  setLegumeType,
  dryGrams,
  setDryGrams,
  vinegarMl,
  setVinegarMl,
  incubationHours,
  setIncubationHours,
  coreTempC,
  setCoreTempC,
  tempehCalc,
}) => {
  if (!tempehCalc) return null;

  return (
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
            style={[styles.presetPill, legumeType === lg.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setLegumeType(lg.id);
            }}
          >
            <Text style={[styles.presetPillText, legumeType === lg.id && styles.presetPillTextActive]}>
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
          value={String(dryGrams)}
          onChangeText={(v) => setDryGrams(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Ocet 5% do moczenia/gotowania (ml):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinegarMl)}
          onChangeText={(v) => setVinegarMl(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Godzina inkubacji (0-36h):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(incubationHours)}
          onChangeText={(v) => setIncubationHours(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Temperatura rdzenia wsadu (°C):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(coreTempC)}
          onChangeText={(v) => setCoreTempC(parseFloat(v) || 0)}
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
  );
};

const styles = StyleSheet.create({
  proCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  proCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 4,
  },
  proCardDesc: {
    fontSize: 12,
    color: '#57534E',
    marginBottom: 8,
    lineHeight: 17,
  },
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403C',
    marginBottom: 4,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F5F5F4',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  presetPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  presetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  presetPillTextActive: {
    color: '#B45309',
    fontWeight: '700',
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
  brineResultBox: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  safetyStatus: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  safetyDanger: {
    color: '#DC2626',
  },
  boldText: {
    fontWeight: '800',
    color: '#1C1917',
  },
  recipeDetailText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
});
