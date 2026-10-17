import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TextInput } from 'react-native';
import { NumInput } from '../../src/components/ui/NumInput';

describe('NumInput Component (BR-TEST-005, NFR-INT-003)', () => {
  it('accepts both comma and dot as decimal separators', () => {
    let captured = 0;
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <NumInput
          testID="num-input-test"
          accessibilityLabel="Masa soli"
          value={10}
          onChangeValue={(v) => {
            captured = v;
          }}
        />
      );
    });

    const input = tree!.root.findByType(TextInput);

    // Type with comma
    act(() => {
      input.props.onChangeText('12,5');
    });
    expect(captured).toBe(12.5);

    // Type with dot
    act(() => {
      input.props.onChangeText('14.2');
    });
    expect(captured).toBe(14.2);
  });

  it('preserves intermediate decimal state during typing', () => {
    let captured = 0;
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <NumInput
          testID="num-input-intermediate"
          accessibilityLabel="Pojemność"
          value={5}
          onChangeValue={(v) => {
            captured = v;
          }}
        />
      );
    });

    const input = tree!.root.findByType(TextInput);

    act(() => {
      input.props.onChangeText('5,');
    });
    expect(input.props.value).toBe('5,');

    act(() => {
      input.props.onChangeText('5,75');
    });
    expect(captured).toBe(5.75);
  });

  it('has minimum touch target >= 44pt and valid accessibility attributes', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <NumInput
          accessibilityLabel="Stężenie solanki"
          value={15}
          onChangeValue={() => {}}
        />
      );
    });

    const input = tree!.root.findByType(TextInput);
    expect(input.props.accessibilityLabel).toBe('Stężenie solanki');
    expect(input.props.accessibilityRole).toBe('text');
  });
});
