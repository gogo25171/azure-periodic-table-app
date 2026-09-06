# Configuration

Everything is configured through environment variables, in `.env.local` for a
local run or in the hosting platform settings. Start from `.env.example`.

!!! info "The NEXT_PUBLIC_ prefix"
    Variables prefixed with `NEXT_PUBLIC_` are inlined in the browser bundle at
    build time: restart `yarn dev` (or rebuild) after changing one. Variables
    without the prefix stay on the server — that is where `ADMIN_PASSWORD` and
    `OPENAI_API_KEY` belong.

## Branding block

The logo and the site name displayed on the left of the header are configurable:

```bash
NEXT_PUBLIC_SHOW_BRAND=false          # removes the logo and the title
NEXT_PUBLIC_SHOW_BRAND_LOGO=false     # keeps the title only
NEXT_PUBLIC_SHOW_BRAND_TITLE=false    # keeps the logo only
NEXT_PUBLIC_SITE_TITLE=My Cloud Table # changes the text
NEXT_PUBLIC_BRAND_LOGO_URL=/my-logo.svg
NEXT_PUBLIC_BRAND_URL=https://example.com
```

`NEXT_PUBLIC_BRAND_LOGO_URL` points at a file placed in `public/` (the path is
resolved against `NEXT_PUBLIC_BASE_PATH`), and `NEXT_PUBLIC_BRAND_URL` turns the
block into a link that opens in a new tab.

## Hiding the social icons

Each icon of the header (and of the share popover) can be hidden without
touching the code:

```bash
NEXT_PUBLIC_SHOW_GITHUB=false
NEXT_PUBLIC_SHOW_LINKEDIN=false
NEXT_PUBLIC_SHOW_TWITTER=false
NEXT_PUBLIC_SHOW_DOCS=true      # hidden by default
```

Accepted values are `true/1/yes/on` and `false/0/no/off`. An unset variable
keeps the default, so nothing disappears by accident.

## Changing where the icons point

```bash
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-account/your-fork
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-profile/
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-handle
NEXT_PUBLIC_DOCS_URL=https://your-account.github.io/your-fork/
```

The site title and the URL used by the share button follow the same pattern,
with `NEXT_PUBLIC_SITE_TITLE` and `NEXT_PUBLIC_SITE_URL`.

## Language

```bash
NEXT_PUBLIC_DEFAULT_LANGUAGE=fr   # en (default) or fr
```

This is the language of the first render only: the visitor's choice is stored
in their browser. See [Languages](../features/languages.md).

## Logs

```bash
NEXT_PUBLIC_LOG_LEVEL=debug       # silent | error | warn | info | debug
```

Defaults to `info` in development and `warn` in production.

## Admin dashboard

```bash
ADMIN_PASSWORD=a-long-random-password
```

Leaving it empty keeps `/admin` disabled: the API route answers `503` and never
runs the checks. See [Admin dashboard](../features/admin.md).

## AI chat

The chat panel of the resource sheet is off by default. Set `ENABLE_CHAT` to
`true` in `src/app/constants.ts` and provide an OpenAI key:

```bash
OPENAI_API_KEY=sk-...
```

## Analytics

```bash
GA_TRACKING_ID=G-XXXXXXXXXX
```

## Hosting under a sub-directory

When the app is not served from the root of a domain, set the base path used to
resolve the icons and the static assets:

```bash
NEXT_PUBLIC_BASE_PATH=/my-sub-path
```

The complete list lives in the
[environment variables reference](../reference/environment-variables.md).
