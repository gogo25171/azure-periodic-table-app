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

const result = spawnSync('git', ['shortlog', '-sne', 'HEAD'], {
  cwd: ROOT,
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.error('Unable to read the git history.');
  process.exit(1);
}

const byName = new Map();

for (const line of result.stdout.split('\n')) {
  const match = line.trim().match(/^(\d+)\t(.+?) <(.+?)>$/);
  if (!match) continue;

  const [, countRaw, name, email] = match;
  if (BOTS.some((pattern) => pattern.test(name) || pattern.test(email))) continue;

  // Several machines mean several identities for the same person: merge on name.
  const entry = byName.get(name) ?? { name, commits: 0, emails: new Set() };
  entry.commits += Number(countRaw);
  entry.emails.add(email);
  byName.set(name, entry);
}

const contributors = Array.from(byName.values()).sort(
  (a, b) => b.commits - a.commits || a.name.localeCompare(b.name)
);

// Ordered by number of commits, but the count itself is not written: it would
// change on every commit and make the CI check fail on unrelated changes.
const list = contributors.map((entry) => `- **${entry.name}**`).join('\n');

const block = `${START}\n\n${list}\n\n${END}`;

const creditsPath = path.join(ROOT, 'docs', 'about', 'credits.md');
const source = fs.readFileSync(creditsPath, 'utf8');

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
console.log(`${contributors.length} contributor(s) written to docs/about/credits.md`);
