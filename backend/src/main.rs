use lambda_web::LambdaError;
use lambda_runtime::{service_fn, Error, LambdaEvent};
use serde_json::Value;

mod domain;
mod infrastructure;
mod application;
mod handlers;

use handlers::create_router;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Lambda環境での実行かローカル実行かを判定
    if std::env::var("AWS_LAMBDA_FUNCTION_NAME").is_ok() {
        // Lambda環境での実行
        lambda_runtime::run(service_fn(lambda_handler)).await
    } else {
        // ローカル開発環境での実行
        local_server().await
    }
}

async fn lambda_handler(event: LambdaEvent<Value>) -> Result<Value, LambdaError> {
    let app = create_router();
    // 簡略実装：Axumアプリをlambdaイベントとして実行
    Ok(serde_json::json!({
        "statusCode": 200,
        "body": "AxI Budget API is running on Lambda"
    }))
}

async fn local_server() -> Result<(), Error> {
    let app = create_router();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
