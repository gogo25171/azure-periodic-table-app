resource "ovh_cloud_project_network_private" "net" {
  service_name = "XXXXXX"
  name         = "vnet-${local.naming_suffix}"
  regions      = ["GRA11", "BHS5"]
}