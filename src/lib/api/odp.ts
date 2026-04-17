import type { ODP } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getODPsByEvento(eventoId: string): Promise<ODP[]> {
  if (USE_MOCK) {
    const { mockODPs } = await import('@/data/mock')
    return mockODPs.filter((o) => o.eventoId === eventoId)
  }
  return apiGet<ODP[]>(`/events/${eventoId}/odps`)
}

export async function getODPsByProveedor(
  proveedorId: string,
): Promise<ODP[]> {
  if (USE_MOCK) {
    const { mockODPs } = await import('@/data/mock')
    return mockODPs.filter((o) => o.proveedorId === proveedorId)
  }
  return apiGet<ODP[]>(`/vendors/${proveedorId}/odps`)
}

export async function getODPById(id: string): Promise<ODP | null> {
  if (USE_MOCK) {
    const { mockODPs } = await import('@/data/mock')
    return mockODPs.find((o) => o.id === id) ?? null
  }
  return apiGetOrNull<ODP>(`/odps/${id}`)
}

export async function createODP(
  data: Omit<ODP, 'id'>,
): Promise<ODP> {
  if (USE_MOCK) {
    return {
      ...data,
      id: `odp-${Date.now()}`,
    }
  }
  return apiPost<ODP>('/odps', data)
}

export async function updateODP(
  id: string,
  data: Partial<ODP>,
): Promise<ODP> {
  if (USE_MOCK) {
    const { mockODPs } = await import('@/data/mock')
    const existing = mockODPs.find((o) => o.id === id)
    if (!existing) throw new Error(`ODP ${id} not found`)
    return { ...existing, ...data }
  }
  return apiPut<ODP>(`/odps/${id}`, data)
}
