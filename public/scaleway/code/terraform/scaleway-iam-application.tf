resource "scaleway_iam_application" "main" {
  name        = "app-${local.naming_suffix}"
  description = "a description"
}