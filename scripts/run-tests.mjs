#!/usr/bin/env node
/* scripts/run-tests.mjs
 *
 * Runs the test suite with the built-in Node.js runner.
 *
 * The obvious invocations are not portable: `node --test "tests/**\/*.test.mjs"`
 * needs the glob support of Node 22 (CI runs Node 20), and `node --test tests`
 * fails on Windows, where the directory is resolved as a module. Listing the
 * files here works everywhere.
 *
 *   node scripts/run-tests.mjs              # every test
 *   node scripts/run-tests.mjs i18n         # only the files matching "i18n"
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './lib/paths.mjs';

const filters = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const nodeOptions = process.argv.slice(2).filter((arg) => arg.startsWith('-'));

const testsDir = path.join(ROOT, 'tests');

if (!fs.existsSync(testsDir)) {
  console.error('No tests/ directory found.');
  process.exit(1);
}

const files = fs
  .readdirSync(testsDir)
  .filter((file) => file.endsWith('.test.mjs'))
  .filter((file) => filters.length === 0 || filters.some((f) => file.includes(f)))
  .map((file) => path.join('tests', file))
  .sort();

if (files.length === 0) {
  console.error(
    filters.length > 0
      ? `No test file matches ${filters.join(', ')}.`
      : 'No test file found in tests/.'
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...nodeOptions, ...files], {
  cwd: ROOT,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
