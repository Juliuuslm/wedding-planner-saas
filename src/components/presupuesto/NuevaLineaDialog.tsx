'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createLineaPresupuesto } from '@/lib/api/presupuesto'
import { getProveedores } from '@/lib/api/proveedores'
import { getServicios } from '@/lib/api/servicios-proveedor'
import { toastSuccess, toastError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { Proveedor, ServicioProveedor, CategoriaProveedor, EstadoLinea } from '@/types'

const CATEGORIAS: { value: CategoriaProveedor; label: string }[] = [
  { value: 'venue',          label: 'Venue' },
  { value: 'catering',       label: 'Catering' },
  { value: 'flores',         label: 'Flores' },
  { value: 'fotografia',     label: 'Fotografía' },
  { value: 'video',          label: 'Video' },
  { value: 'musica',         label: 'Música' },
  { value: 'decoracion',     label: 'Decoración' },
  { value: 'pasteleria',     label: 'Pastelería' },
  { value: 'invitaciones',   label: 'Invitaciones' },
  { value: 'transporte',     label: 'Transporte' },
  { value: 'entretenimiento',label: 'Entretenimiento' },
  { value: 'iluminacion',    label: 'Iluminación' },
  { value: 'mobiliario',     label: 'Mobiliario' },
  { value: 'otro',           label: 'Otro' },
]

const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

interface Props {
  eventoId: string
}

export function NuevaLineaDialog({ eventoId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [servicios, setServicios] = useState<ServicioProveedor[]>([])
  const [loadingServicios, setLoadingServicios] = useState(false)

  // Form state
  const [categoria, setCategoria] = useState<CategoriaProveedor>('otro')
  const [proveedorId, setProveedorId] = useState('')
  const [servicioId, setServicioId] = useState('')
  const [concepto, setConcepto] = useState('')
  const [montoEstimado, setMontoEstimado] = useState('')
  const [estado, setEstado] = useState<EstadoLinea>('pendiente')

  const [servicioComboOpen, setServicioComboOpen] = useState(false)

  // ── Load proveedores on open ─────────────────────────────────────
  useEffect(() => {
    if (!open) return
    void getProveedores().then(setProveedores).catch(() => {})
  }, [open])

  // ── Load servicios when proveedor changes ────────────────────────
  useEffect(() => {
    if (!proveedorId) {
      setServicios([])
      return
    }
    setLoadingServicios(true)
    void getServicios(proveedorId, { disponible: true })
      .then(setServicios)
      .catch(() => setServicios([]))
      .finally(() => setLoadingServicios(false))
  }, [proveedorId])

  // Auto-seed categoría desde proveedor seleccionado
  useEffect(() => {
    if (!proveedorId) return
    const p = proveedores.find((x) => x.id === proveedorId)
    if (p) setCategoria(p.categoria)
  }, [proveedorId, proveedores])

  const selectedServicio = useMemo(
    () => servicios.find((s) => s.id === servicioId),
    [servicios, servicioId],
  )

  function resetForm() {
    setCategoria('otro')
    setProveedorId('')
    setServicioId('')
    setConcepto('')
    setMontoEstimado('')
    setEstado('pendiente')
  }

  function handleServicioSelect(s: ServicioProveedor) {
    setServicioId(s.id)
    setConcepto(s.nombre)
    setMontoEstimado(String(s.precio))
    setServicioComboOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!concepto.trim() || !montoEstimado) {
      toastError('Campos requeridos', 'Concepto y monto son obligatorios.')
      return
    }
    const monto = Number(montoEstimado)
    if (!Number.isFinite(monto) || monto < 0) {
      toastError('Monto inválido', 'Ingresa un número mayor o igual a 0.')
      return
    }

    setLoading(true)
    try {
      await createLineaPresupuesto({
        eventoId,
        categoria,
        concepto,
        proveedorId: proveedorId || null,
        servicioId: servicioId || null,
        montoEstimado: monto,
        montoReal: null,
        montoPagado: 0,
        estado,
      })
      toastSuccess('Línea agregada', concepto)
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error(err)
      toastError('Error al agregar', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Agregar concepto
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!loading) {
            setOpen(v)
            if (!v) resetForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar concepto al presupuesto</DialogTitle>
            <DialogDescription>
              Selecciona un proveedor para ver su catálogo y autocompletar precios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">

            {/* Proveedor */}
            <div className="space-y-1.5">
              <Label htmlFor="lp-proveedor">Proveedor (opcional)</Label>
              <select
                id="lp-proveedor"
                value={proveedorId}
                onChange={(e) => {
                  setProveedorId(e.target.value)
                  setServicioId('')
                  setConcepto('')
                  setMontoEstimado('')
                }}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Sin proveedor asignado</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Servicio autocomplete — sólo si hay proveedor */}
            {proveedorId && (
              <div className="space-y-1.5">
                <Label>Servicio del catálogo</Label>
                <Popover open={servicioComboOpen} onOpenChange={setServicioComboOpen}>
                  <PopoverTrigger render={
                    <button
                      type="button"
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <span className={selectedServicio ? '' : 'text-muted-foreground'}>
                        {selectedServicio
                          ? `${selectedServicio.nombre} · ${fmt.format(selectedServicio.precio)}`
                          : servicios.length === 0
                            ? loadingServicios
                              ? 'Cargando catálogo...'
                              : 'Sin catálogo — escribe manualmente'
                            : 'Buscar en catálogo...'}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  } />
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Nombre del servicio..." />
                      <CommandList>
                        <CommandEmpty>
                          {servicios.length === 0 ? 'Catálogo vacío' : 'Sin resultados'}
                        </CommandEmpty>
                        <CommandGroup>
                          {servicios.map((s) => (
                            <CommandItem
                              key={s.id}
                              value={`${s.nombre} ${s.categoria ?? ''}`}
                              onSelect={() => handleServicioSelect(s)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  servicioId === s.id ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate">{s.nombre}</span>
                                <span className="text-xs text-text-muted">
                                  {fmt.format(s.precio)} · {s.unidad}
                                  {s.categoria && ` · ${s.categoria}`}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedServicio && (
                  <p className="text-xs text-text-muted">
                    Autocompletado. Puedes editar concepto y monto si negocias.
                  </p>
                )}
              </div>
            )}

            {/* Categoría */}
            <div className="space-y-1.5">
              <Label htmlFor="lp-categoria">Categoría</Label>
              <select
                id="lp-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaProveedor)}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Concepto */}
            <div className="space-y-1.5">
              <Label htmlFor="lp-concepto">Concepto *</Label>
              <Input
                id="lp-concepto"
                value={concepto}
                onChange={(e) => {
                  setConcepto(e.target.value)
                  setServicioId('')  // manual edit desvincula del catálogo
                }}
                placeholder="Centros de mesa"
                required
              />
            </div>

            {/* Monto */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lp-monto">Monto estimado (MXN) *</Label>
                <Input
                  id="lp-monto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={montoEstimado}
                  onChange={(e) => {
                    setMontoEstimado(e.target.value)
                    setServicioId('')
                  }}
                  placeholder="2500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lp-estado">Estado</Label>
                <select
                  id="lp-estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EstadoLinea)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado_parcial">Pago parcial</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Agregando...' : 'Agregar concepto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
