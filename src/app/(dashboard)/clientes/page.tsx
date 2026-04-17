'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, Users, TrendingUp, CalendarHeart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NuevoClienteDialog } from '@/components/clientes/NuevoClienteDialog'
import { getClientes } from '@/lib/api/clientes'
import { getEventos } from '@/lib/api/eventos'
import type { Cliente, Evento } from '@/types'
import { cn } from '@/lib/utils'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

function getInitials(nombre: string, apellido: string) {
  return `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()
}

interface ClienteRow {
  cliente: Cliente
  eventos: Evento[]
  numEventos: number
  ltv: number
  proximoEvento: Evento | null
  ultimoEvento: Evento | null
  tieneActivo: boolean
  esLead: boolean
}

export default function ClientesPage() {
  const [query, setQuery] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loaded, setLoaded] = useState(false)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    void Promise.all([getClientes(), getEventos()]).then(([c, e]) => {
      setClientes(c)
      setEventos(e)
      setLoaded(true)
    })
  }, [])

  const rows: ClienteRow[] = useMemo(() => {
    return clientes.map((cliente) => {
      const eventosDelCliente = eventos.filter((e) => e.clienteId === cliente.id)
      const ltv = eventosDelCliente.reduce((s, e) => s + (e.presupuestoTotal ?? 0), 0)
      const futuros = eventosDelCliente
        .filter((e) => new Date(e.fecha).getTime() >= now)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      const pasados = eventosDelCliente
        .filter((e) => new Date(e.fecha).getTime() < now)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      return {
        cliente,
        eventos: eventosDelCliente,
        numEventos: eventosDelCliente.length,
        ltv,
        proximoEvento: futuros[0] ?? null,
        ultimoEvento: pasados[0] ?? null,
        tieneActivo: eventosDelCliente.some((e) => e.estado === 'activo' || e.estado === 'planificacion'),
        esLead: eventosDelCliente.length > 0 && eventosDelCliente.every((e) => e.estado === 'lead'),
      }
    })
  }, [clientes, eventos, now])

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(({ cliente }) =>
      cliente.nombre.toLowerCase().includes(q) ||
      cliente.apellido.toLowerCase().includes(q) ||
      cliente.email.toLowerCase().includes(q),
    )
  }, [rows, query])

  // Métricas header
  const totalLtv = rows.reduce((s, r) => s + r.ltv, 0)
  const clientesRepeat = rows.filter((r) => r.numEventos > 1).length

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Clientes</h1>
          <p className="mt-1 text-sm text-text-muted">
            Directorio de relaciones con historial de eventos y valor total.
          </p>
        </div>
        <NuevoClienteDialog />
      </div>

      {/* ── Métricas CRM ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-warm-border bg-background p-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Users className="h-3.5 w-3.5" />
            Total clientes
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{clientes.length}</p>
        </div>
        <div className="rounded-xl border border-warm-border bg-background p-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <TrendingUp className="h-3.5 w-3.5" />
            LTV total
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{fmt.format(totalLtv)}</p>
        </div>
        <div className="rounded-xl border border-warm-border bg-background p-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <CalendarHeart className="h-3.5 w-3.5" />
            Con múltiples eventos
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{clientesRepeat}</p>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Buscar por nombre o correo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      {filtradas.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-warm-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Eventos</TableHead>
                <TableHead>Próximo / Último</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map(({ cliente, numEventos, ltv, proximoEvento, ultimoEvento, tieneActivo, esLead }) => {
                const eventoDestacado = proximoEvento ?? ultimoEvento
                return (
                  <TableRow
                    key={cliente.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => window.location.assign(`/clientes/${cliente.id}`)}
                  >
                    <TableCell>
                      <Link href={`/clientes/${cliente.id}`} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-brand text-xs font-semibold text-gold">
                            {getInitials(cliente.nombre, cliente.apellido)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text-primary">
                            {cliente.nombre} {cliente.apellido}
                          </p>
                          <p className="truncate text-xs text-text-muted">{cliente.email}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      <span className={cn(
                        'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold',
                        numEventos === 0
                          ? 'bg-muted text-text-muted'
                          : numEventos === 1
                            ? 'bg-brand/10 text-brand'
                            : 'bg-gold/15 text-gold',
                      )}>
                        {numEventos}
                      </span>
                    </TableCell>
                    <TableCell>
                      {eventoDestacado ? (
                        <div className="text-sm">
                          <p className="truncate font-medium text-text-primary">{eventoDestacado.nombre}</p>
                          <p className="text-xs text-text-muted">
                            {proximoEvento ? 'Próximo' : 'Último'} · {fmtDate(eventoDestacado.fecha)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">Sin eventos</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-text-primary">
                      {ltv > 0 ? fmt.format(ltv) : <span className="text-text-muted">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {tieneActivo ? (
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Activo</Badge>
                      ) : esLead ? (
                        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">Lead</Badge>
                      ) : numEventos > 0 ? (
                        <Badge variant="outline" className="text-text-muted">Completado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-text-muted">Sin eventos</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : loaded ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-border bg-background py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-text-muted" />
          </div>
          <p className="mt-4 font-medium text-text-primary">
            {query ? 'Sin resultados' : 'Todavía no tienes clientes'}
          </p>
          <p className="mt-1 max-w-xs text-center text-sm text-text-muted">
            {query
              ? `No se encontraron clientes para "${query}"`
              : 'Los clientes se crean automáticamente cuando registras un evento. O agrega uno manualmente si aún no tienes evento.'}
          </p>
          {query ? (
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setQuery('')}>
              Limpiar búsqueda
            </Button>
          ) : (
            <div className="mt-4 flex gap-2">
              <Button size="sm" nativeButton={false} render={<Link href="/eventos" />}>
                Nuevo evento
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
