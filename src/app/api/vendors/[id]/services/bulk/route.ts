import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { bulkServiciosSchema } from '@/lib/validators'

// POST /api/vendors/[id]/services/bulk — import masivo (CSV)
export const POST = authenticated<{ id: string }>(async ({ req, tx, tenant, params }) => {
  const vendor = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!vendor) throw notFound('Proveedor no encontrado')

  const { servicios } = await parseJson(req, bulkServiciosSchema)

  const created = await tx.servicioProveedor.createMany({
    data: servicios.map((s) => ({
      ...s,
      proveedorId: params.id,
      plannerId: tenant.plannerId,
    })),
  })

  return { count: created.count }
})
