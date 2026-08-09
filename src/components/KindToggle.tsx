import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

/** Map filter: both kinds, or one of them. */
export type KindFilter = 'all' | 'meet' | 'event';

const SEGMENTS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'meet', label: 'Meets' },
  { value: 'event', label: 'Events' },
];

interface KindToggleProps {
  value: KindFilter;
  onChange: (value: KindFilter) => void;
}

/** Segmented control for switching the map between meets and events. */
export function KindToggle({ value, onChange }: KindToggleProps) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {SEGMENTS.map((segment) => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Show ${segment.label.toLowerCase()}`}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && !selected && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  segment: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  segmentSelected: {
    backgroundColor: colors.accent,
  },
  label: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.white,
    fontWeight: '700',
  },
});
