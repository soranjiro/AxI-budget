# Outputs for AWS IAM Identity Center configuration

output "sso_instance_arn" {
  description = "ARN of the IAM Identity Center instance"
  value       = local.sso_instance_arn
}

output "identity_store_id" {
  description = "ID of the Identity Store"
  value       = local.identity_store_id
}

output "permission_sets" {
  description = "Created permission sets"
  value = {
    for key, ps in aws_ssoadmin_permission_set.this : key => {
      name = ps.name
      arn  = ps.arn
    }
  }
}

output "groups" {
  description = "Created IAM Identity Center groups"
  value = {
    for key, group in aws_identitystore_group.this : key => {
      group_id     = group.group_id
      display_name = group.display_name
    }
  }
}

output "users" {
  description = "Created IAM Identity Center users"
  value = {
    for key, user in aws_identitystore_user.this : key => {
      user_id      = user.user_id
      display_name = user.display_name
    }
  }
  sensitive = true
}

output "account_assignments" {
  description = "Account assignments summary"
  value = {
    for key, assignment in aws_ssoadmin_account_assignment.this : key => {
      account_id     = assignment.target_id
      permission_set = assignment.permission_set_arn
      principal_type = assignment.principal_type
    }
  }
}

output "organization_accounts" {
  description = "Organization accounts information"
  value       = local.organization_accounts
}
