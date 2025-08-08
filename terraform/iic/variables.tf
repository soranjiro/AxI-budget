variable "aws_region" {
  description = "AWS リージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS CLI プロファイル名"
  type        = string
  default     = "axi-budget-management"
}

variable "project_name" {
  description = "プロジェクト名"
  type        = string
  default     = "axi-budget"
}

variable "owner" {
  description = "リソースの所有者"
  type        = string
  default     = "axi-budget-team"
}

variable "permission_sets" {
  description = "権限セットの定義"
  type = map(object({
    name               = string
    description        = string
    managed_policies   = list(string)
    inline_policy_json = optional(string)
    session_duration   = optional(string, "PT8H")
  }))
  default = {
    AdministratorAccess = {
      name             = "AdministratorAccess"
      description      = "完全な管理者アクセス権限"
      managed_policies = ["arn:aws:iam::aws:policy/AdministratorAccess"]
      session_duration = "PT8H"
    }
    mgmt = {
      name        = "mgmt"
      description = "管理レベルアクセス権限（PowerUser + IAM Full Access）"
      managed_policies = [
        "arn:aws:iam::aws:policy/PowerUserAccess",
        "arn:aws:iam::aws:policy/IAMFullAccess"
      ]
      session_duration = "PT8H"
    }
    readonlyAccess = {
      name             = "readonlyAccess"
      description      = "読み取り専用アクセス権限"
      managed_policies = ["arn:aws:iam::aws:policy/ReadOnlyAccess"]
      session_duration = "PT4H"
    }
  }
}

variable "user_groups" {
  description = "ユーザーグループの定義"
  type = map(object({
    display_name    = string
    description     = string
    environments    = list(string)
    permission_sets = list(string)
  }))
  default = {
    admin = {
      display_name    = "Administrators"
      description     = "システム管理者グループ"
      environments    = ["prod", "stg"]
      permission_sets = ["AdministratorAccess", "mgmt", "readonlyAccess"]
    }
    mgmt = {
      display_name    = "Management"
      description     = "管理者グループ"
      environments    = ["prod", "stg"]
      permission_sets = ["mgmt", "readonlyAccess"]
    }
    readonly = {
      display_name    = "ReadOnly"
      description     = "閲覧者グループ"
      environments    = ["prod", "stg"]
      permission_sets = ["readonlyAccess"]
    }
  }
}

variable "accounts" {
  description = "AWS アカウントの定義"
  type = map(object({
    account_id = string
    name       = string
    email      = string
  }))
  default = {
    prod = {
      account_id = "123456789012" # 実際のアカウントIDに置き換えてください
      name       = "axi-budget-prod"
      email      = "axi-budget-prod@example.com"
    }
    stg = {
      account_id = "123456789013" # 実際のアカウントIDに置き換えてください
      name       = "axi-budget-stg"
      email      = "axi-budget-stg@example.com"
    }
  }
}

variable "users" {
  description = "IAM Identity Center ユーザーの定義"
  type = map(object({
    given_name  = string
    family_name = string
    email       = string
    groups      = list(string)
  }))
  default   = {}
  sensitive = true
}

variable "account_assignments" {
  description = "アカウント割り当ての定義"
  type = map(object({
    account_id     = string
    permission_set = string
    principal_type = string # "GROUP" or "USER"
    principal_name = string
  }))
  default = {}
}
