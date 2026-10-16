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
  getAppAccess,
  setSubscriptionTier,
  incrementCompletedBatches,
  getAppSetting,
  setAppSetting,
  _resetMemStore,
} from '../../src/data/sqlite-store';
import { Batch, CaveCheeseWheel, PantryItem, CaveActionLog, SensoryEvaluation } from '../../src/data/db';

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
});
