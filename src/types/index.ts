// ============================================================
// Tipos de dominio (shape de lo que ve el frontend)
//
// Alineados con prisma/schema.prisma tras la migración a Prisma.
// Los campos opcionales usan `| null` (no solo `?:`) porque eso es lo
// que Prisma devuelve. Dates se serializan a string ISO vía JSON.
// ============================================================

// ============================================================
// PLANNER
// ============================================================

export interface Planner {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  logo?: string | null
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
  plannerId?: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  estado: EstadoCliente
  notas?: string | null
  creadoEn: string
  actualizadoEn: string
}

// ============================================================
// EVENTOS
// ============================================================

// Nota: enum Prisma usa `quinceanera` (sin ñ, ASCII) por portabilidad.
export type TipoEvento = 'boda' | 'bautizo' | 'quinceanera' | 'corporativo' | 'otro'
export type EstadoEvento = 'planificacion' | 'activo' | 'completado' | 'cancelado'

export interface Evento {
  id: string
  nombre: string
  tipo: TipoEvento
  fecha: string // ISO 8601
  clienteId: string
  plannerId: string
  venue?: string | null
  numeroInvitados?: number | null
  paqueteId?: string | null
  estado: EstadoEvento
  presupuestoTotal: number
  progreso: number // 0-100
  notas?: string | null
  creadoEn: string
  actualizadoEn: string
}

// ============================================================
// PROVEEDORES
// ============================================================

export type CategoriaProveedor =
  | 'venue'
  | 'catering'
  | 'fotografia'
  | 'video'
  | 'musica'
  | 'flores'
  | 'decoracion'
  | 'pasteleria'
  | 'invitaciones'
  | 'transporte'
  | 'entretenimiento'
  | 'iluminacion'
  | 'mobiliario'
  | 'otro'

export interface Proveedor {
  id: string
  plannerId?: string
  nombre: string
  categoria: CategoriaProveedor
  contacto?: string | null
  email: string
  telefono: string
  whatsapp?: string | null
  sitioWeb?: string | null
  descripcion?: string | null
  servicios?: string[] | null
  precioBase?: number | null
  precioMin?: number | null
  precioMax?: number | null
  calificacion: number
  foto?: string | null
  notas?: string | null
  creadoEn: string
}

// ============================================================
// PRESUPUESTO
// ============================================================

export type EstadoLinea = 'pendiente' | 'pagado_parcial' | 'pagado'

export interface LineaPresupuesto {
  id: string
  plannerId?: string
  eventoId: string
  categoria: CategoriaProveedor
  concepto: string
  proveedorId?: string | null
  montoEstimado: number
  montoReal?: number | null
  montoPagado: number
  estado: EstadoLinea
  notas?: string | null
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
  plannerId?: string
  eventoId: string
  titulo: string
  descripcion?: string | null
  responsable?: string | null
  fechaInicio?: string | null
  fechaVencimiento: string
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
  plannerId?: string
  eventoId: string
  tipo: TipoContrato
  contraparte: string
  contraparteId: string
  estado: EstadoContrato
  montoTotal: number
  fechaCreacion: string
  fechaEnvio?: string | null
  fechaFirma?: string | null
  version: number
}

// ============================================================
// ODP — ORDEN DE DESEMPEÑO
// ============================================================

export type EstadoODP = 'pendiente' | 'confirmada' | 'completada' | 'cancelada'

export interface ODP {
  id: string
  plannerId?: string
  eventoId: string
  proveedorId: string
  descripcion: string
  monto: number
  fecha: string
  estado: EstadoODP
  requerimientos?: string | null
  notas?: string | null
}

// ============================================================
// PAQUETES
// ============================================================

export interface Paquete {
  id: string
  plannerId?: string
  nombre: string
  descripcion: string
  precio: number
  servicios: string[]
  activo: boolean
}
