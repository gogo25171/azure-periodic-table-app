resource "ovh_cloud_project_user_s3_credential" "my_s3_credentials" {
  service_name = ovh_cloud_project_user.user.service_name
  user_id      = ovh_cloud_project_user.user.id
}