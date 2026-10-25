resource "scaleway_vpc_private_network" "pn_priv" {
  name = "pn-${local.naming_suffix}"
  tags = ["demo", "terraform"]
}