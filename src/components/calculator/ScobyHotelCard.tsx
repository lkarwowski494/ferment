import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import {
  LiveCultureType,
  CultureHotelResult,
} from '../../core/culture-hotel-engine';

interface ScobyHotelCardProps {
  hotelCultureType: LiveCultureType;
  setHotelCultureType: (v: LiveCultureType) => void;
  hotelDaysSinceFed: number;
  setHotelDaysSinceFed: (v: number) => void;
  hotelVolumeMl: number;
  setHotelVolumeMl: (v: number) => void;
  hotelSludgeDepthCm: number;
  setHotelSludgeDepthCm: (v: number) => void;
  cultureHotelCalc: CultureHotelResult | null;
}

export const ScobyHotelCard: React.FC<ScobyHotelCardProps> = ({
  hotelCultureType,
  setHotelCultureType,
  hotelDaysSinceFed,
  setHotelDaysSinceFed,
  hotelVolumeMl,
  setHotelVolumeMl,
  hotelSludgeDepthCm,
  setHotelSludgeDepthCm,
  cultureHotelCalc,
}) => {
  if (!cultureHotelCalc) return null;

  return (
    <View style={[styles.proCard, (cultureHotelCalc.healthStatus === 'STARVATION_RISK' || cultureHotelCalc.isMoldHazard) && styles.cardDanger]}>
      <Text style={styles.proCardTitle}>🏨 {t('Hotel SCOBY & Matecznik Kultur Żywych')}</Text>
      <Text style={styles.proCardDesc}>
        {t('Zarządzanie rezerwą starterową, dokarmianiem i zabezpieczeniem przed pleśnią')}
      </Text>

      {/* Culture Type Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {[
          { id: 'KOMBUCHA_SCOBY_HOTEL' as const, label: t('Hotel SCOBY') },
          { id: 'VINEGAR_MOTHER' as const, label: t('Matka Octowa') },
          { id: 'MILK_KEFIR_GRAINS' as const, label: t('Kefir Mleczny') },
          { id: 'WATER_KEFIR_TIBICOS' as const, label: t('Kefir Wodny (Tibicos)') },
          { id: 'WHEY_STARTER_LEVAIN' as const, label: t('Serwatka Mateczna') },
        ].map((cult) => (
          <TouchableOpacity
            key={cult.id}
            style={[styles.presetPill, hotelCultureType === cult.id && styles.presetPillActive]}
            onPress={() => {
              triggerHapticFeedback();
              setHotelCultureType(cult.id);
            }}
          >
            <Text style={[styles.presetPillText, hotelCultureType === cult.id && styles.presetPillTextActive]}>
              {cult.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Dni od ostatniego zasilenia:')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(hotelDaysSinceFed)}
          onChangeText={(v) => setHotelDaysSinceFed(parseFloat(v) || 0)}
        />
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Objętość płynu w słoiku (ml):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(hotelVolumeMl)}
          onChangeText={(v) => setHotelVolumeMl(parseFloat(v) || 100)}
        />
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.inlineLabel}>{t('Osad drożdżowy na dnie (cm):')}</Text>
        <TextInput
          style={styles.numInput}
          keyboardType="numeric"
          value={String(hotelSludgeDepthCm)}
          onChangeText={(v) => setHotelSludgeDepthCm(parseFloat(v) || 0)}
        />
      </View>

      <View style={styles.safetyBox}>
        <Text style={[
          styles.safetyStatus,
          cultureHotelCalc.healthStatus === 'STARVATION_RISK' || cultureHotelCalc.isMoldHazard
            ? styles.safetyDanger
            : cultureHotelCalc.healthStatus === 'DUE_FOR_FEEDING'
            ? { color: '#B45309' }
            : { color: '#15803D' }
        ]}>
          • {t('Stan kolonii:')} {cultureHotelCalc.statusLabelPl}
        </Text>
        <Text style={styles.proCardDesc}>
          • {t('Planowane zasilenie:')} {cultureHotelCalc.feedingSchedule.feedLiquidVolumeMl} ml {t('płynu')} ({cultureHotelCalc.feedingSchedule.feedSugarGrams}g {t('cukru')})
        </Text>
        <Text style={styles.recipeDetailText}>
          💡 {cultureHotelCalc.feedingSchedule.recommendedFeedingRatioPl}
        </Text>
        {cultureHotelCalc.actionAlerts.map((alert, idx) => (
          <Text key={idx} style={[styles.safetyStatus, styles.safetyDanger, { marginTop: 4 }]}>
            ⚠️ {alert}
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
