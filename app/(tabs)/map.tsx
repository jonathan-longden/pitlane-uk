import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventMap } from '../../src/components/EventMap';
import { activeFilterCount, applyFilters } from '../../src/lib/filter';
import { formatDateLabel, formatPrice, formatTime } from '../../src/lib/format';
import { useEvents } from '../../src/state/useEvents';
import { useFilters } from '../../src/state/FiltersContext';
import { useUserLocation } from '../../src/state/useUserLocation';
import type { CarEvent } from '../../src/types';
import { colors, radius, spacing, type } from '../../src/theme';

const CARD_WIDTH = Math.min(320, Dimensions.get('window').width - spacing.lg * 3);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events } = useEvents();
  const { filters } = useFilters();
  const { coords, status, request } = useUserLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<FlatList<CarEvent>>(null);

  const visible = useMemo(() => applyFilters(events, filters), [events, filters]);
  const filterCount = activeFilterCount(filters);

  // Keep the selection valid when the filters change underneath it.
  useEffect(() => {
    if (visible.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !visible.some((e) => e.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

  // Tapping a pin scrolls the carousel to the matching card.
  const selectFromMap = (id: string) => {
    setSelectedId(id);
    const index = visible.findIndex((e) => e.id === id);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as CarEvent | undefined;
    if (first) setSelectedId(first.id);
  });

  return (
    <View style={styles.screen}>
      <EventMap
        events={visible}
        selectedId={selectedId}
        onSelect={selectFromMap}
        initialCentre={coords}
        showsUserLocation={status === 'granted'}
      />

      <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
        <View style={styles.countPill}>
          <Ionicons name="car-sport" size={14} color={colors.accent} />
          <Text style={styles.countText}>
            {visible.length} {visible.length === 1 ? 'meet' : 'meets'}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        {status !== 'granted' && (
          <Pressable
            onPress={request}
            accessibilityRole="button"
            accessibilityLabel="Centre map on my location"
            style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="locate-outline" size={19} color={colors.text} />
          </Pressable>
        )}
        <Pressable
          onPress={() => router.push('/filters')}
          accessibilityRole="button"
          accessibilityLabel={`Filters, ${filterCount} active`}
          style={({ pressed }) => [
            styles.iconButton,
            filterCount > 0 && styles.iconButtonActive,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={19}
            color={filterCount > 0 ? colors.white : colors.text}
          />
        </Pressable>
      </View>

      {visible.length > 0 && (
        <FlatList
          ref={listRef}
          data={visible}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + spacing.md}
          decelerationRate="fast"
          // Without this the list stretches to fill the screen and the cards
          // grow with it, hiding the map behind them.
          style={styles.carouselList}
          contentContainerStyle={[
            styles.carousel,
            { paddingBottom: insets.bottom + spacing.md },
          ]}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onScrollToIndexFailed={() => {
            // Index outside the rendered window; the carousel settles on its own.
          }}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + spacing.md,
            offset: (CARD_WIDTH + spacing.md) * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.card,
                item.id === selectedId && styles.cardSelected,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.cardWhen}>
                {formatDateLabel(item.startsAt)} · {formatTime(item.startsAt)}
              </Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardVenue} numberOfLines={1}>
                {item.venue}, {item.town}
              </Text>
              <View style={styles.cardFooter}>
                <Text
                  style={[
                    styles.cardPrice,
                    item.pricePence === 0 && { color: colors.success },
                  ]}
                >
                  {formatPrice(item.pricePence)}
                </Text>
                <Text style={styles.cardRegion}>{item.region}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  countText: {
    ...type.caption,
    color: colors.text,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  carouselList: {
    flexGrow: 0,
    flexShrink: 0,
  },
  carousel: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    // Keeps each card at its natural height rather than filling the row.
    alignItems: 'flex-end',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 3,
  },
  cardSelected: {
    borderColor: colors.accent,
  },
  cardWhen: {
    ...type.caption,
    color: colors.accent,
    fontWeight: '700',
  },
  cardTitle: {
    ...type.heading,
    color: colors.text,
  },
  cardVenue: {
    ...type.caption,
    color: colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  cardPrice: {
    ...type.label,
    color: colors.text,
  },
  cardRegion: {
    ...type.caption,
    color: colors.textFaint,
  },
});
