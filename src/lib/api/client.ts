// ─── API Client ─────────────────────────────────────────────────────────────
// Typed fetch wrapper for the Next.js API routes (same origin).
// Paths se resuelven relativos al dominio actual, por lo que funciona en
// dev y producción sin configuración.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? '/api'

// ─── Error ──────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`API ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

// ─── Auth helper ────────────────────────────────────────────────────────────
// Same-origin cookie-based sesión de Auth.js. No se requieren headers extra;
// fetch con `credentials: 'include'` envía la cookie automáticamente.

async function getAuthHeaders(): Promise<Record<string, string>> {
  return {}
}

// ─── Generic request ────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown
    params?: Record<string, string | undefined>
  },
): Promise<T> {
  // BASE_URL puede ser relativo ('/api') o absoluto ('https://...').
  // URL constructor requiere absolute URL → construimos query string a mano
  // y dejamos que fetch resuelva el path relativo contra window.location.
  let urlStr = `${BASE_URL}${path}`
  if (options?.params) {
    const qs = new URLSearchParams()
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== '') {
        qs.set(key, value)
      }
    }
    const qsStr = qs.toString()
    if (qsStr) urlStr += (urlStr.includes('?') ? '&' : '?') + qsStr
  }

  const authHeaders = await getAuthHeaders()

  const res = await fetch(urlStr, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, res.statusText, body)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

// ─── Public helpers ─────────────────────────────────────────────────────────

export function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  return request<T>('GET', path, { params })
}

export async function apiGetOrNull<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T | null> {
  try {
    return await request<T>('GET', path, { params })
  } catch (err) {
    if (err instanceof ApiError && (err.status === 400 || err.status === 404)) {
      return null
    }
    throw err
  }
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, { body })
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PUT', path, { body })
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PATCH', path, { body })
}

export function apiDelete(path: string): Promise<void> {
  return request<void>('DELETE', path)
}
