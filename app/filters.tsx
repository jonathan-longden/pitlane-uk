import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '../src/components/Chip';
import { activeFilterCount } from '../src/lib/filter';
import { useFilters } from '../src/state/FiltersContext';
import { CATEGORIES, REGIONS, type EventCategory, type Region } from '../src/types';
import { colors, radius, spacing, type } from '../src/theme';

const TIME_WINDOWS: { label: string; days: number | null }[] = [
  { label: 'Any time', days: null },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 31 },
  { label: 'Next 3 months', days: 92 },
];

/** Adds or removes a value from a filter array. */
function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FiltersScreen() {
  const router = useRouter();
  const { filters, patch, reset } = useFilters();
  const count = activeFilterCount(filters);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>When</Text>
        <View style={styles.chipWrap}>
          {TIME_WINDOWS.map((window) => (
            <Chip
              key={window.label}
              label={window.label}
              selected={filters.withinDays === window.days}
              onPress={() => patch({ withinDays: window.days })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Region</Text>
        <View style={styles.chipWrap}>
          {REGIONS.map((region: Region) => (
            <Chip
              key={region}
              label={region}
              selected={filters.regions.includes(region)}
              onPress={() => patch({ regions: toggle(filters.regions, region) })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Type of meet</Text>
        <View style={styles.chipWrap}>
          {CATEGORIES.map((category: EventCategory) => (
            <Chip
              key={category}
              label={category}
              selected={filters.categories.includes(category)}
              onPress={() => patch({ categories: toggle(filters.categories, category) })}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Entry</Text>
        <View style={styles.chipWrap}>
          <Chip
            label="Free entry only"
            selected={filters.freeOnly}
            onPress={() => patch({ freeOnly: !filters.freeOnly })}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={reset}
          disabled={count === 0}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.secondaryButton,
            count === 0 && { opacity: 0.4 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.secondaryText}>Clear all</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.primaryText}>
            {count === 0 ? 'Show all meets' : `Show results (${count} filter${count === 1 ? '' : 's'})`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...type.caption,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  secondaryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    ...type.label,
    color: colors.textMuted,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  primaryText: {
    ...type.label,
    color: colors.white,
  },
});
