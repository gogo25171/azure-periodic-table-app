# GitHub Pages (documentation)

This documentation is published on GitHub Pages by the `docs.yml` workflow.
The application itself is **not** deployed there: its resource route reads
files from the filesystem at request time, which a static export cannot do.

## One time setup

1. Open **Settings → Pages** on the repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

Nothing else is required: the workflow already asks for the `pages: write` and
`id-token: write` permissions.

## What triggers a deployment

- a push on `main` touching `docs/**`, `mkdocs.yml` or the workflow itself;
- a manual run from the Actions tab (`workflow_dispatch`).

Pull requests build the site in strict mode but do not deploy, so a broken link
or a missing navigation entry fails the check before merging.

## Building locally

```bash
pip install -r docs/requirements.txt
mkdocs serve             # http://localhost:8000
mkdocs build --strict    # same command as CI
```

`mkdocs build --strict` turns warnings into errors: an entry of the `nav`
pointing at a file that does not exist fails the build.

## Site URL

`site_url` in `mkdocs.yml` must match the published address, otherwise the
language switcher and the canonical links point at the wrong host:

```yaml
site_url: https://<account>.github.io/<repository>/
```
