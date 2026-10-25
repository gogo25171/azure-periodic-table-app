resource "aws_cloudwatch_event_bus" "messenger" {
  name = "eb-bus-${local.naming_suffix}"
}