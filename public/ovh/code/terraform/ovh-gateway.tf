resource "ovh_cloud_project_gateway" "gateway" {
  service_name = ovh_cloud_project_network_private.mypriv.service_name
  name         = "gw-${local.naming_suffix}"
  model        = "s"
  region       = ovh_cloud_project_network_private_subnet.myprivsub.region
  network_id   = tolist(ovh_cloud_project_network_private.mypriv.regions_attributes[*].openstackid)[0]
  subnet_id    = ovh_cloud_project_network_private_subnet.myprivsub.id
}