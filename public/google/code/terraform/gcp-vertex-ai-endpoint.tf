data "google_project" "project" {}


resource "google_vertex_ai_endpoint" "endpoint" {
  name         = "vai-${local.naming_suffix}"
  display_name = "sample-endpoint"
  description  = "A sample vertex endpoint"
  location     = var.location
  region       = "us-central1"
  labels = {
    label-one = "value-one"
  }
  network = "projects/${data.google_project.project.number}/global/networks/${google_compute_network.vertex_network.name}"
  encryption_spec {
    kms_key_name = "kms-name"
  }
  predict_request_response_logging_config {
    bigquery_destination {
      output_uri = "bq://${data.google_project.project.project_id}.${google_bigquery_dataset.bq_dataset.dataset_id}.request_response_logging"
    }
    enabled       = true
    sampling_rate = 0.1
  }
  traffic_split = jsonencode({
    "12345" = 100
  })

  depends_on = [
    google_service_networking_connection.vertex_vpc_connection
  ]
}