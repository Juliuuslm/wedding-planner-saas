import { authenticated, parseJson, parseQuery, notFound } from '@/lib/api-handler'
import { createServicioSchema, listServiciosQuery } from '@/lib/validators'

// GET /api/vendors/[id]/services — listar catálogo del proveedor
export const GET = authenticated<{ id: string }>(async ({ req, tx, tenant, params }) => {
  // Validar que el proveedor pertenece al tenant
  const vendor = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!vendor) throw notFound('Proveedor no encontrado')

  const { q, categoria, disponible } = parseQuery(req, listServiciosQuery)

  return tx.servicioProveedor.findMany({
    where: {
      plannerId: tenant.plannerId,
      proveedorId: params.id,
      ...(categoria ? { categoria } : {}),
      ...(disponible ? { disponible: disponible === 'true' } : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: 'insensitive' } },
              { descripcion: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }],
  })
})

// POST /api/vendors/[id]/services — crear un servicio
export const POST = authenticated<{ id: string }>(async ({ req, tx, tenant, params }) => {
  const vendor = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!vendor) throw notFound('Proveedor no encontrado')

  const data = await parseJson(req, createServicioSchema)

  return tx.servicioProveedor.create({
    data: {
      ...data,
      proveedorId: params.id,
      plannerId: tenant.plannerId,
    },
  })
})
