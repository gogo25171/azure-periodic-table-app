resource "aws_ssm_parameter" "foo" {
  name  = "ssm-${local.naming_suffix}"
  type  = "String"
  value = "bar"
}