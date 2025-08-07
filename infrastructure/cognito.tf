# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}-user-pool"

  # 匿名認証を有効にするための設定
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # パスワードポリシー
  password_policy {
    minimum_length    = 8
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  # アカウント回復設定
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # ユーザープール設定
  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  # デバイス設定
  device_configuration {
    challenge_required_on_new_device      = false
    device_only_remembered_on_user_prompt = false
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-user-pool"
  }
}

# User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # 認証フロー設定
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_CUSTOM_AUTH"
  ]

  # トークン設定
  access_token_validity  = 60 # 1時間
  id_token_validity      = 60 # 1時間
  refresh_token_validity = 30 # 30日

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  # OAuth設定
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  callback_urls = var.environment == "prod" ? ["https://${var.domain_name}"] : ["http://localhost:3000", "https://${var.project_name}-${var.environment}.s3-website-${var.aws_region}.amazonaws.com"]

  logout_urls = var.environment == "prod" ? ["https://${var.domain_name}"] : ["http://localhost:3000", "https://${var.project_name}-${var.environment}.s3-website-${var.aws_region}.amazonaws.com"]

  # CORS設定
  supported_identity_providers = ["COGNITO"]

  # セキュリティ設定
  prevent_user_existence_errors = "ENABLED"
}

# Identity Pool
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name = "${var.project_name}-${var.environment}-identity-pool"

  allow_unauthenticated_identities = true
  allow_classic_flow               = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.main.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = false
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-identity-pool"
  }
}

# IAM Role for authenticated users
resource "aws_iam_role" "authenticated_role" {
  name = "${var.project_name}-${var.environment}-authenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

# IAM Role for unauthenticated users
resource "aws_iam_role" "unauthenticated_role" {
  name = "${var.project_name}-${var.environment}-unauthenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })
}

# 認証ユーザー用のポリシー
resource "aws_iam_role_policy" "authenticated_policy" {
  name = "${var.project_name}-${var.environment}-authenticated-policy"
  role = aws_iam_role.authenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
      }
    ]
  })
}

# 未認証ユーザー用のポリシー（制限付きアクセス）
resource "aws_iam_role_policy" "unauthenticated_policy" {
  name = "${var.project_name}-${var.environment}-unauthenticated-policy"
  role = aws_iam_role.unauthenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = "${aws_apigatewayv2_api.main.execution_arn}/*/GET/*"
      }
    ]
  })
}

# Identity Pool Role Attachment
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id

  roles = {
    "authenticated"   = aws_iam_role.authenticated_role.arn
    "unauthenticated" = aws_iam_role.unauthenticated_role.arn
  }
}

# Cognito Domain (optional)
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}
