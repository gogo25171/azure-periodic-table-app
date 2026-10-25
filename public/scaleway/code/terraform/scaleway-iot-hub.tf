resource "scaleway_iot_hub" "main" {
  name         = "iot-${local.naming_suffix}"
  product_plan = "plan_shared"
}