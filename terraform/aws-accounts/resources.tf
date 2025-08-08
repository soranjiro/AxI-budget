# Organizational Units の作成
resource "aws_organizations_organizational_unit" "this" {
  for_each = var.organizational_units

  name      = each.value.name
  parent_id = each.value.parent_id != null ? each.value.parent_id : local.root_id

  tags = {
    Name = each.value.name
  }
}

# AWS アカウントの作成
resource "aws_organizations_account" "this" {
  for_each = var.accounts

  name                       = each.value.name
  email                      = each.value.email
  iam_user_access_to_billing = each.value.iam_user_access_to_billing
  close_on_deletion          = each.value.close_on_deletion
  create_govcloud            = each.value.create_govcloud
  role_name                  = each.value.role_name

  tags = merge(
    {
      Name      = each.value.name
      Project   = var.project_name
      ManagedBy = "terraform"
    },
    each.value.tags
  )

  # アカウント作成には時間がかかるため
  lifecycle {
    prevent_destroy = true
  }
}

# アカウントをOUに移動
resource "aws_organizations_organizational_unit_account" "this" {
  for_each = {
    for key, account in var.accounts : key => account
    if account.organizational_unit != null
  }

  account_id             = aws_organizations_account.this[each.key].id
  organizational_unit_id = aws_organizations_organizational_unit.this[each.value.organizational_unit].id

  depends_on = [
    aws_organizations_account.this,
    aws_organizations_organizational_unit.this
  ]
}

# Service Control Policies の作成
resource "aws_organizations_policy" "scp" {
  for_each = var.service_control_policies

  name        = each.value.name
  description = each.value.description
  content     = each.value.policy
  type        = "SERVICE_CONTROL_POLICY"

  tags = {
    Name = each.value.name
  }
}

# Service Control Policies の適用
resource "aws_organizations_policy_attachment" "scp" {
  for_each = {
    for combo in flatten([
      for policy_key, policy_value in var.service_control_policies : [
        for target in policy_value.targets : {
          policy_key = policy_key
          target     = target
          key        = "${policy_key}-${target}"
        }
      ]
    ]) : combo.key => combo
  }

  policy_id = aws_organizations_policy.scp[each.value.policy_key].id
  target_id = contains(keys(var.accounts), each.value.target) ? aws_organizations_account.this[each.value.target].id : aws_organizations_organizational_unit.this[each.value.target].id

  depends_on = [
    aws_organizations_policy.scp,
    aws_organizations_account.this,
    aws_organizations_organizational_unit.this
  ]
}
