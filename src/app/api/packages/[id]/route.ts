import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updatePaqueteSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const paquete = await tx.paquete.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
  })
  if (!paquete) throw notFound()
  return paquete
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, updatePaqueteSchema)
  const existing = await tx.paquete.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  return tx.paquete.update({ where: { id: params.id }, data })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.paquete.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.paquete.delete({ where: { id: params.id } })
  return { ok: true }
})
