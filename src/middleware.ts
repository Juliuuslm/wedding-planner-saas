import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED_PREFIXES = ['/dashboard', '/clientes', '/eventos', '/proveedores', '/contratos', '/diseno', '/configuracion', '/portal-cliente', '/portal-proveedor']
const PUBLIC_PATHS = ['/login', '/api/auth', '/logout']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths: permitir pero si vienen con cookie stale tratar de
  // decodificarla; si falla, limpiarla para evitar JWTSessionError en la
  // página. Sólo relevante para /login (donde renderizamos safeAuth()).
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (pathname.startsWith('/login')) {
      const cookieName = process.env.NODE_ENV === 'production'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token'
      const existing = req.cookies.get(cookieName)
      if (existing) {
        try {
          const ok = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName,
            salt: cookieName,
          })
          if (!ok) throw new Error('no token')
        } catch {
          const res = NextResponse.next()
          res.cookies.delete(cookieName)
          return res
        }
      }
    }
    return NextResponse.next()
  }

  // Only guard the protected app surfaces
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) || pathname === '/'
  if (!needsAuth) {
    return NextResponse.next()
  }

  const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'

  let token = null
  try {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName,
      salt: cookieName,
    })
  } catch {
    // Cookie corrupto o firmado con otro secret → tratar como sin sesión
  }

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    const res = NextResponse.redirect(url)
    // Limpiar cookie stale para que el siguiente request no vuelva a fallar
    res.cookies.delete(cookieName)
    return res
  }

  return NextResponse.next()
}

export const config = {
  // Excluir assets estáticos y webhooks públicos del middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
