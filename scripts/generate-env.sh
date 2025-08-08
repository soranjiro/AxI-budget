#!/bin/bash

# Terraformアウトプットから環境変数ファイルを生成するスクリプト
set -e

# 引数チェック
ENVIRONMENT=${1:-stg}
AWS_PROFILE=${2:-axi-budget-${ENVIRONMENT}}

if [ "$ENVIRONMENT" != "stg" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "Error: Environment must be 'stg' or 'prod'"
    echo "Usage: $0 <environment> [aws_profile]"
    exit 1
fi

echo "🔧 Generating environment variables for ${ENVIRONMENT} environment..."

# プロジェクトルートに移動
cd "$(dirname "$0")/.."

# Terraformディレクトリ
TERRAFORM_DIR="terraform/env/${ENVIRONMENT}/core_system"

if [ ! -d "$TERRAFORM_DIR" ]; then
    echo "Error: Terraform directory $TERRAFORM_DIR not found"
    exit 1
fi

cd "$TERRAFORM_DIR"

echo "📊 Fetching Terraform outputs..."

# Terraformアウトプットを取得
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name 2>/dev/null || echo "")
LAMBDA_URL=$(terraform output -raw lambda_function_url 2>/dev/null || echo "")
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id 2>/dev/null || echo "")
COGNITO_CLIENT_ID=$(terraform output -raw cognito_user_pool_client_id 2>/dev/null || echo "")
COGNITO_IDENTITY_POOL_ID=$(terraform output -raw cognito_identity_pool_id 2>/dev/null || echo "")
COGNITO_DOMAIN_ENDPOINT=$(terraform output -raw cognito_domain 2>/dev/null || echo "")

# プロジェクトルートに戻る
cd - > /dev/null

# 環境変数ファイルの生成
ENV_FILE="frontend/.env.${ENVIRONMENT}"

echo "📝 Writing environment variables to $ENV_FILE..."

cat > "$ENV_FILE" << EOF
# ${ENVIRONMENT} 環境用の環境変数
# このファイルは自動生成されました - $(date)

# AWS Cognito設定
VITE_COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
VITE_COGNITO_USER_POOL_CLIENT_ID=${COGNITO_CLIENT_ID}
VITE_COGNITO_IDENTITY_POOL_ID=${COGNITO_IDENTITY_POOL_ID}
VITE_COGNITO_DOMAIN=${COGNITO_DOMAIN_ENDPOINT}

# アプリケーションURL（CloudFrontドメイン）
VITE_APP_URL=https://${CLOUDFRONT_DOMAIN}

# API エンドポイント（Lambda Function URL）
VITE_API_ENDPOINT=${LAMBDA_URL}

# AWS リージョン
VITE_AWS_REGION=ap-northeast-1

# 環境識別子
VITE_ENVIRONMENT=${ENVIRONMENT}
EOF

echo "✅ Environment variables file generated successfully!"
echo "📍 File location: $ENV_FILE"
echo ""
echo "🔗 URLs:"
echo "   CloudFront: https://${CLOUDFRONT_DOMAIN}"
echo "   API Endpoint: ${LAMBDA_URL}"
echo ""
echo "💡 Next steps:"
echo "   1. Review the generated .env file"
echo "   2. Run the deployment script: ./scripts/deploy-frontend.sh ${ENVIRONMENT}"
