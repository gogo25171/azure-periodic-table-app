resource "aws_security_group" "allow_tls" {
  name        = "sg-${local.naming_suffix}"
  description = "Allow TLS inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.main.id

  tags = var.tags
}