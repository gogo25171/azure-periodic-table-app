# How to contribute

Contributions are welcome: new resources, a new cloud provider, translations,
documentation or bug fixes.

## The short version

```bash
yarn install
yarn hooks:install          # optional: checks before each commit
git checkout -b my-change
# ... your changes ...
yarn verify                 # lint + types + tests + provider data
git commit -m "feat: ..."
```

## Guides

- [Adding new providers](adding-providers.md) — extend the table to another
  cloud ecosystem, with the scaffolding script.
- [Adding new resources](adding-resources.md) — describe a service inside an
  existing dataset.
- [Tooling and CI](tooling.md) — the commands, the git hook and the workflows.

## House rules

- **Source, comments and UI strings are in English.** The French version of the
  interface lives in the dictionaries (`src/i18n/dictionaries.ts`), and this
  documentation is translated through the MkDocs i18n plugin.
- **Yarn only.** `yarn.lock` is the committed lockfile and `package-lock.json`
  is git-ignored: an npm install would create a second, drifting lockfile.
- **`yarn verify` must pass** before a commit (the pre-commit hook runs it).
- **`yarn validate:data` must pass.** It is the same rule set the
  [admin dashboard](../features/admin.md) displays.
- Keep a data file structurally identical to the others: `Item`, `ColumnType`
  and `columns` are duplicated on purpose in every provider module.
