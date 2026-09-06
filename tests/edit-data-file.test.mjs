/* tests/edit-data-file.test.mjs
 *
 * The helpers behind `yarn add:resource`: they rewrite the provider data files,
 * so a regression here corrupts real source code.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  locateColumns,
  locateItems,
  appendToArray,
  quote,
  templateQuote,
} from '../scripts/lib/edit-data-file.mjs';

const SAMPLE = `import { Categories } from '../constants';

export type ColumnType = {
  items: Item[];
};

export const columns: ColumnType[] = [
  {
    items: [
      {
        id: 'first',
        // A comment with a ] and a { to confuse a naive scanner
        terraformCode: \`resource "x" "y" {
  name = "a]b[c"
}\`,
      },
      {
        id: 'second',
      },
    ],
  },
  {
    items: [
      {
        id: 'third',
      },
    ],
  },
];
`;

test('locateColumns skips the ColumnType[] annotation', () => {
  const columns = locateColumns(SAMPLE);
  assert.equal(columns.elements.length, 2);
});

test('locateItems counts the items of a column', () => {
  const columns = locateColumns(SAMPLE);
  assert.equal(locateItems(SAMPLE, columns.elements[0]).elements.length, 2);
  assert.equal(locateItems(SAMPLE, columns.elements[1]).elements.length, 1);
});

test('strings, template literals and comments do not break the scanner', () => {
  const columns = locateColumns(SAMPLE);
  const first = SAMPLE.slice(columns.elements[0].start, columns.elements[0].end);
  assert.ok(first.includes("id: 'first'"));
  assert.ok(first.includes("id: 'second'"));
  assert.ok(!first.includes("id: 'third'"));
});

test('appendToArray adds an item to an existing column', () => {
  const columns = locateColumns(SAMPLE);
  const items = locateItems(SAMPLE, columns.elements[1]);
  const updated = appendToArray(SAMPLE, items, "      {\n        id: 'fourth',\n      },");

  const reparsed = locateColumns(updated);
  assert.equal(reparsed.elements.length, 2);
  assert.equal(locateItems(updated, reparsed.elements[1]).elements.length, 2);
  assert.ok(updated.includes("id: 'fourth'"));
});

test('appendToArray adds a whole column', () => {
  const columns = locateColumns(SAMPLE);
  const updated = appendToArray(
    SAMPLE,
    columns,
    "  {\n    items: [\n      {\n        id: 'fourth',\n      },\n    ],\n  },"
  );

  const reparsed = locateColumns(updated);
  assert.equal(reparsed.elements.length, 3);
});

test('quote escapes quotes and backslashes', () => {
  assert.equal(quote("it's"), "'it\\'s'");
  assert.equal(quote('a\\b'), "'a\\\\b'");
});

test('templateQuote escapes backticks and interpolations', () => {
  assert.equal(templateQuote('a`b'), '`a\\`b`');
  assert.equal(templateQuote('${var}'), '`\\${var}`');
});

test('an unterminated array is reported instead of silently truncating', () => {
  assert.throws(
    () => locateColumns('export const columns: ColumnType[] = [\n  {\n'),
    /Unterminated array literal/
  );
});
