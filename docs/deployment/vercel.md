# Deploy on Vercel

The application is a standard Next.js 13 App Router project: importing the
repository into [Vercel](https://vercel.com/new) is enough, the framework is
detected automatically.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Install command | `yarn install --frozen-lockfile` |
| Build command | `yarn build` |
| Output | *(left to the preset)* |

## Environment variables

Declare in **Settings → Environment Variables** whatever you want to change;
every variable is optional. The ones that matter most in production:

| Variable | Why |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL copied by the share button. |
| `NEXT_PUBLIC_SHOW_*`, `NEXT_PUBLIC_*_URL` | Show, hide or retarget the social icons. |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Language of the first render. |
| `NEXT_PUBLIC_LOG_LEVEL` | `warn` by default in production. |
| `ADMIN_PASSWORD` | Enables `/admin`. Leave it empty to keep it disabled. |
| `GA_TRACKING_ID` | Google Analytics. |
| `OPENAI_API_KEY` | Only if `ENABLE_CHAT` is turned on. |

`NEXT_PUBLIC_*` variables are read at **build** time: redeploy after changing
one. See the [full reference](../reference/environment-variables.md).

!!! warning "No static export"
    `output: 'export'` stays commented out in `next.config.js`: the resource
    route reads the code snippets from the filesystem at request time, which a
    static export cannot do.
