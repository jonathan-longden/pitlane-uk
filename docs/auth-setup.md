# Setting up accounts

The whole sign-in flow is built. It will not work until a Supabase project is
connected, because accounts need a server to store and verify them — that
cannot come from a catalogue bundled into the app.

Until then the app runs exactly as it did before: everything works, there are
just no accounts, and the sign-in screen says so rather than failing at a button.

---

## 1. Create the Supabase project

You have to do this — creating accounts on your behalf is not something I can do.

1. Sign up at [supabase.com](https://supabase.com) (free tier is fine)
2. Create a project, region **London (eu-west-2)** for UK users
3. **Project Settings → API** gives you two values

Put them in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

For cloud builds:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://xxxx.supabase.co
```

### Is the anon key a secret?

No. It is designed to be public and is baked into the app bundle — anyone can
read it out. What protects your data is **row-level security** on your tables,
which is why you must enable RLS on every table you create. The
**service-role** key *is* a secret and must never appear in this app.

---

## 2. Email sign-up

Works as soon as the project exists. In **Authentication → Providers → Email**:

- Leave **Confirm email** on. The app already handles the "check your inbox"
  state that this produces.
- Supabase's built-in email sender is rate-limited and not for production. Add
  your own SMTP under **Project Settings → Auth** before launch, or confirmation
  emails will quietly stop arriving.

---

## 3. Google

1. [Google Cloud console](https://console.cloud.google.com) → **APIs & Services
   → Credentials → Create OAuth client ID → Web application**
2. Authorised redirect URI:
   `https://<your-project>.supabase.co/auth/v1/callback`
3. Paste the client ID and secret into Supabase → **Authentication → Providers
   → Google**

You will also need to complete Google's **OAuth consent screen**, and if you
request anything beyond basic profile and email, Google verification can take
weeks. Basic profile and email — which is all this app uses — does not need it.

---

## 4. Microsoft (Hotmail, Outlook, Live)

There is no separate "Hotmail" login. Hotmail, Outlook.com and Live addresses
are all Microsoft accounts, handled by one provider.

1. [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID → App
   registrations → New registration**
2. Under **Supported account types**, choose
   **"Accounts in any organizational directory and personal Microsoft accounts"**
   — miss this and Hotmail/Outlook users are rejected while work accounts
   still work, which is a confusing bug to chase later
3. Redirect URI (Web): `https://<your-project>.supabase.co/auth/v1/callback`
4. **Certificates & secrets** → new client secret
5. Paste the application (client) ID and secret into Supabase →
   **Authentication → Providers → Azure**

---

## 5. Apple — not optional on iOS

**App Store Review Guideline 4.8.** An app that offers third-party sign-in must
also offer an equivalent privacy-preserving option, and Sign in with Apple is
what satisfies it. Shipping Google and Microsoft without Apple is a rejection,
and it is one of the most common rejections there is.

It needs a paid Apple Developer account:

1. [developer.apple.com](https://developer.apple.com) → **Certificates,
   Identifiers & Profiles**
2. Enable **Sign in with Apple** on your App ID
3. Create a **Services ID** — this is the OAuth client ID
4. Return URL: `https://<your-project>.supabase.co/auth/v1/callback`
5. Create a **Key** with Sign in with Apple enabled, download the `.p8`
6. Supabase → **Authentication → Providers → Apple**: Services ID, Team ID,
   Key ID and the `.p8` contents

---

## 6. Redirect URLs

Supabase → **Authentication → URL Configuration → Redirect URLs**. Add every
one the app can use, or sign-in completes and then strands the user:

```
pitlaneuk://auth/callback
pitlaneuk://auth/reset
http://localhost:8081/auth/callback
https://jonathan-longden.github.io/pitlane-uk/auth/callback
```

The `pitlaneuk://` scheme is set in `app.json` and is how the native app gets
control back after the browser hands off.

---

## 7. Account deletion — required by both stores

Apple has required in-app account deletion since 2022, and Google Play requires
a deletion route too. The More tab already has the button; it calls a Supabase
Edge Function named `delete-account`, because deleting a user needs the
service-role key and that key must never be in the app.

Create `supabase/functions/delete-account/index.ts`:

```ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  // Service-role client: lives only on the server.
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Identify the caller from their own token, so a user can only delete
  // themselves.
  const { data, error } = await admin.auth.getUser(authHeader.replace('Bearer ', ''));
  if (error || !data.user) return new Response('Unauthorized', { status: 401 });

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) return new Response(deleteError.message, { status: 500 });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

Deploy it:

```bash
npx supabase functions deploy delete-account
```

Until it is deployed, the delete button returns an error saying so.

---

## 8. What this changes about your store submissions

Adding accounts changes what the app collects, in the same way adding an ad
network would. Before shipping a build with auth enabled:

- **Privacy policy** — must say you store email addresses and account
  identifiers. `docs/privacy-policy.md` has a section for this; it is currently
  written for the no-accounts version.
- **Apple App Privacy** — declare Contact Info (email) and Identifiers (user
  ID), linked to the user
- **Google Play Data safety** — declare personal info collected, how it is
  handled, and that users can request deletion
- **Sign in with Apple** — see section 5
- **Account deletion** — see section 7

None of this is optional, and all of it is quicker to do now than after a
rejection.
