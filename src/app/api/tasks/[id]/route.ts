import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateTareaSchema } from '@/lib/validators'

type Params = { id: string }

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const raw = await parseJson(req, updateTareaSchema)
  const existing = await tx.tarea.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()

  const { fechaVencimiento, fechaInicio, ...rest } = raw
  return tx.tarea.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(fechaVencimiento ? { fechaVencimiento: new Date(fechaVencimiento) } : {}),
      ...(fechaInicio !== undefined
        ? { fechaInicio: fechaInicio ? new Date(fechaInicio) : null }
        : {}),
    },
  })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.tarea.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.tarea.delete({ where: { id: params.id } })
  return { ok: true }
})
