resource "scaleway_object_bucket" "some_bucket" {
  name = "s3-${local.naming_suffix}"
  tags = var.tags
}