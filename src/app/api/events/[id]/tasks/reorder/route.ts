import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { reorderTareasSchema } from '@/lib/validators'

type Params = { id: string }

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const { items } = await parseJson(req, reorderTareasSchema)

  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  for (const { id, orden } of items) {
    await tx.tarea.updateMany({
      where: { id, eventoId: params.id, plannerId: tenant.plannerId },
      data: { orden },
    })
  }

  return { ok: true, count: items.length }
})
