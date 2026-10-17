import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { CurdCookingRampResult } from '../../core/cheese-engine';
import { CurdWashResult, CurdMillingSaltingResult } from '../../core/curd-washing-and-salting';

interface CheeseCurdCookingAndSaltingCardProps {
  cookingRampCalc: CurdCookingRampResult;
  cookStartTemp: number;
  cookEndTemp: number;
  cookDurationMin: number;
  washWheyDrainedLiters: number;
  setWashWheyDrainedLiters: (v: number) => void;
  washHotWaterTempC: number;
  setWashHotWaterTempC: (v: number) => void;
  washTargetTempC: number;
  setWashTargetTempC: (v: number) => void;
  curdWashCalc: CurdWashResult | null;
  cheddarCurdGrams: number;
  setCheddarCurdGrams: (v: number) => void;
  cheddarTargetSalinityPct: number;
  setCheddarTargetSalinityPct: (v: number) => void;
  cheddarSaltingCalc: CurdMillingSaltingResult | null;
}

export const CheeseCurdCookingAndSaltingCard: React.FC<CheeseCurdCookingAndSaltingCardProps> = ({
  cookingRampCalc,
  cookStartTemp,
  cookEndTemp,
  cookDurationMin,
  washWheyDrainedLiters,
  setWashWheyDrainedLiters,
  washHotWaterTempC,
  setWashHotWaterTempC,
  washTargetTempC,
  setWashTargetTempC,
  curdWashCalc,
  cheddarCurdGrams,
  setCheddarCurdGrams,
  cheddarTargetSalinityPct,
  setCheddarTargetSalinityPct,
  cheddarSaltingCalc,
}) => {
  return (
    <>
      {/* 4. Case Hardening Guard */}
      <View style={[styles.proCard, cookingRampCalc.isTooFast && styles.cardDanger]}>
        <Text style={styles.proCardTitle}>🔥 {t('Dogrzewanie Gęstwy & Case Hardening Guard')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Z')} {cookStartTemp}°C {t('do')} {cookEndTemp}°C {t('w')} {cookDurationMin} min
        </Text>
        {cookingRampCalc.warning ? (
          <View style={styles.warningAlert}>
            <Text style={styles.warningAlertText}>⚠️ {cookingRampCalc.warning}</Text>
          </View>
        ) : (
          <Text style={styles.safeStatusText}>
            ✅ {t('Tempo dogrzewania bezpieczne (min. 2 min / 1°C).')}
          </Text>
        )}
      </View>

      {/* 7. Curd Washing / Delactosing */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>💧 {t('Przemywanie Ziarna & Odlaktozowanie (Gouda/Edam)')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Obniżanie kwasowości i regulacja elastyczności miąższu dolewaniem gorącej wody')}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Odlana serwatka (L):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(washWheyDrainedLiters)}
            onChangeText={(v) => setWashWheyDrainedLiters(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Temp. dolewanej wody (°C):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(washHotWaterTempC)}
            onChangeText={(v) => setWashHotWaterTempC(parseFloat(v) || 50)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Docelowa temp. gęstwy (°C):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(washTargetTempC)}
            onChangeText={(v) => setWashTargetTempC(parseFloat(v) || 36)}
          />
        </View>
        {curdWashCalc && (
          <View style={styles.brineResultBox}>
            <Text style={styles.brineText}>
              • {t('Wymagana objętość gorącej wody:')}{' '}
              <Text style={styles.boldText}>{curdWashCalc.waterVolumeLiters} L</Text>
            </Text>
            <Text style={styles.brineText}>
              • {t('Stopień odlaktozowania wsadu:')}{' '}
              <Text style={styles.boldText}>{curdWashCalc.delactosingRatioPct}%</Text>
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {curdWashCalc.techniqueRecommendation}
            </Text>
            {curdWashCalc.warnings.map((w, idx) => (
              <View key={idx} style={[styles.warningAlert, { marginTop: 6 }]}>
                <Text style={styles.warningAlertText}>⚠️ {w}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 8. Cheddar Curd Milling & Dry Salting */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🧂 {t('Solenie Ziarna w Masie (Milling Cheddara)')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Precyzyjne solenie na sucho z uwzględnieniem odcieku pod prasą')}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Masa pociętego ziarna (g):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(cheddarCurdGrams)}
            onChangeText={(v) => setCheddarCurdGrams(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Docelowa słoność sera (%):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(cheddarTargetSalinityPct)}
            onChangeText={(v) => setCheddarTargetSalinityPct(parseFloat(v) || 0)}
          />
        </View>
        {cheddarSaltingCalc && (
          <View style={styles.brineResultBox}>
            <Text style={styles.brineText}>
              • {t('Całkowita sól do zadania na sucho:')}{' '}
              <Text style={styles.boldText}>{cheddarSaltingCalc.totalSaltToApplyGrams} g</Text> ({t('w tym sól związana:')} {cheddarSaltingCalc.netSaltRetainedGrams}g)
            </Text>
            <View style={{ marginTop: 6 }}>
              {cheddarSaltingCalc.additions.map((step) => (
                <Text key={step.step} style={[styles.brineText, { fontSize: 13, marginBottom: 3 }]}>
                  {step.step}. <Text style={styles.boldText}>{step.grams} g</Text> — {step.instruction}
                </Text>
              ))}
            </View>
          </View>
        )}
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
  brineResultBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  brineText: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  recipeDetailText: {
    fontSize: 12,
    color: '#475569',
  },
  safeStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginTop: 6,
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
