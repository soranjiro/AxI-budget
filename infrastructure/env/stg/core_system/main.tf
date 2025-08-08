terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # backend "s3" {
  #   bucket = "axi-budget-terraform-state-stg"
  #   key    = "stg/core_system/terraform.tfstate"
  #   region = "ap-northeast-1"
  # }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Local values
locals {
  # Lambda function name for internal reference
  lambda_function_name = "${var.project_name}-${var.environment}-budget-api"
}

# Core System Resources
module "core_system" {
  source = "../../../modules/common/core_system"

  # Common variables
  project_name = var.project_name
  environment  = var.environment

  # DynamoDB configuration
  dynamodb_billing_mode      = "PAY_PER_REQUEST"
  enable_deletion_protection = false # Disable protection for staging

  # Lambda configuration
  lambda_timeout = 30

  # CloudFront configuration
  cloudfront_price_class = "PriceClass_100" # Use cost-effective settings for staging
}

# Cognito Module
module "cognito" {
  source = "../../../modules/common/cognito"

  # Common variables
  project_name = var.project_name
  environment  = var.environment

  # Cognito configuration
  cognito_callback_urls = var.cognito_callback_urls
  cognito_logout_urls   = var.cognito_logout_urls

  # DynamoDB table ARN for IAM policies
  dynamodb_table_arn = module.core_system.dynamodb_table_arn
}
