/* src/app/data/scaleway.ts */

import { Categories } from '../constants';

export type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  length: string;
  category: Categories;
  learnUrl: string;
  terraformUrl: string;
  restrictions: string;
  icon: string;
  terraformCode: string;
  resource?: string;
  entity?: string;
  scope?: string;
  bicepCode?: string;
  armCode?: string;
  pricingReferenceUrl?: string;
  portalUrl?: string;
  dnsConfiguration?: {
    commercial?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
    government?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
    china?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
  };
};

export type ColumnType = {
  items: Item[];
};

export const columns: ColumnType[] = [
  {
    items: [
      {
        id: 'scaleway-instance',
        name: 'Instance',
        slug: 'instance-',
        description:
          'Highly available and scalable virtual machines with guaranteed performance and per-second billing.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/instances/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/instance_server',
        restrictions: 'Alphanumerics, hyphens, underscores and dots.',
        resource: 'scaleway_instance_server',
        entity: 'servers',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_instance_server" "main" {
  name  = "instance-main"
  type  = "DEV1-S"
  image = "ubuntu_jammy"
  zone  = "fr-par-1"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/instance/servers',
      },
      {
        id: 'scaleway-elastic-metal',
        name: 'Elastic Metal Server',
        slug: 'em-',
        description:
          'Dedicated bare metal server provisioned in minutes and billed by the hour or by the month.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/elastic-metal/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/baremetal_server',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_baremetal_server',
        entity: 'servers',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_baremetal_server" "main" {
  name        = "em-main"
  zone        = "fr-par-2"
  offer       = "EM-A210R-HDD"
  os          = "ubuntu_jammy"
  ssh_key_ids = [scaleway_iam_ssh_key.main.id]
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/elastic-metal/servers',
      },
      {
        id: 'scaleway-apple-silicon',
        name: 'Apple Silicon',
        slug: 'mac-',
        description:
          'Dedicated Mac mini hosted by Scaleway, used to build and test macOS and iOS applications.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/apple-silicon/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/apple_silicon_server',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_apple_silicon_server',
        entity: 'servers',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_apple_silicon_server" "main" {
  name = "mac-main"
  type = "M2-M"
  zone = "fr-par-3"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/apple-silicon/servers',
      },
      {
        id: 'scaleway-serverless-function',
        name: 'Serverless Function',
        slug: 'fn-',
        description:
          'Runs a function on demand without managing servers, scaling to zero between invocations.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/serverless-functions/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/function',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'scaleway_function',
        entity: 'functions',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_function_namespace" "main" {
  name = "fnns-main"
}

resource "scaleway_function" "main" {
  namespace_id = scaleway_function_namespace.main.id
  name         = "fn-main"
  runtime      = "node22"
  handler      = "handler.handle"
  privacy      = "private"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/serverless-functions/',
        portalUrl: 'https://console.scaleway.com/functions/namespaces',
      },
      {
        id: 'scaleway-serverless-job',
        name: 'Serverless Job',
        slug: 'job-',
        description:
          'Runs a containerised batch job to completion, on a schedule or triggered through the API.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/serverless-jobs/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/job_definition',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'scaleway_job_definition',
        entity: 'jobDefinitions',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_job_definition" "main" {
  name         = "job-main"
  cpu_limit    = 140
  memory_limit = 256
  image_uri    = "docker.io/alpine:latest"
  command      = "echo hello"

  cron {
    schedule = "0 2 * * *"
    timezone = "Europe/Paris"
  }
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/serverless-jobs/',
        portalUrl: 'https://console.scaleway.com/serverless-jobs/jobs',
      },
    ],
  },
  {
    items: [
      {
        id: 'scaleway-kubernetes-kapsule',
        name: 'Kubernetes Kapsule',
        slug: 'k8s-',
        description:
          'Managed Kubernetes control plane with autohealing, autoscaling and a choice of CNI plugins.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/kubernetes/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/k8s_cluster',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_k8s_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_k8s_cluster" "main" {
  name                        = "k8s-main"
  version                     = "1.31.2"
  cni                         = "cilium"
  private_network_id          = scaleway_vpc_private_network.main.id
  delete_additional_resources = false
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/kubernetes/clusters',
      },
      {
        id: 'scaleway-kubernetes-pool',
        name: 'Kubernetes Pool',
        slug: 'k8spool-',
        description:
          'Group of worker nodes attached to a Kapsule cluster, with its own size and autoscaling rules.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/kubernetes/concepts/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/k8s_pool',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_k8s_pool',
        entity: 'pools',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_k8s_pool" "main" {
  cluster_id  = scaleway_k8s_cluster.main.id
  name        = "k8spool-main"
  node_type   = "DEV1-M"
  size        = 3
  autoscaling = true
  min_size    = 1
  max_size    = 5
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/kubernetes/clusters',
      },
      {
        id: 'scaleway-serverless-container',
        name: 'Serverless Container',
        slug: 'cnt-',
        description:
          'Runs a container image on demand with automatic scaling, without managing any cluster.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/serverless-containers/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/container',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'scaleway_container',
        entity: 'containers',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_container_namespace" "main" {
  name = "cntns-main"
}

resource "scaleway_container" "main" {
  name           = "cnt-main"
  namespace_id   = scaleway_container_namespace.main.id
  registry_image = "\${scaleway_container_namespace.main.registry_endpoint}/app:latest"
  port           = 8080
  min_scale      = 0
  max_scale      = 5
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/serverless-containers/',
        portalUrl: 'https://console.scaleway.com/containers/namespaces',
      },
      {
        id: 'scaleway-container-registry',
        name: 'Container Registry',
        slug: 'cr-',
        description:
          'Private registry namespace storing container images, with public or private visibility.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/container-registry/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/registry_namespace',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'scaleway_registry_namespace',
        entity: 'namespaces',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_registry_namespace" "main" {
  name        = "cr-main"
  description = "Application images"
  is_public   = false
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/registry/namespaces',
      },
      {
        id: 'scaleway-object-storage',
        name: 'Object Storage',
        slug: 's3-',
        description:
          'S3 compatible object storage with multi-AZ durability, lifecycle rules and Glacier class.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://www.scaleway.com/en/docs/object-storage/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/object_bucket',
        restrictions:
          'Lowercase letters, numbers, dots and hyphens. Must be unique inside the region.',
        resource: 'scaleway_object_bucket',
        entity: 'buckets',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_object_bucket" "main" {
  name = "s3-main"

  versioning {
    enabled = true
  }

  tags = {
    env = "production"
  }
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/object-storage/buckets',
      },
    ],
  },
  {
    items: [
      {
        id: 'scaleway-block-volume',
        name: 'Block Storage Volume',
        slug: 'vol-',
        description:
          'Network block device attached to an instance, resizable online and backed by snapshots.',
        length: '1-63',
        category: Categories.STORAGE,
        learnUrl: 'https://www.scaleway.com/en/docs/block-storage/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/block_volume',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_block_volume',
        entity: 'volumes',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_block_volume" "main" {
  name       = "vol-main"
  iops       = 5000
  size_in_gb = 100
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/block-storage/volumes',
      },
      {
        id: 'scaleway-managed-database',
        name: 'Managed Database',
        slug: 'rdb-',
        description:
          'Managed PostgreSQL and MySQL instances with high availability, automated backups and read replicas.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl:
          'https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/rdb_instance',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_rdb_instance',
        entity: 'instances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_rdb_instance" "main" {
  name           = "rdb-main"
  node_type      = "DB-DEV-S"
  engine         = "PostgreSQL-16"
  is_ha_cluster  = true
  disable_backup = false
  user_name      = "admin"
  password       = var.database_password
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/rdb/instances',
      },
      {
        id: 'scaleway-redis-cluster',
        name: 'Managed Redis',
        slug: 'redis-',
        description:
          'Managed Redis cluster used for caching, sessions and queues, with TLS and ACL support.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://www.scaleway.com/en/docs/managed-database-for-redis/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/redis_cluster',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_redis_cluster',
        entity: 'clusters',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_redis_cluster" "main" {
  name         = "redis-main"
  version      = "7.0.5"
  node_type    = "RED1-MICRO"
  user_name    = "admin"
  password     = var.redis_password
  cluster_size = 1
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/redis/clusters',
      },
      {
        id: 'scaleway-serverless-sql-database',
        name: 'Serverless SQL Database',
        slug: 'sdb-',
        description:
          'PostgreSQL compatible database that scales automatically with the workload and to zero when idle.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://www.scaleway.com/en/docs/serverless-sql-databases/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/sdb_sql_database',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'scaleway_sdb_sql_database',
        entity: 'databases',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_sdb_sql_database" "main" {
  name    = "sdb-main"
  min_cpu = 0
  max_cpu = 8
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/serverless-sql-databases/',
        portalUrl: 'https://console.scaleway.com/serverless-db/databases',
      },
      {
        id: 'scaleway-iot-hub',
        name: 'IoT Hub',
        slug: 'iot-',
        description:
          'MQTT broker managing device identities, routes and rules for connected fleets.',
        length: '1-63',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://www.scaleway.com/en/docs/iot-hub/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/iot_hub',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_iot_hub',
        entity: 'hubs',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_iot_hub" "main" {
  name         = "iot-main"
  product_plan = "plan_shared"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/iot-hub/hubs',
      },
    ],
  },
  {
    items: [
      {
        id: 'scaleway-load-balancer',
        name: 'Load Balancer',
        slug: 'lb-',
        description:
          'Highly available load balancer distributing HTTP and TCP traffic across healthy backends.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://www.scaleway.com/en/docs/load-balancer/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/lb',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_lb',
        entity: 'lbs',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_lb_ip" "main" {}

resource "scaleway_lb" "main" {
  name   = "lb-main"
  ip_ids = [scaleway_lb_ip.main.id]
  type   = "LB-S"
  zone   = "fr-par-1"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/load-balancer/lbs',
      },
      {
        id: 'scaleway-private-network',
        name: 'Private Network',
        slug: 'pn-',
        description:
          'Layer 2 network isolating the resources of a VPC, with an integrated DHCP and IPAM.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://www.scaleway.com/en/docs/vpc/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/vpc_private_network',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_vpc_private_network',
        entity: 'privateNetworks',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_vpc_private_network" "main" {
  name = "pn-main"

  ipv4_subnet {
    subnet = "172.16.32.0/22"
  }
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/vpc/private-networks',
      },
      {
        id: 'scaleway-public-gateway',
        name: 'Public Gateway',
        slug: 'pgw-',
        description:
          'Provides NAT, DHCP and SSH bastion services to the resources of a private network.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://www.scaleway.com/en/docs/public-gateways/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/vpc_public_gateway',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_vpc_public_gateway',
        entity: 'gateways',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_vpc_public_gateway" "main" {
  name = "pgw-main"
  type = "VPC-GW-S"
  zone = "fr-par-1"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/public-gateway/public-gateways',
      },
      {
        id: 'scaleway-security-group',
        name: 'Security Group',
        slug: 'sg-',
        description:
          'Stateful firewall rules applied to instances, controlling inbound and outbound traffic.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl:
          'https://www.scaleway.com/en/docs/instances/how-to/use-security-groups/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/instance_security_group',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_instance_security_group',
        entity: 'securityGroups',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "scaleway_instance_security_group" "main" {
  name                    = "sg-main"
  inbound_default_policy  = "drop"
  outbound_default_policy = "accept"

  inbound_rule {
    action = "accept"
    port   = 443
  }
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/instance/security-groups',
      },
      {
        id: 'scaleway-domain-record',
        name: 'Domain Record',
        slug: 'dns-',
        description:
          'DNS record published in a Scaleway managed zone, with optional geo or weighted routing.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://www.scaleway.com/en/docs/domains-and-dns/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/domain_record',
        restrictions: 'Must be a valid DNS subdomain label.',
        resource: 'scaleway_domain_record',
        entity: 'records',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_domain_record" "main" {
  dns_zone = "example.com"
  name     = "app"
  type     = "A"
  data     = "203.0.113.10"
  ttl      = 3600
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/domains/external',
      },
    ],
  },
  {
    items: [
      {
        id: 'scaleway-iam-application',
        name: 'IAM Application',
        slug: 'app-',
        description:
          'Machine identity holding API keys and policies, used by automation and CI pipelines.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://www.scaleway.com/en/docs/iam/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/iam_application',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_iam_application',
        entity: 'applications',
        scope: 'organization',
        icon: '',
        terraformCode: `resource "scaleway_iam_application" "main" {
  name        = "app-main"
  description = "Terraform automation"
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.scaleway.com/iam/applications',
      },
      {
        id: 'scaleway-iam-policy',
        name: 'IAM Policy',
        slug: 'pol-',
        description:
          'Set of permission rules granting an application, user or group access to projects and services.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://www.scaleway.com/en/docs/iam/concepts/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/iam_policy',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_iam_policy',
        entity: 'policies',
        scope: 'organization',
        icon: '',
        terraformCode: `resource "scaleway_iam_policy" "main" {
  name           = "pol-main"
  application_id = scaleway_iam_application.main.id

  rule {
    project_ids          = [var.project_id]
    permission_set_names = ["InstancesReadOnly"]
  }
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.scaleway.com/iam/policies',
      },
      {
        id: 'scaleway-secret',
        name: 'Secret Manager Secret',
        slug: 'sec-',
        description:
          'Encrypted store for API keys, passwords and certificates, with versioning and IAM control.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://www.scaleway.com/en/docs/secret-manager/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/secret',
        restrictions: 'Alphanumerics, hyphens, underscores and dots.',
        resource: 'scaleway_secret',
        entity: 'secrets',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_secret" "main" {
  name        = "sec-main"
  description = "Application credentials"
  tags        = ["terraform"]
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/secret-manager/secrets',
      },
      {
        id: 'scaleway-cockpit',
        name: 'Cockpit',
        slug: 'obs-',
        description:
          'Observability stack based on Grafana, Prometheus and Loki for metrics, logs and traces.',
        length: 'N/A',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://www.scaleway.com/en/docs/cockpit/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/cockpit',
        restrictions: 'One Cockpit per project; data sources are named separately.',
        resource: 'scaleway_cockpit',
        entity: 'cockpits',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_cockpit" "main" {
  project_id = var.project_id
  plan       = "free"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/cockpit/overview',
      },
      {
        id: 'scaleway-messaging-queue',
        name: 'Queues (SQS)',
        slug: 'mnq-',
        description:
          'SQS compatible managed queues decoupling producers from consumers in event driven applications.',
        length: '1-63',
        category: Categories.INTEGRATION,
        learnUrl: 'https://www.scaleway.com/en/docs/queues/',
        terraformUrl:
          'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/mnq_sqs',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'scaleway_mnq_sqs',
        entity: 'queues',
        scope: 'region',
        icon: '',
        terraformCode: `resource "scaleway_mnq_sqs" "main" {
  project_id = var.project_id
}

resource "scaleway_mnq_sqs_credentials" "main" {
  project_id = scaleway_mnq_sqs.main.project_id
  name       = "mnq-main"

  permissions {
    can_publish = true
    can_receive = true
    can_manage  = false
  }
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/queues/overview',
      },
    ],
  },
];
