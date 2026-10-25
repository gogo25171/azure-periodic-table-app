resource "google_secret_manager_secret" "secret-basic" {
  secret_id = "secret"

  labels = {
    label = "my-label"
  }

  replication {
    user_managed {
      replicas {
        location = var.location
      }
      replicas {
        location = var.location
      }
    }
  }
  deletion_protection = false
}