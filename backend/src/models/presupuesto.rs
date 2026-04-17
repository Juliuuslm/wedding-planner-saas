use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use super::proveedor::CategoriaProveedor;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, sqlx::Type)]
#[sqlx(type_name = "estado_pago", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum EstadoPago {
    Pendiente,
    PagadoParcial,
    Pagado,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct LineaPresupuesto {
    pub id: Uuid,
    pub planner_id: Uuid,
    pub evento_id: Uuid,
    pub categoria: CategoriaProveedor,
    pub concepto: String,
    pub proveedor_id: Option<Uuid>,
    pub monto_estimado: f64,
    pub monto_real: Option<f64>,
    pub monto_pagado: f64,
    pub estado: EstadoPago,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateLineaPresupuesto {
    pub evento_id: Uuid,
    pub categoria: CategoriaProveedor,
    pub concepto: String,
    pub proveedor_id: Option<Uuid>,
    pub monto_estimado: f64,
    pub monto_real: Option<f64>,
    pub monto_pagado: Option<f64>,
    pub estado: Option<EstadoPago>,
    pub notas: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateLineaPresupuesto {
    pub categoria: Option<CategoriaProveedor>,
    pub concepto: Option<String>,
    pub proveedor_id: Option<Uuid>,
    pub monto_estimado: Option<f64>,
    pub monto_real: Option<f64>,
    pub monto_pagado: Option<f64>,
    pub estado: Option<EstadoPago>,
    pub notas: Option<String>,
}
