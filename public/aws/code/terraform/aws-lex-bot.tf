resource "aws_lexv2models_bot" "main" {
  name        = "bot-${local.naming_suffix}"
  description = "Example description"
  data_privacy {
    child_directed = false
  }
  idle_session_ttl_in_seconds = 60
  role_arn                    = aws_iam_role.main.arn
  type                        = "Bot"

  tags = var.tags
}