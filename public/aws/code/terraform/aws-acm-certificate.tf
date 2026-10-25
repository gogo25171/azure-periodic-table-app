resource "aws_acm_certificate" "cert" {
  domain_name       = "example.com"
  validation_method = "DNS"

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}