import Link from 'next/link'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Evento, Cliente } from '@/types'

const ESTADO_MAP: Record<Evento['estado'], { label: string; className: string }> = {
  activo:        { label: 'Activo',        className: 'bg-success/10 text-success border-success/20' },
  planificacion: { label: 'Planificación', className: 'bg-gold/10 text-gold border-gold/20' },
  completado:    { label: 'Completado',    className: 'bg-muted text-text-muted' },
  cancelado:     { label: 'Cancelado',     className: 'bg-danger/10 text-danger border-danger/20' },
}

export function EventoCard({ evento, cliente }: { evento: Evento; cliente: Cliente | undefined }) {
  const estado = ESTADO_MAP[evento.estado]
  const fecha = new Date(evento.fecha).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-text-primary">{evento.nombre}</p>
              {cliente && (
                <p className="text-sm text-text-secondary">{cliente.nombre} {cliente.apellido}</p>
              )}
            </div>
            <Badge variant="outline" className={cn('shrink-0 text-xs', estado.className)}>
              {estado.label}
            </Badge>
          </div>

          {/* Meta */}
          <div className="space-y-1.5 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              {fecha}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{evento.venue ?? 'Venue por confirmar'}</span>
            </div>
            {evento.numeroInvitados && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" />
                {evento.numeroInvitados} invitados
              </div>
            )}
          </div>

          {/* Progreso */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Progreso</span>
              <span className="font-medium tabular-nums">{evento.progreso}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${evento.progreso}%` }}
              />
            </div>
          </div>

          {/* Acción */}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            nativeButton={false}
            render={<Link href={`/eventos/${evento.id}`} />}
          >
            Gestionar
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
