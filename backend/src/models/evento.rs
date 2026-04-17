use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "tipo_evento", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum TipoEvento {
    Boda,
    Bautizo,
    #[serde(rename = "quinceañera")]
    #[sqlx(rename = "quinceañera")]
    Quinceanera,
    Corporativo,
    Otro,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_evento", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoEvento {
    Planificacion,
    Activo,
    Completado,
    Cancelado,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Evento {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub nombre: String,
    pub tipo: TipoEvento,
    pub fecha: NaiveDate,
    pub cliente_id: Uuid,
    pub venue: Option<String>,
    pub numero_invitados: Option<i32>,
    pub paquete_id: Option<Uuid>,
    pub estado: EstadoEvento,
    pub presupuesto_total: f64,
    pub progreso: f64,
    pub notas: Option<String>,
    pub creado_en: DateTime<Utc>,
    pub actualizado_en: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEvento {
    pub nombre: String,
    pub tipo: TipoEvento,
    pub fecha: NaiveDate,
    pub cliente_id: Uuid,
    pub venue: Option<String>,
    pub numero_invitados: Option<i32>,
    pub paquete_id: Option<Uuid>,
    pub estado: Option<EstadoEvento>,
    pub presupuesto_total: f64,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateEvento {
    pub nombre: Option<String>,
    pub tipo: Option<TipoEvento>,
    pub fecha: Option<NaiveDate>,
    pub venue: Option<String>,
    pub numero_invitados: Option<i32>,
    pub paquete_id: Option<Uuid>,
    pub estado: Option<EstadoEvento>,
    pub presupuesto_total: Option<f64>,
    pub progreso: Option<f64>,
    pub notas: Option<String>,
}
