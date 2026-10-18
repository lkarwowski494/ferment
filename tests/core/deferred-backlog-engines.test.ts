// ============================================================================
// Apps4Brew Studio — SEROWAR Deferred Backlog Engines Test Suite
// Verifies Watch Companion, Widget Timelines, Thermal Printer & BLE Auto-Discovery
// ============================================================================

import {
  generateWatchSnapshot,
  formatWatchComplication,
  WatchCompanionPayload,
  WatchComplicationTemplate,
} from '../../src/core/watch-companion-engine';

import {
  generateCaveLockscreenWidgetData,
  generateLiveActivityTimerData,
} from '../../src/core/widget-timeline-engine';

import {
  generateThermalLabel50x30,
  validateArtisanLabelRequirements,
  ESC_POS_CONSTANTS,
} from '../../src/core/thermal-printer-engine';

import {
  simulateBleScanNearby,
  autoSelectBestSensorReading,
  DiscoveredBleDevice,
} from '../../src/core/sensor-telemetry-engine';

describe('SEROWAR Deferred Backlog Engines', () => {
  // ==========================================================================
  // 1. Apple Watch Companion & Hands-in-Whey Protocol
  // ==========================================================================
  describe('watch-companion-engine', () => {
    test('generateWatchSnapshot handles active flocculation timer correctly', () => {
      const snap = generateWatchSnapshot({
        activeTimer: {
          timerType: 'FLOCCULATION',
          batchName: 'GOUDA-01',
          totalDurationSec: 900,
          remainingSec: 300,
          isPaused: false,
          flocculationMultiplier: 3.5,
        },
      });

      expect(snap.hasActiveProcess).toBe(true);
      expect(snap.headline).toContain('Flokulacja: 5:00');
      expect(snap.subline).toContain('M = 3.5x');
      expect(snap.badgeText).toBe('AKTYWNY');
      expect(snap.progressPct).toBe(67);
      expect(snap.complicationTextShort).toBe('FLOC 5:00');
    });

    test('generateWatchSnapshot triggers warning alarm when remaining time <= 10s', () => {
      const snap = generateWatchSnapshot({
        activeTimer: {
          timerType: 'PRESS',
          batchName: 'CHEDDAR',
          totalDurationSec: 3600,
          remainingSec: 8,
          isPaused: false,
        },
      });

      expect(snap.hapticTrigger).toBe('WARNING_ALARM');
      expect(snap.headline).toContain('Prasa: 0:08');
    });

    test('generateWatchSnapshot falls back to cave microclimate when no active timer', () => {
      const snap = generateWatchSnapshot({
        caveSummary: {
          currentTempCelsius: 12.3,
          currentHumidityPct: 85,
          isCondensationAlarm: false,
          pendingTasksCount: 4,
        },
      });

      expect(snap.hasActiveProcess).toBe(false);
      expect(snap.headline).toBe('12.3°C · 85%');
      expect(snap.subline).toContain('4 krążków');
      expect(snap.badgeText).toBe('JASKINIA');
      expect(snap.hapticTrigger).toBe('NONE');
    });

    test('generateWatchSnapshot warns on condensation alarm in cave', () => {
      const snap = generateWatchSnapshot({
        caveSummary: {
          currentTempCelsius: 15.0,
          currentHumidityPct: 96,
          isCondensationAlarm: true,
          pendingTasksCount: 1,
        },
      });

      expect(snap.badgeText).toBe('ALARM');
      expect(snap.hapticTrigger).toBe('WARNING_ALARM');
      expect(snap.subline).toContain('Ryzyko Kondensacji');
    });

    test('generateWatchSnapshot returns idle state when no active timer or cave data', () => {
      const snap = generateWatchSnapshot({});
      expect(snap.hasActiveProcess).toBe(false);
      expect(snap.headline).toBe('SEROWAR Czuwa');
      expect(snap.badgeText).toBe('GOTOWY');
    });

    test('formatWatchComplication renders circular, modular, corner and inline templates', () => {
      const payload: WatchCompanionPayload = {
        syncTimestamp: Date.now(),
        hasActiveProcess: true,
        headline: 'GOUDA',
        subline: '14 min',
        badgeText: 'AKTYWNY',
        progressPct: 50,
        hapticTrigger: 'NONE',
        complicationTextShort: '14m',
        complicationTextLong: 'GOUDA 14m',
      };

      const templates: WatchComplicationTemplate[] = ['CIRCULAR', 'MODULAR_LARGE', 'CORNER', 'INLINE'];
      for (const t of templates) {
        const comp = formatWatchComplication(payload, t);
        expect(comp.template).toBe(t);
        expect(comp.value).toBeDefined();
        expect(comp.iconSymbol).toBeDefined();
      }
    });
  });

  // ==========================================================================
  // 2. iOS Lock Screen & Dynamic Island Live Activity Timelines
  // ==========================================================================
  describe('widget-timeline-engine', () => {
    test('generateCaveLockscreenWidgetData formats optimal, warning and critical states', () => {
      // Optimal
      const optimal = generateCaveLockscreenWidgetData({
        temperatureCelsius: 12.0,
        relativeHumidityPct: 84,
        dewPointCelsius: 9.3,
        isCondensationRisk: false,
        activeWheelsCount: 6,
        wheelsToTurnToday: 2,
      });
      expect(optimal.statusBadge).toBe('OPTIMAL');
      expect(optimal.metricLine).toBe('12.0°C · 84% RH');
      expect(optimal.pendingTasksText).toBe('2 do obrócenia');

      // Critical (Condensation)
      const critical = generateCaveLockscreenWidgetData({
        temperatureCelsius: 13.0,
        relativeHumidityPct: 95,
        dewPointCelsius: 12.8,
        isCondensationRisk: true,
        activeWheelsCount: 5,
        wheelsToTurnToday: 0,
      });
      expect(critical.statusBadge).toBe('CRITICAL');
      expect(critical.pendingTasksText).toBe('Wszystkie obrócone');

      // Warning (Too dry)
      const warning = generateCaveLockscreenWidgetData({
        temperatureCelsius: 12.0,
        relativeHumidityPct: 70,
        dewPointCelsius: 6.8,
        isCondensationRisk: false,
        activeWheelsCount: 3,
        wheelsToTurnToday: 1,
      });
      expect(warning.statusBadge).toBe('WARNING');
    });

    test('generateLiveActivityTimerData tracks countdown, progress fraction, and completion', () => {
      const now = 1700000000000;
      const start = now - 60000; // 1 min ago
      const end = now + 120000;  // 2 mins left (total 3 mins)

      const active = generateLiveActivityTimerData({
        batchId: 'BATCH-42',
        cheeseName: 'Koryciński',
        stepName: 'Koagulacja',
        startAtMs: start,
        endAtMs: end,
        nowMs: now,
      });

      expect(active.isComplete).toBe(false);
      expect(active.remainingSeconds).toBe(120);
      expect(active.timeFormatted).toBe('2:00');
      expect(active.progressFraction).toBeCloseTo(0.33, 1);

      // Completed activity
      const complete = generateLiveActivityTimerData({
        batchId: 'BATCH-42',
        cheeseName: 'Koryciński',
        stepName: 'Koagulacja',
        startAtMs: start,
        endAtMs: now - 5000,
        nowMs: now,
      });
      expect(complete.isComplete).toBe(true);
      expect(complete.remainingSeconds).toBe(0);
      expect(complete.stepDescription).toContain('Wykonaj cięcie');
    });
  });

  // ==========================================================================
  // 3. Compact Thermal Label & ESC/POS Engine
  // ==========================================================================
  describe('thermal-printer-engine', () => {
    test('generateThermalLabel50x30 formats 50x30mm roll labels and ESC/POS commands', () => {
      const label = generateThermalLabel50x30({
        batchCode: 'GOUDA-2026-004',
        cheeseStyle: 'Gouda Zagrodowa',
        productionDate: '2026-10-18',
        bestBeforeDate: '2027-04-18',
        milkSource: 'Krowie',
        weightGrams: 2450,
        isRawMilk: true,
      });

      expect(label.widthMm).toBe(50);
      expect(label.heightMm).toBe(30);
      expect(label.rawTextLines.some((l) => l.includes('GOUDA-2026-004'))).toBe(true);
      expect(label.rawTextLines.some((l) => l.includes('(SUROWE)'))).toBe(true);
      expect(label.escPosCommandHex.length).toBeGreaterThan(20);
      expect(ESC_POS_CONSTANTS.INIT).toBe('\x1B\x40');
    });

    test('validateArtisanLabelRequirements validates mandatory food safety metadata', () => {
      const valid = validateArtisanLabelRequirements({
        batchCode: 'EDAM-01',
        cheeseStyle: 'Edam',
        productionDate: '2026-10-18',
        bestBeforeDate: '2027-01-18',
        milkSource: 'Krowie',
      });
      expect(valid.isValid).toBe(true);
      expect(valid.missingFields).toHaveLength(0);

      const invalid = validateArtisanLabelRequirements({
        batchCode: '',
        cheeseStyle: '',
        productionDate: '2026-10-18',
        bestBeforeDate: '',
        milkSource: 'Krowie',
      });
      expect(invalid.isValid).toBe(false);
      expect(invalid.missingFields).toContain('Kod partii');
      expect(invalid.missingFields).toContain('Nazwa gatunku sera');
      expect(invalid.missingFields).toContain('Data minimalnej trwałości');
    });
  });

  // ==========================================================================
  // 4. BLE Auto-Discovery & Sensor Selection
  // ==========================================================================
  describe('sensor-telemetry-engine discovery', () => {
    test('simulateBleScanNearby returns nearby Ruuvi and Xiaomi sensors', () => {
      const devices = simulateBleScanNearby(2);
      expect(devices.length).toBe(2);
      expect(devices[0].sensorType).toBe('RUUVI_TAG');
      expect(devices[0].lastReading.temperatureCelsius).toBeCloseTo(12.4);

      const typeCheck: DiscoveredBleDevice = devices[0];
      expect(typeCheck.deviceId).toBeDefined();
    });

    test('autoSelectBestSensorReading picks sensor with strongest RSSI signal', () => {
      const devices = simulateBleScanNearby(2);
      const best = autoSelectBestSensorReading(devices);
      expect(best).not.toBeNull();
      expect(best?.temperatureCelsius).toBe(12.4); // RuuviTag has -62 dBm vs Xiaomi -71 dBm

      expect(autoSelectBestSensorReading([])).toBeNull();
    });
  });
});
