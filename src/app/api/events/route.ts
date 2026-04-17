import { authenticated, parseJson, parseQuery } from '@/lib/api-handler'
import { createEventoSchema, listEventosQuery } from '@/lib/validators'

export const GET = authenticated(async ({ req, tx, tenant }) => {
  const { q, estado, clienteId } = parseQuery(req, listEventosQuery)

  return tx.evento.findMany({
    where: {
      plannerId: tenant.plannerId,
      ...(estado ? { estado } : {}),
      ...(clienteId ? { clienteId } : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: 'insensitive' } },
              { venue: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { cliente: true, paquete: true },
    orderBy: { fecha: 'asc' },
  })
})

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createEventoSchema)
  return tx.evento.create({
    data: {
      ...data,
      fecha: new Date(data.fecha),
      plannerId: tenant.plannerId,
    },
  })
})
