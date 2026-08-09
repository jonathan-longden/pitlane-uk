/**
 * Renders the privacy policy and a support page into the web build as real
 * static HTML.
 *
 * They are deliberately NOT app routes. App Store Connect and Google Play both
 * require a reachable privacy policy URL, and reviewers open it in a plain
 * browser. A single-page-app route on GitHub Pages is served via 404.html and
 * returns an HTTP 404 status — it looks fine to a human but is a genuine 404 to
 * anything checking. A static file at /privacy/ returns 200.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CSS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 40px 20px 80px;
    background: #0B0D10; color: #F2F4F7;
    font: 16px/1.65 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  main { max-width: 720px; margin: 0 auto; }
  a { color: #FF6B2C; }
  h1 { font-size: 32px; letter-spacing: -0.5px; margin: 0 0 8px; }
  h2 { font-size: 22px; margin: 40px 0 12px; }
  h3 { font-size: 17px; margin: 28px 0 8px; color: #98A2B3; }
  p, li { color: #C7CDD6; }
  hr { border: none; border-top: 1px solid #262B33; margin: 40px 0; }
  blockquote {
    margin: 24px 0; padding: 12px 16px;
    background: rgba(255,107,44,0.12); border-radius: 10px;
  }
  code { background: #14171C; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
  pre { background: #14171C; padding: 16px; border-radius: 10px; overflow-x: auto; }
  .wrap { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 15px; }
  th, td { border: 1px solid #262B33; padding: 9px 12px; text-align: left; }
  th { background: #14171C; }
  .brand { font-weight: 800; font-size: 20px; text-decoration: none; display: inline-block; margin-bottom: 28px; }
  .brand span { color: #FF6B2C; }
  footer { margin-top: 56px; color: #667085; font-size: 14px; }
`;

function page(title, bodyHtml, base) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — PitLane UK</title>
<style>${CSS}</style>
</head>
<body>
<main>
<a class="brand" href="${base}/">Pit<span>Lane</span></a>
${bodyHtml}
<footer>PitLane UK · <a href="${base}/">Open the app</a></footer>
</main>
</body>
</html>`;
}

/** Tables need a scroll container of their own on a phone. */
function wrapTables(html) {
  return html.replace(/<table>[\s\S]*?<\/table>/g, (t) => `<div class="wrap">${t}</div>`);
}

const SUPPORT_MD = `# Support

Need a hand, or spotted something wrong with a listing?

## Contact

**Email:** hello@pitlane.uk

We aim to reply within a few days. Please include your device and, if it is
about a specific meet, the name of the listing.

## Reporting a listing

Event details come from public listings and can change at short notice. If a
meet has moved, been cancelled, or should not be listed at all, email us and we
will remove or correct it.

If you are an organiser and want a meet listed, taken down, or corrected, email
us from an address associated with the event where possible.

## Your account

You can delete your account and everything attached to it at any time from
**More → Delete my account** inside the app. You do not need to contact us.

## Before you travel

Always check with the organiser before setting off. We are not the organiser of
any event listed and cannot guarantee an event will run.

## Privacy

See our [privacy policy](../privacy/).
`;

const BASE = process.env.PAGES_BASE_URL ?? '';
const dist = join(root, 'dist');

const targets = [
  ['privacy', readFileSync(join(root, 'docs', 'privacy-policy.md'), 'utf8'), 'Privacy Policy'],
  ['support', SUPPORT_MD, 'Support'],
];

for (const [slug, md, title] of targets) {
  const dir = join(dist, slug);
  mkdirSync(dir, { recursive: true });
  const html = wrapTables(marked.parse(md, { async: false }));
  writeFileSync(join(dir, 'index.html'), page(title, html, BASE));
  console.log(`  wrote dist/${slug}/index.html`);
}
