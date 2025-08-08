# AWS Organizations アカウント管理

このモジュールは、AWS OrganizationsでのAWSアカウント管理を自動化します。

## 機能

- 複数AWSアカウントの作成と管理
- Organizational Units (OU) の構成
- Service Control Policies (SCP) の適用
- アカウントのOUへの配置

## 使用方法

### 1. 初期設定

```bash
cd terraform/aws-accounts
terraform init
```

### 2. 設定確認

```bash
terraform plan
```

### 3. 適用

```bash
terraform apply
```

## 設定項目

### variables.tf

- `accounts`: 作成するAWSアカウントの定義
- `organizational_units`: OU構成
- `service_control_policies`: 適用するSCP

### 実際の運用での注意点

1. **メールアドレス**: 各アカウントに固有のメールアドレスが必要
2. **アカウント削除**: `prevent_destroy = true` により削除が保護されています
3. **請求設定**: IAMユーザーから請求情報へのアクセス制御

## セキュリティ設定

### 推奨SCP

- ルートユーザーアクセスの制限
- MFA必須化
- 特定リージョンでの操作制限

詳細は `terraform.tfvars.example` を参照してください。
