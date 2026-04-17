import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updatePlannerSchema } from '@/lib/validators'

export const GET = authenticated(async ({ tx, tenant }) => {
  const planner = await tx.planner.findUnique({ where: { id: tenant.plannerId } })
  if (!planner) throw notFound('Planner no existe')
  return planner
})

export const PUT = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, updatePlannerSchema)
  return tx.planner.update({ where: { id: tenant.plannerId }, data })
})
