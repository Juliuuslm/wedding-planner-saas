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
import { createContrato } from '@/lib/api/contratos'
import { getEventos } from '@/lib/api/eventos'
import type { Evento, TipoContrato } from '@/types'

export function NuevoContratoGlobalDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventos, setEventos] = useState<Evento[]>([])

  const [eventoId, setEventoId] = useState('')
  const [tipo, setTipo] = useState<TipoContrato>('cliente')
  const [contraparte, setContraparte] = useState('')
  const [contraparteId, setContraparteId] = useState('')
  const [montoTotal, setMontoTotal] = useState('')

  useEffect(() => {
    if (!open) return
    void getEventos().then(setEventos)
  }, [open])

  function resetForm() {
    setEventoId('')
    setTipo('cliente')
    setContraparte('')
    setContraparteId('')
    setMontoTotal('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!eventoId || !contraparte.trim() || !montoTotal) {
      alert('Por favor completa evento, contraparte y monto total.')
      return
    }
    setLoading(true)
    try {
      await createContrato({
        eventoId,
        tipo,
        contraparte,
        contraparteId: contraparteId || contraparte,
        estado: 'borrador',
        montoTotal: Number(montoTotal),
        fechaCreacion: new Date().toISOString(),
        version: 1,
      })
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error('Error al crear contrato:', err)
      alert('Error al crear el contrato. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo contrato
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!loading) { setOpen(v); if (!v) resetForm() } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo contrato</DialogTitle>
            <DialogDescription>
              Crea un contrato en estado borrador asociado a un evento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ctg-evento">Evento</Label>
              <select
                id="ctg-evento"
                value={eventoId}
                onChange={(e) => setEventoId(e.target.value)}
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar evento...</option>
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ctg-tipo">Tipo</Label>
              <select
                id="ctg-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoContrato)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="cliente">Cliente</option>
                <option value="proveedor">Proveedor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ctg-contraparte">Contraparte (nombre)</Label>
              <Input
                id="ctg-contraparte"
                placeholder="Valentina García / Florería Rosa"
                value={contraparte}
                onChange={(e) => setContraparte(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ctg-contraparte-id">ID de contraparte (opcional)</Label>
              <Input
                id="ctg-contraparte-id"
                placeholder="cliente-123 o proveedor-456"
                value={contraparteId}
                onChange={(e) => setContraparteId(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ctg-monto">Monto total (MXN)</Label>
              <Input
                id="ctg-monto"
                type="number"
                placeholder="50000"
                value={montoTotal}
                onChange={(e) => setMontoTotal(e.target.value)}
                required
              />
            </div>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Creando...' : 'Crear contrato'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
