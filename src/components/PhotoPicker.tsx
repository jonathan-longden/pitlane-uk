import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePhotos } from '../state/PhotosContext';
import { colors, radius, spacing, type } from '../theme';

interface PhotoPickerProps {
  eventId: string;
}

/**
 * Attaches a photo to a listing.
 *
 * The photo is stored on this device only — see PhotosContext for why. The
 * copy below says so rather than implying it has been published, because a
 * user who thinks they have posted a photo to a public listing and finds out
 * later that nobody saw it has been misled.
 */
export function PhotoPicker({ eventId }: PhotoPickerProps) {
  const { photoFor, setPhoto, removePhoto } = usePhotos();
  const [busy, setBusy] = useState(false);
  const existing = photoFor(eventId);

  async function pick(source: 'library' | 'camera') {
    try {
      setBusy(true);
      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          source === 'camera'
            ? 'Allow camera access in your device settings to photograph this meet.'
            : 'Allow photo access in your device settings to pick a picture.',
        );
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [16, 9] })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              quality: 0.8,
              allowsEditing: true,
              aspect: [16, 9],
            });

      if (!result.canceled && result.assets[0]) {
        setPhoto(eventId, result.assets[0].uri);
      }
    } catch {
      Alert.alert('Could not add photo', 'Something went wrong picking that image.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="camera-outline" size={19} color={colors.accent} />
        <Text style={styles.title}>
          {existing ? 'Your photo' : 'Add a photo of this meet'}
        </Text>
      </View>

      <Text style={styles.body}>
        {existing
          ? 'Saved on this device. Photos are not shared with other people yet — that needs listing accounts, which are not live.'
          : 'Pictures make a listing stand out. Yours is kept on this device only for now.'}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => pick('library')}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Choose a photo from your library"
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="images-outline" size={16} color={colors.text} />
          <Text style={styles.actionText}>{existing ? 'Replace' : 'Choose'}</Text>
        </Pressable>

        <Pressable
          onPress={() => pick('camera')}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Take a photo"
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="camera" size={16} color={colors.text} />
          <Text style={styles.actionText}>Camera</Text>
        </Pressable>

        {existing && (
          <Pressable
            onPress={() => removePhoto(eventId)}
            accessibilityRole="button"
            accessibilityLabel="Remove your photo"
            style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Remove</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...type.heading,
    color: colors.text,
  },
  body: {
    ...type.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceHigh,
  },
  actionText: {
    ...type.label,
    color: colors.text,
  },
});
