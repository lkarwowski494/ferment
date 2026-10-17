import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  ShioKojiRecipeResult,
  AmazakeRecipeResult,
  MisoFormulationResult,
  KojiMoistureState,
} from '../../core/koji-fermentation';

export type KojiCalcState =
  | { type: 'SHIO_KOJI'; data: ShioKojiRecipeResult }
  | { type: 'AMAZAKE'; data: AmazakeRecipeResult }
  | { type: 'MISO'; data: MisoFormulationResult }
  | null;

interface KojiAmazakeCardProps {
  kojiMode: 'SHIO_KOJI' | 'AMAZAKE' | 'MISO';
  setKojiMode: (v: 'SHIO_KOJI' | 'AMAZAKE' | 'MISO') => void;
  kojiMassGrams: number;
  setKojiMassGrams: (v: number) => void;
  kojiState: KojiMoistureState;
  setKojiState: (v: KojiMoistureState) => void;
  kojiTempC: number;
  setKojiTempC: (v: number) => void;
  amazakeCookedRiceGrams: number;
  setAmazakeCookedRiceGrams: (v: number) => void;
  amazakeTempC: number;
  setAmazakeTempC: (v: number) => void;
  misoSoyGrams: number;
  setMisoSoyGrams: (v: number) => void;
  misoTypeInput: 'SHIRO_MISO' | 'AKAMISO';
  setMisoTypeInput: (v: 'SHIRO_MISO' | 'AKAMISO') => void;
  kojiCalc: KojiCalcState;
}

export const KojiAmazakeCard: React.FC<KojiAmazakeCardProps> = ({
  kojiMode,
  setKojiMode,
  kojiMassGrams,
  setKojiMassGrams,
  kojiState,
  setKojiState,
  kojiTempC,
  setKojiTempC,
  amazakeCookedRiceGrams,
  setAmazakeCookedRiceGrams,
  amazakeTempC,
  setAmazakeTempC,
  misoSoyGrams,
  setMisoSoyGrams,
  misoTypeInput,
  setMisoTypeInput,
  kojiCalc,
}) => {
  if (!kojiCalc) return null;

  return (
    <View style={styles.proCard}>
      <Text style={styles.proCardTitle}>
        🌾 {t('Enzymatyka Koji, Shio Koji & Amazake')}
      </Text>
      <Text style={styles.proCardDesc}>
        {t('Hydroliza enzymatyczna Aspergillus oryzae: shio koji, amazake i miso z kontrolą okna termicznego')}
      </Text>

      {/* Mode selector */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Tryb Koji:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'SHIO_KOJI' as const, label: t('Shio Koji (Słona pasta)') },
          { id: 'AMAZAKE' as const, label: t('Amazake (Słodki napój ryżowy)') },
          { id: 'MISO' as const, label: t('Miso (Pasta sojowa)') },
        ].map((km) => (
          <TouchableOpacity
            key={km.id}
            style={[styles.presetPill, kojiMode === km.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setKojiMode(km.id);
            }}
          >
            <Text style={[styles.presetPillText, kojiMode === km.id && styles.presetPillTextActive]}>
              {km.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa koji (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(kojiMassGrams)}
          onChangeText={(v) => setKojiMassGrams(parseFloat(v) || 0)}
        />
      </View>

      {kojiMode === 'SHIO_KOJI' && (
        <>
          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Stan koji:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'DRIED' as const, label: t('Suszone') },
              { id: 'FRESH' as const, label: t('Świeże (nama)') },
            ].map((ks) => (
              <TouchableOpacity
                key={ks.id}
                style={[styles.presetPill, kojiState === ks.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setKojiState(ks.id);
                }}
              >
                <Text style={[styles.presetPillText, kojiState === ks.id && styles.presetPillTextActive]}>
                  {ks.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura hydrolizy (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(kojiTempC)}
              onChangeText={(v) => setKojiTempC(parseFloat(v) || 0)}
            />
          </View>

          {kojiCalc.type === 'SHIO_KOJI' && (
            <View style={styles.brineResultBox}>
              <Text style={styles.proCardDesc}>
                • {t('Wymagana woda:')} <Text style={styles.boldText}>{kojiCalc.data.waterGrams} g</Text> | {t('Wymagana sól:')} <Text style={styles.boldText}>{kojiCalc.data.saltGrams} g</Text>
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Masa całkowita wsadu:')} <Text style={styles.boldText}>{kojiCalc.data.totalBatchMassGrams} g</Text> ({t('Zasolenie efektywne:')} <Text style={styles.boldText}>{kojiCalc.data.effectiveSalinityPercent}%</Text>)
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Czas fermentacji:')} <Text style={styles.boldText}>{kojiCalc.data.fermentationDurationHours}h</Text> ({kojiCalc.data.fermentationMethodPl})
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Codzienne mieszanie:')} <Text style={styles.boldText}>{kojiCalc.data.dailyStirringRequired ? t('Wymagane (napowietrzanie)') : t('Zbędne (sous-vide)')}</Text>
              </Text>
              <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
                🥩 {t('Dawka do kruszenia mięsa:')} <Text style={styles.boldText}>~{kojiCalc.data.meatTenderizingDoseGrams(500)} g</Text> {t('na 500g mięsa / tofu (10%)')}
              </Text>
              {kojiCalc.data.alertsPl.map((alert, idx) => (
                <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                  ⚠️ {alert}
                </Text>
              ))}
            </View>
          )}
        </>
      )}

      {kojiMode === 'AMAZAKE' && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa ugotowanego ryżu (g):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(amazakeCookedRiceGrams)}
              onChangeText={(v) => setAmazakeCookedRiceGrams(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Temperatura hydrolizy (°C):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(amazakeTempC)}
              onChangeText={(v) => setAmazakeTempC(parseFloat(v) || 0)}
            />
          </View>

          {kojiCalc.type === 'AMAZAKE' && (
            <View style={styles.brineResultBox}>
              <Text style={[
                styles.safetyStatus,
                kojiCalc.data.safetyStatus !== 'OPTIMAL' ? styles.safetyDanger : { color: '#15803D' }
              ]}>
                • {t('Status bezpieczeństwa termicznego:')} {kojiCalc.data.safetyStatus}
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Wymagana woda:')} <Text style={styles.boldText}>{kojiCalc.data.waterGrams} g</Text> ({t('Masa całkowita wsadu:')} {kojiCalc.data.totalMassGrams} g)
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Szacowana słodycz Brix:')} <Text style={styles.boldText}>{kojiCalc.data.expectedBrixSweetness} °Bx</Text> | {t('Czas fermentacji:')} {kojiCalc.data.incubationHours}h
              </Text>
              {kojiCalc.data.alertsPl.map((alert, idx) => (
                <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                  ⚠️ {alert}
                </Text>
              ))}
              {kojiCalc.data.instructionsPl.map((inst, idx) => (
                <Text key={idx} style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                  💡 {inst}
                </Text>
              ))}
            </View>
          )}
        </>
      )}

      {kojiMode === 'MISO' && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Masa gotowanej soi (g):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(misoSoyGrams)}
              onChangeText={(v) => setMisoSoyGrams(parseFloat(v) || 0)}
            />
          </View>

          <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Typ miso:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'SHIRO_MISO' as const, label: t('Shiro Miso (Jasne, słodkie, 1.5 mies.)') },
              { id: 'AKAMISO' as const, label: t('Akamiso (Ciemne, wytrawne, 12 mies.)') },
            ].map((mt) => (
              <TouchableOpacity
                key={mt.id}
                style={[styles.presetPill, misoTypeInput === mt.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setMisoTypeInput(mt.id);
                }}
              >
                <Text style={[styles.presetPillText, misoTypeInput === mt.id && styles.presetPillTextActive]}>
                  {mt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {kojiCalc.type === 'MISO' && (
            <View style={styles.brineResultBox}>
              <Text style={[
                styles.safetyStatus,
                kojiCalc.data.safetyStatus !== 'SAFE' ? styles.safetyDanger : { color: '#15803D' }
              ]}>
                • {t('Status bezpieczeństwa:')} {kojiCalc.data.safetyStatus}
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Wymagana sól:')} <Text style={styles.boldText}>{kojiCalc.data.saltGrams} g</Text> ({t('Zasolenie efektywne:')} <Text style={styles.boldText}>{kojiCalc.data.saltPercent}%</Text>)
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Zalecany ciężar docisku:')} <Text style={styles.boldText}>{kojiCalc.data.pressWeightGrams} g</Text> (otoshiguta + kamień)
              </Text>
              <Text style={styles.proCardDesc}>
                • {t('Czas fermentacji:')} <Text style={styles.boldText}>~{kojiCalc.data.fermentationDurationMonths} {t('miesięcy')}</Text>
              </Text>
              {kojiCalc.data.alertsPl.map((alert, idx) => (
                <Text key={idx} style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                  ⚠️ {alert}
                </Text>
              ))}
            </View>
          )}
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
