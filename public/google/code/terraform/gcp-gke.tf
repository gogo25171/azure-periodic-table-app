resource "google_container_cluster" "primary" {
  name     = "gke-${local.naming_suffix}"
  location = var.location

  # Required prior to GKE 1.36.4-gke.1469000 to use separately managed node pools
  # remove_default_node_pool = true
  # initial_node_count       = 1
}