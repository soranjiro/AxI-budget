// ユースケース実装

use crate::domain::entities::*;
use crate::domain::services::*;
use crate::domain::repositories::*;
use anyhow::Result;

/// ユーザー管理ユースケース
pub struct UserUseCase<R: UserRepository> {
    user_service: UserService<R>,
}

impl<R: UserRepository> UserUseCase<R> {
    pub fn new(user_service: UserService<R>) -> Self {
        Self { user_service }
    }

    pub async fn get_user_profile(&self, user_id: &str) -> Result<Option<UserProfile>> {
        self.user_service.get_user(user_id).await
    }

    pub async fn create_user(&self, user: UserProfile) -> Result<()> {
        self.user_service.create_user(user).await
    }
}

/// 取引管理ユースケース
pub struct TransactionUseCase<R: TransactionRepository> {
    transaction_service: TransactionService<R>,
}

impl<R: TransactionRepository> TransactionUseCase<R> {
    pub fn new(transaction_service: TransactionService<R>) -> Self {
        Self { transaction_service }
    }

    pub async fn get_transactions(&self, user_id: &str) -> Result<Vec<Transaction>> {
        self.transaction_service.get_transactions(user_id).await
    }

    pub async fn create_transaction(&self, transaction: Transaction) -> Result<()> {
        self.transaction_service.create_transaction(transaction).await
    }

    pub async fn update_transaction(&self, transaction: Transaction) -> Result<()> {
        self.transaction_service.update_transaction(transaction).await
    }

    pub async fn delete_transaction(&self, transaction_id: &str) -> Result<()> {
        self.transaction_service.delete_transaction(transaction_id).await
    }
}

/// 予算管理ユースケース
pub struct BudgetUseCase<R: BudgetRepository> {
    budget_service: BudgetService<R>,
}

impl<R: BudgetRepository> BudgetUseCase<R> {
    pub fn new(budget_service: BudgetService<R>) -> Self {
        Self { budget_service }
    }

    pub async fn get_budgets(&self, user_id: &str) -> Result<Vec<Budget>> {
        self.budget_service.get_budgets(user_id).await
    }

    pub async fn create_budget(&self, budget: Budget) -> Result<()> {
        self.budget_service.create_budget(budget).await
    }

    pub async fn update_budget(&self, budget: Budget) -> Result<()> {
        self.budget_service.update_budget(budget).await
    }

    pub async fn delete_budget(&self, budget_id: &str) -> Result<()> {
        self.budget_service.delete_budget(budget_id).await
    }
}
