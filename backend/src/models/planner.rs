use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Planner {
    pub id: Uuid,
    pub nombre: String,
    pub empresa: String,
    pub email: String,
    pub telefono: String,
    pub logo: Option<String>,
    pub moneda: String,
    pub zona_horaria: String,
    pub creado_en: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatePlanner {
    pub nombre: String,
    pub empresa: String,
    pub email: String,
    pub telefono: String,
    pub logo: Option<String>,
    pub moneda: Option<String>,
    pub zona_horaria: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePlanner {
    pub nombre: Option<String>,
    pub empresa: Option<String>,
    pub email: Option<String>,
    pub telefono: Option<String>,
    pub logo: Option<String>,
    pub moneda: Option<String>,
    pub zona_horaria: Option<String>,
}
