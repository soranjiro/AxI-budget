# AWS Organizations Account Management
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

# 既存の組織を取得
data "aws_organizations_organization" "main" {}

# OUの取得（既存の場合）
data "aws_organizations_organizational_units" "root" {
  parent_id = data.aws_organizations_organization.main.roots[0].id
}

locals {
  # 組織のルートID
  root_id = data.aws_organizations_organization.main.roots[0].id

  # 既存のアカウント情報
  existing_accounts = {
    for account in data.aws_organizations_organization.main.accounts :
    account.name => {
      id    = account.id
      name  = account.name
      email = account.email
    }
  }
}
