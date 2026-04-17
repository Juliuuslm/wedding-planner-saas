use axum::{
    extract::{Extension, Path, Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::AuthUser,
    models::{
        cliente::Cliente,
        contrato::Contrato,
        evento::{CreateEvento, EstadoEvento, Evento, UpdateEvento},
        odp::Odp,
        paquete::Paquete,
        presupuesto::LineaPresupuesto,
        proveedor::Proveedor,
        tarea::Tarea,
    },
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/events", get(list_events).post(create_event))
        .route(
            "/events/{id}",
            get(get_event).put(update_event).delete(delete_event),
        )
        .route("/events/{id}/full", get(get_event_full))
}

#[derive(Deserialize)]
struct ListParams {
    q: Option<String>,
    estado: Option<EstadoEvento>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct EventoFull {
    evento: Evento,
    cliente: Option<Cliente>,
    paquete: Option<Paquete>,
    lineas: Vec<LineaPresupuesto>,
    tareas: Vec<Tarea>,
    odps: Vec<Odp>,
    proveedores: Vec<Proveedor>,
    contratos: Vec<Contrato>,
}

async fn list_events(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<Evento>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Evento>(
        r#"SELECT * FROM events
           WHERE planner_id = $1
             AND ($2::text IS NULL OR nombre ILIKE '%' || $2 || '%')
             AND ($3::estado_evento IS NULL OR estado = $3)
           ORDER BY fecha ASC"#,
    )
    .bind(auth.planner_id)
    .bind(&params.q)
    .bind(&params.estado)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_event(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreateEvento>,
) -> Result<(StatusCode, Json<Evento>), AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Evento>(
        r#"INSERT INTO events (planner_id, nombre, tipo, fecha, cliente_id, venue, numero_invitados, paquete_id, estado, presupuesto_total, notas)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'planificacion'), $10, $11)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(&body.nombre)
    .bind(&body.tipo)
    .bind(body.fecha)
    .bind(body.cliente_id)
    .bind(&body.venue)
    .bind(body.numero_invitados)
    .bind(body.paquete_id)
    .bind(&body.estado)
    .bind(body.presupuesto_total)
    .bind(&body.notas)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_event(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Evento>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Evento>(
        "SELECT * FROM events WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Event {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_event(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateEvento>,
) -> Result<Json<Evento>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Evento>(
        r#"UPDATE events SET
            nombre = COALESCE($1, nombre),
            tipo = COALESCE($2, tipo),
            fecha = COALESCE($3, fecha),
            venue = COALESCE($4, venue),
            numero_invitados = COALESCE($5, numero_invitados),
            paquete_id = COALESCE($6, paquete_id),
            estado = COALESCE($7, estado),
            presupuesto_total = COALESCE($8, presupuesto_total),
            progreso = COALESCE($9, progreso),
            notas = COALESCE($10, notas),
            actualizado_en = NOW()
           WHERE id = $11 AND planner_id = $12
           RETURNING *"#,
    )
    .bind(&body.nombre)
    .bind(&body.tipo)
    .bind(body.fecha)
    .bind(&body.venue)
    .bind(body.numero_invitados)
    .bind(body.paquete_id)
    .bind(&body.estado)
    .bind(body.presupuesto_total)
    .bind(body.progreso)
    .bind(&body.notas)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Event {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_event(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM events WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Event {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}

async fn get_event_full(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<EventoFull>, AppError> {
    let pool = state.pool()?;

    let evento = sqlx::query_as::<_, Evento>(
        "SELECT * FROM events WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Event {} not found", id)))?;

    let cliente = sqlx::query_as::<_, Cliente>(
        "SELECT * FROM clients WHERE id = $1 AND planner_id = $2",
    )
    .bind(evento.cliente_id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?;

    let paquete = if let Some(pid) = evento.paquete_id {
        sqlx::query_as::<_, Paquete>(
            "SELECT * FROM packages WHERE id = $1 AND planner_id = $2",
        )
        .bind(pid)
        .bind(auth.planner_id)
        .fetch_optional(pool)
        .await?
    } else {
        None
    };

    let lineas = sqlx::query_as::<_, LineaPresupuesto>(
        "SELECT * FROM budget_items WHERE evento_id = $1 AND planner_id = $2 ORDER BY id",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    let tareas = sqlx::query_as::<_, Tarea>(
        "SELECT * FROM tasks WHERE evento_id = $1 AND planner_id = $2 ORDER BY orden ASC",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    let odps = sqlx::query_as::<_, Odp>(
        "SELECT * FROM odp WHERE evento_id = $1 AND planner_id = $2 ORDER BY fecha ASC",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    let proveedores = sqlx::query_as::<_, Proveedor>(
        "SELECT * FROM vendors WHERE planner_id = $1 ORDER BY nombre ASC",
    )
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    let contratos = sqlx::query_as::<_, Contrato>(
        "SELECT * FROM contracts WHERE evento_id = $1 AND planner_id = $2 ORDER BY fecha_creacion DESC",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;

    Ok(Json(EventoFull {
        evento,
        cliente,
        paquete,
        lineas,
        tareas,
        odps,
        proveedores,
        contratos,
    }))
}
