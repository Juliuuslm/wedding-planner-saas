import { authenticated, parseJson, parseQuery, notFound } from '@/lib/api-handler'
import { createContratoSchema, listContratosQuery } from '@/lib/validators'

export const GET = authenticated(async ({ req, tx, tenant }) => {
  const { eventoId, tipo, estado, contraparteId } = parseQuery(req, listContratosQuery)
  return tx.contrato.findMany({
    where: {
      plannerId: tenant.plannerId,
      ...(eventoId ? { eventoId } : {}),
      ...(tipo ? { tipo } : {}),
      ...(estado ? { estado } : {}),
      ...(contraparteId ? { contraparteId } : {}),
    },
    orderBy: { fechaCreacion: 'desc' },
  })
})

export const POST = authenticated(async ({ req, tx, tenant }) => {
  const data = await parseJson(req, createContratoSchema)
  const evento = await tx.evento.findFirst({
    where: { id: data.eventoId, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!evento) throw notFound('Evento no existe')

  return tx.contrato.create({
    data: {
      ...data,
      fechaEnvio: data.fechaEnvio ? new Date(data.fechaEnvio) : null,
      fechaFirma: data.fechaFirma ? new Date(data.fechaFirma) : null,
      plannerId: tenant.plannerId,
    },
  })
})
