// ============================================================================
// Apps4Brew Studio — FERMENT Knowledge Base, Defect Doctor & Sensory Profiler
// Troubleshooting biological faults & 6-Axis organoleptic radar evaluation
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { SensoryRadarChart, SensoryProfile } from '../../src/components/SensoryRadarChart';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';

interface DefectItem {
  id: string;
  category: 'CHEESE' | 'VEG' | 'BEV';
  title: string;
  symptoms: string;
  cause: string;
  action: string;
  dangerLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
}

const DEFECTS: DefectItem[] = [
  {
    id: 'early_blowing',
    category: 'CHEESE',
    title: t('Wczesne Wzdęcia Sera (Early Blowing)'),
    symptoms: t('Gąbczasty ser, tysiące drobnych dziurek, krążek pęcznieje w 24–48h od sprasowania.'),
    cause: t('Skażenie pałeczkami Coli (E. coli) lub drożdżami gazotwórczymi wskutek braku higieny doju.'),
    action: t('Wyrzucić ser! Bezwzględnie wygotować formy, chusty i zdezynfekować kocioł. Nie spożywać.'),
    dangerLevel: 'CRITICAL',
  },
  {
    id: 'late_blowing',
    category: 'CHEESE',
    title: t('Późne Wzdęcia Sera (Late Blowing)'),
    symptoms: t('Wielkie, nieregularne pęknięcia i wybrzuszenia krążka po 3–8 tygodniach dojrzewania w piwnicy.'),
    cause: t('Przetrwalniki Clostridium tyrobutyricum z kiszonki dla krów wytwarzające kwas masłowy i gaz H2.'),
    action: t('Ser ma ostry, zjełczały zapach. Następnym razem stosuj wyłącznie mleko od krów karmionych sianem.'),
    dangerLevel: 'HIGH' as any,
  },
  {
    id: 'bitter_cheese',
    category: 'CHEESE',
    title: t('Gorzki Posmak Sera (Bitter Defect)'),
    symptoms: t('Nieprzyjemna gorycz w finiszu smakowym dojrzałego sera.'),
    cause: t('Nadmiar podpuszczki, zbyt niska zawartość soli w solance (<18%) lub zanieczyszczenie mleka bakteriami psychrotrofowymi.'),
    action: t('Zmniejsz dawkę enzymu o 20% i sprawdź gęstość solanki aerometrem. Dopilnuj szybkiego zakwaszenia.'),
    dangerLevel: 'MEDIUM',
  },
  {
    id: 'kahm_vs_mold',
    category: 'VEG',
    title: t('Kożuszek Fermentacyjny (Kahm) vs Prawdziwa Pleśń'),
    symptoms: t('Biały nalot na powierzchni kiszonki warzywnej.'),
    cause: t('Kożuszek Kahm to drożdże tlenowe (cienka, kredowa błona). Pleśń tworzy puszyste, wypukłe, zielone/czarne zarodnie.'),
    action: t('Kahm: zebrać wyparzoną łyżką, kiszonka jest zdatna. Pleśń puszysta: bezwzględnie wyrzucić cały słoik!'),
    dangerLevel: 'HIGH' as any,
  },
  {
    id: 'spoiled_vinegar',
    category: 'BEV',
    title: t('Zatruta Matka Octowa / Zepsuty Ocet'),
    symptoms: t('Brak kwaśnienia, zapach kleju lub acetonu, matka opada na dno i obumiera.'),
    cause: t('Cydr/wino miało >8.0% ABV (zatrucie etanolem) lub nastaw był szczelnie zamknięty bez dostępu tlenu.'),
    action: t('Rozcieńcz wsad wodą do 5–6% ABV i zapewnij stały dopływ powietrza przez gazę bawełnianą.'),
    dangerLevel: 'MEDIUM',
  },
];

export default function SchoolScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CHEESE' | 'VEG' | 'BEV'>('ALL');
  const [expandedDefectId, setExpandedDefectId] = useState<string | null>(null);

  // Interactive sensory profile state
  const [sensoryProfile, setSensoryProfile] = useState<SensoryProfile>({
    acidity: 6,
    salinity: 5,
    firmness: 7,
    creaminess: 8,
    pungency: 4,
    nuttiness: 6,
  });

  const filteredDefects = DEFECTS.filter((d) => {
    if (selectedCategory === 'ALL') return true;
    return d.category === selectedCategory;
  });

  const adjustSensory = (axis: keyof SensoryProfile, delta: number) => {
    triggerHapticFeedback();
    setSensoryProfile((prev) => ({
      ...prev,
      [axis]: Math.max(1, Math.min(10, prev[axis] + delta)),
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Baza Wiedzy & Doktor Wad')}</Text>
        <Text style={styles.headerSub}>{t('Rozpoznawanie patogenów, higiena i profil sensoryczny')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sensory Radar Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 {t('Radar Profilu Sensorycznego (6 Osi)')}</Text>
          <Text style={styles.cardDesc}>
            {t('Wizualizacja organoleptyczna: oceń kwasowość, słoność, kremowość i orzechowość partii.')}
          </Text>

          <SensoryRadarChart profile={sensoryProfile} size={280} />

          {/* Stepper controls for the 6 axes */}
          <View style={styles.axesGrid}>
            {[
              { key: 'acidity', label: t('Kwasowość') },
              { key: 'salinity', label: t('Słoność') },
              { key: 'firmness', label: t('Twardość') },
              { key: 'creaminess', label: t('Kremowość') },
              { key: 'pungency', label: t('Ostrość') },
              { key: 'nuttiness', label: t('Orzechowość') },
            ].map(({ key, label }) => {
              const val = sensoryProfile[key as keyof SensoryProfile];
              return (
                <View key={key} style={styles.axisControlRow}>
                  <Text style={styles.axisLabel}>{label}</Text>
                  <View style={styles.axisBtnRow}>
                    <TouchableOpacity
                      style={styles.axisBtn}
                      onPress={() => adjustSensory(key as keyof SensoryProfile, -1)}
                    >
                      <Text style={styles.axisBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.axisValText}>{val}</Text>
                    <TouchableOpacity
                      style={styles.axisBtn}
                      onPress={() => adjustSensory(key as keyof SensoryProfile, 1)}
                    >
                      <Text style={styles.axisBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Defect Doctor Section */}
        <Text style={styles.sectionHeader}>🩺 {t('Doktor Wad Fermentacyjnych')}</Text>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'CHEESE', 'VEG', 'BEV'] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterPill, selectedCategory === cat && styles.filterPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setSelectedCategory(cat);
              }}
            >
              <Text style={[styles.filterPillText, selectedCategory === cat && styles.filterPillTextActive]}>
                {cat === 'ALL'
                  ? t('Wszystkie')
                  : cat === 'CHEESE'
                  ? t('Sery')
                  : cat === 'VEG'
                  ? t('Kiszonki')
                  : t('Napoje')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Defects List */}
        {filteredDefects.map((d) => {
          const isExpanded = expandedDefectId === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              style={[styles.defectCard, d.dangerLevel === 'CRITICAL' && styles.cardDanger]}
              onPress={() => {
                triggerHapticFeedback();
                setExpandedDefectId(isExpanded ? null : d.id);
              }}
              accessibilityRole="button"
            >
              <View style={styles.defectHeader}>
                <Text style={styles.defectTitle}>{d.title}</Text>
                <Text style={styles.defectArrow}>{isExpanded ? '▲' : '▼'}</Text>
              </View>

              <Text style={styles.defectSymptoms}>
                <strong>{t('Objawy:')}</strong> {d.symptoms}
              </Text>

              {isExpanded && (
                <View style={styles.defectDetailsBox}>
                  <Text style={styles.defectCause}>
                    <strong>{t('Przyczyna:')}</strong> {d.cause}
                  </Text>
                  <Text style={styles.defectAction}>
                    <strong>{t('Działanie naprawcze:')}</strong> {d.action}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
  },
  headerSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#78716C',
    lineHeight: 18,
    marginBottom: 10,
  },
  axesGrid: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 12,
    gap: 8,
  },
  axisControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#44403C',
    flex: 1,
  },
  axisBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  axisBtn: {
    width: 44,
    height: 44, // comfortable touch target
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  axisBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
  },
  axisValText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
    width: 26,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F4',
    borderRadius: 18,
  },
  filterPillActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  filterPillTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  defectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 10,
  },
  cardDanger: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  defectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  defectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    flex: 1,
  },
  defectArrow: {
    fontSize: 12,
    color: '#78716C',
  },
  defectSymptoms: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 18,
  },
  defectDetailsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    gap: 6,
  },
  defectCause: {
    fontSize: 12,
    color: '#44403C',
    lineHeight: 18,
  },
  defectAction: {
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 18,
    fontWeight: '600',
  },
});
