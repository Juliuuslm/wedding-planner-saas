import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateBudgetLineSchema } from '@/lib/validators'

type Params = { id: string }

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, updateBudgetLineSchema)
  const existing = await tx.lineaPresupuesto.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  return tx.lineaPresupuesto.update({ where: { id: params.id }, data })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.lineaPresupuesto.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.lineaPresupuesto.delete({ where: { id: params.id } })
  return { ok: true }
})
