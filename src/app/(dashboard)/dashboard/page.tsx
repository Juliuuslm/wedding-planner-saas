export const dynamic = 'force-dynamic'

import {
  CalendarHeart,
  CheckSquare,
  TriangleAlert,
  Plus,
  Users,
  Sparkles,
  Clock,
  PartyPopper,
  CheckCircle2,
} from 'lucide-react'
import {
  getEventos,
  getClientes,
  getTareasByEvento,
  getPresupuestoByEvento,
  getODPsByEvento,
  getContratos,
  getPlanner,
} from '@/lib/data'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { EventoCard } from '@/components/dashboard/EventoCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })
}

const ESTADO_LINEA_STYLE: Record<string, { label: string; className: string }> = {
  pendiente:      { label: 'Pendiente', className: 'bg-warning/10 text-warning border-warning/30' },
  pagado_parcial: { label: 'Parcial',   className: 'bg-gold/10 text-gold border-gold/30' },
  pagado:         { label: 'Pagado',    className: 'bg-success/10 text-success border-success/30' },
}

const ESTADO_TAREA_STYLE: Record<string, { label: string; className: string }> = {
  pendiente:   { label: 'Pendiente',   className: 'text-text-muted' },
  en_progreso: { label: 'En progreso', className: 'text-warning' },
  completada:  { label: 'Completada',  className: 'text-success' },
  atrasada:    { label: 'Atrasada',    className: 'text-danger' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const [allEventos, allClientes, allContratos, planner] = await Promise.all([
    getEventos(),
    getClientes(),
    getContratos(),
    getPlanner(),
  ])

  const eventosActivos       = allEventos.filter((e) => e.estado === 'activo')
  const eventosLeads         = allEventos.filter((e) => e.estado === 'lead')
  const eventosPlanificacion = allEventos.filter((e) => e.estado === 'planificacion')
  const eventosCompletados   = allEventos.filter((e) => e.estado === 'completado')

  // Gather tasks and budget lines from all events
  const allTareasArrays = await Promise.all(
    allEventos.map((e) => getTareasByEvento(e.id)),
  )
  const allTareas = allTareasArrays.flat()

  const allPresupuestos = await Promise.all(
    allEventos.map((e) => getPresupuestoByEvento(e.id)),
  )
  const allLineas = allPresupuestos.flatMap((p) => p.lineas)

  const allODPsArrays = await Promise.all(
    allEventos.map((e) => getODPsByEvento(e.id)),
  )
  const allODPs = allODPsArrays.flat()

  const tareasPendientes = allTareas
    .filter((t) => t.estado !== 'completada')
    .sort(
      (a, b) =>
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime()
    )
    .slice(0, 5)

  const pagosProximos = allLineas
    .filter((l) => l.estado !== 'pagado')
    .slice(0, 3)

  const odpsCount = allODPs.filter((o) => o.estado === 'pendiente').length

  const montoPagos = allLineas
    .filter((l) => l.estado !== 'pagado')
    .reduce((sum, l) => sum + (l.montoEstimado - l.montoPagado), 0)

  const alertas = [
    ...allODPs
      .filter((o) => o.estado === 'pendiente')
      .map((o) => ({
        mensaje: `ODP pendiente de confirmación: ${o.descripcion.split('—')[0].trim()}`,
      })),
    ...allContratos
      .filter((c) => c.estado === 'enviado')
      .map((c) => ({
        mensaje: `Contrato sin firmar enviado a ${c.contraparte}`,
      })),
  ].slice(0, 3)

  const hoy = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">

      {/* ── Welcome ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Hola, {planner?.nombre?.split(' ')[0] ?? 'Planner'}
          </h1>
          <p className="mt-1 text-sm capitalize text-text-secondary">{hoy}</p>
          <p className="text-sm text-text-muted">
            {eventosActivos.length > 0
              ? `Tienes ${eventosActivos.length} eventos activos y ${tareasPendientes.length} tareas pendientes.`
              : 'Crea tu primer evento para comenzar.'}
          </p>
        </div>
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/clientes" />}>
            <Users className="mr-1.5 h-4 w-4" />
            Nuevo cliente
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href="/eventos" />}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo evento
          </Button>
        </div>
      </div>

      {/* ── Funnel KPIs — pipeline de ventas y ejecución ──────────── */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-text-primary">Pipeline</h2>
          <p className="text-xs text-text-muted">{allEventos.length} eventos en total</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: '0ms', animationDuration: '350ms' }}>
            <KpiCard
              label="Leads"
              value={eventosLeads.length}
              description="Por confirmar"
              icon={Sparkles}
              iconClassName="bg-brand/10 text-brand"
              href="/eventos?estado=lead"
            />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: '80ms', animationDuration: '350ms' }}>
            <KpiCard
              label="Planificación"
              value={eventosPlanificacion.length}
              description="En preparación"
              icon={Clock}
              iconClassName="bg-gold/10 text-gold"
              href="/eventos?estado=planificacion"
            />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: '160ms', animationDuration: '350ms' }}>
            <KpiCard
              label="Activos"
              value={eventosActivos.length}
              description="Este mes"
              icon={PartyPopper}
              iconClassName="bg-warning/10 text-warning"
              href="/eventos?estado=activo"
            />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both" style={{ animationDelay: '240ms', animationDuration: '350ms' }}>
            <KpiCard
              label="Completados"
              value={eventosCompletados.length}
              description="Histórico"
              icon={CheckCircle2}
              iconClassName="bg-success/10 text-success"
              href="/eventos?estado=completado"
            />
          </div>
        </div>
      </section>

      {/* ── Métricas operativas secundarias ───────────────────────── */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-text-primary">Esta semana</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <KpiCard
            label="Tareas pendientes"
            value={tareasPendientes.length}
            description="Próximas a vencer"
            icon={CheckSquare}
            iconClassName="bg-brand/10 text-brand"
          />
          <KpiCard
            label="Pagos pendientes"
            value={formatMXN(montoPagos)}
            description="En líneas sin saldar"
            icon={CalendarHeart}
            iconClassName="bg-warning/10 text-warning"
            valueClassName="text-xl"
          />
          <KpiCard
            label="ODPs por confirmar"
            value={odpsCount}
            description="Proveedores pendientes"
            icon={TriangleAlert}
            iconClassName="bg-danger/10 text-danger"
          />
        </div>
      </section>

      {/* ── Eventos activos ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-text-primary">
          Mis eventos activos
        </h2>
        {allEventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-border py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <CalendarHeart className="h-7 w-7 text-gold" />
            </div>
            <p className="font-semibold text-text-primary">Sin eventos todavía</p>
            <p className="mt-1 max-w-xs text-sm text-text-muted">
              Crea tu primer evento de boda para comenzar a gestionar clientes, presupuesto y proveedores.
            </p>
            <Button size="sm" className="mt-4" nativeButton={false} render={<Link href="/eventos" />}>
              <Plus className="mr-1.5 h-4 w-4" />
              Crear primer evento
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allEventos.map((evento) => {
              const cliente = allClientes.find((c) => c.id === evento.clienteId)
              return (
                <EventoCard key={evento.id} evento={evento} cliente={cliente} />
              )
            })}
          </div>
        )}
      </section>

      {/* ── Grid inferior ─────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Tareas pendientes */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-text-primary">
            Tareas pendientes
          </h2>
          <div className="overflow-hidden rounded-lg border border-warm-border bg-background">
            {tareasPendientes.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckSquare className="mb-2 h-8 w-8 text-success" />
                <p className="text-sm font-medium text-text-primary">Todo al día</p>
                <p className="mt-0.5 text-xs text-text-muted">Sin tareas pendientes por ahora.</p>
              </div>
            ) : (
              <ul className="divide-y divide-warm-border">
                {tareasPendientes.map((tarea) => {
                  const evento = allEventos.find((e) => e.id === tarea.eventoId)
                  const estilo = ESTADO_TAREA_STYLE[tarea.estado]
                  return (
                    <li key={tarea.id} className="flex items-start gap-3 px-4 py-3">
                      <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-warm-border bg-surface" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {tarea.titulo}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-text-muted">
                          <span className="truncate">{evento?.nombre}</span>
                          <span>·</span>
                          <span className={cn('font-medium', estilo.className)}>
                            {estilo.label}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-text-muted">
                        {formatDateShort(tarea.fechaVencimiento)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Pagos + Alertas */}
        <div className="space-y-6">

          {/* Pagos próximos */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              Pagos próximos
            </h2>
            <div className="overflow-hidden rounded-lg border border-warm-border bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Pendiente</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagosProximos.map((linea) => {
                    const pendiente = linea.montoEstimado - linea.montoPagado
                    const estilo = ESTADO_LINEA_STYLE[linea.estado]
                    return (
                      <TableRow key={linea.id}>
                        <TableCell className="max-w-[140px] truncate text-sm">
                          {linea.concepto}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium tabular-nums">
                          {formatMXN(pendiente)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={cn('text-xs', estilo.className)}
                          >
                            {estilo.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Alertas */}
          {alertas.length > 0 && (
            <section>
              <h2 className="mb-4 text-base font-semibold text-text-primary">
                Alertas
              </h2>
              <div className="space-y-2">
                {alertas.map((alerta, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3"
                  >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <p className="text-sm text-text-primary">{alerta.mensaje}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

    </div>
  )
}
