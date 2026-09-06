#!/usr/bin/env node
/* scripts/add-resource.mjs
 *
 * Adds a resource to a provider data file, either interactively or from a
 * JSON payload, then re-runs the data checks on the result.
 *
 *   node scripts/add-resource.mjs                       # guided prompts
 *   node scripts/add-resource.mjs --file resource.json  # non interactive
 *   node scripts/add-resource.mjs --file - < resource.json
 *
 * The JSON payload accepts every field of `Item` plus `provider` and an
 * optional `column` (1 based index, or "new" to start a new column).
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { spawnSync } from 'node:child_process';
import { ROOT, loadTsModule } from './lib/load-ts.mjs';
import {
  locateColumns,
  locateItems,
  appendToArray,
  quote,
  templateQuote,
} from './lib/edit-data-file.mjs';

const PROVIDERS = ['azure', 'aws', 'google', 'ovh', 'scaleway'];
const ID_PREFIXES = {
  azure: '',
  aws: 'aws-',
  google: 'gcp-',
  ovh: 'ovh-',
  scaleway: 'scaleway-',
};

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1];
};

const { Categories } = loadTsModule(path.join(ROOT, 'src', 'app', 'constants.ts'));
const CATEGORY_ENTRIES = Object.entries(Categories);

function dataFilePath(provider) {
  return path.join(ROOT, 'src', 'app', 'data', `${provider}.ts`);
}

function renderItem(item, indent = '      ') {
  const inner = `${indent}  `;
  const lines = [`${indent}{`];

  const scalar = (key, value) => {
    if (value === undefined || value === null || value === '') return;
    lines.push(`${inner}${key}: ${quote(value)},`);
  };

  lines.push(`${inner}id: ${quote(item.id)},`);
  scalar('name', item.name);
  scalar('slug', item.slug);
  scalar('description', item.description);
  scalar('length', item.length);
  lines.push(`${inner}category: Categories.${item.categoryKey},`);
  scalar('learnUrl', item.learnUrl);
  scalar('terraformUrl', item.terraformUrl);
  scalar('restrictions', item.restrictions);
  scalar('resource', item.resource);
  scalar('entity', item.entity);
  scalar('scope', item.scope);
  lines.push(`${inner}icon: ${quote(item.icon ?? '')},`);
  lines.push(
    `${inner}terraformCode: ${
      item.terraformCode ? templateQuote(item.terraformCode) : '``'
    },`
  );
  scalar('pricingReferenceUrl', item.pricingReferenceUrl);
  scalar('portalUrl', item.portalUrl);
  lines.push(`${indent}},`);

  return lines.join('\n');
}

function resolveCategoryKey(value) {
  const direct = CATEGORY_ENTRIES.find(([key]) => key === value);
  if (direct) return direct[0];
  const byValue = CATEGORY_ENTRIES.find(
    ([, label]) => label.toLowerCase() === String(value).toLowerCase()
  );
  if (byValue) return byValue[0];
  return null;
}

function insertResource(payload) {
  const provider = payload.provider;
  if (!PROVIDERS.includes(provider)) {
    throw new Error(`Unknown provider "${provider}" (${PROVIDERS.join(', ')}).`);
  }

  const categoryKey = resolveCategoryKey(payload.category);
  if (!categoryKey) {
    throw new Error(
      `Unknown category "${payload.category}". Available: ${CATEGORY_ENTRIES.map(
        ([key, label]) => `${key} (${label})`
      ).join(', ')}`
    );
  }

  const filePath = dataFilePath(provider);
  let source = fs.readFileSync(filePath, 'utf8');

  if (source.includes(`id: '${payload.id}'`)) {
    throw new Error(`The id "${payload.id}" already exists in ${provider}.ts.`);
  }

  const item = { ...payload, categoryKey };
  const columns = locateColumns(source);

  if (payload.column === 'new') {
    const columnText = `  {\n    items: [\n${renderItem(item)}\n    ],\n  },`;
    source = appendToArray(source, columns, columnText);
  } else {
    const index = Number(payload.column ?? columns.elements.length) - 1;
    const column = columns.elements[index];
    if (!column) {
      throw new Error(
        `Column ${payload.column} does not exist (the file has ${columns.elements.length}).`
      );
    }
    const items = locateItems(source, column);
    source = appendToArray(source, items, renderItem(item));
  }

  fs.writeFileSync(filePath, source);
  return filePath;
}

async function prompt() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = async (label, fallback = '') => {
    const answer = (
      await rl.question(fallback ? `${label} [${fallback}]: ` : `${label}: `)
    ).trim();
    return answer === '' ? fallback : answer;
  };

  console.log('\nAdd a resource to a provider dataset\n');

  const provider = await ask(`Provider (${PROVIDERS.join('/')})`, 'azure');
  const name = await ask('Display name (e.g. "Object Storage")');
  const suggestedId = `${ID_PREFIXES[provider] ?? ''}${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;

  console.log('\nCategories:');
  for (const [key, label] of CATEGORY_ENTRIES) {
    console.log(`  - ${key} (${label})`);
  }
  console.log('');

  const payload = {
    provider,
    name,
    id: await ask('Id (used in the URL)', suggestedId),
    slug: await ask('Naming prefix (e.g. "s3-")'),
    description: await ask('Description'),
    length: await ask('Name length (e.g. "3-63" or "N/A")', 'N/A'),
    category: await ask('Category'),
    learnUrl: await ask('Documentation URL'),
    terraformUrl: await ask('Terraform registry URL'),
    restrictions: await ask('Naming restrictions'),
    resource: await ask('Terraform resource / namespace', ''),
    entity: await ask('Entity', ''),
    scope: await ask('Scope (project, region, global...)', ''),
    icon: await ask('Icon path under public/', ''),
    pricingReferenceUrl: await ask('Pricing URL', ''),
    portalUrl: await ask('Portal / console URL', ''),
    column: await ask('Target column (number or "new")', 'new'),
  };

  console.log(
    '\nTerraform snippet: paste it then type a single "." on its own line (empty to skip).'
  );
  const lines = [];
  for (;;) {
    const line = await rl.question('');
    if (line.trim() === '.' || (line === '' && lines.length === 0)) break;
    lines.push(line);
  }
  payload.terraformCode = lines.join('\n');

  rl.close();
  return payload;
}

async function main() {
  const file = option('file');
  let payload;

  if (file) {
    const raw =
      file === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8');
    payload = JSON.parse(raw);
  } else {
    payload = await prompt();
  }

  const filePath = insertResource(payload);
  console.log(`\nAdded ${payload.id} to ${path.relative(ROOT, filePath)}`);

  console.log('\nRunning the data checks...\n');
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts', 'validate-data.mjs'), '--provider', payload.provider],
    { stdio: 'inherit' }
  );
  process.exit(result.status ?? 0);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
