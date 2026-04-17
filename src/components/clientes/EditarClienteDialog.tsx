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
import { updateCliente } from '@/lib/api/clientes'
import { toastSuccess, toastError } from '@/lib/toast'
import type { Cliente, EstadoCliente } from '@/types'

interface EditarClienteDialogProps {
  cliente: Cliente
}

export function EditarClienteDialog({ cliente }: EditarClienteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState(cliente.nombre)
  const [apellido, setApellido] = useState(cliente.apellido)
  const [email, setEmail] = useState(cliente.email)
  const [telefono, setTelefono] = useState(cliente.telefono)
  const [estado, setEstado] = useState<EstadoCliente>(cliente.estado)
  const [notas, setNotas] = useState(cliente.notas ?? '')

  function resetToClienteValues() {
    setNombre(cliente.nombre)
    setApellido(cliente.apellido)
    setEmail(cliente.email)
    setTelefono(cliente.telefono)
    setEstado(cliente.estado)
    setNotas(cliente.notas ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      toastError('Completa los campos requeridos', 'Nombre, apellido y correo son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await updateCliente(cliente.id, { nombre, apellido, email, telefono, estado, notas: notas || undefined })
      setOpen(false)
      toastSuccess('Cliente actualizado', `${nombre} ${apellido} fue actualizado.`)
      router.refresh()
    } catch (err) {
      console.error('Error al actualizar cliente:', err)
      toastError('Error al actualizar', 'Intenta de nuevo.')
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

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetToClienteValues() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Actualiza los datos de {cliente.nombre} {cliente.apellido}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ec-nombre">Nombre</Label>
                <Input
                  id="ec-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ec-apellido">Apellido</Label>
                <Input
                  id="ec-apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ec-email">Correo electrónico</Label>
              <Input
                id="ec-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ec-telefono">Teléfono / WhatsApp</Label>
              <Input
                id="ec-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ec-estado">Estado</Label>
              <select
                id="ec-estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoCliente)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="prospecto">Prospecto</option>
                <option value="activo">Activo</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ec-notas">Notas</Label>
              <textarea
                id="ec-notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
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
