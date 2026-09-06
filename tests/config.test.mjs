/* tests/config.test.mjs
 *
 * `src/config.ts` turns environment variables into the visibility switches of
 * the header. Getting a default wrong hides a link for everyone, so the
 * fallbacks are pinned here.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { ROOT, loadTsModule } from '../scripts/lib/load-ts.mjs';

const CONFIG = path.join(ROOT, 'src', 'config.ts');

/** Loads config.ts with a controlled environment. */
function loadConfig(env = {}) {
  const keys = Object.keys(process.env).filter((key) =>
    key.startsWith('NEXT_PUBLIC_')
  );
  const backup = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, env);

  try {
    return loadTsModule(CONFIG, { fresh: true });
  } finally {
    for (const key of Object.keys(env)) delete process.env[key];
    Object.assign(process.env, backup);
  }
}

test('everything is visible by default, except the documentation link', () => {
  const { socialLinksConfig, brandConfig } = loadConfig();

  assert.equal(socialLinksConfig.github.enabled, true);
  assert.equal(socialLinksConfig.linkedin.enabled, true);
  assert.equal(socialLinksConfig.twitter.enabled, true);
  assert.equal(socialLinksConfig.docs.enabled, false);
  assert.equal(brandConfig.enabled, true);
  assert.equal(brandConfig.showLogo, true);
  assert.equal(brandConfig.showTitle, true);
});

test('the NEXT_PUBLIC_SHOW_* switches hide a link', () => {
  const { socialLinksConfig, hasAnySocialLink } = loadConfig({
    NEXT_PUBLIC_SHOW_GITHUB: 'false',
    NEXT_PUBLIC_SHOW_LINKEDIN: '0',
    NEXT_PUBLIC_SHOW_TWITTER: 'no',
  });

  assert.equal(socialLinksConfig.github.enabled, false);
  assert.equal(socialLinksConfig.linkedin.enabled, false);
  assert.equal(socialLinksConfig.twitter.enabled, false);
  assert.equal(hasAnySocialLink, false);
});

test('an unknown or empty value keeps the default', () => {
  const { socialLinksConfig } = loadConfig({
    NEXT_PUBLIC_SHOW_GITHUB: 'maybe',
    NEXT_PUBLIC_SHOW_TWITTER: '',
  });

  assert.equal(socialLinksConfig.github.enabled, true);
  assert.equal(socialLinksConfig.twitter.enabled, true);
});

test('URLs and titles can be overridden', () => {
  const { siteConfig, socialLinksConfig, brandConfig } = loadConfig({
    NEXT_PUBLIC_SITE_TITLE: 'My Table',
    NEXT_PUBLIC_GITHUB_URL: 'https://github.com/example/fork',
    NEXT_PUBLIC_BRAND_LOGO_URL: '/logo.svg',
    NEXT_PUBLIC_BRAND_URL: 'https://example.com',
  });

  assert.equal(siteConfig.title, 'My Table');
  assert.equal(socialLinksConfig.github.url, 'https://github.com/example/fork');
  assert.equal(brandConfig.title, 'My Table');
  assert.equal(brandConfig.logoUrl, '/logo.svg');
  assert.equal(brandConfig.href, 'https://example.com');
});

test('the brand block can be hidden entirely or by half', () => {
  const hidden = loadConfig({ NEXT_PUBLIC_SHOW_BRAND: 'false' });
  assert.equal(hidden.brandConfig.enabled, false);

  const logoOnly = loadConfig({ NEXT_PUBLIC_SHOW_BRAND_TITLE: 'off' });
  assert.equal(logoOnly.brandConfig.enabled, true);
  assert.equal(logoOnly.brandConfig.showTitle, false);
  assert.equal(logoOnly.brandConfig.showLogo, true);
});

test('every category has a colour', () => {
  const { colorConfig } = loadConfig();
  const { Categories } = loadTsModule(
    path.join(ROOT, 'src', 'app', 'constants.ts')
  );
  const periodicTable = path.join(
    ROOT,
    'src',
    'components',
    'periodic-table.tsx'
  );
  const source = fs.readFileSync(periodicTable, 'utf8');

  for (const key of Object.keys(Categories)) {
    assert.ok(
      source.includes(`Categories.${key}`),
      `Categories.${key} has no entry in categoryData`
    );
  }
  assert.ok(Object.keys(colorConfig).length > 0);
});
