import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useSaved } from '../state/SavedContext';
import { colors, radius } from '../theme';

interface SaveButtonProps {
  eventId: string;
  size?: number;
}

export function SaveButton({ eventId, size = 22 }: SaveButtonProps) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(eventId);

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        toggleSaved(eventId);
      }}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from saved' : 'Save this meet'}
      accessibilityState={{ selected: saved }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={size}
        color={saved ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(11, 13, 16, 0.55)',
  },
  pressed: {
    opacity: 0.6,
  },
});
