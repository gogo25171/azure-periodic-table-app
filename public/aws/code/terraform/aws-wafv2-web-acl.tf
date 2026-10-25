resource "aws_wafv2_web_acl" "main" {
  name        = "waf-${local.naming_suffix}"
  description = "Example of a managed rule."
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "waf-${local.naming_suffix}"
    priority = 1

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "waf-${local.naming_suffix}"
        vendor_name = "AWS"

        rule_action_override {
          action_to_use {
            count {}
          }

          name = "waf-${local.naming_suffix}"
        }

        rule_action_override {
          action_to_use {
            count {}
          }

          name = "waf-${local.naming_suffix}"
        }

        scope_down_statement {
          geo_match_statement {
            country_codes = ["US", "NL"]
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "friendly-rule-metric-name"
      sampled_requests_enabled   = false
    }
  }

  tags = var.tags

  token_domains = ["mywebsite.com", "myotherwebsite.com"]

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "friendly-metric-name"
    sampled_requests_enabled   = false
  }
}