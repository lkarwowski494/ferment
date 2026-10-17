import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { BrineAcidificationResult } from '../../core/brine-acidification';
import { BrineBoostResult } from '../../core/brine-topup';
import {
  BrineDensitometryResult,
  BRINE_TARGET_PROFILES,
  BrineTargetProfileKey,
} from '../../core/brine-densitometry';

interface CheeseBrineAndRegenCardProps {
  brineWaterLiters: number;
  brineSalinityPct: number;
  brineWaterPh: number;
  setBrineWaterPh: (v: number) => void;
  brineAcidCalc: BrineAcidificationResult;
  currentBrineSalinity: number;
  setCurrentBrineSalinity: (v: number) => void;
  targetBrineSalinity: number;
  setTargetBrineSalinity: (v: number) => void;
  brineBoostCalc: BrineBoostResult;
  brineDensitometryCalc: BrineDensitometryResult | null;
  brineDensityUnit: 'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY';
  setBrineDensityUnit: (v: 'PERCENT_WT' | 'SALOMETER' | 'BAUME' | 'SPECIFIC_GRAVITY') => void;
  brineMeasuredValue: number;
  setBrineMeasuredValue: (v: number) => void;
  brineSampleTempC: number;
  setBrineSampleTempC: (v: number) => void;
  brineVolumeLitersInput: number;
  setBrineVolumeLitersInput: (v: number) => void;
  brineTargetProfile: BrineTargetProfileKey;
  setBrineTargetProfile: (v: BrineTargetProfileKey) => void;
}

export const CheeseBrineAndRegenCard: React.FC<CheeseBrineAndRegenCardProps> = ({
  brineWaterLiters,
  brineSalinityPct,
  brineWaterPh,
  setBrineWaterPh,
  brineAcidCalc,
  currentBrineSalinity,
  setCurrentBrineSalinity,
  targetBrineSalinity,
  setTargetBrineSalinity,
  brineBoostCalc,
  brineDensitometryCalc,
  brineDensityUnit,
  setBrineDensityUnit,
  brineMeasuredValue,
  setBrineMeasuredValue,
  brineSampleTempC,
  setBrineSampleTempC,
  brineVolumeLitersInput,
  setBrineVolumeLitersInput,
  brineTargetProfile,
  setBrineTargetProfile,
}) => {
  return (
    <>
      {/* 3. Saturated Brine Buffer & Acidification */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🧂 {t('Zbuforowana Solanka Serowarska')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Woda:')} {brineWaterLiters}L | {t('Stężenie:')} {brineSalinityPct}% NaCl
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('pH wody kranowej:')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(brineWaterPh)}
            onChangeText={(v) => setBrineWaterPh(parseFloat(v) || 7.0)}
          />
        </View>
        <View style={styles.brineResultBox}>
          <Text style={styles.brineText}>
            • {t('Ilość soli:')} <Text style={styles.boldText}>{brineAcidCalc.saltKg} kg</Text>
          </Text>
          <Text style={styles.brineText}>
            • {t('Wymagany CaCl2 (2 g/L):')} <Text style={styles.boldText}>{brineAcidCalc.cacl2GramsNeeded}g</Text> ({t('zapobiega mięknięciu skórki')})
          </Text>
          <Text style={styles.brineText}>
            • {t('Kwas mlekowy 80% (do pH 5.20):')} <Text style={styles.boldText}>{brineAcidCalc.lacticAcidMlNeeded} {t('ml kwasu')}</Text>
          </Text>
          <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
            💡 {brineAcidCalc.equilibriumExplanation}
          </Text>
        </View>
      </View>

      {/* 5. Brine Salinity Boost & Regeneration */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🧂 {t('Regeneracja i Wzmocnienie Stężenia Solanki')}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Aktualne stężenie solanki (%):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(currentBrineSalinity)}
            onChangeText={(v) => setCurrentBrineSalinity(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Docelowe stężenie solanki (%):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(targetBrineSalinity)}
            onChangeText={(v) => setTargetBrineSalinity(parseFloat(v) || 0)}
          />
        </View>
        <View style={styles.brineResultBox}>
          <Text style={styles.brineText}>
            • {t('Sól do dosypania w celu przywrócenia stężenia:')}{' '}
            <Text style={styles.boldText}>{brineBoostCalc.saltGramsToAdd} g</Text>
          </Text>
          <Text style={styles.recipeDetailText}>
            {t('Rozpuść sól bezpośrednio w solance bez wylewania roztworu.')}
          </Text>
        </View>
      </View>

      {/* Brine Densitometry & Hydrometer Temp Compensation */}
      {brineDensitometryCalc && (
        <View style={styles.proCard}>
          <Text style={styles.proCardTitle}>
            ⚖️ {t('Areometria Solanki & Kompensacja Temperatury')}
          </Text>
          <Text style={styles.proCardDesc}>
            {t('Przeliczanie stopni Salometru (°Sal), Baumé (°Bé), gęstości SG i % NaCl z korektą termiczną')}
          </Text>

          {/* Unit selector */}
          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Jednostka pomiaru:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'PERCENT_WT' as const, label: '% NaCl (wag.)' },
              { id: 'SALOMETER' as const, label: '°Sal (Salometr)' },
              { id: 'BAUME' as const, label: '°Bé (Baumé)' },
              { id: 'SPECIFIC_GRAVITY' as const, label: 'SG (Gęstość)' },
            ].map((u) => (
              <TouchableOpacity
                key={u.id}
                style={[styles.presetPill, brineDensityUnit === u.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setBrineDensityUnit(u.id);
                }}
              >
                <Text style={[styles.presetPillText, brineDensityUnit === u.id && styles.presetPillTextActive]}>
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Odczyt areometru:')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(brineMeasuredValue)}
              onChangeText={(v) => setBrineMeasuredValue(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura solanki (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(brineSampleTempC)}
              onChangeText={(v) => setBrineSampleTempC(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Objętość solanki (L):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(brineVolumeLitersInput)}
              onChangeText={(v) => setBrineVolumeLitersInput(parseFloat(v) || 0)}
            />
          </View>

          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Profil docelowy solanki:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {(Object.keys(BRINE_TARGET_PROFILES) as BrineTargetProfileKey[]).map((pk) => {
              const prof = BRINE_TARGET_PROFILES[pk];
              return (
                <TouchableOpacity
                  key={pk}
                  style={[styles.presetPill, brineTargetProfile === pk && styles.presetPillActive]}
                  onPress={() => {
                    triggerHapticFeedback();
                    setBrineTargetProfile(pk);
                  }}
                >
                  <Text style={[styles.presetPillText, brineTargetProfile === pk && styles.presetPillTextActive]}>
                    {prof.namePl.split(' (')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.brineResultBox}>
            <Text style={[
              styles.safetyStatus,
              brineDensitometryCalc.status === 'SUPER_SATURATED' || brineDensitometryCalc.status === 'TOO_DILUTE'
                ? styles.safetyDanger
                : { color: '#15803D' }
            ]}>
              • {t('Status roztworu:')} {brineDensitometryCalc.status}
            </Text>

            <Text style={styles.proCardDesc}>
              • {t('Gęstość skorygowana SG:')} <Text style={styles.boldText}>{brineDensitometryCalc.temperatureCorrectedSg}</Text> ({t('Korekta termiczna SG:')} {brineDensitometryCalc.thermalOffsetSg > 0 ? `+${brineDensitometryCalc.thermalOffsetSg}` : brineDensitometryCalc.thermalOffsetSg})
            </Text>

            <Text style={styles.proCardDesc}>
              • {t('Zasolenie NaCl:')} <Text style={styles.boldText}>{brineDensitometryCalc.percentNacl}%</Text> | {t('Stopnie Salometru:')} <Text style={styles.boldText}>{brineDensitometryCalc.salometerDegrees}°Sal</Text> | {t('Stopnie Baumé:')} <Text style={styles.boldText}>{brineDensitometryCalc.baumeDegrees}°Bé</Text>
            </Text>

            <Text style={styles.proCardDesc}>
              • {t('NaCl na litr solanki:')} <Text style={styles.boldText}>{brineDensitometryCalc.gramsNaclPerLiterBrine} g/L</Text> ({t('NaCl na litr wody:')} {brineDensitometryCalc.gramsNaclPerLiterWater} g/L)
            </Text>

            {brineDensitometryCalc.saltAdjustmentGrams !== undefined && (
              <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
                🧂 {t('Dodatek soli do celu:')} <Text style={styles.boldText}>{brineDensitometryCalc.saltAdjustmentGrams} g</Text> ({t('do')} {BRINE_TARGET_PROFILES[brineTargetProfile].namePl})
              </Text>
            )}

            {brineDensitometryCalc.alertsPl.map((alert, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                ⚠️ {alert}
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
  safetyStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
