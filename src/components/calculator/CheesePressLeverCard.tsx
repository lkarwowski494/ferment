import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { DutchLeverResult, PressingCascadeProgram } from '../../core/press-cascade';
import { PressPressureResult } from '../../core/cheese-engine';

interface CheesePressLeverCardProps {
  pressMechanism: 'DUTCH_LEVER' | 'DIRECT';
  setPressMechanism: (mechanism: 'DUTCH_LEVER' | 'DIRECT') => void;
  moldDiamCm: number;
  setMoldDiamCm: (v: number) => void;
  pressWeightKg: number;
  setPressWeightKg: (v: number) => void;
  armLengthCm: number;
  setArmLengthCm: (v: number) => void;
  moldDistCm: number;
  setMoldDistCm: (v: number) => void;
  armWeightKg: number;
  setArmWeightKg: (v: number) => void;
  dutchLeverCalc: DutchLeverResult;
  pressCalc: PressPressureResult;
  isPressCascadeOpen: boolean;
  setIsPressCascadeOpen: (v: boolean) => void;
  pressingCascadeProg: PressingCascadeProgram;
}

export const CheesePressLeverCard: React.FC<CheesePressLeverCardProps> = ({
  pressMechanism,
  setPressMechanism,
  moldDiamCm,
  setMoldDiamCm,
  pressWeightKg,
  setPressWeightKg,
  armLengthCm,
  setArmLengthCm,
  moldDistCm,
  setMoldDistCm,
  armWeightKg,
  setArmWeightKg,
  dutchLeverCalc,
  pressCalc,
  isPressCascadeOpen,
  setIsPressCascadeOpen,
  pressingCascadeProg,
}) => {
  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>⚖️ {t('Kalkulator Nacisku i Dźwigni Prasy')}</Text>
      <View style={styles.typeSelectorRow}>
        <TouchableOpacity
          style={[styles.typePill, pressMechanism === 'DUTCH_LEVER' && styles.typePillActive]}
          onPress={() => {
            triggerHapticFeedback();
            setPressMechanism('DUTCH_LEVER');
          }}
        >
          <Text style={[styles.typePillText, pressMechanism === 'DUTCH_LEVER' && styles.typePillTextActive]}>
            {t('Dźwignia Holenderska (z tarą)')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typePill, pressMechanism === 'DIRECT' && styles.typePillActive]}
          onPress={() => {
            triggerHapticFeedback();
            setPressMechanism('DIRECT');
          }}
        >
          <Text style={[styles.typePillText, pressMechanism === 'DIRECT' && styles.typePillTextActive]}>
            {t('Nacisk Bezpośredni / Śruba')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Średnica formy (cm):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(moldDiamCm)}
          onChangeText={(v) => setMoldDiamCm(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa obciążnika (kg):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(pressWeightKg)}
          onChangeText={(v) => setPressWeightKg(parseFloat(v) || 0)}
        />
      </View>

      {pressMechanism === 'DUTCH_LEVER' && (
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Długość ramienia (cm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(armLengthCm)}
              onChangeText={(v) => setArmLengthCm(parseFloat(v) || 10)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Odległość formy od osi (cm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(moldDistCm)}
              onChangeText={(v) => setMoldDistCm(parseFloat(v) || 5)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa własna belki (tara kg):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(armWeightKg)}
              onChangeText={(v) => setArmWeightKg(parseFloat(v) || 0)}
            />
          </View>
        </View>
      )}

      <View style={styles.pressureResultBox}>
        <Text style={styles.pressureValue}>
          {pressMechanism === 'DUTCH_LEVER'
            ? `${dutchLeverCalc.pressureKgPerCm2.toFixed(3)} kg/cm² (${dutchLeverCalc.pressurePsi.toFixed(2)} PSI)`
            : `${pressCalc.pressureKgCm2.toFixed(3)} kg/cm² (${pressCalc.pressurePsi.toFixed(2)} PSI)`}
        </Text>
        <Text style={styles.pressureSub}>
          {pressMechanism === 'DUTCH_LEVER'
            ? `${t('Przełożenie:')} ${dutchLeverCalc.mechanicalAdvantageRatio}x | ${t('Tara ramienia:')} +${dutchLeverCalc.tareForceFromArmKg} kg | ${t('Siła łączna:')} ${dutchLeverCalc.totalAppliedForceKg} kg`
            : `${t('Powierzchnia:')} ${pressCalc.surfaceAreaCm2.toFixed(1)} cm² | ${t('Siła:')} ${pressCalc.appliedForceKg.toFixed(1)} kg`}
        </Text>
      </View>

      {/* 3-Stage Cascaded Pressing Schedule */}
      <TouchableOpacity
        style={[styles.rowBetween, { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E7E5E4' }]}
        onPress={() => {
          triggerHapticFeedback();
          setIsPressCascadeOpen(!isPressCascadeOpen);
        }}
      >
        <Text style={styles.cardMiniTitle}>📋 {t('Kaskadowy Program Prasowania')}</Text>
        <Text style={styles.accordionArrow}>{isPressCascadeOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isPressCascadeOpen && (
        <View style={{ marginTop: 6, gap: 8 }}>
          {pressingCascadeProg.stages.map((st) => (
            <View key={st.stageNumber} style={styles.timelineRow}>
              <Text style={styles.timelineTime}>{st.durationMinutes} m</Text>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineName}>{st.name} ({st.targetForceKg} kg / {st.recommendedPressurePsi} PSI)</Text>
                <Text style={styles.timelineDesc}>{st.actionInstruction}</Text>
              </View>
            </View>
          ))}
          <View style={styles.warningAlert}>
            <Text style={styles.warningAlertText}>⚠️ {pressingCascadeProg.rindEntrapmentWarning}</Text>
          </View>
        </View>
      )}
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
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 48,
  },
  typePillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  typePillTextActive: {
    color: '#FFFFFF',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  inlineLabel: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  numInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 90,
    textAlign: 'right',
    fontSize: 14,
    color: '#0F172A',
    minHeight: 40,
  },
  pressureResultBox: {
    backgroundColor: '#EEF2F6',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  pressureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  pressureSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardMiniTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  accordionArrow: {
    fontSize: 14,
    color: '#64748B',
    paddingHorizontal: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    width: 48,
  },
  timelineContent: {
    flex: 1,
  },
  timelineName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  timelineDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  warningAlert: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    marginTop: 6,
  },
  warningAlertText: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 16,
  },
});
