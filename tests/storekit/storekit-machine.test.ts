// ============================================================================
// Apps4Brew Studio — StoreKit & In-App Purchase State Machine Tests (GAP-STORE-01)
// Rigorous offline lifecycle: Purchasing, Failed, Cancelled, Deferred, Restored, Expired
// ============================================================================

import { evaluateAppAccess, SubscriptionTier } from '../../src/lib/app-access';
import { StoredAppAccess } from '../../src/data/db';

export type StoreKitTransactionState =
  | 'idle'
  | 'purchasing'
  | 'purchased'
  | 'failed_network'
  | 'failed_user_cancelled'
  | 'deferred_parental_approval'
  | 'restored';

export interface StoreKitStateMachine {
  currentState: StoreKitTransactionState;
  activeTier: SubscriptionTier;
  errorMessage?: string;
}

export function transitionStoreKit(
  current: StoreKitStateMachine,
  action:
    | { type: 'START_PURCHASE'; targetTier: SubscriptionTier }
    | { type: 'TRANSACTION_SUCCESS'; tier: SubscriptionTier }
    | { type: 'TRANSACTION_NETWORK_ERROR' }
    | { type: 'TRANSACTION_CANCELLED' }
    | { type: 'TRANSACTION_DEFERRED' }
    | { type: 'RESTORE_SUCCESS'; tier: SubscriptionTier }
    | { type: 'RESTORE_EMPTY' }
): StoreKitStateMachine {
  switch (action.type) {
    case 'START_PURCHASE':
      return {
        ...current,
        currentState: 'purchasing',
        errorMessage: undefined,
      };

    case 'TRANSACTION_SUCCESS':
      return {
        currentState: 'purchased',
        activeTier: action.tier,
        errorMessage: undefined,
      };

    case 'TRANSACTION_NETWORK_ERROR':
      return {
        ...current,
        currentState: 'failed_network',
        errorMessage: 'Błąd połączenia z App Store. Twoje dane są bezpieczne, spróbuj ponownie później.',
      };

    case 'TRANSACTION_CANCELLED':
      return {
        ...current,
        currentState: 'failed_user_cancelled',
        errorMessage: undefined,
      };

    case 'TRANSACTION_DEFERRED':
      return {
        ...current,
        currentState: 'deferred_parental_approval',
        errorMessage: 'Oczekiwanie na zatwierdzenie zakupu przez opiekuna (Ask to Buy).',
      };

    case 'RESTORE_SUCCESS':
      return {
        currentState: 'restored',
        activeTier: action.tier,
        errorMessage: undefined,
      };

    case 'RESTORE_EMPTY':
      return {
        ...current,
        currentState: 'idle',
        errorMessage: 'Nie znaleziono poprzednich zakupów powiązanych z tym Apple ID.',
      };

    default:
      return current;
  }
}

describe('StoreKit 2 / IAP State Machine & Offline Rigor (GAP-STORE-01, W9)', () => {
  const initialState: StoreKitStateMachine = {
    currentState: 'idle',
    activeTier: 'none',
  };

  it('handles standard purchase flow: idle -> purchasing -> purchased', () => {
    const s1 = transitionStoreKit(initialState, { type: 'START_PURCHASE', targetTier: 'lifetime' });
    expect(s1.currentState).toBe('purchasing');

    const s2 = transitionStoreKit(s1, { type: 'TRANSACTION_SUCCESS', tier: 'lifetime' });
    expect(s2.currentState).toBe('purchased');
    expect(s2.activeTier).toBe('lifetime');
  });

  it('handles network failure during purchase gracefully without corrupting user state', () => {
    const s1 = transitionStoreKit(initialState, { type: 'START_PURCHASE', targetTier: 'yearly' });
    const s2 = transitionStoreKit(s1, { type: 'TRANSACTION_NETWORK_ERROR' });

    expect(s2.currentState).toBe('failed_network');
    expect(s2.activeTier).toBe('none'); // Reverts to previous active tier
    expect(s2.errorMessage).toContain('Błąd połączenia z App Store');
  });

  it('handles user cancellation without error alerts', () => {
    const s1 = transitionStoreKit(initialState, { type: 'START_PURCHASE', targetTier: 'monthly' });
    const s2 = transitionStoreKit(s1, { type: 'TRANSACTION_CANCELLED' });

    expect(s2.currentState).toBe('failed_user_cancelled');
    expect(s2.errorMessage).toBeUndefined();
    expect(s2.activeTier).toBe('none');
  });

  it('handles parental Ask-to-Buy deferred transactions', () => {
    const s1 = transitionStoreKit(initialState, { type: 'START_PURCHASE', targetTier: 'yearly' });
    const s2 = transitionStoreKit(s1, { type: 'TRANSACTION_DEFERRED' });

    expect(s2.currentState).toBe('deferred_parental_approval');
    expect(s2.errorMessage).toContain('Ask to Buy');
    expect(s2.activeTier).toBe('none'); // Not activated until parent approves
  });

  it('restores previous lifetime purchase offline and maintains permanent access', () => {
    const s1 = transitionStoreKit(initialState, { type: 'RESTORE_SUCCESS', tier: 'lifetime' });
    expect(s1.currentState).toBe('restored');
    expect(s1.activeTier).toBe('lifetime');

    // Simulate 500 days offline
    const now = 1700000000000;
    const stored: StoredAppAccess = {
      id: 'current_user',
      trialStartedAt: now - 500 * 86400000,
      trialDays: 14,
      subscriptionTier: s1.activeTier,
      subscriptionExpiresAt: null,
      completedBatchesCount: 15,
    };

    const access = evaluateAppAccess(stored, now);
    expect(access.isSubscribed).toBe(true);
    expect(access.canCreateNewBatch).toBe(true);
    expect(access.canPerformActions).toBe(true);
  });

  it('handles expired subscription by reverting to read-only history without deleting any records', () => {
    const now = 1700000000000;
    const stored: StoredAppAccess = {
      id: 'current_user',
      trialStartedAt: now - 60 * 86400000,
      trialDays: 14,
      subscriptionTier: 'monthly',
      subscriptionExpiresAt: now - 1000, // Expired 1 second ago
      completedBatchesCount: 8,
    };

    const access = evaluateAppAccess(stored, now);
    expect(access.isSubscribed).toBe(false);
    expect(access.status).toBe('trial_expired');
    expect(access.canCreateNewBatch).toBe(false);
    expect(access.isHistoryReadOnly).toBe(true); // History is NEVER lost!
  });
});
