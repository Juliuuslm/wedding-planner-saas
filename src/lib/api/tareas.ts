import type { Tarea } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

export async function getTareasByEvento(eventoId: string): Promise<Tarea[]> {
  return apiGet<Tarea[]>(`/events/${eventoId}/tasks`)
}

export async function createTarea(
  data: Omit<Tarea, 'id' | 'plannerId'>,
): Promise<Tarea> {
  return apiPost<Tarea>(`/events/${data.eventoId}/tasks`, data)
}

export async function updateTarea(id: string, data: Partial<Tarea>): Promise<Tarea> {
  return apiPut<Tarea>(`/tasks/${id}`, data)
}

export async function deleteTarea(id: string): Promise<void> {
  return apiDelete(`/tasks/${id}`)
}

export async function reorderTareas(
  eventoId: string,
  items: Array<{ id: string; orden: number }>,
): Promise<void> {
  await apiPut<{ ok: boolean }>(`/events/${eventoId}/tasks/reorder`, { items })
}
