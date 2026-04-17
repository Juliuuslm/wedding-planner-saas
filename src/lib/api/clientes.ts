import type { Cliente } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from './client'

export async function getClientes(params?: {
  q?: string
  estado?: string
}): Promise<Cliente[]> {
  return apiGet<Cliente[]>('/clients', {
    q: params?.q,
    estado: params?.estado,
  })
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  return apiGetOrNull<Cliente>(`/clients/${id}`)
}

export async function createCliente(
  data: Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn' | 'plannerId'>,
): Promise<Cliente> {
  return apiPost<Cliente>('/clients', data)
}

export async function updateCliente(
  id: string,
  data: Partial<Cliente>,
): Promise<Cliente> {
  return apiPut<Cliente>(`/clients/${id}`, data)
}

export async function deleteCliente(id: string): Promise<void> {
  return apiDelete(`/clients/${id}`)
}
