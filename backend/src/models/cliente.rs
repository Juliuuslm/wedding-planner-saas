use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_cliente", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoCliente {
    Prospecto,
    Activo,
    Completado,
    Cancelado,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Cliente {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub telefono: String,
    pub estado: EstadoCliente,
    pub notas: Option<String>,
    pub creado_en: DateTime<Utc>,
    pub actualizado_en: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCliente {
    pub nombre: String,
    pub apellido: String,
    pub email: String,
    pub telefono: String,
    pub estado: Option<EstadoCliente>,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCliente {
    pub nombre: Option<String>,
    pub apellido: Option<String>,
    pub email: Option<String>,
    pub telefono: Option<String>,
    pub estado: Option<EstadoCliente>,
    pub notas: Option<String>,
}
