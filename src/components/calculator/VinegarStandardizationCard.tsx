import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import {
  VinegarDilutionResult,
  VinegarStoichiometryResult,
  VesselAerationResult,
} from '../../core/vinegar-standardization';

interface VinegarStandardizationCardProps {
  vinRawAcidity: number;
  setVinRawAcidity: (v: number) => void;
  vinRawVolumeL: number;
  setVinRawVolumeL: (v: number) => void;
  vinTargetAcidity: number;
  setVinTargetAcidity: (v: number) => void;
  vinVesselDiameterCm: number;
  setVinVesselDiameterCm: (v: number) => void;
  vinInitialAbv: number;
  setVinInitialAbv: (v: number) => void;
  vinegarStdCalc: VinegarDilutionResult | null;
  vinegarStoichCalc: VinegarStoichiometryResult | null;
  vinegarAerationCalc: VesselAerationResult | null;
}

export const VinegarStandardizationCard: React.FC<VinegarStandardizationCardProps> = ({
  vinRawAcidity,
  setVinRawAcidity,
  vinRawVolumeL,
  setVinRawVolumeL,
  vinTargetAcidity,
  setVinTargetAcidity,
  vinVesselDiameterCm,
  setVinVesselDiameterCm,
  vinInitialAbv,
  setVinInitialAbv,
  vinegarStdCalc,
  vinegarStoichCalc,
  vinegarAerationCalc,
}) => {
  if (!vinegarStdCalc || !vinegarStoichCalc || !vinegarAerationCalc) return null;

  return (
    <View style={[styles.proCard, (vinegarStoichCalc.isAlcoholTooHighWarning || vinegarAerationCalc.aerationRating === 'STAGNANT_SUFFOCATION') && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🧪 {t('Standaryzacja Octu & Aeracja Lustra (Grain Strength)')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Moc w stopniach Grain (10 grain = 1%), rozcieńczanie kwadratem Pearsona i aeracja naczynia')}
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Kwasowość surowa (% / Grain):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinRawAcidity)}
          onChangeText={(v) => setVinRawAcidity(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Objętość surowego octu (L):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinRawVolumeL)}
          onChangeText={(v) => setVinRawVolumeL(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Docelowa kwasowość (% / Grain):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinTargetAcidity)}
          onChangeText={(v) => setVinTargetAcidity(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Średnica lustra cieczy (cm):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinVesselDiameterCm)}
          onChangeText={(v) => setVinVesselDiameterCm(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Początkowy alkohol cydru/wina (% ABV):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(vinInitialAbv)}
          onChangeText={(v) => setVinInitialAbv(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.safetyBox}>
        <Text style={[
          styles.safetyStatus,
          vinegarStdCalc.legalFoodGradeClassification === 'SUB_STANDARD_LOW' ? styles.safetyDanger : { color: '#15803D' }
        ]}>
          • {t('Moc:')} {vinegarStdCalc.rawGrainStrength} Grain ({vinRawAcidity}%) &rarr; {vinegarStdCalc.targetGrainStrength} Grain ({vinTargetAcidity}%) — {vinegarStdCalc.classificationLabelPl}
        </Text>

        {vinegarStdCalc.isDilutionNeeded ? (
          <Text style={styles.proCardDesc}>
            • {t('Dolewka wody niechlorowanej:')} <Text style={styles.boldText}>{vinegarStdCalc.dilutionLiquidVolumeLiters} L</Text> ({t('objętość końcowa:')} {vinegarStdCalc.totalFinishedVolumeLiters} L)
          </Text>
        ) : (
          <Text style={styles.proCardDesc}>
            • {t('Rozcieńczenie zbędne (kwasowość &le; docelowej)')}
          </Text>
        )}

        <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
          💡 {vinegarStdCalc.motherPreservationAdvice}
        </Text>

        {/* Stoichiometry */}
        <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
          • {t('Potencjał kwasowy z')} {vinInitialAbv}% ABV: <Text style={styles.boldText}>{vinegarStoichCalc.expectedActualAcidityPct}%</Text> ({vinegarStoichCalc.expectedGrainStrength} Grain, {t('max teor.')} {vinegarStoichCalc.theoreticalMaxAcidityPct}%)
        </Text>

        {vinegarStoichCalc.potentialSpoilageRisk && (
          <Text style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
            ⚠️ {vinegarStoichCalc.potentialSpoilageRisk}
          </Text>
        )}

        {/* Aeration */}
        <Text style={[
          styles.safetyStatus,
          vinegarAerationCalc.aerationRating === 'STAGNANT_SUFFOCATION' ? styles.safetyDanger : { color: '#15803D' },
          { marginTop: 6 }
        ]}>
          • {t('Wskaźnik natlenienia A/V:')} {vinegarAerationCalc.surfaceToVolumeRatioCm2PerLiter} cm²/L — {vinegarAerationCalc.ratingLabelPl} ({vinegarAerationCalc.estimatedFermentationWeeks.min}–{vinegarAerationCalc.estimatedFermentationWeeks.max} {t('tyg.')})
        </Text>
        <Text style={styles.recipeDetailText}>
          🧫 {vinegarAerationCalc.motherPellicleHealthAdvice}
        </Text>

        {vinegarAerationCalc.actionableRecommendations.map((rec, idx) => (
          <Text key={idx} style={[styles.recipeDetailText, { marginTop: 2 }]}>
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
