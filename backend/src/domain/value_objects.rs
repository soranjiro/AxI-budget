use serde::{Deserialize, Serialize};
use std::fmt;

/// 金額を表す値オブジェクト
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Amount {
    /// 金額（最小単位）
    pub value: i64,
    /// 通貨コード
    pub currency: String,
}

impl Amount {
    pub fn new(value: i64, currency: String) -> Self {
        Self { value, currency }
    }

    pub fn jpy(value: i64) -> Self {
        Self::new(value, "JPY".to_string())
    }

    pub fn add(&self, other: &Amount) -> Result<Amount, String> {
        if self.currency != other.currency {
            return Err(format!(
                "Currency mismatch: {} != {}",
                self.currency, other.currency
            ));
        }
        Ok(Amount::new(
            self.value + other.value,
            self.currency.clone(),
        ))
    }

    pub fn subtract(&self, other: &Amount) -> Result<Amount, String> {
        if self.currency != other.currency {
            return Err(format!(
                "Currency mismatch: {} != {}",
                self.currency, other.currency
            ));
        }
        Ok(Amount::new(
            self.value - other.value,
            self.currency.clone(),
        ))
    }

    pub fn is_positive(&self) -> bool {
        self.value > 0
    }

    pub fn is_negative(&self) -> bool {
        self.value < 0
    }

    pub fn is_zero(&self) -> bool {
        self.value == 0
    }
}

impl fmt::Display for Amount {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self.currency.as_str() {
            "JPY" => write!(f, "¥{}", self.value),
            "USD" => write!(f, "${:.2}", self.value as f64 / 100.0),
            _ => write!(f, "{} {}", self.value, self.currency),
        }
    }
}

/// ユーザーIDを表す値オブジェクト
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct UserId(pub String);

impl UserId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for UserId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// 取引IDを表す値オブジェクト
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TransactionId(pub String);

impl TransactionId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn generate() -> Self {
        Self(uuid::Uuid::new_v4().to_string())
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

/// グループIDを表す値オブジェクト
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct GroupId(pub String);

impl GroupId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn generate() -> Self {
        Self(uuid::Uuid::new_v4().to_string())
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_amount_operations() {
        let amount1 = Amount::jpy(1000);
        let amount2 = Amount::jpy(500);

        let sum = amount1.add(&amount2).unwrap();
        assert_eq!(sum.value, 1500);

        let diff = amount1.subtract(&amount2).unwrap();
        assert_eq!(diff.value, 500);

        assert!(amount1.is_positive());
        assert!(!amount1.is_negative());
        assert!(!amount1.is_zero());

        let zero = Amount::jpy(0);
        assert!(zero.is_zero());
    }

    #[test]
    fn test_amount_currency_mismatch() {
        let jpy = Amount::jpy(1000);
        let usd = Amount::new(1000, "USD".to_string());

        assert!(jpy.add(&usd).is_err());
        assert!(jpy.subtract(&usd).is_err());
    }
}
