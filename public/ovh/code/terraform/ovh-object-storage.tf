resource "ovh_cloud_project_storage" "storage" {
  service_name = "<public cloud project ID>"
  region_name  = "GRA"
  name         = "s3-${local.naming_suffix}"
  versioning = {
    status = "enabled"
  }
}