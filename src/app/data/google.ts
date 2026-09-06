/* src/app/data/google.ts */

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
        id: 'gcp-compute-engine',
        name: 'Compute Engine',
        slug: 'gce-',
        description:
          'Secure and customizable virtual machines running on the same infrastructure that powers Google products.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/compute/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter and cannot end with a hyphen.',
        resource: 'google_compute_instance',
        entity: 'instances',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "google_compute_instance" "main" {
  name         = "gce-main"
  machine_type = "e2-medium"
  zone         = "europe-west1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }

  network_interface {
    network = "default"
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/compute/pricing',
        portalUrl: 'https://console.cloud.google.com/compute',
      },
      {
        id: 'gcp-cloud-run',
        name: 'Cloud Run',
        slug: 'cr-',
        description:
          'Fully managed platform that runs stateless containers and scales them to zero when idle.',
        length: '1-49',
        category: Categories.CONTAINERS,
        learnUrl: 'https://cloud.google.com/run/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service',
        restrictions:
          'Lowercase letters, numbers and hyphens. Cannot start or end with a hyphen.',
        resource: 'google_cloud_run_v2_service',
        entity: 'services',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_cloud_run_v2_service" "main" {
  name     = "cr-main"
  location = "europe-west1"

  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
    }
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/run/pricing',
        portalUrl: 'https://console.cloud.google.com/run',
      },
      {
        id: 'gcp-cloud-functions',
        name: 'Cloud Run Functions',
        slug: 'func-',
        description:
          'Event driven functions as a service, triggered by HTTP requests, Pub/Sub messages or storage events.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/functions/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudfunctions2_function',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_cloudfunctions2_function',
        entity: 'functions',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_cloudfunctions2_function" "main" {
  name     = "func-main"
  location = "europe-west1"

  build_config {
    runtime     = "nodejs20"
    entry_point = "helloHttp"

    source {
      storage_source {
        bucket = google_storage_bucket.main.name
        object = google_storage_bucket_object.main.name
      }
    }
  }

  service_config {
    max_instance_count = 3
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/functions/pricing',
        portalUrl: 'https://console.cloud.google.com/functions',
      },
      {
        id: 'gcp-app-engine',
        name: 'App Engine',
        slug: 'gae-',
        description:
          'Fully managed serverless platform for building and hosting web applications and APIs.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/appengine/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/app_engine_application',
        restrictions:
          'One application per project; the identifier is the project id.',
        resource: 'google_app_engine_application',
        entity: 'applications',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_app_engine_application" "main" {
  project     = var.project_id
  location_id = "europe-west"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/appengine/pricing',
        portalUrl: 'https://console.cloud.google.com/appengine',
      },
      {
        id: 'gcp-instance-group-manager',
        name: 'Managed Instance Group',
        slug: 'mig-',
        description:
          'Keeps a group of identical Compute Engine instances healthy and automatically scaled.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/compute/docs/instance-groups',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance_group_manager',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_instance_group_manager',
        entity: 'instanceGroupManagers',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "google_compute_instance_group_manager" "main" {
  name               = "mig-main"
  base_instance_name = "gce-main"
  zone               = "europe-west1-b"
  target_size        = 2

  version {
    instance_template = google_compute_instance_template.main.self_link
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/compute/pricing',
        portalUrl: 'https://console.cloud.google.com/compute/instanceGroups',
      },
      {
        id: 'gcp-workstations-cluster',
        name: 'Cloud Workstations Cluster',
        slug: 'ws-',
        description:
          'Managed development environments accessed from a browser or an IDE, with private networking.',
        length: '1-63',
        category: Categories.VIRTUALDESKTOP,
        learnUrl: 'https://cloud.google.com/workstations/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/workstations_workstation_cluster',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_workstations_workstation_cluster',
        entity: 'workstationClusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_workstations_workstation_cluster" "main" {
  provider                   = google-beta
  workstation_cluster_id     = "ws-main"
  location                   = "europe-west1"
  network                    = google_compute_network.main.id
  subnetwork                 = google_compute_subnetwork.main.id
}`,
        pricingReferenceUrl: 'https://cloud.google.com/workstations/pricing',
        portalUrl: 'https://console.cloud.google.com/workstations',
      },
    ],
  },
  {
    items: [
      {
        id: 'gcp-gke',
        name: 'Google Kubernetes Engine',
        slug: 'gke-',
        description:
          'Managed Kubernetes with autopilot or standard mode, node auto-repair and integrated logging.',
        length: '1-40',
        category: Categories.CONTAINERS,
        learnUrl: 'https://cloud.google.com/kubernetes-engine/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter and cannot end with a hyphen.',
        resource: 'google_container_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_container_cluster" "main" {
  name     = "gke-main"
  location = "europe-west1"

  remove_default_node_pool = true
  initial_node_count       = 1
}`,
        pricingReferenceUrl: 'https://cloud.google.com/kubernetes-engine/pricing',
        portalUrl: 'https://console.cloud.google.com/kubernetes',
      },
      {
        id: 'gcp-gke-node-pool',
        name: 'GKE Node Pool',
        slug: 'gkenp-',
        description:
          'Group of nodes sharing the same configuration inside a GKE cluster, with its own autoscaling rules.',
        length: '1-40',
        category: Categories.CONTAINERS,
        learnUrl:
          'https://cloud.google.com/kubernetes-engine/docs/concepts/node-pools',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_node_pool',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_container_node_pool',
        entity: 'nodePools',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_container_node_pool" "main" {
  name       = "gkenp-main"
  cluster    = google_container_cluster.main.id
  node_count = 2

  node_config {
    machine_type = "e2-standard-2"
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/kubernetes-engine/pricing',
        portalUrl: 'https://console.cloud.google.com/kubernetes',
      },
      {
        id: 'gcp-artifact-registry',
        name: 'Artifact Registry',
        slug: 'ar-',
        description:
          'Repository for container images, Maven, npm and other language packages, with vulnerability scanning.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://cloud.google.com/artifact-registry/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_artifact_registry_repository',
        entity: 'repositories',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_artifact_registry_repository" "main" {
  repository_id = "ar-main"
  location      = "europe-west1"
  format        = "DOCKER"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/artifact-registry/pricing',
        portalUrl: 'https://console.cloud.google.com/artifacts',
      },
      {
        id: 'gcp-cloud-storage',
        name: 'Cloud Storage',
        slug: 'gcs-',
        description:
          'Object storage with standard, nearline, coldline and archive classes and lifecycle management.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://cloud.google.com/storage/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket',
        restrictions:
          'Lowercase letters, numbers, hyphens, underscores and dots. Must be globally unique.',
        resource: 'google_storage_bucket',
        entity: 'buckets',
        scope: 'global',
        icon: '',
        terraformCode: `resource "google_storage_bucket" "main" {
  name                        = "gcs-main-\${var.project_id}"
  location                    = "EU"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/storage/pricing',
        portalUrl: 'https://console.cloud.google.com/storage',
      },
      {
        id: 'gcp-persistent-disk',
        name: 'Persistent Disk',
        slug: 'pd-',
        description:
          'Durable block storage attached to Compute Engine instances, with snapshots and resizing.',
        length: '1-63',
        category: Categories.STORAGE,
        learnUrl: 'https://cloud.google.com/compute/docs/disks',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_disk',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_disk',
        entity: 'disks',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "google_compute_disk" "main" {
  name = "pd-main"
  type = "pd-balanced"
  zone = "europe-west1-b"
  size = 100
}`,
        pricingReferenceUrl: 'https://cloud.google.com/compute/disks-image-pricing',
        portalUrl: 'https://console.cloud.google.com/compute/disks',
      },
      {
        id: 'gcp-filestore',
        name: 'Filestore',
        slug: 'fsi-',
        description:
          'Managed NFS file shares for applications that need a shared POSIX file system.',
        length: '1-63',
        category: Categories.STORAGE,
        learnUrl: 'https://cloud.google.com/filestore/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/filestore_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_filestore_instance',
        entity: 'instances',
        scope: 'zone',
        icon: '',
        terraformCode: `resource "google_filestore_instance" "main" {
  name     = "fsi-main"
  location = "europe-west1-b"
  tier     = "BASIC_HDD"

  file_shares {
    capacity_gb = 1024
    name        = "share1"
  }

  networks {
    network = "default"
    modes   = ["MODE_IPV4"]
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/filestore/pricing',
        portalUrl: 'https://console.cloud.google.com/filestore',
      },
    ],
  },
  {
    items: [
      {
        id: 'gcp-cloud-sql',
        name: 'Cloud SQL',
        slug: 'csql-',
        description:
          'Managed MySQL, PostgreSQL and SQL Server instances with automated backups and high availability.',
        length: '1-98',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/sql/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_sql_database_instance',
        entity: 'instances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_sql_database_instance" "main" {
  name             = "csql-main"
  database_version = "POSTGRES_16"
  region           = "europe-west1"

  settings {
    tier = "db-f1-micro"
  }

  deletion_protection = true
}`,
        pricingReferenceUrl: 'https://cloud.google.com/sql/pricing',
        portalUrl: 'https://console.cloud.google.com/sql',
      },
      {
        id: 'gcp-alloydb-cluster',
        name: 'AlloyDB Cluster',
        slug: 'alloy-',
        description:
          'PostgreSQL compatible database built for demanding transactional and analytical workloads.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/alloydb/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/alloydb_cluster',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_alloydb_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_alloydb_cluster" "main" {
  cluster_id = "alloy-main"
  location   = "europe-west1"
  network_config {
    network = google_compute_network.main.id
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/alloydb/pricing',
        portalUrl: 'https://console.cloud.google.com/alloydb',
      },
      {
        id: 'gcp-firestore',
        name: 'Firestore',
        slug: 'fs-',
        description:
          'Serverless document database with real time synchronisation and offline support for mobile clients.',
        length: '4-63',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/firestore/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firestore_database',
        restrictions:
          'Lowercase letters, numbers and hyphens, or the literal (default) database.',
        resource: 'google_firestore_database',
        entity: 'databases',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_firestore_database" "main" {
  project     = var.project_id
  name        = "(default)"
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/firestore/pricing',
        portalUrl: 'https://console.cloud.google.com/firestore',
      },
      {
        id: 'gcp-bigtable-instance',
        name: 'Bigtable Instance',
        slug: 'bt-',
        description:
          'Wide column NoSQL database for very large analytical and operational workloads with low latency.',
        length: '6-33',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/bigtable/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigtable_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_bigtable_instance',
        entity: 'instances',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_bigtable_instance" "main" {
  name = "bt-main-instance"

  cluster {
    cluster_id   = "bt-main-c1"
    zone         = "europe-west1-b"
    num_nodes    = 1
    storage_type = "SSD"
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/bigtable/pricing',
        portalUrl: 'https://console.cloud.google.com/bigtable',
      },
      {
        id: 'gcp-spanner-instance',
        name: 'Spanner Instance',
        slug: 'spn-',
        description:
          'Globally distributed relational database combining SQL semantics with horizontal scalability.',
        length: '2-64',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/spanner/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/spanner_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_spanner_instance',
        entity: 'instances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_spanner_instance" "main" {
  name         = "spn-main"
  config       = "regional-europe-west1"
  display_name = "Main instance"
  num_nodes    = 1
}`,
        pricingReferenceUrl: 'https://cloud.google.com/spanner/pricing',
        portalUrl: 'https://console.cloud.google.com/spanner',
      },
      {
        id: 'gcp-memorystore-redis',
        name: 'Memorystore for Redis',
        slug: 'mem-',
        description:
          'Managed Redis instances used for caching, session storage and low latency data access.',
        length: '1-40',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/memorystore/docs/redis',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/redis_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_redis_instance',
        entity: 'instances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_redis_instance" "main" {
  name           = "mem-main"
  memory_size_gb = 1
  region         = "europe-west1"
  tier           = "BASIC"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/memorystore/docs/redis/pricing',
        portalUrl: 'https://console.cloud.google.com/memorystore',
      },
    ],
  },
  {
    items: [
      {
        id: 'gcp-vpc',
        name: 'Virtual Private Cloud',
        slug: 'vpc-',
        description:
          'Global software defined network holding the subnets, routes and firewall rules of a project.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/vpc/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_network',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_compute_network',
        entity: 'networks',
        scope: 'global',
        icon: '',
        terraformCode: `resource "google_compute_network" "main" {
  name                    = "vpc-main"
  auto_create_subnetworks = false
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing',
        portalUrl: 'https://console.cloud.google.com/networking/networks',
      },
      {
        id: 'gcp-subnet',
        name: 'Subnetwork',
        slug: 'snet-',
        description:
          'Regional IP range inside a VPC, optionally with secondary ranges for GKE pods and services.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/vpc/docs/subnets',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_subnetwork',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_subnetwork',
        entity: 'subnetworks',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_compute_subnetwork" "main" {
  name          = "snet-main"
  network       = google_compute_network.main.id
  region        = "europe-west1"
  ip_cidr_range = "10.0.1.0/24"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing',
        portalUrl: 'https://console.cloud.google.com/networking/subnetworks',
      },
      {
        id: 'gcp-firewall-rule',
        name: 'Firewall Rule',
        slug: 'fw-',
        description:
          'Allows or denies traffic to instances based on protocol, ports, tags and service accounts.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/firewall/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_firewall',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_firewall',
        entity: 'firewalls',
        scope: 'global',
        icon: '',
        terraformCode: `resource "google_compute_firewall" "main" {
  name    = "fw-main"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing',
        portalUrl: 'https://console.cloud.google.com/networking/firewalls',
      },
      {
        id: 'gcp-cloud-load-balancing',
        name: 'Cloud Load Balancing',
        slug: 'clb-',
        description:
          'Global or regional load balancing for HTTP(S), TCP and UDP traffic, with Cloud CDN integration.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/load-balancing/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_forwarding_rule',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_forwarding_rule',
        entity: 'forwardingRules',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_compute_forwarding_rule" "main" {
  name       = "clb-main"
  region     = "europe-west1"
  target     = google_compute_target_pool.main.id
  port_range = "80"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing#lb',
        portalUrl: 'https://console.cloud.google.com/net-services/loadbalancing',
      },
      {
        id: 'gcp-cloud-dns',
        name: 'Cloud DNS',
        slug: 'dns-',
        description:
          'Authoritative DNS serving public or private zones on Google global anycast name servers.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/dns/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_managed_zone',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_dns_managed_zone',
        entity: 'managedZones',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_dns_managed_zone" "main" {
  name     = "dns-main"
  dns_name = "example.com."
}`,
        pricingReferenceUrl: 'https://cloud.google.com/dns/pricing',
        portalUrl: 'https://console.cloud.google.com/net-services/dns',
      },
      {
        id: 'gcp-cloud-nat',
        name: 'Cloud NAT',
        slug: 'nat-',
        description:
          'Outbound only internet access for instances without external IP addresses, attached to a Cloud Router.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/nat/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_router_nat',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'google_compute_router_nat',
        entity: 'routerNats',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_compute_router_nat" "main" {
  name   = "nat-main"
  router = google_compute_router.main.name
  region = "europe-west1"

  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/nat/pricing',
        portalUrl: 'https://console.cloud.google.com/net-services/nat',
      },
    ],
  },
  {
    items: [
      {
        id: 'gcp-bigquery',
        name: 'BigQuery Dataset',
        slug: 'bq-',
        description:
          'Serverless data warehouse with separated storage and compute, streaming ingestion and built-in ML.',
        length: '1-1024',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://cloud.google.com/bigquery/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigquery_dataset',
        restrictions: 'Letters, numbers and underscores only.',
        resource: 'google_bigquery_dataset',
        entity: 'datasets',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_bigquery_dataset" "main" {
  dataset_id                  = "bq_main"
  location                    = "EU"
  default_table_expiration_ms = 3600000
}`,
        pricingReferenceUrl: 'https://cloud.google.com/bigquery/pricing',
        portalUrl: 'https://console.cloud.google.com/bigquery',
      },
      {
        id: 'gcp-pubsub-topic',
        name: 'Pub/Sub Topic',
        slug: 'ps-',
        description:
          'Asynchronous messaging that decouples event producers from the services processing those events.',
        length: '3-255',
        category: Categories.INTEGRATION,
        learnUrl: 'https://cloud.google.com/pubsub/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/pubsub_topic',
        restrictions:
          'Letters, numbers, hyphens, underscores, dots, tildes, pluses and percent signs. Cannot start with goog.',
        resource: 'google_pubsub_topic',
        entity: 'topics',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_pubsub_topic" "main" {
  name = "ps-main"

  message_retention_duration = "86600s"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/pubsub/pricing',
        portalUrl: 'https://console.cloud.google.com/cloudpubsub',
      },
      {
        id: 'gcp-dataflow-job',
        name: 'Dataflow Job',
        slug: 'df-',
        description:
          'Managed Apache Beam pipelines for stream and batch data processing with autoscaling workers.',
        length: '1-63',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://cloud.google.com/dataflow/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataflow_job',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_dataflow_job',
        entity: 'jobs',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_dataflow_job" "main" {
  name              = "df-main"
  template_gcs_path = "gs://dataflow-templates/latest/Word_Count"
  temp_gcs_location = "gs://\${google_storage_bucket.main.name}/tmp"
  region            = "europe-west1"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/dataflow/pricing',
        portalUrl: 'https://console.cloud.google.com/dataflow',
      },
      {
        id: 'gcp-dataproc-cluster',
        name: 'Dataproc Cluster',
        slug: 'dp-',
        description:
          'Managed Spark and Hadoop clusters that start in seconds and shut down when the job completes.',
        length: '3-52',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://cloud.google.com/dataproc/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dataproc_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter and cannot end with a hyphen.',
        resource: 'google_dataproc_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_dataproc_cluster" "main" {
  name   = "dp-main"
  region = "europe-west1"

  cluster_config {
    master_config {
      num_instances = 1
      machine_type  = "e2-standard-2"
    }
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/dataproc/pricing',
        portalUrl: 'https://console.cloud.google.com/dataproc',
      },
      {
        id: 'gcp-vertex-ai-endpoint',
        name: 'Vertex AI Endpoint',
        slug: 'vai-',
        description:
          'Serving endpoint exposing a deployed model for online predictions, with traffic splitting.',
        length: '1-128',
        category: Categories.AIANDML,
        learnUrl: 'https://cloud.google.com/vertex-ai/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/vertex_ai_endpoint',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'google_vertex_ai_endpoint',
        entity: 'endpoints',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_vertex_ai_endpoint" "main" {
  name         = "vai-main"
  display_name = "Main prediction endpoint"
  location     = "europe-west1"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vertex-ai/pricing',
        portalUrl: 'https://console.cloud.google.com/vertex-ai',
      },
      {
        id: 'gcp-cloud-build-trigger',
        name: 'Cloud Build Trigger',
        slug: 'cbt-',
        description:
          'Starts a build pipeline when code is pushed to a repository or when a Pub/Sub message arrives.',
        length: '1-64',
        category: Categories.DEVTOOLS,
        learnUrl: 'https://cloud.google.com/build/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuild_trigger',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_cloudbuild_trigger',
        entity: 'triggers',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_cloudbuild_trigger" "main" {
  name     = "cbt-main"
  location = "europe-west1"
  filename = "cloudbuild.yaml"

  github {
    owner = "example"
    name  = "repo"

    push {
      branch = "^main$"
    }
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/build/pricing',
        portalUrl: 'https://console.cloud.google.com/cloud-build',
      },
    ],
  },
  {
    items: [
      {
        id: 'gcp-iam-member',
        name: 'IAM Binding',
        slug: 'iam-',
        description:
          'Grants a role on a project, folder or resource to a user, group or service account.',
        length: 'N/A',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/iam/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam',
        restrictions: 'Bindings are identified by their role and member.',
        resource: 'google_project_iam_member',
        entity: 'iamPolicies',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_project_iam_member" "main" {
  project = var.project_id
  role    = "roles/viewer"
  member  = "serviceAccount:\${google_service_account.main.email}"
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.cloud.google.com/iam-admin',
      },
      {
        id: 'gcp-service-account',
        name: 'Service Account',
        slug: 'sa-',
        description:
          'Non human identity used by workloads to authenticate to Google Cloud APIs.',
        length: '6-30',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/iam/docs/service-accounts',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a letter.',
        resource: 'google_service_account',
        entity: 'serviceAccounts',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_service_account" "main" {
  account_id   = "sa-main"
  display_name = "Main workload identity"
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
      },
      {
        id: 'gcp-kms-crypto-key',
        name: 'Cloud KMS Key',
        slug: 'kms-',
        description:
          'Customer managed encryption key with rotation, hosted in a software or HSM protection level.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/kms/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/kms_crypto_key',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'google_kms_crypto_key',
        entity: 'cryptoKeys',
        scope: 'region',
        icon: '',
        terraformCode: `resource "google_kms_crypto_key" "main" {
  name            = "kms-main"
  key_ring        = google_kms_key_ring.main.id
  rotation_period = "7776000s"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/kms/pricing',
        portalUrl: 'https://console.cloud.google.com/security/kms',
      },
      {
        id: 'gcp-secret-manager-secret',
        name: 'Secret Manager Secret',
        slug: 'sec-',
        description:
          'Stores API keys, passwords and certificates with versioning, IAM control and audit logging.',
        length: '1-255',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/secret-manager/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/secret_manager_secret',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'google_secret_manager_secret',
        entity: 'secrets',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_secret_manager_secret" "main" {
  secret_id = "sec-main"

  replication {
    auto {}
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/secret-manager/pricing',
        portalUrl: 'https://console.cloud.google.com/security/secret-manager',
      },
      {
        id: 'gcp-logging-sink',
        name: 'Logging Sink',
        slug: 'sink-',
        description:
          'Routes filtered log entries to Cloud Storage, BigQuery, Pub/Sub or another logging bucket.',
        length: '1-100',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/logging/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/logging_project_sink',
        restrictions: 'Letters, numbers, underscores, hyphens and dots.',
        resource: 'google_logging_project_sink',
        entity: 'sinks',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_logging_project_sink" "main" {
  name        = "sink-main"
  destination = "storage.googleapis.com/\${google_storage_bucket.main.name}"
  filter      = "severity >= WARNING"

  unique_writer_identity = true
}`,
        pricingReferenceUrl: 'https://cloud.google.com/stackdriver/pricing',
        portalUrl: 'https://console.cloud.google.com/logs',
      },
      {
        id: 'gcp-monitoring-alert-policy',
        name: 'Monitoring Alert Policy',
        slug: 'alert-',
        description:
          'Evaluates metric conditions and notifies the configured channels when a threshold is crossed.',
        length: '1-255',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/monitoring/docs',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/monitoring_alert_policy',
        restrictions: 'Any UTF-8 character in the display name.',
        resource: 'google_monitoring_alert_policy',
        entity: 'alertPolicies',
        scope: 'project',
        icon: '',
        terraformCode: `resource "google_monitoring_alert_policy" "main" {
  display_name = "alert-main"
  combiner     = "OR"

  conditions {
    display_name = "CPU above 80%"

    condition_threshold {
      filter          = "metric.type=\\"compute.googleapis.com/instance/cpu/utilization\\""
      comparison      = "COMPARISON_GT"
      threshold_value = 0.8
      duration        = "300s"
    }
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/stackdriver/pricing',
        portalUrl: 'https://console.cloud.google.com/monitoring',
      },
    ],
  },
];
