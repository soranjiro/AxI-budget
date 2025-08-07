// リポジトリインターフェース
// データアクセス層の抽象化

use crate::domain::entities::*;
use anyhow::Result;
use async_trait::async_trait;

/// ユーザーリポジトリトレイト
#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn find_by_id(&self, user_id: &str) -> Result<Option<UserProfile>>;
    async fn save(&self, user: UserProfile) -> Result<()>;
    async fn update(&self, user: UserProfile) -> Result<()>;
    async fn delete(&self, user_id: &str) -> Result<()>;
}

/// 取引リポジトリトレイト
#[async_trait]
pub trait TransactionRepository: Send + Sync {
    async fn find_by_id(&self, transaction_id: &str) -> Result<Option<Transaction>>;
    async fn find_by_user_id(&self, user_id: &str) -> Result<Vec<Transaction>>;
    async fn save(&self, transaction: Transaction) -> Result<()>;
    async fn update(&self, transaction: Transaction) -> Result<()>;
    async fn delete(&self, transaction_id: &str) -> Result<()>;
}

/// 予算リポジトリトレイト
#[async_trait]
pub trait BudgetRepository: Send + Sync {
    async fn find_by_id(&self, budget_id: &str) -> Result<Option<Budget>>;
    async fn find_by_user_id(&self, user_id: &str) -> Result<Vec<Budget>>;
    async fn save(&self, budget: Budget) -> Result<()>;
    async fn update(&self, budget: Budget) -> Result<()>;
    async fn delete(&self, budget_id: &str) -> Result<()>;
}

/// グループリポジトリトレイト
#[async_trait]
pub trait GroupRepository: Send + Sync {
    async fn find_by_id(&self, group_id: &str) -> Result<Option<Group>>;
    async fn find_by_user_id(&self, user_id: &str) -> Result<Vec<Group>>;
    async fn save(&self, group: Group) -> Result<()>;
    async fn update(&self, group: Group) -> Result<()>;
    async fn delete(&self, group_id: &str) -> Result<()>;
}
