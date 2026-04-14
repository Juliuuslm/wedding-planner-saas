import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { mockProveedores, mockODPs, mockEventos } from '@/data/mock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const MOCK_PLANNER = {
  nombre:  'Andrea Morales',
  empresa: 'AM Wedding Studio',
  email:   'andrea@amweddingstudio.mx',
  telefono: '+52 55 1234 5678',
}

interface Props {
  params: Promise<{ id: string; 'odp-id': string }>
}

export default async function ODPDetailPage({ params }: Props) {
  const { id, 'odp-id': odpId } = await params

  const proveedor = mockProveedores.find((p) => p.id === id)
  if (!proveedor) notFound()

  const odp = mockODPs.find((o) => o.id === odpId)
  if (!odp || odp.proveedorId !== id) notFound()

  const evento = mockEventos.find((e) => e.id === odp.eventoId)
  const estado = ESTADO_ODP_MAP[odp.estado]

  const MOCK_MENSAJES = [
    {
      id: 1,
      autor: MOCK_PLANNER.nombre,
      tipo: 'planner' as const,
      mensaje: 'Hola, adjunto la ODP con los requerimientos del evento. Por favor confírmame disponibilidad.',
      fecha: '2026-04-10T10:30:00.000Z',
    },
    {
      id: 2,
      autor: proveedor.nombre,
      tipo: 'proveedor' as const,
      mensaje: 'Buenos días, confirmo disponibilidad para la fecha. Revisé los requerimientos y todo está en orden.',
      fecha: '2026-04-11T09:15:00.000Z',
    },
    {
      id: 3,
      autor: MOCK_PLANNER.nombre,
      tipo: 'planner' as const,
      mensaje: 'Perfecto. Estaremos confirmando el pago del anticipo en los próximos días.',
      fecha: '2026-04-11T14:00:00.000Z',
    },
  ]

  function formatTime(iso: string) {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div className="space-y-3">
        <Link
          href={`/portal-proveedor/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mis ODPs
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-text-primary">Orden de Desempeño</h1>
          <Badge variant="outline" className={cn('text-xs', estado.className)}>
            {estado.label}
          </Badge>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left: description + communication */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Descripción del servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-text-secondary">{odp.descripcion}</p>
              {odp.requerimientos && (
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs font-medium text-text-muted mb-1">Requerimientos</p>
                  <p className="text-sm text-text-secondary">{odp.requerimientos}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Historial de comunicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_MENSAJES.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex', msg.tipo === 'proveedor' && 'justify-end')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-xl px-4 py-3 text-sm',
                        msg.tipo === 'planner'
                          ? 'bg-muted/60 text-text-primary rounded-tl-none'
                          : 'bg-brand/10 text-text-primary rounded-tr-none',
                      )}
                    >
                      <p className="text-xs font-medium text-text-muted mb-1">{msg.autor}</p>
                      <p className="leading-relaxed">{msg.mensaje}</p>
                      <p className="text-[10px] text-text-muted mt-1.5 text-right">
                        {formatTime(msg.fecha)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: sidebar cards */}
        <div className="space-y-4">
          {/* Event details */}
          {evento && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Detalles del evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-text-muted">Evento</span>
                  <span className="font-medium text-text-primary text-right">{evento.nombre}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-text-muted">Fecha</span>
                  <span className="font-medium text-text-primary text-right">
                    {new Date(evento.fecha).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {evento.venue && (
                  <div className="flex justify-between gap-2">
                    <span className="text-text-muted">Venue</span>
                    <span className="font-medium text-text-primary text-right">{evento.venue}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span className="text-text-muted">Estado ODP</span>
                  <Badge variant="outline" className={cn('text-xs', estado.className)}>
                    {estado.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Monto y pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-text-primary">
                {fmt.format(odp.monto)}
              </p>
              <p className="mt-1 text-xs text-text-muted">Monto total del servicio</p>
            </CardContent>
          </Card>

          {/* Planner contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Planner de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-text-primary">{MOCK_PLANNER.nombre}</p>
              <p className="text-text-muted">{MOCK_PLANNER.empresa}</p>
              <p className="text-text-secondary pt-1">{MOCK_PLANNER.email}</p>
              <p className="text-text-secondary">{MOCK_PLANNER.telefono}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {odp.estado === 'pendiente' && (
                <>
                  <Button size="sm" className="w-full bg-success text-white hover:bg-success/90">
                    Confirmar ODP
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Solicitar cambios
                  </Button>
                </>
              )}
              {odp.estado === 'confirmada' && (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  <CheckCircle2 className="mr-1.5 h-4 w-4 text-success" />
                  ODP Confirmada
                </Button>
              )}
              {odp.estado === 'completada' && (
                <div className="flex items-center justify-center gap-2 rounded-md bg-muted/40 py-2 text-sm text-text-muted">
                  <CheckCircle2 className="h-4 w-4" />
                  Servicio completado
                </div>
              )}
              {odp.estado === 'cancelada' && (
                <div className="flex items-center justify-center rounded-md bg-danger/10 py-2 text-sm text-danger">
                  ODP cancelada
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
