/* tests/data-audit.test.mjs
 *
 * The provider datasets are the product itself: these tests are the safety net
 * that keeps a bad copy/paste from reaching the table.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadTsModule, loadDataAudit } from '../scripts/lib/load-ts.mjs';

const { auditProviders, providerDatasets } = loadDataAudit();
const { Categories } = loadTsModule(
  path.join(ROOT, 'src', 'app', 'constants.ts')
);

const iconCache = new Map();
const iconExists = (_provider, iconPath) => {
  if (!iconCache.has(iconPath)) {
    iconCache.set(
      iconPath,
      fs.existsSync(path.join(ROOT, 'public', iconPath.replace(/^\/+/, '')))
    );
  }
  return iconCache.get(iconPath);
};

const report = auditProviders({ iconExists });
const allItems = Object.entries(providerDatasets).flatMap(([provider, data]) =>
  data.columns.flatMap((column) => column.items.map((item) => ({ provider, item })))
);

test('the datasets raise no audit error', () => {
  const errors = report.findings.filter((finding) => finding.severity === 'error');
  assert.deepEqual(
    errors.map((error) => `${error.provider}/${error.resourceId}: ${error.rule}`),
    []
  );
});

test('every provider has resources and columns', () => {
  for (const provider of report.providers) {
    assert.ok(provider.resources > 0, `${provider.provider} has no resource`);
    assert.ok(provider.columns > 0, `${provider.provider} has no column`);
  }
});

test('resource ids are unique across every provider', () => {
  const seen = new Map();
  for (const { provider, item } of allItems) {
    const previous = seen.get(item.id);
    assert.equal(
      previous,
      undefined,
      `id "${item.id}" is used by ${previous} and ${provider}`
    );
    seen.set(item.id, provider);
  }
});

test('non Azure ids carry their provider prefix', () => {
  const prefixes = { aws: 'aws-', google: 'gcp-', ovh: 'ovh-', scaleway: 'scaleway-' };
  for (const { provider, item } of allItems) {
    const prefix = prefixes[provider];
    if (!prefix) continue;
    assert.ok(
      item.id.startsWith(prefix),
      `${provider}: "${item.id}" should start with "${prefix}"`
    );
  }
});

test('categories all exist in the Categories enum', () => {
  const known = new Set(Object.values(Categories));
  for (const { provider, item } of allItems) {
    assert.ok(
      known.has(item.category),
      `${provider}/${item.id}: unknown category "${item.category}"`
    );
  }
});

test('terraform URLs point at the right provider namespace', () => {
  const namespaces = {
    azure: '/hashicorp/azurerm/',
    aws: '/hashicorp/aws/',
    google: '/hashicorp/google',
    ovh: '/ovh/ovh/',
    scaleway: '/scaleway/scaleway/',
  };
  for (const { provider, item } of allItems) {
    if (!item.terraformUrl?.includes('registry.terraform.io')) continue;
    assert.ok(
      item.terraformUrl.includes(namespaces[provider]),
      `${provider}/${item.id}: ${item.terraformUrl}`
    );
  }
});

test('every declared URL uses https', () => {
  for (const { provider, item } of allItems) {
    for (const field of ['learnUrl', 'terraformUrl', 'portalUrl', 'pricingReferenceUrl']) {
      const value = item[field];
      if (!value || value === 'Free') continue;
      assert.ok(
        value.startsWith('https://'),
        `${provider}/${item.id}: ${field} = ${value}`
      );
    }
  }
});

test('the audit reports a duplicate id when there is one', () => {
  // Feeds a synthetic provider through the same engine to prove the rule fires.
  const [firstProvider] = Object.keys(providerDatasets);
  const clone = providerDatasets[firstProvider].columns[0].items[0];
  providerDatasets.__test__ = { columns: [{ items: [clone] }] };

  try {
    const withDuplicate = auditProviders();
    const duplicate = withDuplicate.findings.find(
      (finding) => finding.rule === 'duplicate-id' && finding.resourceId === clone.id
    );
    assert.ok(duplicate, 'the duplicate-id rule did not fire');
    assert.equal(duplicate.severity, 'error');
  } finally {
    delete providerDatasets.__test__;
  }
});
