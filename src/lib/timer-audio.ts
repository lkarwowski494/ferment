// ============================================================================
// Apps4Brew Studio — FERMENT Timer Chime, Haptics & Keep-Awake Engine
// Ergonomic dirty/wet hands support: audible PCM chime + screen stay awake
// ============================================================================

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { CHIME_WAV_BASE64 } from './chime-sound';

let keepAwakeActive = false;

/**
 * Activates screen keep-awake during critical biological steps (coagulation, pressing, stirring)
 */
export async function enableProcessKeepAwake(): Promise<void> {
  try {
    await activateKeepAwakeAsync('ferment_process');
    keepAwakeActive = true;
  } catch {
    // Graceful fallback for non-native / test environments
  }
}

/**
 * Deactivates keep-awake to conserve device battery
 */
export function disableProcessKeepAwake(): void {
  try {
    if (keepAwakeActive) {
      deactivateKeepAwake('ferment_process');
      keepAwakeActive = false;
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Plays the 587Hz + 880Hz dual-tone PCM WAV chime and triggers tactile haptic feedback
 */
export async function playTimerCompletionAlert(): Promise<void> {
  // 1. Tactile haptic notification
  try {
    if (Haptics && Haptics.notificationAsync) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch {
    // Ignore in non-supported devices
  }

  // 2. Play acoustic dual-tone bell sound
  try {
    if (Audio && Audio.Sound) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: CHIME_WAV_BASE64 },
        { shouldPlay: true, volume: 1.0 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
  } catch {
    // In mock or simulator without audio hardware, continue silently
  }
}

/**
 * Light tactile feedback for stepper / button presses (touch targets >= 56pt)
 */
export async function triggerHapticFeedback(): Promise<void> {
  try {
    if (Haptics && Haptics.impactAsync) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {
    // Ignore
  }
}
