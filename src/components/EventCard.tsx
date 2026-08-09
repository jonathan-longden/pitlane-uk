import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDateLabel, formatDistance, formatPrice, formatTime } from '../lib/format';
import { distanceKm, type Coords } from '../lib/geo';
import type { CarEvent } from '../types';
import { colors, radius, spacing, type } from '../theme';
import { SaveButton } from './SaveButton';

interface EventCardProps {
  event: CarEvent;
  /** When supplied, the card shows how far the meet is from the user. */
  origin?: Coords | null;
}

export function EventCard({ event, origin }: EventCardProps) {
  const distance = origin ? distanceKm(origin, event) : null;

  return (
    <Link href={{ pathname: '/event/[id]', params: { id: event.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${event.title}, ${event.town}, ${formatDateLabel(event.startsAt)}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.headerRow}>
          <View style={styles.whenPill}>
            <Text style={styles.whenText}>{formatDateLabel(event.startsAt)}</Text>
          </View>
          <Text style={styles.time}>{formatTime(event.startsAt)}</Text>
          <View style={styles.spacer} />
          <SaveButton eventId={event.id} size={20} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.textFaint} />
          <Text style={styles.meta} numberOfLines={1}>
            {event.venue}, {event.town}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.price, event.pricePence === 0 && styles.priceFree]}>
            {formatPrice(event.pricePence)}
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.footerMeta}>{event.region}</Text>
          {distance !== null && (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.footerMeta}>{formatDistance(distance)}</Text>
            </>
          )}
        </View>

        <View style={styles.tagRow}>
          {event.categories.slice(0, 3).map((category) => (
            <View key={category} style={styles.tag}>
              <Text style={styles.tagText}>{category}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  spacer: {
    flex: 1,
  },
  whenPill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  whenText: {
    ...type.caption,
    color: colors.accent,
    fontWeight: '700',
  },
  time: {
    ...type.caption,
    color: colors.textMuted,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  meta: {
    ...type.body,
    color: colors.textMuted,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    ...type.label,
    color: colors.text,
  },
  priceFree: {
    color: colors.success,
  },
  dot: {
    color: colors.textFaint,
  },
  footerMeta: {
    ...type.caption,
    color: colors.textFaint,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  tagText: {
    ...type.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
});
