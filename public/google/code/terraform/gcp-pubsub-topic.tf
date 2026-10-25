resource "google_pubsub_topic" "main" {
  name = "ps-${local.naming_suffix}"

  labels = {
    foo = "bar"
  }

  message_retention_duration = "86600s"
}