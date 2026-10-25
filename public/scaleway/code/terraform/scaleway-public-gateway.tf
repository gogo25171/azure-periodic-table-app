resource "scaleway_vpc_public_gateway" "main" {
  name = "pgw-${local.naming_suffix}"
  type = "VPC-GW-S"
  tags = ["demo", "terraform"]
}