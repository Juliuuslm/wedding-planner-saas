import { authenticated, parseJson, parseQuery } from '@/lib/api-handler'
import { createVendorSchema, listVendorsQuery } from '@/lib/validators'

export const GET = authenticated(async ({ req, tx, tenant }) => {
  const { q, categoria } = parseQuery(req, listVendorsQuery)

  return tx.vendor.findMany({
    where: {
      plannerId: tenant.plannerId,
      ...(categoria ? { categoria } : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { contacto: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { nombre: 'asc' },
  })
})

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createVendorSchema)
  const { sitioWeb, ...rest } = data
  return tx.vendor.create({
    data: {
      ...rest,
      sitioWeb: sitioWeb === '' ? null : sitioWeb,
      servicios: data.servicios ?? [],
      plannerId: tenant.plannerId,
    },
  })
})
