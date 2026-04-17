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
import { createTarea } from '@/lib/api/tareas'
import { toastSuccess, toastError } from '@/lib/toast'
import type { EstadoTarea } from '@/types'

const FASES = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento', 'Post-evento']
const RESPONSABLES = ['Andrea Morales', 'Luisa Pérez', 'Miguel Rodríguez', 'Valentina García']

interface NuevaTareaDialogProps {
  eventoId: string
}

export function NuevaTareaDialog({ eventoId }: NuevaTareaDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fase, setFase] = useState(FASES[0])
  const [estado, setEstado] = useState<EstadoTarea>('pendiente')
  const [responsable, setResponsable] = useState(RESPONSABLES[0])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')

  function resetForm() {
    setTitulo('')
    setDescripcion('')
    setFase(FASES[0])
    setEstado('pendiente')
    setResponsable(RESPONSABLES[0])
    setFechaInicio('')
    setFechaVencimiento('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || !fechaVencimiento) {
      toastError('Campos requeridos', 'Título y fecha límite son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await createTarea({
        eventoId,
        titulo,
        descripcion: descripcion || undefined,
        responsable,
        fechaInicio: fechaInicio || undefined,
        fechaVencimiento,
        estado,
        fase,
        orden: 0,
      })
      setOpen(false)
      resetForm()
      toastSuccess('Tarea creada', `"${titulo}" fue agregada al timeline.`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear tarea:', err)
      toastError('Error al crear tarea', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nueva tarea
      </Button>
      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>Agrega una tarea al timeline del evento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-titulo">Título</Label>
              <Input
                id="t-titulo"
                placeholder="Confirmar menú con catering"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-descripcion">Descripción (opcional)</Label>
              <Input
                id="t-descripcion"
                placeholder="Detalles adicionales..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="t-fase">Fase</Label>
                <select
                  id="t-fase"
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
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
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EstadoTarea)}
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
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
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
                <Input
                  id="t-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-fin">Fecha límite</Label>
                <Input
                  id="t-fin"
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Creando...' : 'Crear tarea'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
