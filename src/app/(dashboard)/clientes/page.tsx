'use client'

import { useState, useMemo } from 'react'
import { Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClienteCard } from '@/components/clientes/ClienteCard'
import { NuevoClienteDialog } from '@/components/clientes/NuevoClienteDialog'
import { mockClientes, mockEventos } from '@/data/mock'
import type { EstadoCliente } from '@/types'
import { cn } from '@/lib/utils'

type Filtro = 'todos' | EstadoCliente

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todos',     label: 'Todos' },
  { value: 'activo',    label: 'Activos' },
  { value: 'prospecto', label: 'Prospectos' },
  { value: 'completado', label: 'Completados' },
  { value: 'cancelado', label: 'Cancelados' },
]

export default function ClientesPage() {
  const [query, setQuery] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const clientesFiltrados = useMemo(() => {
    return mockClientes.filter((c) => {
      const matchesEstado = filtro === 'todos' || c.estado === filtro
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      return matchesEstado && matchesQuery
    })
  }, [query, filtro])

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Clientes</h1>
          <p className="text-sm text-text-muted">
            {mockClientes.length} clientes en total
          </p>
        </div>
        <NuevoClienteDialog />
      </div>

      {/* ── Search + Filtros ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTROS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filtro === f.value ? 'default' : 'outline'}
              className={cn(
                'shrink-0',
                filtro === f.value && 'bg-brand text-white hover:bg-brand/90'
              )}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Grid / Empty state ───────────────────────────────────── */}
      {clientesFiltrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientesFiltrados.map((cliente) => {
            const evento = mockEventos.find((e) => e.clienteId === cliente.id)
            return (
              <ClienteCard key={cliente.id} cliente={cliente} evento={evento} />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-border bg-background py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-text-muted" />
          </div>
          <p className="mt-4 font-medium text-text-primary">Sin resultados</p>
          <p className="mt-1 text-sm text-text-muted">
            {query
              ? `No se encontraron clientes para "${query}"`
              : 'No hay clientes con ese estado'}
          </p>
          {query && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => { setQuery(''); setFiltro('todos') }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
