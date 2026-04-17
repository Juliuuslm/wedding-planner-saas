import { signOut } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LogoutPage() {
  async function doLogout() {
    'use server'
    await signOut({ redirectTo: '/login' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <form action={doLogout}>
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
