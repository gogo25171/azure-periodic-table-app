resource "google_compute_forwarding_rule" "google_compute_forwarding_rule" {
  name                  = "clb-${local.naming_suffix}"
  provider              = google-beta
  region                = "europe-west1"
  depends_on            = [google_compute_subnetwork.proxy_subnet]
  ip_protocol           = "TCP"
  load_balancing_scheme = "INTERNAL_MANAGED"
  port_range            = "80"
  target                = google_compute_region_target_http_proxy.default.id
  network               = google_compute_network.ilb_network.id
  subnetwork            = google_compute_subnetwork.ilb_subnet.id
  network_tier          = "PREMIUM"
}