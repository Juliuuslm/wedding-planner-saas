import type {
  Evento,
  Cliente,
  Paquete,
  LineaPresupuesto,
  Tarea,
  ODP,
  Proveedor,
  Contrato,
} from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getEventos(params?: {
  q?: string
  estado?: string
}): Promise<Evento[]> {
  if (USE_MOCK) {
    const { mockEventos } = await import('@/data/mock')
    let result = [...mockEventos]
    if (params?.q) {
      const q = params.q.toLowerCase()
      result = result.filter((e) => e.nombre.toLowerCase().includes(q))
    }
    if (params?.estado) {
      result = result.filter((e) => e.estado === params.estado)
    }
    return result
  }
  return apiGet<Evento[]>('/events', {
    q: params?.q,
    estado: params?.estado,
  })
}

export async function getEventoById(id: string): Promise<Evento | null> {
  if (USE_MOCK) {
    const { mockEventos } = await import('@/data/mock')
    return mockEventos.find((e) => e.id === id) ?? null
  }
  return apiGetOrNull<Evento>(`/events/${id}`)
}

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

export async function getEventoFull(id: string): Promise<EventoFull | null> {
  if (USE_MOCK) {
    const {
      mockEventos,
      mockClientes,
      mockPaquetes,
      mockLineasPresupuesto,
      mockTareas,
      mockODPs,
      mockProveedores,
      mockContratos,
    } = await import('@/data/mock')

    const evento = mockEventos.find((e) => e.id === id)
    if (!evento) return null

    return {
      evento,
      cliente: mockClientes.find((c) => c.id === evento.clienteId),
      paquete: mockPaquetes.find((p) => p.id === evento.paqueteId),
      lineas: mockLineasPresupuesto.filter((l) => l.eventoId === evento.id),
      tareas: mockTareas.filter((t) => t.eventoId === evento.id),
      odps: mockODPs.filter((o) => o.eventoId === evento.id),
      proveedores: [...mockProveedores],
      contratos: mockContratos.filter((c) => c.eventoId === evento.id),
    }
  }
  return apiGetOrNull<EventoFull>(`/events/${id}/full`)
}

export async function createEvento(
  data: Omit<Evento, 'id' | 'creadoEn' | 'actualizadoEn'>,
): Promise<Evento> {
  if (USE_MOCK) {
    const now = new Date().toISOString()
    return {
      ...data,
      id: `evento-${Date.now()}`,
      creadoEn: now,
      actualizadoEn: now,
    }
  }
  return apiPost<Evento>('/events', data)
}

export async function updateEvento(
  id: string,
  data: Partial<Evento>,
): Promise<Evento> {
  if (USE_MOCK) {
    const { mockEventos } = await import('@/data/mock')
    const existing = mockEventos.find((e) => e.id === id)
    if (!existing) throw new Error(`Evento ${id} not found`)
    return {
      ...existing,
      ...data,
      actualizadoEn: new Date().toISOString(),
    }
  }
  return apiPut<Evento>(`/events/${id}`, data)
}

export async function deleteEvento(id: string): Promise<void> {
  if (USE_MOCK) {
    return
  }
  return apiDelete(`/events/${id}`)
}
