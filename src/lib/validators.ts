import { z } from 'zod'

// ── Enums (deben coincidir con prisma/schema.prisma) ─────────────────────

export const estadoCliente = z.enum(['prospecto', 'activo', 'completado', 'cancelado'])
export const tipoEvento = z.enum(['boda', 'bautizo', 'quinceanera', 'corporativo', 'otro'])
export const estadoEvento = z.enum(['planificacion', 'activo', 'completado', 'cancelado'])
export const categoriaProveedor = z.enum([
  'venue', 'catering', 'fotografia', 'video', 'musica', 'flores', 'decoracion',
  'pasteleria', 'invitaciones', 'transporte', 'entretenimiento', 'iluminacion',
  'mobiliario', 'otro',
])
export const estadoPago = z.enum(['pendiente', 'pagado_parcial', 'pagado'])
export const estadoTarea = z.enum(['pendiente', 'en_progreso', 'completada', 'atrasada'])
export const tipoContrato = z.enum(['cliente', 'proveedor'])
export const estadoContrato = z.enum(['borrador', 'enviado', 'firmado', 'cancelado'])
export const estadoOdp = z.enum(['pendiente', 'confirmada', 'completada', 'cancelada'])

// ── Helpers ──────────────────────────────────────────────────────────────

export const uuid = z.string().uuid()
export const dateString = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/))

// ── Clientes ─────────────────────────────────────────────────────────────

export const createClienteSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  email: z.string().email(),
  telefono: z.string().default(''),
  estado: estadoCliente.default('prospecto'),
  notas: z.string().optional().nullable(),
})

export const updateClienteSchema = createClienteSchema.partial()

export const listClientesQuery = z.object({
  search: z.string().optional(),
  estado: estadoCliente.optional(),
})

// ── Eventos ──────────────────────────────────────────────────────────────

export const createEventoSchema = z.object({
  nombre: z.string().min(1),
  tipo: tipoEvento.default('boda'),
  fecha: dateString,
  clienteId: uuid,
  venue: z.string().optional().nullable(),
  numeroInvitados: z.number().int().positive().optional().nullable(),
  paqueteId: uuid.optional().nullable(),
  estado: estadoEvento.default('planificacion'),
  presupuestoTotal: z.number().nonnegative().default(0),
  progreso: z.number().min(0).max(100).default(0),
  notas: z.string().optional().nullable(),
})

export const updateEventoSchema = createEventoSchema.partial()

export const listEventosQuery = z.object({
  search: z.string().optional(),
  estado: estadoEvento.optional(),
  clienteId: uuid.optional(),
})

// ── Vendors ──────────────────────────────────────────────────────────────

export const createVendorSchema = z.object({
  nombre: z.string().min(1),
  categoria: categoriaProveedor.default('otro'),
  contacto: z.string().optional().nullable(),
  email: z.string().email(),
  telefono: z.string().default(''),
  whatsapp: z.string().optional().nullable(),
  sitioWeb: z.string().url().optional().nullable().or(z.literal('')),
  descripcion: z.string().optional().nullable(),
  servicios: z.array(z.string()).optional(),
  precioBase: z.number().nonnegative().optional().nullable(),
  precioMin: z.number().nonnegative().optional().nullable(),
  precioMax: z.number().nonnegative().optional().nullable(),
  calificacion: z.number().min(0).max(5).default(0),
  foto: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
})

export const updateVendorSchema = createVendorSchema.partial()

export const listVendorsQuery = z.object({
  search: z.string().optional(),
  categoria: categoriaProveedor.optional(),
})

// ── Budget ───────────────────────────────────────────────────────────────

export const createBudgetLineSchema = z.object({
  categoria: categoriaProveedor,
  concepto: z.string().min(1),
  proveedorId: uuid.optional().nullable(),
  montoEstimado: z.number().nonnegative().default(0),
  montoReal: z.number().nonnegative().optional().nullable(),
  montoPagado: z.number().nonnegative().default(0),
  estado: estadoPago.default('pendiente'),
  notas: z.string().optional().nullable(),
})

export const updateBudgetLineSchema = createBudgetLineSchema.partial()

// ── Tareas ───────────────────────────────────────────────────────────────

export const createTareaSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().optional().nullable(),
  responsable: z.string().optional().nullable(),
  fechaInicio: dateString.optional().nullable(),
  fechaVencimiento: dateString,
  estado: estadoTarea.default('pendiente'),
  fase: z.string().default(''),
  orden: z.number().int().nonnegative().default(0),
})

export const updateTareaSchema = createTareaSchema.partial()

export const reorderTareasSchema = z.object({
  items: z.array(z.object({ id: uuid, orden: z.number().int().nonnegative() })),
})

// ── Contratos ────────────────────────────────────────────────────────────

export const createContratoSchema = z.object({
  eventoId: uuid,
  tipo: tipoContrato,
  contraparte: z.string().min(1),
  contraparteId: uuid,
  estado: estadoContrato.default('borrador'),
  montoTotal: z.number().nonnegative().default(0),
  fechaEnvio: dateString.optional().nullable(),
  fechaFirma: dateString.optional().nullable(),
  version: z.number().int().positive().default(1),
})

export const updateContratoSchema = createContratoSchema.partial()

export const listContratosQuery = z.object({
  eventoId: uuid.optional(),
  tipo: tipoContrato.optional(),
  estado: estadoContrato.optional(),
  contraparteId: uuid.optional(),
})

// ── ODP ──────────────────────────────────────────────────────────────────

export const createOdpSchema = z.object({
  eventoId: uuid,
  proveedorId: uuid,
  descripcion: z.string().min(1),
  monto: z.number().nonnegative().default(0),
  fecha: dateString,
  estado: estadoOdp.default('pendiente'),
  requerimientos: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
})

export const updateOdpSchema = createOdpSchema.partial()

// ── Paquetes ─────────────────────────────────────────────────────────────

export const createPaqueteSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().default(''),
  precio: z.number().nonnegative().default(0),
  servicios: z.array(z.string()).default([]),
  activo: z.boolean().default(true),
})

export const updatePaqueteSchema = createPaqueteSchema.partial()

// ── Planner ──────────────────────────────────────────────────────────────

export const updatePlannerSchema = z.object({
  nombre: z.string().min(1).optional(),
  empresa: z.string().min(1).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  logo: z.string().optional().nullable(),
  moneda: z.string().length(3).optional(),
  zonaHoraria: z.string().optional(),
})
