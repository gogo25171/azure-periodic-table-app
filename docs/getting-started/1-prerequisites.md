# Prerequisites

| Tool | Version | Why |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | 18.17 or higher (20.x recommended) | Required by Next.js 13. |
| [Yarn](https://classic.yarnpkg.com/en/docs/install) | 1.22 or higher | `yarn.lock` is the committed lockfile. |
| [Git](https://git-scm.com/) | any recent version | Clone the repository and run the pre-push hook. |
| [Python](https://www.python.org/) | 3.9 or higher | Optional: documentation and data collectors. |
| [GitHub CLI](https://cli.github.com/) | any recent version | Optional: `yarn gh:check` reads the Actions status. |

Install Yarn through npm if you do not have it yet:

```bash
npm install -g yarn
```

!!! warning "npm is not used to install"
    The repository is a Yarn project. `npm` is only used by
    `yarn check:deps`, which reads `package-lock.json` to report outdated
    packages and advisories.
