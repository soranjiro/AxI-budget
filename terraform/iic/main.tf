# AWS IAM Identity Center (旧AWS SSO) 設定
# 組織のマスターアカウントで実行する必要があります

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider設定 - 管理アカウント（マスターアカウント）用
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = "management"
      ManagedBy   = "terraform"
      Owner       = var.owner
    }
  }
}

# IAM Identity Center インスタンス情報を取得
data "aws_ssoadmin_instances" "main" {}

# 既存のAWSアカウント情報を取得（組織から）
data "aws_organizations_organization" "main" {}

locals {
  sso_instance_arn  = tolist(data.aws_ssoadmin_instances.main.arns)[0]
  identity_store_id = tolist(data.aws_ssoadmin_instances.main.identity_store_ids)[0]

  # 組織内のアカウント情報をマップ形式で整理
  organization_accounts = {
    for account in data.aws_organizations_organization.main.accounts :
    account.name => {
      id    = account.id
      name  = account.name
      email = account.email
    }
  }
}
