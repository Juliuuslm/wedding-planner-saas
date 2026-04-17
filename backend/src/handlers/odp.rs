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
    models::odp::{CreateOdp, Odp, UpdateOdp},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/odps", axum::routing::post(create_odp))
        .route("/odps/{id}", get(get_odp).put(update_odp))
        .route("/events/{id}/odps", get(list_by_evento))
}

async fn create_odp(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreateOdp>,
) -> Result<(StatusCode, Json<Odp>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Odp>(
        r#"INSERT INTO odp (planner_id, evento_id, proveedor_id, descripcion, monto, fecha, estado, requerimientos, notas)
           VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'pendiente'), $8, $9)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(body.evento_id)
    .bind(body.proveedor_id)
    .bind(&body.descripcion)
    .bind(body.monto)
    .bind(body.fecha)
    .bind(&body.estado)
    .bind(&body.requerimientos)
    .bind(&body.notas)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_odp(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Odp>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Odp>(
        "SELECT * FROM odp WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("ODP {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_odp(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateOdp>,
) -> Result<Json<Odp>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Odp>(
        r#"UPDATE odp SET
            proveedor_id = COALESCE($1, proveedor_id),
            descripcion = COALESCE($2, descripcion),
            monto = COALESCE($3, monto),
            fecha = COALESCE($4, fecha),
            estado = COALESCE($5, estado),
            requerimientos = COALESCE($6, requerimientos),
            notas = COALESCE($7, notas)
           WHERE id = $8 AND planner_id = $9
           RETURNING *"#,
    )
    .bind(body.proveedor_id)
    .bind(&body.descripcion)
    .bind(body.monto)
    .bind(body.fecha)
    .bind(&body.estado)
    .bind(&body.requerimientos)
    .bind(&body.notas)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("ODP {} not found", id)))?;
    Ok(Json(rec))
}

async fn list_by_evento(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Odp>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Odp>(
        "SELECT * FROM odp WHERE evento_id = $1 AND planner_id = $2 ORDER BY fecha ASC",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}
