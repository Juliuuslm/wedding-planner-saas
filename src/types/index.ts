// ============================================================
// PLANNER
// ============================================================

export interface Planner {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  logo?: string
  moneda: string
  zonaHoraria: string
  creadoEn: string
}

// ============================================================
// CLIENTES
// ============================================================

export type EstadoCliente = 'prospecto' | 'activo' | 'completado' | 'cancelado'

export interface Cliente {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  estado: EstadoCliente
  notas?: string
  creadoEn: string
  actualizadoEn: string
}

// ============================================================
// EVENTOS
// ============================================================

export type TipoEvento = 'boda' | 'bautizo' | 'quinceañera' | 'corporativo' | 'otro'
export type EstadoEvento = 'planificacion' | 'activo' | 'completado' | 'cancelado'

export interface Evento {
  id: string
  nombre: string
  tipo: TipoEvento
  fecha: string // ISO 8601
  clienteId: string
  plannerId: string
  venue?: string
  numeroInvitados?: number
  paqueteId?: string
  estado: EstadoEvento
  presupuestoTotal: number
  progreso: number // 0-100
  notas?: string
  creadoEn: string
  actualizadoEn: string
}

// ============================================================
// PROVEEDORES
// ============================================================

export type CategoriaProveedor =
  | 'floreria'
  | 'fotografia'
  | 'catering'
  | 'musica'
  | 'decoracion'
  | 'venue'
  | 'video'
  | 'transporte'
  | 'iluminacion'
  | 'pasteleria'
  | 'otro'

export interface Proveedor {
  id: string
  nombre: string
  categoria: CategoriaProveedor
  email: string
  telefono: string
  precioBase?: number
  calificacion: number // 1-5
  foto?: string
  notas?: string
  creadoEn: string
}

// ============================================================
// PRESUPUESTO
// ============================================================

export type EstadoLinea = 'pendiente' | 'pagado_parcial' | 'pagado'

export interface LineaPresupuesto {
  id: string
  eventoId: string
  categoria: CategoriaProveedor
  concepto: string
  proveedorId?: string
  montoEstimado: number
  montoReal?: number
  montoPagado: number
  estado: EstadoLinea
  notas?: string
}

export interface Presupuesto {
  eventoId: string
  lineas: LineaPresupuesto[]
  totalEstimado: number
  totalReal: number
  totalPagado: number
}

// ============================================================
// TIMELINE / TAREAS
// ============================================================

export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'atrasada'

export interface Tarea {
  id: string
  eventoId: string
  titulo: string
  descripcion?: string
  responsable?: string
  fechaVencimiento: string // ISO 8601
  estado: EstadoTarea
  fase: string
  orden: number
}

// ============================================================
// CONTRATOS
// ============================================================

export type EstadoContrato = 'borrador' | 'enviado' | 'firmado' | 'cancelado'
export type TipoContrato = 'cliente' | 'proveedor'

export interface Contrato {
  id: string
  eventoId: string
  tipo: TipoContrato
  contraparte: string // nombre legible del cliente o proveedor
  contraparteId: string
  estado: EstadoContrato
  montoTotal: number
  fechaCreacion: string
  fechaEnvio?: string
  fechaFirma?: string
  version: number
}

// ============================================================
// ODP — ORDEN DE DESEMPEÑO
// ============================================================

export type EstadoODP = 'pendiente' | 'confirmada' | 'completada' | 'cancelada'

export interface ODP {
  id: string
  eventoId: string
  proveedorId: string
  descripcion: string
  monto: number
  fecha: string // ISO 8601 — fecha del servicio
  estado: EstadoODP
  requerimientos?: string
  notas?: string
}

// ============================================================
// PAQUETES
// ============================================================

export interface Paquete {
  id: string
  nombre: string
  descripcion: string
  precio: number
  servicios: string[]
  activo: boolean
}
