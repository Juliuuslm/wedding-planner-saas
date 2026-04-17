import { authenticated, parseJson, parseQuery } from '@/lib/api-handler'
import { createClienteSchema, listClientesQuery } from '@/lib/validators'

export const GET = authenticated(async ({ req, tx, tenant }) => {
  const { search, estado } = parseQuery(req, listClientesQuery)

  return tx.cliente.findMany({
    where: {
      plannerId: tenant.plannerId,
      ...(estado ? { estado } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { apellido: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { creadoEn: 'desc' },
  })
})

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createClienteSchema)
  return tx.cliente.create({
    data: { ...data, plannerId: tenant.plannerId },
  })
})
