import type { Presupuesto, LineaPresupuesto } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

export async function getPresupuestoByEvento(eventoId: string): Promise<Presupuesto> {
  return apiGet<Presupuesto>(`/events/${eventoId}/budget`)
}

export async function createLineaPresupuesto(
  data: Omit<LineaPresupuesto, 'id' | 'plannerId'>,
): Promise<LineaPresupuesto> {
  return apiPost<LineaPresupuesto>(`/events/${data.eventoId}/budget`, data)
}

export async function updateLineaPresupuesto(
  id: string,
  data: Partial<LineaPresupuesto>,
): Promise<LineaPresupuesto> {
  return apiPut<LineaPresupuesto>(`/budget/lines/${id}`, data)
}

export async function deleteLineaPresupuesto(id: string): Promise<void> {
  return apiDelete(`/budget/lines/${id}`)
}
