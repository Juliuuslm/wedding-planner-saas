import { authenticated, parseJson, notFound } from '@/lib/api-handler'
import { updateVendorSchema } from '@/lib/validators'

type Params = { id: string }

export const GET = authenticated<Params>(async ({ params, tx, tenant }) => {
  const vendor = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
  })
  if (!vendor) throw notFound()
  return vendor
})

export const PUT = authenticated<Params>(async ({ req, params, tx, tenant }) => {
  const data = await parseJson(req, updateVendorSchema)
  const existing = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  const { sitioWeb, ...rest } = data
  return tx.vendor.update({
    where: { id: params.id },
    data: { ...rest, ...(sitioWeb !== undefined ? { sitioWeb: sitioWeb === '' ? null : sitioWeb } : {}) },
  })
})

export const DELETE = authenticated<Params>(async ({ params, tx, tenant }) => {
  const existing = await tx.vendor.findFirst({
    where: { id: params.id, plannerId: tenant.plannerId },
    select: { id: true },
  })
  if (!existing) throw notFound()
  await tx.vendor.delete({ where: { id: params.id } })
  return { ok: true }
})
