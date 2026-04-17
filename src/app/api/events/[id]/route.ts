import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateEventoSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    include: { cliente: true, paquete: true },
  })
  if (!evento) throw notFound()
  return evento
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const raw = await parseJson(req, updateEventoSchema)
  const existing = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()

  const { fecha, ...rest } = raw
  return tx.evento.update({
    where: { id: params.id },
    data: { ...rest, ...(fecha ? { fecha: new Date(fecha) } : {}) },
  })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.evento.delete({ where: { id: params.id } })
  return { ok: true }
})
