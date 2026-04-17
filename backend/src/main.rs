#![allow(dead_code)]

mod config;
mod error;
mod handlers;
mod middleware;
mod models;
mod services;

use axum::{middleware as axum_middleware, Router};
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use crate::config::AppConfig;
use crate::error::AppError;

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: Option<PgPool>,
    pub config: AppConfig,
}

impl AppState {
    pub fn pool(&self) -> Result<&PgPool, AppError> {
        self.db
            .as_ref()
            .ok_or_else(|| AppError::Internal("Database not available".into()))
    }
}

#[tokio::main]
async fn main() {
    // Load .env file if present
    let _ = dotenvy::dotenv();

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info,weddingsaas_backend=debug")),
        )
        .init();

    let config = AppConfig::from_env();
    let port = config.port;

    // Attempt to connect to the database, but allow startup without it
    let db = match config::create_db_pool(&config.database_url).await {
        Ok(pool) => {
            tracing::info!("Connected to database");

            // Run migrations
            match sqlx::migrate!("./migrations").run(&pool).await {
                Ok(_) => tracing::info!("Database migrations applied successfully"),
                Err(err) => tracing::error!("Failed to apply migrations: {}", err),
            }

            Some(pool)
        }
        Err(err) => {
            tracing::warn!(
                "Could not connect to database: {}. Running without DB.",
                err
            );
            None
        }
    };

    let state = AppState { db, config: config.clone() };

    // CORS — permissive for MVP demo
    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods(tower_http::cors::Any)
        .allow_headers(tower_http::cors::Any);

    // Build router
    let api_router = Router::new()
        .merge(handlers::health::router())
        .merge(handlers::clientes::router())
        .merge(handlers::eventos::router())
        .merge(handlers::presupuesto::router())
        .merge(handlers::tareas::router())
        .merge(handlers::proveedores::router())
        .merge(handlers::contratos::router())
        .merge(handlers::planner::router())
        .merge(handlers::paquetes::router())
        .merge(handlers::odp::router())
        .layer(axum_middleware::from_fn(middleware::auth::auth_middleware));

    let app = Router::new()
        .nest("/api", api_router)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
