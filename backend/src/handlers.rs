// HTTPハンドラー
// API エンドポイントの実装

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::Json,
    routing::{get, post, put, delete},
    Router,
};
use serde_json::{json, Value};
use std::collections::HashMap;

/// ルーターの作成
pub fn create_router() -> Router {
    Router::new()
        .route("/health", get(health_check))
        .route("/api/users/:user_id", get(get_user))
        .route("/api/users", post(create_user))
        .route("/api/users/:user_id/transactions", get(get_transactions))
        .route("/api/transactions", post(create_transaction))
        .route("/api/transactions/:transaction_id", put(update_transaction))
        .route("/api/transactions/:transaction_id", delete(delete_transaction))
        .route("/api/users/:user_id/budgets", get(get_budgets))
        .route("/api/budgets", post(create_budget))
        .route("/api/budgets/:budget_id", put(update_budget))
        .route("/api/budgets/:budget_id", delete(delete_budget))
}

/// ヘルスチェック
async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "message": "AxI Budget API is running"
    }))
}

/// ユーザー取得
async fn get_user(Path(user_id): Path<String>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "user_id": user_id,
        "message": "User retrieval not implemented yet"
    })))
}

/// ユーザー作成
async fn create_user(Json(payload): Json<Value>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "message": "User creation not implemented yet",
        "data": payload
    })))
}

/// 取引一覧取得
async fn get_transactions(
    Path(user_id): Path<String>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "user_id": user_id,
        "params": params,
        "message": "Transaction listing not implemented yet"
    })))
}

/// 取引作成
async fn create_transaction(Json(payload): Json<Value>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "message": "Transaction creation not implemented yet",
        "data": payload
    })))
}

/// 取引更新
async fn update_transaction(
    Path(transaction_id): Path<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "transaction_id": transaction_id,
        "message": "Transaction update not implemented yet",
        "data": payload
    })))
}

/// 取引削除
async fn delete_transaction(Path(transaction_id): Path<String>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "transaction_id": transaction_id,
        "message": "Transaction deletion not implemented yet"
    })))
}

/// 予算一覧取得
async fn get_budgets(
    Path(user_id): Path<String>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "user_id": user_id,
        "params": params,
        "message": "Budget listing not implemented yet"
    })))
}

/// 予算作成
async fn create_budget(Json(payload): Json<Value>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "message": "Budget creation not implemented yet",
        "data": payload
    })))
}

/// 予算更新
async fn update_budget(
    Path(budget_id): Path<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "budget_id": budget_id,
        "message": "Budget update not implemented yet",
        "data": payload
    })))
}

/// 予算削除
async fn delete_budget(Path(budget_id): Path<String>) -> Result<Json<Value>, StatusCode> {
    // 実装予定
    Ok(Json(json!({
        "budget_id": budget_id,
        "message": "Budget deletion not implemented yet"
    })))
}
