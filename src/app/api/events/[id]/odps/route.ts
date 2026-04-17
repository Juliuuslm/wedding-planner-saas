import { authenticated } from '@/lib/api-handler'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  return tx.odp.findMany({
    where: { eventoId: params.id, plannerId: tenant.plannerId },
    include: { vendor: true },
    orderBy: { fecha: 'asc' },
  })
})
