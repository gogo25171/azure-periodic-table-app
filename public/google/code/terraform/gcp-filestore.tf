resource "google_filestore_instance" "instance" {
  name     = "fsi-${local.naming_suffix}"
  location = var.location
  tier     = "BASIC_HDD"

  file_shares {
    capacity_gb = 1024
    name        = "fsi-${local.naming_suffix}"
  }

  networks {
    network = "default"
    modes   = ["MODE_IPV4"]
  }
}