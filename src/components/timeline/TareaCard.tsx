import { CalendarDays } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tarea } from '@/types'

const ESTADO_MAP = {
  pendiente:   { label: 'Pendiente',   className: 'bg-muted text-text-muted' },
  en_progreso: { label: 'En progreso', className: 'bg-gold/10 text-gold border-gold/30' },
  completada:  { label: 'Completada',  className: 'bg-success/10 text-success border-success/30' },
  atrasada:    { label: 'Atrasada',    className: 'bg-danger/10 text-danger border-danger/30' },
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export function TareaCard({ tarea }: { tarea: Tarea }) {
  const estado = ESTADO_MAP[tarea.estado]
  const isCompletada = tarea.estado === 'completada'
  return (
    <div className="flex items-center gap-3 rounded-lg border border-warm-border bg-background px-3 py-2.5 shadow-sm">
      {/* Checkbox decorativo */}
      <div className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
        isCompletada ? 'border-success bg-success/10' : 'border-warm-border'
      )}>
        {isCompletada && <div className="h-2 w-2 rounded-sm bg-success" />}
      </div>
      {/* Título */}
      <p className={cn(
        'flex-1 truncate text-sm font-medium',
        isCompletada ? 'text-text-muted line-through' : 'text-text-primary'
      )}>
        {tarea.titulo}
      </p>
      {/* Responsable avatar */}
      <Avatar className="h-6 w-6 shrink-0">
        <AvatarFallback className="bg-brand text-[10px] text-gold">
          {getInitials(tarea.responsable)}
        </AvatarFallback>
      </Avatar>
      {/* Fecha */}
      <span className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
        <CalendarDays className="h-3 w-3" />
        {formatDate(tarea.fechaVencimiento)}
      </span>
      {/* Estado */}
      <Badge variant="outline" className={cn('shrink-0 text-xs', estado.className)}>
        {estado.label}
      </Badge>
    </div>
  )
}
