import { authenticated } from '@/lib/api-handler'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  return tx.contrato.findMany({
    where: { eventoId: params.id, plannerId: tenant.plannerId },
    orderBy: { fechaCreacion: 'desc' },
  })
})
