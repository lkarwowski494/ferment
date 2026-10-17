import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { Q10KineticsResult } from '../../core/fermentation-q10';
import { RefractometerAnalysisResult } from '../../core/refractometer-alcohol';

interface KombuchaQ10RefractometerCardProps {
  ambientTempC: number;
  setAmbientTempC: (v: number) => void;
  q10KombuchaCalc: Q10KineticsResult | null;
  originalBrixInput: number;
  setOriginalBrixInput: (v: number) => void;
  currentBrixInput: number;
  setCurrentBrixInput: (v: number) => void;
  refractometerAlcoholCalc: RefractometerAnalysisResult | null;
}

export const KombuchaQ10RefractometerCard: React.FC<KombuchaQ10RefractometerCardProps> = ({
  ambientTempC,
  setAmbientTempC,
  q10KombuchaCalc,
  originalBrixInput,
  setOriginalBrixInput,
  currentBrixInput,
  setCurrentBrixInput,
  refractometerAlcoholCalc,
}) => {
  return (
    <>
      {/* Q10 Kombucha Kinetics */}
      {q10KombuchaCalc && (
        <View style={[styles.proCard, (q10KombuchaCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10KombuchaCalc.zone === 'DORMANT_SLUGGISH') && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>🌡️ {t('Kompensacja Temperatury Q10 dla Kombuchy (Czas 1F)')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura otoczenia (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(ambientTempC)}
              onChangeText={(v) => setAmbientTempC(parseFloat(v) || 20)}
            />
          </View>
          <View style={styles.safetyBox}>
            <Text style={styles.proCardDesc}>
              • {t('Mnożnik kinetyki:')} <Text style={styles.boldText}>{q10KombuchaCalc.velocityMultiplier}x</Text> {t('(względem 20°C)')}
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Skorygowany czas 1F:')} <Text style={styles.boldText}>{q10KombuchaCalc.adjustedDays} {t('dni')}</Text> ({q10KombuchaCalc.adjustedHours} {t('godz.')})
            </Text>
            <Text style={[styles.safetyStatus, (q10KombuchaCalc.zone === 'HEAT_STRESS_SPOILAGE' || q10KombuchaCalc.zone === 'DORMANT_SLUGGISH') && styles.safetyDanger, { marginTop: 4 }]}>
              {t('Strefa termiczna:')} {q10KombuchaCalc.zoneLabel}
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {q10KombuchaCalc.flavorProfileImpact}
            </Text>
          </View>
        </View>
      )}

      {/* Optical Refractometer & Alcohol Engine */}
      {refractometerAlcoholCalc && (
        <View style={[styles.proCard, !refractometerAlcoholCalc.isVinegarSafe && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>🔍 {t('Korektor Refraktometru Optycznego (°Bx → SG → ABV)')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Początkowy odczyt (°Bx):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(originalBrixInput)}
              onChangeText={(v) => setOriginalBrixInput(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Aktualny odczyt (°Bx):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(currentBrixInput)}
              onChangeText={(v) => setCurrentBrixInput(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.safetyBox}>
            <Text style={styles.proCardDesc}>
              • {t('Skorygowana gęstość rzeczywista:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.correctedFinalSg} SG</Text> ({refractometerAlcoholCalc.realExtractPlato}°P)
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Zawartość alkoholu:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.abvPct}% ABV</Text>
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Klasyfikacja:')} <Text style={styles.boldText}>{refractometerAlcoholCalc.classification}</Text>
            </Text>
            <Text style={[
              styles.safetyStatus,
              !refractometerAlcoholCalc.isVinegarSafe ? styles.safetyDanger : !refractometerAlcoholCalc.isNonAlcoholicKombucha ? { color: '#B45309' } : { color: '#15803D' },
              { marginTop: 4 }
            ]}>
              {refractometerAlcoholCalc.recommendation}
            </Text>
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
