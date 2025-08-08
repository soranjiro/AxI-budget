# フロントエンドデプロイ手順

## 概要

このプロジェクトではフロントエンドアプリケーションをS3にデプロイし、CloudFront経由で配信します。
APIは直接Lambda Function URLを使用します。

## アーキテクチャ

```
ユーザー → CloudFront → S3 (静的サイト)
            ↓
         Lambda Function URL (API)
```

## セットアップ手順

### 1. インフラのデプロイ

まず、Terraformでインフラをデプロイします：

```bash
# ステージング環境
cd infrastructure/env/stg/core_system
terraform init
terraform plan
terraform apply

# 本番環境
cd infrastructure/env/prod/core_system
terraform init
terraform plan
terraform apply
```

### 2. 環境変数ファイルの生成

Terraformアウトプットから環境変数ファイルを自動生成します：

```bash
# ステージング環境
./scripts/generate-env.sh stg

# 本番環境
./scripts/generate-env.sh prod
```

これにより、`frontend/.env.stg` または `frontend/.env.prod` ファイルが生成されます。

### 3. フロントエンドのデプロイ

環境変数ファイルが生成されたら、フロントエンドをデプロイします：

```bash
# ステージング環境
./scripts/deploy-frontend.sh stg

# 本番環境
./scripts/deploy-frontend.sh prod
```

## 環境変数

以下の環境変数が使用されます：

- `VITE_COGNITO_USER_POOL_ID`: Cognito User Pool ID
- `VITE_COGNITO_USER_POOL_CLIENT_ID`: Cognito User Pool Client ID
- `VITE_COGNITO_IDENTITY_POOL_ID`: Cognito Identity Pool ID
- `VITE_COGNITO_DOMAIN`: Cognito Domain
- `VITE_APP_URL`: アプリケーションURL（CloudFrontドメイン）
- `VITE_API_ENDPOINT`: API エンドポイント（Lambda Function URL）
- `VITE_AWS_REGION`: AWSリージョン
- `VITE_ENVIRONMENT`: 環境識別子（stg/prod）

## デプロイの流れ

1. `frontend/.env.{environment}` ファイルの読み込み
2. `npm ci` で依存関係のインストール
3. `npm run build` でビルド実行
4. S3バケットにファイルをアップロード
   - 静的アセット: 1年間のキャッシュ
   - HTML/manifest/SW: 短いキャッシュ
5. CloudFrontのキャッシュ無効化

## 開発環境

開発環境では、Viteの開発サーバーを使用します：

```bash
cd frontend
npm run dev
```

## トラブルシューティング

### CloudFront Distribution IDが見つからない

Terraformスタック名が正しくない可能性があります。以下で確認してください：

```bash
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
```

### 環境変数が正しく設定されない

`generate-env.sh` スクリプトを再実行してください：

```bash
./scripts/generate-env.sh <environment>
```

### デプロイが失敗する

1. AWSプロファイルが正しく設定されているか確認
2. S3バケットへの書き込み権限があるか確認
3. CloudFrontへのアクセス権限があるか確認

## 注意事項

- `.env.stg` と `.env.prod` ファイルはGitリポジトリにコミットされません
- 本番環境では適切なドメインとSSL証明書の設定を推奨します
- CloudFrontのキャッシュ無効化には時間がかかる場合があります（5-15分）
