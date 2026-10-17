import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { WheelCoatingResult } from '../../core/curd-washing-and-salting';
import { CheeseCompositionResult } from '../../core/cheese-composition-engine';
import { BrineDiffusionResult } from '../../core/brine-diffusion';
import { MilkSpeciesCalculationResult } from '../../core/milk-species-profile';

interface CheeseBiochemAndCoatingCardProps {
  coatingType: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE';
  setCoatingType: (v: 'CHEESE_WAX' | 'POLYVINYL_BREATHABLE') => void;
  coatingWheelHeightCm: number;
  setCoatingWheelHeightCm: (v: number) => void;
  coatingLayers: number;
  setCoatingLayers: (v: number) => void;
  wheelCoatingCalc: WheelCoatingResult | null;
  cheeseMoisturePct: number;
  setCheeseMoisturePct: (v: number) => void;
  cheeseFatPct: number;
  setCheeseFatPct: (v: number) => void;
  cheeseSaltPct: number;
  setCheeseSaltPct: (v: number) => void;
  cheeseCompositionCalc: CheeseCompositionResult | null;
  diffWheelWeightKg: number;
  setDiffWheelWeightKg: (v: number) => void;
  diffDiameterCm: number;
  setDiffDiameterCm: (v: number) => void;
  diffHeightCm: number;
  setDiffHeightCm: (v: number) => void;
  diffBrineSalinityPct: number;
  setDiffBrineSalinityPct: (v: number) => void;
  diffBrineTempC: number;
  setDiffBrineTempC: (v: number) => void;
  brineDiffusionCalc: BrineDiffusionResult | null;
  milkSpeciesCalc: MilkSpeciesCalculationResult | null;
  milkLiters: number;
}

export const CheeseBiochemAndCoatingCard: React.FC<CheeseBiochemAndCoatingCardProps> = ({
  coatingType,
  setCoatingType,
  coatingWheelHeightCm,
  setCoatingWheelHeightCm,
  coatingLayers,
  setCoatingLayers,
  wheelCoatingCalc,
  cheeseMoisturePct,
  setCheeseMoisturePct,
  cheeseFatPct,
  setCheeseFatPct,
  cheeseSaltPct,
  setCheeseSaltPct,
  cheeseCompositionCalc,
  diffWheelWeightKg,
  setDiffWheelWeightKg,
  diffDiameterCm,
  setDiffDiameterCm,
  diffHeightCm,
  setDiffHeightCm,
  diffBrineSalinityPct,
  setDiffBrineSalinityPct,
  diffBrineTempC,
  setDiffBrineTempC,
  brineDiffusionCalc,
  milkSpeciesCalc,
  milkLiters,
}) => {
  return (
    <>
      {/* 9. Cheese Wheel Coating & Wax Calculator */}
      <View style={styles.proCard}>
        <Text style={styles.proCardTitle}>🛡️ {t('Woskowanie & Powłoki Ochronne Krążka')}</Text>
        <Text style={styles.proCardDesc}>
          {t('Obliczanie powierzchni krążka i zapotrzebowania na wosk serowarski lub polioctan')}
        </Text>
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typePill, coatingType === 'CHEESE_WAX' && styles.typePillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCoatingType('CHEESE_WAX');
            }}
          >
            <Text style={[styles.typePillText, coatingType === 'CHEESE_WAX' && styles.typePillTextActive]}>
              🧀 {t('Wosk Serowarski')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typePill, coatingType === 'POLYVINYL_BREATHABLE' && styles.typePillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setCoatingType('POLYVINYL_BREATHABLE');
            }}
          >
            <Text style={[styles.typePillText, coatingType === 'POLYVINYL_BREATHABLE' && styles.typePillTextActive]}>
              🛡️ {t('Powłoka Polioctanowa')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Wysokość krążka (cm):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(coatingWheelHeightCm)}
            onChangeText={(v) => setCoatingWheelHeightCm(parseFloat(v) || 1)}
          />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.inlineLabel}>{t('Liczba warstw (1-3):')}</Text>
          <TextInput
            style={styles.numInput}
            keyboardType="numeric"
            value={String(coatingLayers)}
            onChangeText={(v) => setCoatingLayers(parseInt(v, 10) || 1)}
          />
        </View>
        {wheelCoatingCalc && (
          <View style={styles.brineResultBox}>
            <Text style={styles.brineText}>
              • {t('Powierzchnia całkowita krążka:')}{' '}
              <Text style={styles.boldText}>{wheelCoatingCalc.surfaceAreaCm2} cm²</Text>
            </Text>
            <Text style={styles.brineText}>
              • {t('Zapotrzebowanie na wosk/powłokę:')}{' '}
              <Text style={styles.boldText}>{wheelCoatingCalc.totalGramsNeeded} g</Text> ({coatingLayers} {t('warstwy')})
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {wheelCoatingCalc.recommendation}
            </Text>
          </View>
        )}
      </View>

      {/* 10. Codex Alimentarius Composition & S/M Ratio */}
      {cheeseCompositionCalc && (
        <View style={[styles.proCard, cheeseCompositionCalc.smStatus !== 'OPTIMAL_BALANCED' && styles.cardDanger]}>
          <Text style={styles.proCardTitle}>⚖️ {t('Skład Biochemiczny & Klasyfikacja Codex Alimentarius')}</Text>
          <Text style={styles.proCardDesc}>
            {t('Standard CODEX STAN 283-1978: MFFB, FDM oraz relacja Salt-in-Moisture (S/M)')}
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Szacowana wilgotność sera (%):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(cheeseMoisturePct)}
              onChangeText={(v) => setCheeseMoisturePct(parseFloat(v) || 1)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Zawartość tłuszczu w serze (%):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(cheeseFatPct)}
              onChangeText={(v) => setCheeseFatPct(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Stężenie soli w serze (%):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(cheeseSaltPct)}
              onChangeText={(v) => setCheeseSaltPct(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.brineResultBox}>
            <Text style={styles.brineText}>
              • {t('MFFB (woda w masie beztłuszczowej):')}{' '}
              <Text style={styles.boldText}>{cheeseCompositionCalc.mffbPercentage}%</Text> → {cheeseCompositionCalc.firmnessLabelPl}
            </Text>
            <Text style={styles.brineText}>
              • {t('FDM (tłuszcz w suchej masie):')}{' '}
              <Text style={styles.boldText}>{cheeseCompositionCalc.fdmPercentage}%</Text> → {cheeseCompositionCalc.fatLabelPl}
            </Text>
            <Text style={styles.brineText}>
              • {t('Salt-in-Moisture (S/M):')}{' '}
              <Text style={styles.boldText}>{cheeseCompositionCalc.saltInMoisturePercentage}%</Text> ({cheeseCompositionCalc.dryMatterPercentage}% {t('suchej masy')})
            </Text>
            <Text style={[
              styles.safetyStatus,
              cheeseCompositionCalc.smStatus !== 'OPTIMAL_BALANCED' && styles.safetyDanger,
              { marginTop: 4 }
            ]}>
              {cheeseCompositionCalc.smMessagePl}
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              💡 {cheeseCompositionCalc.recommendations[0]}
            </Text>
          </View>
        </View>
      )}

      {/* 11. Salt Diffusion & Brining Penetration Time (Fick's Second Law) */}
      {brineDiffusionCalc && (
        <View style={styles.proCard}>
          <Text style={styles.proCardTitle}>🧂 {t('Dyfuzja Soli & Czas Solankowania (Prawo Ficka)')}</Text>
          <Text style={styles.proCardDesc}>
            {t('Nieustalona dyfuzja NaCl w głąb kazeiny, penetracja rdzenia krążka i zapobieganie przesoleniu')}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa krążka sera (kg):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(diffWheelWeightKg)}
              onChangeText={(v) => setDiffWheelWeightKg(parseFloat(v) || 0.1)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Średnica krążka (cm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(diffDiameterCm)}
              onChangeText={(v) => setDiffDiameterCm(parseFloat(v) || 1)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Wysokość krążka (cm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(diffHeightCm)}
              onChangeText={(v) => setDiffHeightCm(parseFloat(v) || 1)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Zasolenie solanki (%):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(diffBrineSalinityPct)}
              onChangeText={(v) => setDiffBrineSalinityPct(parseFloat(v) || 10)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura solanki (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(diffBrineTempC)}
              onChangeText={(v) => setDiffBrineTempC(parseFloat(v) || 5)}
            />
          </View>

          <View style={styles.brineResultBox}>
            <Text style={styles.brineText}>
              • {t('Optymalny czas w solance:')}{' '}
              <Text style={styles.boldText}>{brineDiffusionCalc.recommendedBriningHours} {t('godz.')}</Text> ({brineDiffusionCalc.recommendedBriningDays} {t('dni')})
            </Text>
            <Text style={styles.brineText}>
              • {t('Tempo pochłaniania soli:')}{' '}
              <Text style={styles.boldText}>{brineDiffusionCalc.saltUptakeRateGramsPerHour} g/godz.</Text> ({t('łącznie:')} {brineDiffusionCalc.totalSaltAbsorbedGrams}g NaCl)
            </Text>
            <Text style={styles.brineText}>
              • {t('Odległość do rdzenia geometrycznego:')}{' '}
              <Text style={styles.boldText}>{brineDiffusionCalc.distanceToCoreCm} cm</Text> ({t('współczynnik dyfuzji:')} {brineDiffusionCalc.diffusionCoefficientCm2PerDay} cm²/d)
            </Text>
            <Text style={styles.brineText}>
              • {t('Czas wyrównania stężenia w rdzeniu:')}{' '}
              <Text style={styles.boldText}>{brineDiffusionCalc.daysToCoreEquilibration} {t('dni')}</Text>
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              ℹ️ {brineDiffusionCalc.equilibrationSchedulePl}
            </Text>
            {brineDiffusionCalc.safetyWarningsPl.map((warn, i) => (
              <Text key={i} style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
                ⚠️ {warn}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Milk Species Coagulation & Proteolysis Profile */}
      {milkSpeciesCalc && (
        <View style={styles.proCard}>
          <Text style={styles.proCardTitle}>
            🐑 {t('Morfologia Gatunkowa Mleka & Kazeina')}
          </Text>
          <Text style={styles.proCardDesc}>
            {t('Frakcje kazeiny, średnica kuleczek tłuszczu, dynamika enzymatyczna i szacowany uzysk sera')}
          </Text>

          <View style={styles.brineResultBox}>
            <Text style={[styles.safetyStatus, { color: '#15803D' }]}>
              • {milkSpeciesCalc.species.namePl} ({milkSpeciesCalc.species.scientificName})
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Dominująca frakcja kazeiny:')} <Text style={styles.boldText}>{milkSpeciesCalc.species.dominantCaseinFraction}</Text>
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Średnia kuleczek tłuszczowych:')} <Text style={styles.boldText}>{milkSpeciesCalc.species.meanFatGlobuleDiameterMicrons} µm</Text> | {t('Wapń:')} {milkSpeciesCalc.species.calciumMgPer100g} mg/100g
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Doza podpuszczki:')} <Text style={styles.boldText}>{milkSpeciesCalc.recommendedRennetImcuPerLiter} IMCU/L</Text> ({milkSpeciesCalc.rennetVolumeMlLiquid200Imcu} ml {t('na')} {milkLiters}L)
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Skorygowany mnożnik flokulacji:')} <Text style={styles.boldText}>{milkSpeciesCalc.effectiveFlocculationMultiplier}x</Text>
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Oczekiwany uzysk sera:')} <Text style={styles.boldText}>{milkSpeciesCalc.expectedCheeseYieldKg} kg</Text> ({milkSpeciesCalc.yieldRatioPct}%)
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Odzysk Ricotty z serwatki:')} <Text style={styles.boldText}>~{milkSpeciesCalc.wheyProteinRecoveryPotentialGrams} g</Text>
            </Text>

            <Text style={[styles.recipeDetailText, { marginTop: 6 }]}>
              💡 {milkSpeciesCalc.species.lipolysisAndFlavorNotesPl}
            </Text>

            {milkSpeciesCalc.craftNotes.map((note, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                • {note}
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
  safetyStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
