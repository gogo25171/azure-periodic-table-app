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
        id: 'compute-engine',
        name: 'Compute Engine',
        slug: 'gce-',
        description: 'Secure and customizable compute service that lets you create and run virtual machines on Google\'s infrastructure.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/compute/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance',
        restrictions: 'Lowercase letters, numbers, and hyphens. Must start with a letter.',
        resource: 'google_compute_instance',
        icon: '/google/icons/Compute/Compute_Engine.svg',
        terraformCode: `resource "google_compute_instance" "default" {
  name         = "test-instance"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
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
        id: 'cloud-run',
        name: 'Cloud Run',
        slug: 'cr-',
        description: 'Fully managed compute platform that automatically scales your stateless containers.',
        length: '1-49',
        category: Categories.CONTAINERS,
        learnUrl: 'https://cloud.google.com/run/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_service',
        restrictions: 'Lowercase letters, numbers, and hyphens. Cannot end with a hyphen.',
        resource: 'google_cloud_run_service',
        icon: '/google/icons/Compute/Cloud_Run.svg',
        terraformCode: `resource "google_cloud_run_service" "default" {
  name     = "my-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello"
      }
    }
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/run/pricing',
        portalUrl: 'https://console.cloud.google.com/run',
      },
      {
        id: 'gke',
        name: 'Google Kubernetes Engine',
        slug: 'gke-',
        description: 'Managed, production-ready environment for running containerized applications using Kubernetes.',
        length: '1-40',
        category: Categories.CONTAINERS,
        learnUrl: 'https://cloud.google.com/kubernetes-engine/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster',
        restrictions: 'Lowercase letters, numbers, and hyphens. Must start with a letter.',
        resource: 'google_container_cluster',
        icon: '/google/icons/Containers/Kubernetes_Engine.svg',
        terraformCode: `resource "google_container_cluster" "primary" {
  name     = "my-gke-cluster"
  location = "us-central1"

  remove_default_node_pool = true
  initial_node_count       = 1
}`,
        pricingReferenceUrl: 'https://cloud.google.com/kubernetes-engine/pricing',
        portalUrl: 'https://console.cloud.google.com/kubernetes',
      },
    ],
  },
  {
    items: [
      {
        id: 'cloud-storage',
        name: 'Cloud Storage',
        slug: 'gcs-',
        description: 'Object storage for companies of all sizes. Store any amount of data and retrieve it as often as you like.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://cloud.google.com/storage/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket',
        restrictions: 'Lowercase letters, numbers, hyphens, underscores, and dots.',
        resource: 'google_storage_bucket',
        icon: '/google/icons/Storage/Cloud_Storage.svg',
        terraformCode: `resource "google_storage_bucket" "bucket" {
  name          = "my-unique-bucket-name"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true
}`,
        pricingReferenceUrl: 'https://cloud.google.com/storage/pricing',
        portalUrl: 'https://console.cloud.google.com/storage',
      },
      {
        id: 'cloud-sql',
        name: 'Cloud SQL',
        slug: 'csql-',
        description: 'Fully managed relational database service for MySQL, PostgreSQL, and SQL Server.',
        length: '1-98',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/sql/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'google_sql_database_instance',
        icon: '/google/icons/Databases/Cloud_SQL.svg',
        terraformCode: `resource "google_sql_database_instance" "master" {
  name             = "master-instance"
  database_version = "POSTGRES_14"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/sql/pricing',
        portalUrl: 'https://console.cloud.google.com/sql',
      },
      {
        id: 'firestore',
        name: 'Firestore',
        slug: 'fs-',
        description: 'Flexible, scalable NoSQL cloud database to store and sync data for client- and server-side development.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://cloud.google.com/firestore/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firestore_database',
        restrictions: 'Letters, numbers, and hyphens.',
        resource: 'google_firestore_database',
        icon: '/google/icons/Databases/Firestore.svg',
        terraformCode: `resource "google_firestore_database" "database" {
  project     = "my-project-id"
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/firestore/pricing',
        portalUrl: 'https://console.cloud.google.com/firestore',
      },
    ],
  },
  {
    items: [
      {
        id: 'vpc',
        name: 'Virtual Private Cloud',
        slug: 'vpc-',
        description: 'Global, secure, and scalable virtual network for your Google Cloud resources.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/vpc/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_network',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'google_compute_network',
        icon: '/google/icons/Networking/Virtual_Private_Cloud.svg',
        terraformCode: `resource "google_compute_network" "vpc_network" {
  name                    = "my-custom-mode-network"
  auto_create_subnetworks = false
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing',
        portalUrl: 'https://console.cloud.google.com/networking',
      },
      {
        id: 'bigquery',
        name: 'BigQuery',
        slug: 'bq-',
        description: 'Serverless, highly scalable, and cost-effective multicloud data warehouse designed for business agility.',
        length: '1-1024',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://cloud.google.com/bigquery/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/bigquery_dataset',
        restrictions: 'Letters, numbers, and underscores.',
        resource: 'google_bigquery_dataset',
        icon: '/google/icons/Analytics/BigQuery.svg',
        terraformCode: `resource "google_bigquery_dataset" "dataset" {
  dataset_id                  = "my_dataset"
  friendly_name               = "test"
  description                 = "This is a test description"
  location                    = "US"
  default_table_expiration_ms = 3600000
}`,
        pricingReferenceUrl: 'https://cloud.google.com/bigquery/pricing',
        portalUrl: 'https://console.cloud.google.com/bigquery',
      },
      {
        id: 'cloud-functions',
        name: 'Cloud Functions',
        slug: 'func-',
        description: 'Scalable pay-as-you-go functions as a service (FaaS) to run your code with zero server management.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://cloud.google.com/functions/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudfunctions2_function',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'google_cloudfunctions2_function',
        icon: '/google/icons/Compute/Cloud_Functions.svg',
        terraformCode: `resource "google_cloudfunctions2_function" "default" {
  name        = "my-function"
  location    = "us-central1"
  description = "A simple Cloud Function"

  build_config {
    runtime     = "nodejs16"
    entry_point = "helloHttp" 
    source {
      storage_source {
        bucket = google_storage_bucket.bucket.name
        object = google_storage_bucket_object.object.name
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
  }
}`,
        pricingReferenceUrl: 'https://cloud.google.com/functions/pricing',
        portalUrl: 'https://console.cloud.google.com/functions',
      },
    ],
  },
  {
    items: [
      {
        id: 'iam',
        name: 'Identity and Access Management',
        slug: 'iam-',
        description: 'Fine-grained access control and visibility for centrally managing cloud resources.',
        length: 'N/A',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://cloud.google.com/iam/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_project_iam',
        restrictions: 'N/A',
        resource: 'google_project_iam_member',
        icon: '/google/icons/Management/IAM.svg',
        terraformCode: `resource "google_project_iam_member" "project" {
  project = "your-project-id"
  role    = "roles/editor"
  member  = "user:jane@example.com"
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.cloud.google.com/iam-admin',
      },
      {
        id: 'cloud-load-balancing',
        name: 'Cloud Load Balancing',
        slug: 'clb-',
        description: 'Scale your applications on Compute Engine from zero to full-throttle with no pre-warming needed.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://cloud.google.com/load-balancing/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_forwarding_rule',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'google_compute_forwarding_rule',
        icon: '/google/icons/Networking/Cloud_Load_Balancing.svg',
        terraformCode: `resource "google_compute_forwarding_rule" "default" {
  name       = "my-forwarding-rule"
  target     = google_compute_target_pool.default.id
  port_range = "80"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/vpc/network-pricing#lb',
        portalUrl: 'https://console.cloud.google.com/net-services/loadbalancing',
      },
      {
        id: 'pubsub',
        name: 'Pub/Sub',
        slug: 'ps-',
        description: 'Asynchronous messaging service that decouples services that produce events from services that process events.',
        length: '3-255',
        category: Categories.INTEGRATION,
        learnUrl: 'https://cloud.google.com/pubsub/docs',
        terraformUrl: 'https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/pubsub_topic',
        restrictions: 'Letters, numbers, hyphens, underscores, tildes, pluses, and percent signs.',
        resource: 'google_pubsub_topic',
        icon: '/google/icons/Integration/PubSub.svg',
        terraformCode: `resource "google_pubsub_topic" "example" {
  name = "example-topic"
}`,
        pricingReferenceUrl: 'https://cloud.google.com/pubsub/pricing',
        portalUrl: 'https://console.cloud.google.com/cloudpubsub',
      },
    ]
  }
];
