resource "google_bigtable_instance" "production-instance" {
  name = "bt-${local.naming_suffix}"

  cluster {
    cluster_id   = "tf-instance-cluster"
    num_nodes    = 1
    storage_type = "HDD"
  }

  labels = {
    my-label = "prod-label"
  }
}