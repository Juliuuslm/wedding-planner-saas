import type { Cliente } from '@/types'
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getClientes(params?: {
  q?: string
  estado?: string
}): Promise<Cliente[]> {
  if (USE_MOCK) {
    const { mockClientes } = await import('@/data/mock')
    let result = [...mockClientes]
    if (params?.q) {
      const q = params.q.toLowerCase()
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.apellido.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      )
    }
    if (params?.estado) {
      result = result.filter((c) => c.estado === params.estado)
    }
    return result
  }
  return apiGet<Cliente[]>('/clients', {
    q: params?.q,
    estado: params?.estado,
  })
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  if (USE_MOCK) {
    const { mockClientes } = await import('@/data/mock')
    return mockClientes.find((c) => c.id === id) ?? null
  }
  return apiGetOrNull<Cliente>(`/clients/${id}`)
}

export async function createCliente(
  data: Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn'>,
): Promise<Cliente> {
  if (USE_MOCK) {
    const now = new Date().toISOString()
    return {
      ...data,
      id: `cliente-${Date.now()}`,
      creadoEn: now,
      actualizadoEn: now,
    }
  }
  return apiPost<Cliente>('/clients', data)
}

export async function updateCliente(
  id: string,
  data: Partial<Cliente>,
): Promise<Cliente> {
  if (USE_MOCK) {
    const { mockClientes } = await import('@/data/mock')
    const existing = mockClientes.find((c) => c.id === id)
    if (!existing) throw new Error(`Cliente ${id} not found`)
    return {
      ...existing,
      ...data,
      actualizadoEn: new Date().toISOString(),
    }
  }
  return apiPut<Cliente>(`/clients/${id}`, data)
}

export async function deleteCliente(id: string): Promise<void> {
  if (USE_MOCK) {
    return
  }
  return apiDelete(`/clients/${id}`)
}
