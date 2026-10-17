import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  BotanicalSourceId,
  GarlicPrepMethod,
  VegCrispnessResult,
} from '../../core/botanical-extraction';

interface CrispnessBotanicalCardProps {
  selectedBotanical: BotanicalSourceId;
  setSelectedBotanical: (v: BotanicalSourceId) => void;
  botanicalGrams: number;
  setBotanicalGrams: (v: number) => void;
  garlicGramsInput: number;
  setGarlicGramsInput: (v: number) => void;
  garlicPrepInput: GarlicPrepMethod;
  setGarlicPrepInput: (v: GarlicPrepMethod) => void;
  vegCrispnessCalc: VegCrispnessResult | null;
}

export const CrispnessBotanicalCard: React.FC<CrispnessBotanicalCardProps> = ({
  selectedBotanical,
  setSelectedBotanical,
  botanicalGrams,
  setBotanicalGrams,
  garlicGramsInput,
  setGarlicGramsInput,
  garlicPrepInput,
  setGarlicPrepInput,
  vegCrispnessCalc,
}) => {
  if (!vegCrispnessCalc) return null;

  return (
    <View style={[styles.proCard, vegCrispnessCalc.crispnessVerdict === 'INADEQUATE_RISK_OF_MUSHY' && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🌿 {t('Ekstrakcja Botaniczna & Ochrona Chrupkości')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Denaturacja pektynaz garbnikami roślinnymi (dąb, wiśnia, chrzan) i kinetyka allicyny')}
      </Text>

      {/* Botanical source pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'OAK_LEAF' as const, label: t('Liść dębu (45mg/g)') },
          { id: 'SOUR_CHERRY_LEAF' as const, label: t('Liść wiśni (30mg/g)') },
          { id: 'BLACKCURRANT_LEAF' as const, label: t('Porzeczka (25mg/g)') },
          { id: 'HORSERADISH_ROOT' as const, label: t('Chrzan korzeń (12mg/g)') },
          { id: 'HORSERADISH_LEAF' as const, label: t('Chrzan liść (15mg/g)') },
          { id: 'BAY_LEAF' as const, label: t('Liść laurowy (20mg/g)') },
          { id: 'GRAPE_LEAF' as const, label: t('Liść winorośli (35mg/g)') },
          { id: 'BLACK_TEA_LEAF' as const, label: t('Czarna herbata (80mg/g)') },
        ].map((bot) => (
          <TouchableOpacity
            key={bot.id}
            style={[styles.presetPill, selectedBotanical === bot.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setSelectedBotanical(bot.id);
            }}
          >
            <Text style={[styles.presetPillText, selectedBotanical === bot.id && styles.presetPillTextActive]}>
              {bot.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Masa dodatku botanicznego (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(botanicalGrams)}
          onChangeText={(v) => setBotanicalGrams(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Czosnek do wsadu (g):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(garlicGramsInput)}
          onChangeText={(v) => setGarlicGramsInput(parseFloat(v) || 0)}
        />
      </View>

      {/* Garlic prep selector */}
      <Text style={[styles.inputLabelMini, { marginTop: 6 }]}>{t('Przygotowanie czosnku:')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'BRUISED_CRUSHED' as const, label: t('Zgnieciony nożem (85% allicyny)') },
          { id: 'WHOLE_PEELED' as const, label: t('Całe ząbki obrane (20% allicyny)') },
          { id: 'MINCED_GRATED' as const, label: t('Posiekany / starty (100% allicyny)') },
          { id: 'WHOLE_UNPEELED' as const, label: t('W łupinie (5% allicyny)') },
        ].map((gp) => (
          <TouchableOpacity
            key={gp.id}
            style={[styles.presetPill, garlicPrepInput === gp.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setGarlicPrepInput(gp.id);
            }}
          >
            <Text style={[styles.presetPillText, garlicPrepInput === gp.id && styles.presetPillTextActive]}>
              {gp.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.safetyBox}>
        <Text style={[
          styles.safetyStatus,
          vegCrispnessCalc.crispnessVerdict === 'INADEQUATE_RISK_OF_MUSHY'
            ? styles.safetyDanger
            : vegCrispnessCalc.crispnessVerdict === 'OVER_ASTRINGENT'
            ? { color: '#B45309' }
            : { color: '#15803D' }
        ]}>
          • {t('Ochrona chrupkości:')} {vegCrispnessCalc.verdictLabelPl} ({vegCrispnessCalc.crispnessProtectionRatioPct}%)
        </Text>

        <Text style={styles.proCardDesc}>
          • {t('Podaż garbników:')} <Text style={styles.boldText}>{vegCrispnessCalc.totalTanninsMg} mg</Text> ({vegCrispnessCalc.tanninConcentrationMgPerKg} mg/kg {t('wsadu')}, {t('cel')} &ge; {vegCrispnessCalc.targetMinimumTanninsMg} mg)
        </Text>

        {vegCrispnessCalc.garlicAllicinOutputMg !== undefined && (
          <Text style={styles.proCardDesc}>
            • {t('Aktywna allicyna:')} <Text style={styles.boldText}>{vegCrispnessCalc.garlicAllicinOutputMg} mg</Text>
          </Text>
        )}

        {vegCrispnessCalc.garlicImpactNotes && (
          <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
            🧄 {vegCrispnessCalc.garlicImpactNotes}
          </Text>
        )}

        {vegCrispnessCalc.dominantActiveCompounds.length > 0 && (
          <Text style={[styles.recipeDetailText, { marginTop: 4 }]}>
            🔬 {t('Związki aktywne:')} {vegCrispnessCalc.dominantActiveCompounds.join(', ')}
          </Text>
        )}

        {vegCrispnessCalc.craftRecommendations.map((rec, idx) => (
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
    marginBottom: 4,
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
