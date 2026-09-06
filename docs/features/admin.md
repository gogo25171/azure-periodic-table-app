# Admin dashboard

`/admin` runs consistency checks against every provider dataset and lists what
looks wrong: duplicated ids, empty fields, a resource pointing at the wrong
Terraform provider, a description mentioning another cloud, a missing icon file.

## Enabling it

```bash
# .env.local
ADMIN_PASSWORD=a-long-random-password
```

Restart the server and open <http://localhost:3000/admin>.

!!! danger "Server side variable"
    `ADMIN_PASSWORD` must **not** be prefixed with `NEXT_PUBLIC_`, otherwise it
    would be shipped in the browser bundle. When the variable is missing, the
    route answers `503` and the dashboard stays locked — that is the default.

The password is posted to `/api/admin/audit`, compared server side, and the
report is computed there as well. There is no session and no cookie: closing
the page locks it again.

## What is checked

| Rule | Severity | Meaning |
| --- | --- | --- |
| `duplicate-id` | error | Two providers use the same id; only the first is reachable at `/resource/<id>`. |
| `missing-field` | error | `id`, `name`, `slug` or `category` is empty. |
| `unknown-category` | error | The category is not declared in the `Categories` enum. |
| `id-format` | error | The id is not lowercase, or contains spaces. |
| `terraform-namespace` | error | `terraformUrl` points at another vendor's Terraform provider. |
| `empty-dataset` | error | The provider has no resource at all. |
| `incomplete-field` | warning | `description`, `length`, `learnUrl`, `terraformUrl` or `restrictions` is empty. |
| `id-prefix` | warning | The id does not start with the provider prefix. |
| `duplicate-slug` | warning | Two resources of the same provider share a naming prefix. |
| `length-format` | warning | `length` does not look like `3-24` or `N/A`. |
| `url-scheme` | warning | A URL is not served over https. |
| `foreign-content` | warning | The name or description mentions another cloud provider. |
| `icon-not-found` | warning | The declared icon file does not exist under `public/`. |
| `missing-icon` | notice | No icon declared: the cell uses the default icon. |
| `missing-terraform-code` | notice | No Terraform snippet. |
| `missing-pricing`, `missing-portal` | notice | No pricing or console URL. |
| `slug-format` | notice | The naming prefix does not end with a hyphen. |

## The same checks in a terminal

The rules live in `src/lib/data-audit.ts` and are shared with the CLI, so the
dashboard and CI never disagree:

```bash
yarn validate:data              # errors fail the command
yarn validate:data --strict     # warnings fail it too
yarn validate:data --verbose    # also print the notices
yarn validate:data --provider aws
yarn validate:data --json
```

`yarn validate:data` runs on every push through the
[CI workflow](../contributing/tooling.md).
