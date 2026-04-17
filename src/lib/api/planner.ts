import type { Planner } from '@/types'
import { apiGet, apiPut } from './client'

export async function getPlanner(): Promise<Planner> {
  return apiGet<Planner>('/planner/me')
}

export async function updatePlanner(data: Partial<Planner>): Promise<Planner> {
  return apiPut<Planner>('/planner/me', data)
}
