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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { SensoryRadarChart, SensoryProfile } from '../../src/components/SensoryRadarChart';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';
import {
  EMERGENCY_PROTOCOLS,
  getEmergencyRescueProtocol,
  EmergencyRescueProtocol,
  EmergencyCaseId,
} from '../../src/core/emergency-recovery';
import {
  calculateDechlorination,
  analyzeWaterHardnessForFerment,
} from '../../src/core/water-chemistry';
import {
  FLAVOR_CATEGORIES,
  FLAVOR_DESCRIPTORS,
  FlavorDescriptor,
} from '../../src/core/flavor-wheel-data';

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

  // SOR Triage State
  const [selectedTriageId, setSelectedTriageId] = useState<EmergencyCaseId>('WEAK_CURD_NO_SET');

  // Water Chemistry State
  const [waterVolumeLiters, setWaterVolumeLiters] = useState<number>(10);
  const [isChloramine, setIsChloramine] = useState<boolean>(true);
  const [calciumPpm, setCalciumPpm] = useState<number>(75);
  const [magnesiumPpm, setMagnesiumPpm] = useState<number>(15);

  // Flavor Wheel State
  const [selectedFlavorCatId, setSelectedFlavorCatId] = useState<string>('LACTIC');

  // Interactive sensory profile state
  const [sensoryProfile, setSensoryProfile] = useState<SensoryProfile>({
    acidity: 6,
    salinity: 5,
    firmness: 7,
    creaminess: 8,
    pungency: 4,
    nuttiness: 6,
  });

  const activeTriage: EmergencyRescueProtocol = EMERGENCY_PROTOCOLS[selectedTriageId];
  const dechlorCalc = calculateDechlorination(waterVolumeLiters, isChloramine);
  const hardnessAnalysis = analyzeWaterHardnessForFerment(calciumPpm, magnesiumPpm);
  const activeDescriptors = FLAVOR_DESCRIPTORS.filter((d) => d.category === selectedFlavorCatId);

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

        {/* Emergency Rescue Triage (SOR Ratunkowy) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚨 {t('SOR Ratunkowy Fermentacji (Triage Awaryjny)')}</Text>
          <Text style={styles.cardDesc}>
            {t('Natychmiastowe protokoły ratunkowe dla krytycznych usterek biologicznych')}
          </Text>

          <Text style={styles.inputLabelMini}>{t('Wybierz zaistniałą awarię:')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.triageScroll}>
            {(Object.keys(EMERGENCY_PROTOCOLS) as EmergencyCaseId[]).map((id) => {
              const p = EMERGENCY_PROTOCOLS[id];
              const isSel = p.id === selectedTriageId;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.triagePill,
                    isSel && styles.triagePillActive,
                    p.isDiscardMandatory && styles.triagePillFatal,
                  ]}
                  onPress={() => {
                    triggerHapticFeedback();
                    setSelectedTriageId(p.id);
                  }}
                >
                  <Text style={[styles.triagePillText, isSel && styles.triagePillTextActive]}>
                    {p.title.split('(')[0].trim()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {activeTriage && (
            <View
              style={[
                styles.triageCard,
                activeTriage.isDiscardMandatory && styles.triageCardFatal,
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.triageTitle}>{activeTriage.title}</Text>
                <View
                  style={[
                    styles.urgencyBadge,
                    activeTriage.severity === 'FATAL_DISCARD'
                      ? styles.urgencyFatal
                      : activeTriage.severity === 'CRITICAL'
                      ? styles.urgencyCritical
                      : styles.urgencyCaution,
                  ]}
                >
                  <Text style={styles.urgencyBadgeText}>{activeTriage.severity}</Text>
                </View>
              </View>

              <View style={styles.salvageBox}>
                <Text style={styles.salvageLabel}>{t('Czy partię można uratować?')}</Text>
                <Text
                  style={[
                    styles.salvageValue,
                    activeTriage.isDiscardMandatory ? styles.salvageNo : styles.salvageYes,
                  ]}
                >
                  {activeTriage.isDiscardMandatory
                    ? t('NIE — BEZWZGLĘDNIE WYRZUĆ!')
                    : t('TAK (Postępuj wg protokołu)')}
                </Text>
              </View>

              <Text style={styles.triageSectionHeader}>{t('Główna przyczyna:')}</Text>
              <Text style={styles.triageText}>{activeTriage.rootCause}</Text>

              <Text style={styles.triageSectionHeader}>{t('Objawy:')}</Text>
              <Text style={styles.triageText}>{activeTriage.symptoms}</Text>

              <Text style={styles.triageSectionHeader}>{t('Natychmiastowe działania ratunkowe:')}</Text>
              {activeTriage.stepByStepRescue.map((step, idx) => (
                <View key={idx} style={styles.rescueStepRow}>
                  <Text style={styles.rescueStepNum}>{idx + 1}.</Text>
                  <Text style={styles.rescueStepText}>{step.replace(/^\d+\.\s*/, '')}</Text>
                </View>
              ))}

              <Text style={styles.triageAdvice}>💡 {activeTriage.preventiveAdvice}</Text>
            </View>
          )}
        </View>

        {/* Water Chemistry & Chloramine Neutralization */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💧 {t('Chemia Wody & Neutralizacja Chloraminy')}</Text>
          <Text style={styles.cardDesc}>
            {t('Precyzyjne usuwanie dezynfektantów wodociągowych niszczących bakterie kwasu mlekowego')}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Objętość wody (L):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(waterVolumeLiters)}
              onChangeText={(v) => setWaterVolumeLiters(parseFloat(v) || 1)}
            />
          </View>

          <Text style={styles.inputLabelMini}>{t('Typ środka w kranie:')}</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterPill, isChloramine && styles.filterPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setIsChloramine(true);
              }}
            >
              <Text style={[styles.filterPillText, isChloramine && styles.filterPillTextActive]}>
                {t('Chloramina (NH2Cl)')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, !isChloramine && styles.filterPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setIsChloramine(false);
              }}
            >
              <Text style={[styles.filterPillText, !isChloramine && styles.filterPillTextActive]}>
                {t('Chlor (Cl2)')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.waterResultBox}>
            <Text style={styles.waterResultTitle}>{t('Odchlorowanie / Neutralizacja:')}</Text>
            <Text style={styles.waterResultLine}>
              • {t('Witamina C (kwas L-askorbinowy):')}{' '}
              <Text style={styles.boldText}>{dechlorCalc.vitaminCMgNeededForChloramine} mg</Text> ({(dechlorCalc.vitaminCMgNeededForChloramine / 1000).toFixed(3)} g)
            </Text>
            <Text style={styles.waterResultLine}>
              • {t('Czas odparowania wolnego chloru:')}{' '}
              <Text style={styles.boldText}>{dechlorCalc.freeChlorineDegassingHours}h</Text> ({t('min wrzenia')}: {dechlorCalc.boilingMinutesNeeded} min)
            </Text>
            <Text style={styles.waterResultDesc}>💡 {dechlorCalc.recommendation}</Text>
          </View>

          <Text style={styles.waterResultTitle}>{t('Twardość całkowita i bufor:')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Wapń Ca (ppm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(calciumPpm)}
              onChangeText={(v) => setCalciumPpm(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.inlineLabel}>{t('Magnez Mg (ppm):')}</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={String(magnesiumPpm)}
              onChangeText={(v) => setMagnesiumPpm(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.hardnessResultBox}>
            <Text style={styles.hardnessLine}>
              • dGH: <Text style={styles.boldText}>{hardnessAnalysis.dGhTotalHardness}°d</Text> | dKH: <Text style={styles.boldText}>{hardnessAnalysis.dKhAlkalinity}°d</Text>
            </Text>
            <Text style={styles.hardnessLine}>
              • {t('Przydatność dla sera:')} <Text style={styles.boldText}>{hardnessAnalysis.suitabilityForCheese}</Text>
            </Text>
            <Text style={styles.hardnessLine}>
              • {t('Przydatność dla kombuchy/kiszonek:')} <Text style={styles.boldText}>{hardnessAnalysis.suitabilityForKombuchaAndVeg}</Text>
            </Text>
            <Text style={styles.hardnessDesc}>💡 {hardnessAnalysis.notes}</Text>
          </View>
        </View>

        {/* Microbiological Flavor Wheel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌸 {t('Koło Aromatów Mikrobiologicznych')}</Text>
          <Text style={styles.cardDesc}>
            {t('Przeglądaj deskryptory organoleptyczne i ich biochemiczne źródło')}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.triageScroll}>
            {FLAVOR_CATEGORIES.map((cat) => {
              const isSel = cat.id === selectedFlavorCatId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.flavorCatPill, isSel && styles.flavorCatPillActive]}
                  onPress={() => {
                    triggerHapticFeedback();
                    setSelectedFlavorCatId(cat.id);
                  }}
                >
                  <Text style={[styles.flavorCatText, isSel && styles.flavorCatTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {activeDescriptors.map((desc) => (
            <View key={desc.id} style={styles.flavorCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.flavorTitle}>{desc.label}</Text>
                <Text style={styles.flavorSubcat}>{desc.subcategory}</Text>
              </View>
              <Text style={styles.flavorDesc}>{desc.description}</Text>
              <Text style={styles.flavorChem}>
                ⚗️ {t('Związek chemiczny:')} <Text style={styles.boldText}>{desc.chemicalOrigin}</Text>
              </Text>
            </View>
          ))}
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
                <Text style={styles.boldText}>{t('Objawy:')}</Text> {d.symptoms}
              </Text>

              {isExpanded && (
                <View style={styles.defectDetailsBox}>
                  <Text style={styles.defectCause}>
                    <Text style={styles.boldText}>{t('Przyczyna:')}</Text> {d.cause}
                  </Text>
                  <Text style={styles.defectAction}>
                    <Text style={styles.boldText}>{t('Działanie naprawcze:')}</Text> {d.action}
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inlineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#44403C',
  },
  numInput: {
    width: 90,
    height: 40,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    textAlign: 'right',
  },
  boldText: {
    fontWeight: '800',
  },
  inputLabelMini: {
    fontSize: 12,
    fontWeight: '700',
    color: '#57534E',
    marginTop: 6,
    marginBottom: 6,
  },
  triageScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  triagePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  triagePillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#B45309',
  },
  triagePillFatal: {
    borderColor: '#EF4444',
  },
  triagePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  triagePillTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  triageCard: {
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 6,
  },
  triageCardFatal: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  triageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1917',
    flex: 1,
    marginRight: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyFatal: {
    backgroundColor: '#DC2626',
  },
  urgencyCritical: {
    backgroundColor: '#EA580C',
  },
  urgencyCaution: {
    backgroundColor: '#D97706',
  },
  urgencyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  salvageBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  salvageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  salvageValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  salvageYes: {
    color: '#15803D',
  },
  salvageNo: {
    color: '#DC2626',
  },
  triageSectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#44403C',
    marginTop: 8,
    marginBottom: 2,
  },
  triageText: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 18,
  },
  rescueStepRow: {
    flexDirection: 'row',
    marginTop: 4,
    paddingLeft: 4,
  },
  rescueStepNum: {
    width: 20,
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  rescueStepText: {
    flex: 1,
    fontSize: 12,
    color: '#1C1917',
    lineHeight: 18,
  },
  triageAdvice: {
    fontSize: 11,
    color: '#78350F',
    fontStyle: 'italic',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  waterResultBox: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  waterResultTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 6,
  },
  waterResultLine: {
    fontSize: 12,
    color: '#0C4A6E',
    marginBottom: 4,
  },
  waterResultDesc: {
    fontSize: 11,
    color: '#075985',
    marginTop: 4,
    fontStyle: 'italic',
  },
  hardnessResultBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hardnessLine: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 3,
  },
  hardnessDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
    fontStyle: 'italic',
  },
  flavorCatPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#F5F5F4',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  flavorCatPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#B45309',
  },
  flavorCatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  flavorCatTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  flavorCard: {
    backgroundColor: '#FAFAF9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  flavorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    flex: 1,
  },
  flavorSubcat: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '600',
  },
  flavorDesc: {
    fontSize: 12,
    color: '#44403C',
    lineHeight: 17,
    marginTop: 3,
  },
  flavorChem: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 4,
    fontWeight: '600',
  },
});
