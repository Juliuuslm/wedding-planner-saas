import Link from 'next/link'
import { CalendarDays, MapPin, Users, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Evento, Cliente, Paquete } from '@/types'

interface EventoHeaderProps {
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
}

const ESTADO_MAP: Record<Evento['estado'], { label: string; className: string }> = {
  lead:          { label: 'Lead',          className: 'bg-brand/10 text-brand border-brand/20' },
  activo:        { label: 'Activo',        className: 'bg-success/10 text-success border-success/20' },
  planificacion: { label: 'Planificación', className: 'bg-gold/10 text-gold border-gold/20' },
  completado:    { label: 'Completado',    className: 'bg-muted text-text-muted' },
  cancelado:     { label: 'Cancelado',     className: 'bg-danger/10 text-danger border-danger/20' },
}

export function EventoHeader({ evento, cliente, paquete }: EventoHeaderProps) {
  const estado = ESTADO_MAP[evento.estado]
  const fecha = new Date(evento.fecha).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const clienteInitials = cliente
    ? (cliente.nombre[0] + cliente.apellido[0]).toUpperCase()
    : '?'

  return (
    <div className="space-y-4">
      {/* Back */}
      <Button
        size="sm"
        variant="ghost"
        className="-ml-1 text-text-secondary"
        nativeButton={false}
        render={<Link href="/eventos" />}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Volver a eventos
      </Button>

      {/* Title + badge */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{evento.nombre}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-text-muted" />
              <span className="capitalize">{fecha}</span>
            </span>
            {evento.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-text-muted" />
                {evento.venue}
              </span>
            )}
            {evento.numeroInvitados && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-text-muted" />
                {evento.numeroInvitados} invitados
              </span>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn('text-sm', estado.className)}>
          {estado.label}
        </Badge>
      </div>

      {/* Progreso + cliente */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Barra de progreso grande */}
        <div className="min-w-[200px] flex-1 space-y-1.5">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Progreso general</span>
            <span className="font-semibold tabular-nums text-text-primary">{evento.progreso}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${evento.progreso}%` }}
            />
          </div>
          {paquete && (
            <p className="text-xs text-text-muted">Paquete: {paquete.nombre}</p>
          )}
        </div>

        {/* Cliente */}
        {cliente && (
          <Link
            href={`/clientes/${cliente.id}`}
            className="flex items-center gap-2 rounded-lg border border-warm-border bg-background px-3 py-2 transition-colors hover:border-gold/40 hover:bg-gold/5"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-brand text-xs text-gold">
                {clienteInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-xs text-text-muted">Cliente</p>
              <p className="text-sm font-medium text-text-primary">
                {cliente.nombre} {cliente.apellido}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
