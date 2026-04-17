import { NextRequest, NextResponse } from 'next/server'
import { ZodError, type ZodType } from 'zod'
import { auth } from '@/lib/auth'
import { withTenant, type TxClient, type TenantContext } from '@/lib/db-tenant'

// ── Error tipos ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export const unauthorized = () => new ApiError(401, 'unauthorized', 'No autenticado')
export const forbidden = (msg = 'Sin permisos') => new ApiError(403, 'forbidden', msg)
export const notFound = (msg = 'No encontrado') => new ApiError(404, 'not_found', msg)
export const badRequest = (msg: string) => new ApiError(400, 'bad_request', msg)

// ── Wrapper para Route Handlers autenticados ──────────────────────────────

type HandlerContext<TParams = Record<string, string>> = {
  req: NextRequest
  params: TParams
  tenant: TenantContext
}

type Handler<TParams, TResponse> = (
  ctx: HandlerContext<TParams> & { tx: TxClient },
) => Promise<TResponse>

/**
 * Envuelve un Route Handler requiriendo sesión válida de Auth.js.
 * Extrae plannerId/role/scopeId del JWT y ejecuta el handler dentro de
 * `withTenant` para que RLS filtre datos por tenant.
 *
 * Uso:
 * ```ts
 * export const GET = authenticated(async ({ tx, tenant }) => {
 *   const events = await tx.evento.findMany({ where: { plannerId: tenant.plannerId } })
 *   return { events }
 * })
 * ```
 */
export function authenticated<
  TParams = Record<string, string>,
  TResponse = unknown,
>(handler: Handler<TParams, TResponse>) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<TParams> | TParams } = { params: {} as TParams },
  ) => {
    try {
      const session = await auth()
      if (!session?.user) throw unauthorized()

      const plannerId = session.user.plannerId
      if (!plannerId) throw forbidden('Usuario sin planner asignado')

      const tenant: TenantContext = {
        plannerId,
        role: session.user.role,
        scopeId:
          session.user.role === 'client'
            ? session.user.clientId
            : session.user.role === 'vendor'
              ? session.user.vendorId
              : null,
      }

      const resolvedParams = (await Promise.resolve(params)) as TParams

      const result = await withTenant(tenant, (tx) =>
        handler({ req, params: resolvedParams, tenant, tx }),
      )

      return NextResponse.json(result satisfies unknown)
    } catch (err) {
      return errorResponse(err)
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

export async function parseJson<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw badRequest('JSON inválido')
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new ApiError(422, 'validation_error', formatZodError(result.error))
  }
  return result.data
}

export function parseQuery<T>(req: NextRequest, schema: ZodType<T>): T {
  const entries = Object.fromEntries(req.nextUrl.searchParams.entries())
  const result = schema.safeParse(entries)
  if (!result.success) {
    throw new ApiError(422, 'validation_error', formatZodError(result.error))
  }
  return result.data
}

function formatZodError(err: ZodError): string {
  return err.issues
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('; ')
}

function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message } },
      { status: err.status },
    )
  }
  console.error('[api] unhandled error:', err)
  return NextResponse.json(
    { error: { code: 'internal', message: 'Error interno del servidor' } },
    { status: 500 },
  )
}
