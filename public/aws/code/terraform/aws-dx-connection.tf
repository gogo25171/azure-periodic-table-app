resource "aws_dx_connection" "hoge" {
  name      = "dx-${local.naming_suffix}"
  bandwidth = "1Gbps"
  location  = var.location
}