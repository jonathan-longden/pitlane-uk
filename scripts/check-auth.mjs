/**
 * Reports which sign-in providers are actually live on the Supabase project.
 *
 * Run with:  npm run check:auth
 *
 * Useful because enabling a provider takes effect immediately with no rebuild —
 * the app discovers providers at runtime — so this answers "did that work?"
 * without opening the dashboard or guessing from the UI.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env reader — enough for KEY=value lines. */
function readEnv() {
  const env = {};
  try {
    for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] = match[2].trim();
    }
  } catch {
    // No .env is a valid state; handled below.
  }
  return { ...env, ...process.env };
}

const env = readEnv();
const url = env.EXPO_PUBLIC_SUPABASE_URL;
const key = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('No Supabase config found. Set EXPO_PUBLIC_SUPABASE_URL and');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY in .env — see .env.example.');
  process.exit(1);
}

const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
if (!res.ok) {
  console.error(`Could not reach the project: HTTP ${res.status}`);
  process.exit(1);
}

const settings = await res.json();
const external = settings.external ?? {};

// Only the providers this app offers; the API lists every one Supabase supports.
const OFFERED = [
  ['email', 'Email and password'],
  ['google', 'Google'],
  ['azure', 'Microsoft (Hotmail, Outlook, Live)'],
  ['apple', 'Apple — required on iOS if any other provider is offered'],
];

console.log(`\nProject: ${url}\n`);
for (const [id, label] of OFFERED) {
  console.log(`  ${external[id] ? '[on ]' : '[off]'}  ${label}`);
}

console.log('');
console.log(`  new sign-ups allowed:  ${settings.disable_signup ? 'no' : 'yes'}`);
console.log(
  `  email confirmation:    ${settings.mailer_autoconfirm ? 'off (auto-confirmed)' : 'required'}`,
);

const live = OFFERED.filter(([id]) => id !== 'email' && external[id]);
if (live.length === 0) {
  console.log('\nNo third-party providers are enabled, so the app shows only the');
  console.log('email form. See docs/auth-setup.md.\n');
} else {
  console.log(`\n${live.length} third-party provider(s) live. The app picks these up`);
  console.log('at runtime — no rebuild or redeploy needed.\n');
}
