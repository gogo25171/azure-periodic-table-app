resource "google_dns_managed_zone" "example-zone" {
  name        = "dns-${local.naming_suffix}"
  dns_name    = "example-${random_id.rnd.hex}.com."
  description = "Example DNS zone"
  labels = {
    foo = "bar"
  }
}