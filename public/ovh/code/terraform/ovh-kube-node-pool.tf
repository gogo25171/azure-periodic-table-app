resource "ovh_cloud_project_kube_nodepool" "node_pool" {
  service_name  = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  kube_id       = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  name          = "k8snp-${local.naming_suffix}" //Warning: "_" char is not allowed!
  flavor_name   = "b3-8"
  desired_nodes = 3
}