import type { Paquete } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from './client'

export async function getPaquetes(): Promise<Paquete[]> {
  return apiGet<Paquete[]>('/packages')
}

export async function getPaqueteById(id: string): Promise<Paquete | null> {
  return apiGetOrNull<Paquete>(`/packages/${id}`)
}

export async function createPaquete(
  data: Omit<Paquete, 'id' | 'plannerId'>,
): Promise<Paquete> {
  return apiPost<Paquete>('/packages', data)
}

export async function updatePaquete(
  id: string,
  data: Partial<Paquete>,
): Promise<Paquete> {
  return apiPut<Paquete>(`/packages/${id}`, data)
}

export async function deletePaquete(id: string): Promise<void> {
  return apiDelete(`/packages/${id}`)
}
