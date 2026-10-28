#!/usr/bin/env node
/* scripts/sync-icons.mjs
 *
 * Copies the icons listed in scripts/icon-map.json from the theSVG submodule
 * (vendor/thesvg) to public/<provider>/icons/<Category>/<slug>.svg and writes
 * the `icon` field of the matching resources. Only the copied files ship with
 * the app: the submodule stays out of public/ and out of the Docker image.
 *
 *   node scripts/sync-icons.mjs             # copy + update the data files
 *   node scripts/sync-icons.mjs --dry-run   # print what would change
 *   node scripts/sync-icons.mjs --update    # move the submodule to upstream HEAD first
 *
 * The submodule is checked out sparsely (aws-* and gcp-* icons only, ~3 MB
 * instead of ~57 MB): the script sets that up itself on a fresh clone.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, loadDataAudit } from './lib/load-ts.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const update = args.includes('--update');

const SUBMODULE = 'vendor/thesvg';
const UPSTREAM = 'https://github.com/glincker/thesvg';
const SPARSE = ['/public/icons/aws-*/default.svg', '/public/icons/gcp-*/default.svg'];
const ICONS = path.join(ROOT, SUBMODULE, 'public', 'icons');

const ATTRIBUTION = {
  aws: 'AWS Architecture Icons, (c) Amazon Web Services, licensed under CC BY-ND 2.0 (https://creativecommons.org/licenses/by-nd/2.0/). Files are copied unmodified.',
  google: 'Google Cloud icons, (c) Google LLC, licensed under the Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0).',
};

function git(gitArgs, cwd = ROOT) {
  const result = spawnSync('git', gitArgs, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`git ${gitArgs.join(' ')} failed:\n${result.stderr}`);
    process.exit(1);
  }
  return result.stdout.trim();
}

/** Sparse, shallow checkout of the commit recorded in the superproject. */
function ensureSubmodule() {
  const directory = path.join(ROOT, SUBMODULE);
  if (!fs.existsSync(path.join(directory, '.git'))) {
    console.log(`Cloning ${UPSTREAM} sparsely into ${SUBMODULE}...`);
    git(['submodule', 'init', SUBMODULE]);
    git(['clone', '--quiet', '--depth', '1', '--filter=blob:none', '--no-checkout', UPSTREAM, SUBMODULE]);
    git(['submodule', 'absorbgitdirs', SUBMODULE]);
  }
  git(['sparse-checkout', 'set', '--no-cone', ...SPARSE], directory);

  const recorded = git(['ls-tree', 'HEAD', SUBMODULE]).split(/\s+/)[2];
  const target = update ? 'HEAD' : recorded;
  if (target) {
    git(['fetch', '--quiet', '--depth', '1', 'origin', target], directory);
    git(['checkout', '--quiet', 'FETCH_HEAD'], directory);
  }
}

/** Sets `icon: '...'` inside the object literal of `id`, and nowhere else. */
function setIcon(source, id, icon) {
  const start = source.indexOf(`id: '${id}'`);
  if (start === -1) throw new Error(`id "${id}" not found`);
  const next = source.indexOf("id: '", start + 1);
  const end = next === -1 ? source.length : next;
  const block = source.slice(start, end);
  const updated = block.replace(/icon: '[^']*'/, `icon: '${icon}'`);
  if (updated === block && !block.includes(`icon: '${icon}'`)) {
    throw new Error(`no icon field for "${id}"`);
  }
  return source.slice(0, start) + updated + source.slice(end);
}

ensureSubmodule();

const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'icon-map.json'), 'utf8'));
const { providerDatasets } = loadDataAudit();
let failures = 0;

for (const [provider, entries] of Object.entries(map)) {
  if (provider.startsWith('$')) continue;
  const items = new Map(
    providerDatasets[provider].columns.flatMap((column) => column.items).map((item) => [item.id, item])
  );
  const dataFile = path.join(ROOT, 'src', 'app', 'data', `${provider}.ts`);
  let source = fs.readFileSync(dataFile, 'utf8');
  let copied = 0;

  for (const [id, slug] of Object.entries(entries)) {
    const item = items.get(id);
    const from = path.join(ICONS, slug, 'default.svg');
    if (!item || !fs.existsSync(from)) {
      console.error(`  ✖ ${provider}/${id}: ${item ? `icon "${slug}" not found` : 'unknown resource id'}`);
      failures += 1;
      continue;
    }
    // "Compute & Web" -> "Compute and Web": an ampersand in a URL path is fragile.
    const folder = item.category.replace(/\s*&\s*/g, ' and ');
    const icon = `/${provider}/icons/${folder}/${slug}.svg`;
    if (!dryRun) {
      const to = path.join(ROOT, 'public', icon);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
    source = setIcon(source, id, icon);
    copied += 1;
  }

  const missing = [...items.keys()].filter((id) => !(id in entries));
  console.log(`${provider}: ${copied} icon(s)${missing.length ? `, no icon for ${missing.join(', ')}` : ''}`);
  if (!dryRun) {
    fs.writeFileSync(dataFile, source);
    fs.writeFileSync(
      path.join(ROOT, 'public', provider, 'icons', 'NOTICE.md'),
      `# ${provider} icons\n\nCopied from ${UPSTREAM} by \`yarn icons:sync\` (see scripts/icon-map.json).\n\n${ATTRIBUTION[provider]}\nThe icons are trademarks of their owners and are only used to identify the services.\n`
    );
  }
}

if (failures > 0) process.exit(1);
