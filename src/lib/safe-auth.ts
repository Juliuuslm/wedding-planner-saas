import 'server-only'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import type { Session } from 'next-auth'

/**
 * Wrapper sobre auth() que absorbe errores de decryption (cookies firmadas
 * con AUTH_SECRET viejo, formato de token pre-migración, etc.) y devuelve
 * null tratándolos como "sin sesión". Además, limpia el cookie corrupto
 * para que el siguiente request no vuelva a fallar.
 */
export async function safeAuth(): Promise<Session | null> {
  try {
    return await auth()
  } catch (err) {
    // JWTSessionError / decryption error → cookie stale o secret cambió
    console.warn('[auth] session decode failed — clearing stale cookie:', err instanceof Error ? err.message : err)
    try {
      const jar = await cookies()
      const cookieName = process.env.NODE_ENV === 'production'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token'
      jar.delete(cookieName)
      jar.delete('authjs.csrf-token')
      jar.delete('authjs.callback-url')
    } catch {
      // cookies() puede fallar en algunos contextos; ignorar
    }
    return null
  }
}
