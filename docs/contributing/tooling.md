# Tooling and CI

## Local commands

| Command | What it does |
| --- | --- |
| `yarn verify` | Lint, TypeScript, tests and provider data — the same gate as CI. |
| `yarn test` | Unit tests (`node --test`, no test framework to install). |
| `yarn gh:check` | `yarn verify`, then the GitHub Actions status of the current branch. |
| `yarn gh:check --local` | Local checks only (used by the git hook). |
| `yarn gh:check --remote` | GitHub Actions status only. |
| `yarn gh:check --watch` | Follows the latest run until it finishes. |
| `yarn validate:data` | Provider dataset checks ([rules](../features/admin.md)). |
| `yarn check:deps` | Outdated packages and known vulnerabilities. |
| `yarn add:resource` | Guided creation of a resource. |
| `yarn add:provider` | Scaffolds a new cloud provider. |
| `yarn update:credits` | Rebuilds the contributors list from the git history. |

`yarn gh:check` needs the [GitHub CLI](https://cli.github.com/) for the remote
part (`gh auth login` once). Without it, the local checks still run.

## Git hook

```bash
yarn hooks:install     # git config core.hooksPath .githooks
```

`.githooks/pre-commit` runs lint, the TypeScript check, the tests and the data
checks before each commit. Bypass it once with `git commit --no-verify`.

!!! tip "pre-commit or pre-push?"
    `pre-commit` runs on **every commit**, `pre-push` runs **once per push**.
    Renaming `.githooks/pre-commit` to `.githooks/pre-push` switches to the
    lighter cadence — the command inside the hook is identical.

## Workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `ci.yml` | every push, pull requests | Lint, types, tests, data checks, build, contributors list. |
| `dependency-check.yml` | weekly, manual, changes to the lockfile | Writes the outdated packages and advisories to the job summary. |
| `docs.yml` | changes under `docs/` or `mkdocs.yml` | Builds MkDocs in strict mode and deploys to GitHub Pages. |
| `run-code-collector.yml` | weekly, manual | Refreshes the Terraform snippets and opens a pull request. |
| `docker-build.yml` | changes under `docker/` | Builds and pushes the Docker image. |

## Tests

The suite runs on the **built-in Node.js test runner** — no Jest, no Vitest, no
extra dependency:

```bash
yarn test                                   # everything
node --test tests/i18n.test.mjs             # a single file
node --test --test-name-pattern="duplicate" # a single test
```

| File | What it protects |
| --- | --- |
| `tests/data-audit.test.mjs` | The datasets: no audit error, unique ids, prefixes, known categories, https URLs, right Terraform namespace. |
| `tests/edit-data-file.test.mjs` | The parser behind `yarn add:resource`, which rewrites real source files. |
| `tests/i18n.test.mjs` | Dictionary parity between languages, no empty string, matching placeholders. |
| `tests/config.test.mjs` | The environment variable defaults of the header and the branding block. |

Tests load the TypeScript sources directly through `scripts/lib/load-ts.mjs`,
so they always run against the real code rather than a copy.

## Dependency reports

```bash
yarn check:deps                     # human readable
yarn check:deps --markdown          # what CI writes in the job summary
yarn check:deps --json
yarn check:deps --fail-on high      # exit code 1 on high or critical advisories
```

The script uses `yarn outdated` and `yarn audit`: the repository has **no**
`package-lock.json` (it is git-ignored), because an npm lockfile would drift
from `yarn.lock`. Note that `yarn audit` counts vulnerable dependency *paths*,
not packages, so its numbers look higher than GitHub's.
