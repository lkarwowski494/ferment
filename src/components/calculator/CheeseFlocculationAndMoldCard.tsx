import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  STANDARD_MOLD_TEMPLATES,
  CurdRequirementResult,
} from '../../core/mold-sizing';

interface CheeseFlocculationAndMoldCardProps {
  flocMultiplier: number;
  flocSecInput: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  flocCalc: { totalCoagulationSeconds: number; remainingSecondsAfterFloc: number };
  moldFittingCalc: CurdRequirementResult;
  milkLiters: number;
  selectedMoldTemplateId: string;
  setSelectedMoldTemplateId: (v: string) => void;
  setMoldDiamCm: (v: number) => void;
}

export const CheeseFlocculationAndMoldCard: React.FC<CheeseFlocculationAndMoldCardProps> = ({
  flocMultiplier,
  flocSecInput,
  timerSeconds,
  isTimerRunning,
  handleStartTimer,
  handleStopTimer,
  flocCalc,
  moldFittingCalc,
  milkLiters,
  selectedMoldTemplateId,
  setSelectedMoldTemplateId,
  setMoldDiamCm,
}) => {
  return (
    <>
      {/* 1. Flocculation Berridge Timer */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>
          ⏱️ {t('Punkt Flokulacji (Czas Zestalania Berridge\'a)')}
        </Text>
        <Text style={styles.proCardDesc}>
          {t('Mnożnik K')} = {flocMultiplier}x. {t('Czas flokulacji:')} {Math.floor(flocSecInput / 60)}m {flocSecInput % 60}s.
        </Text>
        <View style={styles.timerDisplay}>
          <Text style={styles.timerDigits}>
            {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
            {String(timerSeconds % 60).padStart(2, '0')}
          </Text>
          {isTimerRunning ? (
            <TouchableOpacity style={styles.timerStopBtn} onPress={handleStopTimer}>
              <Text style={styles.timerBtnText}>{t('Zatrzymaj (Flokulacja!)')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.timerStartBtn} onPress={handleStartTimer}>
              <Text style={styles.timerBtnText}>{t('Start Stopera')}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.flocResultBox}>
          <Text style={styles.flocResultText}>
            {t('Całkowity czas do cięcia:')}{' '}
            <Text style={styles.boldText}>{Math.floor(flocCalc.totalCoagulationSeconds / 60)} min</Text>
          </Text>
          <Text style={styles.flocResultSub}>
            {t('Pozostało po zestaleniu:')} {Math.floor(flocCalc.remainingSecondsAfterFloc / 60)} min
          </Text>
        </View>
      </View>

      {/* Mold Sizing & Curd Geometry */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🧀 {t('Dobór i Geometria Formy Serowarskiej')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Oczekiwany uzysk:')} <Text style={styles.boldText}>{moldFittingCalc.expectedYieldKg} kg</Text> {t('sera z')} {milkLiters}L {t('mleka')}
        </Text>
        <Text style={styles.inputLabelMini}>{t('Wybierz formę standardową:')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
          {STANDARD_MOLD_TEMPLATES.map((m) => {
            const isSel = m.id === selectedMoldTemplateId;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.presetPill, isSel && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setSelectedMoldTemplateId(m.id);
                  if (m.diameterCm) setMoldDiamCm(m.diameterCm);
                }}
              >
                <Text style={[styles.presetPillText, isSel && styles.presetPillTextActive]}>
                  {m.name} ({m.targetCheeseWeightKg} kg)
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.flocResultBox}>
          <Text style={styles.flocResultText}>
            • {t('Objętość świeżego skrzepu przed odciekiem:')}{' '}
            <Text style={styles.boldText}>{moldFittingCalc.rawCurdVolumeLiters} L</Text>
          </Text>
          <Text style={styles.flocResultSub}>
            • {t('Stopień wypełnienia formy:')} {moldFittingCalc.fillPercentage}% (
            {moldFittingCalc.isMoldSufficient ? t('Pojemność wystarczająca') : t('Uwaga: Forma może być za mała!')})
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
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  timerDigits: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    fontVariant: ['tabular-nums'],
  },
  timerStartBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  timerStopBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  flocResultBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  flocResultText: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 2,
  },
  flocResultSub: {
    fontSize: 11,
    color: '#64748B',
  },
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
    marginTop: 6,
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
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
