use axum::{
    extract::{Extension, State},
    routing::get,
    Json, Router,
};

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::planner::{Planner, UpdatePlanner},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/planner/me", get(get_me).put(update_me))
}

async fn get_me(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
) -> Result<Json<Planner>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Planner>(
        "SELECT * FROM planners WHERE id = $1 LIMIT 1",
    )
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Planner not found".into()))?;
    Ok(Json(rec))
}

async fn update_me(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<UpdatePlanner>,
) -> Result<Json<Planner>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Planner>(
        r#"UPDATE planners SET
            nombre = COALESCE($1, nombre),
            empresa = COALESCE($2, empresa),
            email = COALESCE($3, email),
            telefono = COALESCE($4, telefono),
            logo = COALESCE($5, logo),
            moneda = COALESCE($6, moneda),
            zona_horaria = COALESCE($7, zona_horaria)
           WHERE id = $8
           RETURNING *"#,
    )
    .bind(&body.nombre)
    .bind(&body.empresa)
    .bind(&body.email)
    .bind(&body.telefono)
    .bind(&body.logo)
    .bind(&body.moneda)
    .bind(&body.zona_horaria)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Planner not found".into()))?;
    Ok(Json(rec))
}
