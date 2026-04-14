import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { mockProveedores, mockODPs, mockEventos } from '@/data/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ODP } from '@/types'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const ESTADO_ODP_MAP: Record<ODP['estado'], { label: string; className: string }> = {
  pendiente:  { label: 'Pendiente',  className: 'bg-warning/10 text-warning border-warning/30' },
  confirmada: { label: 'Confirmada', className: 'bg-success/10 text-success border-success/30' },
  completada: { label: 'Completada', className: 'bg-muted text-text-muted' },
  cancelada:  { label: 'Cancelada',  className: 'bg-danger/10 text-danger border-danger/30' },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortalProveedorPage({ params }: Props) {
  const { id } = await params
  const proveedor = mockProveedores.find((p) => p.id === id)
  if (!proveedor) notFound()

  const odps = mockODPs.filter((o) => o.proveedorId === id)
  const firstName = proveedor.nombre.split(' ')[0]

  const totalMonto        = odps.reduce((s, o) => s + o.monto, 0)
  const confirmadas       = odps.filter((o) => o.estado === 'confirmada').length
  const montoConfirmado   = odps.filter((o) => o.estado === 'confirmada' || o.estado === 'completada').reduce((s, o) => s + o.monto, 0)
  const montoPendiente    = odps.filter((o) => o.estado === 'pendiente').reduce((s, o) => s + o.monto, 0)

  function getEvento(eventoId: string) {
    return mockEventos.find((e) => e.id === eventoId)
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-text-primary">
          Hola, {firstName} 👋
        </h1>
        <p className="text-text-secondary">
          Aquí puedes ver tus órdenes de desempeño y próximos eventos.
        </p>
      </div>

      {odps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-20 text-center">
          <p className="font-medium text-text-primary">Aún no tienes órdenes asignadas</p>
          <p className="mt-1 text-sm text-text-muted">
            Cuando AM Wedding Studio te asigne un servicio, aparecerá aquí.
          </p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-text-muted">Total ODPs</p>
                <p className="mt-1 text-3xl font-bold text-text-primary">{odps.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-text-muted">Monto comprometido</p>
                <p className="mt-1 text-3xl font-bold text-text-primary tabular-nums">
                  {fmt.format(totalMonto)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-text-muted">Confirmadas</p>
                <p className="mt-1 text-3xl font-bold text-text-primary">{confirmadas}</p>
              </CardContent>
            </Card>
          </div>

          {/* Active ODPs */}
          <div className="space-y-3">
            <h2 className="font-semibold text-text-primary">Mis ODPs activas</h2>
            <div className="space-y-3">
              {odps.map((odp) => {
                const evento = getEvento(odp.eventoId)
                const estado = ESTADO_ODP_MAP[odp.estado]
                return (
                  <Card key={odp.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-text-primary">
                              {evento?.nombre ?? 'Evento'}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', estado.className)}
                            >
                              {estado.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">{odp.descripcion}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                            {evento && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {new Date(evento.fecha).toLocaleDateString('es-MX', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                            <span className="font-semibold tabular-nums text-text-primary">
                              {fmt.format(odp.monto)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          nativeButton={false}
                          render={<Link href={`/portal-proveedor/${id}/odp/${odp.id}`} />}
                        >
                          Ver detalle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Payments summary */}
          <div className="space-y-3">
            <h2 className="font-semibold text-text-primary">Resumen de pagos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-text-muted">Monto confirmado</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-success">
                    {fmt.format(montoConfirmado)}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    ODPs confirmadas y completadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-text-muted">Pendiente de confirmación</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-warning">
                    {fmt.format(montoPendiente)}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    ODPs en espera de confirmación
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
