/**
 * Rasterises the brand SVGs in assets/brand into every icon the stores and the
 * Expo config need.
 *
 * Run with:  node scripts/generate-icons.mjs
 * Requires sharp, which is not a project dependency because icons only need
 * regenerating when the artwork changes:  npm install --no-save sharp
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const brand = join(assets, 'brand');

const BG = '#0B0D10';
const ACCENT = '#FF6B2C';
const SIZE = 1024;

/** Pulls the drawable content out of a source SVG, dropping the wrapper tag. */
async function innerSvg(name) {
  const raw = await readFile(join(brand, name), 'utf8');
  const open = raw.indexOf('>', raw.indexOf('<svg'));
  const close = raw.lastIndexOf('</svg>');
  return raw.slice(open + 1, close);
}

/**
 * Wraps mark artwork in a full-size SVG.
 * @param scale fraction of the canvas the mark should occupy
 */
function compose(content, { background = null, scale = 1, glow = false } = {}) {
  const offset = (SIZE * (1 - scale)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.34" />
      <stop offset="55%" stop-color="${ACCENT}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
  </defs>
  ${background ? `<rect width="${SIZE}" height="${SIZE}" fill="${background}" />` : ''}
  ${glow ? `<circle cx="512" cy="292" r="420" fill="url(#halo)" />` : ''}
  <g transform="translate(${offset} ${offset}) scale(${scale})">${content}</g>
</svg>`;
}

async function render(svg, file, size = SIZE, { flatten = false } = {}) {
  let pipeline = sharp(Buffer.from(svg)).resize(size, size);
  // App Store icons are rejected if they carry an alpha channel.
  if (flatten) pipeline = pipeline.flatten({ background: BG });
  await pipeline.png().toFile(join(assets, file));
  console.log(`wrote assets/${file} (${size}x${size})`);
}

const mark = await innerSvg('mark.svg');
const mono = await innerSvg('monochrome.svg');

// iOS / general app icon: opaque, full bleed.
await render(compose(mark, { background: BG, glow: true }), 'icon.png', SIZE, {
  flatten: true,
});

// Android adaptive icon. The outer ~25% of the foreground is cropped by the
// launcher mask, so the mark is inset to stay inside the safe zone.
await render(compose(mark, { scale: 0.62 }), 'android-icon-foreground.png');
await render(compose('', { background: BG }), 'android-icon-background.png');
await render(compose(mono, { scale: 0.62 }), 'android-icon-monochrome.png');

// Splash mark sits on the backgroundColor set in app.json.
await render(compose(mark, { scale: 0.72 }), 'splash-icon.png');

// Web favicon.
await render(compose(mark, { background: BG, glow: true }), 'favicon.png', 48, {
  flatten: true,
});
