import type { Contrato } from '@/types'
import { apiGet, apiPost, apiPut } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getContratosByEvento(
  eventoId: string,
): Promise<Contrato[]> {
  if (USE_MOCK) {
    const { mockContratos } = await import('@/data/mock')
    return mockContratos.filter((c) => c.eventoId === eventoId)
  }
  return apiGet<Contrato[]>(`/events/${eventoId}/contracts`)
}

export async function getContratos(params?: {
  tipo?: string
  estado?: string
}): Promise<Contrato[]> {
  if (USE_MOCK) {
    const { mockContratos } = await import('@/data/mock')
    let result = [...mockContratos]
    if (params?.tipo) {
      result = result.filter((c) => c.tipo === params.tipo)
    }
    if (params?.estado) {
      result = result.filter((c) => c.estado === params.estado)
    }
    return result
  }
  return apiGet<Contrato[]>('/contracts', {
    tipo: params?.tipo,
    estado: params?.estado,
  })
}

export async function getContratosByContraparteId(
  contraparteId: string,
  tipo?: string,
): Promise<Contrato[]> {
  if (USE_MOCK) {
    const { mockContratos } = await import('@/data/mock')
    return mockContratos.filter(
      (c) =>
        c.contraparteId === contraparteId &&
        (tipo ? c.tipo === tipo : true),
    )
  }
  return apiGet<Contrato[]>('/contracts', {
    contraparteId,
    tipo,
  })
}

export async function createContrato(
  data: Omit<Contrato, 'id'>,
): Promise<Contrato> {
  if (USE_MOCK) {
    return {
      ...data,
      id: `contrato-${Date.now()}`,
    }
  }
  return apiPost<Contrato>('/contracts', data)
}

export async function updateContrato(
  id: string,
  data: Partial<Contrato>,
): Promise<Contrato> {
  if (USE_MOCK) {
    const { mockContratos } = await import('@/data/mock')
    const existing = mockContratos.find((c) => c.id === id)
    if (!existing) throw new Error(`Contrato ${id} not found`)
    return { ...existing, ...data }
  }
  return apiPut<Contrato>(`/contracts/${id}`, data)
}
