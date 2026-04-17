import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED_PREFIXES = ['/dashboard', '/clientes', '/eventos', '/proveedores', '/contratos', '/diseno', '/configuracion', '/portal-cliente', '/portal-proveedor']
const PUBLIC_PATHS = ['/login', '/api/auth', '/logout']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths + Next internals
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Only guard the protected app surfaces
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/')) || pathname === '/'
  if (!needsAuth) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // Auth.js v5 uses `authjs.session-token` cookie name (or `__Secure-authjs.session-token` in prod)
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
    salt: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
  })

  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Excluir assets estáticos y webhooks públicos del middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
