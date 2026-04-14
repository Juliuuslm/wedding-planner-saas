import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, CalendarDays, Flower2, Heart, Users, UtensilsCrossed, Palette, Circle } from 'lucide-react'
import { mockEventos, mockTareas } from '@/data/mock'
import type { EstadoTarea } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

type HitoEstado = 'completado' | 'en_progreso' | 'proximo' | 'pendiente'

interface Hito {
  titulo:     string
  subtitulo?: string
  estado:     HitoEstado
  icon:       React.ElementType
}

/** Derive milestone states from real task data */
function derivarEstadoFase(tareas: { fase: string; estado: EstadoTarea }[], fase: string): HitoEstado {
  const t = tareas.filter((t) => t.fase === fase)
  if (t.length === 0) return 'pendiente'
  const allDone     = t.every((x) => x.estado === 'completada')
  const hasProgress = t.some((x) => x.estado === 'en_progreso' || x.estado === 'completada')
  const hasAtrasada = t.some((x) => x.estado === 'atrasada')
  if (allDone) return 'completado'
  if (hasProgress || hasAtrasada) return 'en_progreso'
  return 'pendiente'
}

const APROBACIONES_MOCK = [
  {
    id: 1,
    titulo: 'Paleta de colores definitiva',
    descripcion: 'Tu coordinadora espera tu confirmación sobre la combinación final: blanco marfil, verde salvia y terracota.',
    urgencia: 'Esta semana',
  },
  {
    id: 2,
    titulo: 'Menú de cena',
    descripcion: 'Elige entre las 3 propuestas del chef para el menú de 3 tiempos. Incluye opción vegetariana.',
    urgencia: 'En los próximos 15 días',
  },
]

const HITO_ICONS: Record<string, React.ElementType> = {
  'Contratación':    CheckCircle2,
  'Diseño':          Palette,
  'Logística':       UtensilsCrossed,
  'Comunicación':    Users,
  'Día del evento':  Heart,
  'Post-evento':     CalendarDays,
}

export default async function PortalClienteProgresoPage({ params }: Props) {
  const { id } = await params
  const evento = mockEventos.find((e) => e.id === id)
  if (!evento) notFound()

  const tareas = mockTareas.filter((t) => t.eventoId === id)

  const FASES_ORDEN = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento']
  const fasesConTareas = [...new Set(tareas.map((t) => t.fase))]

  // Build hitos from real tasks, then add Día del evento if not present
  const hitosBase = FASES_ORDEN.filter((f) => fasesConTareas.includes(f) || f === 'Día del evento')

  const hitos: Hito[] = hitosBase.map((fase) => {
    const estado = fase === 'Día del evento' ? 'pendiente' : derivarEstadoFase(tareas, fase)
    return {
      titulo: fase === 'Día del evento' ? '¡El gran día!' : fase,
      subtitulo: fase === 'Día del evento' ? evento.venue ?? undefined : undefined,
      estado,
      icon: HITO_ICONS[fase] ?? Circle,
    }
  })

  // Find first non-completed → mark it as "próximo" if it's pendiente
  const primerPendienteIdx = hitos.findIndex((h) => h.estado === 'pendiente')
  if (primerPendienteIdx !== -1) {
    hitos[primerPendienteIdx].estado = 'proximo'
  }

  const progreso = evento.progreso

  return (
    <div className="space-y-10">

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Progreso general</h2>
          <span className="text-2xl font-bold tabular-nums text-text-primary">{progreso}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#EAE7E0]">
          <div
            className="h-full rounded-full bg-gold transition-all duration-700"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-sm text-text-muted">
          {progreso < 30 ? 'Apenas comenzamos — hay mucho por planear y todo saldrá perfecto.' :
           progreso < 60 ? 'Vamos muy bien. La mayoría de los detalles importantes ya están definidos.' :
           progreso < 85 ? 'Casi todo listo. Estamos en la recta final.' :
           '¡Todo listo! Solo falta disfrutar el día.'}
        </p>
      </section>

      {/* ── Milestone timeline ───────────────────────────────────── */}
      <section>
        <h2 className="mb-6 text-lg font-semibold text-text-primary">Etapas de tu boda</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-[#EAE7E0]" />

          <div className="space-y-6">
            {hitos.map((hito) => {
              const Icon = hito.icon
              const isCompleted = hito.estado === 'completado'
              const isActive    = hito.estado === 'en_progreso'
              const isProximo   = hito.estado === 'proximo'

              return (
                <div key={hito.titulo} className="relative flex gap-5">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={
                        isCompleted
                          ? 'flex h-10 w-10 items-center justify-center rounded-full bg-success text-white'
                          : isActive
                          ? 'flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 ring-2 ring-gold'
                          : isProximo
                          ? 'flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 ring-2 ring-brand/30'
                          : 'flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE7E0]'
                      }
                    >
                      {isCompleted
                        ? <CheckCircle2 className="h-5 w-5" />
                        : isActive || isProximo
                        ? <Icon className="h-4 w-4 text-brand" />
                        : <Icon className="h-4 w-4 text-text-muted" />
                      }
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2 pt-1.5">
                    <div className="flex items-center gap-2">
                      <p
                        className={
                          isCompleted
                            ? 'font-medium text-success'
                            : isActive
                            ? 'font-semibold text-text-primary'
                            : isProximo
                            ? 'font-semibold text-text-primary'
                            : 'text-text-muted'
                        }
                      >
                        {hito.titulo}
                      </p>
                      {isCompleted && (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                          Completado
                        </span>
                      )}
                      {isActive && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-warning">
                          En progreso
                        </span>
                      )}
                      {isProximo && (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                          Próximo
                        </span>
                      )}
                    </div>
                    {hito.subtitulo && (
                      <p className="mt-0.5 text-xs text-text-muted">{hito.subtitulo}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Pending approvals ────────────────────────────────────── */}
      {APROBACIONES_MOCK.length > 0 && (
        <section>
          <h2 className="mb-1 text-lg font-semibold text-text-primary">Aprobaciones pendientes</h2>
          <p className="mb-5 text-sm text-text-muted">
            Tu coordinadora necesita tu confirmación en los siguientes puntos.
          </p>
          <div className="space-y-3">
            {APROBACIONES_MOCK.map((aprobacion) => (
              <div
                key={aprobacion.id}
                className="rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                      <p className="font-semibold text-text-primary">{aprobacion.titulo}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {aprobacion.descripcion}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {aprobacion.urgencia}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
