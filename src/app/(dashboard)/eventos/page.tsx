'use client'

import { useState, useMemo, useEffect } from 'react'
import { CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventoCard } from '@/components/eventos/EventoCard'
import { NuevoEventoDialog } from '@/components/eventos/NuevoEventoDialog'
import { getEventos } from '@/lib/api/eventos'
import { getClientes } from '@/lib/api/clientes'
import type { Evento, Cliente, EstadoEvento } from '@/types'
import { cn } from '@/lib/utils'

type FiltroEstado = 'todos' | EstadoEvento
type FiltroFecha  = 'todos' | '30dias' | '3meses'

const FILTROS_ESTADO: { value: FiltroEstado; label: string }[] = [
  { value: 'todos',         label: 'Todos' },
  { value: 'activo',        label: 'Activos' },
  { value: 'planificacion', label: 'Planificación' },
  { value: 'completado',    label: 'Completados' },
]

const FILTROS_FECHA: { value: FiltroFecha; label: string }[] = [
  { value: 'todos',  label: 'Todas las fechas' },
  { value: '30dias', label: 'Próximos 30 días' },
  { value: '3meses', label: 'Próximos 3 meses' },
]

export default function EventosPage() {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [filtroFecha, setFiltroFecha]   = useState<FiltroFecha>('todos')
  const [eventos, setEventos] = useState<Evento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    void Promise.all([getEventos(), getClientes()]).then(([e, c]) => {
      setEventos(e)
      setClientes(c)
    })
  }, [])

  const eventosFiltrados = useMemo(() => {
    const ahora = new Date()
    return eventos.filter((e) => {
      if (filtroEstado !== 'todos' && e.estado !== filtroEstado) return false
      if (filtroFecha !== 'todos') {
        const fecha = new Date(e.fecha)
        const dias  = filtroFecha === '30dias' ? 30 : 90
        const limite = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000)
        if (fecha < ahora || fecha > limite) return false
      }
      return true
    })
  }, [eventos, filtroEstado, filtroFecha])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Mis Eventos</h1>
          <p className="text-sm text-text-muted">{eventos.length} eventos en total</p>
        </div>
        <NuevoEventoDialog />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTROS_ESTADO.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filtroEstado === f.value ? 'default' : 'outline'}
              className={cn(
                'shrink-0',
                filtroEstado === f.value && 'bg-brand text-white hover:bg-brand/90'
              )}
              onClick={() => setFiltroEstado(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTROS_FECHA.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filtroFecha === f.value ? 'default' : 'outline'}
              className={cn(
                'shrink-0',
                filtroFecha === f.value && 'bg-brand text-white hover:bg-brand/90'
              )}
              onClick={() => setFiltroFecha(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid / empty state */}
      {eventosFiltrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventosFiltrados.map((evento) => {
            const cliente = clientes.find((c) => c.id === evento.clienteId)
            return <EventoCard key={evento.id} evento={evento} cliente={cliente} />
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-border bg-background py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CalendarRange className="h-6 w-6 text-text-muted" />
          </div>
          <p className="mt-4 font-medium text-text-primary">Sin eventos</p>
          <p className="mt-1 text-sm text-text-muted">
            No hay eventos con los filtros seleccionados.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={() => { setFiltroEstado('todos'); setFiltroFecha('todos') }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
