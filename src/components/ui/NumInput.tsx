// ============================================================================
// Apps4Brew Studio — FERMENT NumInput Component (BR-TEST-005, NFR-INT-003)
// Accepts comma and dot decimals, preserves typing state, protects against drift
// ============================================================================

import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, TextStyle, StyleProp, View, Text } from 'react-native';
import { wInKeep } from '../../lib/unit-converter';

export interface NumInputProps {
  value: number;
  onChangeValue: (val: number) => void;
  unit?: 'kg' | 'lb' | 'g' | 'oz';
  stored?: number;
  min?: number;
  max?: number;
  step?: number;
  accessibilityLabel: string;
  testID?: string;
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  editable?: boolean;
}

export const NumInput: React.FC<NumInputProps> = ({
  value,
  onChangeValue,
  unit,
  stored,
  min = 0,
  max = 999999,
  accessibilityLabel,
  testID,
  style,
  placeholder,
  editable = true,
}) => {
  const [text, setText] = useState<string>(String(value ?? 0));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setText(String(value ?? 0));
    }
  }, [value, isFocused]);

  const handleChangeText = (raw: string) => {
    // Pozwala na stany pośrednie w trakcie pisania: pusty ciąg, pojedynczy przecinek/kropkę
    setText(raw);

    const normalized = raw.trim().replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      if (unit) {
        const kept = wInKeep(raw, unit, stored ?? value);
        onChangeValue(kept);
      } else {
        onChangeValue(parsed);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const normalized = text.trim().replace(',', '.');
    let parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      parsed = stored ?? value ?? 0;
    } else {
      if (parsed < min) parsed = min;
      if (parsed > max) parsed = max;
    }

    if (unit) {
      const kept = wInKeep(String(parsed), unit, stored ?? value);
      onChangeValue(kept);
      setText(String(kept));
    } else {
      onChangeValue(parsed);
      setText(String(parsed));
    }
  };

  return (
    <TextInput
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
      keyboardType="decimal-pad"
      editable={editable}
      value={text}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      placeholder={placeholder}
      placeholderTextColor="#78716C"
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#44403C',
    backgroundColor: '#292524',
    color: '#FAFAF9',
    fontSize: 16,
  },
});
