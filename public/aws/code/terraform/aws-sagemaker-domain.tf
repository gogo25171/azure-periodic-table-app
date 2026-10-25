resource "aws_sagemaker_domain" "main" {
  domain_name = "main"
  auth_mode   = "IAM"
  vpc_id      = aws_vpc.main.id
  subnet_ids  = [aws_subnet.main.id]

  default_user_settings {
    execution_role = aws_iam_role.main.arn
  }
}