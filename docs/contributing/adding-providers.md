# Adding new providers

A provider has to be declared in **ten** places. Missing one produces a silent
partial failure: a blank icon, an untranslated label, or a resource route that
renders `null`. The scaffolding script writes all ten for you.

## The scripted way

```bash
yarn add:provider --id oracle --name "Oracle Cloud" \
  --namespace oracle/oci \
  --prefix oci- \
  --color text-red-600 \
  --docs https://docs.oracle.com/en-us/iaas/ \
  --console https://cloud.oracle.com/ \
  --pricing https://www.oracle.com/cloud/price-list/
```

| Option | Default | Description |
| --- | --- | --- |
| `--id` | *(required)* | Lowercase identifier, e.g. `oracle`. |
| `--name` | *(required)* | Display name, e.g. `Oracle Cloud`. |
| `--namespace` | `<id>/<id>` | Terraform registry namespace, e.g. `oracle/oci`. |
| `--prefix` | `<id>-` | Prefix applied to every resource id. |
| `--color` | `text-slate-500` | Tailwind colour of the selector entry. |
| `--docs`, `--console`, `--pricing`, `--shell` | guessed from the id | Links used by the resource sheet. |
| `--dry-run` | — | Lists the files that would change, writes nothing. |

Nothing is written until every edit succeeds, so a failed run leaves the
repository untouched.

## What it touches

| # | File | Change |
| --- | --- | --- |
| 1 | `src/app/data/<id>.ts` | New dataset with one starter resource. |
| 2 | `src/components/ui/icons.tsx` | Placeholder icon named after the provider. |
| 3 | `src/contexts/CloudProviderContext.tsx` | Adds the id to the `CloudProvider` union. |
| 4 | `src/components/table-wrapper.tsx` | `providerData` and `providerConfig` entries. |
| 5 | `src/components/cloud-provider-selector.tsx` | Entry of the header dropdown. |
| 6 | `src/components/sidebar.tsx` | Branch with the provider labels and links. |
| 7 | `src/app/resource/[id]/page.tsx` | Entry of the `providers` array. |
| 8 | `src/lib/data-audit.ts` | Dataset, id prefix, keywords and Terraform namespace. |
| 9 | `scripts/add-resource.mjs` | Adds the provider to the guided prompts. |
| 10 | `python/terraform-collector.py` | Adds the provider to the snippet collector. |

## After the script

1. **Replace the placeholder icon** in `src/components/ui/icons.tsx` with the
   official logo (an inline `<svg>` using `currentColor`).
2. **Replace the starter resource** in `src/app/data/<id>.ts`, or add real ones
   with `yarn add:resource`.
3. **Drop the icon pack** under `public/<id>/icons/<Category>/` if you have one,
   then point the `icon` field of each resource at it.
4. **Run the checks**: `yarn validate:data` then `yarn verify`.
5. **Document it**: add a row to
   [Cloud providers](../features/providers.md).

## Doing it by hand

The same ten edits can be made manually — read
`scripts/add-provider.mjs`, which lists each anchor and the code it inserts.
Two details matter:

- the `Item` and `ColumnType` types are **duplicated verbatim** in every
  provider file; keep them identical or the shared components stop type
  checking;
- resource ids must start with the provider prefix, because `/resource/<id>`
  resolves ids across every dataset.
