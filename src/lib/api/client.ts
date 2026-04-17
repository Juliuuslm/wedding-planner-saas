// ─── API Client ─────────────────────────────────────────────────────────────
// Typed fetch wrapper for the backend API.
// During Phase 1 (prototype), all modules use mock data.
// In Phase 2, this client will be used for real API calls.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

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

// ─── Auth helper (placeholder for Clerk) ────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  // TODO (Phase 2): get Clerk session token
  // const token = await clerk.session?.getToken()
  // if (token) return { Authorization: `Bearer ${token}` }
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
  const url = new URL(`${BASE_URL}${path}`)

  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value)
      }
    }
  }

  const authHeaders = await getAuthHeaders()

  const res = await fetch(url.toString(), {
    method,
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
