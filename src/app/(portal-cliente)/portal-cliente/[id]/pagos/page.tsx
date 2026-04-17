export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { getEventoById } from '@/lib/data'
import { getPaqueteById } from '@/lib/data'
import { getContratosByEvento } from '@/lib/data'

interface Props {
  params: Promise<{ id: string }>
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default async function PortalClientePagosPage({ params }: Props) {
  const { id } = await params
  const evento = await getEventoById(id)
  if (!evento) notFound()

  const paquete = evento.paqueteId
    ? await getPaqueteById(evento.paqueteId)
    : null

  // Get the client contract for this event
  const contratos = await getContratosByEvento(id)
  const contrato = contratos.find((c) => c.tipo === 'cliente') ?? null

  const montoTotal = contrato?.montoTotal ?? paquete?.precio ?? 0
  const anticipo   = montoTotal / 2
  const liquidacion = montoTotal / 2

  // Determine if anticipo is paid (contract must be signed)
  const anticipoPagado = contrato?.estado === 'firmado'
  const totalPagado    = anticipoPagado ? anticipo : 0
  const saldoPendiente = montoTotal - totalPagado

  const eventDate   = new Date(evento.fecha)
  const liquidacionFecha = new Date(eventDate)
  liquidacionFecha.setDate(liquidacionFecha.getDate() - 15)

  const PAGOS = [
    {
      id:       1,
      concepto: 'Anticipo de coordinación (50%)',
      monto:    anticipo,
      fecha:    contrato?.fechaFirma ?? contrato?.fechaCreacion ?? '',
      estado:   anticipoPagado ? 'pagado' : 'pendiente',
      detalle:  'Al firmar el contrato de servicios',
    },
    {
      id:       2,
      concepto: 'Liquidación de coordinación (50%)',
      monto:    liquidacion,
      fecha:    liquidacionFecha.toISOString(),
      estado:   'pendiente',
      detalle:  '15 días antes de tu boda',
    },
  ]

  const pct = montoTotal > 0 ? Math.round((totalPagado / montoTotal) * 100) : 0

  return (
    <div className="space-y-10">

      {/* ── Summary cards ────────────────────────────────────────── */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-sm">
          <p className="text-xs text-text-muted">Total del paquete</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-text-primary">
            {fmt(montoTotal)}
          </p>
          <p className="mt-1 text-xs text-text-muted">{paquete?.nombre ?? 'Coordinación'}</p>
        </div>
        <div className="rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-sm">
          <p className="text-xs text-text-muted">Pagado</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-success">
            {fmt(totalPagado)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {anticipoPagado ? 'Anticipo confirmado' : 'Sin pagos aún'}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-sm">
          <p className="text-xs text-text-muted">Saldo pendiente</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-warning">
            {fmt(saldoPendiente)}
          </p>
          <p className="mt-1 text-xs text-text-muted">Próximo vencimiento</p>
        </div>
      </section>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Progreso de pagos</span>
          <span className="font-semibold text-text-primary">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAE7E0]">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── Payment timeline ─────────────────────────────────────── */}
      <section>
        <h2 className="mb-6 text-lg font-semibold text-text-primary">Cronograma de pagos</h2>
        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-px bg-[#EAE7E0]" />
          <div className="space-y-5">
            {PAGOS.map((pago) => {
              const isPaid = pago.estado === 'pagado'
              return (
                <div key={pago.id} className="relative flex gap-5">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={
                        isPaid
                          ? 'flex h-10 w-10 items-center justify-center rounded-full bg-success text-white'
                          : 'flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE7E0]'
                      }
                    >
                      {isPaid
                        ? <CheckCircle2 className="h-5 w-5" />
                        : <Clock className="h-4 w-4 text-text-muted" />
                      }
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-[#EAE7E0] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-text-primary">{pago.concepto}</p>
                        <p className="mt-0.5 text-xs text-text-muted">{pago.detalle}</p>
                        {pago.fecha && (
                          <p className={`mt-2 text-xs font-medium ${isPaid ? 'text-success' : 'text-text-secondary'}`}>
                            {isPaid ? 'Pagado el' : 'Vence el'} {fmtDate(pago.fecha)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold tabular-nums text-text-primary">
                          {fmt(pago.monto)}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            isPaid
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {isPaid ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Note ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed text-text-secondary">
          Si tienes alguna pregunta sobre tus pagos o necesitas un comprobante,
          contáctanos directamente con tu coordinadora Andrea.
        </p>
      </div>

    </div>
  )
}
