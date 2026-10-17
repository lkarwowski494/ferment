import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { KimchiPrepResult } from '../../core/ferment-engine';

interface KimchiCardProps {
  cabbageGrams: number;
  setCabbageGrams: (v: number) => void;
  kimchiPrep: KimchiPrepResult;
}

export const KimchiCard: React.FC<KimchiCardProps> = ({
  cabbageGrams,
  setCabbageGrams,
  kimchiPrep,
}) => {
  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>🥬 {t('Asystent Tradycyjnego Kimchi')}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa kapusty pekińskiej (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cabbageGrams)}
          onChangeText={(v) => setCabbageGrams(parseFloat(v) || 0)}
        />
      </View>
      <View style={styles.kimchiBox}>
        <Text style={styles.kimchiLine}>
          • {t('Sól na sucho do więdnięcia (8.5%):')}{' '}
          <Text style={styles.boldText}>{kimchiPrep.saltWeightGrams} g</Text>
        </Text>
        <Text style={styles.kimchiLine}>
          • {t('Mąka ryżowa do kleiku:')} {kimchiPrep.paste.riceFlourGrams} g
        </Text>
        <Text style={styles.kimchiLine}>
          • {t('Woda do kleiku:')} {kimchiPrep.paste.waterForPorridgeMl} ml
        </Text>
        <Text style={styles.kimchiLine}>
          • {t('Papryka Gochugaru:')} {kimchiPrep.paste.gochugaruGrams} g
        </Text>
        <Text style={styles.kimchiLine}>
          • {t('Czosnek i Imbir:')} {kimchiPrep.paste.garlicGrams}g / {kimchiPrep.paste.gingerGrams}g
        </Text>
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
  kimchiBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  kimchiLine: {
    fontSize: 12,
    color: '#7F1D1D',
    marginVertical: 2,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
