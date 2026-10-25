resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "ddb-${local.naming_suffix}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "UserId"
  range_key      = "GameTitle"

  attribute {
    name = "ddb-${local.naming_suffix}"
    type = "S"
  }

  attribute {
    name = "ddb-${local.naming_suffix}"
    type = "S"
  }

  attribute {
    name = "ddb-${local.naming_suffix}"
    type = "N"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = true
  }

  global_secondary_index {
    name               = "ddb-${local.naming_suffix}"
    hash_key           = "GameTitle"
    range_key          = "TopScore"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["UserId"]
  }

  tags = var.tags
}