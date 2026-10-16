// ============================================================================
// Apps4Brew Studio — FERMENT Fermentation Doctor Modal ("Doktor Fermentacji")
// Interactive defect symptom checker, microbiological diagnosis & safety rescue
// ============================================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { t } from '../lib/i18n';
import { triggerHapticFeedback } from '../lib/timer-audio';
import {
  diagnoseFermentDefect,
  FermentationDefect,
  DefectCategory,
  DefectSafetyVerdict,
} from '../core/fermentation-diagnostics';

interface FermentationDoctorModalProps {
  visible: boolean;
  onClose: () => void;
  initialCategory?: DefectCategory;
}

export const FermentationDoctorModal: React.FC<FermentationDoctorModalProps> = ({
  visible,
  onClose,
  initialCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DefectCategory | 'ALL'>(
    initialCategory || 'ALL'
  );
  const [expandedDefectId, setExpandedDefectId] = useState<string | null>(null);

  if (!visible) return null;

  const categoryFilter = selectedCategory === 'ALL' ? undefined : selectedCategory;
  const matchedDefects = diagnoseFermentDefect(searchQuery, categoryFilter);

  const getVerdictBadge = (verdict: DefectSafetyVerdict) => {
    switch (verdict) {
      case 'BIOHAZARD_DISCARD':
        return {
          label: t('☠️ UTYLIZACJA (Zagrożenie Toksynami)'),
          bg: '#FEF2F2',
          border: '#F87171',
          text: '#991B1B',
        };
      case 'REPAIRABLE_RISK':
        return {
          label: t('⚠️ RYZYKO NAPRAWIALNE (Wymaga Ratunku)'),
          bg: '#FFFBEB',
          border: '#FCD34D',
          text: '#92400E',
        };
      case 'COSMETIC_FLAW':
        return {
          label: t('ℹ️ WADA KOSMETYCZNA (Po oczyszczeniu bezpieczny)'),
          bg: '#EFF6FF',
          border: '#93C5FD',
          text: '#1E40AF',
        };
      case 'SAFE_EDIBLE':
        return {
          label: t('✅ ZDATNE DO SPOŻYCIA (Wada smakowa)'),
          bg: '#F0FDF4',
          border: '#86EFAC',
          text: '#166534',
        };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>🩺 {t('Doktor Fermentacji')}</Text>
            <Text style={styles.headerSub}>
              {t('Diagnostyka wad mikrobiologicznych, triage bezpieczeństwa & ratunek partii')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              triggerHapticFeedback();
              onClose();
            }}
            accessibilityRole="button"
            accessibilityLabel={t('Zamknij')}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Wpisz objaw (np. gąbka, pleśń, gorzki, kahm, smród)...')}
            placeholderTextColor="#A8A29E"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Category Pills */}
        <View style={styles.filterRow}>
          {[
            { id: 'ALL' as const, label: t('Wszystkie') },
            { id: 'CHEESE' as const, label: t('Sery') },
            { id: 'VEG_FERMENT' as const, label: t('Kiszonki') },
            { id: 'KOMBUCHA' as const, label: t('Kombucha') },
            { id: 'VINEGAR' as const, label: t('Octy') },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterPill, selectedCategory === cat.id && styles.filterPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setSelectedCategory(cat.id);
              }}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCategory === cat.id && styles.filterPillTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Defect Cards List */}
        <ScrollView contentContainerStyle={styles.scrollList}>
          {matchedDefects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>{t('Nie znaleziono pasujących wad')}</Text>
              <Text style={styles.emptyText}>
                {t('Spróbuj wyszukać po innym słowie kluczowym lub zmień filtr rzemiosła.')}
              </Text>
            </View>
          ) : (
            matchedDefects.map((defect) => {
              const badge = getVerdictBadge(defect.safetyVerdict);
              const isExpanded = expandedDefectId === defect.id;

              return (
                <View key={defect.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardHeader}
                    onPress={() => {
                      triggerHapticFeedback();
                      setExpandedDefectId(isExpanded ? null : defect.id);
                    }}
                    accessibilityRole="button"
                  >
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.cardTitle}>{defect.name}</Text>
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: badge.bg, borderColor: badge.border },
                        ]}
                      >
                        <Text style={[styles.badgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {/* Summary Symptoms */}
                  <View style={styles.symptomsBox}>
                    <Text style={styles.symptomLine}>
                      👁️ <Text style={styles.symptomBold}>{t('Wygląd:')}</Text> {defect.visualDescription}
                    </Text>
                    <Text style={styles.symptomLine}>
                      👃 <Text style={styles.symptomBold}>{t('Aromat:')}</Text> {defect.aromaDescription}
                    </Text>
                  </View>

                  {/* Expanded Step-by-Step Rescue & Cause */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.causeBox}>
                        <Text style={styles.causeTitle}>🔬 {t('Przyczyna Mikrobiologiczna / Biochemiczna:')}</Text>
                        <Text style={styles.causeText}>{defect.rootCauseMicrobiology}</Text>
                      </View>

                      <View style={styles.remedyBox}>
                        <Text style={styles.remedyTitle}>🛠️ {t('Plan Działań Naprawczych (Krok po Kroku):')}</Text>
                        {defect.stepByStepRemedy.map((step, idx) => (
                          <Text key={idx} style={styles.stepItem}>
                            {step}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.preventBox}>
                        <Text style={styles.preventTitle}>🛡️ {t('Profilaktyka dla Kolejnych Partii:')}</Text>
                        {defect.preventiveMeasures.map((prev, idx) => (
                          <Text key={idx} style={styles.preventItem}>
                            • {prev}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  headerSub: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  closeBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#57534E',
  },
  searchBox: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#FAF8F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1C1917',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#78350F',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78716C',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  emptyText: {
    fontSize: 12,
    color: '#78716C',
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  expandIcon: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: '700',
    marginTop: 4,
  },
  symptomsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    gap: 4,
  },
  symptomLine: {
    fontSize: 12,
    color: '#44403C',
    lineHeight: 17,
  },
  symptomBold: {
    fontWeight: '700',
    color: '#1C1917',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    gap: 10,
  },
  causeBox: {
    backgroundColor: '#FAF8F5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  causeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 4,
  },
  causeText: {
    fontSize: 11,
    color: '#44403C',
    lineHeight: 16,
  },
  remedyBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  remedyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  stepItem: {
    fontSize: 11,
    color: '#14532D',
    lineHeight: 16,
  },
  preventBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 3,
  },
  preventTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 2,
  },
  preventItem: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 15,
  },
});
