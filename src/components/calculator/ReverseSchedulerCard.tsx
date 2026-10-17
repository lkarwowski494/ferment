import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { t } from '../../lib/i18n';
import { triggerHapticFeedback } from '../../lib/timer-audio';
import { CraftProcessType, ScheduleResult } from '../../core/reverse-scheduler';
import { styles } from './calculator.styles';

interface ReverseSchedulerCardProps {
  isSchedulerOpen: boolean;
  setIsSchedulerOpen: (v: boolean) => void;
  schedulerProcess: CraftProcessType;
  setSchedulerProcess: (v: CraftProcessType) => void;
  targetFinishHour: number;
  setTargetFinishHour: React.Dispatch<React.SetStateAction<number>>;
  reverseScheduleCalc: ScheduleResult;
}

export const ReverseSchedulerCard: React.FC<ReverseSchedulerCardProps> = ({
  isSchedulerOpen,
  setIsSchedulerOpen,
  schedulerProcess,
  setSchedulerProcess,
  targetFinishHour,
  setTargetFinishHour,
  reverseScheduleCalc,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.rowBetween}
        onPress={() => {
          triggerHapticFeedback();
          setIsSchedulerOpen(!isSchedulerOpen);
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardMiniTitle}>
            ⏰ {t('Harmonogram Odwrócony Produkcji (Anti-Fatigue Guard)')}
          </Text>
          <Text style={styles.cardDescMini}>
            {t('Oblicz godzinę startu na podstawie planowanego zakończenia, aby nie przerywać snu.')}
          </Text>
        </View>
        <Text style={styles.accordionArrow}>{isSchedulerOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isSchedulerOpen && (
        <View style={styles.schedulerBody}>
          <Text style={styles.inputLabelMini}>{t('Typ procesu:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {[
              { id: 'CHEESE_HARD_GOUDA' as const, label: t('Gouda (15.5h)') },
              { id: 'CHEESE_PASTA_FILATA_MOZZARELLA' as const, label: t('Mozzarella (4.5h)') },
              { id: 'CHEESE_FRESH_KORYCIN' as const, label: t('Ser Koryciński') },
              { id: 'KIMCHI_TRADITIONAL' as const, label: t('Kimchi (5h)') },
              { id: 'KOMBUCHA_1F' as const, label: t('Kombucha 1F (1h)') },
              { id: 'BEET_KVASS' as const, label: t('Zakwas Buraczany') },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.presetPill, schedulerProcess === item.id && styles.presetPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setSchedulerProcess(item.id);
                }}
              >
                <Text style={[styles.presetPillText, schedulerProcess === item.id && styles.presetPillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Docelowa godzina ukończenia:')}</Text>
            <View style={styles.miniStepper}>
              <TouchableOpacity
                style={styles.miniStepperBtn}
                onPress={() => {
                  triggerHapticFeedback();
                  setTargetFinishHour((h) => (h === 0 ? 23 : h - 1));
                }}
              >
                <Text style={styles.miniStepperBtnText}>-1h</Text>
              </TouchableOpacity>
              <Text style={styles.miniStepperVal}>{String(targetFinishHour).padStart(2, '0')}:00</Text>
              <TouchableOpacity
                style={styles.miniStepperBtn}
                onPress={() => {
                  triggerHapticFeedback();
                  setTargetFinishHour((h) => (h === 23 ? 0 : h + 1));
                }}
              >
                <Text style={styles.miniStepperBtnText}>+1h</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.schedulerResultBox}>
            <Text style={styles.schedulerStartLabel}>{t('Rozpocznij produkcję:')}</Text>
            <Text style={styles.schedulerStartHour}>
              {String(reverseScheduleCalc.startTime.getHours()).padStart(2, '0')}:
              {String(reverseScheduleCalc.startTime.getMinutes()).padStart(2, '0')}
            </Text>
            <Text style={styles.schedulerSubText}>
              {t('Całkowity czas trwania:')} {Math.floor(reverseScheduleCalc.totalDurationMinutes / 60)}h{' '}
              {reverseScheduleCalc.totalDurationMinutes % 60}m
            </Text>

            {reverseScheduleCalc.hasNightConflict && (
              <View style={styles.nightWarningBox}>
                <Text style={styles.nightWarningTitle}>
                  ⚠️ {t('Konflikt Nocny (23:00 – 06:00)!')}
                </Text>
                {reverseScheduleCalc.nightConflictWarnings.map((w, idx) => (
                  <Text key={idx} style={styles.nightWarningLine}>• {w}</Text>
                ))}
                <Text style={styles.nightWarningRec}>
                  💡 {reverseScheduleCalc.recommendation}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.inputLabelMini}>{t('Kroki procesu:')}</Text>
          {reverseScheduleCalc.steps.map((st, idx) => (
            <View key={idx} style={styles.timelineRow}>
              <Text style={styles.timelineTime}>
                {String(st.scheduledTime.getHours()).padStart(2, '0')}:{String(st.scheduledTime.getMinutes()).padStart(2, '0')}
              </Text>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineName}>{st.name} ({st.durationMinutes} min)</Text>
                <Text style={styles.timelineDesc}>{st.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
