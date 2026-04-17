import type { Planner } from '@/types'
import { apiGet, apiPut } from './client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getPlanner(): Promise<Planner> {
  if (USE_MOCK) {
    const { mockPlanner } = await import('@/data/mock')
    return { ...mockPlanner }
  }
  return apiGet<Planner>('/planner/me')
}

export async function updatePlanner(data: Partial<Planner>): Promise<Planner> {
  if (USE_MOCK) {
    return { ...(await getPlanner()), ...data }
  }
  return apiPut<Planner>('/planner/me', data)
}
