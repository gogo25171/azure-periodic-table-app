resource "aws_cloudtrail" "main" {
  depends_on = [aws_s3_bucket_policy.main]

  name                          = "ct-${local.naming_suffix}"
  s3_bucket_name                = aws_s3_bucket.main.id
  s3_key_prefix                 = "prefix"
  include_global_service_events = false
}