import {
  initDatabase,
  getBatches,
  saveBatch,
  updateBatchStatus,
  deleteBatch,
  getCaveWheels,
  saveCaveWheel,
  deleteCaveWheel,
  logCaveAction,
  getCaveActions,
  saveSensoryEvaluation,
  getSensoryEvaluation,
  getPantry,
  savePantryItem,
  deletePantryItem,
  updatePantryItemQty,
  applyPantryDepletion,
  getAppAccess,
  setSubscriptionTier,
  incrementCompletedBatches,
  getAppSetting,
  setAppSetting,
  _resetMemStore,
  saveCurdDetails,
  getCurdDetails,
  saveButterDetails,
  getButterDetails,
  saveFermentedMilkDetails,
  getFermentedMilkDetails,
  saveWheyProductDetails,
  getWheyProductDetails,
  logWheelWeight,
  getWheelWeights,
} from '../../src/data/sqlite-store';
import {
  Batch,
  CaveCheeseWheel,
  PantryItem,
  CaveActionLog,
  SensoryEvaluation,
  CurdBatchDetails,
  ButterChurnDetails,
  FermentedMilkDetails,
  WheyProductDetails,
  WheelWeightLog,
} from '../../src/data/db';

describe('FERMENT SQLite Store & Persistence (Faza 1)', () => {
  beforeEach(async () => {
    _resetMemStore();
    await initDatabase();
  });

  it('initializes default pantry items', async () => {
    const pantry = await getPantry();
    expect(pantry.length).toBeGreaterThanOrEqual(3);
    expect(pantry.some((item) => item.itemName.includes('Sól'))).toBe(true);
    expect(pantry.some((item) => item.category === 'RENNET')).toBe(true);
  });

  it('saves and retrieves batches correctly', async () => {
    const batch: Batch = {
      id: 'batch_gouda_01',
      batchNumber: 'GOU-2026-001',
      category: 'CHEESE',
      styleName: 'Gouda Zagrodowa',
      createdAt: Date.now(),
      status: 'AGING',
      notes: 'Z dodatkiem kozieradki',
    };

    await saveBatch(batch);
    const batches = await getBatches();
    const found = batches.find((b) => b.id === 'batch_gouda_01');
    expect(found).toBeDefined();
    expect(found?.styleName).toBe('Gouda Zagrodowa');
    expect(found?.status).toBe('AGING');
  });

  it('tracks cave cheese wheels in Cave Log', async () => {
    const wheel: CaveCheeseWheel = {
      id: 'wheel_01',
      batchId: 'batch_gouda_01',
      wheelTag: 'W-01',
      locationInCave: 'Półka 1',
      initialWeightGrams: 2000,
      currentWeightGrams: 1850,
      rindType: 'NATURAL',
      targetAgingDays: 60,
      shrinkagePct: 7.5,
    };

    await saveCaveWheel(wheel);
    const wheels = await getCaveWheels();
    const found = wheels.find((w) => w.id === 'wheel_01');
    expect(found).toBeDefined();
    expect(found?.currentWeightGrams).toBe(1850);
  });

  it('manages cave actions and logs them persistently', async () => {
    const action: CaveActionLog = {
      id: 'act_01',
      wheelId: 'wheel_01',
      actionType: 'WASH_BRINE',
      loggedAt: Date.now(),
      notes: 'Przemyto solanką 18%',
    };
    await logCaveAction(action);
    const actions = await getCaveActions('wheel_01');
    expect(actions).toHaveLength(1);
    expect(actions[0].actionType).toBe('WASH_BRINE');
  });

  it('manages sensory evaluations', async () => {
    const evaluation: SensoryEvaluation = {
      id: 'sens_01',
      batchId: 'batch_gouda_01',
      evaluatedAt: Date.now(),
      acidity: 5,
      salinity: 5,
      firmness: 7,
      creaminess: 8,
      pungency: 3,
      nuttiness: 6,
      overallScore: 88,
      grade: 'GOOD',
      notes: 'Wzorcowy finisz',
    };
    await saveSensoryEvaluation(evaluation);
    const found = await getSensoryEvaluation('batch_gouda_01');
    expect(found).toBeDefined();
    expect(found?.overallScore).toBe(88);
    expect(found?.grade).toBe('GOOD');
  });

  it('updates batch status and deletes batches', async () => {
    const batch: Batch = {
      id: 'batch_del',
      batchNumber: 'DEL-01',
      category: 'KIMCHI',
      styleName: 'Kimchi',
      createdAt: Date.now(),
      status: 'PREPARING',
    };
    await saveBatch(batch);
    await updateBatchStatus('batch_del', 'COMPLETED');
    let batches = await getBatches();
    expect(batches.find((b) => b.id === 'batch_del')?.status).toBe('COMPLETED');

    await deleteBatch('batch_del');
    batches = await getBatches();
    expect(batches.find((b) => b.id === 'batch_del')).toBeUndefined();
  });

  it('deletes cave wheels and pantry items', async () => {
    const wheel: CaveCheeseWheel = {
      id: 'wheel_del',
      batchId: 'batch_01',
      wheelTag: 'W-DEL',
      locationInCave: 'A',
      initialWeightGrams: 1000,
      currentWeightGrams: 950,
      rindType: 'NATURAL',
      targetAgingDays: 30,
      shrinkagePct: 5,
    };
    await saveCaveWheel(wheel);
    await deleteCaveWheel('wheel_del');
    const wheels = await getCaveWheels();
    expect(wheels.find((w) => w.id === 'wheel_del')).toBeUndefined();

    const pItem: PantryItem = {
      id: 'pantry_del',
      itemName: 'Test Herbata',
      category: 'TEA',
      quantityAvailable: 500,
      unit: 'g',
    };
    await savePantryItem(pItem);
    await deletePantryItem('pantry_del');
    const pantry = await getPantry();
    expect(pantry.find((p) => p.id === 'pantry_del')).toBeUndefined();
  });

  it('manages app_settings and monetization flags persistently', async () => {
    await setAppSetting('app_lang', 'pl');
    const lang = await getAppSetting('app_lang');
    expect(lang).toBe('pl');

    const initialAccess = await getAppAccess();
    expect(initialAccess.trialDays).toBe(14);
    expect(initialAccess.subscriptionTier).toBe('none');

    await setSubscriptionTier('lifetime');
    const updatedAccess = await getAppAccess();
    expect(updatedAccess.subscriptionTier).toBe('lifetime');

    const nextCount = await incrementCompletedBatches();
    expect(nextCount).toBe(1);
  });

  it('updates pantry quantity and applies batch depletion', async () => {
    const item: PantryItem = {
      id: 'pantry_dep_test',
      itemName: 'Cukier Trzcinowy',
      category: 'SUGAR',
      quantityAvailable: 1000,
      unit: 'g',
    };
    await savePantryItem(item);

    await updatePantryItemQty('pantry_dep_test', 850);
    let pantry = await getPantry();
    expect(pantry.find((p) => p.id === 'pantry_dep_test')?.quantityAvailable).toBe(850);

    await applyPantryDepletion([
      { pantryItemId: 'pantry_dep_test', remainingQty: 700 },
    ]);
    pantry = await getPantry();
    expect(pantry.find((p) => p.id === 'pantry_dep_test')?.quantityAvailable).toBe(700);
  });

  it('manages dairy craft details: curd, butter, fermented milk, whey product and wheel weights', async () => {
    // 1. Curd details
    const curd: CurdBatchDetails = {
      batchId: 'batch_twarog_01',
      acidificationMethod: 'MESOPHILIC_DVI',
      milkVolumeLiters: 10,
      measuredPh: 4.6,
      heatingTempC: 38,
      drainDurationMinutes: 120,
      pressedWeightKg: 2.0,
      finalCurdWeightGrams: 1450,
    };
    await saveCurdDetails(curd);
    const loadedCurd = await getCurdDetails('batch_twarog_01');
    expect(loadedCurd).toBeDefined();
    expect(loadedCurd?.measuredPh).toBe(4.6);
    expect(loadedCurd?.finalCurdWeightGrams).toBe(1450);

    // 2. Butter churn details
    const butter: ButterChurnDetails = {
      batchId: 'batch_butter_01',
      creamFatPct: 36,
      creamVolumeLiters: 5,
      creamTemperatureC: 12,
      creamType: 'CULTURED',
      churnDurationMinutes: 18,
      washCyclesCount: 3,
      butterYieldGrams: 2100,
      buttermilkYieldMl: 2800,
      gheeYieldGrams: 1750,
    };
    await saveButterDetails(butter);
    const loadedButter = await getButterDetails('batch_butter_01');
    expect(loadedButter).toBeDefined();
    expect(loadedButter?.butterYieldGrams).toBe(2100);
    expect(loadedButter?.creamType).toBe('CULTURED');

    // 3. Fermented milk details
    const milk: FermentedMilkDetails = {
      batchId: 'batch_kefir_01',
      cultureType: 'KEFIR_GRAINS',
      incubationTempC: 22,
      incubationDurationHours: 24,
      targetPh: 4.4,
    };
    await saveFermentedMilkDetails(milk);
    const loadedMilk = await getFermentedMilkDetails('batch_kefir_01');
    expect(loadedMilk).toBeDefined();
    expect(loadedMilk?.cultureType).toBe('KEFIR_GRAINS');

    // 4. Whey product details
    const whey: WheyProductDetails = {
      batchId: 'batch_ricotta_01',
      sourceBatchId: 'batch_gouda_01',
      wheyType: 'SWEET_RENNET',
      wheyVolumeLiters: 18,
      wholeMilkAddedLiters: 2,
      creamAddedLiters: 0.5,
      heatingTempC: 88,
      productType: 'RICOTTA',
      finalYieldGrams: 920,
    };
    await saveWheyProductDetails(whey);
    const loadedWhey = await getWheyProductDetails('batch_ricotta_01');
    expect(loadedWhey).toBeDefined();
    expect(loadedWhey?.productType).toBe('RICOTTA');
    expect(loadedWhey?.heatingTempC).toBe(88);

    // 5. Wheel weight logs
    const wheel: CaveCheeseWheel = {
      id: 'wheel_dyn_01',
      batchId: 'batch_gouda_01',
      wheelTag: 'W-DYN-01',
      locationInCave: 'Półka B1',
      initialWeightGrams: 2500,
      currentWeightGrams: 2500,
      rindType: 'NATURAL',
      targetAgingDays: 90,
      shrinkagePct: 0.0,
    };
    await saveCaveWheel(wheel);

    const weightLog: WheelWeightLog = {
      id: 'wlog_01',
      wheelId: 'wheel_dyn_01',
      weightGrams: 2350,
      shrinkagePct: 6.0,
      loggedAt: Date.now(),
      notes: 'Pomiar po 14 dniach',
    };
    await logWheelWeight(weightLog);

    const weights = await getWheelWeights('wheel_dyn_01');
    expect(weights).toHaveLength(1);
    expect(weights[0].weightGrams).toBe(2350);

    const wheels = await getCaveWheels();
    const updatedWheel = wheels.find((w) => w.id === 'wheel_dyn_01');
    expect(updatedWheel?.currentWeightGrams).toBe(2350);
    expect(updatedWheel?.shrinkagePct).toBe(6.0);
  });
});

