resource "google_cloudbuild_trigger" "filename-trigger" {
  location = var.location

  trigger_template {
    branch_name = "main"
    repo_name   = "my-repo"
  }

  substitutions = {
    _FOO = "bar"
    _BAZ = "qux"
  }

  filename = "cloudbuild.yaml"
}