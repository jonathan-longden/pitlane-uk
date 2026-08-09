import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigationApps, openNavigation } from '../lib/navigation';
import type { CarEvent } from '../types';
import { colors, radius, spacing, type } from '../theme';

interface DirectionsSheetProps {
  event: CarEvent | null;
  visible: boolean;
  onClose: () => void;
}

/** Lets the driver pick which navigation app takes them to the meet. */
export function DirectionsSheet({ event, visible, onClose }: DirectionsSheetProps) {
  const insets = useSafeAreaInsets();
  const apps = navigationApps();

  if (!event) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.grabber} />

        <Text style={styles.title}>Directions</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {event.venue}, {event.postcode}
        </Text>

        <View style={styles.options}>
          {apps.map((app) => (
            <Pressable
              key={app.id}
              onPress={() => {
                openNavigation(app, event);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Open in ${app.label}`}
              style={({ pressed }) => [styles.option, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={app.icon} size={21} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionLabel}>{app.label}</Text>
                <Text style={styles.optionDetail}>{app.detail}</Text>
              </View>
              <Ionicons name="open-outline" size={17} color={colors.textFaint} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footnote}>
          If the app isn’t installed, the route opens in your browser instead.
        </Text>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cancel, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  options: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  optionLabel: {
    ...type.heading,
    color: colors.text,
  },
  optionDetail: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: 1,
  },
  footnote: {
    ...type.caption,
    color: colors.textFaint,
    marginTop: spacing.md,
    lineHeight: 17,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
  },
  cancelText: {
    ...type.label,
    color: colors.textMuted,
  },
});
