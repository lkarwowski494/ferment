import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  SyneresisResult,
  CheeseStyleSyneresis,
  CHEESE_SYNERESIS_CONFIGS,
} from '../../core/curd-syneresis';

interface CheeseSyneresisKineticsCardProps {
  curdSyneresisCalc: SyneresisResult | null;
  syneresisStyle: CheeseStyleSyneresis;
  setSyneresisStyle: (v: CheeseStyleSyneresis) => void;
  setSyneresisCutSizeMm: (v: number) => void;
  setSyneresisInitTempC: (v: number) => void;
  setSyneresisTargetTempC: (v: number) => void;
  syneresisCutSizeMm: number;
  syneresisTargetTempC: number;
  syneresisHeatingMinutes: number;
  setSyneresisHeatingMinutes: (v: number) => void;
  syneresisStirMinutes: number;
  setSyneresisStirMinutes: (v: number) => void;
  syneresisDrainPh: number;
  setSyneresisDrainPh: (v: number) => void;
}

export const CheeseSyneresisKineticsCard: React.FC<CheeseSyneresisKineticsCardProps> = ({
  curdSyneresisCalc,
  syneresisStyle,
  setSyneresisStyle,
  setSyneresisCutSizeMm,
  setSyneresisInitTempC,
  setSyneresisTargetTempC,
  syneresisCutSizeMm,
  syneresisTargetTempC,
  syneresisHeatingMinutes,
  setSyneresisHeatingMinutes,
  syneresisStirMinutes,
  setSyneresisStirMinutes,
  syneresisDrainPh,
  setSyneresisDrainPh,
}) => {
  if (!curdSyneresisCalc) return null;

  return (
    <View style={[styles.proCard, curdSyneresisCalc.caseHardeningVerdict === 'CRITICAL_CASE_HARDENING' && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🔪 {t('Kinetyka Synerezy Skrzepu & Dogrzewanie Ziarna')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Wielkość ziarna (3-35mm), tempo podgrzewania (°C/min), ochrona przed zasklepieniem kazeiny i pH ocieku')}
      </Text>

      {/* Cheese Style Horizontal Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'PARMESAN_GRANA' as const, label: t('Parmezan (3mm)') },
          { id: 'ALPINE_GRUYERE' as const, label: t('Alpejski (4mm)') },
          { id: 'GOUDA_EDAM' as const, label: t('Gouda (8mm)') },
          { id: 'CHEDDAR' as const, label: t('Cheddar (10mm)') },
          { id: 'CAMEMBERT_BRIE' as const, label: t('Camembert (18mm)') },
          { id: 'FETA_FRESH' as const, label: t('Feta / Świeży (28mm)') },
        ].map((st) => (
          <TouchableOpacity
            key={st.id}
            style={[styles.presetPill, syneresisStyle === st.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setSyneresisStyle(st.id);
              const cfg = CHEESE_SYNERESIS_CONFIGS[st.id];
              setSyneresisCutSizeMm(cfg.recommendedCutSizeMm);
              setSyneresisInitTempC(cfg.initialTempC);
              setSyneresisTargetTempC(cfg.maxCookingTempC);
            }}
          >
            <Text style={[styles.presetPillText, syneresisStyle === st.id && styles.presetPillTextActive]}>
              {st.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Rozmiar cięcia ziarna (mm):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(syneresisCutSizeMm)}
          onChangeText={(v) => setSyneresisCutSizeMm(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Temperatura docelowa (°C):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(syneresisTargetTempC)}
          onChangeText={(v) => setSyneresisTargetTempC(parseFloat(v) || 30)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Czas dogrzewania (min):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(syneresisHeatingMinutes)}
          onChangeText={(v) => setSyneresisHeatingMinutes(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Czas mieszania po dogrzaniu (min):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(syneresisStirMinutes)}
          onChangeText={(v) => setSyneresisStirMinutes(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('pH serwatki przy ocieku:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(syneresisDrainPh)}
          onChangeText={(v) => setSyneresisDrainPh(parseFloat(v) || 6.4)}
        />
      </View>

      <View style={styles.brineResultBox}>
        <Text style={[
          styles.safetyStatus,
          curdSyneresisCalc.caseHardeningVerdict === 'CRITICAL_CASE_HARDENING'
            ? styles.safetyDanger
            : curdSyneresisCalc.caseHardeningVerdict === 'BORDERLINE_RATE'
            ? { color: '#B45309' }
            : { color: '#15803D' }
        ]}>
          • {t('Tempo dogrzewania:')} {curdSyneresisCalc.actualRampRateCPerMin}°C/min ({t('maks. zalecane:')} {curdSyneresisCalc.maxSafeRampRateCPerMin}°C/min)
        </Text>
        <Text style={styles.brineText}>
          • {curdSyneresisCalc.caseHardeningAlertPl}
        </Text>

        <Text style={[styles.brineText, { marginTop: 6 }]}>
          • {t('Wskaźnik synerezy:')} <Text style={styles.boldText}>{curdSyneresisCalc.syneresisIntensityIndex}/100</Text> | {t('Szacowana wilgotność:')} <Text style={styles.boldText}>{curdSyneresisCalc.expectedMoisturePct}%</Text> ({t('wzorzec:')} {curdSyneresisCalc.expectedMoistureMinPct}%–{curdSyneresisCalc.expectedMoistureMaxPct}%)
        </Text>

        <Text style={[
          styles.safetyStatus,
          curdSyneresisCalc.calciumRetentionVerdict !== 'OPTIMAL_MINERAL_BALANCE'
            ? { color: '#B45309' }
            : { color: '#15803D' },
          { marginTop: 4 }
        ]}>
          • {t('Wapń koloidalny:')} {curdSyneresisCalc.calciumImpactMessagePl}
        </Text>

        {curdSyneresisCalc.recommendations.map((rec, i) => (
          <Text key={i} style={[styles.recipeDetailText, { marginTop: 4 }]}>
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
  safetyStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
