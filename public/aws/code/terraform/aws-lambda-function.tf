data "archive_file" "main" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda/function.zip"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_lambda_function" "main" {
  filename      = data.archive_file.main.output_path
  function_name = "example_lambda_function"
  role          = aws_iam_role.main.arn
  handler       = "index.handler"
  code_sha256   = data.archive_file.main.output_base64sha256

  runtime = "nodejs24.x"

  environment {
    variables = {
      ENVIRONMENT = "production"
      LOG_LEVEL   = "info"
    }
  }

  tags = var.tags
}