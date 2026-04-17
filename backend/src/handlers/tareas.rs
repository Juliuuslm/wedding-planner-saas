use axum::{
    extract::{Extension, Path, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::tarea::{CreateTarea, Tarea, UpdateTarea},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/events/{evento_id}/tasks", get(list_tasks).post(create_task))
        .route("/tasks/{id}", axum::routing::put(update_task).delete(delete_task))
        .route("/events/{evento_id}/tasks/reorder", axum::routing::put(reorder_tasks))
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReorderBody {
    tarea_ids: Vec<Uuid>,
}

async fn list_tasks(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
) -> Result<Json<Vec<Tarea>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Tarea>(
        "SELECT * FROM tasks WHERE evento_id = $1 AND planner_id = $2 ORDER BY orden ASC",
    )
    .bind(evento_id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_task(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
    Json(body): Json<CreateTarea>,
) -> Result<(StatusCode, Json<Tarea>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Tarea>(
        r#"INSERT INTO tasks (planner_id, evento_id, titulo, descripcion, responsable, fecha_inicio, fecha_vencimiento, estado, fase, orden)
           VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'pendiente'), $9, COALESCE($10, 0))
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(evento_id)
    .bind(&body.titulo)
    .bind(&body.descripcion)
    .bind(&body.responsable)
    .bind(body.fecha_inicio)
    .bind(body.fecha_vencimiento)
    .bind(&body.estado)
    .bind(&body.fase)
    .bind(body.orden)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn update_task(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateTarea>,
) -> Result<Json<Tarea>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Tarea>(
        r#"UPDATE tasks SET
            titulo = COALESCE($1, titulo),
            descripcion = COALESCE($2, descripcion),
            responsable = COALESCE($3, responsable),
            fecha_inicio = COALESCE($4, fecha_inicio),
            fecha_vencimiento = COALESCE($5, fecha_vencimiento),
            estado = COALESCE($6, estado),
            fase = COALESCE($7, fase),
            orden = COALESCE($8, orden)
           WHERE id = $9 AND planner_id = $10
           RETURNING *"#,
    )
    .bind(&body.titulo)
    .bind(&body.descripcion)
    .bind(&body.responsable)
    .bind(body.fecha_inicio)
    .bind(body.fecha_vencimiento)
    .bind(&body.estado)
    .bind(&body.fase)
    .bind(body.orden)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Task {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_task(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM tasks WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Task {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}

async fn reorder_tasks(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(evento_id): Path<Uuid>,
    Json(body): Json<ReorderBody>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let mut tx = pool.begin().await?;
    for (idx, tarea_id) in body.tarea_ids.iter().enumerate() {
        sqlx::query(
            "UPDATE tasks SET orden = $1 WHERE id = $2 AND evento_id = $3 AND planner_id = $4",
        )
        .bind(idx as i32)
        .bind(tarea_id)
        .bind(evento_id)
        .bind(auth.planner_id)
        .execute(&mut *tx)
        .await?;
    }
    tx.commit().await?;
    Ok(StatusCode::NO_CONTENT)
}
