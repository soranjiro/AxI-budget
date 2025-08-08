# Outputs for AWS Organizations Account Management

output "organization_id" {
  description = "ID of the AWS Organization"
  value       = data.aws_organizations_organization.main.id
}

output "organization_arn" {
  description = "ARN of the AWS Organization"
  value       = data.aws_organizations_organization.main.arn
}

output "root_id" {
  description = "Root ID of the organization"
  value       = local.root_id
}

output "organizational_units" {
  description = "Created Organizational Units"
  value = {
    for key, ou in aws_organizations_organizational_unit.this : key => {
      id   = ou.id
      arn  = ou.arn
      name = ou.name
    }
  }
}

output "accounts" {
  description = "Created AWS accounts"
  value = {
    for key, account in aws_organizations_account.this : key => {
      id    = account.id
      arn   = account.arn
      name  = account.name
      email = account.email
    }
  }
}

output "existing_accounts" {
  description = "Existing accounts in the organization"
  value       = local.existing_accounts
}

output "service_control_policies" {
  description = "Created Service Control Policies"
  value = {
    for key, policy in aws_organizations_policy.scp : key => {
      id          = policy.id
      arn         = policy.arn
      name        = policy.name
      description = policy.description
    }
  }
}

# 後でIICで使用するためのアカウント情報
output "accounts_for_iic" {
  description = "Account information formatted for IIC configuration"
  value = {
    for key, account in aws_organizations_account.this : key => {
      account_id = account.id
      name       = account.name
      email      = account.email
    }
  }
}
