pub mod planner;
pub mod cliente;
pub mod evento;
pub mod proveedor;
pub mod presupuesto;
pub mod tarea;
pub mod contrato;
pub mod odp;
pub mod paquete;

// Re-export all model types for convenient access via `models::TypeName`.
// These will be used once handlers implement real CRUD logic.
#[allow(unused_imports)]
pub use planner::*;
#[allow(unused_imports)]
pub use cliente::*;
#[allow(unused_imports)]
pub use evento::*;
#[allow(unused_imports)]
pub use proveedor::*;
#[allow(unused_imports)]
pub use presupuesto::*;
#[allow(unused_imports)]
pub use tarea::*;
#[allow(unused_imports)]
pub use contrato::*;
#[allow(unused_imports)]
pub use odp::*;
#[allow(unused_imports)]
pub use paquete::*;
