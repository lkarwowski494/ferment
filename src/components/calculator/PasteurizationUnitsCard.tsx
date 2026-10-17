import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  PasteurizationTargetCategory,
  PasteurizationResult,
  PASTEURIZATION_TARGETS,
} from '../../core/pasteurization-units';

interface PasteurizationUnitsCardProps {
  puCategory: PasteurizationTargetCategory;
  setPuCategory: (v: PasteurizationTargetCategory) => void;
  puWaterBathTempC: number;
  setPuWaterBathTempC: (v: number) => void;
  puHoldMinutes: number;
  setPuHoldMinutes: (v: number) => void;
  puBottleVolumeMl: number;
  setPuBottleVolumeMl: (v: number) => void;
  puPlanCalc: PasteurizationResult | null;
}

export const PasteurizationUnitsCard: React.FC<PasteurizationUnitsCardProps> = ({
  puCategory,
  setPuCategory,
  puWaterBathTempC,
  setPuWaterBathTempC,
  puHoldMinutes,
  setPuHoldMinutes,
  puBottleVolumeMl,
  setPuBottleVolumeMl,
  puPlanCalc,
}) => {
  if (!puPlanCalc) return null;

  return (
    <View style={[styles.proCard, puPlanCalc.thermalSafetyStatus === 'SENSORY_HEAT_DAMAGE_RISK' && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🔥 {t('Jednostki Pasteryzacji (PU) & Termiczna Stabilizacja')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Model Bigelowa, dezaktywacja drożdży w kombusze 2F, ochrona matki octowej i chrupkości')}
      </Text>

      {/* Category Selector Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'KOMBUCHA_STABILIZATION' as const, label: t('Kombucha 2F (15-25 PU)') },
          { id: 'LIVING_VINEGAR_PRESERVATION' as const, label: t('Żywy ocet (20-30 PU)') },
          { id: 'FERMENTED_HOT_SAUCE' as const, label: t('Sos chili (50-100 PU)') },
          { id: 'CRISP_PICKLE_JAR' as const, label: t('Kiszonki słoik (100-180 PU)') },
        ].map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.presetPill, puCategory === cat.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setPuCategory(cat.id);
              const meta = PASTEURIZATION_TARGETS[cat.id];
              setPuWaterBathTempC(meta.referenceTempC + 4);
            }}
          >
            <Text style={[styles.presetPillText, puCategory === cat.id && styles.presetPillTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Temperatura łaźni wodnej (°C):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(puWaterBathTempC)}
          onChangeText={(v) => setPuWaterBathTempC(parseFloat(v) || 50)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Czas w kąpieli wodnej (min):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(puHoldMinutes)}
          onChangeText={(v) => setPuHoldMinutes(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Pojemność butelki / słoika (ml):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(puBottleVolumeMl)}
          onChangeText={(v) => setPuBottleVolumeMl(parseFloat(v) || 500)}
        />
      </View>

      <View style={styles.safetyBox}>
        <Text style={[
          styles.safetyStatus,
          puPlanCalc.thermalSafetyStatus === 'SENSORY_HEAT_DAMAGE_RISK'
            ? styles.safetyDanger
            : puPlanCalc.isTargetAchieved
            ? { color: '#15803D' }
            : { color: '#B45309' }
        ]}>
          • {t('Akumulacja PU:')} {puPlanCalc.actualAccumulatedPu ?? 0} PU / {t('cel')} {puPlanCalc.targetPu} PU ({puPlanCalc.isTargetAchieved ? t('OSIĄGNIĘTY') : t('W TRAKCIE / ZA MAŁO')})
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Wymagany czas przetrzymania:')} <Text style={styles.boldText}>{puPlanCalc.requiredHoldTimeMinutes} min</Text> ({t('tempo:')} {puPlanCalc.puAccumulationRatePerMinute} PU/min)
        </Text>

        <Text style={styles.brineText}>
          • {puPlanCalc.statusMessagePl}
        </Text>

        <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
          💡 {puPlanCalc.sensoryPreservationAdvice}
        </Text>

        {puPlanCalc.recommendedWaterBathProtocol.map((step, idx) => (
          <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
            {idx + 1}. {step}
          </Text>
        ))}
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
  proCardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
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
  brineText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
});
