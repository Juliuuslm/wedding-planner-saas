import 'server-only'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import type { TenantContext } from '@/lib/db-tenant'

/**
 * Resuelve el tenant desde la sesión Auth.js en un server component.
 * Si no hay sesión válida, redirige a /login.
 */
export async function serverTenant(): Promise<TenantContext> {
  const session = await auth()
  const plannerId = session?.user?.plannerId
  if (!session?.user || !plannerId) {
    redirect('/login')
  }
  return {
    plannerId,
    role: session.user.role,
    scopeId:
      session.user.role === 'client'
        ? session.user.clientId
        : session.user.role === 'vendor'
          ? session.user.vendorId
          : null,
  }
}
