import { redirect } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { safeAuth } from '@/lib/safe-auth'
import { AuthError } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await safeAuth()
  if (session?.user) redirect('/dashboard')

  const params = await searchParams
  const error = params.error
  const callbackUrl = params.callbackUrl ?? '/dashboard'

  async function authenticate(formData: FormData) {
    'use server'
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: formData.get('callbackUrl')?.toString() || '/dashboard',
      })
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/login?error=credentials&callbackUrl=${encodeURIComponent(callbackUrl)}`)
      }
      throw err
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-warm-border bg-background p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-text-primary">Entrar</h1>
          <p className="text-sm text-text-secondary">
            Accede a tu panel de wedding planner.
          </p>
        </div>

        <form action={authenticate} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              defaultValue="andrea@amweddingstudio.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
              role="alert"
              aria-live="polite"
            >
              Correo o contraseña incorrectos.
            </p>
          )}

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Demo: <code className="font-mono">andrea@amweddingstudio.com</code> /{' '}
          <code className="font-mono">password123</code>
        </p>
      </div>
    </div>
  )
}
