import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase client, or null when the project has not been configured.
 *
 * The keys come from the environment. `EXPO_PUBLIC_` variables are inlined into
 * the app bundle at build time, which is correct here: the anon key is designed
 * to be public and is only useful alongside row-level security policies on the
 * database. It is not a secret. The service-role key, which is, must never
 * appear in this app.
 *
 * When the variables are absent the app still runs — it simply has no accounts,
 * which is exactly how it behaved before auth existed. Screens check
 * `isAuthConfigured` and say so plainly rather than failing at a login button.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isAuthConfigured = Boolean(url && anonKey);

/**
 * Asks the project which third-party providers are actually switched on.
 *
 * Each provider needs an OAuth app registered with Google/Microsoft/Apple as
 * well as being enabled in Supabase, so it is entirely normal for some to be
 * off. Offering a button that cannot work is worse than not offering it, so
 * the sign-in screen only shows providers this returns.
 *
 * Returns null if the check itself fails, which the caller treats as "show
 * everything" rather than hiding all sign-in options behind a network blip.
 */
export async function fetchEnabledProviders(): Promise<string[] | null> {
  if (!url || !anonKey) return [];
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { external?: Record<string, boolean> };
    return Object.entries(body.external ?? {})
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
  } catch {
    return null;
  }
}

export const supabase: SupabaseClient | null = isAuthConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        // On native there is no browser storage, so sessions are persisted in
        // AsyncStorage. On web, Supabase's own localStorage handling is used.
        ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
        autoRefreshToken: true,
        persistSession: true,
        // Native has no URL bar for Supabase to read the OAuth callback from;
        // the redirect is handled explicitly in SupabaseAuth.
        detectSessionInUrl: Platform.OS === 'web',
      },
    })
  : null;
