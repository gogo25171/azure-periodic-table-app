resource "google_workstations_workstation_cluster" "default" {
  workstation_cluster_id = "workstation-cluster"
  network                = google_compute_network.default.id
  subnetwork             = google_compute_subnetwork.default.id
  location               = var.location

  labels = {
    "label" = "key"
  }

  annotations = {
    label-one = "value-one"
  }
}