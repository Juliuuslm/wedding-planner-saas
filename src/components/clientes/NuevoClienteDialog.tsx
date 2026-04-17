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
import { createCliente } from '@/lib/api/clientes'
import { toastSuccess, toastError } from '@/lib/toast'
import type { EstadoCliente } from '@/types'

export function NuevoClienteDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [estado, setEstado] = useState<EstadoCliente>('prospecto')
  const [notas, setNotas] = useState('')

  function resetForm() {
    setNombre('')
    setApellido('')
    setEmail('')
    setTelefono('')
    setEstado('prospecto')
    setNotas('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      toastError('Campos requeridos', 'Nombre, apellido y correo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await createCliente({ nombre, apellido, email, telefono, estado, notas: notas || undefined })
      setOpen(false)
      resetForm()
      toastSuccess('Cliente creado', `${nombre} ${apellido} fue agregado al CRM.`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear cliente:', err)
      toastError('Error al crear cliente', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo cliente
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Agrega un nuevo cliente a tu CRM. Podrás asociarlo a un evento después.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Valentina"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  placeholder="García"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="valentina@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+52 55 1234 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estado">Estado inicial</Label>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoCliente)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="prospecto">Prospecto</option>
                <option value="activo">Activo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <textarea
                id="notas"
                placeholder="Información adicional..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Guardando...' : 'Guardar cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
