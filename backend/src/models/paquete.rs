use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Paquete {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub nombre: String,
    pub descripcion: String,
    pub precio: f64,
    pub servicios: serde_json::Value,
    pub activo: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreatePaquete {
    pub nombre: String,
    pub descripcion: String,
    pub precio: f64,
    pub servicios: Vec<String>,
    pub activo: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePaquete {
    pub nombre: Option<String>,
    pub descripcion: Option<String>,
    pub precio: Option<f64>,
    pub servicios: Option<Vec<String>>,
    pub activo: Option<bool>,
}
