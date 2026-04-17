import { authenticated } from '@/lib/api-handler'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  return tx.odp.findMany({
    where: { proveedorId: params.id, plannerId: tenant.plannerId },
    include: { evento: { select: { id: true, nombre: true, fecha: true } } },
    orderBy: { fecha: 'asc' },
  })
})
