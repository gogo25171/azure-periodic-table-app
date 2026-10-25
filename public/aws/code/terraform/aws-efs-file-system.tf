resource "aws_efs_file_system" "main" {
  creation_token = "my-product"

  tags = var.tags
}