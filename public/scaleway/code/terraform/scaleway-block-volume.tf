resource "scaleway_block_volume" "block_volume" {
  iops       = 5000
  name       = "vol-${local.naming_suffix}"
  size_in_gb = 20
}