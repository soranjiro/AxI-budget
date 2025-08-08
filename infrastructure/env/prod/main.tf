# Core System Module
# This module includes DynamoDB, Lambda, S3, CloudFront, and API Gateway

# First, we need to create the module without circular dependencies
locals {
  s3_bucket_name      = "${var.project_name}-${var.environment}-static-website"
  s3_website_endpoint = "${var.project_name}-${var.environment}-static-website.s3-website-${var.aws_region}.amazonaws.com"
}

module "core_system" {
  source = "../../modules/common/core_system"

  # Common variables
  project_name = var.project_name
  environment  = var.environment

  # DynamoDB configuration
  dynamodb_billing_mode      = "PAY_PER_REQUEST"
  enable_deletion_protection = true # Enable protection for production

  # Lambda configuration
  lambda_timeout = 30

  # S3 and CloudFront configuration
  s3_bucket_name         = local.s3_bucket_name
  s3_website_endpoint    = local.s3_website_endpoint
  cloudfront_price_class = "PriceClass_All" # Use all edge locations for production
}

# Outputs
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

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.core_system.s3_bucket_name
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.core_system.cloudfront_domain_name
}

output "lambda_function_url" {
  description = "Lambda function URL for direct HTTP access"
  value       = module.core_system.lambda_function_url
}
