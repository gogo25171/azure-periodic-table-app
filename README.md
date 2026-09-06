# Cloud Periodic Table

[![CI](https://img.shields.io/github/actions/workflow/status/gogo25171/azure-periodic-table-app/ci.yml?branch=main&label=CI&logo=github&style=flat-square)](https://github.com/gogo25171/azure-periodic-table-app/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/github/actions/workflow/status/gogo25171/azure-periodic-table-app/docs.yml?branch=main&label=Documentation&logo=materialformkdocs&logoColor=white&style=flat-square)](https://gogo25171.github.io/azure-periodic-table-app/)
[![Dépendances](https://img.shields.io/github/actions/workflow/status/gogo25171/azure-periodic-table-app/dependency-check.yml?branch=main&label=D%C3%A9pendances&logo=dependabot&logoColor=white&style=flat-square)](https://github.com/gogo25171/azure-periodic-table-app/actions/workflows/dependency-check.yml)

[![Next.js](https://img.shields.io/badge/Next.js-13.4-black?logo=nextdotjs&logoColor=white&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Node](https://img.shields.io/badge/Node-20.x-5FA04E?logo=nodedotjs&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-image-2496ED?logo=docker&logoColor=white&style=flat-square)](docs/deployment/docker.md)

[![Providers](https://img.shields.io/badge/providers-5-6366F1?style=flat-square)](docs/features/providers.md)
[![Ressources](https://img.shields.io/badge/ressources-294-6366F1?style=flat-square)](docs/features/providers.md)
[![Langues](https://img.shields.io/badge/langues-EN%20%7C%20FR-6366F1?style=flat-square)](docs/features/languages.md)
[![Tests](https://img.shields.io/badge/tests-29-4CAF50?style=flat-square)](docs/contributing/tooling.md)
[![Contrôles données](https://img.shields.io/badge/donn%C3%A9es-0%20erreur-4CAF50?style=flat-square)](docs/features/admin.md)
[![pre-commit](https://img.shields.io/badge/pre--commit-actif-FF9800?style=flat-square)](docs/contributing/tooling.md)
[![Licence](https://img.shields.io/badge/licence-AGPL--3.0-lightgrey?style=flat-square)](LICENSE)

An interactive periodic table of cloud resources — naming conventions, allowed
characters, documentation links and infrastructure as code snippets — for
**Azure**, **AWS**, **Google Cloud**, **OVHcloud** and **Scaleway**.

Built with [Next.js](https://nextjs.org/) 13 (App Router), TypeScript, Tailwind
CSS and shadcn/ui.

## Quick start

```bash
yarn install
yarn dev          # http://localhost:3000
```

Optional configuration lives in `.env.local` (copy `.env.example`): social
icons can be hidden or retargeted, the default language and the log level can be
changed, and `ADMIN_PASSWORD` unlocks the `/admin` data dashboard.

## Everyday commands

```bash
yarn verify         # lint + types + tests + provider data checks
yarn gh:check       # the same, plus the GitHub Actions status of the branch
yarn check:deps     # outdated packages and known vulnerabilities
yarn add:resource   # guided creation of a resource
yarn add:provider   # scaffolds a new cloud provider
yarn hooks:install  # run the checks before each commit
```

## Documentation

The full documentation is written with [MkDocs](https://www.mkdocs.org/) in
`docs/` and published on GitHub Pages by the `docs.yml` workflow. It is written
in English and served in English and French.

```bash
pip install -r docs/requirements.txt
mkdocs serve      # http://localhost:8000
```

Start with:

- [Getting started](docs/getting-started/1-prerequisites.md)
- [Configuration](docs/getting-started/3-configuration.md)
- [Cloud providers](docs/features/providers.md)
- [Contributing](docs/contributing/index.md)
- [Architecture](docs/reference/architecture.md)
