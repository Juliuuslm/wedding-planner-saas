import type { Paquete } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getPaquetes(): Promise<Paquete[]> {
  if (USE_MOCK) {
    const { mockPaquetes } = await import('@/data/mock')
    return [...mockPaquetes]
  }
  return apiGet<Paquete[]>('/packages')
}

export async function getPaqueteById(id: string): Promise<Paquete | null> {
  if (USE_MOCK) {
    const { mockPaquetes } = await import('@/data/mock')
    return mockPaquetes.find((p) => p.id === id) ?? null
  }
  return apiGetOrNull<Paquete>(`/packages/${id}`)
}

export async function createPaquete(data: Omit<Paquete, 'id'>): Promise<Paquete> {
  if (USE_MOCK) {
    return { id: `paq-${Date.now()}`, ...data }
  }
  return apiPost<Paquete>('/packages', data)
}

export async function updatePaquete(id: string, data: Partial<Paquete>): Promise<Paquete> {
  if (USE_MOCK) {
    const { mockPaquetes } = await import('@/data/mock')
    const existing = mockPaquetes.find((p) => p.id === id)
    return { ...(existing ?? { id, nombre: '', descripcion: '', precio: 0, servicios: [], activo: true }), ...data }
  }
  return apiPut<Paquete>(`/packages/${id}`, data)
}

export async function deletePaquete(id: string): Promise<void> {
  if (USE_MOCK) return
  return apiDelete(`/packages/${id}`)
}
