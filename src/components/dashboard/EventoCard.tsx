import Link from 'next/link'
import { CalendarDays, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Evento, Cliente } from '@/types'

interface EventoCardProps {
  evento: Evento
  cliente: Cliente | undefined
}

const ESTADO_MAP: Record<Evento['estado'], { label: string; className: string }> = {
  activo:        { label: 'Activo',        className: 'bg-success/10 text-success border-success/20' },
  planificacion: { label: 'Planificación', className: 'bg-gold/10 text-gold border-gold/20' },
  completado:    { label: 'Completado',    className: 'bg-muted text-text-muted' },
  cancelado:     { label: 'Cancelado',     className: 'bg-danger/10 text-danger border-danger/20' },
}

export function EventoCard({ evento, cliente }: EventoCardProps) {
  const estado = ESTADO_MAP[evento.estado]
  const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-text-primary">{evento.nombre}</p>
              {cliente && (
                <p className="text-sm text-text-secondary">
                  {cliente.nombre} {cliente.apellido}
                </p>
              )}
            </div>
            <Badge variant="outline" className={estado.className}>
              {estado.label}
            </Badge>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {fechaFormateada}
            </span>
            {evento.numeroInvitados && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {evento.numeroInvitados} invitados
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Progreso general</span>
              <span className="font-medium tabular-nums">{evento.progreso}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${evento.progreso}%` }}
              />
            </div>
          </div>

          {/* Ver evento */}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            render={<Link href={`/eventos/${evento.id}`} />}
          >
            Ver evento
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
