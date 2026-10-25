resource "aws_imagebuilder_image_recipe" "main" {
  block_device_mapping {
    device_name = "/dev/xvdb"

    ebs {
      delete_on_termination = true
      volume_size           = 100
      volume_type           = "gp2"
    }
  }

  component {
    component_arn = aws_imagebuilder_component.main.arn

    parameter {
      name  = "recipe-${local.naming_suffix}"
      value = "Value1"
    }

    parameter {
      name  = "recipe-${local.naming_suffix}"
      value = "Value2"
    }
  }

  name         = "recipe-${local.naming_suffix}"
  parent_image = "arn:${data.aws_partition.current.partition}:imagebuilder:${data.aws_region.current.region}:aws:image/amazon-linux-2-x86/x.x.x"
  version      = "1.0.0"
}