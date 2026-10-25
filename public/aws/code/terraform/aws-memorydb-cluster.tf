resource "aws_memorydb_cluster" "main" {
  acl_name                 = "open-access"
  name                     = "memorydb-${local.naming_suffix}"
  node_type                = "db.t4g.small"
  engine                   = "redis"
  engine_version           = "7.1"
  num_shards               = 2
  security_group_ids       = [aws_security_group.main.id]
  snapshot_retention_limit = 7
  subnet_group_name        = aws_memorydb_subnet_group.main.id
}