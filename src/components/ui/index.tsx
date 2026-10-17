import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { NumInput } from './NumInput';

export { NumInput };

// ==========================================
// S1: CloseButton & DoneButton
// ==========================================
export interface CloseButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  accessibilityLabel = 'Zamknij',
  testID = 'modal-close-button',
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    onPress={onPress}
    style={styles.headerButton}
  >
    <Text style={styles.closeButtonText}>✕</Text>
  </TouchableOpacity>
);

export const DoneButton: React.FC<CloseButtonProps> = ({
  onPress,
  accessibilityLabel = 'Gotowe',
  testID = 'modal-done-button',
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    onPress={onPress}
    style={styles.headerButton}
  >
    <Text style={styles.doneButtonText}>{accessibilityLabel}</Text>
  </TouchableOpacity>
);

// ==========================================
// S2: Field
// ==========================================
export interface FieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  accessibilityLabel?: string;
  testID?: string;
  error?: string;
  multiline?: boolean;
  style?: ViewStyle;
}

export const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength = 200,
  accessibilityLabel,
  testID,
  error,
  multiline = false,
  style,
}) => (
  <View style={[styles.fieldContainer, style]}>
    {label && <Text style={styles.fieldLabel}>{label}</Text>}
    <View style={[styles.fieldInputWrapper, !!error && styles.fieldInputError]}>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        maxLength={maxLength}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        testID={testID}
      />
      {value.length > 0 && !multiline && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Wyczyść pole"
          onPress={() => onChangeText('')}
          style={styles.fieldClearButton}
        >
          <Text style={styles.fieldClearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={styles.fieldErrorText}>{error}</Text>}
  </View>
);

// ==========================================
// S13: Btn (primary, secondary, ghost, danger)
// ==========================================
export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface BtnProps {
  title: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export const Btn: React.FC<BtnProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  testID,
  style,
}) => {
  const getBtnStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.btnDanger;
      case 'secondary':
        return styles.btnSecondary;
      case 'ghost':
        return styles.btnGhost;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'ghost':
        return styles.btnGhostText;
      case 'secondary':
        return styles.btnSecondaryText;
      case 'danger':
      case 'primary':
      default:
        return styles.btnPrimaryText;
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={[styles.btnBase, getBtnStyle(), disabled && styles.btnDisabled, style]}
    >
      <Text style={[styles.btnTextBase, getTextStyle(), disabled && styles.btnDisabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ==========================================
// S6: SwitchRow, Segmented, Chip
// ==========================================
export interface SwitchRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export const SwitchRow: React.FC<SwitchRowProps> = ({
  label,
  subtitle,
  value,
  onValueChange,
  accessibilityLabel,
  testID,
  style,
}) => (
  <View style={[styles.switchRowContainer, style]}>
    <View style={styles.switchRowTextContainer}>
      <Text style={styles.switchRowLabel}>{label}</Text>
      {subtitle && <Text style={styles.switchRowSubtitle}>{subtitle}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ checked: value }}
      testID={testID}
      trackColor={{ false: '#334155', true: '#10b981' }}
      thumbColor="#ffffff"
    />
  </View>
);

export interface SegmentedProps<T extends string> {
  options: { label: string; value: T }[];
  selectedValue: T;
  onSelect: (val: T) => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export function Segmented<T extends string>({
  options,
  selectedValue,
  onSelect,
  accessibilityLabel,
  testID,
  style,
}: SegmentedProps<T>) {
  if (options.length > 4) {
    console.warn('[NFR-INT-006] Segmented should have between 2 and 4 options. For >4 options use Chip or full list.');
  }

  return (
    <View
      style={[styles.segmentedContainer, style]}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selectedValue;
        return (
          <TouchableOpacity
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={opt.label}
            style={[styles.segmentedOption, isSelected && styles.segmentedOptionSelected]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[styles.segmentedText, isSelected && styles.segmentedTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={accessibilityLabel || label}
    testID={testID}
    onPress={onPress}
    style={[styles.chipBase, selected && styles.chipSelected, style]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ==========================================
// S15: SearchField & Diacritics Normalizer
// ==========================================
export function normalizeSearchQuery(text: string): string {
  return text
    .replace(/[łŁ]/g, (c) => (c === 'ł' ? 'l' : 'L'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = 'Szukaj...',
  accessibilityLabel = 'Szukaj',
  testID = 'search-field',
  style,
}) => (
  <View style={[styles.searchContainer, style]}>
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      autoCapitalize="none"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Wyczyść wyszukiwanie"
        onPress={() => onChangeText('')}
        style={styles.fieldClearButton}
        testID={`${testID}-clear`}
      >
        <Text style={styles.fieldClearText}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ==========================================
// S11 & S12: Empty & Missing
// ==========================================
export interface EmptyProps {
  title: string;
  hint?: string;
  actionTitle?: string;
  onAction?: () => void;
  testID?: string;
  style?: ViewStyle;
}

export const Empty: React.FC<EmptyProps> = ({
  title,
  hint,
  actionTitle,
  onAction,
  testID = 'empty-state',
  style,
}) => (
  <View style={[styles.emptyContainer, style]} testID={testID}>
    <Text style={styles.emptyTitle}>{title}</Text>
    {hint && <Text style={styles.emptyHint}>{hint}</Text>}
    {actionTitle && onAction && (
      <Btn
        title={actionTitle}
        onPress={onAction}
        variant="secondary"
        style={styles.emptyAction}
      />
    )}
  </View>
);

export interface MissingProps {
  title?: string;
  hint?: string;
  onBack: () => void;
  testID?: string;
}

export const Missing: React.FC<MissingProps> = ({
  title = 'Nie znaleziono rekordu',
  hint = 'Ten element mógł zostać usunięty lub nie istnieje.',
  onBack,
  testID = 'missing-state',
}) => (
  <View style={styles.missingContainer} testID={testID}>
    <Text style={styles.missingTitle}>{title}</Text>
    <Text style={styles.missingHint}>{hint}</Text>
    <Btn title="Wróć" onPress={onBack} variant="primary" style={styles.emptyAction} />
  </View>
);

// ==========================================
// S7: Screen
// ==========================================
export interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({ children, style, contentContainerStyle }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={[styles.screenContainer, style]}
  >
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[styles.screenContent, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
);

// ==========================================
// Styles
// ==========================================
const styles = StyleSheet.create({
  headerButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 22,
    fontWeight: 'bold',
  },
  doneButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  fieldInputError: {
    borderColor: '#ef4444',
  },
  fieldInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    paddingVertical: 8,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldClearButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldClearText: {
    color: '#64748b',
    fontSize: 16,
  },
  fieldErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  btnBase: {
    minHeight: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnPrimary: {
    backgroundColor: '#059669',
  },
  btnSecondary: {
    backgroundColor: '#334155',
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: '#dc2626',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnTextBase: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnPrimaryText: {
    color: '#ffffff',
  },
  btnSecondaryText: {
    color: '#f8fafc',
  },
  btnGhostText: {
    color: '#38bdf8',
  },
  btnDisabledText: {
    color: '#94a3b8',
  },
  switchRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 8,
  },
  switchRowTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchRowLabel: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '500',
  },
  switchRowSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  segmentedOption: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  segmentedOptionSelected: {
    backgroundColor: '#059669',
  },
  segmentedText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  segmentedTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chipBase: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#065f46',
    borderColor: '#059669',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#34d399',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 44,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginVertical: 12,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyHint: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyAction: {
    marginTop: 8,
  },
  missingContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1120',
  },
  missingTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  missingHint: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  screenContent: {
    padding: 16,
    flexGrow: 1,
  },
});
