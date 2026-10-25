resource "aws_organizations_organizational_unit" "main" {
  name      = "ou-${local.naming_suffix}"
  parent_id = aws_organizations_organization.main.roots[0].id
}