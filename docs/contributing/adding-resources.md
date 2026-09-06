# Adding new resources

A resource is one entry of the `columns` array of a provider dataset
(`src/app/data/<provider>.ts`). The array **is** the layout: one entry per
vertical column of the table, in render order.

## The scripted way

```bash
yarn add:resource
```

The script asks for every field, suggests an id from the display name, lists the
available categories, inserts the entry in the column of your choice (or in a
new column) and finally runs the data checks on the result.

Non interactive mode, useful for bulk imports:

```bash
yarn add:resource --file resource.json
cat resource.json | yarn add:resource --file -
```

```json
{
  "provider": "scaleway",
  "id": "scaleway-cockpit",
  "name": "Cockpit",
  "slug": "obs-",
  "description": "Observability stack based on Grafana, Prometheus and Loki.",
  "length": "N/A",
  "category": "MANAGEMENT",
  "learnUrl": "https://www.scaleway.com/en/docs/cockpit/",
  "terraformUrl": "https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/cockpit",
  "restrictions": "One Cockpit per project.",
  "resource": "scaleway_cockpit",
  "entity": "cockpits",
  "scope": "project",
  "icon": "",
  "terraformCode": "resource \"scaleway_cockpit\" \"main\" {\n  plan = \"free\"\n}",
  "pricingReferenceUrl": "https://www.scaleway.com/en/pricing/",
  "portalUrl": "https://console.scaleway.com/cockpit/overview",
  "column": "new"
}
```

`category` accepts the enum key (`MANAGEMENT`) or its label (`Management`).
`column` accepts a 1 based index or `"new"`.

## The `Item` fields

### Required

| Field | Description |
| --- | --- |
| `id` | Unique across **every** provider; it is the URL of the resource sheet. Prefix it with the provider prefix (`aws-`, `gcp-`, `ovh-`, `scaleway-`). |
| `name` | Name displayed in the cell and in the sheet. |
| `slug` | Naming prefix of the convention, e.g. `s3-`. Ends with a hyphen. |
| `description` | One or two sentences describing the service. |
| `length` | Allowed name length, e.g. `3-63` or `N/A`. |
| `category` | A value of the `Categories` enum. |
| `learnUrl` | Official documentation. |
| `terraformUrl` | Terraform registry page **of the right provider**. |
| `restrictions` | Allowed characters and constraints. |
| `icon` | Path under `public/`, or `''` to use the default icon. |
| `terraformCode` | Snippet displayed in the Code tab. |

### Optional

| Field | Description |
| --- | --- |
| `resource`, `entity` | Namespace and entity, displayed as `resource/entity`. |
| `scope` | `project`, `region`, `global`, `tenant`... |
| `bicepCode`, `armCode` | Azure only; the extra tabs are hidden elsewhere. |
| `pricingReferenceUrl` | Pricing page. |
| `portalUrl` | Console or manager page. |
| `dnsConfiguration` | Azure private endpoints (sub-resources and DNS zones). |

!!! warning "Snippets can be overridden"
    If `public/<provider>/code/terraform/<id>.tf` exists, its content replaces
    `terraformCode` at request time. For Azure, edit the file rather than the
    dataset.

## Checking your addition

```bash
yarn validate:data --provider scaleway
yarn dev     # then pick the provider and click the cell
```

`yarn validate:data` catches duplicated ids, an id missing its prefix, a
`terraformUrl` pointing at another vendor, a missing icon file and the empty
fields. The [admin dashboard](../features/admin.md) shows the same report in the
browser.
