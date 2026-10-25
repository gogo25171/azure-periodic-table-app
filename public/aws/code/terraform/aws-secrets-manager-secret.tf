resource "aws_secretsmanager_secret" "main" {
  name = "sec-${local.naming_suffix}"
}