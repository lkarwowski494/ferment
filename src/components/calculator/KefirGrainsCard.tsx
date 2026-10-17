import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  KefirMediumType,
  Kefir1FResult,
  Kefir2FResult,
} from '../../core/kefir-grains';

interface KefirGrainsCardProps {
  kefirMedium: KefirMediumType;
  setKefirMedium: (v: KefirMediumType) => void;
  kefirLiquidVolumeMl: number;
  setKefirLiquidVolumeMl: (v: number) => void;
  kefirGrainWeightGrams: number;
  setKefirGrainWeightGrams: (v: number) => void;
  ambientTempC: number;
  kefir1FCalc: Kefir1FResult | null;
  kefir2FCalc: Kefir2FResult | null;
}

export const KefirGrainsCard: React.FC<KefirGrainsCardProps> = ({
  kefirMedium,
  setKefirMedium,
  kefirLiquidVolumeMl,
  setKefirLiquidVolumeMl,
  kefirGrainWeightGrams,
  setKefirGrainWeightGrams,
  ambientTempC,
  kefir1FCalc,
  kefir2FCalc,
}) => {
  if (!kefir1FCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🥛 {t('Ziarna Kefirowe & Tibicos (1F/2F)')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Symbiotyczna matryca kefiranu, inokulacja (2.5-5%), kinetyka trawienia laktozy i nasycenie CO2')}
      </Text>

      {/* Medium selector */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ kefiru:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'MILK_KEFIR' as const, label: t('Kefir Mleczny (Ziarna tybetańskie)') },
          { id: 'WATER_KEFIR_TIBICOS' as const, label: t('Kefir Wodny (Kryształki Tibicos)') },
        ].map((km) => (
          <TouchableOpacity
            key={km.id}
            style={[styles.presetPill, kefirMedium === km.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setKefirMedium(km.id);
            }}
          >
            <Text style={[styles.presetPillText, kefirMedium === km.id && styles.presetPillTextActive]}>
              {km.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Objętość płynu (ml):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(kefirLiquidVolumeMl)}
          onChangeText={(v) => setKefirLiquidVolumeMl(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa ziaren kefirowych (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(kefirGrainWeightGrams)}
          onChangeText={(v) => setKefirGrainWeightGrams(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.brineResultBox}>
        <Text style={[
          styles.safetyStatus,
          kefir1FCalc.status !== 'OPTIMAL' ? styles.safetyDanger : { color: '#15803D' }
        ]}>
          • {t('Status inokulacji 1F:')} {kefir1FCalc.status} ({kefir1FCalc.inoculationRatioPct}%)
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Zalecana masa ziaren:')} <Text style={styles.boldText}>{kefir1FCalc.recommendedGrainWeightMinG}–{kefir1FCalc.recommendedGrainWeightMaxG} g</Text> ({t('na')} {kefirLiquidVolumeMl} ml)
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Szacowany czas 1F:')} <Text style={styles.boldText}>~{kefir1FCalc.estimatedFermentationHours} {t('godzin')}</Text> ({t('w temp.')} {ambientTempC}°C)
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Redukcja laktozy w 1F:')} <Text style={styles.boldText}>~{kefir1FCalc.expectedLactoseReductionPct}%</Text> | {t('Przyrost biomasy ziaren:')} <Text style={styles.boldText}>+{kefir1FCalc.biomassGrowthPotentialGrams} g/dobę</Text>
        </Text>

        {kefir1FCalc.alertsPl.map((alert, idx) => (
          <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
            ⚠️ {alert}
          </Text>
        ))}

        {kefir1FCalc.recommendationsPl.map((rec, idx) => (
          <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
            💡 {rec}
          </Text>
        ))}

        {/* 2F Secondary Fermentation Section */}
        {kefir2FCalc && (
          <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
            <Text style={[styles.proCardTitle, { fontSize: 13 }]}>
              🍾 {t('Refermentacja Wtórna 2F (Bez ziaren):')}
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Nasycenie CO2:')} <Text style={styles.boldText}>{kefir2FCalc.carbonationLevelVol} vol</Text> | {t('Ostateczna redukcja laktozy:')} <Text style={styles.boldText}>{kefir2FCalc.finalLactoseReductionPct}%</Text> ({t('praktycznie bezlaktozowy')})
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Wzrost kwasu foliowego (B9):')} <Text style={styles.boldText}>+{kefir2FCalc.folateIncreasePct}%</Text>
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 2 }]}>
              💡 {kefir2FCalc.servingNotesPl}
            </Text>
            {kefir2FCalc.alertsPl.map((alert, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 3 }}>
                ⚠️ {alert}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  proCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 14,
  },
  proCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  proCardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 4,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 48,
    justifyContent: 'center',
  },
  presetPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  presetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  presetPillTextActive: {
    color: '#FFFFFF',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  inlineLabel: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  numInput: {
    minWidth: 80,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    textAlign: 'right',
  },
  brineResultBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  safetyStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
