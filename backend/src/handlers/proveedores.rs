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
    models::{
        odp::Odp,
        proveedor::{CategoriaProveedor, CreateProveedor, Proveedor, UpdateProveedor},
    },
    AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/vendors", get(list_vendors).post(create_vendor))
        .route(
            "/vendors/{id}",
            get(get_vendor).put(update_vendor).delete(delete_vendor),
        )
        .route("/vendors/{id}/odps", get(list_vendor_odps))
}

#[derive(Deserialize)]
struct ListParams {
    q: Option<String>,
    categoria: Option<CategoriaProveedor>,
}

async fn list_vendors(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<Proveedor>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Proveedor>(
        r#"SELECT * FROM vendors
           WHERE planner_id = $1
             AND ($2::text IS NULL OR nombre ILIKE '%' || $2 || '%')
             AND ($3::categoria_proveedor IS NULL OR categoria = $3)
           ORDER BY nombre ASC"#,
    )
    .bind(auth.planner_id)
    .bind(&params.q)
    .bind(&params.categoria)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}

async fn create_vendor(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Json(body): Json<CreateProveedor>,
) -> Result<(StatusCode, Json<Proveedor>), AppError> {
    let pool = state.pool()?;
    let servicios = body.servicios
        .as_ref()
        .map(|s| serde_json::to_value(s).unwrap_or(serde_json::Value::Array(vec![])))
        .unwrap_or(serde_json::Value::Array(vec![]));

    let rec = sqlx::query_as::<_, Proveedor>(
        r#"INSERT INTO vendors (planner_id, nombre, categoria, contacto, email, telefono, whatsapp, sitio_web, descripcion, servicios, precio_base, precio_min, precio_max, calificacion, foto, notas)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, COALESCE($14, 0), $15, $16)
           RETURNING *"#,
    )
    .bind(auth.planner_id)
    .bind(&body.nombre)
    .bind(&body.categoria)
    .bind(&body.contacto)
    .bind(&body.email)
    .bind(&body.telefono)
    .bind(&body.whatsapp)
    .bind(&body.sitio_web)
    .bind(&body.descripcion)
    .bind(&servicios)
    .bind(body.precio_base)
    .bind(body.precio_min)
    .bind(body.precio_max)
    .bind(body.calificacion)
    .bind(&body.foto)
    .bind(&body.notas)
    .fetch_one(pool)
    .await?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn get_vendor(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Proveedor>, AppError> {
    let pool = state.pool()?;
    let rec = sqlx::query_as::<_, Proveedor>(
        "SELECT * FROM vendors WHERE id = $1 AND planner_id = $2",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Vendor {} not found", id)))?;
    Ok(Json(rec))
}

async fn update_vendor(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
    Json(body): Json<UpdateProveedor>,
) -> Result<Json<Proveedor>, AppError> {
    let pool = state.pool()?;
    let servicios = body.servicios
        .as_ref()
        .map(|s| serde_json::to_value(s).unwrap_or(serde_json::Value::Array(vec![])));

    let rec = sqlx::query_as::<_, Proveedor>(
        r#"UPDATE vendors SET
            nombre = COALESCE($1, nombre),
            categoria = COALESCE($2, categoria),
            contacto = COALESCE($3, contacto),
            email = COALESCE($4, email),
            telefono = COALESCE($5, telefono),
            whatsapp = COALESCE($6, whatsapp),
            sitio_web = COALESCE($7, sitio_web),
            descripcion = COALESCE($8, descripcion),
            servicios = COALESCE($9, servicios),
            precio_base = COALESCE($10, precio_base),
            precio_min = COALESCE($11, precio_min),
            precio_max = COALESCE($12, precio_max),
            calificacion = COALESCE($13, calificacion),
            foto = COALESCE($14, foto),
            notas = COALESCE($15, notas)
           WHERE id = $16 AND planner_id = $17
           RETURNING *"#,
    )
    .bind(&body.nombre)
    .bind(&body.categoria)
    .bind(&body.contacto)
    .bind(&body.email)
    .bind(&body.telefono)
    .bind(&body.whatsapp)
    .bind(&body.sitio_web)
    .bind(&body.descripcion)
    .bind(&servicios)
    .bind(body.precio_base)
    .bind(body.precio_min)
    .bind(body.precio_max)
    .bind(body.calificacion)
    .bind(&body.foto)
    .bind(&body.notas)
    .bind(id)
    .bind(auth.planner_id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Vendor {} not found", id)))?;
    Ok(Json(rec))
}

async fn delete_vendor(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let pool = state.pool()?;
    let result = sqlx::query("DELETE FROM vendors WHERE id = $1 AND planner_id = $2")
        .bind(id)
        .bind(auth.planner_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Vendor {} not found", id)));
    }
    Ok(StatusCode::NO_CONTENT)
}

async fn list_vendor_odps(
    State(state): State<AppState>,
    Extension(auth): Extension<AuthUser>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Odp>>, AppError> {
    let pool = state.pool()?;
    let recs = sqlx::query_as::<_, Odp>(
        "SELECT * FROM odp WHERE proveedor_id = $1 AND planner_id = $2 ORDER BY fecha DESC",
    )
    .bind(id)
    .bind(auth.planner_id)
    .fetch_all(pool)
    .await?;
    Ok(Json(recs))
}
