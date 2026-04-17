import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { createOdpSchema } from '@/lib/validators'

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createOdpSchema)

  const [evento, vendor] = await Promise.all([
    tx.evento.findFirst({
      where: { id: data.eventoId, plannerId: tenant.plannerId },
      select: { id: true },
    }),
    tx.vendor.findFirst({
      where: { id: data.proveedorId, plannerId: tenant.plannerId },
      select: { id: true },
    }),
  ])
  if (!evento) throw notFound('Evento no existe')
  if (!vendor) throw notFound('Proveedor no existe')

  return tx.odp.create({
    data: {
      ...data,
      fecha: new Date(data.fecha),
      plannerId: tenant.plannerId,
    },
  })
})
