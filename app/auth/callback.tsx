import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/state/AuthContext';
import { colors, spacing, type } from '../../src/theme';

/**
 * Where the OAuth provider returns to on native.
 *
 * The session is established by the Supabase client, not here — this screen
 * only waits for it to appear and then gets out of the way. It exists at all
 * because without a route at this path the redirect lands on "Unmatched
 * Route", which looks like the sign-in failed even when it succeeded.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    // Replace, so the callback URL is not left in the history stack.
    router.replace(user ? '/about' : '/sign-in');
  }, [ready, user, router]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text}>Finishing sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.bg,
  },
  text: {
    ...type.body,
    color: colors.textMuted,
  },
});
