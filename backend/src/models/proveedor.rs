use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "categoria_proveedor", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum CategoriaProveedor {
    Venue,
    Catering,
    Fotografia,
    Video,
    Musica,
    Flores,
    Decoracion,
    Pasteleria,
    Invitaciones,
    Transporte,
    Entretenimiento,
    Iluminacion,
    Mobiliario,
    Otro,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Proveedor {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub nombre: String,
    pub categoria: CategoriaProveedor,
    pub contacto: Option<String>,
    pub email: String,
    pub telefono: String,
    pub whatsapp: Option<String>,
    pub sitio_web: Option<String>,
    pub descripcion: Option<String>,
    pub servicios: Option<serde_json::Value>,
    pub precio_base: Option<f64>,
    pub precio_min: Option<f64>,
    pub precio_max: Option<f64>,
    pub calificacion: f64,
    pub foto: Option<String>,
    pub notas: Option<String>,
    pub creado_en: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProveedor {
    pub nombre: String,
    pub categoria: CategoriaProveedor,
    pub contacto: Option<String>,
    pub email: String,
    pub telefono: String,
    pub whatsapp: Option<String>,
    pub sitio_web: Option<String>,
    pub descripcion: Option<String>,
    pub servicios: Option<Vec<String>>,
    pub precio_base: Option<f64>,
    pub precio_min: Option<f64>,
    pub precio_max: Option<f64>,
    pub calificacion: Option<f64>,
    pub foto: Option<String>,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProveedor {
    pub nombre: Option<String>,
    pub categoria: Option<CategoriaProveedor>,
    pub contacto: Option<String>,
    pub email: Option<String>,
    pub telefono: Option<String>,
    pub whatsapp: Option<String>,
    pub sitio_web: Option<String>,
    pub descripcion: Option<String>,
    pub servicios: Option<Vec<String>>,
    pub precio_base: Option<f64>,
    pub precio_min: Option<f64>,
    pub precio_max: Option<f64>,
    pub calificacion: Option<f64>,
    pub foto: Option<String>,
    pub notas: Option<String>,
}
