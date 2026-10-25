resource "google_firestore_database" "database" {
  project     = "my-project-name"
  name        = "fs-${local.naming_suffix}"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
}