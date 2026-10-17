import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  PolishMeadGrade,
  MeadPreparationType,
  MEAD_GRADE_CONFIGS,
  MeadBatchResult,
} from '../../core/mead-kinetics';

interface MeadCardProps {
  meadGrade: PolishMeadGrade;
  setMeadGrade: (v: PolishMeadGrade) => void;
  targetVolumeL: number;
  setTargetVolumeL: (v: number) => void;
  prepType: MeadPreparationType;
  setPrepType: (v: MeadPreparationType) => void;
  meadCalc: MeadBatchResult | null;
}

export const MeadCard: React.FC<MeadCardProps> = ({
  meadGrade,
  setMeadGrade,
  targetVolumeL,
  setTargetVolumeL,
  prepType,
  setPrepType,
  meadCalc,
}) => {
  if (!meadCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🍯 {t('Tradycyjne Miodosytnictwo (Półtorak/Trójniak)')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Polska klasyfikacja miodów pitnych: bilans miodu i wody, szok osmotyczny, partionowanie i protokół TOSNA 3.0')}
      </Text>

      {/* Grade selector */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Klasa miodu pitnego:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {(['POLTORAK', 'DWOJNIAK', 'TROJNIAK', 'CZWORNIAK'] as PolishMeadGrade[]).map((mg) => (
          <TouchableOpacity
            key={mg}
            style={[styles.presetPill, meadGrade === mg && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setMeadGrade(mg);
            }}
          >
            <Text style={[styles.presetPillText, meadGrade === mg && styles.presetPillTextActive]}>
              {MEAD_GRADE_CONFIGS[mg].namePl.split(' (')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Docelowa objętość brzeczki (L):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(targetVolumeL)}
          onChangeText={(v) => setTargetVolumeL(parseFloat(v) || 1)}
        />
      </View>

      {/* Preparation method */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Metoda przygotowania brzeczki:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'NIESYCONY' as const, label: t('Niesycony (Na zimno, aromatyczny)') },
          { id: 'SYCONY' as const, label: t('Sycony (Gotowany z szumowaniem)') },
        ].map((pr) => (
          <TouchableOpacity
            key={pr.id}
            style={[styles.presetPill, prepType === pr.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setPrepType(pr.id);
            }}
          >
            <Text style={[styles.presetPillText, prepType === pr.id && styles.presetPillTextActive]}>
              {pr.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.brineResultBox}>
        <Text style={[styles.safetyStatus, { color: '#15803D' }]}>
          • {meadCalc.gradeNamePl} — {MEAD_GRADE_CONFIGS[meadGrade].honeyToWaterRatio}
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Miód pszczeli:')} <Text style={styles.boldText}>{meadCalc.honeyLiters} L</Text> ({meadCalc.honeyWeightKg} kg) | {t('Woda niechlorowana:')} <Text style={styles.boldText}>{meadCalc.waterLiters} L</Text>
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Ekstrakt brzeczki:')} <Text style={styles.boldText}>{meadCalc.initialBallingDegrees} °Blg</Text> (SG {meadCalc.initialSpecificGravity}) &rarr; {t('Docelowy alkohol:')} <Text style={styles.boldText}>~{meadCalc.expectedAbvPct}% ABV</Text>
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Okres leżakowania:')} <Text style={styles.boldText}>{meadCalc.expectedAgingYears.min}–{meadCalc.expectedAgingYears.max} {t('lat')}</Text>
        </Text>

        {meadCalc.isStepFeedingMandatory && (
          <View style={styles.stepFeedingWarning}>
            <Text style={styles.stepFeedingTitle}>
              ⚠️ {t('Wymagane partionowanie miodu (Step-Feeding):')}
            </Text>
            <Text style={styles.stepFeedingText}>
              {t('Podziel')} {meadCalc.honeyLiters} L {t('miodu na')} {meadCalc.stepFeedingDosesLiters.length} {t('dawki:')} {meadCalc.stepFeedingDosesLiters.map((d, i) => `${i + 1}. doza: ${d}L`).join(', ')}
            </Text>
          </View>
        )}

        <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
          🍯 {meadCalc.preparationAdvicePl}
        </Text>

        {/* TOSNA 3.0 Nutrient schedule */}
        <View style={styles.tosnaBox}>
          <Text style={[styles.proCardTitle, { fontSize: 12 }]}>
            🧪 {t('Protokół Odżywczy TOSNA 3.0 (Fermaid O):')} {meadCalc.tosnaNutrientGramsTotal} g {t('łącznie')}
          </Text>
          {meadCalc.tosnaAdditionsSchedulePl.map((sch, idx) => (
            <Text key={idx} style={styles.tosnaStep}>
              • {sch}
            </Text>
          ))}
        </View>

        {meadCalc.alertsPl.map((alert, idx) => (
          <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
            ⚠️ {alert}
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
  boldText: {
    fontWeight: '800',
    color: '#1C1917',
  },
  recipeDetailText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  stepFeedingWarning: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  stepFeedingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  stepFeedingText: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
  },
  tosnaBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tosnaStep: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
  },
});
