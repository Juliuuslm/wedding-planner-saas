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

const FASES = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento', 'Post-evento']
const RESPONSABLES = ['Andrea Morales', 'Luisa Pérez', 'Miguel Rodríguez', 'Valentina García']

export function NuevaTareaDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nueva tarea
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>Agrega una tarea al timeline del evento.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-titulo">Título</Label>
              <Input id="t-titulo" placeholder="Confirmar menú con catering" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-fase">Fase</Label>
                <select
                  id="t-fase"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {FASES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-estado">Estado</Label>
                <select
                  id="t-estado"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-responsable">Responsable</Label>
              <select
                id="t-responsable"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {RESPONSABLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-inicio">Fecha inicio</Label>
                <Input id="t-inicio" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-fin">Fecha límite</Label>
                <Input id="t-fin" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button size="sm" className="sm:ml-auto">Crear tarea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
