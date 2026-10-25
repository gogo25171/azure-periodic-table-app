data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "ec2-${local.naming_suffix}"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "ec2-${local.naming_suffix}"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "main" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  tags = var.tags
}