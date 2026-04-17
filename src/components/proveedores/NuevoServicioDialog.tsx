'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createServicio, updateServicio } from '@/lib/api/servicios-proveedor'
import { toastSuccess, toastError } from '@/lib/toast'
import type { ServicioProveedor } from '@/types'

const UNIDADES = ['pieza', 'hora', 'persona', 'metro', 'arreglo', 'paquete', 'kg', 'día']

interface Props {
  proveedorId: string
  servicio?: ServicioProveedor | null
  onSaved: (s: ServicioProveedor) => void
  trigger?: 'button' | 'edit-icon'
}

export function NuevoServicioDialog({ proveedorId, servicio, onSaved, trigger = 'button' }: Props) {
  const editing = !!servicio
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [unidad, setUnidad] = useState('pieza')
  const [cantidadTipica, setCantidadTipica] = useState('')
  const [categoria, setCategoria] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [notas, setNotas] = useState('')

  useEffect(() => {
    if (!open) return
    if (servicio) {
      setNombre(servicio.nombre)
      setDescripcion(servicio.descripcion ?? '')
      setPrecio(String(servicio.precio))
      setUnidad(servicio.unidad)
      setCantidadTipica(servicio.cantidadTipica != null ? String(servicio.cantidadTipica) : '')
      setCategoria(servicio.categoria ?? '')
      setDisponible(servicio.disponible)
      setNotas(servicio.notas ?? '')
    } else {
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setUnidad('pieza')
      setCantidadTipica('')
      setCategoria('')
      setDisponible(true)
      setNotas('')
    }
  }, [open, servicio])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !precio) {
      toastError('Campos requeridos', 'Nombre y precio son obligatorios.')
      return
    }
    const precioNum = Number(precio)
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      toastError('Precio inválido', 'Ingresa un precio mayor o igual a 0.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        nombre,
        descripcion: descripcion || null,
        precio: precioNum,
        unidad,
        cantidadTipica: cantidadTipica ? Number(cantidadTipica) : null,
        categoria: categoria || null,
        disponible,
        notas: notas || null,
      }

      const saved = editing
        ? await updateServicio(proveedorId, servicio!.id, payload)
        : await createServicio(proveedorId, payload)

      onSaved(saved)
      setOpen(false)
      toastSuccess(editing ? 'Servicio actualizado' : 'Servicio agregado', nombre)
    } catch (err) {
      console.error(err)
      toastError('Error al guardar', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {trigger === 'edit-icon' ? (
        <Button size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Editar</span>
        </Button>
      ) : (
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo servicio
        </Button>
      )}

      <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar servicio' : 'Nuevo servicio'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Actualiza los datos del servicio.' : 'Agrega un servicio al catálogo del proveedor.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-nombre">Nombre *</Label>
              <Input
                id="s-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Centro de mesa rústico"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-desc">Descripción</Label>
              <Textarea
                id="s-desc"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalle del servicio..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-precio">Precio (MXN) *</Label>
                <Input
                  id="s-precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="2500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-unidad">Unidad</Label>
                <select
                  id="s-unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-cant">Cantidad típica</Label>
                <Input
                  id="s-cant"
                  type="number"
                  min="1"
                  value={cantidadTipica}
                  onChange={(e) => setCantidadTipica(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-categoria">Sub-categoría</Label>
                <Input
                  id="s-categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Centros de mesa"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-warm-border bg-muted/30 px-3 py-2">
              <Label htmlFor="s-disponible" className="text-sm">Disponible en catálogo</Label>
              <Switch
                id="s-disponible"
                checked={disponible}
                onCheckedChange={setDisponible}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-notas">Notas</Label>
              <Textarea
                id="s-notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Lead time, restricciones, etc."
                rows={2}
              />
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar servicio'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
