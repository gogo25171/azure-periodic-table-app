# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn install          # required first; yarn only (package-lock.json is git-ignored)
yarn dev              # dev server at http://localhost:3000
yarn build            # next build
yarn start            # serve the production build
yarn lint             # next lint && eslint .
yarn typecheck        # tsc --noEmit
yarn test             # node --test on tests/**/*.test.mjs (no test framework installed)
yarn validate:data    # provider dataset checks (src/lib/data-audit.ts)
yarn verify           # lint + typecheck + test + validate:data — what CI runs
yarn gh:check         # yarn verify, then the GitHub Actions status of the branch (needs gh)
yarn check:deps       # yarn outdated + yarn audit summary
yarn add:resource     # guided (or --file resource.json) insertion of a resource
yarn add:provider     # scaffolds a provider across the 10 files that must know about it
yarn update:credits   # regenerates docs/about/credits.md from git shortlog (CI checks it)
yarn hooks:install    # git config core.hooksPath .githooks (pre-commit runs yarn verify)
```

Docs site (MkDocs, separate from the app):

```bash
pip install -r docs/requirements.txt
mkdocs serve          # http://localhost:8000
mkdocs build --strict # what CI runs
```

Data collectors (run from the `python/` directory, which is where their relative paths resolve):

```bash
cd python && pip install -r requirements.txt && python3 terraform-collector.py
```

Tests live in `tests/` and run on the built-in Node.js runner (`node --test`) through the TypeScript loader in `scripts/lib/load-ts.mjs` — there is no Jest/Vitest dependency, so add new tests as `tests/*.test.mjs`. CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, `validate:data`, the build and the credits check on every push.

npm is not used at all: there is no `package-lock.json` (git-ignored) and `yarn check:deps` reads `yarn outdated` / `yarn audit`.

## Architecture

Next.js 13 App Router + Tailwind + shadcn/ui (`src/components/ui/`, configured via `components.json`). Path alias `@/*` → `./src/*`.

### The page is rendered by the layout, not by `page.tsx`

`src/app/page.tsx` is an empty fragment. The entire table UI lives in [layout.tsx](src/app/layout.tsx), which wraps `{children}` in `ThemeProvider` → `LanguageProvider` → `CloudProviderProvider` → [table-wrapper.tsx](src/components/table-wrapper.tsx). `TableWrapper` is the real client-side root: it owns search text, active category, full-screen state, and renders `Header`, `Topbar` and `PeriodicTable` *around* its children.

The consequence is that `/resource/[id]` renders the sidebar as `children` **on top of** the still-mounted table — clicking a cell is a shallow navigation, not a page swap. [ConditionalLink](src/lib/ConditionalLink.tsx) wraps each cell.

Standalone routes opt out: `TableWrapper` checks `usePathname()` and renders only `children` for `/admin`.

### Multi-provider data model

Providers are `'azure' | 'aws' | 'google' | 'ovh' | 'scaleway'`, held in [CloudProviderContext.tsx](src/contexts/CloudProviderContext.tsx) (in-memory only, defaults to `azure`, not persisted).

Each provider has one data module in [src/app/data/](src/app/data/) that exports the same three things: `Item`, `ColumnType`, and `columns: ColumnType[]`. The `Item`/`ColumnType` types are **duplicated verbatim in every provider file** rather than shared; the rest of the app imports the types from `@/app/data/azure` and treats them as the canonical shape. Keep new provider files structurally identical or the components will not type-check.

`columns` is the visual layout: each entry is one vertical column of the table, in render order.

`/resource/[id]` resolves the id across **all** datasets in order, so ids must be globally unique. Non-Azure ids carry a provider prefix (`aws-`, `gcp-`, `ovh-`, `scaleway-`); Azure keeps bare ids for backwards compatibility. `yarn validate:data` enforces this.

Adding a provider touches ten places — run `yarn add:provider` rather than doing it by hand; the list is in [docs/contributing/adding-providers.md](docs/contributing/adding-providers.md) and encoded in [scripts/add-provider.mjs](scripts/add-provider.mjs).

### Data quality checks

[src/lib/data-audit.ts](src/lib/data-audit.ts) holds every dataset rule (duplicate ids, missing fields, wrong Terraform namespace, foreign provider keywords, icon files, URL scheme...). It is consumed by two front-ends:

- [/api/admin/audit](src/app/api/admin/audit/route.ts) → the `/admin` dashboard, gated by the server-side `ADMIN_PASSWORD` (empty means disabled, the route answers 503).
- [scripts/validate-data.mjs](scripts/validate-data.mjs) → the CLI and CI, which loads the TypeScript through [scripts/lib/load-ts.mjs](scripts/lib/load-ts.mjs) (a `ts.transpileModule` + require shim, no build step).

Severity contract: `error` means the app misbehaves (CI fails), `warning` means a data gap, `info` is cosmetic.

### Internationalisation

[src/i18n/dictionaries.ts](src/i18n/dictionaries.ts) holds the `en` (reference) and `fr` dictionaries; `Dictionary` is typed from `en`, so a missing French key fails the build. [LanguageContext.tsx](src/i18n/LanguageContext.tsx) exposes `useLanguage()` / `useTranslation()`; the choice is persisted in `localStorage` (`periodic-table.language`) and the first render uses `NEXT_PUBLIC_DEFAULT_LANGUAGE`.

Category labels are translated through the computed `category.${Categories.X}` keys.

### Code snippets: filesystem overrides the data file

`Item` carries inline `terraformCode` / `bicepCode` / `armCode`, but the server component [resource/[id]/page.tsx](src/app/resource/[id]/page.tsx) overwrites them at request time by reading `public/<provider>/code/{terraform,bicep,arm}/<id>.{tf,bicep,json}` when those files exist. Only `public/azure/code/` is currently populated. So to change an Azure snippet, edit the file under `public/azure/code/`, not the string in `azure.ts`.

That directory is machine-generated by [python/terraform-collector.py](python/terraform-collector.py), which regex-scrapes `id`/`slug`/`terraformUrl` out of the `.ts` data files and pulls the first Terraform block from the provider's docs on GitHub (per-provider namespace and docs path; hashicorp uses `website/docs/r/*.html.markdown`, ovh/scaleway use `docs/resources/*.md`). A weekly workflow (`run-code-collector.yml`) runs it and opens a PR on the `automated-code-snippet-update` branch. `arm-collector.py` and `bicep-collector.py` are Azure-only and read `../src/app/data/azure.ts`.

### Categories and colors

[src/app/constants.ts](src/app/constants.ts) defines the `Categories` enum; `categoryData` in [periodic-table.tsx](src/components/periodic-table.tsx) maps each category to a Tailwind class from `colorConfig` in [src/config.ts](src/config.ts). A category added to the enum without a `categoryData` entry renders cells with no background color, and a missing dictionary entry fails the type check.

### Assets and paths

Icons are referenced by an `icon` path string on each `Item`, resolved against `prefix` ([src/prefix.ts](src/prefix.ts) = `NEXT_PUBLIC_BASE_PATH`, empty by default) and served from `public/<provider>/icons/<Category>/`. An empty or missing icon falls back to `/default-icon.svg` (both in [column.tsx](src/components/column.tsx) and the sidebar).

`next.config.js` sets `images.unoptimized` with an `imgix` loader pointed at `onwardplatforms.github.io`; `output: 'export'` is commented out, and static export would break the `fs`-based snippet reads in the resource route.

### Configuration and env-gated features

- `src/config.ts` reads `NEXT_PUBLIC_SHOW_{GITHUB,LINKEDIN,TWITTER,DOCS}` and `NEXT_PUBLIC_{GITHUB,LINKEDIN,TWITTER,DOCS}_URL` to show/hide/retarget the header and share links. Because Next inlines `NEXT_PUBLIC_*` at build time, every variable must be referenced literally — never through a computed key.
- `src/lib/logger.ts` is the shared leveled logger (`NEXT_PUBLIC_LOG_LEVEL`, `warn` in production).
- AI chat ([chatbox.tsx](src/components/chatbox.tsx) → [src/pages/api/generate.tsx](src/pages/api/generate.tsx), a Pages-Router API route proxying streamed OpenAI completions) is off by default via `ENABLE_CHAT = false` in `constants.ts` and needs `OPENAI_API_KEY`.
- Google Analytics in `layout.tsx` needs `GA_TRACKING_ID`.
- PNG export ([download.tsx](src/components/download.tsx)) waits for every `<img>` of `#exportable-table-container` to settle, then rasterizes it with html2canvas — any DOM change to that container's id affects the exported image.
- `.env.example` documents every variable; the reference is [docs/reference/environment-variables.md](docs/reference/environment-variables.md).

## Conventions

- Source code, comments and UI strings are in **English**; French UI text lives in the `fr` dictionary.
- [TODO.md](TODO.md) is written in **French** (it is the owner's working list) and is not part of the MkDocs site.
- The `docs/` pages are written **once, in English**; `mkdocs-static-i18n` serves the French site under `/fr/` with fallback, and a page is only translated when a `*.fr.md` sibling exists. Do not re-add the manual `*Dernière mise à jour*` footers: `mkdocs-git-revision-date-localized` generates them from the git history.
