import { authenticated, parseJson } from '@/lib/api-handler'
import { createPaqueteSchema } from '@/lib/validators'

export const GET = authenticated(async ({ tx, tenant }) => {
  return tx.paquete.findMany({
    where: { plannerId: tenant.plannerId },
    orderBy: { creadoEn: 'desc' },
  })
})

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createPaqueteSchema)
  return tx.paquete.create({
    data: { ...data, plannerId: tenant.plannerId },
  })
})
