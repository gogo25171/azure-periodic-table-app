/* src/app/data/aws.ts */

import { Categories } from '../constants';

export type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  length: string;
  category: Categories;
  learnUrl: string;
  terraformUrl: string;
  restrictions: string;
  icon: string;
  terraformCode: string;
  resource?: string;
  entity?: string;
  scope?: string;
  bicepCode?: string;
  armCode?: string;
  pricingReferenceUrl?: string;
  portalUrl?: string;
  dnsConfiguration?: {
    commercial?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
    government?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
    china?: {
      subresourceNames: string[];
      privateDnsZoneNames: string[];
      publicDnsForwarderNames: string[];
    };
  };
};

export type ColumnType = {
  items: Item[];
};

export const columns: ColumnType[] = [
  {
    items: [
      {
        id: 'aws-ec2-instance',
        name: 'EC2 Instance',
        slug: 'ec2-',
        description:
          'Resizable virtual servers in the cloud, with a wide choice of instance families, pricing models and operating systems.',
        length: '1-255',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/ec2/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance',
        restrictions:
          'The Name tag accepts any UTF-8 character; keep it to letters, numbers and hyphens for readability.',
        resource: 'aws_instance',
        entity: 'instances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_instance" "main" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"

  tags = {
    Name = "ec2-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/ec2/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ec2/',
      },
      {
        id: 'aws-lambda-function',
        name: 'Lambda Function',
        slug: 'lambda-',
        description:
          'Run code without provisioning servers: Lambda scales automatically and bills only for the compute time consumed.',
        length: '1-64',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/lambda/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_lambda_function',
        entity: 'functions',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_lambda_function" "main" {
  function_name = "lambda-main"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = "function.zip"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/lambda/pricing/',
        portalUrl: 'https://console.aws.amazon.com/lambda/',
      },
      {
        id: 'aws-auto-scaling-group',
        name: 'Auto Scaling Group',
        slug: 'asg-',
        description:
          'Keeps a fleet of EC2 instances at the desired capacity by launching and terminating instances automatically.',
        length: '1-255',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group',
        restrictions: 'Letters, numbers and the characters - _ . / @.',
        resource: 'aws_autoscaling_group',
        entity: 'autoScalingGroups',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_autoscaling_group" "main" {
  name                = "asg-main"
  min_size            = 1
  max_size            = 3
  desired_capacity    = 2
  vpc_zone_identifier = [aws_subnet.main.id]

  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/autoscaling/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ec2/#AutoScalingGroups',
      },
      {
        id: 'aws-elastic-beanstalk-application',
        name: 'Elastic Beanstalk Application',
        slug: 'eb-',
        description:
          'Deploys and scales web applications while managing the underlying capacity, load balancing and health monitoring.',
        length: '1-100',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/elasticbeanstalk/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elastic_beanstalk_application',
        restrictions: 'Any character except the forward slash.',
        resource: 'aws_elastic_beanstalk_application',
        entity: 'applications',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_elastic_beanstalk_application" "main" {
  name        = "eb-main"
  description = "Managed application platform"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/elasticbeanstalk/pricing/',
        portalUrl: 'https://console.aws.amazon.com/elasticbeanstalk/',
      },
      {
        id: 'aws-app-runner-service',
        name: 'App Runner Service',
        slug: 'apprunner-',
        description:
          'Fully managed service that builds and runs containerised web applications and APIs directly from a repository or image.',
        length: '4-40',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/apprunner/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apprunner_service',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_apprunner_service',
        entity: 'services',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_apprunner_service" "main" {
  service_name = "apprunner-main"

  source_configuration {
    image_repository {
      image_identifier      = "public.ecr.aws/aws-containers/hello-app-runner:latest"
      image_repository_type = "ECR_PUBLIC"
    }
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/apprunner/pricing/',
        portalUrl: 'https://console.aws.amazon.com/apprunner/',
      },
      {
        id: 'aws-batch-job-queue',
        name: 'Batch Job Queue',
        slug: 'batch-',
        description:
          'Queues and schedules batch computing jobs across EC2 or Fargate compute environments.',
        length: '1-128',
        category: Categories.COMPUTEANDWEB,
        learnUrl: 'https://docs.aws.amazon.com/batch/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/batch_job_queue',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_batch_job_queue',
        entity: 'jobQueues',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_batch_job_queue" "main" {
  name     = "batch-main"
  state    = "ENABLED"
  priority = 1

  compute_environment_order {
    order               = 0
    compute_environment = aws_batch_compute_environment.main.arn
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/batch/pricing/',
        portalUrl: 'https://console.aws.amazon.com/batch/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-ecs-cluster',
        name: 'ECS Cluster',
        slug: 'ecs-',
        description:
          'Logical grouping of container tasks and services running on EC2 capacity or on serverless Fargate.',
        length: '1-255',
        category: Categories.CONTAINERS,
        learnUrl: 'https://docs.aws.amazon.com/ecs/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_ecs_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ecs_cluster" "main" {
  name = "ecs-main"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/ecs/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ecs/',
      },
      {
        id: 'aws-ecs-service',
        name: 'ECS Service',
        slug: 'ecssvc-',
        description:
          'Maintains the desired number of running tasks of a task definition inside an ECS cluster.',
        length: '1-255',
        category: Categories.CONTAINERS,
        learnUrl:
          'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_ecs_service',
        entity: 'services',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ecs_service" "main" {
  name            = "ecssvc-main"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 2
  launch_type     = "FARGATE"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/fargate/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ecs/',
      },
      {
        id: 'aws-ecs-task-definition',
        name: 'ECS Task Definition',
        slug: 'ecstask-',
        description:
          'Blueprint describing the containers, CPU, memory and IAM roles used to run a task on ECS.',
        length: '1-255',
        category: Categories.CONTAINERS,
        learnUrl:
          'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_ecs_task_definition',
        entity: 'taskDefinitions',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ecs_task_definition" "main" {
  family                   = "ecstask-main"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "nginx:latest"
    }
  ])
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/fargate/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ecs/',
      },
      {
        id: 'aws-eks-cluster',
        name: 'EKS Cluster',
        slug: 'eks-',
        description:
          'Managed Kubernetes control plane, integrated with AWS networking, IAM and load balancing.',
        length: '1-100',
        category: Categories.CONTAINERS,
        learnUrl: 'https://docs.aws.amazon.com/eks/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_cluster',
        restrictions:
          'Letters, numbers, hyphens and underscores. Must start with a letter or number.',
        resource: 'aws_eks_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_eks_cluster" "main" {
  name     = "eks-main"
  role_arn = aws_iam_role.eks.arn
  version  = "1.31"

  vpc_config {
    subnet_ids = aws_subnet.main[*].id
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/eks/pricing/',
        portalUrl: 'https://console.aws.amazon.com/eks/',
      },
      {
        id: 'aws-eks-node-group',
        name: 'EKS Node Group',
        slug: 'eksng-',
        description:
          'Managed group of EC2 worker nodes automatically registered with an EKS cluster.',
        length: '1-63',
        category: Categories.CONTAINERS,
        learnUrl:
          'https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_eks_node_group',
        entity: 'nodegroups',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "eksng-main"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = aws_subnet.main[*].id

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/eks/pricing/',
        portalUrl: 'https://console.aws.amazon.com/eks/',
      },
      {
        id: 'aws-ecr-repository',
        name: 'ECR Repository',
        slug: 'ecr-',
        description:
          'Private container registry with image scanning, lifecycle policies and IAM based access control.',
        length: '2-256',
        category: Categories.CONTAINERS,
        learnUrl: 'https://docs.aws.amazon.com/ecr/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository',
        restrictions:
          'Lowercase letters, numbers, hyphens, underscores, dots and forward slashes.',
        resource: 'aws_ecr_repository',
        entity: 'repositories',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ecr_repository" "main" {
  name                 = "ecr-main"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/ecr/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ecr/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-s3-bucket',
        name: 'S3 Bucket',
        slug: 's3-',
        description:
          'Object storage with eleven nines of durability, lifecycle rules, versioning and fine grained access policies.',
        length: '3-63',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/s3/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket',
        restrictions:
          'Lowercase letters, numbers, dots and hyphens. Must be globally unique and cannot be formatted as an IP address.',
        resource: 'aws_s3_bucket',
        entity: 'buckets',
        scope: 'global',
        icon: '',
        terraformCode: `resource "aws_s3_bucket" "main" {
  bucket = "s3-main-\${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/s3/pricing/',
        portalUrl: 'https://console.aws.amazon.com/s3/',
      },
      {
        id: 'aws-ebs-volume',
        name: 'EBS Volume',
        slug: 'ebs-',
        description:
          'Block storage volume attached to an EC2 instance, with snapshots and encryption at rest.',
        length: '1-255',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/ebs/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ebs_volume',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_ebs_volume',
        entity: 'volumes',
        scope: 'availability zone',
        icon: '',
        terraformCode: `resource "aws_ebs_volume" "main" {
  availability_zone = "us-east-1a"
  size              = 20
  type              = "gp3"
  encrypted         = true

  tags = {
    Name = "ebs-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/ebs/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ec2/#Volumes',
      },
      {
        id: 'aws-efs-file-system',
        name: 'EFS File System',
        slug: 'efs-',
        description:
          'Elastic NFS file system shared by many EC2 instances, containers and Lambda functions.',
        length: '1-255',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/efs/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/efs_file_system',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_efs_file_system',
        entity: 'fileSystems',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_efs_file_system" "main" {
  creation_token = "efs-main"
  encrypted      = true

  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/efs/pricing/',
        portalUrl: 'https://console.aws.amazon.com/efs/',
      },
      {
        id: 'aws-fsx-lustre-file-system',
        name: 'FSx for Lustre',
        slug: 'fsx-',
        description:
          'High performance parallel file system for machine learning, HPC and media processing workloads.',
        length: '1-255',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/fsx_lustre_file_system',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_fsx_lustre_file_system',
        entity: 'fileSystems',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_fsx_lustre_file_system" "main" {
  storage_capacity    = 1200
  subnet_ids          = [aws_subnet.main.id]
  deployment_type     = "PERSISTENT_2"
  per_unit_storage_throughput = 125

  tags = {
    Name = "fsx-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/fsx/lustre/pricing/',
        portalUrl: 'https://console.aws.amazon.com/fsx/',
      },
      {
        id: 'aws-backup-vault',
        name: 'Backup Vault',
        slug: 'bkv-',
        description:
          'Encrypted container holding the recovery points created by AWS Backup plans.',
        length: '2-50',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/aws-backup/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/backup_vault',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_backup_vault',
        entity: 'backupVaults',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_backup_vault" "main" {
  name        = "bkv-main"
  kms_key_arn = aws_kms_key.main.arn
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/backup/pricing/',
        portalUrl: 'https://console.aws.amazon.com/backup/',
      },
      {
        id: 'aws-glacier-vault',
        name: 'S3 Glacier Vault',
        slug: 'glacier-',
        description:
          'Long term archive storage for data that is rarely accessed but must be retained.',
        length: '1-255',
        category: Categories.STORAGE,
        learnUrl: 'https://docs.aws.amazon.com/amazonglacier/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/glacier_vault',
        restrictions: 'Letters, numbers, hyphens, underscores and dots.',
        resource: 'aws_glacier_vault',
        entity: 'vaults',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_glacier_vault" "main" {
  name = "glacier-main"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/s3/glacier/pricing/',
        portalUrl: 'https://console.aws.amazon.com/glacier/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-rds-instance',
        name: 'RDS Instance',
        slug: 'rds-',
        description:
          'Managed relational database for PostgreSQL, MySQL, MariaDB, Oracle and SQL Server with automated backups.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://docs.aws.amazon.com/rds/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter and cannot end with a hyphen.',
        resource: 'aws_db_instance',
        entity: 'dbInstances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_db_instance" "main" {
  identifier           = "rds-main"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t4g.micro"
  allocated_storage    = 20
  username             = "postgres"
  manage_master_user_password = true
  skip_final_snapshot  = true
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/rds/pricing/',
        portalUrl: 'https://console.aws.amazon.com/rds/',
      },
      {
        id: 'aws-aurora-cluster',
        name: 'Aurora Cluster',
        slug: 'aurora-',
        description:
          'MySQL and PostgreSQL compatible database cluster with distributed storage and fast failover.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl:
          'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter.',
        resource: 'aws_rds_cluster',
        entity: 'dbClusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_rds_cluster" "main" {
  cluster_identifier = "aurora-main"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  master_username    = "postgres"
  manage_master_user_password = true
  skip_final_snapshot = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 4
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/rds/aurora/pricing/',
        portalUrl: 'https://console.aws.amazon.com/rds/',
      },
      {
        id: 'aws-dynamodb-table',
        name: 'DynamoDB Table',
        slug: 'ddb-',
        description:
          'Serverless key-value and document database with single digit millisecond latency at any scale.',
        length: '3-255',
        category: Categories.DATABASES,
        learnUrl: 'https://docs.aws.amazon.com/dynamodb/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table',
        restrictions: 'Letters, numbers, underscores, hyphens and dots.',
        resource: 'aws_dynamodb_table',
        entity: 'tables',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_dynamodb_table" "main" {
  name         = "ddb-main"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/dynamodb/pricing/',
        portalUrl: 'https://console.aws.amazon.com/dynamodbv2/',
      },
      {
        id: 'aws-elasticache-cluster',
        name: 'ElastiCache Cluster',
        slug: 'ec-',
        description:
          'In-memory Redis or Memcached cache used to offload databases and speed up read heavy workloads.',
        length: '1-50',
        category: Categories.DATABASES,
        learnUrl: 'https://docs.aws.amazon.com/elasticache/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/elasticache_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter and cannot contain two consecutive hyphens.',
        resource: 'aws_elasticache_cluster',
        entity: 'cacheClusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_elasticache_cluster" "main" {
  cluster_id           = "ec-main"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/elasticache/pricing/',
        portalUrl: 'https://console.aws.amazon.com/elasticache/',
      },
      {
        id: 'aws-documentdb-cluster',
        name: 'DocumentDB Cluster',
        slug: 'docdb-',
        description:
          'MongoDB compatible document database service with automated backups and replication.',
        length: '1-63',
        category: Categories.DATABASES,
        learnUrl: 'https://docs.aws.amazon.com/documentdb/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/docdb_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter.',
        resource: 'aws_docdb_cluster',
        entity: 'dbClusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_docdb_cluster" "main" {
  cluster_identifier  = "docdb-main"
  engine              = "docdb"
  master_username     = "docdbadmin"
  master_password     = var.docdb_password
  skip_final_snapshot = true
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/documentdb/pricing/',
        portalUrl: 'https://console.aws.amazon.com/docdb/',
      },
      {
        id: 'aws-redshift-cluster',
        name: 'Redshift Cluster',
        slug: 'rs-',
        description:
          'Petabyte scale data warehouse with columnar storage and massively parallel query execution.',
        length: '1-63',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/redshift/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/redshift_cluster',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter.',
        resource: 'aws_redshift_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_redshift_cluster" "main" {
  cluster_identifier  = "rs-main"
  database_name       = "analytics"
  master_username     = "admin"
  manage_master_password = true
  node_type           = "ra3.large"
  cluster_type        = "single-node"
  skip_final_snapshot = true
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/redshift/pricing/',
        portalUrl: 'https://console.aws.amazon.com/redshiftv2/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-vpc',
        name: 'Virtual Private Cloud',
        slug: 'vpc-',
        description:
          'Logically isolated network where resources are launched, with full control over addressing and routing.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/vpc/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_vpc',
        entity: 'vpcs',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "vpc-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/vpc/pricing/',
        portalUrl: 'https://console.aws.amazon.com/vpc/',
      },
      {
        id: 'aws-subnet',
        name: 'Subnet',
        slug: 'snet-',
        description:
          'Range of IP addresses inside a VPC, bound to a single availability zone and to a route table.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl:
          'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_subnet',
        entity: 'subnets',
        scope: 'availability zone',
        icon: '',
        terraformCode: `resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "snet-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/vpc/pricing/',
        portalUrl: 'https://console.aws.amazon.com/vpc/#subnets',
      },
      {
        id: 'aws-security-group',
        name: 'Security Group',
        slug: 'sg-',
        description:
          'Stateful virtual firewall controlling inbound and outbound traffic for network interfaces.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl:
          'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group',
        restrictions:
          'Letters, numbers, spaces and the characters . _ - : / ( ) # , @ [ ] + = & ; { } ! $ *.',
        resource: 'aws_security_group',
        entity: 'securityGroups',
        scope: 'vpc',
        icon: '',
        terraformCode: `resource "aws_security_group" "main" {
  name   = "sg-main"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/vpc/pricing/',
        portalUrl: 'https://console.aws.amazon.com/vpc/#SecurityGroups',
      },
      {
        id: 'aws-load-balancer',
        name: 'Elastic Load Balancer',
        slug: 'alb-',
        description:
          'Application, network or gateway load balancer distributing traffic across healthy targets.',
        length: '1-32',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/elasticloadbalancing/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb',
        restrictions:
          'Letters, numbers and hyphens. Cannot begin or end with a hyphen.',
        resource: 'aws_lb',
        entity: 'loadBalancers',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_lb" "main" {
  name               = "alb-main"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.main.id]
  subnets            = aws_subnet.main[*].id
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/elasticloadbalancing/pricing/',
        portalUrl: 'https://console.aws.amazon.com/ec2/#LoadBalancers',
      },
      {
        id: 'aws-cloudfront-distribution',
        name: 'CloudFront Distribution',
        slug: 'cf-',
        description:
          'Global content delivery network caching content close to users, with TLS and WAF integration.',
        length: 'N/A',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/cloudfront/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution',
        restrictions:
          'Distributions are identified by a generated id; use the comment field and tags to name them.',
        resource: 'aws_cloudfront_distribution',
        entity: 'distributions',
        scope: 'global',
        icon: '',
        terraformCode: `resource "aws_cloudfront_distribution" "main" {
  enabled = true
  comment = "cf-main"

  origin {
    domain_name = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id   = "s3-main"
  }

  default_cache_behavior {
    target_origin_id       = "s3-main"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/cloudfront/pricing/',
        portalUrl: 'https://console.aws.amazon.com/cloudfront/',
      },
      {
        id: 'aws-route53-zone',
        name: 'Route 53 Hosted Zone',
        slug: 'r53-',
        description:
          'Authoritative DNS service hosting the records of a public or private domain.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/route53/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone',
        restrictions: 'Must be a valid DNS domain name.',
        resource: 'aws_route53_zone',
        entity: 'hostedZones',
        scope: 'global',
        icon: '',
        terraformCode: `resource "aws_route53_zone" "main" {
  name = "example.com"

  tags = {
    Name = "r53-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/route53/pricing/',
        portalUrl: 'https://console.aws.amazon.com/route53/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-nat-gateway',
        name: 'NAT Gateway',
        slug: 'nat-',
        description:
          'Managed network address translation allowing private subnets to reach the internet outbound only.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl:
          'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_nat_gateway',
        entity: 'natGateways',
        scope: 'availability zone',
        icon: '',
        terraformCode: `resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.main.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "nat-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/vpc/pricing/',
        portalUrl: 'https://console.aws.amazon.com/vpc/#NatGateways',
      },
      {
        id: 'aws-transit-gateway',
        name: 'Transit Gateway',
        slug: 'tgw-',
        description:
          'Regional network hub connecting VPCs, VPN and Direct Connect attachments through a single router.',
        length: '1-255',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/vpc/latest/tgw/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway',
        restrictions: 'The Name tag accepts any UTF-8 character.',
        resource: 'aws_ec2_transit_gateway',
        entity: 'transitGateways',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ec2_transit_gateway" "main" {
  description = "tgw-main"

  tags = {
    Name = "tgw-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/transit-gateway/pricing/',
        portalUrl: 'https://console.aws.amazon.com/vpc/#TransitGateways',
      },
      {
        id: 'aws-api-gateway',
        name: 'API Gateway',
        slug: 'apigw-',
        description:
          'Managed front door for REST, HTTP and WebSocket APIs, with throttling, authorisation and caching.',
        length: '1-128',
        category: Categories.INTEGRATION,
        learnUrl: 'https://docs.aws.amazon.com/apigateway/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_api',
        restrictions: 'Any UTF-8 character.',
        resource: 'aws_apigatewayv2_api',
        entity: 'apis',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_apigatewayv2_api" "main" {
  name          = "apigw-main"
  protocol_type = "HTTP"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/api-gateway/pricing/',
        portalUrl: 'https://console.aws.amazon.com/apigateway/',
      },
      {
        id: 'aws-sqs-queue',
        name: 'SQS Queue',
        slug: 'sqs-',
        description:
          'Fully managed message queue decoupling producers from consumers, in standard or FIFO mode.',
        length: '1-80',
        category: Categories.INTEGRATION,
        learnUrl: 'https://docs.aws.amazon.com/sqs/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue',
        restrictions:
          'Letters, numbers, hyphens and underscores. FIFO queues must end with .fifo.',
        resource: 'aws_sqs_queue',
        entity: 'queues',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_sqs_queue" "main" {
  name                      = "sqs-main"
  message_retention_seconds = 345600
  sqs_managed_sse_enabled   = true
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/sqs/pricing/',
        portalUrl: 'https://console.aws.amazon.com/sqs/',
      },
      {
        id: 'aws-sns-topic',
        name: 'SNS Topic',
        slug: 'sns-',
        description:
          'Publish/subscribe topic delivering notifications to queues, functions, HTTP endpoints, email and SMS.',
        length: '1-256',
        category: Categories.INTEGRATION,
        learnUrl: 'https://docs.aws.amazon.com/sns/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic',
        restrictions:
          'Letters, numbers, hyphens and underscores. FIFO topics must end with .fifo.',
        resource: 'aws_sns_topic',
        entity: 'topics',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_sns_topic" "main" {
  name = "sns-main"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/sns/pricing/',
        portalUrl: 'https://console.aws.amazon.com/sns/',
      },
      {
        id: 'aws-step-functions-state-machine',
        name: 'Step Functions State Machine',
        slug: 'sfn-',
        description:
          'Serverless orchestration of Lambda functions and AWS services through a visual state machine.',
        length: '1-80',
        category: Categories.INTEGRATION,
        learnUrl: 'https://docs.aws.amazon.com/step-functions/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sfn_state_machine',
        restrictions:
          'Letters, numbers, hyphens and underscores. Cannot contain whitespace or the characters < > { } [ ] ? * " # % \\ ^ | ~ ` $ & , ; : /.',
        resource: 'aws_sfn_state_machine',
        entity: 'stateMachines',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_sfn_state_machine" "main" {
  name     = "sfn-main"
  role_arn = aws_iam_role.sfn.arn

  definition = jsonencode({
    StartAt = "Done"
    States  = { Done = { Type = "Succeed" } }
  })
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/step-functions/pricing/',
        portalUrl: 'https://console.aws.amazon.com/states/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-eventbridge-bus',
        name: 'EventBridge Bus',
        slug: 'eb-bus-',
        description:
          'Serverless event bus routing events from AWS services, SaaS partners and custom applications.',
        length: '1-256',
        category: Categories.INTEGRATION,
        learnUrl: 'https://docs.aws.amazon.com/eventbridge/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_bus',
        restrictions: 'Letters, numbers, hyphens, underscores and dots.',
        resource: 'aws_cloudwatch_event_bus',
        entity: 'eventBuses',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_cloudwatch_event_bus" "main" {
  name = "eb-bus-main"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/eventbridge/pricing/',
        portalUrl: 'https://console.aws.amazon.com/events/',
      },
      {
        id: 'aws-kinesis-stream',
        name: 'Kinesis Data Stream',
        slug: 'kds-',
        description:
          'Durable stream ingesting hundreds of thousands of records per second for real time processing.',
        length: '1-128',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/streams/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kinesis_stream',
        restrictions: 'Letters, numbers, hyphens, underscores and dots.',
        resource: 'aws_kinesis_stream',
        entity: 'streams',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_kinesis_stream" "main" {
  name = "kds-main"

  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/kinesis/data-streams/pricing/',
        portalUrl: 'https://console.aws.amazon.com/kinesis/',
      },
      {
        id: 'aws-msk-cluster',
        name: 'MSK Cluster',
        slug: 'msk-',
        description:
          'Managed Apache Kafka cluster with broker provisioning, patching and encryption handled by AWS.',
        length: '1-64',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/msk/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/msk_cluster',
        restrictions: 'Letters, numbers and hyphens. Must begin with a letter.',
        resource: 'aws_msk_cluster',
        entity: 'clusters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_msk_cluster" "main" {
  cluster_name           = "msk-main"
  kafka_version          = "3.6.0"
  number_of_broker_nodes = 3

  broker_node_group_info {
    instance_type  = "kafka.m5.large"
    client_subnets = aws_subnet.main[*].id
    security_groups = [aws_security_group.main.id]

    storage_info {
      ebs_storage_info {
        volume_size = 100
      }
    }
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/msk/pricing/',
        portalUrl: 'https://console.aws.amazon.com/msk/',
      },
      {
        id: 'aws-glue-database',
        name: 'Glue Catalog Database',
        slug: 'glue-',
        description:
          'Central metadata catalogue describing the tables queried by Athena, EMR and Redshift Spectrum.',
        length: '1-255',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/glue/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/glue_catalog_database',
        restrictions: 'Lowercase letters, numbers and underscores.',
        resource: 'aws_glue_catalog_database',
        entity: 'databases',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_glue_catalog_database" "main" {
  name = "glue_main"
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/glue/pricing/',
        portalUrl: 'https://console.aws.amazon.com/glue/',
      },
      {
        id: 'aws-athena-workgroup',
        name: 'Athena Workgroup',
        slug: 'ath-',
        description:
          'Isolates Athena queries, their result location and their cost controls per team or workload.',
        length: '1-128',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/athena/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/athena_workgroup',
        restrictions: 'Letters, numbers, hyphens, underscores and dots.',
        resource: 'aws_athena_workgroup',
        entity: 'workGroups',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_athena_workgroup" "main" {
  name = "ath-main"

  configuration {
    result_configuration {
      output_location = "s3://\${aws_s3_bucket.main.bucket}/athena/"
    }
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/athena/pricing/',
        portalUrl: 'https://console.aws.amazon.com/athena/',
      },
      {
        id: 'aws-opensearch-domain',
        name: 'OpenSearch Domain',
        slug: 'os-',
        description:
          'Managed OpenSearch cluster for log analytics, full text search and observability dashboards.',
        length: '3-28',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/opensearch-service/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/opensearch_domain',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must start with a lowercase letter.',
        resource: 'aws_opensearch_domain',
        entity: 'domains',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_opensearch_domain" "main" {
  domain_name    = "os-main"
  engine_version = "OpenSearch_2.13"

  cluster_config {
    instance_type = "t3.small.search"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/opensearch-service/pricing/',
        portalUrl: 'https://console.aws.amazon.com/aos/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-sagemaker-domain',
        name: 'SageMaker Domain',
        slug: 'sm-',
        description:
          'Workspace hosting SageMaker Studio users, their notebooks, storage and network configuration.',
        length: '1-63',
        category: Categories.AIANDML,
        learnUrl: 'https://docs.aws.amazon.com/sagemaker/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sagemaker_domain',
        restrictions: 'Letters, numbers and hyphens.',
        resource: 'aws_sagemaker_domain',
        entity: 'domains',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_sagemaker_domain" "main" {
  domain_name = "sm-main"
  auth_mode   = "IAM"
  vpc_id      = aws_vpc.main.id
  subnet_ids  = aws_subnet.main[*].id

  default_user_settings {
    execution_role = aws_iam_role.sagemaker.arn
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/sagemaker/pricing/',
        portalUrl: 'https://console.aws.amazon.com/sagemaker/',
      },
      {
        id: 'aws-sagemaker-endpoint',
        name: 'SageMaker Endpoint',
        slug: 'smep-',
        description:
          'HTTPS endpoint serving real time inference for a trained machine learning model.',
        length: '1-63',
        category: Categories.AIANDML,
        learnUrl:
          'https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints.html',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sagemaker_endpoint',
        restrictions: 'Letters, numbers and hyphens.',
        resource: 'aws_sagemaker_endpoint',
        entity: 'endpoints',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_sagemaker_endpoint" "main" {
  name                 = "smep-main"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.main.name
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/sagemaker/pricing/',
        portalUrl: 'https://console.aws.amazon.com/sagemaker/',
      },
      {
        id: 'aws-bedrock-guardrail',
        name: 'Bedrock Guardrail',
        slug: 'brg-',
        description:
          'Safety policy filtering prompts and model responses for generative AI applications built on Bedrock.',
        length: '1-50',
        category: Categories.AIANDML,
        learnUrl: 'https://docs.aws.amazon.com/bedrock/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/bedrock_guardrail',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_bedrock_guardrail',
        entity: 'guardrails',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_bedrock_guardrail" "main" {
  name                      = "brg-main"
  blocked_input_messaging   = "Blocked input"
  blocked_outputs_messaging = "Blocked output"

  content_policy_config {
    filters_config {
      input_strength  = "HIGH"
      output_strength = "HIGH"
      type            = "HATE"
    }
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/bedrock/pricing/',
        portalUrl: 'https://console.aws.amazon.com/bedrock/',
      },
      {
        id: 'aws-iot-thing',
        name: 'IoT Thing',
        slug: 'iot-',
        description:
          'Representation of a physical device in the IoT Core registry, with its certificates and shadow.',
        length: '1-128',
        category: Categories.ANALYTICSANDIOT,
        learnUrl: 'https://docs.aws.amazon.com/iot/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iot_thing',
        restrictions: 'Letters, numbers, hyphens, underscores and colons.',
        resource: 'aws_iot_thing',
        entity: 'things',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_iot_thing" "main" {
  name = "iot-main"

  attributes = {
    site = "paris"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/iot-core/pricing/',
        portalUrl: 'https://console.aws.amazon.com/iot/',
      },
      {
        id: 'aws-workspaces-workspace',
        name: 'WorkSpaces Desktop',
        slug: 'ws-',
        description:
          'Managed virtual desktop delivered to users on demand, billed hourly or monthly.',
        length: 'N/A',
        category: Categories.VIRTUALDESKTOP,
        learnUrl: 'https://docs.aws.amazon.com/workspaces/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/workspaces_workspace',
        restrictions:
          'Workspaces are identified by their directory user; use tags to name them.',
        resource: 'aws_workspaces_workspace',
        entity: 'workspaces',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_workspaces_workspace" "main" {
  directory_id = aws_workspaces_directory.main.id
  bundle_id    = data.aws_workspaces_bundle.standard.id
  user_name    = "jane"

  tags = {
    Name = "ws-main"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/workspaces/pricing/',
        portalUrl: 'https://console.aws.amazon.com/workspaces/',
      },
      {
        id: 'aws-dms-replication-instance',
        name: 'DMS Replication Instance',
        slug: 'dms-',
        description:
          'Compute running Database Migration Service tasks that move data between engines with minimal downtime.',
        length: '1-63',
        category: Categories.MIGRATION,
        learnUrl: 'https://docs.aws.amazon.com/dms/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dms_replication_instance',
        restrictions:
          'Lowercase letters, numbers and hyphens. Must begin with a letter and cannot end with a hyphen.',
        resource: 'aws_dms_replication_instance',
        entity: 'replicationInstances',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_dms_replication_instance" "main" {
  replication_instance_id    = "dms-main"
  replication_instance_class = "dms.t3.medium"
  allocated_storage          = 50
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/dms/pricing/',
        portalUrl: 'https://console.aws.amazon.com/dms/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-iam-role',
        name: 'IAM Role',
        slug: 'role-',
        description:
          'Identity with permission policies that services and users assume to obtain temporary credentials.',
        length: '1-64',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/IAM/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role',
        restrictions:
          'Letters, numbers and the characters + = , . @ _ -. Names are case sensitive.',
        resource: 'aws_iam_role',
        entity: 'roles',
        scope: 'account',
        icon: '',
        terraformCode: `resource "aws_iam_role" "main" {
  name = "role-main"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.aws.amazon.com/iam/',
      },
      {
        id: 'aws-kms-key',
        name: 'KMS Key',
        slug: 'kms-',
        description:
          'Customer managed encryption key used to protect data across AWS services, with automatic rotation.',
        length: '1-256',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/kms/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kms_key',
        restrictions:
          'Keys are referenced by an alias in the form alias/name, using letters, numbers, hyphens, underscores and slashes.',
        resource: 'aws_kms_key',
        entity: 'keys',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_kms_key" "main" {
  description         = "kms-main"
  enable_key_rotation = true
}

resource "aws_kms_alias" "main" {
  name          = "alias/kms-main"
  target_key_id = aws_kms_key.main.id
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/kms/pricing/',
        portalUrl: 'https://console.aws.amazon.com/kms/',
      },
      {
        id: 'aws-secrets-manager-secret',
        name: 'Secrets Manager Secret',
        slug: 'sec-',
        description:
          'Stores database credentials, API keys and tokens with encryption and automatic rotation.',
        length: '1-512',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/secretsmanager/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret',
        restrictions:
          'Letters, numbers and the characters / _ + = . @ -.',
        resource: 'aws_secretsmanager_secret',
        entity: 'secrets',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_secretsmanager_secret" "main" {
  name                    = "sec-main"
  recovery_window_in_days = 7
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/secrets-manager/pricing/',
        portalUrl: 'https://console.aws.amazon.com/secretsmanager/',
      },
      {
        id: 'aws-cloudwatch-log-group',
        name: 'CloudWatch Log Group',
        slug: 'log-',
        description:
          'Container for log streams, with retention, metric filters and subscription filters.',
        length: '1-512',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/cloudwatch/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group',
        restrictions:
          'Letters, numbers and the characters _ - / . #.',
        resource: 'aws_cloudwatch_log_group',
        entity: 'logGroups',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/lambda/log-main"
  retention_in_days = 30
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/cloudwatch/pricing/',
        portalUrl: 'https://console.aws.amazon.com/cloudwatch/',
      },
      {
        id: 'aws-cloudtrail-trail',
        name: 'CloudTrail Trail',
        slug: 'ct-',
        description:
          'Records API activity across the account and delivers the events to S3 and CloudWatch Logs.',
        length: '3-128',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/cloudtrail/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudtrail',
        restrictions:
          'Letters, numbers, dots, underscores and hyphens. Must start and end with a letter or number.',
        resource: 'aws_cloudtrail',
        entity: 'trails',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_cloudtrail" "main" {
  name                          = "ct-main"
  s3_bucket_name                = aws_s3_bucket.main.id
  include_global_service_events = true
  is_multi_region_trail         = true
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/cloudtrail/pricing/',
        portalUrl: 'https://console.aws.amazon.com/cloudtrail/',
      },
      {
        id: 'aws-organizations-unit',
        name: 'Organizational Unit',
        slug: 'ou-',
        description:
          'Groups accounts inside AWS Organizations so that service control policies apply to a whole branch.',
        length: '1-128',
        category: Categories.GENERAL,
        learnUrl: 'https://docs.aws.amazon.com/organizations/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/organizations_organizational_unit',
        restrictions: 'Any UTF-8 character.',
        resource: 'aws_organizations_organizational_unit',
        entity: 'organizationalUnits',
        scope: 'organization',
        icon: '',
        terraformCode: `resource "aws_organizations_organizational_unit" "main" {
  name      = "ou-main"
  parent_id = aws_organizations_organization.main.roots[0].id
}`,
        pricingReferenceUrl: 'Free',
        portalUrl: 'https://console.aws.amazon.com/organizations/',
      },
    ],
  },
  {
    items: [
      {
        id: 'aws-ssm-parameter',
        name: 'SSM Parameter',
        slug: 'ssm-',
        description:
          'Hierarchical configuration store for plain text or encrypted values consumed by applications.',
        length: '1-1011',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/systems-manager/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter',
        restrictions:
          'Letters, numbers and the characters . - _ /. Hierarchies are separated by slashes.',
        resource: 'aws_ssm_parameter',
        entity: 'parameters',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_ssm_parameter" "main" {
  name  = "/app/ssm-main"
  type  = "SecureString"
  value = var.api_key
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/systems-manager/pricing/',
        portalUrl: 'https://console.aws.amazon.com/systems-manager/parameters',
      },
      {
        id: 'aws-codebuild-project',
        name: 'CodeBuild Project',
        slug: 'cb-',
        description:
          'Managed build service compiling source, running tests and producing deployment artefacts.',
        length: '2-255',
        category: Categories.DEVTOOLS,
        learnUrl: 'https://docs.aws.amazon.com/codebuild/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codebuild_project',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_codebuild_project',
        entity: 'projects',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_codebuild_project" "main" {
  name         = "cb-main"
  service_role = aws_iam_role.codebuild.arn

  artifacts { type = "NO_ARTIFACTS" }

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:7.0"
    type         = "LINUX_CONTAINER"
  }

  source {
    type     = "GITHUB"
    location = "https://github.com/example/repo.git"
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/codebuild/pricing/',
        portalUrl: 'https://console.aws.amazon.com/codesuite/codebuild/',
      },
      {
        id: 'aws-codepipeline',
        name: 'CodePipeline',
        slug: 'cp-',
        description:
          'Continuous delivery pipeline chaining source, build, test and deployment stages.',
        length: '1-100',
        category: Categories.DEVTOOLS,
        learnUrl: 'https://docs.aws.amazon.com/codepipeline/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codepipeline',
        restrictions: 'Letters, numbers, hyphens, underscores, dots and @.',
        resource: 'aws_codepipeline',
        entity: 'pipelines',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_codepipeline" "main" {
  name     = "cp-main"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.main.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source"]

      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.main.arn
        FullRepositoryId = "example/repo"
        BranchName       = "main"
      }
    }
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/codepipeline/pricing/',
        portalUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/',
      },
      {
        id: 'aws-wafv2-web-acl',
        name: 'WAF Web ACL',
        slug: 'waf-',
        description:
          'Web application firewall filtering HTTP requests before they reach CloudFront, ALB or API Gateway.',
        length: '1-128',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/waf/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl',
        restrictions: 'Letters, numbers, hyphens and underscores.',
        resource: 'aws_wafv2_web_acl',
        entity: 'webACLs',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_wafv2_web_acl" "main" {
  name  = "waf-main"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "waf-main"
    sampled_requests_enabled   = true
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/waf/pricing/',
        portalUrl: 'https://console.aws.amazon.com/wafv2/',
      },
      {
        id: 'aws-acm-certificate',
        name: 'ACM Certificate',
        slug: 'cert-',
        description:
          'Public or private TLS certificate provisioned and renewed automatically for AWS endpoints.',
        length: '1-253',
        category: Categories.NETWORKING,
        learnUrl: 'https://docs.aws.amazon.com/acm/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate',
        restrictions:
          'Certificates are identified by their domain name; wildcards are supported.',
        resource: 'aws_acm_certificate',
        entity: 'certificates',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_acm_certificate" "main" {
  domain_name       = "app.example.com"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/certificate-manager/pricing/',
        portalUrl: 'https://console.aws.amazon.com/acm/',
      },
      {
        id: 'aws-cognito-user-pool',
        name: 'Cognito User Pool',
        slug: 'cup-',
        description:
          'User directory providing sign-up, sign-in, MFA and federation for web and mobile applications.',
        length: '1-128',
        category: Categories.MANAGEMENT,
        learnUrl: 'https://docs.aws.amazon.com/cognito/',
        terraformUrl:
          'https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool',
        restrictions: 'Letters, numbers, spaces and the characters + = , . @ -.',
        resource: 'aws_cognito_user_pool',
        entity: 'userPools',
        scope: 'region',
        icon: '',
        terraformCode: `resource "aws_cognito_user_pool" "main" {
  name = "cup-main"

  password_policy {
    minimum_length = 12
  }
}`,
        pricingReferenceUrl: 'https://aws.amazon.com/cognito/pricing/',
        portalUrl: 'https://console.aws.amazon.com/cognito/',
      },
    ],
  },
];
