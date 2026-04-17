export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react'
import { getProveedorById } from '@/lib/api/proveedores'
import { getODPsByProveedor } from '@/lib/api/odp'
import { getEventos } from '@/lib/api/eventos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EditarProveedorDialog } from '@/components/proveedores/EditarProveedorDialog'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const CATEGORIA_LABEL: Record<string, string> = {
  venue:       'Venue',
  catering:    'Catering',
  flores:    'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  otro:        'Otros',
}

const ESTADO_ODP_MAP = {
  pendiente:  { label: 'Pendiente',  className: 'bg-warning/10 text-warning border-warning/30' },
  confirmada: { label: 'Confirmada', className: 'bg-success/10 text-success border-success/30' },
  completada: { label: 'Completada', className: 'bg-muted text-text-muted' },
  cancelada:  { label: 'Cancelada',  className: 'bg-danger/10 text-danger border-danger/30' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-gold text-gold' : 'fill-transparent text-text-muted/30'
          )}
        />
      ))}
      <span className="ml-1.5 text-sm text-text-muted">{rating}.0</span>
    </div>
  )
}

function getInitials(nombre: string) {
  return nombre.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface Props {
  params: Promise<{ id: string }>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProveedorPage({ params }: Props) {
  const { id } = await params
  const proveedor = await getProveedorById(id)
  if (!proveedor) notFound()

  const [odps, allEventos] = await Promise.all([
    getODPsByProveedor(proveedor.id),
    getEventos(),
  ])

  const historial = odps.map((o) => ({
    odp: o,
    evento: allEventos.find((e) => e.id === o.eventoId),
  }))

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/proveedores"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarFallback className="rounded-lg bg-brand text-xl font-bold text-gold">
              {getInitials(proveedor.nombre)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{proveedor.nombre}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {CATEGORIA_LABEL[proveedor.categoria] ?? proveedor.categoria}
              </Badge>
              <StarRating rating={proveedor.calificacion} />
            </div>
          </div>
        </div>
        <EditarProveedorDialog proveedor={proveedor} />
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Left column ──────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Descripción */}
          {proveedor.descripcion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Sobre nosotros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {proveedor.descripcion}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Servicios */}
          {proveedor.servicios && proveedor.servicios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {proveedor.servicios.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Historial de eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Historial de eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {historial.length > 0 ? (
                <div className="space-y-3">
                  {historial.map(({ odp, evento }) => (
                    <div key={odp.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {evento?.nombre ?? 'Evento desconocido'}
                          </p>
                          <p className="mt-0.5 text-xs text-text-muted">{odp.descripcion}</p>
                          {evento && (
                            <span className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(evento.fecha).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="text-sm font-semibold tabular-nums text-text-primary">
                            {fmt.format(odp.monto)}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn('text-xs', ESTADO_ODP_MAP[odp.estado].className)}
                          >
                            {ESTADO_ODP_MAP[odp.estado].label}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  Sin eventos registrados aún.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {([
                { icon: Mail,          label: 'Email',     value: proveedor.email },
                { icon: Phone,         label: 'Teléfono',  value: proveedor.telefono },
                { icon: MessageCircle, label: 'WhatsApp',  value: proveedor.whatsapp },
                { icon: Globe,         label: 'Sitio web', value: proveedor.sitioWeb },
              ] as { icon: React.ElementType; label: string; value?: string }[])
                .filter(({ value }) => value)
                .map(({ icon: Icon, label, value }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted">{label}</p>
                        <p className="truncate text-sm text-text-primary">{value}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Rango de precios */}
          {(proveedor.precioMin != null || proveedor.precioBase != null) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Rango de precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {proveedor.precioMin != null && proveedor.precioMax != null ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Mínimo</span>
                      <span className="font-medium tabular-nums text-text-primary">
                        {fmt.format(proveedor.precioMin)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Máximo</span>
                      <span className="font-medium tabular-nums text-text-primary">
                        {fmt.format(proveedor.precioMax)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Precio base</span>
                    <span className="font-medium tabular-nums text-text-primary">
                      {fmt.format(proveedor.precioBase!)}
                    </span>
                  </div>
                )}
                {proveedor.notas && (
                  <p className="pt-1 text-xs text-text-muted">{proveedor.notas}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* ODPs recibidas */}
          {odps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">ODPs recibidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {odps.map((odp) => (
                  <div key={odp.id} className="flex items-start justify-between gap-2">
                    <p className="text-xs text-text-secondary line-clamp-2">{odp.descripcion}</p>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs font-medium tabular-nums text-text-primary">
                        {fmt.format(odp.monto)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px]', ESTADO_ODP_MAP[odp.estado].className)}
                      >
                        {ESTADO_ODP_MAP[odp.estado].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  )
}
