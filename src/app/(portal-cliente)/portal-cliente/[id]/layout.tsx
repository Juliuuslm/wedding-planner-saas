export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventoById } from '@/lib/api/eventos'
import { getClienteById } from '@/lib/api/clientes'
import { getPlanner } from '@/lib/api/planner'

interface PortalClienteIdLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

const NAV_ITEMS = [
  { label: 'Progreso',   href: '' },
  { label: 'Mis Pagos',  href: '/pagos' },
  { label: 'Diseños',    href: '/disenos' },
  { label: 'Mensajes',   href: '/mensajes' },
]

export default async function PortalClienteIdLayout({
  children,
  params,
}: PortalClienteIdLayoutProps) {
  const { id } = await params
  const evento = await getEventoById(id)
  if (!evento) notFound()

  const cliente = await getClienteById(evento.clienteId)
  const planner = await getPlanner()

  const eventDate = new Date(evento.fecha)
  const today     = new Date()
  today.setHours(0, 0, 0, 0)
  const diasRestantes = Math.max(0, Math.ceil(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  ))

  const fechaFormateada = eventDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })

  return (
    <div>
      {/* ── Hero cover ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-[#2C1810]">
        {/* Decorative gold texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #C9A96E 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C9A96E 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 py-14">
          {/* Planner badge */}
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/20 text-xs font-bold text-gold ring-1 ring-gold/30">
              AM
            </div>
            <span className="text-sm font-medium text-gold/80">{planner.empresa}</span>
          </div>

          {/* Event name */}
          <h1 className="text-4xl font-semibold leading-tight tracking-wide text-white sm:text-5xl">
            {evento.nombre}
          </h1>

          {/* Date + venue */}
          <p className="mt-3 capitalize text-lg text-gold/70">{fechaFormateada}</p>
          {evento.venue && evento.venue !== 'Por confirmar' && (
            <p className="mt-1 text-sm text-white/50">{evento.venue}</p>
          )}

          {/* Countdown */}
          {diasRestantes > 0 && (
            <div className="mt-8 inline-flex items-baseline gap-2 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/10 backdrop-blur-sm">
              <span className="text-5xl font-bold tabular-nums text-white">
                {diasRestantes}
              </span>
              <span className="text-base text-white/70">
                {diasRestantes === 1 ? 'día para tu boda' : 'días para tu boda'}
              </span>
            </div>
          )}

          {/* Separator */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-xs text-white/40">
              Hola{cliente ? `, ${cliente.nombre}` : ''} · Bienvenida a tu portal
            </p>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Planner contact */}
          <p className="mt-4 text-xs text-white/40">
            Tu coordinadora: <span className="text-white/70">{planner.nombre}</span>
            &nbsp;·&nbsp;{planner.email}
          </p>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FFFDF9] to-transparent" />
      </div>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-[#EAE7E0] bg-[#FFFDF9]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6">
          <nav className="flex gap-0 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={`/portal-cliente/${id}${item.href}`}
                className="relative shrink-0 px-4 py-4 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Page content ──────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        {children}
      </main>
    </div>
  )
}
