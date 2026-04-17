import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateClienteSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const cliente = await tx.cliente.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
  })
  if (!cliente) throw notFound()
  return cliente
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, updateClienteSchema)
  const existing = await tx.cliente.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  return tx.cliente.update({ where: { id: params.id }, data })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.cliente.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.cliente.delete({ where: { id: params.id } })
  return { ok: true }
})
