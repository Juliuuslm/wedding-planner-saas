use axum::{
    extract::{Extension, Path, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::paquete::{CreatePaquete, Paquete, UpdatePaquete},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/packages", get(list_packages).post(create_package))
        .route(
            "/packages/{id}",
            get(get_package).put(update_package).delete(delete_package),
        )
}

async fn list_packages(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
) -> Result<Json<Vec<Paquete>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Paquete>(
        "SELECT * FROM packages WHERE planner_id = $1 ORDER BY nombre ASC",
    )
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_package(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreatePaquete>,
) -> Result<(StatusCode, Json<Paquete>), AppError> {
    let pool = state.pool()?;
    let servicios = serde_json::to_value(&body.servicios)
        .unwrap_or(serde_json::Value::Array(vec![]));

    let rec = sqlx::query_as::<_, Paquete>(
        r#"INSERT INTO packages (planner_id, nombre, descripcion, precio, servicios, activo)
           VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE))
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(&body.nombre)
    .bind(&body.descripcion)
    .bind(body.precio)
    .bind(&servicios)
    .bind(body.activo)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_package(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Paquete>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Paquete>(
        "SELECT * FROM packages WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Package {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_package(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdatePaquete>,
) -> Result<Json<Paquete>, AppError> {
    let pool = state.pool()?;
    let servicios = body.servicios
        .as_ref()
        .map(|s| serde_json::to_value(s).unwrap_or(serde_json::Value::Array(vec![])));

    let rec = sqlx::query_as::<_, Paquete>(
        r#"UPDATE packages SET
            nombre = COALESCE($1, nombre),
            descripcion = COALESCE($2, descripcion),
            precio = COALESCE($3, precio),
            servicios = COALESCE($4, servicios),
            activo = COALESCE($5, activo)
           WHERE id = $6 AND planner_id = $7
           RETURNING *"#,
    )
    .bind(&body.nombre)
    .bind(&body.descripcion)
    .bind(body.precio)
    .bind(&servicios)
    .bind(body.activo)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Package {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_package(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM packages WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Package {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}
