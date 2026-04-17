import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateOdpSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const odp = await tx.odp.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    include: {
      evento: { select: { id: true, nombre: true, fecha: true, venue: true } },
      vendor: true,
    },
  })
  if (!odp) throw notFound()
  return odp
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const raw = await parseJson(req, updateOdpSchema)
  const existing = await tx.odp.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()

  const { fecha, ...rest } = raw
  return tx.odp.update({
    where: { id: params.id },
    data: { ...rest, ...(fecha ? { fecha: new Date(fecha) } : {}) },
  })
})
