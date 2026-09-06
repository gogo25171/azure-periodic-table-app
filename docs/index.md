# Cloud Periodic Table

An interactive periodic table of cloud resources. Every cell is a service: click
it to get its naming convention, the allowed characters and length, links to the
official documentation, the pricing page and the console, plus a ready to use
infrastructure as code snippet.

The project started as the **Azure** periodic table and now ships five datasets:

| Provider | Resources | Data file |
| --- | --- | --- |
| Microsoft Azure | 150+ | `src/app/data/azure.ts` |
| AWS | 60 | `src/app/data/aws.ts` |
| Google Cloud | 36 | `src/app/data/google.ts` |
| OVHcloud | 20 | `src/app/data/ovh.ts` |
| Scaleway | 25 | `src/app/data/scaleway.ts` |

## What you can do with it

- **Browse and filter** the table by category, search by name or naming prefix.
- **Switch provider** from the header: the whole table is rebuilt from the
  selected dataset.
- **Read a resource sheet**: naming rules, scope, Terraform snippet (plus Bicep
  and ARM templates for Azure), private endpoint details for Azure.
- **Export the table** as a PNG image.
- **Switch language** between English and French, in the app and in these docs.
- **Audit the datasets** from the [admin dashboard](features/admin.md).

## Where to start

<div class="grid cards" markdown>

- :material-rocket-launch: **[Install and run](getting-started/1-prerequisites.md)** —
  prerequisites, installation and the development server.
- :material-cog: **[Configure](getting-started/3-configuration.md)** —
  environment variables, social links, language, logs.
- :material-source-branch: **[Contribute](contributing/index.md)** —
  add a resource, a provider, or run the checks.
- :material-sitemap: **[Architecture](reference/architecture.md)** —
  how the layout, the table and the resource route fit together.

</div>

## Technical stack

Next.js 13 (App Router), TypeScript, Tailwind CSS and shadcn/ui components.
The datasets are plain TypeScript modules, which keeps them type checked and
diff friendly; a Python collector refreshes the Terraform snippets weekly.
