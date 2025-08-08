# AWS CLI Profile Setup Guide

このプロジェクトでは環境ごとに異なるAWS CLIプロファイルを使用します。

## 必要なプロファイル

### 本番環境
- **プロファイル名**: `axi-budget-prod`
- **用途**: 本番環境のAWSリソース管理

### ステージング環境
- **プロファイル名**: `axi-budget-stg`
- **用途**: ステージング環境のAWSリソース管理

## セットアップ手順

### 1. AWS CLIプロファイルの作成

```bash
# ステージング環境用プロファイル
aws configure --profile axi-budget-stg
# AWS Access Key ID [None]: YOUR_STG_ACCESS_KEY
# AWS Secret Access Key [None]: YOUR_STG_SECRET_KEY
# Default region name [None]: ap-northeast-1
# Default output format [None]: json

# 本番環境用プロファイル
aws configure --profile axi-budget-prod
# AWS Access Key ID [None]: YOUR_PROD_ACCESS_KEY
# AWS Secret Access Key [None]: YOUR_PROD_SECRET_KEY
# Default region name [None]: ap-northeast-1
# Default output format [None]: json
```

### 2. プロファイルの確認

```bash
# 設定されたプロファイル一覧を確認
aws configure list-profiles

# 特定のプロファイルの設定を確認
aws configure list --profile axi-budget-stg
aws configure list --profile axi-budget-prod

# プロファイルでアカウント情報を確認
aws sts get-caller-identity --profile axi-budget-stg
aws sts get-caller-identity --profile axi-budget-prod
```

## Terraform実行時の注意事項

### 環境別の実行ディレクトリ

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

### プロファイルのオーバーライド

必要に応じて、実行時にプロファイルを変更できます：

```bash
# variables.tfのデフォルト値を上書き
terraform plan -var="aws_profile=your-custom-profile"
terraform apply -var="aws_profile=your-custom-profile"
```

## セキュリティベストプラクティス

### 1. 認証情報の管理
- **本番環境**: 最小権限の原則に従ったIAMロール/ユーザー
- **ステージング環境**: 開発に必要な権限のみ
- **個人アカウント**: MFAを有効化

### 2. 権限分離
- 本番環境とステージング環境で異なるAWSアカウントの使用を推奨
- 開発者ごとに個別のIAMユーザーを作成

### 3. 認証情報の共有禁止
- `.aws/credentials`ファイルをGitにコミットしない
- 環境変数やCI/CDシステムで管理

## チーム開発での注意事項

### 1. 環境の統一
- 全開発者が同じプロファイル名を使用
- リージョン設定の統一（ap-northeast-1）

### 2. 状態ファイルの管理
- S3バックエンドの設定（production-ready時）
- 状態ファイルのロック機能の活用

### 3. CI/CDでの実行
```bash
# GitHub Actions等でのプロファイル設定例
export AWS_PROFILE=axi-budget-stg
terraform plan
```

## トラブルシューティング

### よくあるエラー

```bash
# プロファイルが見つからない場合
Error: failed to refresh cached credentials

# 解決方法
aws configure list-profiles
aws configure --profile axi-budget-stg
```

### 権限エラーの確認
```bash
# 現在の認証情報を確認
aws sts get-caller-identity --profile axi-budget-stg

# 必要な権限があるかテスト
aws s3 ls --profile axi-budget-stg
```
