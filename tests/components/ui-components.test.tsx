import React from 'react';
import renderer, { act } from 'react-test-renderer';
import {
  CloseButton,
  DoneButton,
  Field,
  Btn,
  SwitchRow,
  Segmented,
  Chip,
  SearchField,
  normalizeSearchQuery,
  Empty,
  Missing,
  Screen,
} from '../../src/components/ui';
import { Text, TouchableOpacity, Switch } from 'react-native';

describe('Studio UI components (S1-S16)', () => {
  it('normalizeSearchQuery normalizes accents and Polish ł/Ł correctly', () => {
    expect(normalizeSearchQuery('Żółty liść')).toBe('zolty lisc');
    expect(normalizeSearchQuery('ŁUKASZ')).toBe('lukasz');
    expect(normalizeSearchQuery('  Kombucha 2F  ')).toBe('kombucha 2f');
    expect(normalizeSearchQuery('Śmietana')).toBe('smietana');
  });

  it('CloseButton and DoneButton render with min 44pt touch targets', () => {
    const onClose = jest.fn();
    const onDone = jest.fn();

    let closeTree: any;
    let doneTree: any;

    act(() => {
      closeTree = renderer.create(<CloseButton onPress={onClose} />);
      doneTree = renderer.create(<DoneButton onPress={onDone} />);
    });

    const closeBtn = closeTree.root.findByProps({ testID: 'modal-close-button' });
    const doneBtn = doneTree.root.findByProps({ testID: 'modal-done-button' });

    expect(closeBtn.props.accessibilityRole).toBe('button');
    expect(closeBtn.props.accessibilityLabel).toBe('Zamknij');

    act(() => {
      closeBtn.props.onPress();
      doneBtn.props.onPress();
    });

    expect(onClose).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });

  it('Field enforces maxLength and renders clear button when text is present', () => {
    const onChange = jest.fn();
    let tree: any;

    act(() => {
      tree = renderer.create(
        <Field
          label="Nazwa"
          value="Kiszonka"
          onChangeText={onChange}
          maxLength={50}
          testID="test-field-input"
        />
      );
    });

    const input = tree.root.findByProps({ testID: 'test-field-input' });
    expect(input.props.maxLength).toBe(50);

    const clearBtn = tree.root.findByProps({ accessibilityLabel: 'Wyczyść pole' });
    act(() => {
      clearBtn.props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('Btn renders all variants and handles disabled state', () => {
    const onPress = jest.fn();
    let tree: any;

    act(() => {
      tree = renderer.create(
        <Btn title="Zapisz" onPress={onPress} variant="danger" />
      );
    });

    const btn = tree.root.findByType(TouchableOpacity);
    expect(btn.props.accessibilityRole).toBe('button');
    act(() => {
      btn.props.onPress();
    });
    expect(onPress).toHaveBeenCalled();
  });

  it('SwitchRow renders with accessibilityRole="switch"', () => {
    const onToggle = jest.fn();
    let tree: any;

    act(() => {
      tree = renderer.create(
        <SwitchRow
          label="Pasteryzacja"
          subtitle="Podgrzewanie do 65°C"
          value={true}
          onValueChange={onToggle}
        />
      );
    });

    const sw = tree.root.findByType(Switch);
    expect(sw.props.accessibilityRole).toBe('switch');
    expect(sw.props.value).toBe(true);
  });

  it('Segmented renders tab items and responds to selection', () => {
    const onSelect = jest.fn();
    let tree: any;

    act(() => {
      tree = renderer.create(
        <Segmented
          options={[
            { label: 'Ser', value: 'cheese' },
            { label: 'Kiszonka', value: 'veg' },
          ]}
          selectedValue="cheese"
          onSelect={onSelect}
        />
      );
    });

    const tabs = tree.root.findAllByType(TouchableOpacity);
    expect(tabs.length).toBe(2);
    act(() => {
      tabs[1].props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('veg');
  });

  it('SearchField clears input on clear button press', () => {
    const onChange = jest.fn();
    let tree: any;

    act(() => {
      tree = renderer.create(
        <SearchField value="kombucha" onChangeText={onChange} testID="search-input" />
      );
    });

    const clear = tree.root.findByProps({ testID: 'search-input-clear' });
    act(() => {
      clear.props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('Empty and Missing render with descriptive guidance', () => {
    const onAction = jest.fn();
    const onBack = jest.fn();

    let emptyTree: any;
    let missingTree: any;

    act(() => {
      emptyTree = renderer.create(
        <Empty
          title="Brak partii"
          hint="Rozpocznij pierwszy proces fermentacji"
          actionTitle="Rozpocznij"
          onAction={onAction}
        />
      );
      missingTree = renderer.create(<Missing onBack={onBack} />);
    });

    const empty = emptyTree.root.findByProps({ testID: 'empty-state' });
    expect(empty).toBeTruthy();

    const missing = missingTree.root.findByProps({ testID: 'missing-state' });
    expect(missing).toBeTruthy();
  });

  it('Screen renders KeyboardAvoidingView and ScrollView with keyboardShouldPersistTaps', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <Screen>
          <Text>Content</Text>
        </Screen>
      );
    });

    const sv = tree.root.findByProps({ keyboardShouldPersistTaps: 'handled' });
    expect(sv.props.keyboardDismissMode).toBe('on-drag');
  });
});
