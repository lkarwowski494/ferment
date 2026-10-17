import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { Q10KineticsResult } from '../../core/fermentation-q10';
import { CrockHeadspaceResult } from '../../core/crock-headspace';

interface Q10AndHeadspaceCardProps {
  ambientTempC: number;
  setAmbientTempC: (v: number) => void;
  q10VegCalc: Q10KineticsResult | null;
  jarCapacityMl: number;
  setJarCapacityMl: (v: number) => void;
  stoneWeightGrams: number;
  setStoneWeightGrams: (v: number) => void;
  crockHeadspaceCalc: CrockHeadspaceResult | null;
}

export const Q10AndHeadspaceCard: React.FC<Q10AndHeadspaceCardProps> = ({
  ambientTempC,
  setAmbientTempC,
  q10VegCalc,
  jarCapacityMl,
  setJarCapacityMl,
  stoneWeightGrams,
  setStoneWeightGrams,
  crockHeadspaceCalc,
}) => {
  return (
    <>
      {/* Q10 Fermentation Kinetics */}
      {q10VegCalc && (
        <View style={[styles.proCard, (q10VegCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10VegCalc.zone === 'DORMANT_SLUGGISH') && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>🌡️ {t('Kompensacja Temperatury Q10 (Kinetyka Pokojowa)')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(ambientTempC)}
              onChangeText={(v) => setAmbientTempC(parseFloat(v) || 20)}
            />
          </View>
          <View style={styles.safetyBox}>
            <Text style={styles.proCardDesc}>
              • {t('Mnożnik kinetyki:')} <Text style={styles.boldText}>{q10VegCalc.velocityMultiplier}x</Text> {t('(względem 20°C)')}
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Skorygowany czas fermentacji:')} <Text style={styles.boldText}>{q10VegCalc.adjustedDays} {t('dni')}</Text> ({q10VegCalc.adjustedHours} {t('godz.')})
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Szacowana bariera pH 4.60 po:')} <Text style={styles.boldText}>{q10VegCalc.botulinumSafeHourEstimated} {t('godz.')}</Text>
            </Text>
            <Text style={[styles.safetyStatus, (q10VegCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10VegCalc.zone === 'DORMANT_SLUGGISH') && styles.safetyDanger, { marginTop: 4 }]}>
              {t('Strefa termiczna:')} {q10VegCalc.zoneLabel}
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {q10VegCalc.flavorProfileImpact}
            </Text>
          </View>
        </View>
      )}

      {/* Crock & Jar Headspace Guard */}
      {crockHeadspaceCalc && (
        <View style={[styles.proCard, crockHeadspaceCalc.status !== 'OPTIMAL' && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>🏺 {t('Pojemność Słoja & Wolna Przestrzeń (Headspace Guard)')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Pojemność słoja (ml):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(jarCapacityMl)}
              onChangeText={(v) => setJarCapacityMl(parseFloat(v) || 1000)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa docisku (kamień/szkło g):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(stoneWeightGrams)}
              onChangeText={(v) => setStoneWeightGrams(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.safetyBox}>
            <Text style={styles.proCardDesc}>
              • {t('Objętość wsadu z dociskiem:')} <Text style={styles.boldText}>{crockHeadspaceCalc.totalSubstanceVolumeMl} ml</Text>
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Pozostała wolna przestrzeń:')} <Text style={styles.boldText}>{crockHeadspaceCalc.remainingHeadspaceMl} ml</Text> ({crockHeadspaceCalc.headspacePercentage}%)
            </Text>
            <Text style={[styles.safetyStatus, crockHeadspaceCalc.status !== 'OPTIMAL' && styles.safetyDanger, { marginTop: 4 }]}>
              {crockHeadspaceCalc.summaryAlert}
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {crockHeadspaceCalc.recommendations[0]}
            </Text>
          </View>
        </View>
      )}
    </>
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
  cardDanger: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
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
  safetyBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  safetyStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  safetyDanger: {
    color: '#DC2626',
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
});
