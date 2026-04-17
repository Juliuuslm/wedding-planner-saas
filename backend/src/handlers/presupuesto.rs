use axum::{
    extract::{Extension, Path, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::presupuesto::{CreateLineaPresupuesto, LineaPresupuesto, UpdateLineaPresupuesto},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/events/{evento_id}/budget", get(get_budget))
        .route("/events/{evento_id}/budget/lines", axum::routing::post(create_budget_line))
        .route(
            "/budget/lines/{id}",
            axum::routing::put(update_budget_line).delete(delete_budget_line),
        )
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Presupuesto {
    evento_id: Uuid,
    lineas: Vec<LineaPresupuesto>,
    total_estimado: f64,
    total_real: f64,
    total_pagado: f64,
}

async fn get_budget(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
) -> Result<Json<Presupuesto>, AppError> {
    let pool = state.pool()?;
    let lineas = sqlx::query_as::<_, LineaPresupuesto>(
        "SELECT * FROM budget_items WHERE evento_id = $1 AND planner_id = $2 ORDER BY id",
    )
    .bind(evento_id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    let total_estimado: f64 = lineas.iter().map(|l| l.monto_estimado).sum();
    let total_real: f64 = lineas.iter().map(|l| l.monto_real.unwrap_or(l.monto_estimado)).sum();
    let total_pagado: f64 = lineas.iter().map(|l| l.monto_pagado).sum();

    Ok(Json(Presupuesto {
        evento_id,
        lineas,
        total_estimado,
        total_real,
        total_pagado,
    }))
}

async fn create_budget_line(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
    Json(body): Json<CreateLineaPresupuesto>,
) -> Result<(StatusCode, Json<LineaPresupuesto>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, LineaPresupuesto>(
        r#"INSERT INTO budget_items (planner_id, evento_id, categoria, concepto, proveedor_id, monto_estimado, monto_real, monto_pagado, estado, notas)
           VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 0), COALESCE($9, 'pendiente'), $10)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(evento_id)
    .bind(&body.categoria)
    .bind(&body.concepto)
    .bind(body.proveedor_id)
    .bind(body.monto_estimado)
    .bind(body.monto_real)
    .bind(body.monto_pagado)
    .bind(&body.estado)
    .bind(&body.notas)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn update_budget_line(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateLineaPresupuesto>,
) -> Result<Json<LineaPresupuesto>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, LineaPresupuesto>(
        r#"UPDATE budget_items SET
            categoria = COALESCE($1, categoria),
            concepto = COALESCE($2, concepto),
            proveedor_id = COALESCE($3, proveedor_id),
            monto_estimado = COALESCE($4, monto_estimado),
            monto_real = COALESCE($5, monto_real),
            monto_pagado = COALESCE($6, monto_pagado),
            estado = COALESCE($7, estado),
            notas = COALESCE($8, notas)
           WHERE id = $9 AND planner_id = $10
           RETURNING *"#,
    )
    .bind(&body.categoria)
    .bind(&body.concepto)
    .bind(body.proveedor_id)
    .bind(body.monto_estimado)
    .bind(body.monto_real)
    .bind(body.monto_pagado)
    .bind(&body.estado)
    .bind(&body.notas)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Budget line {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_budget_line(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM budget_items WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Budget line {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}
