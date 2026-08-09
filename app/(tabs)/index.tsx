import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdSlot } from '../../src/components/AdSlot';
import { EmptyState } from '../../src/components/EmptyState';
import { EventCard } from '../../src/components/EventCard';
import { ADS_EVERY_N_ITEMS } from '../../src/lib/ads';
import { activeFilterCount, applyFilters, groupByWhen } from '../../src/lib/filter';
import { distanceKm } from '../../src/lib/geo';
import { useEvents } from '../../src/state/useEvents';
import { useFilters } from '../../src/state/FiltersContext';
import { useUserLocation } from '../../src/state/useUserLocation';
import { colors, radius, spacing, type } from '../../src/theme';

type SortMode = 'date' | 'distance';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events, loading, error, reload } = useEvents();
  const { filters, patch, reset } = useFilters();
  const { coords, status, request } = useUserLocation();
  const [sort, setSort] = useState<SortMode>('date');

  const canSortByDistance = coords !== null;

  const sections = useMemo(() => {
    const filtered = applyFilters(events, filters);

    if (sort === 'distance' && coords) {
      const byDistance = [...filtered].sort(
        (a, b) => distanceKm(coords, a) - distanceKm(coords, b),
      );
      return byDistance.length ? [{ title: 'Nearest to you', data: byDistance }] : [];
    }

    return groupByWhen(filtered);
  }, [events, filters, sort, coords]);

  const total = sections.reduce((n, s) => n + s.data.length, 0);
  const filterCount = activeFilterCount(filters);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>
          Pit<Text style={styles.wordmarkAccent}>Lane</Text>
        </Text>
        <Text style={styles.tagline}>Car meets & events across the UK</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={17} color={colors.textFaint} />
          <TextInput
            value={filters.query}
            onChangeText={(query) => patch({ query })}
            placeholder="Search meets, venues, towns"
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search car meets"
          />
          {filters.query.length > 0 && (
            <Pressable onPress={() => patch({ query: '' })} hitSlop={8} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={17} color={colors.textFaint} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => router.push('/filters')}
          accessibilityRole="button"
          accessibilityLabel={`Filters, ${filterCount} active`}
          style={({ pressed }) => [
            styles.filterButton,
            filterCount > 0 && styles.filterButtonActive,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={19}
            color={filterCount > 0 ? colors.white : colors.text}
          />
          {filterCount > 0 && <Text style={styles.filterCount}>{filterCount}</Text>}
        </Pressable>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>
          {total} {total === 1 ? 'meet' : 'meets'}
        </Text>
        <View style={styles.spacer} />
        <Pressable
          onPress={() => setSort('date')}
          style={[styles.sortTab, sort === 'date' && styles.sortTabActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: sort === 'date' }}
        >
          <Text style={[styles.sortText, sort === 'date' && styles.sortTextActive]}>
            Soonest
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (canSortByDistance) setSort('distance');
            else request();
          }}
          style={[styles.sortTab, sort === 'distance' && styles.sortTabActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: sort === 'distance' }}
        >
          <Text style={[styles.sortText, sort === 'distance' && styles.sortTextActive]}>
            {canSortByDistance ? 'Nearest' : 'Near me'}
          </Text>
        </Pressable>
      </View>

      {status === 'denied' && sort === 'distance' && (
        <Text style={styles.locationNote}>
          Location access is off, so distances are hidden. Turn it on in your device
          settings to sort by how close a meet is.
        </Text>
      )}

      {loading ? (
        <View style={styles.centre}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <>
              <EventCard event={item} origin={coords} />
              {/* An ad every few listings, rather than a fixed banner that
                  covers content or gets ignored after the first scroll. */}
              {index > 0 && (index + 1) % ADS_EVERY_N_ITEMS === 0 && (
                <View style={styles.adSpacing}>
                  <AdSlot placement="discover-feed" seed={index} />
                </View>
              )}
            </>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          contentContainerStyle={[
            styles.listContent,
            sections.length === 0 && styles.listContentEmpty,
          ]}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={reload}
              tintColor={colors.textMuted}
            />
          }
          ListEmptyComponent={
            error ? (
              <EmptyState
                icon="cloud-offline-outline"
                title="Something went wrong"
                message={error}
                actionLabel="Try again"
                onAction={reload}
              />
            ) : (
              <EmptyState
                icon="car-sport-outline"
                title="No meets match that"
                message="Try widening your search, or clear the filters to see everything coming up across the UK."
                actionLabel={filterCount > 0 || filters.query ? 'Clear filters' : undefined}
                onAction={filterCount > 0 || filters.query ? reset : undefined}
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  wordmark: {
    ...type.display,
    color: colors.text,
  },
  wordmarkAccent: {
    color: colors.accent,
  },
  tagline: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    ...type.body,
    // Removes the default web focus ring, which does not match the design.
    outlineStyle: 'none',
  } as never,
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterCount: {
    ...type.caption,
    color: colors.white,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  spacer: {
    flex: 1,
  },
  resultCount: {
    ...type.label,
    color: colors.textMuted,
  },
  sortTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  sortTabActive: {
    backgroundColor: colors.surfaceHigh,
  },
  sortText: {
    ...type.caption,
    color: colors.textFaint,
  },
  sortTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  locationNote: {
    ...type.caption,
    color: colors.textFaint,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    lineHeight: 17,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  adSpacing: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    ...type.label,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
