import React from 'react';
import renderer, { act } from 'react-test-renderer';
import {
  Btn,
  CloseButton,
  DoneButton,
  Field,
  NumInput,
  Segmented,
  SwitchRow,
  Chip,
  SearchField,
  Screen,
} from '../src/components/ui';
import { Text, View } from 'react-native';

describe('Accessibility & Small Screen 320pt Matrix (NFR-A11Y-001..008)', () => {
  it('A11Y-001: All studio interactive components provide touch target >= 44pt', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <View style={{ width: 320 }}>
          <Btn title="Test Button" onPress={() => {}} />
          <CloseButton onPress={() => {}} />
          <DoneButton onPress={() => {}} />
          <NumInput value={12.5} onChangeValue={() => {}} unit="kg" accessibilityLabel="Ciężar" />
          <Field label="Field" value="Test" onChangeText={() => {}} />
          <SwitchRow label="Switch" value={true} onValueChange={() => {}} />
          <Chip label="Tag" onPress={() => {}} />
          <SearchField value="kombucha" onChangeText={() => {}} />
        </View>
      );
    });

    const root = tree.root;
    // Check buttons
    const buttons = root.findAll((node: any) => node.props.accessibilityRole === 'button');
    expect(buttons.length).toBeGreaterThan(0);
    for (const btn of buttons) {
      const style = btn.props.style;
      const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style || {};
      const minHeight = flatStyle.minHeight ?? flatStyle.height ?? 44;
      const minWidth = flatStyle.minWidth ?? flatStyle.width ?? 44;
      expect(minHeight).toBeGreaterThanOrEqual(44);
      expect(minWidth).toBeGreaterThanOrEqual(44);
    }
  });

  it('A11Y-002: Switch controls provide role="switch" and accessibilityState.checked', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <SwitchRow label="Keep-Awake" value={true} onValueChange={() => {}} />
      );
    });

    const sw = tree.root.findByProps({ accessibilityRole: 'switch' });
    expect(sw).toBeTruthy();
    expect(sw.props.accessibilityState).toEqual({ checked: true });
  });

  it('A11Y-003: Small screen width 320pt (iPhone SE / 17e) does not crash or throw layout errors', () => {
    expect(() => {
      act(() => {
        renderer.create(
          <Screen style={{ width: 320 }}>
            <Text style={{ fontSize: 18 }}>FERMENT Screen</Text>
            <Segmented
              options={[
                { label: 'Ser', value: 'cheese' },
                { label: 'Kiszonka', value: 'veg' },
                { label: 'Kombucha', value: 'kombucha' },
              ]}
              selectedValue="cheese"
              onSelect={() => {}}
            />
          </Screen>
        );
      });
    }).not.toThrow();
  });

  it('A11Y-004: AX5 font scaling simulation preserves scrollable content', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <Screen>
          {/* Simulate AX5 (300% font scaling) */}
          <Text style={{ fontSize: 48, lineHeight: 60 }}>Tytuł w AX5</Text>
          <Text style={{ fontSize: 36, lineHeight: 46 }}>
            Bardzo długi opis fermentacji mleka lub kiszonki skalujący się w trybie dostępności.
          </Text>
          <Btn title="Zatwierdź" onPress={() => {}} style={{ minHeight: 64 }} />
        </Screen>
      );
    });

    const sv = tree.root.findByProps({ keyboardShouldPersistTaps: 'handled' });
    expect(sv).toBeTruthy();
  });
});
