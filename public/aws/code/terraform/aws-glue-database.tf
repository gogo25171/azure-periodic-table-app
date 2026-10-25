resource "aws_glue_catalog_database" "main" {
  name = "glue-${local.naming_suffix}"
}