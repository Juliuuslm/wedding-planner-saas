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

export function NuevoClienteDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo cliente
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Agrega un nuevo cliente a tu CRM. Podrás asociarlo a un evento después.
            </DialogDescription>
          </DialogHeader>

          {/* Form — visual only, non-functional */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Valentina" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" placeholder="García" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="valentina@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+52 55 1234 5678"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estado">Estado inicial</Label>
              <select
                id="estado"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue="prospecto"
              >
                <option value="prospecto">Prospecto</option>
                <option value="activo">Activo</option>
              </select>
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button size="sm" className="sm:ml-auto">
              Guardar cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
