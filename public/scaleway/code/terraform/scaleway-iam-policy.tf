data "scaleway_account_project" "default" {
  name = "pol-${local.naming_suffix}"
}

resource "scaleway_iam_policy" "object_read_only" {
  name           = "pol-${local.naming_suffix}"
  description    = "gives app readonly access to object storage in project"
  application_id = scaleway_iam_application.app.id
  rule {
    project_ids          = [data.scaleway_account_project.default.id]
    permission_set_names = ["ObjectStorageReadOnly"]
  }
}