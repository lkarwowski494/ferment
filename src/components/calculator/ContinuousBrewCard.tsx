import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  TeaBaseType,
  HarvestPlan,
} from '../../core/continuous-brew';

interface ContinuousBrewCardProps {
  cbVesselLiters: number;
  setCbVesselLiters: (v: number) => void;
  cbDrawLiters: number;
  setCbDrawLiters: (v: number) => void;
  cbTempCelsius: number;
  setCbTempCelsius: (v: number) => void;
  cbCyclesSincePurge: number;
  setCbCyclesSincePurge: (v: number) => void;
  cbPreDrawPh: number;
  setCbPreDrawPh: (v: number) => void;
  cbTeaBase: TeaBaseType;
  setCbTeaBase: (v: TeaBaseType) => void;
  continuousBrewPlan: HarvestPlan | null;
}

export const ContinuousBrewCard: React.FC<ContinuousBrewCardProps> = ({
  cbVesselLiters,
  setCbVesselLiters,
  cbDrawLiters,
  setCbDrawLiters,
  cbTempCelsius,
  setCbTempCelsius,
  cbCyclesSincePurge,
  setCbCyclesSincePurge,
  cbPreDrawPh,
  setCbPreDrawPh,
  cbTeaBase,
  setCbTeaBase,
  continuousBrewPlan,
}) => {
  if (!continuousBrewPlan) return null;

  return (
    <View style={[styles.proCard, !continuousBrewPlan.isDrawSafe && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🚰 {t('Kombucha Ciągła (Continuous Brew Siphon & Serwis)')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Model tygodniowego rozlewu z kranika (20-30%), uzupełnianie słodkiej herbaty i osad')}
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Pojemność słoja (L):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cbVesselLiters)}
          onChangeText={(v) => setCbVesselLiters(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Pobór do rozlewu (L):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cbDrawLiters)}
          onChangeText={(v) => setCbDrawLiters(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cbTempCelsius)}
          onChangeText={(v) => setCbTempCelsius(parseFloat(v) || 20)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Cykle od czyszczenia dna:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cbCyclesSincePurge)}
          onChangeText={(v) => setCbCyclesSincePurge(parseInt(v, 10) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Aktualne pH przed zlaniem:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(cbPreDrawPh)}
          onChangeText={(v) => setCbPreDrawPh(parseFloat(v) || 3.0)}
        />
      </View>

      {/* Tea Base Type */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Baza herbaty:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'BLACK' as const, label: t('Czarna klasyczna') },
          { id: 'GREEN' as const, label: t('Zielona Sencha') },
          { id: 'OOLONG' as const, label: t('Oolong / Turkusowa') },
          { id: 'WHITE' as const, label: t('Biała Pai Mu Tan') },
          { id: 'HERBAL_BLEND' as const, label: t('Mieszanka ziołowa') },
        ].map((tea) => (
          <TouchableOpacity
            key={tea.id}
            style={[styles.presetPill, cbTeaBase === tea.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCbTeaBase(tea.id);
            }}
          >
            <Text style={[styles.presetPillText, cbTeaBase === tea.id && styles.presetPillTextActive]}>
              {tea.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Calculations / Output */}
      <View style={styles.safetyBox}>
        <Text style={[
          styles.safetyStatus,
          !continuousBrewPlan.isDrawSafe ? styles.safetyDanger : { color: '#15803D' }
        ]}>
          • {t('Wskaźnik poboru:')} {continuousBrewPlan.drawRatioPct}% ({continuousBrewPlan.drawVolumeLiters}L {t('z')} {cbVesselLiters}L) — {continuousBrewPlan.isDrawSafe ? t('BEZPIECZNY') : t('NIEBEZPIECZNY')}
        </Text>
        {continuousBrewPlan.safetyWarning && (
          <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
            ⚠️ {continuousBrewPlan.safetyWarning}
          </Text>
        )}

        <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
          • {t('Do uzupełnienia:')} <Text style={styles.boldText}>{continuousBrewPlan.sweetTeaVolumeLiters} L</Text> {t('słodkiej herbaty')} ({t('zostaje')} {continuousBrewPlan.reserveVolumeLiters}L {t('bazy starterowej')})
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Składniki słodkiej herbaty:')} <Text style={styles.boldText}>{continuousBrewPlan.sugarTotalGrams} g</Text> {t('cukru')} (70 g/L) + <Text style={styles.boldText}>{continuousBrewPlan.teaLeavesTotalGrams} g</Text> {t('herbaty')} (5 g/L)
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Czas parzenia:')} <Text style={styles.boldText}>{continuousBrewPlan.recommendedSteepTimeMinutes} min</Text> | {t('Chłodzenie do:')} &le; {continuousBrewPlan.recommendedCoolingTempCelsius}°C
        </Text>
        {continuousBrewPlan.estimatedPostRefillPh !== undefined && (
          <Text style={styles.proCardDesc}>
            • {t('Szacowane pH po dolaniu:')} <Text style={styles.boldText}>pH {continuousBrewPlan.estimatedPostRefillPh}</Text> ({t('ochrona przed pleśnią')} &le; 4.0)
          </Text>
        )}
        <Text style={styles.proCardDesc}>
          • {t('Kolejny rozlew za:')} <Text style={styles.boldText}>{continuousBrewPlan.estimatedCycleDays} {t('dni')}</Text> ({t('w temp.')} {cbTempCelsius}°C)
        </Text>

        {/* Trub Alert */}
        {continuousBrewPlan.trubPurgeAlert && continuousBrewPlan.trubPurgeAlert.urgency !== 'NONE' && (
          <View style={{ marginTop: 8, padding: 8, borderRadius: 8, backgroundColor: continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '#FEF2F2' : '#FFFBEB' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '#991B1B' : '#92400E' }}>
              {continuousBrewPlan.trubPurgeAlert.urgency === 'OVERDUE' ? '🚨' : '⏳'} {continuousBrewPlan.trubPurgeAlert.reason}
            </Text>
            {continuousBrewPlan.trubPurgeAlert.actionSteps.map((step, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                {idx + 1}. {step}
              </Text>
            ))}
          </View>
        )}

        {continuousBrewPlan.recommendations.map((rec, idx) => (
          <Text key={idx} style={[styles.recipeDetailText, { marginTop: 4 }]}>
            💡 {rec}
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
