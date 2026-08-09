import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { fetchEnabledProviders, isAuthConfigured, supabase } from '../auth/client';
import type { AuthResult, AuthUser, OAuthProviderId } from '../auth/types';

interface AuthContextValue {
  user: AuthUser | null;
  /** False until the stored session has been read back. */
  ready: boolean;
  configured: boolean;
  /** Providers switched on in the project. null means the check failed. */
  enabledProviders: string[] | null;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithProvider: (provider: OAuthProviderId) => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  message:
    'Accounts are not set up yet. This build has no Supabase project connected — see docs/auth-setup.md.',
};

function toUser(raw: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): AuthUser {
  const meta = raw.user_metadata ?? {};
  const name = (meta.full_name ?? meta.name ?? meta.display_name) as string | undefined;
  const avatar = (meta.avatar_url ?? meta.picture) as string | undefined;
  return {
    id: raw.id,
    email: raw.email ?? null,
    displayName: name ?? null,
    avatarUrl: avatar ?? null,
  };
}

/** Turns Supabase's error text into something worth showing a person. */
function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'That email and password combination is not right.';
  }
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'There is already an account with that email. Try signing in instead.';
  }
  if (m.includes('password should be')) {
    return 'Pick a longer password — at least 8 characters.';
  }
  if (m.includes('email not confirmed')) {
    return 'Check your inbox and confirm your email address first.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts. Wait a minute and try again.';
  }
  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(!isAuthConfigured);
  const [enabledProviders, setEnabledProviders] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchEnabledProviders().then((list) => {
      if (!cancelled) setEnabledProviders(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setUser(data.session?.user ? toUser(data.session.user) : null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toUser(session.user) : null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResult> => {
      if (!supabase) return NOT_CONFIGURED;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) return { ok: false, message: friendly(error.message) };
      // With email confirmation on, Supabase returns a user but no session.
      return { ok: true, needsEmailConfirmation: !data.session };
    },
    [],
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return NOT_CONFIGURED;
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return error ? { ok: false, message: friendly(error.message) } : { ok: true };
    },
    [],
  );

  const signInWithProvider = useCallback(
    async (provider: OAuthProviderId): Promise<AuthResult> => {
      if (!supabase) return NOT_CONFIGURED;

      const redirectTo = Linking.createURL('/auth/callback');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          // On native the browser is opened manually so the callback can be
          // captured; letting Supabase redirect would leave the app behind.
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) return { ok: false, message: friendly(error.message) };
      if (Platform.OS === 'web' || !data?.url) return { ok: true };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') {
        return { ok: false, message: 'Sign-in was cancelled.' };
      }

      // The provider returns tokens in the URL fragment; exchange them for a
      // session so onAuthStateChange picks the user up.
      const fragment = result.url.split('#')[1] ?? '';
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (!access_token || !refresh_token) {
        return { ok: false, message: 'Sign-in did not complete. Please try again.' };
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      return sessionError
        ? { ok: false, message: friendly(sessionError.message) }
        : { ok: true };
    },
    [],
  );

  const sendPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return NOT_CONFIGURED;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: Linking.createURL('/auth/reset'),
    });
    return error ? { ok: false, message: friendly(error.message) } : { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setUser(null);
  }, []);

  /**
   * Both stores require account deletion to be possible from inside the app.
   * Supabase cannot delete a user from the client with the anon key, so this
   * calls a `delete-account` Edge Function that holds the service-role key.
   * See docs/auth-setup.md — without that function deployed, this fails.
   */
  const deleteAccount = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return NOT_CONFIGURED;
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) {
      return {
        ok: false,
        message:
          'Could not delete the account. The delete-account function may not be deployed yet.',
      };
    }
    await supabase.auth.signOut();
    setUser(null);
    return { ok: true };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      configured: isAuthConfigured,
      enabledProviders,
      signUpWithEmail,
      signInWithEmail,
      signInWithProvider,
      sendPasswordReset,
      signOut,
      deleteAccount,
    }),
    [
      user,
      ready,
      enabledProviders,
      signUpWithEmail,
      signInWithEmail,
      signInWithProvider,
      sendPasswordReset,
      signOut,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}
