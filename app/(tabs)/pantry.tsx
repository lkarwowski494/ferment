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
import {
  convertRennetForm,
  getCultureNaturalSubstitute,
  convertCacl2Forms,
  RennetSubstitutionResult,
} from '../../src/core/ingredient-substitutions';

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

  // Ingredient Substitutions State
  const [substMilkLiters, setSubstMilkLiters] = useState<number>(10);
  const [substRennetType, setSubstRennetType] = useState<RennetSubstitutionResult['substituteType']>('LIQUID_200_IMCU');
  const [substCultureType, setSubstCultureType] = useState<'MESOPHILIC' | 'THERMOPHILIC'>('MESOPHILIC');

  const loadPantry = useCallback(async () => {
    const store = getSqliteStore();
    const items = await store.getPantryItems();
    setPantryItems(items);
  }, []);

  useEffect(() => {
    loadPantry();
  }, [loadPantry]);

  const yieldCalc = calculateBatchYieldAndEconomics(calcBatchCost, calcMilkLiters, calcCheeseKg);
  const rennetSubstCalc = convertRennetForm(substMilkLiters, substRennetType);
  const cultureSubstCalc = getCultureNaturalSubstitute(substMilkLiters, substCultureType);
  const cacl2SubstCalc = convertCacl2Forms(substMilkLiters);

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

  const handleUpdateQuantity = (item: PantryItem, delta: number) => {
    requireActionAccess(async () => {
      triggerHapticFeedback();
      const updatedQty = Math.max(0, Math.round((item.quantityAvailable + delta) * 10) / 10);
      const store = getSqliteStore();
      await store.updatePantryItemQty(item.id, updatedQty);
      await createAutoBackup();
      await loadPantry();
    });
  };

  const handleDeleteItem = (item: PantryItem) => {
    requireActionAccess(() => {
      Alert.alert(
        t('Usuń Składnik'),
        `${t('Czy na pewno chcesz usunąć')} ${item.itemName}?`,
        [
          { text: t('Anuluj'), style: 'cancel' },
          {
            text: t('Usuń'),
            style: 'destructive',
            onPress: async () => {
              triggerHapticFeedback();
              const store = getSqliteStore();
              await store.deletePantryItem(item.id);
              await createAutoBackup();
              await loadPantry();
            },
          },
        ]
      );
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
        {pantryItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>{t('Brak składników w spiżarni')}</Text>
            <Text style={styles.emptyDesc}>
              {t('Dodaj mleko, enzymy, kultury lub sól, aby zarządzać zapasami i kosztami.')}
            </Text>
          </View>
        ) : (
          pantryItems.map((item) => (
            <View key={item.id} style={styles.pantryCard}>
              <View style={styles.pantryCardHeader}>
                <Text style={styles.pantryName}>{item.itemName}</Text>
                <View style={styles.pantryCatBadge}>
                  <Text style={styles.pantryCatText}>{item.category}</Text>
                </View>
              </View>
              <View style={styles.pantryCardFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pantryQty}>
                    {item.quantityAvailable} {item.unit}
                  </Text>
                  {item.costPerUnitPln !== undefined && (
                    <Text style={styles.pantryCost}>
                      {item.costPerUnitPln.toFixed(2)} PLN / {item.unit}
                    </Text>
                  )}
                </View>

                {/* Steppers & Delete for dirty hands ergonomics */}
                <View style={styles.pantryActionRow}>
                  <TouchableOpacity
                    style={styles.pantryQtyBtn}
                    onPress={() => handleUpdateQuantity(item, -1)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.pantryQtyBtnText}>-1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pantryQtyBtn}
                    onPress={() => handleUpdateQuantity(item, 1)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.pantryQtyBtnText}>+1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pantryDeleteBtn}
                    onPress={() => handleDeleteItem(item)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.pantryDeleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

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

        {/* Ingredient Forms & Substitutions Engine */}
        <View style={styles.yieldCard}>
          <Text style={styles.yieldTitle}>🧪 {t('Przelicznik Form i Zamienników Składników')}</Text>
          <Text style={styles.headerSub}>
            {t('Kalkulator ekwiwalentów enzymów, kultur naturalnych i roztworów chlorku wapnia')}
          </Text>

          {/* Volume Stepper */}
          <View style={[styles.rowBetween, { marginTop: 12 }]}>
            <Text style={styles.yieldLabel}>{t('Objętość mleka (L):')}</Text>
            <View style={styles.substStepper}>
              <TouchableOpacity
                style={styles.substStepperBtn}
                onPress={() => {
                  triggerHapticFeedback();
                  setSubstMilkLiters((v) => Math.max(1, v - 5));
                }}
              >
                <Text style={styles.substStepperBtnText}>-5</Text>
              </TouchableOpacity>
              <Text style={styles.substStepperVal}>{substMilkLiters} L</Text>
              <TouchableOpacity
                style={styles.substStepperBtn}
                onPress={() => {
                  triggerHapticFeedback();
                  setSubstMilkLiters((v) => v + 5);
                }}
              >
                <Text style={styles.substStepperBtnText}>+5</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 1. Rennet Forms */}
          <Text style={styles.substSectionTitle}>{t('Przelicznik Form Podpuszczki')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.substScroll}>
            {[
              { id: 'LIQUID_200_IMCU' as const, label: t('Płynna (200 IMCU/ml)') },
              { id: 'POWDER_MICROBIAL_2000' as const, label: t('Proszek mikrobiologiczny (2000 IMCU/g)') },
              { id: 'MEITO_TABLET' as const, label: t('Tabletka Meito (2500 IMCU/tabl)') },
              { id: 'PASTE_ANIMAL' as const, label: t('Pasta jagnięca z lipazą') },
            ].map((rf) => (
              <TouchableOpacity
                key={rf.id}
                style={[styles.substPill, substRennetType === rf.id && styles.substPillActive]}
                onPress={() => {
                  triggerHapticFeedback();
                  setSubstRennetType(rf.id);
                }}
              >
                <Text style={[styles.substPillText, substRennetType === rf.id && styles.substPillTextActive]}>
                  {rf.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.substResultBox}>
            <Text style={styles.substResultLine}>
              • {t('Wymagana dawka:')}{' '}
              <Text style={styles.boldText}>{rennetSubstCalc.requiredAmount} {rennetSubstCalc.unit}</Text> ({rennetSubstCalc.targetImcuTotal} IMCU)
            </Text>
            <Text style={styles.substTipText}>💡 {rennetSubstCalc.preparationTip}</Text>
          </View>

          {/* 2. Natural Culture Starters */}
          <Text style={styles.substSectionTitle}>{t('Ekwiwalent Kultur Naturalnych (Zamiast DVS)')}</Text>
          <View style={styles.categoryPickerRow}>
            <TouchableOpacity
              style={[styles.catPill, substCultureType === 'MESOPHILIC' && styles.catPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setSubstCultureType('MESOPHILIC');
              }}
            >
              <Text style={[styles.catPillText, substCultureType === 'MESOPHILIC' && styles.catPillTextActive]}>
                {t('Mezofilne (maślanka/zsiadłe)')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.catPill, substCultureType === 'THERMOPHILIC' && styles.catPillActive]}
              onPress={() => {
                triggerHapticFeedback();
                setSubstCultureType('THERMOPHILIC');
              }}
            >
              <Text style={[styles.catPillText, substCultureType === 'THERMOPHILIC' && styles.catPillTextActive]}>
                {t('Termofilne (żywy jogurt)')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.substResultBox}>
            <Text style={styles.substResultLine}>
              • {t('Naturalny zamiennik:')} <Text style={styles.boldText}>{cultureSubstCalc.naturalSubstituteName}</Text>
            </Text>
            <Text style={styles.substResultLine}>
              • {t('Ilość do zadania:')}{' '}
              <Text style={styles.boldText}>{cultureSubstCalc.naturalSubstituteAmount} {cultureSubstCalc.naturalSubstituteUnit}</Text> ({cultureSubstCalc.commercialDvsGrams}g DVS)
            </Text>
            <Text style={styles.substTipText}>💡 {cultureSubstCalc.notes}</Text>
          </View>

          {/* 3. CaCl2 Forms */}
          <Text style={styles.substSectionTitle}>{t('Przelicznik Postaci Chlorku Wapnia (CaCl2)')}</Text>
          <View style={styles.cacl2Grid}>
            <View style={styles.cacl2Item}>
              <Text style={styles.cacl2Label}>{t('Bezwodny CaCl2 (suchy czysty):')}</Text>
              <Text style={styles.cacl2Val}>{cacl2SubstCalc.dryAnhydrousGrams} g</Text>
            </View>
            <View style={styles.cacl2Item}>
              <Text style={styles.cacl2Label}>{t('Dwuwodny CaCl2 * 2H2O:')}</Text>
              <Text style={styles.cacl2Val}>{cacl2SubstCalc.dryDihydrateGrams} g</Text>
            </View>
            <View style={styles.cacl2Item}>
              <Text style={styles.cacl2Label}>{t('Roztwór płynny 33%:')}</Text>
              <Text style={styles.cacl2Val}>{cacl2SubstCalc.liquid33PercentMl} ml</Text>
            </View>
            <View style={styles.cacl2Item}>
              <Text style={styles.cacl2Label}>{t('Roztwór płynny 10%:')}</Text>
              <Text style={styles.cacl2Val}>{cacl2SubstCalc.liquid10PercentMl} ml</Text>
            </View>
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
  substStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  substStepperBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  substStepperBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  substStepperVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F',
    minWidth: 44,
    textAlign: 'center',
  },
  substSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#44403C',
    marginTop: 14,
    marginBottom: 6,
  },
  substScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  substPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  substPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#B45309',
  },
  substPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  substPillTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  substResultBox: {
    backgroundColor: '#F5F5F4',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  substResultLine: {
    fontSize: 12,
    color: '#1C1917',
    marginBottom: 4,
  },
  substTipText: {
    fontSize: 11,
    color: '#78716C',
    fontStyle: 'italic',
    marginTop: 2,
  },
  boldText: {
    fontWeight: '800',
  },
  cacl2Grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  cacl2Item: {
    flex: 1,
    minWidth: 130,
    backgroundColor: '#F5F5F4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cacl2Label: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '600',
  },
  cacl2Val: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  pantryActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pantryQtyBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#E7E5E4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pantryQtyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
  },
  pantryDeleteBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pantryDeleteBtnText: {
    fontSize: 14,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 18,
  },
});
