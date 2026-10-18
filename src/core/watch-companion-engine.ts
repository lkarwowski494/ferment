// ============================================================================
// Apps4Brew Studio — SEROWAR Apple Watch Companion & Hands-in-Whey Protocol
// Syncs active coagulation timer, flocculation point, cave climate, and affinage
// tasks to wrist displays without touching the phone with wet/milky hands.
// ============================================================================

export interface ActiveTimerData {
  timerType: 'FLOCCULATION' | 'PRESS' | 'BRINE' | 'CURD_STIR';
  batchName: string;
  totalDurationSec: number;
  remainingSec: number;
  isPaused: boolean;
  flocculationMultiplier?: number;
}

export interface CaveSummaryData {
  currentTempCelsius: number;
  currentHumidityPct: number;
  isCondensationAlarm: boolean;
  pendingTasksCount: number;
}

export interface WatchCompanionInput {
  activeTimer?: ActiveTimerData | null;
  caveSummary?: CaveSummaryData | null;
  timestampMs?: number;
}

export interface WatchCompanionPayload {
  syncTimestamp: number;
  hasActiveProcess: boolean;
  headline: string;
  subline: string;
  badgeText: string;
  progressPct: number; // 0..100
  hapticTrigger: 'NONE' | 'TICK' | 'WARNING_ALARM' | 'SUCCESS_CHIME';
  complicationTextShort: string; // Max 8 chars for compact watch dials
  complicationTextLong: string;  // Max 24 chars for modular watch faces
}

export type WatchComplicationTemplate = 'CIRCULAR' | 'MODULAR_LARGE' | 'CORNER' | 'INLINE';

export interface WatchComplicationData {
  template: WatchComplicationTemplate;
  header: string;
  value: string;
  iconSymbol: string;
}

/**
 * Generates an optimized wrist snapshot for watchOS apps and notifications.
 */
export function generateWatchSnapshot(input: WatchCompanionInput): WatchCompanionPayload {
  const syncTimestamp = input.timestampMs || Date.now();
  const timer = input.activeTimer;
  const cave = input.caveSummary;

  if (timer && timer.remainingSec > 0) {
    const elapsedSec = Math.max(0, timer.totalDurationSec - timer.remainingSec);
    const progressPct = timer.totalDurationSec > 0
      ? Math.min(100, Math.round((elapsedSec / timer.totalDurationSec) * 100))
      : 0;

    let haptic: WatchCompanionPayload['hapticTrigger'] = 'NONE';
    if (timer.remainingSec <= 10) {
      haptic = 'WARNING_ALARM';
    } else if (timer.remainingSec % 60 === 0) {
      haptic = 'TICK';
    }

    const mins = Math.floor(timer.remainingSec / 60);
    const secs = timer.remainingSec % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    let headline = '';
    let subline = '';
    let complicationShort = '';

    switch (timer.timerType) {
      case 'FLOCCULATION':
        headline = `Flokulacja: ${timeFormatted}`;
        subline = `Miseczka (M = ${timer.flocculationMultiplier || 3.0}x)`;
        complicationShort = `FLOC ${timeFormatted}`;
        break;
      case 'PRESS':
        headline = `Prasa: ${timeFormatted}`;
        subline = `${timer.batchName} — docisk`;
        complicationShort = `PRS ${timeFormatted}`;
        break;
      case 'BRINE':
        headline = `Solanka: ${timeFormatted}`;
        subline = `${timer.batchName} — kąpiel`;
        complicationShort = `SOL ${timeFormatted}`;
        break;
      case 'CURD_STIR':
      default:
        headline = `Skrzep: ${timeFormatted}`;
        subline = `${timer.batchName} — dogrzewanie`;
        complicationShort = `CURD ${timeFormatted}`;
        break;
    }

    return {
      syncTimestamp,
      hasActiveProcess: true,
      headline,
      subline,
      badgeText: timer.isPaused ? 'PAUZA' : 'AKTYWNY',
      progressPct,
      hapticTrigger: haptic,
      complicationTextShort: complicationShort,
      complicationTextLong: `${timer.batchName} ${timeFormatted}`,
    };
  }

  // Fallback to cave surveillance
  if (cave) {
    const isAlarm = cave.isCondensationAlarm;
    const headline = `${cave.currentTempCelsius.toFixed(1)}°C · ${Math.round(cave.currentHumidityPct)}%`;
    const subline = isAlarm
      ? 'ALARM: Ryzyko Kondensacji!'
      : `${cave.pendingTasksCount} krążków czeka na obrót`;

    return {
      syncTimestamp,
      hasActiveProcess: false,
      headline,
      subline,
      badgeText: isAlarm ? 'ALARM' : 'JASKINIA',
      progressPct: 100,
      hapticTrigger: isAlarm ? 'WARNING_ALARM' : 'NONE',
      complicationTextShort: `${Math.round(cave.currentTempCelsius)}°C ${Math.round(cave.currentHumidityPct)}%`,
      complicationTextLong: `Jaskinia: ${cave.currentTempCelsius.toFixed(1)}°C / ${Math.round(cave.currentHumidityPct)}%`,
    };
  }

  // Idling
  return {
    syncTimestamp,
    hasActiveProcess: false,
    headline: 'SEROWAR Czuwa',
    subline: 'Brak aktywnych wsadów w kotle',
    badgeText: 'GOTOWY',
    progressPct: 0,
    hapticTrigger: 'NONE',
    complicationTextShort: 'SEROWAR',
    complicationTextLong: 'Warsztat gotowy do wsadu',
  };
}

/**
 * Formats data for standard watchOS Complications (Circular, Modular, Corner, Inline).
 */
export function formatWatchComplication(
  payload: WatchCompanionPayload,
  template: WatchComplicationTemplate = 'MODULAR_LARGE'
): WatchComplicationData {
  switch (template) {
    case 'CIRCULAR':
      return {
        template: 'CIRCULAR',
        header: payload.badgeText,
        value: payload.complicationTextShort,
        iconSymbol: payload.hasActiveProcess ? 'timer' : 'thermometer',
      };
    case 'CORNER':
      return {
        template: 'CORNER',
        header: 'FERMENT',
        value: payload.complicationTextShort,
        iconSymbol: 'drop.fill',
      };
    case 'INLINE':
      return {
        template: 'INLINE',
        header: payload.headline,
        value: payload.complicationTextShort,
        iconSymbol: 'sparkles',
      };
    case 'MODULAR_LARGE':
    default:
      return {
        template: 'MODULAR_LARGE',
        header: payload.headline,
        value: payload.subline,
        iconSymbol: payload.hasActiveProcess ? 'timer' : 'house.fill',
      };
  }
}
