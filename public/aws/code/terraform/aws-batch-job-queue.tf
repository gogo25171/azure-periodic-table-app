resource "aws_batch_job_queue" "test_queue" {
  name     = "batch-${local.naming_suffix}"
  state    = "ENABLED"
  priority = 1

  compute_environment_order {
    order               = 1
    compute_environment = aws_batch_compute_environment.test_environment_1.arn
  }

  compute_environment_order {
    order               = 2
    compute_environment = aws_batch_compute_environment.test_environment_2.arn
  }
}