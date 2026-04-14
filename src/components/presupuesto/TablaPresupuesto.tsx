'use client'

import React, { useState, useMemo } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LineaPresupuesto, CategoriaProveedor } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)
}

const CATEGORIA_LABEL: Record<CategoriaProveedor, string> = {
  venue:       'Venue',
  catering:    'Catering',
  floreria:    'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  otro:        'Otros',
}

const ESTADO_MAP = {
  pagado:         { label: 'Pagado',    className: 'bg-success/10 text-success border-success/30' },
  pagado_parcial: { label: 'Parcial',   className: 'bg-gold/10 text-gold border-gold/30' },
  pendiente:      { label: 'Pendiente', className: 'bg-warning/10 text-warning border-warning/30' },
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columnHelper = createColumnHelper<LineaPresupuesto>()

const columns = [
  columnHelper.accessor('concepto', {
    header: 'Concepto',
    cell: (info) => (
      <span className="font-medium text-text-primary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('montoEstimado', {
    header: () => <span className="block text-right">Estimado</span>,
    cell: (info) => (
      <span className="block text-right tabular-nums">{fmt(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor('montoReal', {
    header: () => <span className="block text-right">Real</span>,
    cell: (info) => {
      const real = info.getValue()
      const estimado = info.row.original.montoEstimado
      const over = real !== undefined && real > estimado
      return (
        <span className={cn('flex items-center justify-end gap-1 tabular-nums', over && 'text-danger')}>
          {over && <AlertTriangle className="h-3 w-3 shrink-0" />}
          {real !== undefined ? fmt(real) : <span className="text-text-muted">—</span>}
        </span>
      )
    },
  }),
  columnHelper.accessor('montoPagado', {
    header: () => <span className="block text-right">Pagado</span>,
    cell: (info) => (
      <span className="block text-right tabular-nums">{fmt(info.getValue())}</span>
    ),
  }),
  columnHelper.display({
    id: 'saldo',
    header: () => <span className="block text-right">Saldo</span>,
    cell: (info) => {
      const { montoEstimado, montoReal, montoPagado } = info.row.original
      const saldo = (montoReal ?? montoEstimado) - montoPagado
      return (
        <span
          className={cn(
            'block text-right tabular-nums font-medium',
            saldo > 0 ? 'text-warning' : 'text-success'
          )}
        >
          {fmt(saldo)}
        </span>
      )
    },
  }),
  columnHelper.accessor('estado', {
    header: () => <span className="block text-right">Estado</span>,
    cell: (info) => {
      const est = ESTADO_MAP[info.getValue()]
      return (
        <div className="flex justify-end">
          <Badge variant="outline" className={cn('text-xs', est.className)}>
            {est.label}
          </Badge>
        </div>
      )
    },
  }),
]

// ─── Component ────────────────────────────────────────────────────────────────

export function TablaPresupuesto({ lineas }: { lineas: LineaPresupuesto[] }) {
  // Group all lineas by category (preserve insertion order)
  const grupos = useMemo(() => {
    const map = new Map<CategoriaProveedor, LineaPresupuesto[]>()
    for (const l of lineas) {
      if (!map.has(l.categoria)) map.set(l.categoria, [])
      map.get(l.categoria)!.push(l)
    }
    return map
  }, [lineas])

  // Default: all categories expanded
  const [expanded, setExpanded] = useState<Set<CategoriaProveedor>>(
    () => new Set(lineas.map((l) => l.categoria))
  )

  // Rows fed to TanStack Table: only items in expanded categories
  const visibleLineas = useMemo(
    () => lineas.filter((l) => expanded.has(l.categoria)),
    [lineas, expanded]
  )

  const table = useReactTable({
    data: visibleLineas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Grand totals (over all lineas, not just visible)
  const totales = useMemo(() => ({
    estimado: lineas.reduce((s, l) => s + l.montoEstimado, 0),
    pagado:   lineas.reduce((s, l) => s + l.montoPagado, 0),
    saldo:    lineas.reduce((s, l) => s + ((l.montoReal ?? l.montoEstimado) - l.montoPagado), 0),
  }), [lineas])

  function toggle(cat: CategoriaProveedor) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  // Mutable tracker — safe because React renders synchronously
  let lastCat: CategoriaProveedor | null = null

  return (
    <div className="overflow-hidden rounded-lg border border-warm-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              <TableHead className="w-8" />
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const cat = row.original.categoria
            const isNew = cat !== lastCat
            if (isNew) lastCat = cat

            const groupLineas = grupos.get(cat) ?? []
            const isOpen = expanded.has(cat)

            return (
              <React.Fragment key={row.id}>
                {/* Group header — rendered once per category */}
                {isNew && (
                  <TableRow
                    className="cursor-pointer select-none bg-muted/30 hover:bg-muted/50"
                    onClick={() => toggle(cat)}
                  >
                    <TableCell className="w-8 py-2">
                      {isOpen
                        ? <ChevronDown className="h-4 w-4 text-text-muted" />
                        : <ChevronRight className="h-4 w-4 text-text-muted" />}
                    </TableCell>
                    <TableCell className="py-2 font-semibold text-text-primary" colSpan={2}>
                      {CATEGORIA_LABEL[cat]}
                      <span className="ml-2 text-xs font-normal text-text-muted">
                        ({groupLineas.length} {groupLineas.length === 1 ? 'ítem' : 'ítems'})
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right tabular-nums text-text-secondary">
                      {fmt(groupLineas.reduce((s, l) => s + l.montoEstimado, 0))}
                    </TableCell>
                    <TableCell className="py-2 text-right tabular-nums text-text-secondary">
                      {fmt(groupLineas.reduce((s, l) => s + l.montoPagado, 0))}
                    </TableCell>
                    <TableCell className="py-2 text-right tabular-nums text-text-secondary">
                      {fmt(groupLineas.reduce((s, l) => s + ((l.montoReal ?? l.montoEstimado) - l.montoPagado), 0))}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}

                {/* Item row */}
                <TableRow className="hover:bg-muted/20">
                  <TableCell className="w-8" />
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm text-text-secondary">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </React.Fragment>
            )
          })}
        </TableBody>

        <TableFooter>
          <TableRow className="border-t-2 font-semibold">
            <TableCell className="w-8" />
            <TableCell className="text-text-primary">Total general</TableCell>
            <TableCell className="text-right tabular-nums text-text-primary">
              {fmt(totales.estimado)}
            </TableCell>
            <TableCell />
            <TableCell className="text-right tabular-nums text-text-primary">
              {fmt(totales.pagado)}
            </TableCell>
            <TableCell
              className={cn(
                'text-right tabular-nums',
                totales.saldo > 0 ? 'text-warning' : 'text-success'
              )}
            >
              {fmt(totales.saldo)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
