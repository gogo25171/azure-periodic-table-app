# Cloud providers

Five datasets ship with the application. The provider is picked from the
header; the selection lives in memory only (`CloudProviderContext`) and resets
to Azure on reload.

| Provider | Id | Resources | Id prefix | Terraform provider |
| --- | --- | --- | --- | --- |
| Microsoft Azure | `azure` | 150+ | *(none, historical ids)* | `hashicorp/azurerm` |
| AWS | `aws` | 60 | `aws-` | `hashicorp/aws` |
| Google Cloud | `google` | 36 | `gcp-` | `hashicorp/google` |
| OVHcloud | `ovh` | 20 | `ovh-` | `ovh/ovh` |
| Scaleway | `scaleway` | 25 | `scaleway-` | `scaleway/scaleway` |

## Why ids are prefixed

`/resource/<id>` looks the id up in **every** dataset, in order, and renders the
first match. Two providers sharing an id therefore hide one of the two
resources. The prefix keeps ids unique, and the rule is enforced by
`yarn validate:data`.

Azure keeps its bare ids for backwards compatibility with existing links.

## Categories

Categories are shared across providers and declared in `src/app/constants.ts`:
General, Networking, Compute & Web, Containers, Databases, Storage, AI & ML,
Analytics & IoT, Virtual Desktop, Dev Tools, Integration, Migration and
Management.

Each one is mapped to a colour in `categoryData`
(`src/components/periodic-table.tsx`) and translated in
`src/i18n/dictionaries.ts`. A category added to the enum without a colour
renders its cells with no background.

## Icons

Icons are resolved from `public/<provider>/icons/<Category>/<file>` through the
`icon` field of each resource. A resource without an icon falls back to
`public/default-icon.svg`.

| Provider | Source |
| --- | --- |
| Azure | Microsoft Azure architecture icons, bundled in `public/azure/icons/` |
| AWS, Google Cloud | [theSVG](https://github.com/glincker/thesvg), through the `vendor/thesvg` git submodule |
| OVHcloud, Scaleway | none yet: no open source product icon set was found |

AWS and Google Cloud icons are mapped by hand in `scripts/icon-map.json`
(resource id → theSVG slug; sub-resources such as a subnet use their parent
service icon), then copied by:

```bash
yarn icons:sync             # copy the mapped icons, write the `icon` fields
yarn icons:sync --dry-run   # show what would change
yarn icons:sync --update    # first move the submodule to the latest theSVG
```

Only the copied files ship with the app. The submodule is checked out
sparsely (the AWS and Google Cloud icons only, about 3 MB instead of 57 MB);
the script sets that up itself on a fresh clone, so a plain
`git submodule update --init` is not needed. Licences are listed in the
[credits](../about/credits.md) and in `public/<provider>/icons/NOTICE.md`.

## Code snippets

The resource route reads
`public/<provider>/code/{terraform,bicep,arm}/<id>.{tf,bicep,json}` at request
time and, when the file exists, it **overrides** the snippet stored in the
dataset. Only `public/azure/code/` is populated today; those files are generated
by `python/terraform-collector.py`, which is scheduled weekly by the
`Update Code Snippets` workflow.
