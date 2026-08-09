import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/EmptyState';
import { EventCard } from '../../src/components/EventCard';
import { daysUntil } from '../../src/lib/format';
import { useEvents } from '../../src/state/useEvents';
import { useSaved } from '../../src/state/SavedContext';
import { useUserLocation } from '../../src/state/useUserLocation';
import { colors, spacing, type } from '../../src/theme';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events } = useEvents();
  const { savedIds, ready } = useSaved();
  const { coords } = useUserLocation();

  const { upcoming, past } = useMemo(() => {
    const saved = events.filter((e) => savedIds.includes(e.id));
    return {
      upcoming: saved
        .filter((e) => daysUntil(e.startsAt) >= 0)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
      past: saved.filter((e) => daysUntil(e.startsAt) < 0),
    };
  }, [events, savedIds]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.subtitle}>
          {ready && upcoming.length > 0
            ? `${upcoming.length} coming up${past.length ? ` · ${past.length} been and gone` : ''}`
            : 'Your shortlist, kept on this device'}
        </Text>
      </View>

      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} origin={coords} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        contentContainerStyle={[
          styles.list,
          upcoming.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          ready ? (
            <EmptyState
              icon="bookmark-outline"
              title="Nothing saved yet"
              message="Tap the bookmark on any meet and it will show up here, ready for when you are deciding what to do at the weekend."
              actionLabel="Browse meets"
              onAction={() => router.push('/')}
            />
          ) : null
        }
      />
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
    paddingBottom: spacing.sm,
  },
  title: {
    ...type.display,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: 2,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
});
