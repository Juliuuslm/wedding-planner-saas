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
    models::cliente::{Cliente, CreateCliente, EstadoCliente, UpdateCliente},
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/clients", get(list_clients).post(create_client))
        .route(
            "/clients/{id}",
            get(get_client).put(update_client).delete(delete_client),
        )
}

#[derive(Deserialize)]
struct ListParams {
    q: Option<String>,
    estado: Option<EstadoCliente>,
}

async fn list_clients(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<Cliente>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Cliente>(
        r#"SELECT * FROM clients
           WHERE planner_id = $1
             AND ($2::text IS NULL OR nombre ILIKE '%' || $2 || '%' OR apellido ILIKE '%' || $2 || '%' OR email ILIKE '%' || $2 || '%')
             AND ($3::estado_cliente IS NULL OR estado = $3)
           ORDER BY creado_en DESC"#,
    )
    .bind(auth.planner_id)
    .bind(&params.q)
    .bind(&params.estado)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_client(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreateCliente>,
) -> Result<(StatusCode, Json<Cliente>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Cliente>(
        r#"INSERT INTO clients (planner_id, nombre, apellido, email, telefono, estado, notas)
           VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'prospecto'), $7)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(&body.nombre)
    .bind(&body.apellido)
    .bind(&body.email)
    .bind(&body.telefono)
    .bind(&body.estado)
    .bind(&body.notas)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_client(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Cliente>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Cliente>(
        "SELECT * FROM clients WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Client {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_client(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateCliente>,
) -> Result<Json<Cliente>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Cliente>(
        r#"UPDATE clients SET
            nombre = COALESCE($1, nombre),
            apellido = COALESCE($2, apellido),
            email = COALESCE($3, email),
            telefono = COALESCE($4, telefono),
            estado = COALESCE($5, estado),
            notas = COALESCE($6, notas),
            actualizado_en = NOW()
           WHERE id = $7 AND planner_id = $8
           RETURNING *"#,
    )
    .bind(&body.nombre)
    .bind(&body.apellido)
    .bind(&body.email)
    .bind(&body.telefono)
    .bind(&body.estado)
    .bind(&body.notas)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Client {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_client(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM clients WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Client {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}
