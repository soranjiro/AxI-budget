// インフラストラクチャ層
// 外部システムとの統合（DynamoDB、AWS等）

pub mod dynamodb;

use crate::domain::entities::*;
use crate::domain::repositories::*;
use anyhow::Result;
use async_trait::async_trait;

/// DynamDBリポジトリ実装のモジュール
pub use dynamodb::*;
