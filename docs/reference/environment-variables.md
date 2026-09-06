# Environment variables

Copy `.env.example` to `.env.local` and keep only the lines you change; every
variable has a working default.

## Client side (`NEXT_PUBLIC_*`)

These are inlined in the browser bundle at build time. Never put a secret here.

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_TITLE` | `Onward Platforms` | Name displayed next to the logo. |
| `NEXT_PUBLIC_SHOW_BRAND` | `true` | Shows the branding block (logo + title) of the header. |
| `NEXT_PUBLIC_SHOW_BRAND_LOGO` | `true` | Shows the logo of that block. |
| `NEXT_PUBLIC_SHOW_BRAND_TITLE` | `true` | Shows the title of that block. |
| `NEXT_PUBLIC_BRAND_LOGO_URL` | *(empty)* | Image served from `public/` used instead of the default icon, e.g. `/my-logo.svg`. |
| `NEXT_PUBLIC_BRAND_URL` | *(empty)* | Makes the branding block a link. |
| `NEXT_PUBLIC_SITE_URL` | `https://azureperiodictable.com/` | URL copied by the share button. |
| `NEXT_PUBLIC_BASE_PATH` | *(empty)* | Prefix used to resolve icons and assets when hosted under a sub-directory. |
| `NEXT_PUBLIC_SHOW_GITHUB` | `true` | Shows the GitHub icon. |
| `NEXT_PUBLIC_SHOW_LINKEDIN` | `true` | Shows the LinkedIn icon (header and share popover). |
| `NEXT_PUBLIC_SHOW_TWITTER` | `true` | Shows the Twitter icon (header and share popover). |
| `NEXT_PUBLIC_SHOW_DOCS` | `false` | Shows a link to the documentation. |
| `NEXT_PUBLIC_GITHUB_URL` | project repository | Target of the GitHub icon. |
| `NEXT_PUBLIC_LINKEDIN_URL` | author profile | Target of the LinkedIn icon. |
| `NEXT_PUBLIC_TWITTER_URL` | author profile | Target of the Twitter icon. |
| `NEXT_PUBLIC_DOCS_URL` | GitHub Pages site | Target of the documentation icon. |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | `en` | Language of the first render (`en` or `fr`). |
| `NEXT_PUBLIC_LOG_LEVEL` | `info` in dev, `warn` in prod | `silent`, `error`, `warn`, `info` or `debug`. |

Boolean variables accept `true/1/yes/on` and `false/0/no/off`; anything else
falls back to the default.

## Server side

| Variable | Default | Description |
| --- | --- | --- |
| `ADMIN_PASSWORD` | *(empty)* | Password of the `/admin` dashboard. Empty means disabled. |
| `OPENAI_API_KEY` | *(empty)* | Needed by the AI chat when `ENABLE_CHAT` is `true`. |
| `GA_TRACKING_ID` | *(empty)* | Google Analytics measurement id. |

## Code level switches

Some flags live in the code rather than in the environment:

| Constant | File | Description |
| --- | --- | --- |
| `ENABLE_CHAT` | `src/app/constants.ts` | Enables the AI chat panel of the resource sheet. |
| `Categories` | `src/app/constants.ts` | List of categories shared by all providers. |
| `colorConfig` | `src/config.ts` | Tailwind colour of each category. |
