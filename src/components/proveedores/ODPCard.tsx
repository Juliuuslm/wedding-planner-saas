import { CalendarDays, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ODP, Proveedor } from '@/types'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const ESTADO_ODP_MAP = {
  pendiente:  { label: 'Pendiente',  className: 'bg-warning/10 text-warning border-warning/30' },
  confirmada: { label: 'Confirmada', className: 'bg-success/10 text-success border-success/30' },
  completada: { label: 'Completada', className: 'bg-muted text-text-muted' },
  cancelada:  { label: 'Cancelada',  className: 'bg-danger/10 text-danger border-danger/30' },
}

interface ODPCardProps {
  odp: ODP
  proveedor: Proveedor | undefined
}

export function ODPCard({ odp, proveedor }: ODPCardProps) {
  const estado = ESTADO_ODP_MAP[odp.estado]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {/* Proveedor + estado */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-text-primary">
                {proveedor?.nombre ?? 'Proveedor desconocido'}
              </p>
              <Badge variant="outline" className={cn('text-xs', estado.className)}>
                {estado.label}
              </Badge>
            </div>

            {/* Descripción */}
            <p className="mt-1 text-sm text-text-secondary">{odp.descripcion}</p>

            {/* Requerimientos */}
            {odp.requerimientos && (
              <p className="mt-1.5 line-clamp-2 text-xs text-text-muted">
                {odp.requerimientos}
              </p>
            )}

            {/* Metadata row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(odp.fecha).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="font-semibold tabular-nums text-text-primary">
                {fmt.format(odp.monto)}
              </span>
            </div>
          </div>

          {/* Action */}
          <Button size="sm" variant="ghost" className="shrink-0 text-text-muted">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
