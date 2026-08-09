import type { Ionicons } from '@expo/vector-icons';

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

/**
 * Third-party sign-in options.
 *
 * "Hotmail", "Outlook" and "Live" accounts are all Microsoft accounts, handled
 * by the same Azure provider — there is no separate Hotmail login to add.
 *
 * Apple is not optional. App Store Review Guideline 4.8 requires an equivalent
 * privacy-preserving login wherever an app offers third-party sign-in, and
 * Sign in with Apple is what satisfies it. Shipping Google and Microsoft
 * without it is a rejection.
 */
export type OAuthProviderId = 'google' | 'azure' | 'apple';

export interface OAuthProviderInfo {
  id: OAuthProviderId;
  label: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Only shown on platforms where it is relevant. */
  platforms?: ('ios' | 'android' | 'web')[];
}

export const OAUTH_PROVIDERS: OAuthProviderInfo[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    hint: 'Gmail and Google Workspace accounts',
    icon: 'logo-google',
  },
  {
    id: 'azure',
    label: 'Continue with Microsoft',
    hint: 'Hotmail, Outlook and Live accounts',
    icon: 'logo-microsoft',
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    hint: 'Required on iOS wherever other sign-in options are offered',
    icon: 'logo-apple',
    platforms: ['ios', 'web'],
  },
];

/** A failure worth showing a person, rather than a stack trace. */
export interface AuthResult {
  ok: boolean;
  message?: string;
  /** True when the user must confirm their email before signing in. */
  needsEmailConfirmation?: boolean;
}
