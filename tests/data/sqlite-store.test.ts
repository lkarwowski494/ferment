import {
  initDatabase,
  getBatches,
  saveBatch,
  getCaveWheels,
  saveCaveWheel,
  getPantry,
  savePantryItem,
  getAppAccess,
  setSubscriptionTier,
  incrementCompletedBatches,
  getAppSetting,
  setAppSetting,
  _resetMemStore,
} from '../../src/data/sqlite-store';
import { Batch, CaveCheeseWheel, PantryItem } from '../../src/data/db';

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
