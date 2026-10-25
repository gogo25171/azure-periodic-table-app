resource "scaleway_apple_silicon_server" "server" {
  name = "mac-${local.naming_suffix}"
  type = "M1-M"
}