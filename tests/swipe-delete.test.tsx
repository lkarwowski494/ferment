// ============================================================================
// Apps4Brew Studio — S4 Accessible Delete Guard (tests/swipe-delete.test.tsx)
// Eliminates test theater by testing the genuine production DeletableRow UI component
// ============================================================================

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { DeletableRow } from '../src/components/ui';

describe('S4 Accessible Delete Guard (tests/swipe-delete.test.tsx)', () => {
  it('Production DeletableRow exposes accessible delete action and visible touch target >= 44pt', () => {
    const onDelete = jest.fn();

    let tree: any;
    act(() => {
      tree = renderer.create(
        <DeletableRow title="Gouda Zagrodowa #001" onDelete={onDelete} />
      );
    });

    // 1. Visible accessible button with >= 44pt touch target
    const btn = tree.root.findByProps({ accessibilityLabel: 'Usuń Gouda Zagrodowa #001' });
    expect(btn).toBeTruthy();

    const flatStyle = Array.isArray(btn.props.style) ? Object.assign({}, ...btn.props.style) : btn.props.style || {};
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);

    act(() => {
      btn.props.onPress();
    });
    expect(onDelete).toHaveBeenCalledTimes(1);

    // 2. VoiceOver / TalkBack accessibility action on row
    const row = tree.root.findByProps({ testID: 'deletable-row' });
    expect(row.props.accessibilityActions).toEqual([{ name: 'delete', label: 'Usuń' }]);

    act(() => {
      row.props.onAccessibilityAction({ nativeEvent: { actionName: 'delete' } });
    });
    expect(onDelete).toHaveBeenCalledTimes(2);
  });
});
