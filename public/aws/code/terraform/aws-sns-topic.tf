resource "aws_sns_topic" "user_updates" {
  name = "sns-${local.naming_suffix}"
}