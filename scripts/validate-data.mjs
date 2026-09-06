#!/usr/bin/env node
/* scripts/validate-data.mjs
 *
 * Runs the provider data checks outside of the browser, so CI and a pre-push
 * hook can fail on the same rules the admin dashboard displays.
 *
 *   node scripts/validate-data.mjs                  # errors fail the run
 *   node scripts/validate-data.mjs --strict         # warnings fail too
 *   node scripts/validate-data.mjs --json           # machine readable output
 *   node scripts/validate-data.mjs --provider aws   # restrict to one provider
 */

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadDataAudit } from './lib/load-ts.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? null : args[index + 1];
};

const iconCache = new Map();
function iconExists(_provider, iconPath) {
  if (!iconCache.has(iconPath)) {
    const relative = iconPath.replace(/^\/+/, '');
    iconCache.set(
      iconPath,
      fs.existsSync(path.join(ROOT, 'public', relative))
    );
  }
  return iconCache.get(iconPath);
}

const { auditProviders } = loadDataAudit();
const report = auditProviders({ iconExists });

const providerFilter = option('provider');
const findings = providerFilter
  ? report.findings.filter((finding) => finding.provider.includes(providerFilter))
  : report.findings;

if (flag('json')) {
  console.log(JSON.stringify({ ...report, findings }, null, 2));
} else {
  const icons = { error: '✖', warning: '▲', info: '•' };

  console.log('\nProvider data check\n');
  for (const provider of report.providers) {
    console.log(
      `  ${provider.provider.padEnd(10)} ${String(provider.resources).padStart(
        3
      )} resources  ${String(provider.columns).padStart(2)} columns  ` +
        `${provider.errors} error(s), ${provider.warnings} warning(s), ${provider.infos} notice(s)`
    );
  }

  const shown = flag('verbose')
    ? findings
    : findings.filter((finding) => finding.severity !== 'info');

  if (shown.length > 0) console.log('');
  for (const finding of shown) {
    console.log(
      `  ${icons[finding.severity]} [${finding.provider}] ${
        finding.resourceId ?? '-'
      } (${finding.rule}): ${finding.message}`
    );
  }

  const hiddenInfos = findings.length - shown.length;
  if (hiddenInfos > 0) {
    console.log(`\n  ${hiddenInfos} notice(s) hidden, run with --verbose to see them.`);
  }

  console.log(
    `\n  Total: ${report.totals.resources} resources, ${report.totals.errors} error(s), ` +
      `${report.totals.warnings} warning(s), ${report.totals.infos} notice(s)\n`
  );
}

const failed =
  report.totals.errors > 0 || (flag('strict') && report.totals.warnings > 0);

process.exit(failed ? 1 : 0);
