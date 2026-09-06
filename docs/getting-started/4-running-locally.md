# Running locally

```bash
yarn dev
```

Open <http://localhost:3000>.

## Useful commands

| Command | What it does |
| --- | --- |
| `yarn dev` | Development server with hot reload. |
| `yarn build` | Production build. |
| `yarn start` | Serves the production build. |
| `yarn lint` | ESLint and the Next.js rules (what CI runs). |
| `yarn typecheck` | `tsc --noEmit`. |
| `yarn test` | Unit tests (`node --test`). |
| `yarn validate:data` | Provider dataset checks. |
| `yarn verify` | Lint, types, tests and data in one go. |
| `yarn gh:check` | `yarn verify` plus the GitHub Actions status of the branch. |
| `yarn check:deps` | Outdated packages and known vulnerabilities. |
| `yarn add:resource` | Guided creation of a new resource. |
| `yarn add:provider` | Scaffolds a new cloud provider. |
| `yarn docs:serve` | MkDocs on <http://localhost:8000>. |

## Where the UI lives

`src/app/page.tsx` is intentionally empty: the table is rendered by the layout
through `src/components/table-wrapper.tsx`. Editing that component (or the
dataset of the selected provider) is what changes the page. The
[architecture page](../reference/architecture.md) explains why.

## Admin dashboard

Set `ADMIN_PASSWORD` in `.env.local`, restart the server and open
<http://localhost:3000/admin> to run the dataset checks from the browser.
