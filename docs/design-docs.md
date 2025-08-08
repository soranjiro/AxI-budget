# AxI-budget PWA 設計書

---

## 1. プロジェクト概要

### 1.1 プロダクト名
**AxI-budget (アクシィ・バジェット)** - "流れ"を捉える、次世代スマート家計簿

### 1.2 プロダクト概要
全てのお金の流れを記録しつつ、実際の支出のみを家計管理に反映する革新的なPWA（プログレッシブウェブアプリ）家計簿アプリ。立て替え精算やグループ旅行の割り勘機能も内蔵し、ユーザー登録不要で利用開始できます。

### 1.3 主要機能
*   全トランザクション（取引）の記録・管理
*   実支出（家計に影響のある支出）ベースの家計管理
*   立て替え精算機能
*   グループ精算機能（ユーザー登録不要）
*   予算管理
*   リアルタイムでの精算計算

---

## 2. 開発哲学

本プロジェクトは、高品質で保守性の高いソフトウェアを効率的に開発するため、以下の3つの開発手法を中核的な哲学として採用します。

### 2.1 テスト駆動開発 (TDD - Test-Driven Development)
*   **原則:** ビジネスロジックを実装する前に、そのロジックを検証するためのテストコードを先に書きます。
*   **プロセス:** Red（失敗するテストを書く）→ Green（テストをパスする最小限のコードを書く）→ Refactor（コードをクリーンにする）のサイクルを徹底します。
*   **対象:** 特にバックエンドのドメインロジック、フロントエンドの複雑な状態遷移や計算処理に適用します。

### 2.2 ドメイン駆動設計 (DDD - Domain-Driven Design)
*   **原則:** ビジネスの中心概念（ドメイン）をソフトウェアのモデルの核心に据えます。
*   **実践:**
    *   **ユビキタス言語:** 開発者と企画者が共通の言葉（例: `Transaction` (取引), `Settlement` (精算), `Flow` (お金の移動), `Real` (実支出)）で対話し、それを直接コード（型定義、クラス名、変数名）に反映させます。
    *   **境界づけられたコンテキスト:** 「個人家計簿」「グループ精算」といった明確な境界で責務を分離し、モデルの複雑性を管理します。
    *   **エンティティと値オブジェクト:** IDで識別される`Transaction`（エンティティ）と、属性自体が重要な`Amount`（値オブジェクト）などを明確に区別してモデル化します。

### 2.3 スキーマ駆動開発 (Schema-Driven Development)
*   **原則:** APIの仕様（スキーマ）を最初に定義し、それを信頼できる唯一の情報源（Single Source of Truth）としてフロントエンドとバックエンドの開発を並行して進めます。
*   **実践:**
    *   **OpenAPI (Swagger) Specification:** API Gatewayで定義するAPIのスキーマをOpenAPI 3.0形式で記述します。
    *   **コード自動生成:** スキーマ定義から、フロントエンドのAPIクライアントコード (TypeScript) と、バックエンドのリクエスト/レスポンスの型定義 (Rust) を自動生成します。これにより、手作業による型の不整合を撲滅します。

---

## 3. 技術仕様

### 3.1 技術スタック

| 領域 | 技術 | 目的 |
| :--- | :--- | :--- |
| **フロントエンド** | React 18 + TypeScript | 最新のコンポーネントベースUI開発 |
| | Vite | 高速なビルドと開発環境 |
| | Tailwind CSS | 効率的なユーティリティファーストのスタイリング |
| | Zustand | シンプルで強力な状態管理 |
| | Recharts | データの可視化、グラフ表示（棒グラフ、円グラフ、線グラフ、プログレスバー） |
| | IndexedDB | 大容量ローカルデータストレージ（トランザクション処理対応） |
| **PWA関連** | Workbox | Service Workerの管理とオフライン対応 |
| | Web App Manifest | ホーム画面へのインストール対応 |
| **バックエンド** | AWS Lambda (Rust + Axum) | サーバーレスHTTP API（開発済み、API Gateway未使用） |
| **データベース** | Amazon DynamoDB | 高スケーラビリティを持つNoSQLデータベース（基盤準備済み） |
| **API** | Direct Lambda Invocation | 直接Lambda関数呼び出し（API Gateway未実装） |
| **インフラ** | Amazon S3 / CloudFront | 静的ファイルのホスティングと高速配信 (CDN) |
| **Infrastructure as Code** | terraform | AWSリソースのコード管理 |
| **CI/CD** | GitHub Actions | 自動ビルド、テスト、デプロイ |
| **認証** | AWS Cognito (匿名認証) | ユーザー登録不要のセキュアな認証 |
| **その他** | OpenAPI, Playwright | スキーマ定義、E2Eテスト |

### 3.2 PWA要件
*   **インストール可能**: ホーム画面への追加（Add to Home Screen）に対応します。
*   **オフライン動作**: Service Workerを利用したキャッシュ戦略により、オフラインでもコア機能が利用可能です。IndexedDBによるローカルデータ永続化で完全なオフライン体験を提供します。
*   **レスポンシブ**: モバイル、タブレット、デスクトップの各デバイスに最適化されたUIを提供します。
*   **高速**: First Contentful Paint (FCP) を2秒未満に抑え、快適なユーザー体験を実現します。
*   **信頼性**: ネットワークが不安定な状況でも、主要な機能が安定して動作します。
*   **ゲストモード**: ユーザー登録なしで全機能が利用可能。データはローカルに安全に保存されます。

### 3.3 ローカルデータストレージ仕様
*   **IndexedDB**: ブラウザの高性能NoSQLデータベースを採用
*   **データベース名**: `AxiBudgetDB` (version 1)
*   **オブジェクトストア**:
    - `transactions`: 取引データ（インデックス: date, category, type, transactionType, budgetId, createdAt）
    - `budgets`: 予算データ（インデックス: category, period, createdAt）
    - `auth`: 認証データ（ゲストユーザー情報、設定など）
*   **容量**: 最大数百MB（ブラウザ依存）
*   **パフォーマンス**: インデックス付きクエリによる高速検索
*   **ACID特性**: トランザクション処理によるデータ整合性保証

---

## 4. アーキテクチャ設計

### 4.1 システム構成図（現在の実装状況）

```
┌─────────────────┐       ┌──────────────────────────────────────────────────────┐
│   PWA Client    │       │                      AWS Cloud                       │
│  (React + TS)   │       │                      (将来実装)                        │
│ ┌─ IndexedDB ───┤       │                                                      │
│ │ ┌─────────────┴─┐     │ ┌─────────────────┐            ┌─────────────────┐   │
│ │ │ Local Storage │     │ │ Amazon S3       │            │ Amazon          │   │
│ │ │ AxiBudgetDB   │     │ │ (Static Files)  │◀─────────▶│ CloudFront      │   │
│ │ │ - transactions│     │ │                 │            │ (CDN)           │   │
│ │ │ - budgets     │     │ └─────────────────┘            └─────────────────┘   │
│ │ │ - auth        │     │                                                      │
│ │ └───────────────┘     │ ┌─────────────────┐            ┌─────────────────┐   │
│ └─ API Client ──────────┤ │ AWS Lambda      │            │ Amazon          │   │
└─────────────────┘       │ │ (Rust + Axum)  │◀─────────▶│ DynamoDB        │   │
         ▲                │ │ (開発準備済み)    │            │ (準備済み)       │   │
         │                │ └─────────────────┘            └─────────────────┘   │
         │ (Guest Mode:   │                                                      │
         │  Local Only)   │ ┌─────────────────┐            ┌─────────────────┐   │
         │                │ │ AWS Cognito     │            │ OpenAPI         │   │
         │ (将来実装:      │ │ (認証準備済み)   │            │ Schema          │   │
         │  Cloud Sync)   │ │                 │            │ (準備済み)       │   │
         └────────────────┤ └─────────────────┘            └─────────────────┘   │
                          └──────────────────────────────────────────────────────┘
```

**現在の実装状況:**
- ✅ **PWAクライアント**: React + TypeScript + IndexedDBによる完全ローカル動作
- ✅ **バックエンド基盤**: Rust + Axum + Lambda対応（HTTP API直接提供）
- ✅ **インフラ基盤**: Terraform + AWS（S3, CloudFront, DynamoDB, Cognito）
- 🔄 **API Gateway**: 未実装（Lambda関数が直接HTTP APIを提供）
- 🔄 **クラウド同期**: 未実装（将来拡張予定）

### 4.2 現在の開発ワークフロー
1.  **[ローカルファースト]** IndexedDBを使用した完全なローカル機能の実装
2.  **[型安全性]** TypeScriptによる厳密な型定義とコンポーネント設計
3.  **[状態管理]** Zustandによる軽量で高性能な状態管理
4.  **[データ永続化]** IndexedDBによる大容量データの非同期処理
5.  **[バックエンド基盤]** Rust + Axum によるHTTP API の実装（Lambda対応）
6.  **[インフラ構築]** Terraformによる AWS リソースの管理

### 4.3 将来のクラウド連携ワークフロー（計画）
1.  **[スキーマ駆動]** 機能要件に基づき、`OpenAPI`スキーマでAPIのエンドポイント、リクエスト、レスポンスを定義
2.  **[スキーマ駆動]** スキーマからフロントエンド用の型定義付きAPIクライアントと、バックエンド用のRustの型定義を**自動生成**
3.  **[TDD/DDD] (バックエンド)**：
    a. `Rust`でドメインロジックの振る舞いを定義する**テストを先に書く**
    b. テストが通るように、ドメインのエンティティやビジネスロジックを実装
    c. コードをクリーンにするリファクタリングを行う
4.  **(フロントエンド)** 自動生成されたAPIクライアントを使い、ローカル機能とクラウド同期機能の統合
5.  **インテグレーション:** バックエンドのLambda関数を直接呼び出し、フロントエンドと結合して動作を検証

### 4.4 ローカルファースト開発アプローチ（現在の実装）
現在の実装では、ローカルファーストのアプローチを採用しています：

1.  **[ローカル優先]** IndexedDBを使用した完全なローカル機能を先行実装
2.  **[型安全性]** TypeScriptによる厳密な型定義とコンポーネント設計
3.  **[状態管理]** Zustandによる軽量で高性能な状態管理
4.  **[データ永続化]** IndexedDBによる大容量データの非同期処理
5.  **[将来拡張性]** クラウド同期機能への移行準備（同一のデータモデル使用）

**技術的実装詳細:**
- **フロントエンド**: Vite + React 18 + TypeScript
- **状態管理**: Zustand with IndexedDB persistence
- **データストレージ**: IndexedDB (AxiBudgetDB)
- **バックエンド**: Rust + Axum + Lambda Runtime
- **インフラ**: Terraform + AWS (S3, CloudFront, DynamoDB, Cognito)

### 4.5 ハイブリッド同期戦略（将来実装）
```
┌─────────────────────────┐    ┌─────────────────────────┐
│     Local (IndexedDB)   │    │      Cloud (DynamoDB)   │
│  ┌─────────────────────┐│    │  ┌─────────────────────┐│
│  │ Primary Data Store  ││◀──▶│  │ Backup & Sync Store ││
│  │ - Transactions      ││    │  │ - User Profile      ││
│  │ - Budgets          ││    │  │ - Cross-device Data ││
│  │ - Local Settings   ││    │  │ - Group Sharing     ││
│  └─────────────────────┘│    │  └─────────────────────┘│
└─────────────────────────┘    └─────────────────────────┘
           ▲                                    ▲
           │                                    │
    ┌──────▼────────┐                  ┌───────▼────────┐
    │ Offline Mode  │                  │ Sync Service   │
    │ (Full Feature)│                  │ (Conflict Res.)│
    └───────────────┘                  └────────────────┘
```

---

## 5. データベース設計

### 5.1 設計思想
DDDの概念を反映し、ローカルとクラウドの両方に対応した二層データベース設計を採用します。ローカルではIndexedDBによる高性能なクライアントサイドストレージ、クラウドではDynamoDBによるシングルテーブルデザインを使用し、両者間でのデータ同期を可能にします。

### 5.2 ローカルデータベース設計 (IndexedDB)

#### 5.2.1 データベース構造
```typescript
// データベース: AxiBudgetDB (version: 1)
interface DatabaseSchema {
  transactions: {
    keyPath: 'id'
    indexes: {
      date: string
      category: string
      type: 'expense' | 'income'
      transactionType: 'personal' | 'advance'
      budgetId?: string
      createdAt: string
    }
  }
  budgets: {
    keyPath: 'id'
    indexes: {
      category: string
      period: 'monthly' | 'yearly'
      createdAt: string
    }
  }
  auth: {
    keyPath: 'key'
    // ゲストユーザー情報、設定、認証状態
  }
}
```

#### 5.2.2 エンティティ設計

**Transaction エンティティ**
```typescript
interface Transaction {
  id: string                           // ユニークID（例: "transaction-1691234567890-abc123"）
  description: string                  // 取引の説明
  amount: number                       // 金額
  category: string                     // カテゴリ（"食費", "交通費", "娯楽費", "生活費", "その他"）
  type: 'expense' | 'income'          // 収支種別
  transactionType: 'personal' | 'advance' // 実支出 or 立て替え
  date: string                        // 取引日（YYYY-MM-DD）
  tags: string[]                      // タグ配列
  budgetId?: string                   // 関連予算ID（オプション）
  createdAt: string                   // 作成日時（ISO 8601）
  updatedAt: string                   // 更新日時（ISO 8601）
}
```

**Budget エンティティ**
```typescript
interface Budget {
  id: string                          // ユニークID（例: "budget-1691234567890-def456"）
  name: string                        // 予算名
  amount: number                      // 予算金額
  category: string                    // 対象カテゴリ
  period: 'monthly' | 'yearly'       // 期間
  spent: number                       // 使用済み金額（計算値）
  createdAt: string                   // 作成日時（ISO 8601）
  updatedAt: string                   // 更新日時（ISO 8601）
}
```

### 5.3 クラウドデータベース設計 (Amazon DynamoDB)

DDDの概念を反映し、シングルテーブルデザインを採用します。パーティションキー（PK）とソートキー（SK）を組み合わせることで、ドメインモデルのエンティティや集約ルートを効率的に表現し、関連データを一度のクエリで取得できるようにします。

#### 5.3.1 DynamoDB スキーマ

| PK (パーティションキー) | SK (ソートキー) | `type` 属性 | 備考 |
| :--- | :--- | :--- | :--- |
| `USER#<UserID>` | `PROFILE` | `UserProfile` | **ユーザー集約ルート**。ユーザーの基本情報。 |
| `USER#<UserID>` | `TX#<Timestamp>#<TxID>` | `Transaction` | ユーザーに属する**取引エンティティ**。 |
| `USER#<UserID>` | `BUDGET#<BudgetID>` | `Budget` | ユーザーが設定した**予算エンティティ**。 |
| `USER#<UserID>` | `SETTLEMENT#<SettlementID>` | `Settlement` | ユーザーに紐づく**精算エンティティ**（立て替えなど）。 |
| `GROUP#<GroupID>` | `PROFILE` | `GroupProfile` | **グループ集約ルート**。グループの基本情報。 |
| `GROUP#<GroupID>` | `MEMBER#<UserID>` | `GroupMember` | グループに参加している**メンバー**。 |
| `GROUP#<GroupID>` | `TX#<Timestamp>#<TxID>` | `GroupTransaction` | グループに属する**共有取引エンティティ**。 |
| `GROUP#<GroupID>` | `SETTLEMENT#<SettlementID>` | `Settlement` | グループに紐づく**精算エンティティ**。 |

#### 5.3.2 データ同期戦略

**同期モード**
1. **ローカルファースト**: 全操作をローカルで実行後、バックグラウンドで同期
2. **競合解決**: Last-Write-Wins（最終書き込み勝利）+ タイムスタンプベース
3. **差分同期**: 変更分のみを同期してトラフィックを最小化

**同期フロー**
```
[Local Operation] → [Local IndexedDB] → [Sync Queue] → [Cloud DynamoDB]
                                    ↓
[Conflict Detection] ← [Merge Strategy] ← [Remote Changes]
```

*   **`type`属性の追加:** 各アイテムの種類を明示する属性を追加。これにより、DynamoDB Streamsなどでデータを処理する際に、アイテムの種類を判別しやすくなります。これはDDDのドメインイベントの概念にも通じます。

---

## 6. 機能仕様

### 6.1 取引管理機能
*   **取引登録:** 金額、説明、カテゴリ、取引種別（実支出/立て替え/グループ）、日付などを入力します。よく使う取引はテンプレートとして保存可能です。
*   **取引一覧・検索:** 期間、種別、カテゴリ、金額範囲などで柔軟にフィルタリング・ソートができます。IndexedDBのインデックスによる高速検索を実現。
*   **非同期処理:** 全ての操作は非同期で実行され、UIブロッキングを回避します。

### 6.2 家計管理機能
*   **月次サマリー:** `Real`（実支出）取引のみを集計し、カテゴリ別の支出グラフや前月比、予算達成度を可視化します。
*   **予算管理:** 月次やカテゴリ別に予算を設定し、使用状況をリアルタイムで追跡。設定した閾値（例：80%）を超えるとアラート通知を行います。
*   **レポート機能:** 月次・年次レポートを生成し、CSVやPDF形式でエクスポートできます。

### 6.3 分析・レポート機能（実装済み）
*   **包括的な分析ダッシュボード:**
    - 概要タブ: 財務状況の全体サマリー
    - 予算分析タブ: 予算対実績の詳細比較とプログレスバー
    - カテゴリ分析タブ: 支出パターンの円グラフ分析
    - トレンド分析タブ: 時系列での月次・日次変化線グラフ
    - 前払い分析タブ: 前払い取引の管理と追跡

*   **高度な統計計算:**
    - 総収入・総支出・残高の自動計算
    - 月間平均値、最大・最小取引額の算出
    - 取引件数の統計情報
    - カテゴリ別支出割合の分析

*   **リアルタイム可視化:**
    - Rechartsライブラリによる美しいグラフ描画
    - 棒グラフ（月次トレンド）、円グラフ（カテゴリ分析）、線グラフ（日次推移）
    - インタラクティブなデータ表示とホバー効果

### 6.4 立て替え精算機能
*   **立て替え登録:** `Flow`（立て替え）取引として記録し、相手と金額を管理します。
*   **精算管理:** 誰にいくら立て替えているか、誰から返済してもらうかを一覧で確認できます。精算が完了したらステータスを更新します。

### 6.5 グループ機能
*   **グループ作成・参加:** ユーザー登録不要でグループを作成し、6桁の参加コードやQRコードでメンバーを招待できます。グループは一定期間（例: 30日）で自動的にアーカイブされます。
*   **グループ取引管理:** グループ内で発生した支出を登録すると、メンバー間でリアルタイムに共有されます。支払い対象者や分割方法（均等、個別設定など）を指定可能です。
*   **最適精算計算:** 債務グラフを利用したアルゴリズムにより、グループ内での送金回数が最小になるような最適な精算プランを自動で計算し提示します。

### 6.6 ゲストモード機能（実装済み）
*   **完全ローカル動作:** ユーザー登録なしで全機能が利用可能
*   **データ永続化:** IndexedDBによる安全なローカルデータ保存
*   **認証フロー:**
    - ゲストユーザーの自動生成（`guest-{timestamp}`形式のID）
    - AWS Cognitoへの後からのアップグレード対応
    - データの継続性保証

### 6.7 PWA機能
*   **オフライン対応:** Service Workerによる完全なオフライン動作
*   **インストール可能:** Add to Home Screen対応
*   **プッシュ通知:** 予算超過アラート（将来実装）
*   **バックグラウンド同期:** ネットワーク復帰時の自動データ同期（将来実装）

---

## 7. テスト仕様

### 7.1 テスト戦略
本プロジェクトはTDDを基本とし、テストピラミッドの各層で品質を保証します。

```
     ▲
    / \
   / ▲ \   <-- E2E Tests (Playwright) - 主要なユーザーストーリーを検証
  / / \ \
 / / ▲ \ \  <-- Integration Tests (Rust + Testcontainers/DynamoDB-Local)
/ / / \ \ \     - Lambda関数とDynamoDBの結合を検証
/ / / ▲ \ \ \
───────────
 Unit Tests   <-- Unit Tests (Rust: ドメインロジック, React: コンポーネント)
(大部分を占める)   - 各関数の振る舞いを個別に、高速に検証 (TDDの主戦場)
```

### 7.2 バックエンドのテスト実践 (Rust)
*   **ユニットテスト:** ドメインモデルの純粋なロジック（例: `Settlement.calculate()`）を、DBなどの外部依存なしでテストします。
*   **インテグレーションテスト:** APIハンドラ（Lambda関数）がリクエストを受け取り、`DynamoDB Local`や`Testcontainers`で起動したテスト用DBと正しく連携できるかを検証します。

### 7.3 フロントエンドのテスト実践 (React)
*   **ユニットテスト (Vitest + React Testing Library):** 状態管理ロジック（Zustandストア）や、UIコンポーネントが与えられたpropsに対して正しく描画されるかをテストします。
*   **IndexedDBテスト:** IndexedDBの操作をモックし、データの永続化とクエリ機能をテストします。
*   **非同期処理テスト:** async/awaitを使用したデータ操作の正常性とエラーハンドリングをテストします。
*   **E2Eテスト (Playwright):** 「ユーザーがログインし、取引を登録し、サマリー画面で支出が増えていることを確認する」といった一連のシナリオをブラウザ上で自動テストします。

### 7.4 IndexedDBテスト戦略
*   **データ整合性テスト:**
    - 取引の追加・更新・削除操作の正確性
    - インデックスベースのクエリパフォーマンス
    - トランザクション処理の原子性
*   **ブラウザ互換性テスト:**
    - Chrome, Firefox, Safari, Edge での IndexedDB 動作確認
    - ストレージ容量制限のテスト
    - 異常終了時のデータ復旧テスト

### 7.5 開発用テストユーティリティ（実装済み）
*   **IndexedDB デバッグツール:**
    ```javascript
    // ブラウザコンソールで利用可能
    indexedDBUtils.logAllData()          // 全データの確認
    indexedDBUtils.importSampleData()    // サンプルデータ生成
    indexedDBUtils.exportData()          // データエクスポート
    indexedDBUtils.clearAllData()        // 全データクリア
    ```
*   **型安全性保証:** TypeScript による完全な型チェック
*   **エラーハンドリング:** 非同期操作の例外処理とフォールバック機能

---

## 8. セキュリティとプライバシー

### 8.1 データ保護
*   **通信の暗号化:** すべての通信はHTTPSによって保護されます。
*   **認証と認可:** AWS Cognitoによる匿名認証を利用し、ユーザーデータへのアクセスを厳格に分離・管理します。

### 8.2 プライバシーへの配慮
*   **個人情報の最小化:** ユーザー登録を必須とせず、匿名IDで機能を識別することで、収集する個人情報を最小限に留めます。
*   **ローカルデータ管理:** ゲストモードでは全データがローカル（IndexedDB）に保存され、外部送信は一切行われません。
*   **データ保持ポリシー:** グループデータは作成から30日が経過すると自動的にアーカイブされます。個人データはユーザー自身が管理・削除できます。
*   **暗号化:** 将来的にはローカルデータの暗号化オプションを提供予定です。

---

## 9. 実装状況と技術詳細

### 9.1 現在の実装状況（2025年8月8日時点）

#### 9.1.1 完了済み機能（フロントエンド）
*   ✅ **PWA基盤**
    - React 18 + TypeScript + Vite セットアップ
    - Tailwind CSS デザインシステム
    - App Router 形式のディレクトリ構造
    - PWA対応（Service Worker, Web App Manifest）

*   ✅ **データ管理システム**
    - IndexedDB 完全実装（`AxiBudgetDB`）
    - Zustand状態管理と永続化
    - 非同期データ操作（CRUD）
    - 型安全なデータアクセス層

*   ✅ **認証システム**
    - ゲストモード（ローカル完結）
    - AWS Cognito連携準備
    - 認証状態の永続化

*   ✅ **コア機能**
    - 取引管理（追加・編集・削除・検索）
    - 予算管理（設定・追跡・進捗表示）
    - ダッシュボード（概要表示）

*   ✅ **分析・レポート機能**
    - 5つの分析タブ（概要・予算・カテゴリ・トレンド・前払い）
    - Recharts による豊富なグラフ表示
    - 統計計算エンジン（`reportAnalyzer.ts`）
    - リアルタイムデータ更新

*   ✅ **開発支援ツール**
    - IndexedDB デバッグユーティリティ
    - サンプルデータ生成機能
    - 型安全性保証

#### 9.1.2 完了済み機能（バックエンド）
*   ✅ **基盤アーキテクチャ**
    - Rust + Axum フレームワーク
    - AWS Lambda ランタイム対応
    - ローカル開発サーバー機能

*   ✅ **ドメイン設計（DDD）**
    - エンティティ定義（Transaction, Budget, User, Group）
    - ドメインサービス実装
    - リポジトリパターン
    - ユースケース層の実装

*   ✅ **HTTP API**
    - RESTful エンドポイント設計
    - Axum ルーター実装
    - JSON シリアライゼーション
    - エラーハンドリング

#### 9.1.3 完了済み機能（インフラ）
*   ✅ **AWS インフラ**
    - Terraform による IaC（Infrastructure as Code）
    - 環境分離（staging/production）
    - モジュール化された構成

*   ✅ **AWSリソース**
    - DynamoDB テーブル設定
    - Lambda 関数デプロイ準備
    - S3 静的ファイルホスティング
    - CloudFront CDN 設定
    - AWS Cognito 認証基盤

#### 9.1.4 実装予定機能
*   🔄 **立て替え精算機能**
    - 精算計算アルゴリズム
    - 多人数間の最適化計算

*   🔄 **グループ機能**
    - グループ作成・招待
    - リアルタイム同期
    - QRコード生成

*   🔄 **クラウド同期機能**
    - フロントエンド・バックエンド統合
    - DynamoDB データ同期
    - 競合解決機能

*   🔄 **API連携**
    - OpenAPI スキーマ実装
    - 型生成の自動化
    - API Gateway 統合（将来的）

### 9.2 技術アーキテクチャ詳細

#### 9.2.1 現在のアーキテクチャ概要
```
Frontend (PWA)     Backend (Prepared)     Infrastructure (Ready)
┌─────────────┐    ┌─────────────────┐    ┌──────────────────┐
│ React + TS  │    │ Rust + Axum    │    │ AWS Resources    │
│ Zustand     │    │ Lambda Runtime  │    │ - S3 + CloudFront│
│ IndexedDB   │    │ DDD/TDD Design  │    │ - DynamoDB       │
│ PWA         │    │ HTTP API        │    │ - Cognito        │
└─────────────┘    └─────────────────┘    │ - Terraform IaC  │
     ▲                      ▲            └──────────────────┘
     │                      │                      ▲
     │(Local-First)         │(Future Integration)  │
     │                      │                      │
     └──────────────────────┴──────────────────────┘
              Will be connected for cloud features
```

#### 9.2.2 IndexedDB実装詳細
```typescript
// データベース構造
const DB_CONFIG: DBConfig = {
  name: 'AxiBudgetDB',
  version: 1,
  stores: [
    {
      name: 'transactions',
      keyPath: 'id',
      indexes: [
        { name: 'date', keyPath: 'date' },
        { name: 'category', keyPath: 'category' },
        { name: 'type', keyPath: 'type' },
        { name: 'transactionType', keyPath: 'transactionType' },
        { name: 'budgetId', keyPath: 'budgetId' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    // ... 他のストア定義
  ]
}
```

#### 9.2.3 状態管理アーキテクチャ
```typescript
// Zustand ストア設計
interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  isInitialized: boolean

  // 非同期操作メソッド
  initStore: () => Promise<void>
  addTransaction: (data: TransactionInput) => Promise<void>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  // クエリメソッド
  getTransactionById: (id: string) => Transaction | undefined
  getTransactionsByDateRange: (start: string, end: string) => Transaction[]
}
```

#### 9.2.4 コンポーネント設計パターン
*   **Feature-based組織化:** 機能ごとのディレクトリ構造
*   **再利用可能コンポーネント:** 共通UIコンポーネントの抽象化
*   **非同期処理対応:** Loading状態とエラーハンドリング
*   **型安全性:** TypeScript による厳密な型定義

#### 9.2.5 バックエンドアーキテクチャ（準備済み）
```rust
// Rust + Axum による HTTP API 実装
pub fn create_router() -> Router {
    Router::new()
        .route("/health", get(health_check))
        .route("/api/users/:user_id", get(get_user))
        .route("/api/transactions", post(create_transaction))
        .route("/api/budgets", post(create_budget))
        // ... 他のエンドポイント
}

// Lambda環境とローカル環境の自動切り替え
#[tokio::main]
async fn main() -> Result<(), Error> {
    if std::env::var("AWS_LAMBDA_FUNCTION_NAME").is_ok() {
        lambda_runtime::run(service_fn(lambda_handler)).await
    } else {
        local_server().await  // http://localhost:3000
    }
}
```

**DDD設計:**
- **エンティティ**: Transaction, Budget, User, Group
- **ドメインサービス**: TransactionService, BudgetService
- **リポジトリ**: DynamoDB連携用インターフェース
- **ユースケース**: アプリケーションロジック

### 9.3 パフォーマンス最適化

#### 9.3.1 IndexedDB最適化
*   **インデックス戦略:** 頻繁なクエリに対する適切なインデックス設計
*   **バッチ処理:** 大量データの効率的な処理
*   **非同期処理:** UIブロッキングの回避

#### 9.3.2 React最適化
*   **メモ化:** React.memo, useMemo, useCallback の適切な使用
*   **仮想化:** 大量リストの効率的な描画（将来実装）
*   **コード分割:** 動的インポートによるバンドルサイズ最適化

### 9.4 開発・デバッグツール

#### 9.4.1 IndexedDB デバッグ機能
開発者は以下のコマンドをブラウザコンソールで実行可能：

```javascript
// 全データの確認
await indexedDBUtils.logAllData()

// サンプルデータの追加
await indexedDBUtils.importSampleData()

// データのエクスポート
const exportedData = await indexedDBUtils.exportData()

// 全データのクリア
await indexedDBUtils.clearAllData()
```

#### 9.4.2 ビルド・開発環境
*   **Vite:** 高速な開発サーバーとビルド
*   **TypeScript:** 厳密な型チェック
*   **ESLint:** コード品質の保証
*   **PWA Plugin:** 自動 Service Worker 生成
