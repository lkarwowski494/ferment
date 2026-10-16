// ============================================================================
// Apps4Brew Studio — FERMENT Pantry Inventory, Yield & A4 Label Printing
// Stock management, unit cost accounting, cheese yield & printable sticker sheets
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { t } from '../../src/lib/i18n';
import { useAppAccess } from '../../src/lib/app-access';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { getSqliteStore, PantryItem } from '../../src/data/sqlite-store';
import { createAutoBackup } from '../../src/lib/backup';
import { calculateBatchYieldAndEconomics } from '../../src/core/inventory';
import { printLabelSheet, shareLabelSheetPdf, LabelItem } from '../../src/lib/pdf-sheet-generator';
import { triggerHapticFeedback } from '../../src/lib/timer-audio';

export default function PantryScreen() {
  const {
    isPaywallVisible,
    setPaywallVisible,
    requireActionAccess,
    subscribe,
    restorePurchases,
  } = useAppAccess();

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  // New item inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PantryItem['category']>('MILK');
  const [newItemQuantity, setNewItemQuantity] = useState('10');
  const [newItemUnit, setNewItemUnit] = useState('L');
  const [newItemCost, setNewItemCost] = useState('3.50');

  // Yield calculator inputs
  const [calcMilkLiters, setCalcMilkLiters] = useState<number>(20);
  const [calcCheeseKg, setCalcCheeseKg] = useState<number>(2.1);
  const [calcBatchCost, setCalcBatchCost] = useState<number>(75);

  const loadPantry = useCallback(async () => {
    const store = getSqliteStore();
    const items = await store.getPantryItems();
    setPantryItems(items);
  }, []);

  useEffect(() => {
    loadPantry();
  }, [loadPantry]);

  const yieldCalc = calculateBatchYieldAndEconomics(calcBatchCost, calcMilkLiters, calcCheeseKg);

  const handleSaveNewItem = () => {
    requireActionAccess(async () => {
      if (!newItemName.trim()) {
        Alert.alert(t('Błąd'), t('Wpisz nazwę składnika.'));
        return;
      }

      triggerHapticFeedback();
      const store = getSqliteStore();
      const newItem: PantryItem = {
        id: `pantry_${Date.now()}`,
        itemName: newItemName.trim(),
        category: newItemCategory,
        quantityAvailable: parseFloat(newItemQuantity) || 0,
        unit: newItemUnit.trim() || 'g',
        costPerUnitPln: parseFloat(newItemCost) || 0,
      };

      await store.savePantryItem(newItem);
      await createAutoBackup();
      await loadPantry();

      setIsAddModalVisible(false);
      setNewItemName('');
      Alert.alert(t('Składnik Dodany!'), `${newItem.itemName} (${newItem.quantityAvailable} ${newItem.unit})`);
    });
  };

  const handlePrintLabels = () => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const batches = await store.getBatches();

      if (batches.length === 0) {
        Alert.alert(
          t('Brak Partii'),
          t('Najpierw utwórz co najmniej jedną partię, aby wygenerować arkusz etykiet z kodami QR.')
        );
        return;
      }

      const labels: LabelItem[] = batches.slice(0, 8).map((b) => ({
        id: b.id,
        batchNumber: b.batchNumber,
        name: b.styleName,
        category: b.category === 'CHEESE' ? 'cheese' : b.category === 'KOMBUCHA' ? 'beverage' : 'vegetable',
        dateCreated: new Date(b.createdAt).toISOString(),
        safetyDetails: 'pH < 4.60 [ZABEZPIECZONY]',
        caveLocation: 'Półka A-1',
      }));

      await printLabelSheet(labels);
    });
  };

  const handleSharePdf = () => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const store = getSqliteStore();
      const batches = await store.getBatches();

      if (batches.length === 0) {
        Alert.alert(
          t('Brak Partii'),
          t('Najpierw utwórz co najmniej jedną partię, aby wygenerować etykiety.')
        );
        return;
      }

      const labels: LabelItem[] = batches.slice(0, 8).map((b) => ({
        id: b.id,
        batchNumber: b.batchNumber,
        name: b.styleName,
        category: b.category === 'CHEESE' ? 'cheese' : b.category === 'KOMBUCHA' ? 'beverage' : 'vegetable',
        dateCreated: new Date(b.createdAt).toISOString(),
        safetyDetails: 'pH < 4.60 [ZABEZPIECZONY]',
        caveLocation: 'Półka A-1',
      }));

      await shareLabelSheetPdf(labels);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('Spiżarnia & Ekonomika')}</Text>
          <Text style={styles.headerSub}>
            {pantryItems.length} {t('składników na stanie')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            triggerHapticFeedback();
            setIsAddModalVisible(true);
          }}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>+ {t('Dodaj')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Printable Label Sheet Actions */}
        <View style={styles.labelActionsBox}>
          <Text style={styles.labelActionsTitle}>🖨️ {t('Drukowanie Arkusza Etykiet A4')}</Text>
          <Text style={styles.labelActionsDesc}>
            {t('Generuj wektorowe kody QR na krążki sera i słoiki fermentacyjne (siatka 2x4).')}
          </Text>
          <View style={styles.actionBtnRow}>
            <TouchableOpacity style={styles.printBtn} onPress={handlePrintLabels}>
              <Text style={styles.printBtnText}>📄 {t('Drukuj A4 (AirPrint)')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleSharePdf}>
              <Text style={styles.shareBtnText}>📤 {t('PDF / Udostępnij')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Item Inline Panel */}
        {isAddModalVisible && (
          <View style={styles.addPanel}>
            <Text style={styles.addPanelTitle}>{t('Nowy Składnik w Spiżarni')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('Nazwa (np. Podpuszczka chymozyna 200 IMCU)')}
              placeholderTextColor="#A8A29E"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <View style={styles.categoryPickerRow}>
              {(['MILK', 'RENNET', 'CULTURE', 'SALT', 'MINERAL', 'TEA', 'SUGAR'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, newItemCategory === cat && styles.catPillActive]}
                  onPress={() => setNewItemCategory(cat)}
                >
                  <Text style={[styles.catPillText, newItemCategory === cat && styles.catPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rowBetween}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder={t('Ilość (np. 500)')}
                keyboardType="numeric"
                value={newItemQuantity}
                onChangeText={setNewItemQuantity}
              />
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder={t('Jednostka (g, ml, L)')}
                value={newItemUnit}
                onChangeText={setNewItemUnit}
              />
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder={t('Cena jedn. PLN')}
                keyboardType="numeric"
                value={newItemCost}
                onChangeText={setNewItemCost}
              />
            </View>

            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>{t('Anuluj')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveNewItem}
              >
                <Text style={styles.saveBtnText}>{t('Zapisz Składnik')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Inventory List */}
        <Text style={styles.sectionTitle}>{t('Stan Magazynowy')}</Text>
        {pantryItems.map((item) => (
          <View key={item.id} style={styles.pantryCard}>
            <View style={styles.pantryCardHeader}>
              <Text style={styles.pantryName}>{item.itemName}</Text>
              <View style={styles.pantryCatBadge}>
                <Text style={styles.pantryCatText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.pantryCardFooter}>
              <Text style={styles.pantryQty}>
                {item.quantityAvailable} {item.unit}
              </Text>
              {item.costPerUnitPln !== undefined && (
                <Text style={styles.pantryCost}>
                  {item.costPerUnitPln.toFixed(2)} PLN / {item.unit}
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* Yield & Economics Calculator */}
        <View style={styles.yieldCard}>
          <Text style={styles.yieldTitle}>🧀 {t('Kalkulator Wydajności i Kosztu Sera')}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.yieldLabel}>{t('Mleko (L):')}</Text>
            <TextInput
              style={styles.yieldInput}
              keyboardType="numeric"
              value={String(calcMilkLiters)}
              onChangeText={(v) => setCalcMilkLiters(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.yieldLabel}>{t('Uzyskany ser (kg):')}</Text>
            <TextInput
              style={styles.yieldInput}
              keyboardType="numeric"
              value={String(calcCheeseKg)}
              onChangeText={(v) => setCalcCheeseKg(parseFloat(v) || 0)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.yieldLabel}>{t('Całkowity koszt składników (PLN):')}</Text>
            <TextInput
              style={styles.yieldInput}
              keyboardType="numeric"
              value={String(calcBatchCost)}
              onChangeText={(v) => setCalcBatchCost(parseFloat(v) || 0)}
            />
          </View>

          <View style={styles.yieldResultBox}>
            <Text style={styles.yieldResultHighlight}>
              {t('Wydajność:')} {yieldCalc.yieldPercentage}% | {yieldCalc.costPerKgOrLiter.toFixed(2)} PLN / kg
            </Text>
            <Text style={styles.yieldComment}>{yieldCalc.comment}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Apps4Brew Paywall Modal */}
      <Apps4BrewPassModal
        visible={isPaywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSubscribe={subscribe}
        onRestore={restorePurchases}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    height: 48,
    paddingHorizontal: 18,
    backgroundColor: '#78350F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  labelActionsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 16,
  },
  labelActionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  labelActionsDesc: {
    fontSize: 12,
    color: '#78716C',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  printBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#78350F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  shareBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#E7E5E4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    color: '#1C1917',
    fontSize: 13,
    fontWeight: '600',
  },
  addPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    marginBottom: 16,
  },
  addPanelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 12,
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1C1917',
    marginBottom: 10,
  },
  flexInput: {
    flex: 1,
    marginHorizontal: 3,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  catPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F4',
    borderRadius: 6,
  },
  catPillActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  catPillTextActive: {
    color: '#B45309',
    fontWeight: '700',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cancelBtnText: {
    color: '#78716C',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#78350F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 8,
  },
  pantryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 10,
  },
  pantryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pantryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    flex: 1,
  },
  pantryCatBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pantryCatText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  pantryCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 6,
  },
  pantryQty: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  pantryCost: {
    fontSize: 12,
    color: '#78716C',
  },
  yieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginTop: 10,
  },
  yieldTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 10,
  },
  yieldLabel: {
    fontSize: 13,
    color: '#44403C',
    flex: 1,
  },
  yieldInput: {
    width: 80,
    height: 42,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D6D3D1',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  yieldResultBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  yieldResultHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  yieldComment: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});
