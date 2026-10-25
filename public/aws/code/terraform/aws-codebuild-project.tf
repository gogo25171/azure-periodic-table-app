resource "aws_codebuild_project" "main" {
  name          = "cb-${local.naming_suffix}"
  description   = "test_codebuild_project"
  build_timeout = 5
  service_role  = aws_iam_role.main.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "S3"
    location = aws_s3_bucket.main.bucket
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux-x86_64-standard:6.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    host_kernel                 = "LINUX_KERNEL_6"

    environment_variable {
      name  = "cb-${local.naming_suffix}"
      value = "SOME_VALUE1"
    }

    environment_variable {
      name  = "cb-${local.naming_suffix}"
      value = "SOME_VALUE2"
      type  = "PARAMETER_STORE"
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = var.location
    }
  }

  source {
    type            = "GITHUB"
    location        = var.location
    git_clone_depth = 1

    git_submodules_config {
      fetch_submodules = true
    }
  }

  source_version = "master"

  vpc_config {
    vpc_id = aws_vpc.main.id

    subnets = [
      aws_subnet.main1.id,
      aws_subnet.main2.id,
    ]

    security_group_ids = [
      aws_security_group.main1.id,
      aws_security_group.main2.id,
    ]
  }

  tags = var.tags
}

resource "aws_codebuild_project" "project-with-cache" {
  name           = "cb-${local.naming_suffix}"
  description    = "test_codebuild_project_cache"
  build_timeout  = 5
  queued_timeout = 5

  service_role = aws_iam_role.main.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type  = "LOCAL"
    modes = ["LOCAL_DOCKER_LAYER_CACHE", "LOCAL_SOURCE_CACHE"]
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "cb-${local.naming_suffix}"
      value = "SOME_VALUE1"
    }
  }

  source {
    type            = "GITHUB"
    location        = var.location
    git_clone_depth = 1
  }

  tags = var.tags
}

resource "aws_codebuild_project" "project-using-github-app" {
  name         = "cb-${local.naming_suffix}"
  description  = "gets_source_from_github_via_the_github_app"
  service_role = aws_iam_role.main.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type     = "GITHUB"
    location = var.location
    auth {
      type     = "CODECONNECTIONS"
      resource = "arn:aws:codestar-connections:us-east-1:123456789012:connection/guid-string"
    }
  }
}