data "aws_partition" "current" {}
data "aws_region" "current" {}


resource "aws_serverlessapplicationrepository_cloudformation_stack" "postgres-rotator" {
  name           = "sar-${local.naming_suffix}"
  application_id = "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSPostgreSQLRotationSingleUser"
  capabilities = [
    "CAPABILITY_IAM",
    "CAPABILITY_RESOURCE_POLICY",
  ]
  parameters = {
    functionName = "func-postgres-rotator"
    endpoint     = "secretsmanager.${data.aws_region.current.region}.${data.aws_partition.current.dns_suffix}"
  }
}