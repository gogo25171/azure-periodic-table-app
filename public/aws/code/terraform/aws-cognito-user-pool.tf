resource "aws_cognito_user_pool" "pool" {
  name = "cup-${local.naming_suffix}"
}