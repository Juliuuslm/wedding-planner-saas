import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Cliente, Evento } from '@/types'

interface ClienteCardProps {
  cliente: Cliente
  evento?: Evento
}

const ESTADO_MAP: Record<Cliente['estado'], { label: string; className: string }> = {
  activo:     { label: 'Activo',     className: 'bg-success/10 text-success border-success/20' },
  prospecto:  { label: 'Prospecto',  className: 'bg-gold/10 text-gold border-gold/20' },
  completado: { label: 'Completado', className: 'bg-muted text-text-muted' },
  cancelado:  { label: 'Cancelado',  className: 'bg-danger/10 text-danger border-danger/20' },
}

export function ClienteCard({ cliente, evento }: ClienteCardProps) {
  const initials = (cliente.nombre[0] + cliente.apellido[0]).toUpperCase()
  const estado = ESTADO_MAP[cliente.estado]
  const fechaFormateada = evento
    ? new Date(evento.fecha).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header: avatar + nombre + badge */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-brand text-xs font-semibold text-gold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-semibold text-text-primary">
                  {cliente.nombre} {cliente.apellido}
                </p>
                <Badge variant="outline" className={cn('shrink-0 text-xs', estado.className)}>
                  {estado.label}
                </Badge>
              </div>
              {evento ? (
                <p className="mt-0.5 truncate text-sm text-text-secondary">{evento.nombre}</p>
              ) : (
                <p className="mt-0.5 text-sm italic text-text-muted">Sin evento asociado</p>
              )}
            </div>
          </div>

          {/* Fecha del evento */}
          {fechaFormateada && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{fechaFormateada}</span>
            </div>
          )}

          {/* Ver perfil */}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            render={<Link href={`/clientes/${cliente.id}`} />}
          >
            Ver perfil
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
