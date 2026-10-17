import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  NukazukeVegType,
  NukadokoSetupResult,
  NukadokoMaintenanceResult,
  NukazukePicklingTimeResult,
} from '../../core/nukazuke-engine';

export type NukadokoCalcState =
  | { tab: 'SETUP'; data: NukadokoSetupResult }
  | { tab: 'MAINTENANCE'; data: NukadokoMaintenanceResult }
  | { tab: 'VEG_TIME'; data: NukazukePicklingTimeResult }
  | null;

interface NukadokoCardProps {
  nukadokoTab: 'SETUP' | 'MAINTENANCE' | 'VEG_TIME';
  setNukadokoTab: (v: 'SETUP' | 'MAINTENANCE' | 'VEG_TIME') => void;
  nukaBranGrams: number;
  setNukaBranGrams: (v: number) => void;
  nukaBedMassGrams: number;
  setNukaBedMassGrams: (v: number) => void;
  nukaSalinityPct: number;
  setNukaSalinityPct: (v: number) => void;
  nukaMoistureStatus: 'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY';
  setNukaMoistureStatus: (v: 'OPTIMAL_SAND' | 'SLIGHTLY_WET' | 'VERY_SLUSHY') => void;
  nukaSelectedVeg: NukazukeVegType;
  setNukaSelectedVeg: (v: NukazukeVegType) => void;
  ambientTempC: number;
  nukadokoCalc: NukadokoCalcState;
}

export const NukadokoCard: React.FC<NukadokoCardProps> = ({
  nukadokoTab,
  setNukadokoTab,
  nukaBranGrams,
  setNukaBranGrams,
  nukaBedMassGrams,
  setNukaBedMassGrams,
  nukaMoistureStatus,
  setNukaMoistureStatus,
  nukaSelectedVeg,
  setNukaSelectedVeg,
  ambientTempC,
  nukadokoCalc,
}) => {
  if (!nukadokoCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🥢 {t('Japońskie Łoże Otrębowe Nukadoko')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Tradycyjna fermentacja w prażonych otrębach ryżowych: zakładanie (sutezuke), aeracja Te-ire i czasy kiszenia')}
      </Text>

      {/* Sub-tab selector */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Krok procesu:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'SETUP' as const, label: t('Zakładanie łoża (Sutezuke)') },
          { id: 'MAINTENANCE' as const, label: t('Pielęgnacja & Aeracja (Te-ire)') },
          { id: 'VEG_TIME' as const, label: t('Czas kiszenia warzyw') },
        ].map((tb) => (
          <TouchableOpacity
            key={tb.id}
            style={[styles.presetPill, nukadokoTab === tb.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setNukadokoTab(tb.id);
            }}
          >
            <Text style={[styles.presetPillText, nukadokoTab === tb.id && styles.presetPillTextActive]}>
              {tb.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {nukadokoTab === 'SETUP' && nukadokoCalc.tab === 'SETUP' && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa prażonych otrębów (g):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(nukaBranGrams)}
              onChangeText={(v) => setNukaBranGrams(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.brineResultBox}>
            <Text style={styles.proCardDesc}>
              • {t('Wymagana woda:')} <Text style={styles.boldText}>{nukadokoCalc.data.waterGrams} g</Text> | {t('Wymagana sól kamienna:')} <Text style={styles.boldText}>{nukadokoCalc.data.saltGrams} g</Text>
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Masa całkowita łoża:')} <Text style={styles.boldText}>{nukadokoCalc.data.totalBedMassGrams} g</Text> ({t('Docelowe zasolenie:')} <Text style={styles.boldText}>{nukadokoCalc.data.effectiveSalinityPct}%</Text>)
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Aromatyki:')} Konbu {nukadokoCalc.data.aromaticsGrams.konbuGrams}g, Chili {nukadokoCalc.data.aromaticsGrams.driedChiliGrams}g, Imbir {nukadokoCalc.data.aromaticsGrams.gingerSlicesGrams}g
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              ⏳ {t('Czas rozruchu ze sutezuke:')} <Text style={styles.boldText}>{nukadokoCalc.data.sutezukeDurationDays} {t('dni')}</Text>
            </Text>
            {nukadokoCalc.data.sutezukeInstructionsPl.map((inst, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                💡 {inst}
              </Text>
            ))}
          </View>
        </>
      )}

      {nukadokoTab === 'MAINTENANCE' && nukadokoCalc.tab === 'MAINTENANCE' && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Aktualna masa łoża (g):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(nukaBedMassGrams)}
              onChangeText={(v) => setNukaBedMassGrams(parseFloat(v) || 0)}
            />
          </View>

          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Wilgotność łoża:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'OPTIMAL_SAND' as const, label: t('Optymalna (wilgotny piasek)') },
              { id: 'SLIGHTLY_WET' as const, label: t('Lekko mokre') },
              { id: 'VERY_SLUSHY' as const, label: t('Bardzo błotniste (kałuża)') },
            ].map((ms) => (
              <TouchableOpacity
                key={ms.id}
                style={[styles.presetPill, nukaMoistureStatus === ms.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setNukaMoistureStatus(ms.id);
                }}
              >
                <Text style={[styles.presetPillText, nukaMoistureStatus === ms.id && styles.presetPillTextActive]}>
                  {ms.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.brineResultBox}>
            <Text style={[
              styles.safetyStatus,
              nukadokoCalc.data.status !== 'HEALTHY' ? styles.safetyDanger : { color: '#15803D' }
            ]}>
              • {t('Status zdrowotny łoża:')} {nukadokoCalc.data.status}
            </Text>
            <Text style={styles.proCardDesc}>
              • {t('Częstotliwość mieszania ręką (Te-ire):')} <Text style={styles.boldText}>{nukadokoCalc.data.teireFrequencyDaily}x {t('dziennie')}</Text>
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 2 }]}>
              ✋ {nukadokoCalc.data.teireInstructionPl}
            </Text>
            {(nukadokoCalc.data.dryBranTopupGrams > 0 || nukadokoCalc.data.saltTopupGrams > 0) && (
              <Text style={[styles.proCardDesc, { marginTop: 6 }]}>
                • {t('Wymagane dosypanie:')} <Text style={styles.boldText}>{nukadokoCalc.data.dryBranTopupGrams} g</Text> {t('prażonych otrębów')} + <Text style={styles.boldText}>{nukadokoCalc.data.saltTopupGrams} g</Text> {t('soli')}
              </Text>
            )}
            {nukadokoCalc.data.alertsPl.map((alert, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                ⚠️ {alert}
              </Text>
            ))}
          </View>
        </>
      )}

      {nukadokoTab === 'VEG_TIME' && nukadokoCalc.tab === 'VEG_TIME' && (
        <>
          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Wybierz warzywo do zakopania:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'CUCUMBER' as const, label: t('Ogórek') },
              { id: 'EGGPLANT' as const, label: t('Bakłażan') },
              { id: 'DAIKON_RADISH' as const, label: t('Daikon (Rzodkiew)') },
              { id: 'CARROT' as const, label: t('Marchew') },
              { id: 'AVOCADO_BOILED_EGG' as const, label: t('Awokado / Jajko') },
            ].map((vg) => (
              <TouchableOpacity
                key={vg.id}
                style={[styles.presetPill, nukaSelectedVeg === vg.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setNukaSelectedVeg(vg.id);
                }}
              >
                <Text style={[styles.presetPillText, nukaSelectedVeg === vg.id && styles.presetPillTextActive]}>
                  {vg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.brineResultBox}>
            <Text style={styles.proCardDesc}>
              • {t('Czas kiszenia:')} <Text style={styles.boldText}>{nukadokoCalc.data.durationHoursMin}–{nukadokoCalc.data.durationHoursMax} {t('godzin')}</Text> ({t('w temp.')} {ambientTempC}°C)
            </Text>
            <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
              🥒 {nukadokoCalc.data.prepAdvicePl}
            </Text>
          </View>
        </>
      )}
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
  brineResultBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
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
  safetyStatus: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  safetyDanger: {
    color: '#DC2626',
  },
});
