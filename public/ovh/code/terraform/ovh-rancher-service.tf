resource "ovh_cloud_project_rancher" "rancher" {
  project_id = "<public cloud project ID>"
  target_spec = {
    name = "rancher-${local.naming_suffix}"
    plan = "STANDARD"
  }
}