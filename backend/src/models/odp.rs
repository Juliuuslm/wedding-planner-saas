use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_odp", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoOdp {
    Pendiente,
    Confirmada,
    Completada,
    Cancelada,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Odp {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub evento_id: Uuid,
    pub proveedor_id: Uuid,
    pub descripcion: String,
    pub monto: f64,
    pub fecha: NaiveDate,
    pub estado: EstadoOdp,
    pub requerimientos: Option<String>,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateOdp {
    pub evento_id: Uuid,
    pub proveedor_id: Uuid,
    pub descripcion: String,
    pub monto: f64,
    pub fecha: NaiveDate,
    pub estado: Option<EstadoOdp>,
    pub requerimientos: Option<String>,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateOdp {
    pub proveedor_id: Option<Uuid>,
    pub descripcion: Option<String>,
    pub monto: Option<f64>,
    pub fecha: Option<NaiveDate>,
    pub estado: Option<EstadoOdp>,
    pub requerimientos: Option<String>,
    pub notas: Option<String>,
}
