resource "aws_iot_thing" "main" {
  name = "iot-${local.naming_suffix}"

  attributes = {
    First = "examplevalue"
  }
}