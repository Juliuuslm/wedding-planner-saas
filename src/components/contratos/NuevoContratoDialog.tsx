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
import { createContrato } from '@/lib/api/contratos'
import type { TipoContrato } from '@/types'

interface NuevoContratoDialogProps {
  eventoId: string
}

export function NuevoContratoDialog({ eventoId }: NuevoContratoDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [tipo, setTipo] = useState<TipoContrato>('cliente')
  const [contraparte, setContraparte] = useState('')
  const [contraparteId, setContraparteId] = useState('')
  const [montoTotal, setMontoTotal] = useState('')

  function resetForm() {
    setTipo('cliente')
    setContraparte('')
    setContraparteId('')
    setMontoTotal('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contraparte.trim() || !montoTotal) {
      alert('Por favor completa contraparte y monto total.')
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
              Crea un contrato en estado borrador para este evento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ct-tipo">Tipo</Label>
              <select
                id="ct-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoContrato)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="cliente">Cliente</option>
                <option value="proveedor">Proveedor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ct-contraparte">Contraparte (nombre)</Label>
              <Input
                id="ct-contraparte"
                placeholder="Valentina García / Florería Rosa"
                value={contraparte}
                onChange={(e) => setContraparte(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ct-contraparte-id">ID de contraparte (opcional)</Label>
              <Input
                id="ct-contraparte-id"
                placeholder="cliente-123 o proveedor-456"
                value={contraparteId}
                onChange={(e) => setContraparteId(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ct-monto">Monto total (MXN)</Label>
              <Input
                id="ct-monto"
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
