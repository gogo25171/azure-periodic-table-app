# Installation

```bash
git clone https://github.com/onwardplatforms/azure-periodic-table-app.git
cd azure-periodic-table-app
yarn install
```

!!! note "Skipping the install"
    Without `yarn install` the development server fails with `next: not found`.

## Optional: environment variables

Copy the example file and adjust what you need. Every variable has a default,
so the application starts without any configuration.

```bash
cp .env.example .env.local
```

See the [configuration guide](3-configuration.md) and the
[full reference](../reference/environment-variables.md).

## Optional: git hook

Install the pre-commit hook so lint, types and the provider data checks run
before every commit:

```bash
yarn hooks:install
```

## Optional: documentation toolchain

```bash
pip install -r docs/requirements.txt
mkdocs serve
```
