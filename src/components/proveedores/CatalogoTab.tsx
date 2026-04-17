'use client'

import { useState, useMemo } from 'react'
import { Search, Trash2, Download, Package, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { NuevoServicioDialog } from './NuevoServicioDialog'
import { ImportCsvWizard } from './ImportCsvWizard'
import { updateServicio, deleteServicio } from '@/lib/api/servicios-proveedor'
import { toastSuccess, toastError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { ServicioProveedor } from '@/types'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

interface Props {
  proveedorId: string
  initialServicios: ServicioProveedor[]
}

export function CatalogoTab({ proveedorId, initialServicios }: Props) {
  const [servicios, setServicios] = useState<ServicioProveedor[]>(initialServicios)
  const [query, setQuery] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Categorías únicas
  const categorias = useMemo(() => {
    const set = new Set<string>()
    servicios.forEach((s) => s.categoria && set.add(s.categoria))
    return Array.from(set).sort()
  }, [servicios])

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    return servicios.filter((s) => {
      if (soloDisponibles && !s.disponible) return false
      if (filtroCategoria !== 'todas' && s.categoria !== filtroCategoria) return false
      if (!q) return true
      return (
        s.nombre.toLowerCase().includes(q) ||
        (s.descripcion?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [servicios, query, filtroCategoria, soloDisponibles])

  // Métricas
  const totalActivos = servicios.filter((s) => s.disponible).length
  const precioPromedio =
    servicios.length > 0
      ? servicios.reduce((s, x) => s + x.precio, 0) / servicios.length
      : 0

  function handleSaved(saved: ServicioProveedor) {
    setServicios((prev) => {
      const exists = prev.some((x) => x.id === saved.id)
      return exists
        ? prev.map((x) => (x.id === saved.id ? saved : x))
        : [...prev, saved]
    })
  }

  async function handleToggleDisponible(s: ServicioProveedor) {
    try {
      const updated = await updateServicio(proveedorId, s.id, { disponible: !s.disponible })
      handleSaved(updated)
    } catch {
      toastError('Error al actualizar', 'Intenta de nuevo.')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteServicio(proveedorId, id)
      setServicios((prev) => prev.filter((x) => x.id !== id))
      setDeleteId(null)
      toastSuccess('Servicio eliminado', 'Se removió del catálogo.')
    } catch {
      toastError('Error al eliminar', 'Intenta de nuevo.')
    }
  }

  function handleBulkImported(nuevos: ServicioProveedor[]) {
    setServicios((prev) => [...prev, ...nuevos])
  }

  function handleExportCsv() {
    if (servicios.length === 0) {
      toastError('Sin datos', 'No hay servicios para exportar.')
      return
    }
    const headers = ['nombre', 'descripcion', 'precio', 'unidad', 'cantidadTipica', 'categoria', 'disponible', 'notas']
    const rows = servicios.map((s) => [
      s.nombre,
      s.descripcion ?? '',
      s.precio,
      s.unidad,
      s.cantidadTipica ?? '',
      s.categoria ?? '',
      s.disponible ? 'true' : 'false',
      s.notas ?? '',
    ])
    const escape = (v: unknown) => {
      const str = String(v ?? '')
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }
    const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `catalogo-${proveedorId}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toastSuccess('CSV descargado', `${servicios.length} servicios exportados.`)
  }

  return (
    <div className="space-y-5">
      {/* Header + métricas */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Catálogo de servicios</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            {servicios.length} servicios · {totalActivos} disponibles
            {precioPromedio > 0 && ` · ${fmt.format(precioPromedio)} precio promedio`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleExportCsv} disabled={servicios.length === 0}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exportar CSV
          </Button>
          <ImportCsvWizard
            proveedorId={proveedorId}
            onImported={handleBulkImported}
          />
          <NuevoServicioDialog proveedorId={proveedorId} onSaved={handleSaved} />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar en catálogo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {categorias.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <Switch checked={soloDisponibles} onCheckedChange={setSoloDisponibles} />
          Sólo disponibles
        </label>
      </div>

      {/* Tabla */}
      {filtrados.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-warm-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Sub-categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((s) => (
                <TableRow key={s.id} className={cn(!s.disponible && 'opacity-60')}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-text-primary">{s.nombre}</p>
                      {s.descripcion && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">{s.descripcion}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.categoria ? (
                      <Badge variant="outline" className="text-xs">{s.categoria}</Badge>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="tabular-nums">
                      <span className="font-medium text-text-primary">{fmt.format(s.precio)}</span>
                      <p className="text-xs text-text-muted">por {s.unidad}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={s.disponible}
                      onCheckedChange={() => handleToggleDisponible(s)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <NuevoServicioDialog
                        proveedorId={proveedorId}
                        servicio={s}
                        onSaved={handleSaved}
                        trigger="edit-icon"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-text-muted hover:text-danger"
                        onClick={() => setDeleteId(s.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-border bg-background py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Package className="h-6 w-6 text-text-muted" />
          </div>
          <p className="font-medium text-text-primary">
            {servicios.length === 0 ? 'Catálogo vacío' : 'Sin resultados'}
          </p>
          <p className="mt-1 max-w-xs text-sm text-text-muted">
            {servicios.length === 0
              ? 'Agrega servicios manualmente o importa un CSV con todo tu catálogo.'
              : 'Ajusta los filtros para ver más resultados.'}
          </p>
          {servicios.length === 0 && (
            <div className="mt-4 flex gap-2">
              <NuevoServicioDialog proveedorId={proveedorId} onSaved={handleSaved} />
              <ImportCsvWizard proveedorId={proveedorId} onImported={handleBulkImported} />
            </div>
          )}
        </div>
      )}

      {/* Confirmación de eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El servicio será eliminado del catálogo.
              Las líneas de presupuesto ya creadas con este servicio conservan su precio pero pierden la referencia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
