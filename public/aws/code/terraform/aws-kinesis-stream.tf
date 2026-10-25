resource "aws_kinesis_stream" "test_stream" {
  name             = "kds-${local.naming_suffix}"
  retention_period = 48

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]

  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }

  tags = var.tags
}