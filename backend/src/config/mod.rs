use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
    pub cors_origin: String,
    pub clerk_secret_key: String,
    pub clerk_issuer: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://user:password@localhost:5432/weddingsaas".to_string()),
            port: env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8080),
            cors_origin: env::var("CORS_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:3000".to_string()),
            clerk_secret_key: env::var("CLERK_SECRET_KEY").unwrap_or_default(),
            clerk_issuer: env::var("CLERK_ISSUER").unwrap_or_default(),
        }
    }
}

pub async fn create_db_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await
}
