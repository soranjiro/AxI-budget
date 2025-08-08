#!/bin/bash

# フロントエンドビルド＆デプロイスクリプト
set -e

# 引数チェック
ENVIRONMENT=${1:-stg}
AWS_PROFILE=${2:-axi-budget-${ENVIRONMENT}-mgmt}

if [ "$ENVIRONMENT" != "stg" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "Error: Environment must be 'stg' or 'prod'"
    echo "Usage: $0 <environment> [aws_profile]"
    exit 1
fi

echo "🚀 Starting frontend deployment to ${ENVIRONMENT} environment..."

# プロジェクトルートに移動
cd "$(dirname "$0")/.."

# S3バケット名を決定
PROJECT_NAME="axi-budget"
S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-web-hosting"

echo "📦 Building frontend..."
cd frontend

# 依存関係のインストール
npm ci

# 環境変数ファイルの読み込み
ENV_FILE=".env.${ENVIRONMENT}"
if [ -f "$ENV_FILE" ]; then
    echo "📋 Loading environment variables from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
else
    echo "⚠️  Environment file $ENV_FILE not found. Using default values."
    # デフォルト値の設定
    export VITE_API_ENDPOINT="https://lambda-url-here.lambda-url.ap-northeast-1.on.aws/"
    export VITE_ENVIRONMENT="$ENVIRONMENT"
    export VITE_AWS_REGION="ap-northeast-1"
fi

# ビルド実行
npm run build

echo "📤 Deploying to S3 bucket: $S3_BUCKET..."

# S3にアップロード
aws s3 sync dist/ s3://$S3_BUCKET/ \
    --profile $AWS_PROFILE \
    --delete \
    --exclude "*.map" \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "manifest.json" \
    --exclude "sw.js"

# HTMLファイルは短いキャッシュで上書き
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
    --profile $AWS_PROFILE \
    --cache-control "public, max-age=300"

# Service Worker は短いキャッシュ
if [ -f dist/sw.js ]; then
    aws s3 cp dist/sw.js s3://$S3_BUCKET/sw.js \
        --profile $AWS_PROFILE \
        --cache-control "public, max-age=0, must-revalidate"
fi

# manifest.json も短いキャッシュ
if [ -f dist/manifest.json ]; then
    aws s3 cp dist/manifest.json s3://$S3_BUCKET/manifest.json \
        --profile $AWS_PROFILE \
        --cache-control "public, max-age=300"
fi

echo "🔄 Invalidating CloudFront cache..."

# CloudFront distribution IDを取得
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-core-system \
    --profile $AWS_PROFILE \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && [ "$CLOUDFRONT_DISTRIBUTION_ID" != "None" ]; then
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --profile $AWS_PROFILE
    echo "✅ CloudFront invalidation created for distribution: $CLOUDFRONT_DISTRIBUTION_ID"
else
    echo "⚠️  CloudFront distribution ID not found. Skipping cache invalidation."
fi

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Your application should be available via CloudFront distribution."

# CloudFront URLを表示
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-${ENVIRONMENT}-core-system \
    --profile $AWS_PROFILE \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -n "$CLOUDFRONT_URL" ] && [ "$CLOUDFRONT_URL" != "None" ]; then
    echo "🔗 CloudFront URL: https://$CLOUDFRONT_URL"
fi
