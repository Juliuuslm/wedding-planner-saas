import type { Contrato } from '@/types'
import { apiGet, apiPost, apiPut } from './client'

export async function getContratos(params?: {
  eventoId?: string
  tipo?: string
  estado?: string
  contraparteId?: string
}): Promise<Contrato[]> {
  return apiGet<Contrato[]>('/contracts', {
    eventoId: params?.eventoId,
    tipo: params?.tipo,
    estado: params?.estado,
    contraparteId: params?.contraparteId,
  })
}

export async function getContratosByEvento(eventoId: string): Promise<Contrato[]> {
  return apiGet<Contrato[]>(`/events/${eventoId}/contracts`)
}

export async function getContratosByContraparteId(
  contraparteId: string,
  tipo?: 'cliente' | 'proveedor',
): Promise<Contrato[]> {
  return apiGet<Contrato[]>('/contracts', { contraparteId, tipo })
}

export async function createContrato(
  data: Omit<Contrato, 'id' | 'fechaCreacion' | 'plannerId'>,
): Promise<Contrato> {
  return apiPost<Contrato>('/contracts', data)
}

export async function updateContrato(
  id: string,
  data: Partial<Contrato>,
): Promise<Contrato> {
  return apiPut<Contrato>(`/contracts/${id}`, data)
}
