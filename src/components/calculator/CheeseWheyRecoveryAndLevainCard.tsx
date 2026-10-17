import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { RicottaRecoveryResult, WheyDrinkRecipe } from '../../core/whey-utilization';
import { WheyLevainPlan, WheyLevainType } from '../../core/whey-levain-engine';

interface CheeseWheyRecoveryAndLevainCardProps {
  sweetWheyLiters: number;
  wheyMilkBoostLiters: number;
  setWheyMilkBoostLiters: (v: number) => void;
  ricottaCalc: RicottaRecoveryResult;
  wheyDrinkCalc: WheyDrinkRecipe;
  wheyLevainCalc: WheyLevainPlan | null;
  wheyLevainType: WheyLevainType;
  setWheyLevainType: (v: WheyLevainType) => void;
  setWheyIncubationTempC: (v: number) => void;
  wheyVolumeMl: number;
  setWheyVolumeMl: (v: number) => void;
  wheyIncubationTempC: number;
  wheyHoursIncubated: number;
  setWheyHoursIncubated: (v: number) => void;
  wheyCurrentPh: number;
  setWheyCurrentPh: (v: number) => void;
  wheyGeneration: number;
  setWheyGeneration: (v: number) => void;
  milkLiters: number;
}

export const CheeseWheyRecoveryAndLevainCard: React.FC<CheeseWheyRecoveryAndLevainCardProps> = ({
  sweetWheyLiters,
  wheyMilkBoostLiters,
  setWheyMilkBoostLiters,
  ricottaCalc,
  wheyDrinkCalc,
  wheyLevainCalc,
  wheyLevainType,
  setWheyLevainType,
  setWheyIncubationTempC,
  wheyVolumeMl,
  setWheyVolumeMl,
  wheyIncubationTempC,
  wheyHoursIncubated,
  setWheyHoursIncubated,
  wheyCurrentPh,
  setWheyCurrentPh,
  wheyGeneration,
  setWheyGeneration,
  milkLiters,
}) => {
  return (
    <>
      {/* 6. Whey Zero-Waste & Ricotta Recovery */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>♻️ {t('Odzysk Serwatki & Zero-Waste (Ricotta / Izotonik)')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Dostępna serwatka słodka:')} <Text style={styles.boldText}>{sweetWheyLiters.toFixed(1)} L</Text>
        </Text>
        <Text style={styles.inputLabelMini}>{t('Dodatek pełnego mleka (wzmocnienie uzysku):')}</Text>
        <View style={styles.typeSelectorRow}>
          {[
            { boost: 0, label: t('Brak (czysta serwatka)') },
            { boost: 1, label: '+1 L (+10%)' },
            { boost: 2, label: '+2 L (+20%)' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.boost}
              style={[styles.typePill, wheyMilkBoostLiters === opt.boost && styles.typePillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setWheyMilkBoostLiters(opt.boost);
              }}
            >
              <Text style={[styles.typePillText, wheyMilkBoostLiters === opt.boost && styles.typePillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.brineResultBox}>
          <Text style={styles.brineText}>
            • {t('Przewidywany uzysk słodkiej Ricotty:')}{' '}
            <Text style={styles.boldText}>{ricottaCalc.estimatedRicottaYieldGrams} g</Text>
          </Text>
          <Text style={styles.brineText}>
            • {t('Dawka kwasu cytrynowego:')}{' '}
            <Text style={styles.boldText}>{ricottaCalc.citricAcidGramsNeeded} g</Text>
          </Text>
          <Text style={styles.brineText}>
            • {t('Docelowa temperatura koagulacji serwatki:')}{' '}
            <Text style={styles.boldText}>{ricottaCalc.heatingTargetTempC}°C</Text>
          </Text>
          <Text style={styles.brineText}>
            • {t('Napój izotoniczny z serwatki (Rivella):')}{' '}
            <Text style={styles.boldText}>{(wheyDrinkCalc.wheyLiters + wheyDrinkCalc.waterDilutionMl / 1000).toFixed(1)} L</Text> ({t('z dodatkiem soku jabłkowego 1:1')})
          </Text>
        </View>
      </View>

      {/* 12. Mother Whey Levain & Starter Propagation (Sierroinnesto) */}
      {wheyLevainCalc && (
        <View style={[styles.proCard, wheyLevainCalc.passageHealth.status === 'DEGENERATION_RESET_REQUIRED' && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>🫙 {t('Zakwas Serwatkowy & Sierroinnesto (Mother Whey Levain)')}</Text>
          <Text style={styles.proCardDesc}>
            {t('Tradycyjna propagacja kultur matecznych z nieposolonej serwatki z poprzedniego warzenia')}
          </Text>

          {/* Culture Type Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'THERMOPHILIC_ALPINE' as const, label: t('Sierroinnesto Alpejskie (43°C)') },
              { id: 'MESOPHILIC_FARMHOUSE' as const, label: t('Mezofilne Zagrodowe (30°C)') },
              { id: 'HIGHLAND_SMOKED' as const, label: t('Tatrzańskie / Oscypek (37°C)') },
              { id: 'VEGETABLE_BRINE_BACKSLOP' as const, label: t('Zakwas z Kiszonki (20°C)') },
            ].map((tItem) => (
              <TouchableOpacity
                key={tItem.id}
                style={[styles.presetPill, wheyLevainType === tItem.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setWheyLevainType(tItem.id);
                  if (tItem.id === 'THERMOPHILIC_ALPINE') setWheyIncubationTempC(43);
                  else if (tItem.id === 'MESOPHILIC_FARMHOUSE') setWheyIncubationTempC(30);
                  else if (tItem.id === 'HIGHLAND_SMOKED') setWheyIncubationTempC(37);
                  else if (tItem.id === 'VEGETABLE_BRINE_BACKSLOP') setWheyIncubationTempC(20);
                }}
              >
                <Text style={[styles.presetPillText, wheyLevainType === tItem.id && styles.presetPillTextActive]}>
                  {tItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Objętość serwatki (ml):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(wheyVolumeMl)}
              onChangeText={(v) => setWheyVolumeMl(parseFloat(v) || 100)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura inkubacji (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(wheyIncubationTempC)}
              onChangeText={(v) => setWheyIncubationTempC(parseFloat(v) || 20)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Czas inkubacji (godz.):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(wheyHoursIncubated)}
              onChangeText={(v) => setWheyHoursIncubated(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Aktualne pH serwatki:')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(wheyCurrentPh)}
              onChangeText={(v) => setWheyCurrentPh(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Pasaż / Generacja starteru:')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(wheyGeneration)}
              onChangeText={(v) => setWheyGeneration(parseInt(v, 10) || 1)}
            />
          </View>

          <View style={styles.brineResultBox}>
            <Text style={[
              styles.safetyStatus,
              wheyLevainCalc.isReadyForInoculation ? { color: '#15803D' } : { color: '#B45309' }
            ]}>
              • {t('Stan starteru:')} {wheyLevainCalc.statusLabelPl}
            </Text>

            <Text style={styles.brineText}>
              • {t('Doza do mleka:')} <Text style={styles.boldText}>{wheyLevainCalc.requiredStarterMl} ml</Text> ({wheyLevainCalc.inoculumRatioPct}% v/v {t('na')} {milkLiters}L {t('mleka')})
            </Text>

            <Text style={styles.brineText}>
              • {t('Optymalny czas inkubacji:')} <Text style={styles.boldText}>{wheyLevainCalc.optimalIncubationHours} {t('godz.')}</Text> ({t('pozostało')} {wheyLevainCalc.remainingHours}h {t('do')} pH {wheyLevainCalc.targetPhMin}–{wheyLevainCalc.targetPhMax})
            </Text>

            {wheyLevainCalc.passageHealth.warning && (
              <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                ⚠️ {wheyLevainCalc.passageHealth.warning}
              </Text>
            )}

            {wheyLevainCalc.craftRecommendations.map((rec, i) => (
              <Text key={i} style={[styles.recipeDetailText, { marginTop: 4 }]}>
                💡 {rec}
              </Text>
            ))}
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
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
    marginTop: 6,
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
  safetyStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
