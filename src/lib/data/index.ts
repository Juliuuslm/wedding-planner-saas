import 'server-only'
import { serverTenant } from './server-tenant'
import { withTenant } from '@/lib/db-tenant'
import type {
  Planner,
  Cliente,
  Evento,
  Proveedor,
  LineaPresupuesto,
  Tarea,
  Contrato,
  ODP,
  Paquete,
  Presupuesto,
} from '@/types'

// Shape del getEventoFull (mismo que EventoFull en src/lib/api/eventos)
export interface EventoFull {
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
  lineas: LineaPresupuesto[]
  tareas: Tarea[]
  odps: ODP[]
  proveedores: Proveedor[]
  contratos: Contrato[]
}

/**
 * Serializa el resultado Prisma (con Date, Decimal, etc.) al mismo
 * shape que devolvería el endpoint HTTP tras JSON.stringify. Esto
 * asegura que los Server Components vean Dates como strings ISO,
 * igual que los Client Components que fetchean el API.
 */
function ser<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// ============================================================
// Server-side data helpers. Usar en Server Components.
// Equivalentes (en semántica) a src/lib/api/* pero consultan
// Prisma directamente sin round-trip HTTP.
// ============================================================

// ── Planner ──────────────────────────────────────────────────
export async function getPlanner(): Promise<Planner | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.planner.findUnique({ where: { id: tenant.plannerId } }),
    ),
  )
}

// ── Clientes ─────────────────────────────────────────────────
export async function getClientes(opts?: { q?: string; estado?: string }): Promise<Cliente[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.cliente.findMany({
        where: {
          plannerId: tenant.plannerId,
          ...(opts?.estado ? { estado: opts.estado as never } : {}),
          ...(opts?.q
            ? {
                OR: [
                  { nombre: { contains: opts.q, mode: 'insensitive' } },
                  { apellido: { contains: opts.q, mode: 'insensitive' } },
                  { email: { contains: opts.q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { creadoEn: 'desc' },
      }),
    ),
  )
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.cliente.findFirst({ where: { id, plannerId: tenant.plannerId } }),
    ),
  )
}

// ── Eventos ──────────────────────────────────────────────────
export async function getEventos(opts?: { q?: string; estado?: string; clienteId?: string }): Promise<Evento[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.evento.findMany({
        where: {
          plannerId: tenant.plannerId,
          ...(opts?.estado ? { estado: opts.estado as never } : {}),
          ...(opts?.clienteId ? { clienteId: opts.clienteId } : {}),
          ...(opts?.q
            ? {
                OR: [
                  { nombre: { contains: opts.q, mode: 'insensitive' } },
                  { venue: { contains: opts.q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        include: { cliente: true, paquete: true },
        orderBy: { fecha: 'asc' },
      }),
    ),
  )
}

export async function getEventoById(id: string): Promise<Evento | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.evento.findFirst({
        where: { id, plannerId: tenant.plannerId },
        include: { cliente: true, paquete: true },
      }),
    ),
  )
}

export async function getEventoFull(id: string): Promise<EventoFull | null> {
  const tenant = await serverTenant()
  const result = await withTenant(tenant, async (tx) => {
    const row = await tx.evento.findFirst({
      where: { id, plannerId: tenant.plannerId },
      include: {
        cliente: true,
        paquete: true,
        budget: true,
        tareas: { orderBy: { orden: 'asc' } },
        contratos: true,
        odps: true,
        vendors: { include: { vendor: true } },
      },
    })
    if (!row) return null

    const { cliente, paquete, budget, tareas, contratos, odps, vendors, ...evento } = row
    return {
      evento,
      cliente: cliente ?? undefined,
      paquete: paquete ?? undefined,
      lineas: budget,
      tareas,
      odps,
      proveedores: vendors.map((ev) => ev.vendor),
      contratos,
    }
  })
  return result ? ser(result) : null
}

// ── Vendors ──────────────────────────────────────────────────
export async function getProveedores(opts?: { q?: string; categoria?: string }): Promise<Proveedor[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.vendor.findMany({
        where: {
          plannerId: tenant.plannerId,
          ...(opts?.categoria ? { categoria: opts.categoria as never } : {}),
          ...(opts?.q
            ? {
                OR: [
                  { nombre: { contains: opts.q, mode: 'insensitive' } },
                  { email: { contains: opts.q, mode: 'insensitive' } },
                  { contacto: { contains: opts.q, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { nombre: 'asc' },
      }),
    ),
  )
}

export async function getProveedorById(id: string): Promise<Proveedor | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.vendor.findFirst({ where: { id, plannerId: tenant.plannerId } }),
    ),
  )
}

// ── Presupuesto ──────────────────────────────────────────────
export async function getPresupuestoByEvento(eventoId: string): Promise<Presupuesto> {
  const tenant = await serverTenant()
  const result = await withTenant(tenant, async (tx) => {
    const lineas = await tx.lineaPresupuesto.findMany({
      where: { eventoId, plannerId: tenant.plannerId },
      include: { vendor: true },
    })
    const totalEstimado = lineas.reduce((s, l) => s + l.montoEstimado, 0)
    const totalReal = lineas.reduce((s, l) => s + (l.montoReal ?? l.montoEstimado), 0)
    const totalPagado = lineas.reduce((s, l) => s + l.montoPagado, 0)
    return { eventoId, lineas, totalEstimado, totalReal, totalPagado }
  })
  return ser(result)
}

// ── Tareas ───────────────────────────────────────────────────
export async function getTareasByEvento(eventoId: string): Promise<Tarea[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.tarea.findMany({
        where: { eventoId, plannerId: tenant.plannerId },
        orderBy: { orden: 'asc' },
      }),
    ),
  )
}

// ── Contratos ────────────────────────────────────────────────
export async function getContratos(opts?: {
  eventoId?: string
  tipo?: string
  estado?: string
  contraparteId?: string
}): Promise<Contrato[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.contrato.findMany({
        where: {
          plannerId: tenant.plannerId,
          ...(opts?.eventoId ? { eventoId: opts.eventoId } : {}),
          ...(opts?.tipo ? { tipo: opts.tipo as never } : {}),
          ...(opts?.estado ? { estado: opts.estado as never } : {}),
          ...(opts?.contraparteId ? { contraparteId: opts.contraparteId } : {}),
        },
        orderBy: { fechaCreacion: 'desc' },
      }),
    ),
  )
}

export async function getContratosByContraparteId(
  contraparteId: string,
  tipo?: 'cliente' | 'proveedor',
): Promise<Contrato[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.contrato.findMany({
        where: {
          plannerId: tenant.plannerId,
          contraparteId,
          ...(tipo ? { tipo } : {}),
        },
        orderBy: { fechaCreacion: 'desc' },
      }),
    ),
  )
}

export async function getContratosByEvento(eventoId: string): Promise<Contrato[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.contrato.findMany({
        where: { eventoId, plannerId: tenant.plannerId },
        orderBy: { fechaCreacion: 'desc' },
      }),
    ),
  )
}

// ── ODPs ─────────────────────────────────────────────────────
export async function getODPsByEvento(eventoId: string): Promise<ODP[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.odp.findMany({
        where: { eventoId, plannerId: tenant.plannerId },
        include: { vendor: true },
        orderBy: { fecha: 'asc' },
      }),
    ),
  )
}

export async function getODPsByProveedor(proveedorId: string): Promise<ODP[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.odp.findMany({
        where: { proveedorId, plannerId: tenant.plannerId },
        include: { evento: { select: { id: true, nombre: true, fecha: true, venue: true } } },
        orderBy: { fecha: 'asc' },
      }),
    ),
  )
}

export async function getODPById(id: string): Promise<ODP | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.odp.findFirst({
        where: { id, plannerId: tenant.plannerId },
        include: {
          evento: { select: { id: true, nombre: true, fecha: true, venue: true } },
          vendor: true,
        },
      }),
    ),
  )
}

// ── Paquetes ─────────────────────────────────────────────────
export async function getPaquetes(): Promise<Paquete[]> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.paquete.findMany({
        where: { plannerId: tenant.plannerId },
        orderBy: { creadoEn: 'desc' },
      }),
    ),
  )
}

export async function getPaqueteById(id: string): Promise<Paquete | null> {
  const tenant = await serverTenant()
  return ser(
    await withTenant(tenant, (tx) =>
      tx.paquete.findFirst({ where: { id, plannerId: tenant.plannerId } }),
    ),
  )
}
