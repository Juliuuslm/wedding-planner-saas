'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
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
import { createProveedor } from '@/lib/api/proveedores'
import { toastSuccess, toastError } from '@/lib/toast'
import type { CategoriaProveedor } from '@/types'

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

export function NuevoProveedorDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState<CategoriaProveedor>('otro')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [calificacion, setCalificacion] = useState('5')

  function resetForm() {
    setNombre('')
    setCategoria('otro')
    setEmail('')
    setTelefono('')
    setDescripcion('')
    setPrecioBase('')
    setCalificacion('5')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) {
      toastError('Campos requeridos', 'Nombre y correo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await createProveedor({
        nombre,
        categoria,
        email,
        telefono,
        descripcion: descripcion || undefined,
        precioBase: precioBase ? Number(precioBase) : undefined,
        calificacion: Number(calificacion),
      })
      setOpen(false)
      resetForm()
      toastSuccess('Proveedor agregado', `${nombre} fue agregado al catálogo.`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear proveedor:', err)
      toastError('Error al crear proveedor', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Agregar proveedor
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo proveedor</DialogTitle>
            <DialogDescription>
              Agrega un proveedor al catálogo de tu plataforma.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pv-nombre">Nombre</Label>
              <Input
                id="pv-nombre"
                placeholder="Florería La Rosa"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pv-categoria">Categoría</Label>
              <select
                id="pv-categoria"
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
                <Label htmlFor="pv-email">Correo</Label>
                <Input
                  id="pv-email"
                  type="email"
                  placeholder="contacto@floreria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pv-telefono">Teléfono</Label>
                <Input
                  id="pv-telefono"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pv-descripcion">Descripción (opcional)</Label>
              <textarea
                id="pv-descripcion"
                placeholder="Descripción breve del servicio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pv-precio">Precio base (MXN, opcional)</Label>
                <Input
                  id="pv-precio"
                  type="number"
                  placeholder="15000"
                  value={precioBase}
                  onChange={(e) => setPrecioBase(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pv-calificacion">Calificación (1-5)</Label>
                <Input
                  id="pv-calificacion"
                  type="number"
                  min="1"
                  max="5"
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Guardando...' : 'Agregar proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
