resource "aws_route53_zone" "primary" {
  name = "r53-${local.naming_suffix}"
}