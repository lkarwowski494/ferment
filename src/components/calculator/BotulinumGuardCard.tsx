import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { BotulinumSafetyResult } from '../../core/ferment-engine';
import { LabFermentEvaluation } from '../../core/fermentation-kinetics';

interface BotulinumGuardCardProps {
  measuredPh: number;
  setMeasuredPh: (v: number) => void;
  fermentHours: number;
  setFermentHours: (v: number) => void;
  botulinumSafety: BotulinumSafetyResult;
  labKineticsCalc: LabFermentEvaluation;
}

export const BotulinumGuardCard: React.FC<BotulinumGuardCardProps> = ({
  measuredPh,
  setMeasuredPh,
  fermentHours,
  setFermentHours,
  botulinumSafety,
  labKineticsCalc,
}) => {
  return (
    <>
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
