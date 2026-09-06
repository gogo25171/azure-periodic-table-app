/* scripts/lib/load-ts.mjs */

/**
 * Loads a TypeScript module from Node without a build step.
 *
 * The data files and `src/lib/data-audit.ts` are plain TypeScript with the
 * `@/*` path alias, so they are transpiled on the fly with the `typescript`
 * package (already a dependency) and evaluated with a small require shim.
 * That keeps the CLI checks and the admin dashboard on exactly the same rules.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);

const cache = new Map();

const EXTENSIONS = ['', '.ts', '.tsx', '.mts', '/index.ts', '/index.tsx'];

function resolveLocal(specifier, fromFile) {
  let base = null;
  if (specifier.startsWith('@/')) {
    base = path.join(ROOT, 'src', specifier.slice(2));
  } else if (specifier.startsWith('.')) {
    base = path.resolve(path.dirname(fromFile), specifier);
  }
  if (!base) return null;

  for (const extension of EXTENSIONS) {
    const candidate = base + extension;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

export function loadTsModule(filePath, { fresh = false } = {}) {
  const absolute = path.resolve(filePath);
  if (fresh) cache.delete(absolute);
  const cached = cache.get(absolute);
  if (cached) return cached.exports;

  const source = fs.readFileSync(absolute, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.Preserve,
      esModuleInterop: true,
    },
    fileName: absolute,
  });

  const module = { exports: {} };
  cache.set(absolute, module);

  const localRequire = (specifier) => {
    const resolved = resolveLocal(specifier, absolute);
    return resolved ? loadTsModule(resolved, { fresh }) : require(specifier);
  };

  const factory = new Function(
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    outputText
  );
  factory(
    module.exports,
    localRequire,
    module,
    absolute,
    path.dirname(absolute)
  );

  return module.exports;
}

/** Loads the shared audit engine used by both the CLI and the admin route. */
export function loadDataAudit() {
  return loadTsModule(path.join(ROOT, 'src', 'lib', 'data-audit.ts'));
}
