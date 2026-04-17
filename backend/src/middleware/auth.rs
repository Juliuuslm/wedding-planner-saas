use axum::{
    extract::Request,
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};
use uuid::Uuid;

use crate::error::AppError;

/// Represents the authenticated user extracted from the JWT token.
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub planner_id: Uuid,
}

/// Middleware that extracts and validates the Bearer token from the Authorization header.
/// For now, it logs the token and passes through with a placeholder planner_id.
/// Real JWT validation will be implemented in Paso 4.
pub async fn auth_middleware(
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .map(|s| s.to_string());

    match auth_header {
        Some(header) if header.starts_with("Bearer ") => {
            let token = &header[7..];
            tracing::debug!("Auth token received: {}...", &token[..token.len().min(10)]);

            // TODO (Paso 4): Validate JWT with Clerk and extract real planner_id
            let planner_id = Uuid::parse_str("a0000000-0000-0000-0000-000000000001")
                .expect("Invalid seed UUID");
            let auth_user = AuthUser { planner_id };

            request.extensions_mut().insert(auth_user);
        }
        _ => {
            tracing::debug!("No auth token provided, using seed planner identity");
            let planner_id = Uuid::parse_str("a0000000-0000-0000-0000-000000000001")
                .expect("Invalid seed UUID");
            let auth_user = AuthUser { planner_id };
            request.extensions_mut().insert(auth_user);
        }
    }

    Ok(next.run(request).await)
}
