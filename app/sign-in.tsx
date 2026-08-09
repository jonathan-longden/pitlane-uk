import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { OAUTH_PROVIDERS, type OAuthProviderId } from '../src/auth/types';
import { useAuth } from '../src/state/AuthContext';
import { colors, radius, spacing, type } from '../src/theme';

type Mode = 'signIn' | 'signUp';

export default function SignInScreen() {
  const router = useRouter();
  const {
    configured,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    sendPasswordReset,
  } = useAuth();

  const [mode, setMode] = useState<Mode>('signUp');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<null | 'email' | OAuthProviderId>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const providers = OAUTH_PROVIDERS.filter(
    (p) => !p.platforms || p.platforms.includes(Platform.OS as 'ios' | 'android' | 'web'),
  );

  async function submitEmail() {
    setError(null);
    setNotice(null);

    if (!email.includes('@') || password.length < 8) {
      setError('Enter a valid email and a password of at least 8 characters.');
      return;
    }
    if (mode === 'signUp' && name.trim().length < 2) {
      setError('Tell us what to call you.');
      return;
    }

    setBusy('email');
    const result =
      mode === 'signUp'
        ? await signUpWithEmail(email, password, name)
        : await signInWithEmail(email, password);
    setBusy(null);

    if (!result.ok) {
      setError(result.message ?? 'Something went wrong. Try again.');
      return;
    }
    if (result.needsEmailConfirmation) {
      setNotice(`Check ${email.trim()} for a confirmation link, then sign in.`);
      setMode('signIn');
      return;
    }
    router.back();
  }

  async function submitProvider(provider: OAuthProviderId) {
    setError(null);
    setNotice(null);
    setBusy(provider);
    const result = await signInWithProvider(provider);
    setBusy(null);
    if (!result.ok) setError(result.message ?? 'Sign-in failed.');
    else router.back();
  }

  async function forgotPassword() {
    if (!email.includes('@')) {
      setError('Enter your email address first, then tap this again.');
      return;
    }
    setError(null);
    setBusy('email');
    const result = await sendPasswordReset(email);
    setBusy(null);
    if (result.ok) setNotice(`If that address has an account, a reset link is on its way.`);
    else setError(result.message ?? 'Could not send a reset email.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {mode === 'signUp' ? 'Create your account' : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          An account keeps your saved meets in sync across devices. You can carry on
          without one — everything except syncing works signed out.
        </Text>

        {!configured && (
          <View style={styles.warning}>
            <Ionicons name="construct-outline" size={16} color={colors.accent} />
            <Text style={styles.warningText}>
              Accounts are not connected in this build yet, so sign-in will not work.
              See docs/auth-setup.md.
            </Text>
          </View>
        )}

        <View style={styles.providers}>
          {providers.map((provider) => (
            <Pressable
              key={provider.id}
              onPress={() => submitProvider(provider.id)}
              disabled={busy !== null}
              accessibilityRole="button"
              accessibilityLabel={provider.label}
              style={({ pressed }) => [styles.provider, pressed && { opacity: 0.75 }]}
            >
              {busy === provider.id ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name={provider.icon} size={19} color={colors.text} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.providerLabel}>{provider.label}</Text>
                    <Text style={styles.providerHint}>{provider.hint}</Text>
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or use your email</Text>
          <View style={styles.divider} />
        </View>

        {mode === 'signUp' && (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            autoCapitalize="words"
            autoComplete="name"
            accessibilityLabel="Your name"
          />
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          accessibilityLabel="Email address"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={mode === 'signUp' ? 'Password (8+ characters)' : 'Password'}
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
          accessibilityLabel="Password"
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text style={styles.notice}>{notice}</Text>}

        <Pressable
          onPress={submitEmail}
          disabled={busy !== null}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}
        >
          {busy === 'email' ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryText}>
              {mode === 'signUp' ? 'Create account' : 'Sign in'}
            </Text>
          )}
        </Pressable>

        {mode === 'signIn' && (
          <Pressable onPress={forgotPassword} accessibilityRole="button">
            <Text style={styles.link}>Forgotten your password?</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => {
            setMode(mode === 'signUp' ? 'signIn' : 'signUp');
            setError(null);
            setNotice(null);
          }}
          accessibilityRole="button"
        >
          <Text style={styles.link}>
            {mode === 'signUp'
              ? 'Already have an account? Sign in'
              : 'Need an account? Sign up'}
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          By creating an account you agree to your email being stored so we can sign you
          in. You can delete your account, and everything attached to it, from the More
          tab at any time.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  title: {
    ...type.display,
    color: colors.text,
  },
  subtitle: {
    ...type.body,
    color: colors.textMuted,
    lineHeight: 21,
  },
  warning: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  warningText: {
    ...type.caption,
    color: colors.text,
    flex: 1,
    lineHeight: 17,
  },
  providers: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  provider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerLabel: {
    ...type.label,
    color: colors.text,
  },
  providerHint: {
    ...type.caption,
    color: colors.textFaint,
    fontSize: 11,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...type.caption,
    color: colors.textFaint,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    ...type.body,
    outlineStyle: 'none',
  } as never,
  error: {
    ...type.caption,
    color: colors.danger,
    lineHeight: 17,
  },
  notice: {
    ...type.caption,
    color: colors.success,
    lineHeight: 17,
  },
  primary: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryText: {
    ...type.label,
    color: colors.white,
  },
  link: {
    ...type.label,
    color: colors.accent,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  legal: {
    ...type.caption,
    color: colors.textFaint,
    lineHeight: 17,
    marginTop: spacing.md,
  },
});
