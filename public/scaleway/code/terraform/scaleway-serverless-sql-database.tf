resource "scaleway_sdb_sql_database" "database" {
  name    = "sdb-${local.naming_suffix}"
  min_cpu = 0
  max_cpu = 8
}