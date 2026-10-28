# Credits

## Contributors

Everyone who has committed to this repository, in order of first contribution.
The list is generated from the git history with `yarn update:credits` and
checked by CI, so a new contributor is never forgotten.

<!-- CONTRIBUTORS:START -->

- **Justin O'Connor**
- **Reilly O'Donnell**
- **Cpotharaju**
- **Ashley Arrington**
- **Cloud Conduction**
- **Steve Kaschimer**
- **GCLEMENT3il**
- **gogo25171**

<!-- CONTRIBUTORS:END -->

Bot accounts (Dependabot, Renovate, the snippet collector) are filtered out.

## Assets

- AWS SVG icon: <https://github.com/weibeld/aws-icons-svg/blob/main/misc/aws/AWS_80.svg>
- Google Cloud SVG icon: Copilot / Claude Code
- Azure SVG icon: bundled with the original project
- OVHcloud SVG icon: <https://github.com/simple-icons/simple-icons>
- Scaleway SVG icon: <https://github.com/simple-icons/simple-icons>
- Azure resource icon pack: [Microsoft Azure architecture icons](https://learn.microsoft.com/en-us/azure/architecture/icons/)
- AWS and Google Cloud resource icons: [theSVG](https://github.com/glincker/thesvg)
  (MIT), pulled as the `vendor/thesvg` git submodule and copied by
  `yarn icons:sync`:
    - [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/),
      © Amazon Web Services,
      [CC BY-ND 2.0](https://creativecommons.org/licenses/by-nd/2.0/), copied
      unmodified;
    - [Google Cloud icons](https://cloud.google.com/icons), © Google LLC,
      [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

Every icon and logo is a trademark of its owner and is only used to identify
the service.

## Data sources

- Terraform snippets: the provider documentation on GitHub
  ([azurerm](https://github.com/hashicorp/terraform-provider-azurerm),
  [aws](https://github.com/hashicorp/terraform-provider-aws),
  [google](https://github.com/hashicorp/terraform-provider-google),
  [ovh](https://github.com/ovh/terraform-provider-ovh),
  [scaleway](https://github.com/scaleway/terraform-provider-scaleway)),
  collected weekly by `python/terraform-collector.py`.
- Bicep and ARM snippets: the
  [Azure templates reference](https://learn.microsoft.com/en-us/azure/templates/)
  on Microsoft Learn.
- Latest provider releases: the public
  [Terraform registry](https://registry.terraform.io/) API.
- Naming conventions: the documentation of each provider, and for Azure the
  [Cloud Adoption Framework abbreviations](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations).

## Built with

- [Next.js](https://nextjs.org/), [React](https://react.dev/) and
  [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
  on [Radix UI](https://www.radix-ui.com/), [cmdk](https://cmdk.paco.me/) and
  [Lucide](https://lucide.dev/) icons
- [next-themes](https://github.com/pacocoursey/next-themes) for the dark mode
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
  for the code snippets
- [html2canvas](https://html2canvas.hertzen.com/) for the PNG export
- [Requests](https://requests.readthedocs.io/) and
  [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) for the
  snippet collectors in `python/`
- [MkDocs](https://www.mkdocs.org/) and
  [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) for this
  documentation, with
  [mkdocs-static-i18n](https://github.com/ultrabug/mkdocs-static-i18n),
  [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin)
  and [mkdocs-mermaid2](https://github.com/fralau/mkdocs-mermaid2-plugin)
