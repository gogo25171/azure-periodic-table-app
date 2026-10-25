resource "aws_cloudwatch_log_group" "yada" {
  name = "log-${local.naming_suffix}"

  tags = var.tags
}