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

export async function getEventos(params?: {
  q?: string
  estado?: string
}): Promise<Evento[]> {
  return apiGet<Evento[]>('/events', {
    q: params?.q,
    estado: params?.estado,
  })
}

export async function getEventoById(id: string): Promise<Evento | null> {
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
  return apiGetOrNull<EventoFull>(`/events/${id}/full`)
}

export async function createEvento(
  data: Omit<Evento, 'id' | 'creadoEn' | 'actualizadoEn' | 'plannerId'>,
): Promise<Evento> {
  return apiPost<Evento>('/events', data)
}

export async function updateEvento(
  id: string,
  data: Partial<Evento>,
): Promise<Evento> {
  return apiPut<Evento>(`/events/${id}`, data)
}

export async function deleteEvento(id: string): Promise<void> {
  return apiDelete(`/events/${id}`)
}
