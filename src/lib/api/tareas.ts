import type { Tarea } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getTareasByEvento(eventoId: string): Promise<Tarea[]> {
  if (USE_MOCK) {
    const { mockTareas } = await import('@/data/mock')
    return mockTareas
      .filter((t) => t.eventoId === eventoId)
      .sort((a, b) => a.orden - b.orden)
  }
  return apiGet<Tarea[]>(`/events/${eventoId}/tasks`)
}

export async function createTarea(
  data: Omit<Tarea, 'id'>,
): Promise<Tarea> {
  if (USE_MOCK) {
    return {
      ...data,
      id: `tarea-${Date.now()}`,
    }
  }
  return apiPost<Tarea>(`/events/${data.eventoId}/tasks`, data)
}

export async function updateTarea(
  id: string,
  data: Partial<Tarea>,
): Promise<Tarea> {
  if (USE_MOCK) {
    const { mockTareas } = await import('@/data/mock')
    const existing = mockTareas.find((t) => t.id === id)
    if (!existing) throw new Error(`Tarea ${id} not found`)
    return { ...existing, ...data }
  }
  return apiPut<Tarea>(`/tasks/${id}`, data)
}

export async function deleteTarea(id: string): Promise<void> {
  if (USE_MOCK) {
    return
  }
  return apiDelete(`/tasks/${id}`)
}

export async function reorderTareas(
  eventoId: string,
  tareaIds: string[],
): Promise<void> {
  if (USE_MOCK) {
    return
  }
  return apiPut<void>(`/events/${eventoId}/tasks/reorder`, { tareaIds })
}
