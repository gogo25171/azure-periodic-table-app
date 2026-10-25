resource "aws_ecs_cluster" "foo" {
  name = "ecs-${local.naming_suffix}"

  setting {
    name  = "ecs-${local.naming_suffix}"
    value = "enabled"
  }
}