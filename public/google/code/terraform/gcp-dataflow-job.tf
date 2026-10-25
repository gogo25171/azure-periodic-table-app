resource "google_dataflow_job" "big_data_job" {
  name              = "df-${local.naming_suffix}"
  template_gcs_path = "gs://my-bucket/templates/template_file"
  temp_gcs_location = "gs://my-bucket/tmp_dir"
  parameters = {
    foo = "bar"
    baz = "qux"
  }
}