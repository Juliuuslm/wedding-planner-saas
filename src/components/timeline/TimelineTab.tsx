'use client'

import { useState, useMemo } from 'react'
import { GanttView } from './GanttView'
import { ListaView } from './ListaView'
import { NuevaTareaDialog } from './NuevaTareaDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Tarea, EstadoTarea, Evento } from '@/types'

type Vista = 'gantt' | 'lista'

const ESTADOS: { value: EstadoTarea | 'todos'; label: string }[] = [
  { value: 'todos',       label: 'Todos' },
  { value: 'pendiente',   label: 'Pendiente' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completada',  label: 'Completada' },
  { value: 'atrasada',    label: 'Atrasada' },
]

const FASES = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento', 'Post-evento']

interface TimelineTabProps {
  evento: Evento
  tareas: Tarea[]
}

export function TimelineTab({ evento, tareas }: TimelineTabProps) {
  const [vista, setVista] = useState<Vista>('gantt')
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | 'todos'>('todos')
  const [filtroFase, setFiltroFase] = useState<string>('todas')
  const [filtroResponsable, setFiltroResponsable] = useState<string>('todos')

  const responsables = useMemo(() => {
    const set = new Set(tareas.map((t) => t.responsable).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [tareas])

  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t) => {
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      if (filtroFase !== 'todas' && t.fase !== filtroFase) return false
      if (filtroResponsable !== 'todos' && t.responsable !== filtroResponsable) return false
      return true
    })
  }, [tareas, filtroEstado, filtroFase, filtroResponsable])

  return (
    <div className="space-y-5">
      {/* Header: switcher + nueva tarea */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-warm-border bg-muted/30 p-0.5">
          {(['gantt', 'lista'] as Vista[]).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                vista === v
                  ? 'bg-background text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {v === 'gantt' ? 'Gantt' : 'Lista'}
            </button>
          ))}
        </div>
        <NuevaTareaDialog eventoId={evento.id} />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {ESTADOS.map((e) => (
            <Button
              key={e.value}
              size="sm"
              variant={filtroEstado === e.value ? 'default' : 'outline'}
              className={cn(
                'shrink-0 text-xs',
                filtroEstado === e.value && 'bg-brand text-white hover:bg-brand/90'
              )}
              onClick={() => setFiltroEstado(e.value)}
            >
              {e.label}
            </Button>
          ))}
        </div>
        <select
          value={filtroResponsable}
          onChange={(e) => setFiltroResponsable(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="todos">Todos los responsables</option>
          {responsables.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filtroFase}
          onChange={(e) => setFiltroFase(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="todas">Todas las fases</option>
          {FASES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted">
        {tareasFiltradas.length} de {tareas.length} tareas
      </p>

      {/* View */}
      {vista === 'gantt' ? (
        <GanttView tareas={tareasFiltradas} eventoFecha={evento.fecha} />
      ) : (
        <ListaView tareas={tareasFiltradas} />
      )}
    </div>
  )
}
