# AWS IAM Identity Center 設定

このモジュールは、AWS IAM Identity Center (旧AWS SSO) の設定を自動化します。

## 機能

- 許可セット (Permission Sets) の作成
- グループの作成（環境別自動生成）
- ユーザー管理
- アカウントへのグループ割り当て自動化

## アーキテクチャ

### グループ命名規則

```
{project_name}-{environment}-{role}
```

例：
- `axi-budget-prod-admin`
- `axi-budget-stg-mgmt`
- `axi-budget-prod-readonly`

### 許可セット

| 許可セット | 含まれる権限 | 説明 |
|------------|--------------|------|
| AdministratorAccess | AdministratorAccess | 完全な管理者権限 |
| mgmt | PowerUserAccess + IAMFullAccess | 管理レベル権限 |
| readonlyAccess | ReadOnlyAccess | 読み取り専用権限 |

### 権限マッピング

| グループタイプ | 割り当てられる許可セット |
|----------------|-------------------------|
| admin | AdministratorAccess, mgmt, readonlyAccess |
| mgmt | mgmt, readonlyAccess |
| readonly | readonlyAccess |

## 使用方法

### 1. 設定ファイルの準備

```bash
cd terraform/iic
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` を編集して実際の値を設定：
- メールアドレス
- アカウントID
- ユーザー情報

### 2. 初期化と適用

```bash
terraform init
terraform plan
terraform apply
```

## カスタマイズ

### ユーザーの追加

`terraform.tfvars` でユーザーを定義：

```hcl
users = {
  "john.doe" = {
    given_name  = "John"
    family_name = "Doe"
    email       = "john.doe@example.com"
    groups      = ["axi-budget-prod-mgmt", "axi-budget-stg-admin"]
  }
}
```

### 新しい許可セットの追加

`variables.tf` の `permission_sets` に追加：

```hcl
custom_permission = {
  name             = "CustomPermission"
  description      = "カスタム権限"
  managed_policies = ["arn:aws:iam::aws:policy/CustomPolicy"]
  session_duration = "PT4H"
}
```

## セキュリティ考慮事項

1. **セッション期間**: 役割に応じて適切な期間を設定
2. **MFA**: 高権限アカウントではMFA必須化を推奨
3. **監査**: CloudTrailでアクセスログを監視

## トラブルシューティング

### よくある問題

1. **権限エラー**: 管理アカウントで適切な権限が必要
2. **メール重複**: 既存ユーザーと重複しないメールアドレスを使用
3. **グループ参照エラー**: グループ作成後にユーザー割り当てを実行

### 必要な権限

管理アカウントで以下の権限が必要：
- `sso:*`
- `sso-admin:*`
- `identitystore:*`
- `organizations:*`
