// ============================================================================
// Apps4Brew Studio — FERMENT Offline QR Scanner Modal
// Quick batch lookup via Camera barcode scanning or manual fallback
// ============================================================================

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { t } from '../lib/i18n';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (batchId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  onScanSuccess,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  if (!visible) return null;

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false);

    try {
      // Check if data is JSON payload or plain batch ID
      const parsed = JSON.parse(data);
      if (parsed.id) {
        onScanSuccess(parsed.id);
        onClose();
        return;
      }
      if (parsed.batch) {
        onScanSuccess(parsed.batch);
        onClose();
        return;
      }
    } catch {
      // Plain text batch code
      onScanSuccess(data);
      onClose();
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('Skanuj Kod Partii')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('Zamknij')}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {!permission || !permission.granted ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              {t('Aplikacja potrzebuje dostępu do aparatu, aby skanować kody QR z krążków sera i słoików.')}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={requestPermission}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{t('Zezwól na aparat')}</Text>
            </TouchableOpacity>

            <View style={styles.manualFallback}>
              <Text style={styles.manualLabel}>{t('Lub wpisz numer partii ręcznie:')}</Text>
              <TextInput
                style={styles.input}
                placeholder="np. BATCH-2026-001"
                placeholderTextColor="#A8A29E"
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleManualSubmit}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>{t('Znajdź partię')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            >
              <View style={styles.overlay}>
                <View style={styles.viewfinder} />
                <Text style={styles.instructionText}>
                  {t('Skieruj obiektyw na kod QR etykiety')}
                </Text>
              </View>
            </CameraView>

            <View style={styles.manualFallbackBottom}>
              <TextInput
                style={styles.input}
                placeholder={t('Wpisz kod partii ręcznie...')}
                placeholderTextColor="#A8A29E"
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleManualSubmit}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>{t('Szukaj')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE', // Linen
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E5E4',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1917',
  },
  closeButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 22,
    color: '#78716C',
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#44403C',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  cameraWrapper: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: '#FACC15',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  instructionText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  manualFallback: {
    width: '100%',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
  },
  manualFallbackBottom: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
  },
  manualLabel: {
    fontSize: 14,
    color: '#78716C',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6D3D1',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C1917',
    marginBottom: 12,
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#78350F', // Warm amber / brown
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    backgroundColor: '#E7E5E4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#1C1917',
    fontSize: 16,
    fontWeight: '600',
  },
});
