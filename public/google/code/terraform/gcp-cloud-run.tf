resource "google_cloud_run_v2_service" "default" {
  name                = "cr-${local.naming_suffix}"
  location            = var.location
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  scaling {
    max_instance_count = 100
  }

  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
    }
  }
}