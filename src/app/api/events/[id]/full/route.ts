import { authenticated, notFound } from '@/lib/api-handler'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const evento = await tx.evento.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    include: {
      cliente: true,
      paquete: true,
      budget: { include: { vendor: true } },
      tareas: { orderBy: { orden: 'asc' } },
      contratos: true,
      odps: { include: { vendor: true } },
      vendors: { include: { vendor: true } },
    },
  })
  if (!evento) throw notFound()
  return evento
})
