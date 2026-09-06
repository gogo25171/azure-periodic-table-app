# Deploy with Docker

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) installed on your machine.

## Using the published image

```bash
docker pull onwardplatforms/azure-periodic-table-dockerversion
docker run -d -p 3000:3000 onwardplatforms/azure-periodic-table-dockerversion
docker ps
```

The application answers on <http://localhost:3000>.

## Building the image yourself

The `docker/Dockerfile` builds from Node.js 20 (the version used by CI) and
runs `yarn build` then `yarn start`:

```bash
docker build -f docker/Dockerfile -t cloud-periodic-table .
docker run -d -p 3000:3000 cloud-periodic-table
```

## Environment variables

`NEXT_PUBLIC_*` variables are inlined **during the build**, so they must be
passed as build arguments, not at run time. Server side variables such as
`ADMIN_PASSWORD` are read at run time:

```bash
docker run -d -p 3000:3000 \
  -e ADMIN_PASSWORD=a-long-random-password \
  cloud-periodic-table
```

To change a public variable, add it to the `Dockerfile` before `yarn build`
(`ENV NEXT_PUBLIC_SITE_URL=...`) and rebuild the image. The list is documented
in the [environment variables reference](../reference/environment-variables.md).

## Automated build

The `docker-build.yml` workflow rebuilds and pushes the image when a file under
`docker/` changes on `main`. It needs the `DOCKER_USERNAME` and
`DOCKER_PASSWORD` repository secrets.
