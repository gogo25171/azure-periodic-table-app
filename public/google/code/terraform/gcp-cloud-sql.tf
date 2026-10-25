resource "google_sql_database_instance" "main" {
  name             = "csql-${local.naming_suffix}"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    # Second-generation instance tiers are based on the machine
    # type. See argument reference below.
    tier = "db-f1-micro"
  }
}