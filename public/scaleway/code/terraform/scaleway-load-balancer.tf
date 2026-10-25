resource "scaleway_lb" "base" {
  ip_ids = [scaleway_lb_ip.main.id]
  zone   = scaleway_lb_ip.main.zone
  type   = "LB-S"
}