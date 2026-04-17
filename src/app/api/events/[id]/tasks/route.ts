import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { createTareaSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  return tx.tarea.findMany({
    where: { eventoId: params.id, plannerId: tenant.plannerId },
    orderBy: { orden: 'asc' },
  })
})

export const POST = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, createTareaSchema)
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  return tx.tarea.create({
    data: {
      ...data,
      fechaVencimiento: new Date(data.fechaVencimiento),
      fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
      eventoId: params.id,
      plannerId: tenant.plannerId,
    },
  })
})
