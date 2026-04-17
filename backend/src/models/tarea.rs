use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_tarea", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoTarea {
    Pendiente,
    EnProgreso,
    Completada,
    Atrasada,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Tarea {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub evento_id: Uuid,
    pub titulo: String,
    pub descripcion: Option<String>,
    pub responsable: Option<String>,
    pub fecha_inicio: Option<NaiveDate>,
    pub fecha_vencimiento: NaiveDate,
    pub estado: EstadoTarea,
    pub fase: String,
    pub orden: i32,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTarea {
    pub evento_id: Uuid,
    pub titulo: String,
    pub descripcion: Option<String>,
    pub responsable: Option<String>,
    pub fecha_inicio: Option<NaiveDate>,
    pub fecha_vencimiento: NaiveDate,
    pub estado: Option<EstadoTarea>,
    pub fase: String,
    pub orden: Option<i32>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateTarea {
    pub titulo: Option<String>,
    pub descripcion: Option<String>,
    pub responsable: Option<String>,
    pub fecha_inicio: Option<NaiveDate>,
    pub fecha_vencimiento: Option<NaiveDate>,
    pub estado: Option<EstadoTarea>,
    pub fase: Option<String>,
    pub orden: Option<i32>,
}
