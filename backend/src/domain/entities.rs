use crate::domain::value_objects::*;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// 取引の種別
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionType {
    /// 実支出（家計に影響のある支出）
    Real,
    /// 立て替え（家計に影響のない支出）
    Flow,
}

/// 取引のカテゴリ
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TransactionCategory {
    Food,
    Transportation,
    Utilities,
    Entertainment,
    Healthcare,
    Shopping,
    Education,
    Other,
}

/// 精算情報
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SettlementInfo {
    pub settlement_id: String,
    pub creditor_user_id: UserId,
    pub debtor_user_id: UserId,
    pub status: SettlementStatus,
}

/// 精算のステータス
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum SettlementStatus {
    Pending,
    Completed,
}

/// 取引エンティティ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub transaction_id: TransactionId,
    pub user_id: UserId,
    pub transaction_type: TransactionType,
    pub amount: Amount,
    pub description: String,
    pub category: TransactionCategory,
    pub tags: Vec<String>,
    pub transaction_date: DateTime<Utc>,
    pub settlement_info: Option<SettlementInfo>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Transaction {
    pub fn new(
        user_id: UserId,
        transaction_type: TransactionType,
        amount: Amount,
        description: String,
        category: TransactionCategory,
    ) -> Self {
        let now = Utc::now();
        Self {
            transaction_id: TransactionId::generate(),
            user_id,
            transaction_type,
            amount,
            description,
            category,
            tags: Vec::new(),
            transaction_date: now,
            settlement_info: None,
            created_at: now,
            updated_at: now,
        }
    }

    /// 取引が家計に影響するかどうかを判定
    pub fn affects_budget(&self) -> bool {
        matches!(self.transaction_type, TransactionType::Real)
    }

    /// 取引を更新
    pub fn update(&mut self, description: Option<String>, category: Option<TransactionCategory>) {
        if let Some(desc) = description {
            self.description = desc;
        }
        if let Some(cat) = category {
            self.category = cat;
        }
        self.updated_at = Utc::now();
    }

    /// タグを追加
    pub fn add_tag(&mut self, tag: String) {
        if !self.tags.contains(&tag) {
            self.tags.push(tag);
            self.updated_at = Utc::now();
        }
    }

    /// タグを削除
    pub fn remove_tag(&mut self, tag: &str) {
        self.tags.retain(|t| t != tag);
        self.updated_at = Utc::now();
    }
}

/// ユーザープロフィールエンティティ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub user_id: UserId,
    pub display_name: Option<String>,
    pub currency: String,
    pub timezone: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl UserProfile {
    pub fn new(user_id: UserId) -> Self {
        let now = Utc::now();
        Self {
            user_id,
            display_name: None,
            currency: "JPY".to_string(),
            timezone: "Asia/Tokyo".to_string(),
            created_at: now,
            updated_at: now,
        }
    }

    pub fn update(&mut self, display_name: Option<String>, currency: Option<String>, timezone: Option<String>) {
        if let Some(name) = display_name {
            self.display_name = Some(name);
        }
        if let Some(cur) = currency {
            self.currency = cur;
        }
        if let Some(tz) = timezone {
            self.timezone = tz;
        }
        self.updated_at = Utc::now();
    }
}

/// 予算エンティティ
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Budget {
    pub budget_id: String,
    pub user_id: UserId,
    pub category: TransactionCategory,
    pub amount: Amount,
    pub period: BudgetPeriod,
    pub alert_threshold: f64, // 0.0 - 1.0
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum BudgetPeriod {
    Monthly,
    Yearly,
}

impl Budget {
    pub fn new(
        user_id: UserId,
        category: TransactionCategory,
        amount: Amount,
        period: BudgetPeriod,
        alert_threshold: f64,
    ) -> Self {
        let now = Utc::now();
        Self {
            budget_id: uuid::Uuid::new_v4().to_string(),
            user_id,
            category,
            amount,
            period,
            alert_threshold,
            created_at: now,
            updated_at: now,
        }
    }

    /// 予算に対する使用率を計算
    pub fn calculate_usage_percentage(&self, spent_amount: &Amount) -> Result<f64, String> {
        if self.amount.currency != spent_amount.currency {
            return Err("Currency mismatch".to_string());
        }

        if self.amount.value == 0 {
            return Ok(0.0);
        }

        Ok(spent_amount.value as f64 / self.amount.value as f64)
    }

    /// アラートが必要かどうかを判定
    pub fn should_alert(&self, spent_amount: &Amount) -> Result<bool, String> {
        let usage = self.calculate_usage_percentage(spent_amount)?;
        Ok(usage >= self.alert_threshold)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transaction_creation() {
        let user_id = UserId::new("user123".to_string());
        let amount = Amount::jpy(1000);
        let transaction = Transaction::new(
            user_id.clone(),
            TransactionType::Real,
            amount,
            "Test transaction".to_string(),
            TransactionCategory::Food,
        );

        assert_eq!(transaction.user_id, user_id);
        assert!(transaction.affects_budget());
        assert_eq!(transaction.description, "Test transaction");
    }

    #[test]
    fn test_budget_usage_calculation() {
        let user_id = UserId::new("user123".to_string());
        let budget_amount = Amount::jpy(10000);
        let budget = Budget::new(
            user_id,
            TransactionCategory::Food,
            budget_amount,
            BudgetPeriod::Monthly,
            0.8,
        );

        let spent = Amount::jpy(8000);
        let usage = budget.calculate_usage_percentage(&spent).unwrap();
        assert_eq!(usage, 0.8);

        assert!(budget.should_alert(&spent).unwrap());

        let low_spent = Amount::jpy(5000);
        assert!(!budget.should_alert(&low_spent).unwrap());
    }
}

/// グループエンティティ
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Group {
    pub group_id: String,
    pub name: String,
    pub description: String,
    pub owner_id: UserId,
    pub members: Vec<UserId>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Group {
    pub fn new(name: String, description: String, owner_id: UserId) -> Self {
        let now = Utc::now();
        Self {
            group_id: uuid::Uuid::new_v4().to_string(),
            name,
            description,
            owner_id: owner_id.clone(),
            members: vec![owner_id],
            created_at: now,
            updated_at: now,
        }
    }

    /// メンバーを追加
    pub fn add_member(&mut self, user_id: UserId) {
        if !self.members.contains(&user_id) {
            self.members.push(user_id);
            self.updated_at = Utc::now();
        }
    }

    /// メンバーを削除
    pub fn remove_member(&mut self, user_id: &UserId) {
        if *user_id != self.owner_id {
            self.members.retain(|id| id != user_id);
            self.updated_at = Utc::now();
        }
    }

    /// ユーザーがメンバーかどうかを確認
    pub fn is_member(&self, user_id: &UserId) -> bool {
        self.members.contains(user_id)
    }

    /// ユーザーがオーナーかどうかを確認
    pub fn is_owner(&self, user_id: &UserId) -> bool {
        self.owner_id == *user_id
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transaction_creation() {
        let user_id = UserId::new("user123".to_string());
        let amount = Amount::jpy(1000);
        let transaction = Transaction::new(
            user_id.clone(),
            TransactionType::Real,
            amount,
            "Test transaction".to_string(),
            TransactionCategory::Food,
        );

        assert_eq!(transaction.user_id, user_id);
        assert!(transaction.affects_budget());
        assert_eq!(transaction.description, "Test transaction");
    }

    #[test]
    fn test_budget_usage_calculation() {
        let user_id = UserId::new("user123".to_string());
        let budget_amount = Amount::jpy(10000);
        let budget = Budget::new(
            user_id,
            TransactionCategory::Food,
            budget_amount,
            BudgetPeriod::Monthly,
            0.8,
        );

        let spent = Amount::jpy(8000);
        let usage = budget.calculate_usage_percentage(&spent).unwrap();
        assert_eq!(usage, 0.8);

        assert!(budget.should_alert(&spent).unwrap());

        let low_spent = Amount::jpy(5000);
        assert!(!budget.should_alert(&low_spent).unwrap());
    }

    #[test]
    fn test_group_creation() {
        let owner_id = UserId::new("owner123".to_string());
        let group = Group::new(
            "Test Group".to_string(),
            "A test group".to_string(),
            owner_id.clone(),
        );

        assert_eq!(group.name, "Test Group");
        assert_eq!(group.owner_id, owner_id);
        assert!(group.is_member(&owner_id));
        assert!(group.is_owner(&owner_id));
    }

    #[test]
    fn test_group_member_management() {
        let owner_id = UserId::new("owner123".to_string());
        let member_id = UserId::new("member456".to_string());
        let mut group = Group::new(
            "Test Group".to_string(),
            "A test group".to_string(),
            owner_id.clone(),
        );

        // メンバー追加
        group.add_member(member_id.clone());
        assert!(group.is_member(&member_id));
        assert!(!group.is_owner(&member_id));

        // メンバー削除
        group.remove_member(&member_id);
        assert!(!group.is_member(&member_id));

        // オーナーは削除できない
        group.remove_member(&owner_id);
        assert!(group.is_member(&owner_id));
    }
}
