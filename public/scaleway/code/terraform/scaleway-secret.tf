resource "scaleway_secret" "main" {
  name        = "sec-${local.naming_suffix}"
  description = "barr"
  tags        = ["foo", "terraform"]
}