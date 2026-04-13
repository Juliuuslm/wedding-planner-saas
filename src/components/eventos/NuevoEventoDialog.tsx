'use client'

import { useState } from 'react'
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
import { mockClientes, mockPaquetes } from '@/data/mock'

export function NuevoEventoDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo evento
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
            <DialogDescription>
              Crea un nuevo evento y asígnalo a un cliente existente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-nombre">Nombre del evento</Label>
              <Input id="ev-nombre" placeholder="Boda López-García" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-cliente">Cliente</Label>
              <select
                id="ev-cliente"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar cliente...</option>
                {mockClientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ev-fecha">Fecha</Label>
                <Input id="ev-fecha" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-invitados">Invitados</Label>
                <Input id="ev-invitados" type="number" placeholder="100" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-venue">Venue</Label>
              <Input id="ev-venue" placeholder="Hacienda San Carlos, Cuernavaca" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-paquete">Paquete</Label>
              <select
                id="ev-paquete"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar paquete...</option>
                {mockPaquetes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} —{' '}
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      maximumFractionDigits: 0,
                    }).format(p.precio)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button size="sm" className="sm:ml-auto">
              Crear evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
