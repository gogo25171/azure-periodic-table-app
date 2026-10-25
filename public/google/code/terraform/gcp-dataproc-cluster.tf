resource "google_dataproc_cluster" "simplecluster" {
  name   = "dp-${local.naming_suffix}"
  region = "us-central1"
}