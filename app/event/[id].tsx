import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '../../src/components/Chip';
import { EmptyState } from '../../src/components/EmptyState';
import { SaveButton } from '../../src/components/SaveButton';
import { eventRepository } from '../../src/data/repository';
import {
  formatDistance,
  formatFullDate,
  formatPrice,
  formatTimeRange,
} from '../../src/lib/format';
import { distanceKm } from '../../src/lib/geo';
import { useUserLocation } from '../../src/state/useUserLocation';
import type { CarEvent } from '../../src/types';
import { colors, radius, spacing, type } from '../../src/theme';

/** Opens the platform's own maps app at the venue. */
function openDirections(event: CarEvent) {
  const label = encodeURIComponent(`${event.venue}, ${event.postcode}`);
  const coords = `${event.latitude},${event.longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${coords}&q=${label}`
      : Platform.OS === 'android'
        ? `geo:${coords}?q=${coords}(${label})`
        : `https://www.google.com/maps/search/?api=1&query=${coords}`;
  Linking.openURL(url).catch(() => {});
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { coords } = useUserLocation();
  const [event, setEvent] = useState<CarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    eventRepository
      .getEvent(id)
      .then((result) => {
        if (!cancelled) setEvent(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centre}>
        <EmptyState
          icon="help-circle-outline"
          title="Meet not found"
          message="This listing may have been removed or the link is out of date."
          actionLabel="Back to Discover"
          onAction={() => router.replace('/')}
        />
      </View>
    );
  }

  const distance = coords ? distanceKm(coords, event) : null;

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          headerRight: () => <SaveButton eventId={event.id} />,
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 56 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.whenBanner}>
          <Ionicons name="calendar-outline" size={16} color={colors.accent} />
          <Text style={styles.whenText}>{formatFullDate(event.startsAt)}</Text>
          <Text style={styles.whenDot}>·</Text>
          <Text style={styles.whenText}>
            {formatTimeRange(event.startsAt, event.endsAt)}
          </Text>
        </View>

        <Text style={styles.title}>{event.title}</Text>

        {event.recurrence && (
          <View style={styles.recurrenceRow}>
            <Ionicons name="repeat" size={14} color={colors.textFaint} />
            <Text style={styles.recurrence}>{event.recurrence}</Text>
          </View>
        )}

        <View style={styles.tagRow}>
          {event.categories.map((category) => (
            <Chip key={category} label={category} tone="accent" />
          ))}
        </View>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Entry</Text>
            <Text
              style={[styles.statValue, event.pricePence === 0 && { color: colors.success }]}
            >
              {formatPrice(event.pricePence)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Booking</Text>
            <Text style={styles.statValue}>
              {event.bookingRequired ? 'Required' : 'Turn up'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>
              {distance !== null ? formatDistance(distance) : '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Where</Text>
        <Pressable
          onPress={() => openDirections(event)}
          accessibilityRole="button"
          accessibilityLabel={`Get directions to ${event.venue}`}
          style={({ pressed }) => [styles.venueCard, pressed && { opacity: 0.8 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.venueName}>{event.venue}</Text>
            <Text style={styles.venueAddress}>
              {event.addressLine}, {event.town}, {event.postcode}
            </Text>
            <Text style={styles.venueRegion}>{event.region}</Text>
          </View>
          <View style={styles.directionsButton}>
            <Ionicons name="navigate" size={18} color={colors.white} />
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>About this meet</Text>
        <Text style={styles.description}>{event.description}</Text>

        <Text style={styles.sectionLabel}>On site</Text>
        <View style={styles.tagRow}>
          {event.facilities.map((facility) => (
            <Chip key={facility} label={facility} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Organiser</Text>
        <View style={styles.organiserCard}>
          <Text style={styles.organiserName}>{event.organiser}</Text>
          {event.website && (
            <Pressable
              onPress={() => Linking.openURL(event.website!).catch(() => {})}
              accessibilityRole="link"
              style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="globe-outline" size={15} color={colors.accent} />
              <Text style={styles.linkText}>Visit organiser website</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.disclaimer}>
          Details can change at short notice. Check with the organiser before travelling,
          and respect the venue — noise complaints are what close these meets down.
        </Text>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={() =>
            Share.share({
              message: `${event.title} — ${formatFullDate(event.startsAt)} at ${event.venue}, ${event.town}. Found on PitLane UK.`,
            }).catch(() => {})
          }
          accessibilityRole="button"
          accessibilityLabel="Share this meet"
          style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={() => openDirections(event)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="navigate-outline" size={18} color={colors.white} />
          <Text style={styles.primaryText}>Directions</Text>
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
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 3,
  },
  whenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  whenText: {
    ...type.label,
    color: colors.accent,
  },
  whenDot: {
    color: colors.accent,
  },
  title: {
    ...type.display,
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 34,
  },
  recurrenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  recurrence: {
    ...type.caption,
    color: colors.textFaint,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  statLabel: {
    ...type.caption,
    color: colors.textFaint,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValue: {
    ...type.heading,
    color: colors.text,
  },
  sectionLabel: {
    ...type.caption,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  venueName: {
    ...type.heading,
    color: colors.text,
  },
  venueAddress: {
    ...type.body,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 20,
  },
  venueRegion: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: spacing.xs,
  },
  directionsButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    ...type.body,
    color: colors.textMuted,
    lineHeight: 23,
  },
  organiserCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  organiserName: {
    ...type.heading,
    color: colors.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    ...type.label,
    color: colors.accent,
  },
  disclaimer: {
    ...type.caption,
    color: colors.textFaint,
    lineHeight: 18,
    marginTop: spacing.xl,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  primaryText: {
    ...type.label,
    color: colors.white,
  },
});
