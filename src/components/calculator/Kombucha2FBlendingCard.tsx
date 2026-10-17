import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  KombuchaBottleType,
  Kombucha2FBlendingResult,
} from '../../core/kombucha-blending';

interface Kombucha2FBlendingCardProps {
  selectedJuiceId: string;
  setSelectedJuiceId: (v: string) => void;
  juiceVolumeMl: number;
  setJuiceVolumeMl: (v: number) => void;
  kombuchaBottleType: KombuchaBottleType;
  setKombuchaBottleType: (v: KombuchaBottleType) => void;
  daysIn2F: number;
  setDaysIn2F: (v: number) => void;
  kombuchaBlendingCalc: Kombucha2FBlendingResult;
}

export const Kombucha2FBlendingCard: React.FC<Kombucha2FBlendingCardProps> = ({
  selectedJuiceId,
  setSelectedJuiceId,
  juiceVolumeMl,
  setJuiceVolumeMl,
  kombuchaBottleType,
  setKombuchaBottleType,
  daysIn2F,
  setDaysIn2F,
  kombuchaBlendingCalc,
}) => {
  return (
    <View style={[styles.proCard, kombuchaBlendingCalc.isExplosionHazard && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🍾 {t('Mieszanie Owocowe 2F & Dynamika Wysycenia')}</Text>

      <Text style={styles.inputLabelMini}>{t('Profil soku / owocu:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'apple', label: t('Sok jabłkowy (11.5°Bx)') },
          { id: 'raspberry', label: t('Sok malinowy (7.5°Bx)') },
          { id: 'ginger_lemon', label: t('Imbir-cytryna z miodem (14°Bx)') },
          { id: 'pomegranate', label: t('Sok z granatu (13°Bx)') },
          { id: 'pure_cane_sugar', label: t('Syrop cukrowy (65°Bx)') },
        ].map((j) => (
          <TouchableOpacity
            key={j.id}
            style={[styles.presetPill, selectedJuiceId === j.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setSelectedJuiceId(j.id);
            }}
          >
            <Text style={[styles.presetPillText, selectedJuiceId === j.id && styles.presetPillTextActive]}>
              {j.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Ilość soku owocowego (ml):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(juiceVolumeMl)}
          onChangeText={(v) => setJuiceVolumeMl(parseFloat(v) || 0)}
        />
      </View>

      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ butelki:')}</Text>
      <View style={{ gap: 4, marginVertical: 4 }}>
        {[
          { id: 'HEAVY_SWING_TOP_AMBER' as const, label: t('Butelka z pałąkiem (Swing-Top) [max 4.5 vol]') },
          { id: 'CROWN_CAP_BEER_BOTTLE' as const, label: t('Kapslowana butelka do piwa [max 3.5 vol]') },
          { id: 'CHAMPAGNE_HEAVY' as const, label: t('Ciężka butelka do szampana [max 6.0 vol]') },
          { id: 'SQUARE_DECORATIVE' as const, label: t('Kwadratowa ozdobna [ZAGROŻENIE EKSPLOZJĄ! max 1.8 vol]') },
        ].map((bType) => (
          <TouchableOpacity
            key={bType.id}
            style={[
              styles.presetPill,
              kombuchaBottleType === bType.id && styles.presetPillActive,
              bType.id === 'SQUARE_DECORATIVE' && { borderColor: '#EF4444' }
            ]}
            onPress={() => {
              triggerHapticFeedback();
              setKombuchaBottleType(bType.id);
            }}
          >
            <Text style={[
              styles.presetPillText,
              kombuchaBottleType === bType.id && styles.presetPillTextActive,
              bType.id === 'SQUARE_DECORATIVE' && { color: '#DC2626', fontWeight: '700' }
            ]}>
              {bType.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Dni w temp. pokojowej:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(daysIn2F)}
          onChangeText={(v) => setDaysIn2F(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.pressureBox}>
        <Text style={styles.pressureVolText}>
          {t('Szacowane CO2:')} <Text style={styles.boldText}>{kombuchaBlendingCalc.estimatedCo2Volumes} vol</Text> | {t('Szacowane ciśnienie (20°C):')} <Text style={styles.boldText}>{kombuchaBlendingCalc.estimatedPressureBarAt20C} bar</Text>
        </Text>
        <Text style={styles.recipeDetailText}>
          • {t('Cukier dodany z owoców:')} <Text style={styles.boldText}>{kombuchaBlendingCalc.sugarAddedGrams} g</Text> ({kombuchaBlendingCalc.effectiveSugarGramsPerLiter} g/L)
        </Text>
        <Text style={[
          styles.riskAlertText,
          kombuchaBlendingCalc.isExplosionHazard && styles.riskAlertDanger
        ]}>
          {kombuchaBlendingCalc.warningMessage}
        </Text>
        <Text style={[styles.recipeDetailText, { marginTop: 4, color: '#15803D' }]}>
          💡 {kombuchaBlendingCalc.refrigerationAdvice}
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
  pressureBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  pressureVolText: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 4,
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
  riskAlertText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4,
  },
  riskAlertDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
});
