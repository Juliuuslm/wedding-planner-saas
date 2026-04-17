import type { Proveedor } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getProveedores(params?: {
  categoria?: string
  q?: string
}): Promise<Proveedor[]> {
  if (USE_MOCK) {
    const { mockProveedores } = await import('@/data/mock')
    let result = [...mockProveedores]
    if (params?.q) {
      const q = params.q.toLowerCase()
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q),
      )
    }
    if (params?.categoria) {
      result = result.filter((p) => p.categoria === params.categoria)
    }
    return result
  }
  return apiGet<Proveedor[]>('/vendors', {
    q: params?.q,
    categoria: params?.categoria,
  })
}

export async function getProveedorById(
  id: string,
): Promise<Proveedor | null> {
  if (USE_MOCK) {
    const { mockProveedores } = await import('@/data/mock')
    return mockProveedores.find((p) => p.id === id) ?? null
  }
  return apiGetOrNull<Proveedor>(`/vendors/${id}`)
}

export async function createProveedor(
  data: Omit<Proveedor, 'id' | 'creadoEn'>,
): Promise<Proveedor> {
  if (USE_MOCK) {
    return {
      ...data,
      id: `proveedor-${Date.now()}`,
      creadoEn: new Date().toISOString(),
    }
  }
  return apiPost<Proveedor>('/vendors', data)
}

export async function updateProveedor(
  id: string,
  data: Partial<Proveedor>,
): Promise<Proveedor> {
  if (USE_MOCK) {
    const { mockProveedores } = await import('@/data/mock')
    const existing = mockProveedores.find((p) => p.id === id)
    if (!existing) throw new Error(`Proveedor ${id} not found`)
    return { ...existing, ...data }
  }
  return apiPut<Proveedor>(`/vendors/${id}`, data)
}
