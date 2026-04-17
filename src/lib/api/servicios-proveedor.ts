import type { ServicioProveedor } from '@/types'
import { apiGet, apiPost, apiPatch, apiDelete } from './client'

export async function getServicios(
  proveedorId: string,
  params?: { q?: string; categoria?: string; disponible?: boolean },
): Promise<ServicioProveedor[]> {
  return apiGet<ServicioProveedor[]>(`/vendors/${proveedorId}/services`, {
    q: params?.q,
    categoria: params?.categoria,
    disponible:
      params?.disponible === undefined ? undefined : params.disponible ? 'true' : 'false',
  })
}

export async function createServicio(
  proveedorId: string,
  data: Omit<ServicioProveedor, 'id' | 'plannerId' | 'proveedorId' | 'creadoEn' | 'actualizadoEn'>,
): Promise<ServicioProveedor> {
  return apiPost<ServicioProveedor>(`/vendors/${proveedorId}/services`, data)
}

export async function updateServicio(
  proveedorId: string,
  servicioId: string,
  data: Partial<Omit<ServicioProveedor, 'id' | 'plannerId' | 'proveedorId'>>,
): Promise<ServicioProveedor> {
  return apiPatch<ServicioProveedor>(`/vendors/${proveedorId}/services/${servicioId}`, data)
}

export async function deleteServicio(proveedorId: string, servicioId: string): Promise<void> {
  return apiDelete(`/vendors/${proveedorId}/services/${servicioId}`)
}

export async function bulkCreateServicios(
  proveedorId: string,
  servicios: Array<Omit<ServicioProveedor, 'id' | 'plannerId' | 'proveedorId' | 'creadoEn' | 'actualizadoEn'>>,
): Promise<{ count: number }> {
  return apiPost<{ count: number }>(`/vendors/${proveedorId}/services/bulk`, { servicios })
}
