resource "aws_backup_vault" "main" {
  name        = "bkv-${local.naming_suffix}"
  kms_key_arn = aws_kms_key.main.arn
}