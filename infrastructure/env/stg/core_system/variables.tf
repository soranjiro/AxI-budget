variable "project_name" {
  description = "Project name"
  type        = string
  default     = "axi-budget"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "stg"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  type        = string
  default     = "axi-budget-stg"
}

variable "cognito_callback_urls" {
  description = "Cognito callback URLs"
  type        = list(string)
  default     = ["https://stg-your-domain.com", "http://localhost:3000"]
}

variable "cognito_logout_urls" {
  description = "Cognito logout URLs"
  type        = list(string)
  default     = ["https://stg-your-domain.com", "http://localhost:3000"]
}
