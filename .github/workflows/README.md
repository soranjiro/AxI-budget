# AxI-budget CI/CD Workflows

このプロジェクトのCI/CDパイプラインは、モジュラーなワークフロー設計を採用しており、保守性とテストの並列実行を向上させています。

## ワークフロー構造

### 🔄 メインオーケストレーションワークフロー

#### [`ci-cd.yml`](.github/workflows/ci-cd.yml)
- **トリガー**: push (main, develop), pull_request (main)
- **役割**: 他のワークフローを調整し、ブランチに応じたデプロイを実行
- **フロー**:
  ```
  test-frontend ──┐
                  ├── test-e2e
  test-backend ───┘        │
                          │
                          ├── deploy-staging (develop)
                          └── deploy-production (main)
  ```

### 🧪 テストワークフロー

#### [`test-frontend.yml`](.github/workflows/test-frontend.yml)
- **目的**: フロントエンドのテスト、ビルド、成果物のアップロード
- **含まれるチェック**:
  - TypeScript型チェック
  - ESLintによるコード品質チェック
  - Jestユニットテスト
  - Viteビルド
- **成果物**: `frontend-build-{sha}` (ビルド済みアプリ)

#### [`test-backend.yml`](.github/workflows/test-backend.yml)
- **目的**: Rustバックエンドのテスト、ビルド、Lambda パッケージ作成
- **含まれるチェック**:
  - `cargo fmt` フォーマットチェック
  - `cargo clippy` リント
  - `cargo test` ユニットテスト
  - Lambda用クロスコンパイル
- **成果物**: `lambda-deployment-{sha}` (Lambda ZIP)

#### [`test-e2e.yml`](.github/workflows/test-e2e.yml)
- **目的**: Playwrightによるエンドツーエンドテスト
- **前提条件**: フロントエンドビルド成果物
- **機能**:
  - プレビューサーバーの起動
  - 主要ユーザーフローのテスト
  - 失敗時のスクリーンショット/動画保存

### 🚀 デプロイワークフロー

#### [`deploy-stg.yml`](.github/workflows/deploy-stg.yml)
- **トリガー**: develop ブランチへのpush、手動実行
- **環境**: AWS ステージング環境 (dev)
- **フロー**:
  1. Terraformによるインフラ構築/更新
  2. Lambda関数の更新
  3. S3へのフロントエンドデプロイ
  4. CloudFrontキャッシュの無効化
  5. ヘルスチェック

#### [`deploy-prod.yml`](.github/workflows/deploy-prod.yml)
- **トリガー**: main ブランチへのpush、手動実行
- **環境**: AWS 本番環境 (prod)
- **追加機能**:
  - 包括的なスモークテスト
  - デプロイタグの自動生成
  - 失敗時のロールバック手順
  - 削除保護の有効化

## 🔧 手動実行オプション

### ステージングデプロイ
```bash
# GitHub CLIを使用
gh workflow run deploy-stg.yml

# 特定の成果物を指定
gh workflow run deploy-stg.yml \
  -f frontend-artifact=frontend-build-abc123 \
  -f backend-artifact=lambda-deployment-abc123
```

### 本番デプロイ
```bash
# 通常のデプロイ（テスト実行あり）
gh workflow run deploy-prod.yml

# テストスキップ（既存成果物を使用）
gh workflow run deploy-prod.yml -f skip-tests=true
```

## 📁 成果物の命名規則

| 成果物タイプ | 命名パターン | 保持期間 |
|------------|-------------|---------|
| フロントエンドビルド | `frontend-build-{SHA}` | 30日 |
| Lambdaデプロイメント | `lambda-deployment-{SHA}` | 30日 |
| テスト結果 | `*-test-results-{SHA}` | 7日 |
| E2Eレポート | `playwright-report-{SHA}` | 7日 |

## 🌍 環境設定

### 必要なシークレット

#### ステージング (development environment)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

#### 本番 (production environment)
- `AWS_ACCESS_KEY_ID_PROD`
- `AWS_SECRET_ACCESS_KEY_PROD`

### Terraform設定
- **ワークスペース**: `dev` (ステージング), `prod` (本番)
- **状態管理**: リモートS3バックエンド
- **変数**: `environment`, `enable_deletion_protection`

## 🔍 トラブルシューティング

### よくある問題

1. **成果物が見つからない**
   - SHAが正しいか確認
   - 前のジョブが成功しているか確認

2. **Terraformエラー**
   - AWSクレデンシャルの権限を確認
   - ワークスペースの状態を確認

3. **E2Eテスト失敗**
   - フロントエンドビルドが正常か確認
   - ブラウザドライバーの更新

### デバッグ手順

1. **ワークフロー実行の確認**:
   ```bash
   gh run list --workflow=ci-cd.yml
   gh run view <run-id>
   ```

2. **ログの詳細確認**:
   ```bash
   gh run view <run-id> --log
   ```

3. **成果物のダウンロード**:
   ```bash
   gh run download <run-id>
   ```

## 🚀 ワークフローの拡張

新しいワークフローを追加する場合は、以下のパターンに従ってください：

1. 単一責任の原則を守る
2. 再利用可能なワークフローとして設計
3. 適切な入力/出力パラメータを定義
4. 成果物の命名規則に従う
5. エラーハンドリングを含める

## 📝 パフォーマンス最適化

- **並列実行**: フロントエンドとバックエンドのテストを並列実行
- **キャッシュ**: npm、cargo、Terraformのキャッシュを活用
- **条件付き実行**: パス変更に基づく条件付きトリガー
- **成果物の再利用**: テストから本番まで同じビルド成果物を使用
