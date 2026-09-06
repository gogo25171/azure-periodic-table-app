#!/usr/bin/env node
/* scripts/gh-check.mjs
 *
 * One command to run before (or right after) pushing: the same checks CI runs,
 * then the status of the GitHub Actions runs for the current branch via the
 * GitHub CLI (`gh`).
 *
 *   node scripts/gh-check.mjs            # local checks + remote run status
 *   node scripts/gh-check.mjs --local    # local checks only (used by the hook)
 *   node scripts/gh-check.mjs --remote   # GitHub Actions status only
 *   node scripts/gh-check.mjs --watch    # follow the latest run until it ends
 */

import { spawnSync } from 'node:child_process';
import { ROOT } from './lib/load-ts.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);

const onlyLocal = flag('local');
const onlyRemote = flag('remote');
const isWindows = process.platform === 'win32';

function run(label, command, commandArgs, options = {}) {
  process.stdout.write(`\n▶ ${label}\n`);
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: isWindows,
    ...options,
  });
  return result.status ?? 1;
}

function capture(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: isWindows,
  });
  return { status: result.status ?? 1, stdout: (result.stdout ?? '').trim() };
}

function hasCommand(command) {
  const probe = capture(command, ['--version']);
  return probe.status === 0;
}

let failures = 0;

if (!onlyRemote) {
  const yarn = isWindows ? 'yarn.cmd' : 'yarn';
  failures += run('Lint', yarn, ['lint']) === 0 ? 0 : 1;
  failures += run('Types', 'npx', ['tsc', '--noEmit']) === 0 ? 0 : 1;

  // `process.execPath` contains spaces on Windows ("C:\Program Files\..."),
  // which a shell would split: these two run without one.
  failures +=
    run('Tests', process.execPath, ['--test', 'tests/**/*.test.mjs'], {
      shell: false,
    }) === 0
      ? 0
      : 1;
  failures +=
    run('Provider data', process.execPath, ['scripts/validate-data.mjs'], {
      shell: false,
    }) === 0
      ? 0
      : 1;

  console.log(
    failures === 0
      ? '\n✔ Local checks passed.\n'
      : `\n✖ ${failures} local check(s) failed.\n`
  );
}

if (!onlyLocal) {
  if (!hasCommand('gh')) {
    console.log(
      'GitHub CLI not found: install it from https://cli.github.com/ to see the Actions status here.\n'
    );
  } else {
    const branch = capture('git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout;
    console.log(`\n▶ GitHub Actions runs for "${branch}"`);

    const runs = capture('gh', [
      'run',
      'list',
      '--branch',
      branch,
      '--limit',
      '5',
      '--json',
      'workflowName,status,conclusion,headSha,url',
    ]);

    if (runs.status !== 0 || !runs.stdout) {
      console.log(
        '  No run could be read (not authenticated, or no GitHub remote).\n'
      );
    } else {
      const parsed = JSON.parse(runs.stdout);
      if (parsed.length === 0) {
        console.log('  No run yet for this branch.\n');
      }
      for (const item of parsed) {
        const state = item.conclusion || item.status;
        const mark =
          item.conclusion === 'success'
            ? '✔'
            : item.conclusion === null
            ? '…'
            : '✖';
        console.log(
          `  ${mark} ${item.workflowName.padEnd(28)} ${String(state).padEnd(12)} ${
            item.url
          }`
        );
        if (item.conclusion && item.conclusion !== 'success') failures += 1;
      }
      console.log('');

      if (flag('watch')) {
        run('Watching the latest run', 'gh', ['run', 'watch', '--exit-status']);
      }
    }
  }
}

process.exit(failures === 0 ? 0 : 1);
