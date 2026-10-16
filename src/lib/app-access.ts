// ============================================================================
// Apps4Brew Studio — App Access & Monetization Module
// Model: „Cheaper than Espresso” (100% Offline-First, Zero Telemetry)
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  getAppAccess,
  setSubscriptionTier,
} from '../data/sqlite-store';
import { StoredAppAccess, SubscriptionTier } from '../data/db';

export { SubscriptionTier };

export type AccessStatus = 'trial_active' | 'trial_expired' | 'subscribed';

export interface AppAccessInfo {
  status: AccessStatus;
  trialStartedAt: number;
  trialDaysRemaining: number;
  completedBatchesCount: number;
  subscriptionTier: SubscriptionTier;
  isSubscribed: boolean;
  canCreateNewBatch: boolean;
  canPerformActions: boolean;
  isHistoryReadOnly: boolean; // Always true — history is NEVER lost!
}

export const TRIAL_DURATION_DAYS = 14;

// Global reactive listener pattern across all hook consumers
type AccessListener = () => void;
const accessListeners = new Set<AccessListener>();

function notifyAccessListeners(): void {
  accessListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Ignore errors in listener callbacks
    }
  });
}

/**
 * Pure evaluation function of user's access rights.
 */
export function evaluateAppAccess(
  stored: StoredAppAccess,
  now: number = Date.now()
): AppAccessInfo {
  const isSubscribed =
    stored.subscriptionTier !== 'none' &&
    (!stored.subscriptionExpiresAt || stored.subscriptionExpiresAt > now);

  if (isSubscribed) {
    return {
      status: 'subscribed',
      trialStartedAt: stored.trialStartedAt,
      trialDaysRemaining: 0,
      completedBatchesCount: stored.completedBatchesCount,
      subscriptionTier: stored.subscriptionTier,
      isSubscribed: true,
      canCreateNewBatch: true,
      canPerformActions: true,
      isHistoryReadOnly: true,
    };
  }

  const msElapsed = Math.max(0, now - stored.trialStartedAt);
  const daysElapsed = msElapsed / (1000 * 60 * 60 * 24);
  const trialDaysRemaining = Math.max(0, Math.ceil(stored.trialDays - daysElapsed));

  const isTrialActive = trialDaysRemaining > 0;

  if (isTrialActive) {
    return {
      status: 'trial_active',
      trialStartedAt: stored.trialStartedAt,
      trialDaysRemaining,
      completedBatchesCount: stored.completedBatchesCount,
      subscriptionTier: 'none',
      isSubscribed: false,
      canCreateNewBatch: true,
      canPerformActions: true,
      isHistoryReadOnly: true,
    };
  }

  // Trial expired: Read-only for history/export, but new creation/actions blocked
  return {
    status: 'trial_expired',
    trialStartedAt: stored.trialStartedAt,
    trialDaysRemaining: 0,
    completedBatchesCount: stored.completedBatchesCount,
    subscriptionTier: 'none',
    isSubscribed: false,
    canCreateNewBatch: false,
    canPerformActions: false,
    isHistoryReadOnly: true,
  };
}

/**
 * React hook to observe and interact with application access state reactively.
 */
export function useAppAccess() {
  const [access, setAccess] = useState<AppAccessInfo>(() =>
    evaluateAppAccess({
      id: 'current_user',
      trialStartedAt: Date.now(),
      trialDays: TRIAL_DURATION_DAYS,
      subscriptionTier: 'none',
      subscriptionExpiresAt: null,
      completedBatchesCount: 0,
    })
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaywallVisible, setPaywallVisible] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    try {
      const stored = await getAppAccess();
      setAccess(evaluateAppAccess(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    accessListeners.add(refresh);
    return () => {
      accessListeners.delete(refresh);
    };
  }, [refresh]);

  /**
   * Guards an action requiring active creation access.
   * If access is expired, opens paywall modal and returns false.
   */
  const requireActionAccess = useCallback(
    (action?: () => void | Promise<void>): boolean => {
      if (access.canPerformActions) {
        if (action) {
          void action();
        }
        return true;
      }
      setPaywallVisible(true);
      return false;
    },
    [access.canPerformActions]
  );

  const subscribe = useCallback(
    async (tier: 'monthly' | 'yearly' | 'lifetime') => {
      let expiresAt: number | null = null;
      const now = Date.now();
      if (tier === 'monthly') {
        expiresAt = now + 30 * 24 * 60 * 60 * 1000;
      } else if (tier === 'yearly') {
        expiresAt = now + 365 * 24 * 60 * 60 * 1000;
      }
      await setSubscriptionTier(tier, expiresAt);
      notifyAccessListeners();
      setPaywallVisible(false);
    },
    []
  );

  const restorePurchases = useCallback(async (): Promise<{
    restored: boolean;
    tier: SubscriptionTier;
  }> => {
    const stored = await getAppAccess();
    if (stored.purchasedReceiptTier && stored.purchasedReceiptTier !== 'none') {
      const evaluated = evaluateAppAccess(stored);
      setAccess(evaluated);
      notifyAccessListeners();
      return { restored: true, tier: stored.purchasedReceiptTier };
    }
    return { restored: false, tier: 'none' };
  }, []);

  return {
    access,
    loading,
    refresh,
    isPaywallVisible,
    setPaywallVisible,
    requireActionAccess,
    subscribe,
    restorePurchases,
  };
}
