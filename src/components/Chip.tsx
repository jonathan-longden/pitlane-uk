import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Non-interactive chips are used for facility tags on the detail screen. */
  tone?: 'default' | 'accent';
}

export function Chip({ label, selected = false, onPress, tone = 'default' }: ChipProps) {
  const body = (
    <View
      style={[
        styles.chip,
        selected && styles.chipSelected,
        tone === 'accent' && !selected && styles.chipAccent,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    ...type.caption,
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
