import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  GingerBugFeedingResult,
  GingerBeerBatchResult,
} from '../../core/ginger-bug';

interface GingerBugCardProps {
  starterDays: number;
  setStarterDays: (v: number) => void;
  daysSinceFeed: number;
  setDaysSinceFeed: (v: number) => void;
  hasBubbles: boolean;
  setHasBubbles: (v: boolean) => void;
  batchVolumeL: number;
  setBatchVolumeL: (v: number) => void;
  hoursInBottle: number;
  setHoursInBottle: (v: number) => void;
  ambientTempC: number;
  starterCalc: GingerBugFeedingResult | null;
  batchCalc: GingerBeerBatchResult | null;
}

export const GingerBugCard: React.FC<GingerBugCardProps> = ({
  starterDays,
  setStarterDays,
  daysSinceFeed,
  setDaysSinceFeed,
  hasBubbles,
  setHasBubbles,
  batchVolumeL,
  setBatchVolumeL,
  hoursInBottle,
  setHoursInBottle,
  ambientTempC,
  starterCalc,
  batchCalc,
}) => {
  if (!starterCalc || !batchCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🫚 {t('Dziki Starter Imbirowy (Ginger Bug & Piwo Imbirowe)')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Dzikie drożdże i bakterie kwasu mlekowego z korzenia imbiru, proporcje nastawu oraz kontrola ciśnienia CO2 (Bottle Burst Guard)')}
      </Text>

      {/* Starter status section */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>🌱 {t('Kondycja startera (Słoik-Matka):')}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Wiek startera (dni):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(starterDays)}
          onChangeText={(v) => setStarterDays(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Dni od ostatniego karmienia:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(daysSinceFeed)}
          onChangeText={(v) => setDaysSinceFeed(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Widoczne bąbelki i musowanie:')}</Text>
        <TouchableOpacity
          style={[styles.presetPill, hasBubbles ? styles.presetPillActive : null]}
          onPress={() => {
            triggerHapticFeedback();
            setHasBubbles(!hasBubbles);
          }}
        >
          <Text style={[styles.presetPillText, hasBubbles ? styles.presetPillTextActive : null]}>
            {hasBubbles ? t('TAK (Aktywny)') : t('NIE (Brak piany)')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.safetyBox, { marginTop: 6 }]}>
        <Text style={[
          styles.safetyStatus,
          starterCalc.isReadyForBrewing ? { color: '#15803D' } : { color: '#B45309' }
        ]}>
          • {starterCalc.statusLabelPl} ({t('Witalność:')} {starterCalc.starterHealthScore}/100)
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Następne karmienie:')} <Text style={styles.boldText}>{starterCalc.nextFeedGingerGrams} g {t('startego imbiru ze skórką')}</Text> + <Text style={styles.boldText}>{starterCalc.nextFeedSugarGrams} g {t('cukru')}</Text> + <Text style={styles.boldText}>{starterCalc.nextFeedWaterMl} ml {t('wody')}</Text>
        </Text>
        {starterCalc.recommendationsPl.map((rec, idx) => (
          <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
            💡 {rec}
          </Text>
        ))}
      </View>

      {/* Batch brewing section */}
      <Text style={[styles.inputLabelMini, { marginTop: 10 }]}>🍾 {t('Nastaw Partii Piwa Imbirowego:')}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Objętość partii (L):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(batchVolumeL)}
          onChangeText={(v) => setBatchVolumeL(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Godziny refermentacji w butelce:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(hoursInBottle)}
          onChangeText={(v) => setHoursInBottle(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.brineResultBox}>
        <Text style={styles.proCardDesc}>
          • {t('Aktywny odcedzony starter:')} <Text style={styles.boldText}>{batchCalc.requiredStarterVolumeMl} ml</Text> (10% {t('nastawu')})
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Cukier do nastawu:')} <Text style={styles.boldText}>{batchCalc.totalSugarGrams} g</Text> | {t('Świeży imbir na wywar:')} <Text style={styles.boldText}>{batchCalc.freshGingerDecoctionGrams} g</Text>
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Sok ze świeżej cytryny:')} <Text style={styles.boldText}>{batchCalc.lemonJuiceMl} ml</Text> ({t('dla pH 3.8')})
        </Text>

        <View style={styles.co2Box}>
          <Text style={[
            styles.safetyStatus,
            batchCalc.burstRiskSeverity === 'CRITICAL'
              ? styles.safetyDanger
              : batchCalc.burstRiskSeverity === 'WARNING'
              ? { color: '#B45309' }
              : { color: '#15803D' }
          ]}>
            • {t('Nasycenie CO2:')} {batchCalc.estimatedCo2Volumes} vol ({batchCalc.carbonationStage})
          </Text>
          <Text style={styles.proCardDesc}>
            • {t('Do optymalnego nagazowania:')} <Text style={styles.boldText}>~{batchCalc.estimatedHoursToOptimalCo2} {t('godzin')}</Text> ({t('w')} {ambientTempC}°C)
          </Text>
        </View>

        {batchCalc.alertsPl.map((al, idx) => (
          <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
            ⚠️ {al}
          </Text>
        ))}

        {batchCalc.stepsPl.map((step, idx) => (
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
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F5F5F4',
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
  safetyBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  brineResultBox: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  co2Box: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  safetyStatus: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  safetyDanger: {
    color: '#DC2626',
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
});
