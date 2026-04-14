'use client'

import { useMemo, type CSSProperties } from 'react'
import { addDays, differenceInDays, format, eachWeekOfInterval, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tarea } from '@/types'

const FASES = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento', 'Post-evento']

const ESTADO_MAP = {
  pendiente:   { label: 'Pendiente',   bar: 'bg-muted border border-warm-border text-text-muted' },
  en_progreso: { label: 'En progreso', bar: 'bg-gold/20 border border-gold/50 text-gold' },
  completada:  { label: 'Completada',  bar: 'bg-success/15 border border-success/40 text-success' },
  atrasada:    { label: 'Atrasada',    bar: 'bg-danger/15 border border-danger/40 text-danger' },
}

interface GanttViewProps {
  tareas: Tarea[]
  eventoFecha: string
}

export function GanttView({ tareas, eventoFecha }: GanttViewProps) {
  const startDate = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const endDate = useMemo(() => addDays(new Date(eventoFecha), 14), [eventoFecha])
  const totalDays = differenceInDays(endDate, startDate)

  const weeks = useMemo(
    () => eachWeekOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  )

  function pct(days: number) {
    return `${(days / totalDays) * 100}%`
  }

  function barStyle(tarea: Tarea): CSSProperties {
    const start = tarea.fechaInicio
      ? new Date(tarea.fechaInicio)
      : subDays(new Date(tarea.fechaVencimiento), 7)
    const end = new Date(tarea.fechaVencimiento)
    const left  = Math.max(0, differenceInDays(start, startDate))
    const width = Math.max(1, differenceInDays(end, start))
    return { left: pct(left), width: pct(width) }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-border">
      {/* Date header */}
      <div className="flex min-w-[600px]">
        <div className="w-36 shrink-0 border-b border-r border-warm-border bg-muted/30 px-3 py-2">
          <span className="text-xs font-medium text-text-muted">Fase</span>
        </div>
        <div className="relative flex-1 border-b border-warm-border bg-muted/10">
          {weeks.map((week, i) => {
            const dayOffset = differenceInDays(week, startDate)
            if (dayOffset < 0 || dayOffset > totalDays) return null
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-warm-border/50"
                style={{ left: pct(dayOffset) }}
              >
                <span className="absolute left-1 top-2 whitespace-nowrap text-[10px] text-text-muted">
                  {format(week, 'd MMM', { locale: es })}
                </span>
              </div>
            )
          })}
          <div className="h-8" />
        </div>
      </div>

      {/* Phase rows */}
      {FASES.map((fase) => {
        const phaseTareas = tareas.filter((t) => t.fase === fase)
        return (
          <div key={fase} className="flex min-w-[600px] border-b border-warm-border last:border-0">
            {/* Phase label */}
            <div className="flex w-36 shrink-0 items-center border-r border-warm-border bg-muted/10 px-3 py-3">
              <span className="text-xs font-medium text-text-secondary">{fase}</span>
            </div>
            {/* Task track */}
            <div className="relative min-h-[56px] flex-1 py-2">
              {/* Week grid lines */}
              {weeks.map((week, i) => {
                const dayOffset = differenceInDays(week, startDate)
                if (dayOffset <= 0 || dayOffset > totalDays) return null
                return (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-warm-border/30"
                    style={{ left: pct(dayOffset) }}
                  />
                )
              })}
              {/* Today line */}
              <div
                className="absolute top-0 bottom-0 z-10 w-0.5 bg-gold"
                style={{ left: pct(0) }}
              />
              {/* Task bars */}
              {phaseTareas.map((tarea) => {
                const est = ESTADO_MAP[tarea.estado]
                return (
                  <div
                    key={tarea.id}
                    className={cn(
                      'group absolute top-2 flex h-8 cursor-default items-center overflow-visible',
                      'rounded-md px-2 text-xs font-medium',
                      est.bar
                    )}
                    style={barStyle(tarea)}
                  >
                    <span className="truncate">{tarea.titulo}</span>
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5
                      hidden w-52 group-hover:block rounded-lg border border-warm-border
                      bg-background p-2.5 shadow-lg">
                      <p className="font-medium text-text-primary">{tarea.titulo}</p>
                      <p className="mt-1 text-xs text-text-muted">{tarea.responsable ?? '—'}</p>
                      <p className="text-xs text-text-muted">
                        Vence:{' '}
                        {new Date(tarea.fechaVencimiento).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'mt-1.5 text-[10px]',
                          tarea.estado === 'completada'  ? 'bg-success/10 text-success border-success/30' :
                          tarea.estado === 'atrasada'    ? 'bg-danger/10 text-danger border-danger/30' :
                          tarea.estado === 'en_progreso' ? 'bg-gold/10 text-gold border-gold/30' :
                          'text-text-muted'
                        )}
                      >
                        {est.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {/* Empty phase placeholder */}
              {phaseTareas.length === 0 && (
                <p className="absolute inset-0 flex items-center px-3 text-xs text-text-muted/40">
                  Sin tareas
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
