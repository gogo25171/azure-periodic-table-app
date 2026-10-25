resource "google_kms_crypto_key" "example-key" {
  name            = "kms-${local.naming_suffix}"
  key_ring        = google_kms_key_ring.keyring.id
  rotation_period = "7776000s"

  lifecycle {
    prevent_destroy = true
  }
}