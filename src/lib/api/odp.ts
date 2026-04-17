import type { ODP } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut } from './client'

export async function getODPsByEvento(eventoId: string): Promise<ODP[]> {
  return apiGet<ODP[]>(`/events/${eventoId}/odps`)
}

export async function getODPsByProveedor(proveedorId: string): Promise<ODP[]> {
  return apiGet<ODP[]>(`/vendors/${proveedorId}/odps`)
}

export async function getODPById(id: string): Promise<ODP | null> {
  return apiGetOrNull<ODP>(`/odps/${id}`)
}

export async function createODP(
  data: Omit<ODP, 'id' | 'plannerId'>,
): Promise<ODP> {
  return apiPost<ODP>('/odps', data)
}

export async function updateODP(id: string, data: Partial<ODP>): Promise<ODP> {
  return apiPut<ODP>(`/odps/${id}`, data)
}
