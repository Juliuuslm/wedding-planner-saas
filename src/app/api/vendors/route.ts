import { authenticated, parseJson, parseQuery } from '@/lib/api-handler'
import { createVendorSchema, listVendorsQuery } from '@/lib/validators'

export const GET = authenticated(async ({ req, tx, tenant }) => {
  const { search, categoria } = parseQuery(req, listVendorsQuery)

  return tx.vendor.findMany({
    where: {
      plannerId: tenant.plannerId,
      ...(categoria ? { categoria } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { contacto: { contains: search, mode: 'insensitive' } },
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
