import type { Presupuesto, LineaPresupuesto } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getPresupuestoByEvento(
  eventoId: string,
): Promise<Presupuesto> {
  if (USE_MOCK) {
    const { mockLineasPresupuesto } = await import('@/data/mock')
    const lineas = mockLineasPresupuesto.filter(
      (l) => l.eventoId === eventoId,
    )
    const totalEstimado = lineas.reduce((s, l) => s + l.montoEstimado, 0)
    const totalReal = lineas.reduce(
      (s, l) => s + (l.montoReal ?? l.montoEstimado),
      0,
    )
    const totalPagado = lineas.reduce((s, l) => s + l.montoPagado, 0)
    return { eventoId, lineas, totalEstimado, totalReal, totalPagado }
  }
  return apiGet<Presupuesto>(`/events/${eventoId}/budget`)
}

export async function createLineaPresupuesto(
  data: Omit<LineaPresupuesto, 'id'>,
): Promise<LineaPresupuesto> {
  if (USE_MOCK) {
    return {
      ...data,
      id: `linea-${Date.now()}`,
    }
  }
  return apiPost<LineaPresupuesto>(
    `/events/${data.eventoId}/budget/lines`,
    data,
  )
}

export async function updateLineaPresupuesto(
  id: string,
  data: Partial<LineaPresupuesto>,
): Promise<LineaPresupuesto> {
  if (USE_MOCK) {
    const { mockLineasPresupuesto } = await import('@/data/mock')
    const existing = mockLineasPresupuesto.find((l) => l.id === id)
    if (!existing) throw new Error(`LineaPresupuesto ${id} not found`)
    return { ...existing, ...data }
  }
  return apiPut<LineaPresupuesto>(`/budget/lines/${id}`, data)
}

export async function deleteLineaPresupuesto(id: string): Promise<void> {
  if (USE_MOCK) {
    return
  }
  return apiDelete(`/budget/lines/${id}`)
}
