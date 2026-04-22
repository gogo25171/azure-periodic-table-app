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
        id: 'ovh-public-cloud-instance',
        name: 'Public Cloud Instance',
        slug: 'instance-',
        description: 'OVHcloud Public Cloud Instances provide on-demand, scalable compute resources with guaranteed performance.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.ovh.com/gb/en/public-cloud/',
        terraformUrl: 'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_instance',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'OVH.CloudProjectInstance',
        entity: 'instances',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_instance" "server" {
  name        = "my-instance"
  service_name = "your_project_id"
  image_name  = "Ubuntu 22.04"
  flavor_name = "b2-7"
  region      = "GRA11"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-object-storage',
        name: 'Object Storage',
        slug: 's3-',
        description: 'S3-compatible object storage service offered by OVHcloud for storing unstructured data safely.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.ovh.com/gb/en/storage/',
        terraformUrl: 'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_user_s3_credential',
        restrictions: 'Lowercase letters, numbers, and hyphens.',
        resource: 'OVH.CloudProjectS3',
        entity: 'storage',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_user_s3_credential" "s3_user" {
  service_name = "your_project_id"
  user_id      = ovh_cloud_project_user.user.id
}

# The bucket is typically managed by standard S3 providers using the credentials generated above.`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
    ],
  },
  {
    items: [
      {
        id: 'ovh-managed-kubernetes',
        name: 'Managed Kubernetes',
        slug: 'k8s-',
        description: 'Managed Kubernetes clusters to orchestrate containerized applications without worrying about control plane management.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://docs.ovh.com/gb/en/kubernetes/',
        terraformUrl: 'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_kube',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'OVH.CloudProjectKube',
        entity: 'kubernetes',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_kube" "k8s_cluster" {
  service_name = "your_project_id"
  name         = "my_k8s_cluster"
  region       = "GRA11"
  version      = "1.28"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-managed-database',
        name: 'Managed Database',
        slug: 'db-',
        description: 'Fully managed relational and NoSQL databases provided by OVHcloud.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://docs.ovh.com/gb/en/public-cloud/databases/',
        terraformUrl: 'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_database',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'OVH.CloudProjectDatabase',
        entity: 'databases',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_database" "db" {
  service_name = "your_project_id"
  engine       = "postgresql"
  version      = "15"
  plan         = "essential"
  nodes {
    region  = "GRA"
    network_id = "your_network_id"
    subnet_id  = "your_subnet_id"
  }
  flavor       = "db1-7"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
    ]
  },
  {
    items: [
      {
        id: 'ovh-load-balancer',
        name: 'Load Balancer',
        slug: 'lb-',
        description: 'Distributes traffic across multiple servers to ensure high availability and reliability.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.ovh.com/gb/en/load-balancer/',
        terraformUrl: 'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/ip_loadbalancing',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'OVH.IpLoadBalancing',
        entity: 'loadbalancing',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_ip_loadbalancing" "lb" {
  service_name = "loadbalancer-xxxxxxx"
  display_name = "my_load_balancer"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
    ]
  }
];
