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
        description: 'Scaleway Instances are highly available, scalable Virtual Machines with guaranteed performance.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://www.scaleway.com/en/docs/compute/instances/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/instance_server',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'Scaleway.InstanceServer',
        entity: 'instances',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_instance_server" "web" {
  type  = "DEV1-S"
  image = "ubuntu_focal"
  name  = "my-instance"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/instance/servers',
      },
      {
        id: 'scaleway-object-storage',
        name: 'Object Storage',
        slug: 's3-',
        description: 'S3-compatible Object Storage for storing any kind of data safely and reliably.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://www.scaleway.com/en/docs/storage/object/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/object_bucket',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'Scaleway.ObjectBucket',
        entity: 'storage',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_object_bucket" "bucket" {
  name = "my-unique-bucket-name"
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
        id: 'scaleway-kubernetes-kapsule',
        name: 'Kubernetes Kapsule',
        slug: 'k8s-',
        description: 'Managed Kubernetes environment to deploy and scale your applications securely.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/compute/kubernetes/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/k8s_cluster',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'Scaleway.K8sCluster',
        entity: 'kubernetes',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_k8s_cluster" "cluster" {
  name    = "my-kapsule-cluster"
  version = "1.28.0"
  cni     = "cilium"
}

resource "scaleway_k8s_pool" "pool" {
  cluster_id = scaleway_k8s_cluster.cluster.id
  name       = "my-pool"
  node_type  = "DEV1-M"
  size       = 3
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/k8s/clusters',
      },
      {
        id: 'scaleway-managed-database',
        name: 'Managed Database',
        slug: 'rdb-',
        description: 'Managed Relational Databases (PostgreSQL, MySQL) for high availability and automated backups.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://www.scaleway.com/en/docs/storage/database/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/rdb_instance',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'Scaleway.RdbInstance',
        entity: 'databases',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_rdb_instance" "db" {
  name           = "my-database"
  node_type      = "db-dev-s"
  engine         = "PostgreSQL-15"
  is_ha_cluster  = true
  disable_backup = false
  user_name      = "admin"
  password       = "super-secure-password"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/rdb/instances',
      },
    ]
  },
  {
    items: [
      {
        id: 'scaleway-load-balancer',
        name: 'Load Balancer',
        slug: 'lb-',
        description: 'Highly available Load Balancers to distribute traffic and scale your applications.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://www.scaleway.com/en/docs/network/load-balancer/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/lb',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'Scaleway.Lb',
        entity: 'loadbalancers',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_lb" "lb" {
  name = "my-lb"
  type = "LB-S"
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/load-balancer/lbs',
      },
      {
        id: 'scaleway-container-registry',
        name: 'Container Registry',
        slug: 'cr-',
        description: 'Scaleway Container Registry for storing and managing your container images securely.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://www.scaleway.com/en/docs/compute/container-registry/',
        terraformUrl: 'https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/registry_namespace',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'Scaleway.RegistryNamespace',
        entity: 'registry',
        scope: 'project',
        icon: '',
        terraformCode: `resource "scaleway_registry_namespace" "main" {
  name        = "my-registry-namespace"
  description = "Main registry for my application images"
  is_public   = false
}`,
        pricingReferenceUrl: 'https://www.scaleway.com/en/pricing/',
        portalUrl: 'https://console.scaleway.com/registry/namespaces',
      },
    ]
  }
];
