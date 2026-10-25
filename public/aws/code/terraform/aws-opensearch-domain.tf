resource "aws_opensearch_domain" "main" {
  domain_name    = "main"
  engine_version = "Elasticsearch_7.10"

  cluster_config {
    instance_type = "r4.large.search"
  }

  tags = var.tags
}