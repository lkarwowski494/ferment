import { AccessibilityInfo } from 'react-native';

/**
 * Screen reader announcement helper conforming to NFR-INT-008 / S8.
 */
export function announce(message: string): void {
  if (AccessibilityInfo && typeof AccessibilityInfo.announceForAccessibility === 'function') {
    AccessibilityInfo.announceForAccessibility(message);
  }
}
