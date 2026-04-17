'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'
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
import { updateProveedor } from '@/lib/api/proveedores'
import type { Proveedor, CategoriaProveedor } from '@/types'

const CATEGORIAS: { value: CategoriaProveedor; label: string }[] = [
  { value: 'venue',          label: 'Venue' },
  { value: 'catering',       label: 'Catering' },
  { value: 'fotografia',     label: 'Fotografía' },
  { value: 'video',          label: 'Video' },
  { value: 'musica',         label: 'Música' },
  { value: 'flores',         label: 'Florería' },
  { value: 'decoracion',     label: 'Decoración' },
  { value: 'pasteleria',     label: 'Pastelería' },
  { value: 'invitaciones',   label: 'Invitaciones' },
  { value: 'transporte',     label: 'Transporte' },
  { value: 'entretenimiento',label: 'Entretenimiento' },
  { value: 'iluminacion',    label: 'Iluminación' },
  { value: 'mobiliario',     label: 'Mobiliario' },
  { value: 'otro',           label: 'Otro' },
]

interface EditarProveedorDialogProps {
  proveedor: Proveedor
}

export function EditarProveedorDialog({ proveedor }: EditarProveedorDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState(proveedor.nombre)
  const [categoria, setCategoria] = useState<CategoriaProveedor>(proveedor.categoria)
  const [email, setEmail] = useState(proveedor.email)
  const [telefono, setTelefono] = useState(proveedor.telefono)
  const [descripcion, setDescripcion] = useState(proveedor.descripcion ?? '')
  const [precioBase, setPrecioBase] = useState(proveedor.precioBase?.toString() ?? '')
  const [calificacion, setCalificacion] = useState(proveedor.calificacion.toString())
  const [notas, setNotas] = useState(proveedor.notas ?? '')

  function resetToProveedorValues() {
    setNombre(proveedor.nombre)
    setCategoria(proveedor.categoria)
    setEmail(proveedor.email)
    setTelefono(proveedor.telefono)
    setDescripcion(proveedor.descripcion ?? '')
    setPrecioBase(proveedor.precioBase?.toString() ?? '')
    setCalificacion(proveedor.calificacion.toString())
    setNotas(proveedor.notas ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) {
      alert('Por favor completa nombre y correo.')
      return
    }
    setLoading(true)
    try {
      await updateProveedor(proveedor.id, {
        nombre,
        categoria,
        email,
        telefono,
        descripcion: descripcion || undefined,
        precioBase: precioBase ? Number(precioBase) : undefined,
        calificacion: Number(calificacion),
        notas: notas || undefined,
      })
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error('Error al actualizar proveedor:', err)
      alert('Error al actualizar el proveedor. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Edit className="mr-1.5 h-4 w-4" />
        Editar
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetToProveedorValues() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar proveedor</DialogTitle>
            <DialogDescription>
              Actualiza los datos de {proveedor.nombre}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ep-nombre">Nombre</Label>
              <Input
                id="ep-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-categoria">Categoría</Label>
              <select
                id="ep-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaProveedor)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ep-email">Correo</Label>
                <Input
                  id="ep-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ep-telefono">Teléfono</Label>
                <Input
                  id="ep-telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-descripcion">Descripción</Label>
              <textarea
                id="ep-descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ep-precio">Precio base (MXN)</Label>
                <Input
                  id="ep-precio"
                  type="number"
                  value={precioBase}
                  onChange={(e) => setPrecioBase(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ep-calificacion">Calificación (1-5)</Label>
                <Input
                  id="ep-calificacion"
                  type="number"
                  min="1"
                  max="5"
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-notas">Notas</Label>
              <textarea
                id="ep-notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
