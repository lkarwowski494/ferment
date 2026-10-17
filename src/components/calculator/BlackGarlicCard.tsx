import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { BlackGarlicResult } from '../../core/black-garlic';

interface BlackGarlicCardProps {
  rawGrams: number;
  setRawGrams: (v: number) => void;
  currentDay: number;
  setCurrentDay: (v: number) => void;
  chamberTempC: number;
  setChamberTempC: (v: number) => void;
  chamberRhPct: number;
  setChamberRhPct: (v: number) => void;
  blackGarlicCalc: BlackGarlicResult | null;
}

export const BlackGarlicCard: React.FC<BlackGarlicCardProps> = ({
  rawGrams,
  setRawGrams,
  currentDay,
  setCurrentDay,
  chamberTempC,
  setChamberTempC,
  chamberRhPct,
  setChamberRhPct,
  blackGarlicCalc,
}) => {
  if (!blackGarlicCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🧄 {t('Czarny Czosnek (Black Garlic & Wolna Reakcja Maillarda)')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Termiczna transformacja allicyny w przeciwutleniającą S-allilocysteinę (SAC) i karmelizację melanoidynową bez pirolizy')}
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa surowego czosnku (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(rawGrams)}
          onChangeText={(v) => setRawGrams(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Aktualny dzień cyklu (1-50):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(currentDay)}
          onChangeText={(v) => setCurrentDay(parseFloat(v) || 1)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Temperatura komory (°C):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(chamberTempC)}
          onChangeText={(v) => setChamberTempC(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Wilgotność względna (% RH):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(chamberRhPct)}
          onChangeText={(v) => setChamberRhPct(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.brineResultBox}>
        <Text style={[
          styles.safetyStatus,
          blackGarlicCalc.alerts.some((a) => a.severity === 'CRITICAL')
            ? styles.safetyDanger
            : blackGarlicCalc.alerts.some((a) => a.severity === 'WARNING')
            ? { color: '#B45309' }
            : { color: '#15803D' }
        ]}>
          • {blackGarlicCalc.currentPhase.namePl} ({blackGarlicCalc.progressPct}%)
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Szacowana waga:')} <Text style={styles.boldText}>{blackGarlicCalc.estimatedCurrentWeightGrams} g</Text> ({t('ubytek wody:')} {blackGarlicCalc.estimatedWeightLossPct}%) | {t('Pozostało:')} <Text style={styles.boldText}>{blackGarlicCalc.remainingDays} {t('dni')}</Text>
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Przyrost antyoksydantu SAC:')} <Text style={styles.boldText}>{blackGarlicCalc.sacMultiplier}x</Text> | {t('Cukry fruktozowe:')} <Text style={styles.boldText}>~{blackGarlicCalc.expectedSugarBrix}°Bx</Text>
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Tekstura ząbków:')} <Text style={styles.boldText}>{blackGarlicCalc.textureEstimatePl}</Text>
        </Text>

        <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
          🍯 {t('Profil bukietu:')} {blackGarlicCalc.flavorProfilePl}
        </Text>

        {blackGarlicCalc.alerts.map((al, idx) => (
          <Text key={idx} style={{ fontSize: 11, color: al.severity === 'CRITICAL' ? '#B91C1C' : '#B45309', marginTop: 4 }}>
            ⚠️ {al.messagePl}
          </Text>
        ))}

        {blackGarlicCalc.recommendedActionsPl.map((act, idx) => (
          <Text key={idx} style={[styles.recipeDetailText, { marginTop: 3 }]}>
            💡 {act}
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
