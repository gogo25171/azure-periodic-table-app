resource "aws_sagemaker_endpoint" "main" {
  name                 = "smep-${local.naming_suffix}"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.main.name
}