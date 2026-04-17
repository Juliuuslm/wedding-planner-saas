'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { getContratos } from '@/lib/api/contratos'
import { getEventos } from '@/lib/api/eventos'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NuevoContratoGlobalDialog } from '@/components/contratos/NuevoContratoGlobalDialog'
import { cn } from '@/lib/utils'
import type { Contrato, Evento, EstadoContrato, TipoContrato } from '@/types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string | undefined) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ESTADO_MAP: Record<EstadoContrato, { label: string; className: string }> = {
  borrador:  { label: 'Borrador',  className: 'bg-muted text-text-muted' },
  enviado:   { label: 'Enviado',   className: 'bg-warning/10 text-warning border-warning/30' },
  firmado:   { label: 'Firmado',   className: 'bg-success/10 text-success border-success/30' },
  cancelado: { label: 'Cancelado', className: 'bg-danger/10 text-danger border-danger/30' },
}

const TIPOS_FILTRO: Array<{ value: 'todos' | TipoContrato; label: string }> = [
  { value: 'todos',      label: 'Todos' },
  { value: 'cliente',    label: 'Cliente' },
  { value: 'proveedor',  label: 'Proveedor' },
]

const ESTADOS_FILTRO: Array<{ value: 'todos' | EstadoContrato; label: string }> = [
  { value: 'todos',     label: 'Todos' },
  { value: 'borrador',  label: 'Borrador' },
  { value: 'enviado',   label: 'Enviado' },
  { value: 'firmado',   label: 'Firmado' },
  { value: 'cancelado', label: 'Cancelado' },
]

export default function ContratosPage() {
  const [filtroTipo, setFiltroTipo]     = useState<'todos' | TipoContrato>('todos')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoContrato>('todos')
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    void Promise.all([getContratos(), getEventos()]).then(([c, e]) => {
      setContratos(c)
      setEventos(e)
    })
  }, [])

  const filtrados = useMemo(() =>
    contratos.filter((c) => {
      const matchTipo   = filtroTipo   === 'todos' || c.tipo   === filtroTipo
      const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
      return matchTipo && matchEstado
    }),
  [contratos, filtroTipo, filtroEstado])

  function getNombreEvento(eventoId: string) {
    return eventos.find((e) => e.id === eventoId)?.nombre ?? '—'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Contratos</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {filtrados.length} de {contratos.length} contratos
          </p>
        </div>
        <NuevoContratoGlobalDialog />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Tipo */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Tipo:</span>
          {TIPOS_FILTRO.map((t) => (
            <button
              key={t.value}
              onClick={() => setFiltroTipo(t.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filtroTipo === t.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-warm-border bg-background text-text-secondary hover:border-brand/40',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Estado:</span>
          {ESTADOS_FILTRO.map((e) => (
            <button
              key={e.value}
              onClick={() => setFiltroEstado(e.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filtroEstado === e.value
                  ? 'border-brand bg-brand text-white'
                  : 'border-warm-border bg-background text-text-secondary hover:border-brand/40',
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtrados.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-warm-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-text-primary">Evento</TableHead>
                <TableHead className="font-semibold text-text-primary">Contraparte</TableHead>
                <TableHead className="font-semibold text-text-primary">Tipo</TableHead>
                <TableHead className="font-semibold text-text-primary">Estado</TableHead>
                <TableHead className="text-right font-semibold text-text-primary">Monto total</TableHead>
                <TableHead className="font-semibold text-text-primary">Fecha creación</TableHead>
                <TableHead className="font-semibold text-text-primary">Fecha firma</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((contrato) => {
                const estado = ESTADO_MAP[contrato.estado]
                return (
                  <TableRow key={contrato.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-text-primary">
                      {getNombreEvento(contrato.eventoId)}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {contrato.contraparte}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          contrato.tipo === 'cliente'
                            ? 'bg-brand/10 text-brand border-brand/20'
                            : 'bg-muted text-text-muted',
                        )}
                      >
                        {contrato.tipo === 'cliente' ? 'Cliente' : 'Proveedor'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', estado.className)}>
                        {estado.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-text-primary">
                      {fmt(contrato.montoTotal)}
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {fmtDate(contrato.fechaCreacion)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-sm',
                        contrato.fechaFirma ? 'font-medium text-success' : 'text-text-muted',
                      )}
                    >
                      {contrato.fechaFirma ? fmtDate(contrato.fechaFirma) : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-text-muted"
                        nativeButton={false}
                        render={<Link href={`/eventos/${contrato.eventoId}`} />}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-16 text-center">
          <p className="font-medium text-text-primary">Sin contratos</p>
          <p className="mt-1 text-sm text-text-muted">
            Ajusta los filtros o crea un nuevo contrato
          </p>
        </div>
      )}
    </div>
  )
}
