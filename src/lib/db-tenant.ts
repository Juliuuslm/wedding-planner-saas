import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type TxClient = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export type TenantContext = {
  plannerId: string
  role: 'planner' | 'client' | 'vendor'
  scopeId?: string | null
}

/**
 * Abre una transacción Prisma y setea las variables de sesión Postgres que
 * usa RLS (app.current_planner, app.current_role, app.current_scope).
 * Las policies filtran rows automáticamente dentro del callback.
 *
 * **Reglas:**
 * - Nunca hacer queries Prisma fuera de withTenant en endpoints autenticados.
 * - Defensa en profundidad: aun así pasar `where: { plannerId }` explícito.
 * - En dev (connection como postgres superuser) RLS es bypaseada. Para
 *   probar aislamiento real conectar como rol `app_user`.
 */
export async function withTenant<T>(
  ctx: TenantContext,
  fn: (tx: TxClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    // SET LOCAL dura solo hasta commit/rollback de la transacción actual
    await tx.$executeRaw(Prisma.sql`SELECT set_config('app.current_planner', ${ctx.plannerId}, true)`)
    await tx.$executeRaw(Prisma.sql`SELECT set_config('app.current_role', ${ctx.role}, true)`)
    if (ctx.scopeId) {
      await tx.$executeRaw(Prisma.sql`SELECT set_config('app.current_scope', ${ctx.scopeId}, true)`)
    }
    return fn(tx)
  })
}
