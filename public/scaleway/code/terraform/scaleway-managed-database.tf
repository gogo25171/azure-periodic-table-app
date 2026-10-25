resource "scaleway_rdb_instance" "main" {
  name               = "rdb-${local.naming_suffix}"
  node_type          = "DB-DEV-S"
  engine             = "PostgreSQL-15"
  is_ha_cluster      = true
  disable_backup     = true
  user_name          = "my_initial_user"
  password           = "thiZ_is_v&ry_s3cret"
  encryption_at_rest = true
}