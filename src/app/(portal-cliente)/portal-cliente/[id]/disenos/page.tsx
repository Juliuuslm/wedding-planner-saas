'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

type EstadoDiseno = 'aprobado' | 'en_revision' | 'por_revisar' | 'rechazado'

interface Diseno {
  id:        number
  titulo:    string
  categoria: string
  estado:    EstadoDiseno
  gradient:  string
}

const ESTADO_DISENO: Record<EstadoDiseno, { label: string; className: string }> = {
  aprobado:    { label: 'Aprobado',    className: 'bg-success/10 text-success' },
  en_revision: { label: 'En revisión', className: 'bg-warning/10 text-warning' },
  por_revisar: { label: 'Por revisar', className: 'bg-brand/10 text-brand' },
  rechazado:   { label: 'Rechazado',   className: 'bg-danger/10 text-danger' },
}

// Placeholder designs — no design model in backend (MVP)
const DISENOS_BASE: Diseno[] = [
  {
    id:        1,
    titulo:    'Concepto general',
    categoria: 'Concepto',
    estado:    'en_revision',
    gradient:  'from-[#1A1A2E] to-[#2C1810]',
  },
  {
    id:        2,
    titulo:    'Paleta de colores',
    categoria: 'Identidad',
    estado:    'en_revision',
    gradient:  'from-[#C9A96E] to-[#8B6B3D]',
  },
  {
    id:        3,
    titulo:    'Diseño de invitaciones',
    categoria: 'Papelería',
    estado:    'por_revisar',
    gradient:  'from-[#D4C5B0] to-[#A89070]',
  },
  {
    id:        4,
    titulo:    'Centro de mesa',
    categoria: 'Florería',
    estado:    'por_revisar',
    gradient:  'from-[#8FAF8A] to-[#4A7045]',
  },
  {
    id:        5,
    titulo:    'Diseño del altar',
    categoria: 'Florería',
    estado:    'por_revisar',
    gradient:  'from-[#B5C5B0] to-[#6A8A65]',
  },
  {
    id:        6,
    titulo:    'Arreglo de mesas',
    categoria: 'Decoración',
    estado:    'en_revision',
    gradient:  'from-[#C5B5A0] to-[#8A7060]',
  },
]

export default function PortalClienteDisenos({ params }: Props) {
  // use() unwraps the Promise in client components (React 19)
  const { id } = use(params)
  if (!id) notFound()

  const [disenos, setDisenos] = useState<Diseno[]>(DISENOS_BASE)

  function handleAprobar(disenoId: number) {
    setDisenos((prev) =>
      prev.map((d) => (d.id === disenoId ? { ...d, estado: 'aprobado' } : d)),
    )
  }

  function handleRechazar(disenoId: number) {
    setDisenos((prev) =>
      prev.map((d) => (d.id === disenoId ? { ...d, estado: 'rechazado' } : d)),
    )
  }

  const aprobados  = disenos.filter((d) => d.estado === 'aprobado').length
  const porRevisar = disenos.filter((d) => d.estado === 'por_revisar').length
  const enRevision = disenos.filter((d) => d.estado === 'en_revision').length

  return (
    <div className="space-y-8">

      {/* ── Header + stats ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary">Diseños y referencias</h2>
        <p className="mt-1 text-sm text-text-muted">
          Tu coordinadora comparte aquí los diseños y propuestas visuales para tu boda.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {aprobados} aprobado{aprobados !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning">
            <Clock className="h-3.5 w-3.5" />
            {enRevision} en revisión
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand">
            <Eye className="h-3.5 w-3.5" />
            {porRevisar} por revisar
          </div>
        </div>
      </section>

      {/* ── Design grid ──────────────────────────────────────────── */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {disenos.map((diseno) => {
            const estadoInfo = ESTADO_DISENO[diseno.estado]
            const canAct = diseno.estado === 'por_revisar' || diseno.estado === 'en_revision'
            return (
              <div
                key={diseno.id}
                className="group overflow-hidden rounded-2xl border border-[#EAE7E0] bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Placeholder image */}
                <div
                  className={cn(
                    'relative h-40 bg-gradient-to-br',
                    diseno.gradient,
                  )}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                      {diseno.categoria}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text-primary">{diseno.titulo}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{diseno.categoria}</p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium',
                        estadoInfo.className,
                      )}
                    >
                      {estadoInfo.label}
                    </span>
                  </div>

                  {/* Approve / Reject buttons — local state only (no design model in backend) */}
                  {canAct && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAprobar(diseno.id)}
                        className="rounded-md bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(diseno.id)}
                        className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Canva section ────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Tablero de inspiración</h2>
        <div className="rounded-2xl border border-[#EAE7E0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7D2AE8]/10">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#7D2AE8]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">Canva — Tablero de tu boda</p>
              <p className="mt-0.5 text-sm text-text-muted">
                Tu coordinadora compartirá aquí el tablero de diseño de Canva con todas las propuestas visuales.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-[#F5F5F8] px-4 py-3 text-center text-sm text-text-muted">
            El enlace al tablero estará disponible pronto
          </div>
        </div>
      </section>

    </div>
  )
}
