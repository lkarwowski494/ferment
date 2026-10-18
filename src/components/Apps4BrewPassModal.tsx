import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAppAccess, SubscriptionTier } from '../lib/app-access';
import { t } from '../lib/i18n';

interface Apps4BrewPassModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: (tier: 'monthly' | 'yearly' | 'lifetime') => Promise<void>;
  onRestore?: () => Promise<{ restored: boolean; tier?: SubscriptionTier } | void>;
}

export const Apps4BrewPassModal: React.FC<Apps4BrewPassModalProps> = ({
  visible,
  onClose,
  onSubscribe,
  onRestore,
}) => {
  const { access, subscribe, restorePurchases } = useAppAccess();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('yearly');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async () => {
    if (selectedTier === 'none') return;
    setLoading(true);
    try {
      await subscribe(selectedTier);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const result = await restorePurchases();
      if (result.restored) {
        Alert.alert(
          t('Apps4Brew Pass'),
          t('Zakup został pomyślnie przywrócony!')
        );
        onClose();
      } else {
        Alert.alert(
          t('Apps4Brew Pass'),
          t('Nie znaleziono zapisanego zakupu w bazie urządzenia.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel={t('Zamknij')}
            >
              <Text style={styles.closeButtonText}>{t('Zamknij')}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('Apps4Brew Pass')}</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.heroBadge}>🧀 🥬 🫖 FERMENT</Text>
            <Text style={styles.heroTitle}>{t('Odblokuj Pełną Twórczość')}</Text>
            <Text style={styles.heroDesc}>
              {access.status === 'trial_expired'
                ? t('Okres próbny wygasł. Twoje dane i historia partii pozostają w pełni dostępne (Read-Only).')
                : t('14-dniowy okres próbny jest aktywny. Wszystkie funkcje są w 100% odblokowane.')}
            </Text>

            {/* Pricing Options */}
            <View style={styles.optionsList}>
              {/* Option 1: Monthly */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'monthly' && styles.tierCardSelected,
                ]}
                onPress={() => setSelectedTier('monthly')}
                accessibilityRole="radio"
              >
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>{t('Miesięczny')}</Text>
                  <Text style={styles.tierSub}>
                    {t('3,99 zł / mies.')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedTier === 'monthly' && styles.radioCircleSelected,
                  ]}
                />
              </TouchableOpacity>

              {/* Option 2: Yearly (Recommended) */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'yearly' && styles.tierCardSelected,
                ]}
                onPress={() => setSelectedTier('yearly')}
                accessibilityRole="radio"
              >
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>NAJLEPSZY WYBÓR</Text>
                </View>
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>{t('Roczny')}</Text>
                  <Text style={styles.tierSub}>
                    {t('19,99 zł / rok')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedTier === 'yearly' && styles.radioCircleSelected,
                  ]}
                />
              </TouchableOpacity>

              {/* Option 3: Lifetime */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'lifetime' && styles.tierCardSelected,
                ]}
                onPress={() => setSelectedTier('lifetime')}
                accessibilityRole="radio"
              >
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>{t('Dożywotni')}</Text>
                  <Text style={styles.tierSub}>
                    {t('59,99 zł raz na zawsze')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedTier === 'lifetime' && styles.radioCircleSelected,
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.subscribeButtonText}>{t('Subskrybuj')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={loading}
              accessibilityRole="button"
            >
              <Text style={styles.restoreButtonText}>{t('Przywróć zakup')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1C1917',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#292524',
  },
  headerTitle: {
    color: '#F5F5F4',
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#D97706',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  heroBadge: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FAFAF9',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroDesc: {
    color: '#A8A29E',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  optionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: '#292524',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: '#D97706',
    backgroundColor: '#342F2C',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    color: '#FAFAF9',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  tierSub: {
    color: '#D6D3D1',
    fontSize: 14,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#78716C',
  },
  radioCircleSelected: {
    borderColor: '#D97706',
    backgroundColor: '#D97706',
  },
  subscribeButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#D97706',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  restoreButtonText: {
    color: '#A8A29E',
    fontSize: 14,
    fontWeight: '500',
  },
});
