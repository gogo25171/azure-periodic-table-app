resource "google_alloydb_cluster" "default" {
  cluster_id = "alloydb-cluster"
  location   = var.location
  network_config {
    network = google_compute_network.default.id
  }

  deletion_protection = false
}