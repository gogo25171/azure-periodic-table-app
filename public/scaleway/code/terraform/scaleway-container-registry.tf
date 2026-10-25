resource "scaleway_registry_namespace" "main" {
  name        = "cr-${local.naming_suffix}"
  description = "Main container registry"
  is_public   = false
}