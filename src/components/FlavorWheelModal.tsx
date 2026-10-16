// ============================================================================
// Apps4Brew Studio — FERMENT Flavor Wheel Modal ("Koło Smaków Mikrobiologicznych")
// Interactive sensory lexicon for artisanal cheeses, vegetable ferments, kombuchas and vinegars
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
  FLAVOR_CATEGORIES,
  FLAVOR_DESCRIPTORS,
  FlavorCategoryKey,
  FlavorDescriptor,
  searchDescriptors,
  calculateCategoryDistribution,
  formatDescriptorNotes,
} from '../core/flavor-wheel-data';

interface FlavorWheelModalProps {
  visible: boolean;
  onClose: () => void;
  initialSelectedIds?: string[];
  onApplyDescriptors?: (selectedIds: string[], formattedSnippet: string) => void;
}

export const FlavorWheelModal: React.FC<FlavorWheelModalProps> = ({
  visible,
  onClose,
  initialSelectedIds = [],
  onApplyDescriptors,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategoryKey | 'ALL'>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  if (!visible) return null;

  const toggleDescriptor = (id: string) => {
    triggerHapticFeedback();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    triggerHapticFeedback();
    if (onApplyDescriptors) {
      const snippet = formatDescriptorNotes(selectedIds);
      onApplyDescriptors(selectedIds, snippet);
    }
    onClose();
  };

  const handleClear = () => {
    triggerHapticFeedback();
    setSelectedIds([]);
  };

  // Filter descriptors
  let displayed = searchDescriptors(searchQuery);
  if (selectedCategory !== 'ALL') {
    displayed = displayed.filter((d) => d.category === selectedCategory);
  }

  const categoryDistribution = calculateCategoryDistribution(selectedIds);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>🎯 {t('Koło Smaków Mikrobiologicznych')}</Text>
            <Text style={styles.headerSub}>
              {t('Leksykon sensoryczny estrów, kwasów, laktonów i metabolitów dojrzałości')}
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

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('Szukaj aromatu, cząsteczki chemicznej, smaku...')}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Category Pills */}
        <View style={styles.categoryScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsList}
          >
            <TouchableOpacity
              style={[
                styles.categoryPill,
                selectedCategory === 'ALL' && styles.categoryPillActive,
              ]}
              onPress={() => {
                triggerHapticFeedback();
                setSelectedCategory('ALL');
              }}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === 'ALL' && styles.categoryPillTextActive,
                ]}
              >
                {t('Wszystkie')} ({FLAVOR_DESCRIPTORS.length})
              </Text>
            </TouchableOpacity>

            {FLAVOR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    isActive && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => {
                    triggerHapticFeedback();
                    setSelectedCategory(cat.id);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      isActive && { color: '#FFFFFF', fontWeight: '800' },
                    ]}
                  >
                    {cat.icon} {t(cat.label)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Active Selection Distribution Summary */}
        {selectedIds.length > 0 && (
          <View style={styles.distributionCard}>
            <View style={styles.distributionHeader}>
              <Text style={styles.distributionTitle}>
                {t('Zrównoważenie wektorów smakowych')} ({selectedIds.length})
              </Text>
              <TouchableOpacity onPress={handleClear} style={styles.clearMiniBtn}>
                <Text style={styles.clearMiniBtnText}>{t('Wyczyść')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.distributionPills}>
              {categoryDistribution
                .filter((d) => d.count > 0)
                .map((d) => {
                  const meta = FLAVOR_CATEGORIES.find((c) => c.id === d.category);
                  return (
                    <View
                      key={d.category}
                      style={[
                        styles.distributionBadge,
                        { backgroundColor: meta?.badgeBg, borderColor: meta?.badgeBorder },
                      ]}
                    >
                      <Text style={[styles.distributionBadgeText, { color: meta?.color }]}>
                        {meta?.icon} {t(d.label)}: {d.count} ({d.percentage}%)
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Descriptors List */}
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {displayed.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>{t('Brak pasujących deskryptorów')}</Text>
              <Text style={styles.emptySub}>
                {t('Spróbuj wpisać inną frazę lub zresetować filtry kategorii.')}
              </Text>
            </View>
          ) : (
            displayed.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const meta = FLAVOR_CATEGORIES.find((c) => c.id === item.category);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isSelected && styles.itemCardSelected,
                    { borderLeftColor: meta?.color || '#0284C7' },
                  ]}
                  onPress={() => toggleDescriptor(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemHeaderLeft}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: meta?.badgeBg, borderColor: meta?.badgeBorder },
                        ]}
                      >
                        <Text style={[styles.categoryBadgeText, { color: meta?.color }]}>
                          {meta?.icon} {t(item.subcategory)}
                        </Text>
                      </View>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && { backgroundColor: meta?.color || '#16A34A', borderColor: meta?.color || '#16A34A' },
                      ]}
                    >
                      {isSelected && <Text style={styles.checkboxCheck}>✓</Text>}
                    </View>
                  </View>

                  <Text style={styles.itemDesc}>{item.description}</Text>

                  <View style={styles.chemicalRow}>
                    <Text style={styles.chemicalLabel}>🔬 {t('Pochodzenie chemiczne:')}</Text>
                    <Text style={styles.chemicalValue}>{item.chemicalOrigin}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Actions Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarInfo}>
            <Text style={styles.bottomBarCount}>
              {t('Wybrano:')} {selectedIds.length} {t('deskryptorów')}
            </Text>
            <Text style={styles.bottomBarSub}>
              {selectedIds.length === 0
                ? t('Zaznacz nuty smakowe wyczuwalne w partii')
                : t('Gotowe do wklejenia w notatki degustacyjne')}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.applyBtn,
              selectedIds.length === 0 && styles.applyBtnDisabled,
            ]}
            onPress={handleApply}
            disabled={selectedIds.length === 0}
            accessibilityRole="button"
          >
            <Text style={styles.applyBtnText}>
              ✓ {t('Zastosuj do Notatek')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    marginLeft: 8,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryPillsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  categoryPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  distributionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  clearMiniBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearMiniBtnText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  distributionPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  distributionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  distributionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 32,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    minHeight: 56,
  },
  itemCardSelected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  itemDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  chemicalRow: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  chemicalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  chemicalValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomBarSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  applyBtn: {
    backgroundColor: '#16A34A',
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
