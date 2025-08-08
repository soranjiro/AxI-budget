# Outputs for Cognito module

# Data sources required for outputs
data "aws_region" "current" {}

output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_endpoint" {
  description = "Cognito User Pool endpoint"
  value       = aws_cognito_user_pool.main.endpoint
}

output "user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.main.id
}

output "identity_pool_id" {
  description = "Cognito Identity Pool ID"
  value       = aws_cognito_identity_pool.main.id
}

output "authenticated_role_arn" {
  description = "IAM role ARN for authenticated users"
  value       = aws_iam_role.authenticated.arn
}

output "unauthenticated_role_arn" {
  description = "IAM role ARN for unauthenticated users"
  value       = aws_iam_role.unauthenticated.arn
}

output "cognito_domain" {
  description = "Cognito User Pool domain"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "cognito_domain_endpoint" {
  description = "Cognito User Pool domain endpoint"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}
