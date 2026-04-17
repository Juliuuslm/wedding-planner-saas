use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "tipo_contrato", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum TipoContrato {
    Cliente,
    Proveedor,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_contrato", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoContrato {
    Borrador,
    Enviado,
    Firmado,
    Cancelado,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Contrato {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub evento_id: Uuid,
    pub tipo: TipoContrato,
    pub contraparte: String,
    pub contraparte_id: Uuid,
    pub estado: EstadoContrato,
    pub monto_total: f64,
    pub fecha_creacion: DateTime<Utc>,
    pub fecha_envio: Option<DateTime<Utc>>,
    pub fecha_firma: Option<DateTime<Utc>>,
    pub version: i32,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateContrato {
    pub evento_id: Uuid,
    pub tipo: TipoContrato,
    pub contraparte: String,
    pub contraparte_id: Uuid,
    pub estado: Option<EstadoContrato>,
    pub monto_total: f64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateContrato {
    pub tipo: Option<TipoContrato>,
    pub contraparte: Option<String>,
    pub contraparte_id: Option<Uuid>,
    pub estado: Option<EstadoContrato>,
    pub monto_total: Option<f64>,
}
