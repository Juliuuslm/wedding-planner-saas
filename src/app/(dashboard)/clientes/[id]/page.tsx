export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Mail,
  Phone,
  MessageCircle,
  CalendarDays,
  Users,
  ArrowLeft,
  FileText,
  Download,
  ArrowRight,
  TrendingUp,
  Plus,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  getClienteById,
  getEventos,
  getContratosByContraparteId,
} from '@/lib/data'
import { EditarClienteDialog } from '@/components/clientes/EditarClienteDialog'
import { cn } from '@/lib/utils'
import type { Evento, EstadoEvento } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ESTADO_EVENTO_MAP: Record<EstadoEvento, { label: string; className: string }> = {
  lead:          { label: 'Lead',          className: 'bg-brand/10 text-brand border-brand/20' },
  planificacion: { label: 'Planificación', className: 'bg-gold/10 text-gold border-gold/20' },
  activo:        { label: 'Activo',        className: 'bg-success/10 text-success border-success/20' },
  completado:    { label: 'Completado',    className: 'bg-muted text-text-muted' },
  cancelado:     { label: 'Cancelado',     className: 'bg-danger/10 text-danger border-danger/20' },
}

const ESTADO_CONTRATO_MAP: Record<string, { label: string; className: string }> = {
  borrador: { label: 'Borrador', className: 'bg-muted text-text-muted' },
  enviado:  { label: 'Enviado',  className: 'bg-gold/10 text-gold border-gold/20' },
  firmado:  { label: 'Firmado',  className: 'bg-success/10 text-success border-success/20' },
  cancelado:{ label: 'Cancelado',className: 'bg-danger/10 text-danger border-danger/20' },
}

// Agrupa eventos: próximos (futuros activos/planif/lead), pasados (completado/cancelado o ya pasados)
function splitEventos(eventos: Evento[]) {
  const now = Date.now()
  const activos: Evento[] = []
  const pasados: Evento[] = []
  for (const e of eventos) {
    const futuro = new Date(e.fecha).getTime() >= now
    const esHistorico = e.estado === 'completado' || e.estado === 'cancelado'
    if (futuro && !esHistorico) activos.push(e)
    else pasados.push(e)
  }
  activos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
  pasados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  return { activos, pasados }
}

// ─── Evento row ──────────────────────────────────────────────────────────────

function EventoRow({ evento }: { evento: Evento }) {
  const estilo = ESTADO_EVENTO_MAP[evento.estado]
  return (
    <Link
      href={`/eventos/${evento.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
        <CalendarDays className="h-4 w-4 text-gold" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-text-primary">{evento.nombre}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
          <span>{formatShort(evento.fecha)}</span>
          {evento.venue && (
            <>
              <span>·</span>
              <span className="truncate">{evento.venue}</span>
            </>
          )}
          {evento.numeroInvitados && (
            <>
              <span>·</span>
              <span>{evento.numeroInvitados} invitados</span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {evento.presupuestoTotal > 0 && (
          <span className="text-sm font-medium tabular-nums text-text-primary">
            {formatMXN(evento.presupuestoTotal)}
          </span>
        )}
        <Badge variant="outline" className={cn('text-xs', estilo.className)}>
          {estilo.label}
        </Badge>
        <ArrowRight className="h-4 w-4 text-text-muted" />
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientePerfilPage({ params }: Props) {
  const { id } = await params
  const cliente = await getClienteById(id)
  if (!cliente) notFound()

  const allEventos = await getEventos()
  const eventosDelCliente = allEventos.filter((e) => e.clienteId === cliente.id)
  const { activos, pasados } = splitEventos(eventosDelCliente)

  const contratos = await getContratosByContraparteId(cliente.id, 'cliente')

  const initials = ((cliente.nombre[0] ?? '') + (cliente.apellido[0] ?? '')).toUpperCase()

  // Métricas CRM
  const ltv = eventosDelCliente.reduce((s, e) => s + (e.presupuestoTotal ?? 0), 0)
  const numEventos = eventosDelCliente.length
  const tieneActivo = eventosDelCliente.some((e) => e.estado === 'activo' || e.estado === 'planificacion')
  const esRepeat = numEventos > 1

  return (
    <div className="space-y-6">

      {/* ── Back link ─────────────────────────────────────────── */}
      <Button
        size="sm"
        variant="ghost"
        className="-ml-1 text-text-secondary"
        nativeButton={false}
        render={<Link href="/clientes" />}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Volver a clientes
      </Button>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-brand text-lg font-semibold text-gold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {tieneActivo && (
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                  Activo
                </Badge>
              )}
              {esRepeat && (
                <Badge variant="outline" className="border-gold/30 bg-gold/15 text-gold">
                  Cliente recurrente
                </Badge>
              )}
              <span className="text-xs text-text-muted">
                Cliente desde {formatDate(cliente.creadoEn)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <EditarClienteDialog cliente={cliente} />
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href={`/eventos?cliente=${cliente.id}`} />}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo evento
          </Button>
        </div>
      </div>

      {/* ── Métricas CRM ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              Eventos
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{numEventos}</p>
            <p className="text-xs text-text-muted">
              {activos.length} por venir · {pasados.length} histórico
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <TrendingUp className="h-3.5 w-3.5" />
              LTV
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{formatMXN(ltv)}</p>
            <p className="text-xs text-text-muted">Suma de presupuestos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <FileText className="h-3.5 w-3.5" />
              Contratos
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{contratos.length}</p>
            <p className="text-xs text-text-muted">
              {contratos.filter((c) => c.estado === 'firmado').length} firmados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Columna izquierda: contacto + notas ─────────────── */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <a
                  href={`mailto:${cliente.email}`}
                  className="truncate text-text-primary hover:text-gold hover:underline"
                >
                  {cliente.email}
                </a>
              </div>
              <Separator />
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="text-text-primary">{cliente.telefono || '—'}</span>
              </div>
              {cliente.telefono && (
                <>
                  <Separator />
                  <a
                    href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-success"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    WhatsApp
                  </a>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
                {cliente.notas ?? <span className="italic text-text-muted">Sin notas...</span>}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Columna derecha: eventos + contratos ────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Eventos por venir */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Eventos por venir
                {activos.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-text-muted">({activos.length})</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activos.length > 0 ? (
                <ul className="divide-y divide-warm-border">
                  {activos.map((evento) => (
                    <li key={evento.id}>
                      <EventoRow evento={evento} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center px-6 py-10 text-center">
                  <CalendarDays className="mb-2 h-8 w-8 text-text-muted" />
                  <p className="text-sm text-text-primary">Sin eventos programados</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Crea un evento nuevo para este cliente.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    nativeButton={false}
                    render={<Link href={`/eventos?cliente=${cliente.id}`} />}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Nuevo evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eventos pasados */}
          {pasados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Histórico
                  <span className="ml-2 text-xs font-normal text-text-muted">({pasados.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-warm-border">
                  {pasados.map((evento) => (
                    <li key={evento.id}>
                      <EventoRow evento={evento} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Contratos */}
          {contratos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Documentos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-warm-border">
                  {contratos.map((contrato) => {
                    const estadoContrato = ESTADO_CONTRATO_MAP[contrato.estado]
                    return (
                      <li key={contrato.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                          <FileText className="h-4 w-4 text-gold" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">
                            Contrato v{contrato.version} — {contrato.contraparte}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatDate(contrato.fechaCreacion)}
                            {contrato.fechaFirma && ` · Firmado ${formatDate(contrato.fechaFirma)}`}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn('shrink-0 text-xs', estadoContrato.className)}
                        >
                          {estadoContrato.label}
                        </Badge>
                        <Button size="icon-sm" variant="ghost" className="shrink-0">
                          <Download className="h-3.5 w-3.5 text-text-muted" />
                          <span className="sr-only">Descargar</span>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
