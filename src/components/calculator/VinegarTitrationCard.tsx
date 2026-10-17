import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { VinegarConversionResult } from '../../core/ferment-engine';
import { VinegarTitrationResult } from '../../core/fermentation-kinetics';

interface VinegarTitrationCardProps {
  vinegarBrix: number;
  setVinegarBrix: (v: number) => void;
  vinegarCalc: VinegarConversionResult;
  vinegarSampleMl: number;
  setVinegarSampleMl: (v: number) => void;
  naohTiterMl: number;
  setNaohTiterMl: (v: number) => void;
  vinegarTitrationCalc: VinegarTitrationResult;
}

export const VinegarTitrationCard: React.FC<VinegarTitrationCardProps> = ({
  vinegarBrix,
  setVinegarBrix,
  vinegarCalc,
  vinegarSampleMl,
  setVinegarSampleMl,
  naohTiterMl,
  setNaohTiterMl,
  vinegarTitrationCalc,
}) => {
  return (
    <>
      {/* Living Vinegar */}
      <View style={[styles.proCard, vinegarCalc.isAbvTooHigh && styles.cardDanger]}>
        <Text style={styles.proCardTitle}>🍎 {t('Żywe Octy Owocowe & ABV Inhibition Guard')}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Początkowe °Brix owoców:')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(vinegarBrix)}
            onChangeText={(v) => setVinegarBrix(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.vinegarBox}>
          <Text style={styles.vinegarText}>
            • {t('Przewidywany alkohol:')} <Text style={styles.boldText}>{vinegarCalc.estimatedAbvPct}% ABV</Text>
          </Text>
          <Text style={styles.vinegarText}>
            • {t('Przewidywany kwas octowy:')}{' '}
            <Text style={styles.boldText}>{vinegarCalc.expectedAceticAcidPct}%</Text>
          </Text>
          <Text style={[styles.vinegarAlert, vinegarCalc.isAbvTooHigh && styles.vinegarAlertDanger]}>
            {vinegarCalc.message}
          </Text>
        </View>
      </View>

      {/* Titratable Acidity (TA) with 0.1M NaOH */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🧪 {t('Miareczkowanie Kwasowości Octu (TA z NaOH 0.1M)')}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Objętość próbki octu (ml):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(vinegarSampleMl)}
            onChangeText={(v) => setVinegarSampleMl(parseFloat(v) || 1)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Zużyty 0.1M NaOH (ml do różu):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(naohTiterMl)}
            onChangeText={(v) => setNaohTiterMl(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.vinegarBox}>
          <Text style={styles.vinegarText}>
            • {t('Kwasowość całkowita:')}{' '}
            <Text style={styles.boldText}>{vinegarTitrationCalc.aceticAcidPercentage}% {t('kwasu octowego')}</Text>
          </Text>
          <Text style={styles.vinegarText}>
            • {t('Klasyfikacja:')} <Text style={styles.boldText}>{vinegarTitrationCalc.classification}</Text>
          </Text>
          <Text style={[styles.vinegarAlert, !vinegarTitrationCalc.isFoodGradeSafe && styles.vinegarAlertDanger]}>
            {vinegarTitrationCalc.notes}
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
  vinegarBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  vinegarText: {
    fontSize: 12,
    color: '#334155',
    marginVertical: 2,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  vinegarAlert: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 4,
  },
  vinegarAlertDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
});
