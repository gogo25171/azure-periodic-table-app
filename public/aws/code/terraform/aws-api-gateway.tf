resource "aws_apigatewayv2_api" "main" {
  name                       = "apigw-${local.naming_suffix}"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}