locals {
  project = "my-project-name" # Google Cloud Platform Project ID
}

resource "google_cloudfunctions2_function" "function" {
  name        = "func-${local.naming_suffix}"
  location    = var.location
  description = "a new function"

  build_config {
    runtime     = "nodejs20"
    entry_point = "helloHttp" # Set the entry point
    source {
      storage_source {
        bucket = google_storage_bucket.bucket.name
        object = google_storage_bucket_object.object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}