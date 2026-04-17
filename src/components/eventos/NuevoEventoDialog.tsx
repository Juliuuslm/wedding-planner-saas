'use client'

import { useState, useEffect } from 'react'
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
import { createEvento } from '@/lib/api/eventos'
import { getClientes } from '@/lib/api/clientes'
import { getPaquetes } from '@/lib/api/paquetes'
import { toastSuccess, toastError } from '@/lib/toast'
import type { Cliente, Paquete, TipoEvento } from '@/types'

const TIPOS_EVENTO: { value: TipoEvento; label: string }[] = [
  { value: 'boda',        label: 'Boda' },
  { value: 'bautizo',     label: 'Bautizo' },
  { value: 'quinceanera', label: 'Quinceañera' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'otro',        label: 'Otro' },
]

export function NuevoEventoDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [paquetes, setPaquetes] = useState<Paquete[]>([])

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoEvento>('boda')
  const [clienteId, setClienteId] = useState('')
  const [paqueteId, setPaqueteId] = useState('')
  const [fecha, setFecha] = useState('')
  const [venue, setVenue] = useState('')
  const [numeroInvitados, setNumeroInvitados] = useState('')
  const [presupuestoTotal, setPresupuestoTotal] = useState('')

  useEffect(() => {
    if (!open) return
    void Promise.all([getClientes(), getPaquetes()]).then(([c, p]) => {
      setClientes(c)
      setPaquetes(p)
    })
  }, [open])

  function resetForm() {
    setNombre('')
    setTipo('boda')
    setClienteId('')
    setPaqueteId('')
    setFecha('')
    setVenue('')
    setNumeroInvitados('')
    setPresupuestoTotal('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !clienteId || !fecha) {
      toastError('Completa los campos requeridos', 'Nombre, cliente y fecha son obligatorios.')
      return
    }
    setLoading(true)
    try {
      await createEvento({
        nombre,
        tipo,
        fecha,
        clienteId,
        venue: venue || undefined,
        numeroInvitados: numeroInvitados ? Number(numeroInvitados) : undefined,
        paqueteId: paqueteId || undefined,
        estado: 'planificacion',
        presupuestoTotal: presupuestoTotal ? Number(presupuestoTotal) : 0,
        progreso: 0,
      })
      setOpen(false)
      resetForm()
      toastSuccess('Evento creado', `${nombre} fue creado correctamente.`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear evento:', err)
      toastError('Error al crear el evento', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo evento
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
            <DialogDescription>
              Crea un nuevo evento y asígnalo a un cliente existente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-nombre">Nombre del evento</Label>
              <Input
                id="ev-nombre"
                placeholder="Boda López-García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-tipo">Tipo</Label>
              <select
                id="ev-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoEvento)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {TIPOS_EVENTO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-cliente">Cliente</Label>
              <select
                id="ev-cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ev-fecha">Fecha</Label>
                <Input
                  id="ev-fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-invitados">Invitados</Label>
                <Input
                  id="ev-invitados"
                  type="number"
                  placeholder="100"
                  value={numeroInvitados}
                  onChange={(e) => setNumeroInvitados(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-venue">Venue</Label>
              <Input
                id="ev-venue"
                placeholder="Hacienda San Carlos, Cuernavaca"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-presupuesto">Presupuesto total (MXN)</Label>
              <Input
                id="ev-presupuesto"
                type="number"
                placeholder="500000"
                value={presupuestoTotal}
                onChange={(e) => setPresupuestoTotal(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-paquete">Paquete</Label>
              <select
                id="ev-paquete"
                value={paqueteId}
                onChange={(e) => setPaqueteId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar paquete...</option>
                {paquetes.map((p) => (
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

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Creando...' : 'Crear evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
