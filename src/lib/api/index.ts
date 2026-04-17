// ─── API Layer — Re-exports ─────────────────────────────────────────────────

export { ApiError, apiGet, apiPost, apiPut, apiPatch, apiDelete } from './client'

export {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from './clientes'

export {
  getEventos,
  getEventoById,
  getEventoFull,
  createEvento,
  updateEvento,
  deleteEvento,
} from './eventos'
export type { EventoFull } from './eventos'

export {
  getPresupuestoByEvento,
  createLineaPresupuesto,
  updateLineaPresupuesto,
  deleteLineaPresupuesto,
} from './presupuesto'

export {
  getTareasByEvento,
  createTarea,
  updateTarea,
  deleteTarea,
  reorderTareas,
} from './tareas'

export {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
} from './proveedores'

export {
  getContratos,
  getContratosByEvento,
  getContratosByContraparteId,
  createContrato,
  updateContrato,
} from './contratos'

export {
  getODPsByEvento,
  getODPsByProveedor,
  getODPById,
  createODP,
  updateODP,
} from './odp'

export { getPaquetes, getPaqueteById, createPaquete, updatePaquete, deletePaquete } from './paquetes'

export { getPlanner, updatePlanner } from './planner'
