resource "google_compute_network" "vpc_network" {
  name = "vpc-${local.naming_suffix}"
}