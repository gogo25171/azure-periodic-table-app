#!/usr/bin/env node
/* scripts/check-deps.mjs
 *
 * Reports outdated dependencies and known vulnerabilities, using yarn only
 * (the repository has no package-lock.json on purpose).
 *
 *   node scripts/check-deps.mjs                 # human readable report
 *   node scripts/check-deps.mjs --json          # raw JSON
 *   node scripts/check-deps.mjs --markdown      # GitHub job summary format
 *   node scripts/check-deps.mjs --fail-on high  # exit 1 on high/critical advisories
 *
 * Note: `yarn audit` counts vulnerable dependency *paths*, not packages, so its
 * numbers are higher than the ones GitHub shows for the same tree.
 */

import { spawnSync } from 'node:child_process';
import { ROOT } from './lib/load-ts.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

/** Runs a yarn command and returns its newline delimited JSON output. */
function runNdjson(commandArgs) {
  const result = spawnSync(yarn, [...commandArgs, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === 'win32',
  });

  return (result.stdout ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

const outdatedEvents = runNdjson(['outdated']);
const table = outdatedEvents.find((event) => event.type === 'table');

const rows = (table?.data?.body ?? []).map(([name, current, wanted, latest]) => {
  const currentMajor = String(current).split('.')[0];
  const latestMajor = String(latest).split('.')[0];
  return {
    name,
    current,
    wanted,
    latest,
    kind: currentMajor === latestMajor ? 'minor' : 'major',
  };
});
rows.sort((a, b) => a.name.localeCompare(b.name));

const majors = rows.filter((row) => row.kind === 'major');
const minors = rows.filter((row) => row.kind === 'minor');

const auditEvents = runNdjson(['audit']);
const summary = auditEvents.find((event) => event.type === 'auditSummary');
const vulnerabilities = summary?.data?.vulnerabilities ?? {};

if (flag('json')) {
  console.log(JSON.stringify({ outdated: rows, vulnerabilities }, null, 2));
} else if (flag('markdown')) {
  const asTable = (list) =>
    list.length === 0
      ? '_Nothing to report._\n'
      : `| Package | Current | Latest |\n| --- | --- | --- |\n${list
          .map((row) => `| \`${row.name}\` | ${row.current} | ${row.latest} |`)
          .join('\n')}\n`;

  console.log('## Dependency report\n');
  console.log(
    `**Vulnerable dependency paths** — critical: ${
      vulnerabilities.critical ?? 0
    }, high: ${vulnerabilities.high ?? 0}, moderate: ${
      vulnerabilities.moderate ?? 0
    }, low: ${vulnerabilities.low ?? 0}\n`
  );
  console.log(`### Major updates (${majors.length})\n`);
  console.log(asTable(majors));
  console.log(`### Minor and patch updates (${minors.length})\n`);
  console.log(asTable(minors));
} else {
  const line = (row) =>
    `  ${row.name.padEnd(38)} ${String(row.current).padEnd(12)} -> ${row.latest}`;

  console.log(`\nMajor updates (${majors.length})`);
  majors.forEach((row) => console.log(line(row)));
  console.log(`\nMinor and patch updates (${minors.length})`);
  minors.forEach((row) => console.log(line(row)));
  console.log(
    `\nVulnerable dependency paths: ${vulnerabilities.critical ?? 0} critical, ${
      vulnerabilities.high ?? 0
    } high, ${vulnerabilities.moderate ?? 0} moderate, ${
      vulnerabilities.low ?? 0
    } low\n`
  );
}

const failOn = option('fail-on');
if (failOn) {
  const levels = ['low', 'moderate', 'high', 'critical'];
  const threshold = levels.indexOf(failOn);
  if (threshold === -1) {
    console.error(`Unknown level "${failOn}" (${levels.join(', ')}).`);
    process.exit(2);
  }
  const failing = levels
    .slice(threshold)
    .reduce((total, level) => total + (vulnerabilities[level] ?? 0), 0);
  if (failing > 0) {
    console.error(`${failing} vulnerable path(s) at or above "${failOn}".`);
    process.exit(1);
  }
}
