import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { createBudgetLineSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  const lineas = await tx.lineaPresupuesto.findMany({
    where: { eventoId: params.id, plannerId: tenant.plannerId },
    include: { vendor: true },
  })

  const totalEstimado = lineas.reduce((s, l) => s + l.montoEstimado, 0)
  const totalReal = lineas.reduce((s, l) => s + (l.montoReal ?? l.montoEstimado), 0)
  const totalPagado = lineas.reduce((s, l) => s + l.montoPagado, 0)

  return { eventoId: params.id, lineas, totalEstimado, totalReal, totalPagado }
})

export const POST = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, createBudgetLineSchema)
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  return tx.lineaPresupuesto.create({
    data: { ...data, eventoId: params.id, plannerId: tenant.plannerId },
  })
})
