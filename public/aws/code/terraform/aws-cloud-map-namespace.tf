resource "aws_service_discovery_http_namespace" "main" {
  name        = "ns-${local.naming_suffix}"
  description = "main"
}