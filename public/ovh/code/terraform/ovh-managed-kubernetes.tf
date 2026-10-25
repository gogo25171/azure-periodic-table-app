resource "ovh_cloud_project_kube" "my_cluster" {
  service_name = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  name         = "k8s-${local.naming_suffix}"
  region       = "GRA11"
}