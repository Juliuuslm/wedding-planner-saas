import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateServicioSchema } from '@/lib/validators'

// PATCH /api/vendors/[id]/services/[serviceId]
export const PATCH = authenticated<{ id: string; serviceId: string }>(
  async ({ req, tx, tenant, params }) => {
    const existing = await tx.servicioProveedor.findFirst({
      where: {
        id: params.serviceId,
        proveedorId: params.id,
        plannerId: tenant.plannerId,
      },
      select: { id: true },
    })
    if (!existing) throw notFound('Servicio no encontrado')

    const data = await parseJson(req, updateServicioSchema)

    return tx.servicioProveedor.update({
      where: { id: params.serviceId },
      data,
    })
  },
)

// DELETE /api/vendors/[id]/services/[serviceId]
export const DELETE = authenticated<{ id: string; serviceId: string }>(
  async ({ tx, tenant, params }) => {
    const existing = await tx.servicioProveedor.findFirst({
      where: {
        id: params.serviceId,
        proveedorId: params.id,
        plannerId: tenant.plannerId,
      },
      select: { id: true },
    })
    if (!existing) throw notFound('Servicio no encontrado')

    await tx.servicioProveedor.delete({ where: { id: params.serviceId } })
    return { ok: true }
  },
)
