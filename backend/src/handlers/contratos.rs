use axum::{
    extract::{Extension, Path, Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::contrato::{Contrato, CreateContrato, EstadoContrato, TipoContrato, UpdateContrato},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/contracts", get(list_contracts).post(create_contract))
        .route(
            "/contracts/{id}",
            get(get_contract).put(update_contract).delete(delete_contract),
        )
        .route("/events/{evento_id}/contracts", get(list_event_contracts))
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ContractFilters {
    tipo: Option<TipoContrato>,
    estado: Option<EstadoContrato>,
    contraparte_id: Option<Uuid>,
}

async fn list_contracts(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Query(params): Query<ContractFilters>,
) -> Result<Json<Vec<Contrato>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Contrato>(
        r#"SELECT * FROM contracts
           WHERE planner_id = $1
             AND ($2::tipo_contrato IS NULL OR tipo = $2)
             AND ($3::estado_contrato IS NULL OR estado = $3)
             AND ($4::uuid IS NULL OR contraparte_id = $4)
           ORDER BY fecha_creacion DESC"#,
    )
    .bind(auth.planner_id)
    .bind(&params.tipo)
    .bind(&params.estado)
    .bind(params.contraparte_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn list_event_contracts(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
) -> Result<Json<Vec<Contrato>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Contrato>(
        "SELECT * FROM contracts WHERE evento_id = $1 AND planner_id = $2 ORDER BY fecha_creacion DESC",
    )
    .bind(evento_id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_contract(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreateContrato>,
) -> Result<(StatusCode, Json<Contrato>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Contrato>(
        r#"INSERT INTO contracts (planner_id, evento_id, tipo, contraparte, contraparte_id, estado, monto_total)
           VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'borrador'), $7)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(body.evento_id)
    .bind(&body.tipo)
    .bind(&body.contraparte)
    .bind(body.contraparte_id)
    .bind(&body.estado)
    .bind(body.monto_total)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_contract(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Contrato>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Contrato>(
        "SELECT * FROM contracts WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Contract {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_contract(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateContrato>,
) -> Result<Json<Contrato>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Contrato>(
        r#"UPDATE contracts SET
            tipo = COALESCE($1, tipo),
            contraparte = COALESCE($2, contraparte),
            contraparte_id = COALESCE($3, contraparte_id),
            estado = COALESCE($4, estado),
            monto_total = COALESCE($5, monto_total),
            fecha_envio = CASE
                WHEN $4 = 'enviado' AND fecha_envio IS NULL THEN NOW()
                ELSE fecha_envio
            END,
            fecha_firma = CASE
                WHEN $4 = 'firmado' AND fecha_firma IS NULL THEN NOW()
                ELSE fecha_firma
            END
           WHERE id = $6 AND planner_id = $7
           RETURNING *"#,
    )
    .bind(&body.tipo)
    .bind(&body.contraparte)
    .bind(body.contraparte_id)
    .bind(&body.estado)
    .bind(body.monto_total)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Contract {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_contract(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM contracts WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Contract {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}
