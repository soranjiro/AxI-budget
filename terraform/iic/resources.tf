# 権限セットの作成
resource "aws_ssoadmin_permission_set" "this" {
  for_each = var.permission_sets

  name             = each.value.name
  description      = each.value.description
  instance_arn     = local.sso_instance_arn
  session_duration = each.value.session_duration

  tags = {
    Name = each.value.name
  }
}

# 管理ポリシーのアタッチ
resource "aws_ssoadmin_managed_policy_attachment" "this" {
  for_each = {
    for combo in flatten([
      for ps_key, ps_value in var.permission_sets : [
        for policy in ps_value.managed_policies : {
          permission_set_key = ps_key
          policy_arn         = policy
          key                = "${ps_key}-${policy}"
        }
      ]
    ]) : combo.key => combo
  }

  instance_arn       = local.sso_instance_arn
  managed_policy_arn = each.value.policy_arn
  permission_set_arn = aws_ssoadmin_permission_set.this[each.value.permission_set_key].arn
}

# インラインポリシーの設定（必要に応じて）
resource "aws_ssoadmin_permission_set_inline_policy" "this" {
  for_each = {
    for key, value in var.permission_sets : key => value
    if value.inline_policy_json != null
  }

  inline_policy      = each.value.inline_policy_json
  instance_arn       = local.sso_instance_arn
  permission_set_arn = aws_ssoadmin_permission_set.this[each.key].arn
}

# ユーザーグループの作成（環境別に自動生成）
resource "aws_identitystore_group" "this" {
  for_each = {
    for combo in flatten([
      for group_key, group_value in var.user_groups : [
        for env in group_value.environments : {
          key          = "${var.project_name}-${env}-${group_key}"
          display_name = "${var.project_name}-${env}-${group_key}"
          description  = "${group_value.description} for ${env} environment"
          group_type   = group_key
          environment  = env
        }
      ]
    ]) : combo.key => combo
  }

  display_name      = each.value.display_name
  description       = each.value.description
  identity_store_id = local.identity_store_id
}

# ユーザーの作成
resource "aws_identitystore_user" "this" {
  for_each = var.users

  identity_store_id = local.identity_store_id

  display_name = "${each.value.given_name} ${each.value.family_name}"
  user_name    = each.key

  name {
    given_name  = each.value.given_name
    family_name = each.value.family_name
  }

  emails {
    value   = each.value.email
    primary = true
    type    = "work"
  }
}

# ユーザーをグループに追加
resource "aws_identitystore_group_membership" "this" {
  for_each = {
    for combo in flatten([
      for user_key, user_value in var.users : [
        for group in user_value.groups : {
          user_key  = user_key
          group_key = group
          key       = "${user_key}-${group}"
        }
      ]
    ]) : combo.key => combo
  }

  identity_store_id = local.identity_store_id
  group_id          = aws_identitystore_group.this[each.value.group_key].group_id
  member_id         = aws_identitystore_user.this[each.value.user_key].user_id
}

# アカウント割り当て（自動生成）
resource "aws_ssoadmin_account_assignment" "this" {
  for_each = {
    for combo in flatten([
      for group_key, group_value in var.user_groups : [
        for env in group_value.environments : [
          for permission_set in group_value.permission_sets : {
            key            = "${var.project_name}-${env}-${group_key}-${permission_set}"
            group_name     = "${var.project_name}-${env}-${group_key}"
            permission_set = permission_set
            account_id     = var.accounts[env].account_id
          }
        ]
      ]
    ]) : combo.key => combo
  }

  instance_arn       = local.sso_instance_arn
  permission_set_arn = aws_ssoadmin_permission_set.this[each.value.permission_set].arn

  principal_id   = aws_identitystore_group.this[each.value.group_name].group_id
  principal_type = "GROUP"

  target_id   = each.value.account_id
  target_type = "AWS_ACCOUNT"

  depends_on = [
    aws_ssoadmin_permission_set.this,
    aws_identitystore_group.this
  ]
}
