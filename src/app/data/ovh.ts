/* src/app/data/ovh.ts */

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
        id: 'ovh-public-cloud-instance',
        name: 'Public Cloud Instance',
        slug: 'instance-',
        description:
          'On-demand, scalable compute resources with guaranteed performance and hourly or monthly billing.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-compute',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_instance',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_instance',
        entity: 'instances',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_instance" "main" {
  service_name = var.service_name
  region       = "GRA11"
  billing_period = "hourly"

  boot_from {
    image_id = var.image_id
  }

  flavor {
    flavor_id = var.flavor_id
  }

  name = "instance-main"

  network {
    public = true
  }
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-dedicated-server',
        name: 'Dedicated Server',
        slug: 'ded-',
        description:
          'Bare metal server rented from OVHcloud, managed through the API for OS reinstallation and monitoring.',
        length: '1-63',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://help.ovhcloud.com/csm/en-dedicated-servers',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/dedicated_server_update',
        restrictions:
          'The server is identified by its OVHcloud service name (for example ns1234567.ip-1-2-3.eu).',
        resource: 'ovh_dedicated_server_update',
        entity: 'dedicatedServers',
        scope: 'account',
        icon: '',
        terraformCode: `resource "ovh_dedicated_server_update" "main" {
  service_name = "nsxxxxxxx.ip-1-2-3.eu"
  boot_id      = data.ovh_dedicated_server_boots.harddisk.result[0]
  monitoring   = true
  state        = "ok"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/bare-metal/',
        portalUrl: 'https://www.ovh.com/manager/dedicated/',
      },
      {
        id: 'ovh-ssh-key',
        name: 'SSH Key',
        slug: 'ssh-',
        description:
          'Public key registered on a Public Cloud project and injected into new instances at build time.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl:
          'https://help.ovhcloud.com/csm/en-public-cloud-compute-create-ssh-keys',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_ssh_key',
        restrictions: 'Alphanumerics, hyphens and underscores.',
        resource: 'ovh_cloud_project_ssh_key',
        entity: 'sshKeys',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_ssh_key" "main" {
  service_name = var.service_name
  name         = "ssh-main"
  public_key   = file("~/.ssh/id_ed25519.pub")
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-block-volume',
        name: 'Block Storage Volume',
        slug: 'vol-',
        description:
          'Persistent block storage attached to a Public Cloud instance, with snapshots and live resizing.',
        length: '1-63',
        category: Categories.STORAGE,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-storage-block-storage',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_volume',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_volume',
        entity: 'volumes',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_volume" "main" {
  service_name = var.service_name
  region_name  = "GRA11"
  description  = "vol-main"
  name         = "vol-main"
  size         = 50
  type         = "classic"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-rancher-service',
        name: 'Managed Rancher',
        slug: 'rancher-',
        description:
          'Managed Rancher control plane used to operate several Kubernetes clusters from a single console.',
        length: '1-63',
        category: Categories.DEVTOOLS,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-rancher',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_rancher',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_rancher',
        entity: 'rancher',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_rancher" "main" {
  project_id = var.service_name

  target_spec {
    name = "rancher-main"
    plan = "STANDARD"
  }
}`,
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
        description:
          'Managed Kubernetes clusters to orchestrate containerised applications without operating a control plane.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_kube',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_kube',
        entity: 'kube',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_kube" "main" {
  service_name = var.service_name
  name         = "k8s-main"
  region       = "GRA11"
  version      = "1.31"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-kube-node-pool',
        name: 'Kubernetes Node Pool',
        slug: 'k8snp-',
        description:
          'Group of worker nodes attached to a managed Kubernetes cluster, with autoscaling boundaries.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl:
          'https://help.ovhcloud.com/csm/en-public-cloud-kubernetes-managing-nodepools',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_kube_nodepool',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_kube_nodepool',
        entity: 'nodePools',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_kube_nodepool" "main" {
  service_name  = var.service_name
  kube_id       = ovh_cloud_project_kube.main.id
  name          = "k8snp-main"
  flavor_name   = "b3-8"
  desired_nodes = 3
  max_nodes     = 5
  min_nodes     = 1
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-container-registry',
        name: 'Managed Private Registry',
        slug: 'reg-',
        description:
          'Harbor based private container registry with vulnerability scanning and replication.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-managed-private-registry',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_containerregistry',
        restrictions: 'Lowercase letters, numbers and hyphens.',
        resource: 'ovh_cloud_project_containerregistry',
        entity: 'containerRegistries',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_containerregistry" "main" {
  service_name = var.service_name
  plan_id      = data.ovh_cloud_project_capabilities_containerregistry_filter.main.id
  region       = "GRA"
  name         = "reg-main"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-object-storage',
        name: 'Object Storage Bucket',
        slug: 's3-',
        description:
          'S3 compatible object storage for unstructured data, with standard and high performance classes.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_storage',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must be unique inside the region.',
        resource: 'ovh_cloud_project_storage',
        entity: 'storages',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_storage" "main" {
  service_name = var.service_name
  region_name  = "GRA"
  name         = "s3-main"

  versioning = {
    status = "enabled"
  }
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-s3-credential',
        name: 'S3 Credential',
        slug: 's3cred-',
        description:
          'Access key and secret key issued to a Public Cloud user so applications can reach object storage.',
        length: 'N/A',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-credentials',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_user_s3_credential',
        restrictions: 'Credentials are generated by the API and cannot be named.',
        resource: 'ovh_cloud_project_user_s3_credential',
        entity: 's3Credentials',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_user" "main" {
  service_name = var.service_name
  description  = "s3cred-main"
}

resource "ovh_cloud_project_user_s3_credential" "main" {
  service_name = var.service_name
  user_id      = ovh_cloud_project_user.main.id
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
    ],
  },
  {
    items: [
      {
        id: 'ovh-managed-database',
        name: 'Managed Database',
        slug: 'db-',
        description:
          'Fully managed PostgreSQL, MySQL, MongoDB, Redis, Kafka and OpenSearch clusters with automated backups.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-databases',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_database',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_database',
        entity: 'databases',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_database" "main" {
  service_name = var.service_name
  description  = "db-main"
  engine       = "postgresql"
  version      = "16"
  plan         = "essential"
  flavor       = "db1-4"

  nodes {
    region = "GRA"
  }
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-private-network',
        name: 'Private Network (vRack)',
        slug: 'vnet-',
        description:
          'Layer 2 private network isolating Public Cloud instances inside a vRack, across regions.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-network-private-network',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_network_private',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_network_private',
        entity: 'privateNetworks',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_network_private" "main" {
  service_name = var.service_name
  name         = "vnet-main"
  regions      = ["GRA11"]
  vlan_id      = 42
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-private-subnet',
        name: 'Private Subnet',
        slug: 'snet-',
        description:
          'IP range carved out of a private network, with optional DHCP and default gateway.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-network-private-network',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_network_private_subnet',
        restrictions: 'Subnets are identified by their CIDR range.',
        resource: 'ovh_cloud_project_network_private_subnet',
        entity: 'subnets',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_network_private_subnet" "main" {
  service_name = var.service_name
  network_id   = ovh_cloud_project_network_private.main.id
  region       = "GRA11"
  start        = "192.168.42.100"
  end          = "192.168.42.200"
  network      = "192.168.42.0/24"
  dhcp         = true
  no_gateway   = false
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-gateway',
        name: 'Public Cloud Gateway',
        slug: 'gw-',
        description:
          'Managed gateway giving instances on a private subnet outbound internet access and SNAT.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-network-gateway',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_gateway',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_gateway',
        entity: 'gateways',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_gateway" "main" {
  service_name = var.service_name
  name         = "gw-main"
  model        = "s"
  region       = "GRA11"
  network_id   = ovh_cloud_project_network_private.main.regions_attributes[0].openstackid
  subnet_id    = ovh_cloud_project_network_private_subnet.main.id
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-vrack-attachment',
        name: 'vRack Attachment',
        slug: 'vrack-',
        description:
          'Attaches a Public Cloud project to a vRack so that dedicated servers and instances share a private network.',
        length: 'N/A',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-vrack',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/vrack_cloudproject',
        restrictions: 'The attachment is identified by the vRack and project ids.',
        resource: 'ovh_vrack_cloudproject',
        entity: 'vrackAttachments',
        scope: 'account',
        icon: '',
        terraformCode: `resource "ovh_vrack_cloudproject" "main" {
  service_name = var.vrack_id
  project_id   = var.service_name
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://www.ovh.com/manager/dedicated/#/vrack',
      },
    ],
  },
  {
    items: [
      {
        id: 'ovh-load-balancer',
        name: 'IP Load Balancing',
        slug: 'lb-',
        description:
          'Distributes traffic across several backends to keep applications available, with TLS termination.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-load-balancer',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/iploadbalancing',
        restrictions: 'Alphanumerics and hyphens in the display name.',
        resource: 'ovh_iploadbalancing',
        entity: 'ipLoadbalancing',
        scope: 'account',
        icon: '',
        terraformCode: `resource "ovh_iploadbalancing" "main" {
  display_name   = "lb-main"
  ovh_subsidiary = "FR"

  plan {
    duration     = "P1M"
    plan_code    = "iplb-lb1"
    pricing_mode = "default"
  }
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/network/load-balancer/',
        portalUrl: 'https://www.ovh.com/manager/dedicated/#/iplb',
      },
      {
        id: 'ovh-load-balancer-frontend',
        name: 'Load Balancer HTTP Frontend',
        slug: 'lbfe-',
        description:
          'HTTP listener of an IP Load Balancing service, bound to a farm of backend servers.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-load-balancer',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/iploadbalancing_http_frontend',
        restrictions: 'Alphanumerics and hyphens in the display name.',
        resource: 'ovh_iploadbalancing_http_frontend',
        entity: 'httpFrontends',
        scope: 'account',
        icon: '',
        terraformCode: `resource "ovh_iploadbalancing_http_frontend" "main" {
  service_name    = ovh_iploadbalancing.main.service_name
  display_name    = "lbfe-main"
  zone            = "all"
  port            = "443"
  default_farm_id = ovh_iploadbalancing_http_farm.main.id
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/network/load-balancer/',
        portalUrl: 'https://www.ovh.com/manager/dedicated/#/iplb',
      },
      {
        id: 'ovh-dns-record',
        name: 'DNS Record',
        slug: 'dns-',
        description:
          'Record inside an OVHcloud DNS zone, used to publish A, AAAA, CNAME, MX or TXT entries.',
        length: '1-63',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-dns',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/domain_zone_record',
        restrictions: 'Must be a valid DNS subdomain label.',
        resource: 'ovh_domain_zone_record',
        entity: 'zoneRecords',
        scope: 'account',
        icon: '',
        terraformCode: `resource "ovh_domain_zone_record" "main" {
  zone      = "example.com"
  subdomain = "app"
  fieldtype = "A"
  ttl       = 3600
  target    = "203.0.113.10"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/domains/',
        portalUrl: 'https://www.ovh.com/manager/web/#/domain',
      },
      {
        id: 'ovh-failover-ip',
        name: 'Additional IP',
        slug: 'ipfo-',
        description:
          'Failover IP address moved between instances or dedicated servers to keep a service reachable.',
        length: 'N/A',
        category: Categories.NETWORKING,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-network-additional-ip',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_failover_ip_attach',
        restrictions: 'The resource is identified by the IP address itself.',
        resource: 'ovh_cloud_project_failover_ip_attach',
        entity: 'failoverIps',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_failover_ip_attach" "main" {
  service_name = var.service_name
  ip           = "203.0.113.10"
  routed_to    = ovh_cloud_project_instance.main.id
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
      {
        id: 'ovh-workflow-backup',
        name: 'Instance Backup Workflow',
        slug: 'bkp-',
        description:
          'Scheduled workflow that snapshots a Public Cloud instance and keeps a rolling number of backups.',
        length: '1-63',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://help.ovhcloud.com/csm/en-public-cloud-compute-backup',
        terraformUrl:
          'https://registry.terraform.io/providers/ovh/ovh/latest/docs/resources/cloud_project_workflow_backup',
        restrictions: 'Alphanumerics and hyphens.',
        resource: 'ovh_cloud_project_workflow_backup',
        entity: 'workflowBackups',
        scope: 'project',
        icon: '',
        terraformCode: `resource "ovh_cloud_project_workflow_backup" "main" {
  service_name   = var.service_name
  region         = "GRA11"
  cron           = "0 2 * * *"
  instance_id    = ovh_cloud_project_instance.main.id
  max_execution_count = 7
  name           = "bkp-main"
}`,
        pricingReferenceUrl: 'https://www.ovhcloud.com/en/public-cloud/prices/',
        portalUrl: 'https://www.ovh.com/manager/public-cloud/',
      },
    ],
  },
];
