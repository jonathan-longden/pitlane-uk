import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../theme';
import type { EventMapProps } from './EventMap.types';

/**
 * Web build of the map tab. react-native-maps is native-only, so rather than
 * ship a broken tab the web build gets a schematic plot of the same pins,
 * positioned by latitude/longitude over a UK bounding box. Tapping a pin
 * selects the event exactly as the native map does.
 */

// Bounding box covering the UK including the Northern Isles.
const BOUNDS = { north: 59.4, south: 49.8, west: -8.2, east: 1.9 };

function project(latitude: number, longitude: number) {
  const left = ((longitude - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100;
  const top = ((BOUNDS.north - latitude) / (BOUNDS.north - BOUNDS.south)) * 100;
  return { left: `${Math.min(97, Math.max(1, left))}%`, top: `${Math.min(97, Math.max(1, top))}%` };
}

export function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.plot}>
        {events.map((event) => {
          const selected = event.id === selectedId;
          return (
            <Pressable
              key={event.id}
              onPress={() => onSelect(event.id)}
              accessibilityRole="button"
              accessibilityLabel={`${event.title} in ${event.town}`}
              style={[styles.pin, project(event.latitude, event.longitude) as never]}
            >
              <Ionicons
                name={selected ? 'location' : 'location-outline'}
                size={selected ? 30 : 22}
                color={selected ? colors.accent : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.noticeRow}
      >
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textFaint} />
          <Text style={styles.noticeText}>
            Interactive maps are available in the iOS and Android apps.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
  },
  plot: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    position: 'relative',
    overflow: 'hidden',
  },
  pin: {
    position: 'absolute',
    transform: [{ translateX: -11 }, { translateY: -22 }],
  },
  noticeRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  noticeText: {
    ...type.caption,
    color: colors.textFaint,
  },
});
