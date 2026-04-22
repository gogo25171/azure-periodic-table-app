# Deploy with Docker

This guide will walk you through the steps to deploy this application using Docker.

### Prerequisites

Before you start, ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/) - Download and install Docker for your operating system.

### Getting Started

1. Clone the docker image:

```bash
docker pull onwardplatforms/azure-periodic-table-dockerversion
```

2. Once you pulled the image, use the below command to check the docker images

```bash
docker images
```

3. Once the image shows up, it's time to run the image on your docker engine.

```bash
docker run -d -p 3000:3000 <docker-imageid>
```

4. Please use the below command to verify the DockerImage is running sucessfully.

```bash
docker ps -a
```

---
*Dernière mise à jour : 22 avril 2026*
