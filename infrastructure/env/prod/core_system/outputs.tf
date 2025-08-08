# Core System Outputs
output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = module.core_system.dynamodb_table_arn
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.core_system.dynamodb_table_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.core_system.lambda_function_arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.core_system.lambda_function_name
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.core_system.s3_bucket_name
}

output "s3_website_endpoint" {
  description = "S3 website endpoint"
  value       = module.core_system.s3_website_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.core_system.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.core_system.cloudfront_domain_name
}

output "lambda_function_url" {
  description = "Lambda function URL for direct HTTP access"
  value       = module.core_system.lambda_function_url
}

# Cognito Outputs
output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.cognito.user_pool_client_id
}

output "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID"
  value       = module.cognito.identity_pool_id
}

output "cognito_domain" {
  description = "Cognito domain endpoint"
  value       = module.cognito.cognito_domain_endpoint
}
