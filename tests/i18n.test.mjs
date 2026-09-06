/* tests/i18n.test.mjs
 *
 * The `fr` dictionary is typed from `en`, so TypeScript already catches a
 * missing key; these tests catch what it cannot: empty strings, forgotten
 * translations and mismatched placeholders.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { ROOT, loadTsModule } from '../scripts/lib/load-ts.mjs';

const { dictionaries, LANGUAGES, LANGUAGE_LABELS, isLanguage } = loadTsModule(
  path.join(ROOT, 'src', 'i18n', 'dictionaries.ts')
);
const { Categories } = loadTsModule(path.join(ROOT, 'src', 'app', 'constants.ts'));

const placeholders = (value) =>
  (value.match(/\{[a-zA-Z]+\}/g) ?? []).sort().join(',');

test('every declared language has a dictionary and a label', () => {
  for (const language of LANGUAGES) {
    assert.ok(dictionaries[language], `no dictionary for ${language}`);
    assert.ok(LANGUAGE_LABELS[language], `no label for ${language}`);
  }
});

test('all dictionaries share the same keys', () => {
  const reference = Object.keys(dictionaries.en).sort();
  for (const language of LANGUAGES) {
    assert.deepEqual(
      Object.keys(dictionaries[language]).sort(),
      reference,
      `the ${language} dictionary does not match the English one`
    );
  }
});

test('no translation is empty', () => {
  for (const language of LANGUAGES) {
    for (const [key, value] of Object.entries(dictionaries[language])) {
      assert.ok(
        typeof value === 'string' && value.trim() !== '',
        `${language}: "${key}" is empty`
      );
    }
  }
});

test('placeholders are preserved in every language', () => {
  for (const [key, english] of Object.entries(dictionaries.en)) {
    for (const language of LANGUAGES) {
      assert.equal(
        placeholders(dictionaries[language][key]),
        placeholders(english),
        `${language}: placeholders differ for "${key}"`
      );
    }
  }
});

test('every category is translated', () => {
  for (const category of Object.values(Categories)) {
    const key = `category.${category}`;
    for (const language of LANGUAGES) {
      assert.ok(dictionaries[language][key], `${language}: missing "${key}"`);
    }
  }
});

test('French is actually translated, not copied from English', () => {
  const identical = Object.keys(dictionaries.en).filter(
    (key) => dictionaries.fr[key] === dictionaries.en[key]
  );
  // Proper nouns and a few labels are legitimately identical (GitHub, Docker...).
  assert.ok(
    identical.length < Object.keys(dictionaries.en).length / 3,
    `too many untranslated keys: ${identical.length}`
  );
});

test('isLanguage only accepts the declared locales', () => {
  assert.equal(isLanguage('fr'), true);
  assert.equal(isLanguage('en'), true);
  assert.equal(isLanguage('de'), false);
  assert.equal(isLanguage(undefined), false);
});
