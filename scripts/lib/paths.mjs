/* scripts/lib/paths.mjs */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Repository root. Kept in its own module so scripts that do not need to load
 * TypeScript (and therefore do not need `node_modules`) can import it without
 * pulling in the `typescript` dependency.
 */
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);
