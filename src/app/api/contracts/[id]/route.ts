import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateContratoSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const contrato = await tx.contrato.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
  })
  if (!contrato) throw notFound()
  return contrato
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const raw = await parseJson(req, updateContratoSchema)
  const existing = await tx.contrato.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()

  const { fechaEnvio, fechaFirma, ...rest } = raw
  return tx.contrato.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(fechaEnvio !== undefined
        ? { fechaEnvio: fechaEnvio ? new Date(fechaEnvio) : null }
        : {}),
      ...(fechaFirma !== undefined
        ? { fechaFirma: fechaFirma ? new Date(fechaFirma) : null }
        : {}),
    },
  })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.contrato.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.contrato.delete({ where: { id: params.id } })
  return { ok: true }
})
