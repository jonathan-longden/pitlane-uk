import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ADS_ENABLED, houseAdFor, type AdPlacement } from '../lib/ads';
import { colors, radius, spacing, type } from '../theme';

interface AdSlotProps {
  placement: AdPlacement;
  /** Varies which house ad is shown; pass the list index or similar. */
  seed?: number;
}

/**
 * A single advertising slot.
 *
 * Every slot is labelled. Both stores and UK advertising rules require paid
 * placements to be distinguishable from content, and a feed where ads look
 * like listings is exactly the thing that gets an app pulled.
 */
export function AdSlot({ placement, seed = 0 }: AdSlotProps) {
  if (!ADS_ENABLED) return null;

  const ad = houseAdFor(placement, seed);

  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <View style={styles.labelRow}>
        <Text style={styles.label}>Ad</Text>
        <Text style={styles.eyebrow}>{ad.eyebrow}</Text>
      </View>

      <Pressable
        onPress={() => Linking.openURL(ad.href).catch(() => {})}
        accessibilityRole="button"
        accessibilityLabel={`${ad.headline}. ${ad.cta}`}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.headline}>{ad.headline}</Text>
        <Text style={styles.body}>{ad.body}</Text>
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>{ad.cta}</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.accent} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  label: {
    ...type.caption,
    fontSize: 10,
    fontWeight: '800',
    color: colors.textFaint,
    letterSpacing: 0.8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  eyebrow: {
    ...type.caption,
    fontSize: 10,
    color: colors.textFaint,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  headline: {
    ...type.title,
    color: colors.text,
  },
  body: {
    ...type.body,
    color: colors.textMuted,
    lineHeight: 21,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  cta: {
    ...type.label,
    color: colors.accent,
  },
});
