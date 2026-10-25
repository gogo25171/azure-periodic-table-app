resource "google_logging_project_sink" "my-sink" {
  name = "sink-${local.naming_suffix}"

  # Can export to pubsub, cloud storage, bigquery, log bucket, or another project
  destination = "pubsub.googleapis.com/projects/my-project/topics/instance-activity"

  # Log all WARN or higher severity messages relating to instances
  filter = "resource.type = gce_instance AND severity >= WARNING"

  # Use the Logging service agent shared by sinks in this project
  unique_writer_identity = true
}