/* tests/snippet-versions.test.mjs
 *
 * The version facts of a resource sheet are parsed from the data file and the
 * snippet text: these tests pin the formats the parsers rely on, and run them
 * over the real snippets so a collector change that breaks them is caught.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadTsModule } from '../scripts/lib/load-ts.mjs';

const { parseTerraformUrl, parseBicepApiVersion, parseArmApiVersion } = loadTsModule(
  path.join(ROOT, 'src', 'lib', 'snippet-versions.ts')
);

test('parseTerraformUrl reads the provider and the resource type', () => {
  assert.deepEqual(
    parseTerraformUrl(
      'https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/search_service'
    ),
    {
      source: 'hashicorp/azurerm',
      resourceType: 'azurerm_search_service',
      pinnedVersion: undefined,
      registryUrl: 'https://registry.terraform.io/providers/hashicorp/azurerm/latest',
      changelogUrl:
        'https://github.com/hashicorp/terraform-provider-azurerm/blob/main/CHANGELOG.md',
    }
  );
});

test('parseTerraformUrl reports a link pinned to an older release', () => {
  const info = parseTerraformUrl(
    'https://registry.terraform.io/providers/hashicorp/azurerm/2.99.0/docs/resources/data_lake_store'
  );
  assert.equal(info.pinnedVersion, '2.99.0');
  assert.equal(info.resourceType, 'azurerm_data_lake_store');
});

test('parseTerraformUrl ignores empty and foreign URLs', () => {
  assert.equal(parseTerraformUrl(''), undefined);
  assert.equal(parseTerraformUrl(undefined), undefined);
  assert.equal(parseTerraformUrl('https://example.com/docs'), undefined);
});

test('parseBicepApiVersion reads the type and flags previews', () => {
  assert.deepEqual(
    parseBicepApiVersion(
      "resource symbolicname 'Microsoft.SignalRService/signalR@2022-08-01-preview' = {"
    ),
    {
      type: 'Microsoft.SignalRService/signalR',
      apiVersion: '2022-08-01-preview',
      date: '2022-08-01',
      preview: true,
    }
  );
  assert.equal(parseBicepApiVersion(''), undefined);
});

test('parseArmApiVersion reads the first resource', () => {
  assert.deepEqual(
    parseArmApiVersion(
      '{\n  "type": "Microsoft.Search/searchServices",\n  "apiVersion": "2022-09-01"\n}'
    ),
    {
      type: 'Microsoft.Search/searchServices',
      apiVersion: '2022-09-01',
      date: '2022-09-01',
      preview: false,
    }
  );
});

test('every Bicep and ARM snippet on disk exposes its API version', () => {
  for (const [language, parse] of [
    ['bicep', parseBicepApiVersion],
    ['arm', parseArmApiVersion],
  ]) {
    const directory = path.join(ROOT, 'public', 'azure', 'code', language);
    const unparsed = fs
      .readdirSync(directory)
      .filter((file) => !parse(fs.readFileSync(path.join(directory, file), 'utf8')));
    assert.deepEqual(unparsed, [], `${language} snippets without an API version`);
  }
});
