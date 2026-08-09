import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaved } from '../../src/state/SavedContext';
import { useUserLocation } from '../../src/state/useUserLocation';
import { colors, radius, spacing, type } from '../../src/theme';

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail?: string;
  onPress?: () => void;
}

function Row({ icon, label, detail, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.row, pressed && onPress && { opacity: 0.7 }]}
    >
      <Ionicons name={icon} size={19} color={colors.textMuted} />
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1 }} />
      {detail && <Text style={styles.rowDetail}>{detail}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />}
    </Pressable>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { savedIds } = useSaved();
  const { status, request } = useUserLocation();

  const locationDetail =
    status === 'granted'
      ? 'On'
      : status === 'denied'
        ? 'Off — change in device settings'
        : 'Off';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>More</Text>

      <Text style={styles.sectionLabel}>Your app</Text>
      <View style={styles.card}>
        <Row icon="bookmark-outline" label="Saved meets" detail={`${savedIds.length}`} />
        <View style={styles.divider} />
        <Row
          icon="location-outline"
          label="Location"
          detail={locationDetail}
          onPress={status === 'granted' ? undefined : request}
        />
      </View>

      <Text style={styles.sectionLabel}>Get involved</Text>
      <View style={styles.card}>
        <Row
          icon="megaphone-outline"
          label="List your meet"
          detail="Coming soon"
        />
        <View style={styles.divider} />
        <Row
          icon="flag-outline"
          label="Report a listing"
          onPress={() =>
            Linking.openURL(
              'mailto:hello@pitlane.uk?subject=PitLane%20listing%20report',
            ).catch(() => {})
          }
        />
      </View>

      <Text style={styles.sectionLabel}>Turning up safely</Text>
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          Meets survive on goodwill. Keep the noise down when you arrive and leave, never
          take part in anti-social driving, and follow whatever the organisers and
          landowner ask on the day. A single bad evening is how car parks get closed to
          everyone.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.card}>
        <Row
          icon="information-circle-outline"
          label="Version"
          detail={`${Constants.expoConfig?.version ?? '1.0.0'} (${Platform.OS})`}
        />
        <View style={styles.divider} />
        <Row icon="server-outline" label="Event data" detail="Bundled catalogue" />
      </View>

      <Text style={styles.footnote}>
        Event details are collected from public listings and can change at short notice.
        Always check with the organiser before setting off.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...type.display,
    color: colors.text,
  },
  sectionLabel: {
    ...type.caption,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowLabel: {
    ...type.body,
    color: colors.text,
  },
  rowDetail: {
    ...type.caption,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 19 + spacing.md,
  },
  noteCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  noteText: {
    ...type.body,
    color: colors.text,
    lineHeight: 22,
  },
  footnote: {
    ...type.caption,
    color: colors.textFaint,
    lineHeight: 18,
    marginTop: spacing.xl,
  },
});
