import type { Proveedor } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut } from './client'

export async function getProveedores(params?: {
  q?: string
  categoria?: string
}): Promise<Proveedor[]> {
  return apiGet<Proveedor[]>('/vendors', {
    q: params?.q,
    categoria: params?.categoria,
  })
}

export async function getProveedorById(id: string): Promise<Proveedor | null> {
  return apiGetOrNull<Proveedor>(`/vendors/${id}`)
}

export async function createProveedor(
  data: Omit<Proveedor, 'id' | 'creadoEn' | 'plannerId'>,
): Promise<Proveedor> {
  return apiPost<Proveedor>('/vendors', data)
}

export async function updateProveedor(
  id: string,
  data: Partial<Proveedor>,
): Promise<Proveedor> {
  return apiPut<Proveedor>(`/vendors/${id}`, data)
}
