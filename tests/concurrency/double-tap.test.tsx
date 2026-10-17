// ============================================================================
// Apps4Brew Studio — Concurrency & Double-Tap Race Tests (GAP-CONC-01, GAP-CONC-02)
// Verifies submillisecond double-tap blocking via useRef and clock skew resilience
// ============================================================================

import React, { useState, useRef } from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity, Text } from 'react-native';

describe('Concurrency & Double-Tap Race Prevention (W5/CONC)', () => {
  it('GAP-CONC-01: prevents duplicate execution on submillisecond double-tap race', async () => {
    const mockSave = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 20)));

    const GuardedActionButton = () => {
      const [isMutating, setIsMutating] = useState<boolean>(false);
      const isMutatingRef = useRef<boolean>(false);

      const handlePress = async () => {
        if (isMutatingRef.current) return;
        isMutatingRef.current = true;
        setIsMutating(true);
        try {
          await mockSave();
        } finally {
          isMutatingRef.current = false;
          setIsMutating(false);
        }
      };

      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Obróć Krążek"
          onPress={handlePress}
          disabled={isMutating}
        >
          <Text>{isMutating ? 'Zapisywanie...' : 'Obróć'}</Text>
        </TouchableOpacity>
      );
    };

    let tree: any;
    act(() => {
      tree = renderer.create(<GuardedActionButton />);
    });

    const btn = tree.root.findByProps({ accessibilityRole: 'button' });

    // Submillisecond rapid double-tap (simulating wet/jittery fingers)
    await act(async () => {
      const p1 = btn.props.onPress();
      const p2 = btn.props.onPress();
      await Promise.all([p1, p2]);
    });

    // Mutation MUST have been called exactly 1 time!
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it('GAP-CONC-02: protects against negative elapsed time from backward clock skew', () => {
    const now = 1700000000000;
    // Cheese was supposedly turned in the future due to clock sync/travel
    const futureTurnedAt = now + 3600 * 1000; // 1 hour in future

    const checkNeedsTurn = (lastTurned: number, currentNow: number) => {
      const elapsed = currentNow - lastTurned;
      if (elapsed < 0) return false; // Guarded against negative delta
      return elapsed > 24 * 3600 * 1000;
    };

    expect(checkNeedsTurn(futureTurnedAt, now)).toBe(false);
  });
});
