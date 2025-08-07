// バックエンドサービス層
// ビジネスロジックを実装するサービス群

use crate::domain::entities::*;
use crate::domain::repositories::*;
use anyhow::Result;

/// ユーザーサービス
pub struct UserService<R: UserRepository> {
    repository: R,
}

impl<R: UserRepository> UserService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_user(&self, user_id: &str) -> Result<Option<UserProfile>> {
        self.repository.find_by_id(user_id).await
    }

    pub async fn create_user(&self, user: UserProfile) -> Result<()> {
        self.repository.save(user).await
    }
}

/// 取引サービス
pub struct TransactionService<R: TransactionRepository> {
    repository: R,
}

impl<R: TransactionRepository> TransactionService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_transactions(&self, user_id: &str) -> Result<Vec<Transaction>> {
        self.repository.find_by_user_id(user_id).await
    }

    pub async fn create_transaction(&self, transaction: Transaction) -> Result<()> {
        self.repository.save(transaction).await
    }

    pub async fn update_transaction(&self, transaction: Transaction) -> Result<()> {
        self.repository.update(transaction).await
    }

    pub async fn delete_transaction(&self, transaction_id: &str) -> Result<()> {
        self.repository.delete(transaction_id).await
    }
}

/// 予算サービス
pub struct BudgetService<R: BudgetRepository> {
    repository: R,
}

impl<R: BudgetRepository> BudgetService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_budgets(&self, user_id: &str) -> Result<Vec<Budget>> {
        self.repository.find_by_user_id(user_id).await
    }

    pub async fn create_budget(&self, budget: Budget) -> Result<()> {
        self.repository.save(budget).await
    }

    pub async fn update_budget(&self, budget: Budget) -> Result<()> {
        self.repository.update(budget).await
    }

    pub async fn delete_budget(&self, budget_id: &str) -> Result<()> {
        self.repository.delete(budget_id).await
    }
}
