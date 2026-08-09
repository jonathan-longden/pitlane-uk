import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { usePhotos } from '../state/PhotosContext';
import type { CarEvent, EventCategory } from '../types';
import { colors, radius, spacing, type } from '../theme';

/**
 * Cover art for a listing.
 *
 * Order of preference: a photo this user attached, then the listing's own
 * photo, then a generated cover. The generated cover is deliberately not a
 * stock car photo — it is tinted by the kind of meet, so a wall of listings
 * still reads as varied without pretending to show the actual venue.
 */

const CATEGORY_TINT: Record<EventCategory, [string, string]> = {
  'Cars & Coffee': ['#3A2A1B', '#12161B'],
  'Evening Meet': ['#1B1F3A', '#0E1116'],
  'Show & Shine': ['#3A1B2E', '#12161B'],
  'Track Day': ['#3A2416', '#101419'],
  Classic: ['#2C2A1A', '#111519'],
  JDM: ['#3A1B22', '#101419'],
  Euro: ['#16283A', '#0E1218'],
  American: ['#2A1B3A', '#101419'],
  Modified: ['#33241C', '#101419'],
  Supercar: ['#3A2016', '#111519'],
  Drift: ['#20303A', '#0F1318'],
  Auction: ['#25301F', '#101419'],
};

const CATEGORY_ICON: Record<EventCategory, keyof typeof Ionicons.glyphMap> = {
  'Cars & Coffee': 'cafe-outline',
  'Evening Meet': 'moon-outline',
  'Show & Shine': 'sparkles-outline',
  'Track Day': 'speedometer-outline',
  Classic: 'time-outline',
  JDM: 'flash-outline',
  Euro: 'car-sport-outline',
  American: 'flame-outline',
  Modified: 'construct-outline',
  Supercar: 'diamond-outline',
  Drift: 'sync-outline',
  Auction: 'pricetag-outline',
};

/**
 * The photo a listing will actually show, if it has one. Undefined means only
 * the generated cover is available — which callers may choose not to render.
 */
export function useCoverUri(event: CarEvent): string | undefined {
  const { photoFor } = usePhotos();
  return photoFor(event.id) ?? event.imageUrl;
}

interface EventCoverProps {
  event: CarEvent;
  height: number;
  style?: StyleProp<ViewStyle>;
  /** Rounds only the top corners, for cards where the cover sits at the top. */
  roundedTopOnly?: boolean;
}

export function EventCover({ event, height, style, roundedTopOnly }: EventCoverProps) {
  const { photoFor } = usePhotos();
  const uri = photoFor(event.id) ?? event.imageUrl;
  const primary = event.categories[0] ?? 'Evening Meet';
  const tint = CATEGORY_TINT[primary];

  const shape = [
    styles.base,
    { height },
    roundedTopOnly ? styles.roundedTop : styles.rounded,
    style,
  ];

  if (uri) {
    return (
      <View style={shape}>
        <Image
          source={{ uri }}
          style={styles.fill}
          contentFit="cover"
          transition={180}
          accessibilityLabel={`Photo of ${event.title}`}
        />
        <LinearGradient
          colors={['transparent', 'rgba(11,13,16,0.85)']}
          style={styles.scrim}
          pointerEvents="none"
        />
        {event.imageCredit && <Text style={styles.credit}>© {event.imageCredit}</Text>}
      </View>
    );
  }

  return (
    <View style={shape}>
      <LinearGradient colors={tint} style={styles.fill} />
      <Ionicons
        name={CATEGORY_ICON[primary]}
        size={height * 0.42}
        color="rgba(255,255,255,0.09)"
        style={styles.ghostIcon}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{primary}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surfaceHigh,
    justifyContent: 'flex-end',
  },
  rounded: {
    borderRadius: radius.lg,
  },
  roundedTop: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  ghostIcon: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11,13,16,0.6)',
  },
  badgeText: {
    ...type.caption,
    color: colors.text,
    fontWeight: '700',
  },
  credit: {
    ...type.caption,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    margin: spacing.sm,
    alignSelf: 'flex-end',
  },
});
