#!/usr/bin/env node
/* scripts/update-credits.mjs
 *
 * Regenerates the contributors list of docs/about/credits.md from the git
 * history, between the CONTRIBUTORS markers.
 *
 *   node scripts/update-credits.mjs
 *   node scripts/update-credits.mjs --check   # fails when the list is stale
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './lib/paths.mjs';

const START = '<!-- CONTRIBUTORS:START -->';
const END = '<!-- CONTRIBUTORS:END -->';

/** Bots and duplicated identities that should not appear in the credits. */
const BOTS = [/dependabot/i, /renovate/i, /github action/i, /\[bot\]/i];

// Oldest commit first: authors are listed in the order they first contributed.
const result = spawnSync('git', ['log', '--reverse', '--format=%aN%x09%aE', 'HEAD'], {
  cwd: ROOT,
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.error('Unable to read the git history.');
  process.exit(1);
}

// Several machines mean several identities for the same person: merge on name.
const names = new Set();

for (const line of result.stdout.split('\n')) {
  const [name, email] = line.trim().split('\t');
  if (!name || !email) continue;
  if (BOTS.some((pattern) => pattern.test(name) || pattern.test(email))) continue;
  names.add(name);
}

// Ordered by first contribution rather than by number of commits: a commit
// count ranking reshuffles whenever someone overtakes someone else, which made
// the CI check fail on unrelated changes. Now a new contributor is appended.
const list = Array.from(names, (name) => `- **${name}**`).join('\n');

const creditsPath = path.join(ROOT, 'docs', 'about', 'credits.md');
const source = fs.readFileSync(creditsPath, 'utf8');

// Keep the line endings of the checkout (CRLF on Windows with core.autocrlf),
// otherwise --check reports a stale list on every Windows machine.
const eol = source.includes('\r\n') ? '\r\n' : '\n';
const block = `${START}${eol}${eol}${list.replace(/\n/g, eol)}${eol}${eol}${END}`;

if (!source.includes(START) || !source.includes(END)) {
  console.error(
    `The markers ${START} / ${END} are missing from docs/about/credits.md.`
  );
  process.exit(1);
}

const updated = source.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  block.replace(/\$/g, '$$$$')
);

if (process.argv.includes('--check')) {
  if (updated !== source) {
    console.error('The contributors list is out of date: run yarn update:credits.');
    process.exit(1);
  }
  console.log('The contributors list is up to date.');
  process.exit(0);
}

fs.writeFileSync(creditsPath, updated);
console.log(`${names.size} contributor(s) written to docs/about/credits.md`);
