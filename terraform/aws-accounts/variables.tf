# Variables for AWS Organizations Account Management

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS profile to use for authentication"
  type        = string
  default     = "axi-budget-management"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "axi-budget"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "axi-budget-team"
}

variable "organizational_units" {
  description = "Organizational Units to create"
  type = map(object({
    name      = string
    parent_id = optional(string) # root OUの場合はnull
  }))
  default = {
    workloads = {
      name      = "Workloads"
      parent_id = null # root配下
    }
    security = {
      name      = "Security"
      parent_id = null # root配下
    }
  }
}

variable "accounts" {
  description = "AWS accounts to create or manage"
  type = map(object({
    name                       = string
    email                      = string
    organizational_unit        = optional(string, "workloads")
    iam_user_access_to_billing = optional(string, "ALLOW")
    close_on_deletion          = optional(bool, false)
    create_govcloud            = optional(bool, false)
    role_name                  = optional(string, "OrganizationAccountAccessRole")
    tags                       = optional(map(string), {})
  }))
  default = {
    prod = {
      name                = "axi-budget-prod"
      email               = "axi-budget-prod@example.com"
      organizational_unit = "workloads"
      tags = {
        Environment = "production"
        Workload    = "axi-budget"
      }
    }
    stg = {
      name                = "axi-budget-stg"
      email               = "axi-budget-stg@example.com"
      organizational_unit = "workloads"
      tags = {
        Environment = "staging"
        Workload    = "axi-budget"
      }
    }
  }
}

variable "service_control_policies" {
  description = "Service Control Policies to create and attach"
  type = map(object({
    name        = string
    description = string
    policy      = string
    targets     = list(string) # OU名またはアカウント名のリスト
  }))
  default = {}
}
