/**
 * Builds the web app and publishes it to the gh-pages branch.
 *
 * Run with:  npm run deploy:web
 *
 * Three things here are easy to get wrong by hand, which is why this is a
 * script rather than a list of commands in the README:
 *
 *  1. PAGES_BASE_URL — GitHub Pages serves project sites from /<repo>, so the
 *     export must know its base or every asset 404s.
 *  2. 404.html — Pages has no rewrite rules, so a copy of index.html is what
 *     makes deep links like /event/goodwood work at all.
 *  3. .nojekyll — without it Jekyll skips directories starting with an
 *     underscore, which silently removes the entire _expo bundle and leaves
 *     you with a blank page and no error.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const REPO = 'https://github.com/jonathan-longden/pitlane-uk.git';
const BASE_URL = '/pitlane-uk';
const BRANCH = 'gh-pages';

/**
 * No shell anywhere. A shell would re-split arguments containing spaces — such
 * as a commit message — and on Windows that silently turns one argument into
 * several. The Expo CLI is invoked as a plain JS file via node for the same
 * reason: `npx` is a .cmd on Windows and can only be spawned through a shell.
 */
function run(cmd, args, { cwd = root, env = {} } = {}) {
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
}

const EXPO_CLI = join(root, 'node_modules', 'expo', 'bin', 'cli');

console.log(`\n> Building web export with baseUrl ${BASE_URL}\n`);
rmSync(dist, { recursive: true, force: true });
run(process.execPath, [EXPO_CLI, 'export', '--platform', 'web'], {
  env: { PAGES_BASE_URL: BASE_URL },
});

console.log('\n> Adding GitHub Pages support files\n');
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));
writeFileSync(join(dist, '.nojekyll'), '');

console.log('\n> Rendering privacy and support pages\n');
run(process.execPath, [join(root, 'scripts', 'build-legal-pages.mjs')], {
  env: { PAGES_BASE_URL: BASE_URL },
});

console.log(`\n> Publishing to ${BRANCH}\n`);
rmSync(join(dist, '.git'), { recursive: true, force: true });
run('git', ['init', '-q', '-b', BRANCH], { cwd: dist });
run('git', ['add', '-A'], { cwd: dist });
run('git', ['commit', '-q', '-m', `Deploy web build ${new Date().toISOString()}`], {
  cwd: dist,
});
run('git', ['push', '-q', '--force', REPO, BRANCH], { cwd: dist });

console.log('\n> Done. https://jonathan-longden.github.io/pitlane-uk/');
console.log('  Pages usually takes 30-60 seconds to serve the new build.\n');
