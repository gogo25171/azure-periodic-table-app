/* scripts/lib/edit-data-file.mjs */

/**
 * Tiny structural helpers used to insert entries into the provider data files
 * without a full parser: the scanner walks the source once, skipping strings,
 * template literals and comments, and reports the ranges of the array items.
 */

/** Scans an array literal starting at `openIndex` (the `[`). */
export function scanArray(source, openIndex) {
  if (source[openIndex] !== '[') {
    throw new Error(`Expected "[" at index ${openIndex}`);
  }

  const elements = [];
  let depth = 0;
  let elementStart = null;

  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    // Comments
    if (char === '/' && next === '/') {
      i = source.indexOf('\n', i);
      if (i === -1) break;
      continue;
    }
    if (char === '/' && next === '*') {
      i = source.indexOf('*/', i) + 1;
      continue;
    }

    // Strings and template literals
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      i += 1;
      while (i < source.length) {
        if (source[i] === '\\') {
          i += 2;
          continue;
        }
        if (source[i] === quote) break;
        i += 1;
      }
      continue;
    }

    if (char === '[' || char === '{' || char === '(') {
      depth += 1;
      if (depth === 2 && elementStart === null) elementStart = i;
      continue;
    }

    if (char === ']' || char === '}' || char === ')') {
      depth -= 1;
      if (depth === 1 && elementStart !== null) {
        elements.push({ start: elementStart, end: i + 1 });
        elementStart = null;
      }
      if (depth === 0) {
        return { open: openIndex, close: i, elements };
      }
      continue;
    }
  }

  throw new Error('Unterminated array literal');
}

/** Returns the array of columns declared in a provider data file. */
export function locateColumns(source) {
  // Anchored on the assignment: the first `[` of the declaration belongs to
  // the `ColumnType[]` annotation, not to the array literal.
  const match = /export const columns[^=]*=\s*\[/.exec(source);
  if (!match) throw new Error('`export const columns = [` not found');
  return scanArray(source, match.index + match[0].length - 1);
}

/** Returns the `items` array of one column range. */
export function locateItems(source, column) {
  const marker = source.indexOf('items:', column.start);
  if (marker === -1 || marker > column.end) {
    throw new Error('`items:` not found in this column');
  }
  const open = source.indexOf('[', marker);
  return scanArray(source, open);
}

/**
 * Inserts `text` as the last element of the array described by `range`,
 * keeping the surrounding indentation intact.
 */
export function appendToArray(source, range, text) {
  const before = source.slice(0, range.close);
  const after = source.slice(range.close);

  const trimmed = before.replace(/\s*$/, '');
  const needsComma = !trimmed.endsWith('[') && !trimmed.endsWith(',');
  const lineStart = source.lastIndexOf('\n', range.close) + 1;
  const closingIndent = source.slice(lineStart, range.close).match(/^\s*/)[0];

  return `${trimmed}${needsComma ? ',' : ''}\n${text}\n${closingIndent}${after}`;
}

/** Escapes a value for a single quoted TypeScript string. */
export function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** Escapes a value for a template literal (Terraform snippets). */
export function templateQuote(value) {
  return `\`${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')}\``;
}
