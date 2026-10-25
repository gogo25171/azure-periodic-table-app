resource "aws_rekognition_collection" "main" {
  collection_id = "my-collection"

  tags = var.tags
}