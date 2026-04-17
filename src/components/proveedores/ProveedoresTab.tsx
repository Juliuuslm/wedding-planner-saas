'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Star } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ODPCard } from './ODPCard'
import { createODP } from '@/lib/api/odp'
import { cn } from '@/lib/utils'
import { toastSuccess, toastError } from '@/lib/toast'
import type { Evento, ODP, Proveedor } from '@/types'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const CATEGORIA_LABEL: Record<string, string> = {
  venue:       'Venue',
  catering:    'Catering',
  flores:      'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  otro:        'Otros',
}

function getInitials(nombre: string) {
  return nombre.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'fill-gold text-gold' : 'fill-transparent text-text-muted/30'
          )}
        />
      ))}
      <span className="ml-1 text-xs text-text-muted">{rating}.0</span>
    </div>
  )
}

interface ProveedoresTabProps {
  evento: Evento
  odps: ODP[]
  proveedores: Proveedor[]
}

export function ProveedoresTab({ evento, odps, proveedores }: ProveedoresTabProps) {
  const router = useRouter()
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)
  const [loading, setLoading] = useState(false)

  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState('')

  const totalMonto = odps.reduce((s, o) => s + o.monto, 0)

  function getProveedor(id: string) {
    return proveedores.find((p) => p.id === id)
  }

  function handleSelectProveedor(p: Proveedor) {
    setSelectedProveedor(p)
    setCatalogOpen(false)
    setDescripcion('')
    setMonto('')
    setFecha('')
  }

  async function handleCreateODP(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProveedor || !descripcion.trim() || !monto || !fecha) {
      toastError('Campos requeridos', 'Completa descripción, monto y fecha.')
      return
    }
    setLoading(true)
    try {
      await createODP({
        eventoId: evento.id,
        proveedorId: selectedProveedor.id,
        descripcion,
        monto: Number(monto),
        fecha,
        estado: 'pendiente',
      })
      setSelectedProveedor(null)
      toastSuccess('ODP creada', `Orden de desempeño para ${selectedProveedor.nombre} creada.`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear ODP:', err)
      toastError('Error al crear ODP', 'Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text-primary">Proveedores asignados</h3>
          <p className="mt-0.5 text-sm text-text-muted">
            {odps.length} {odps.length === 1 ? 'proveedor' : 'proveedores'}
            {odps.length > 0 && (
              <> · <span className="tabular-nums">{fmt.format(totalMonto)}</span> comprometido</>
            )}
          </p>
        </div>
        <Button size="sm" onClick={() => setCatalogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Asignar proveedor
        </Button>
      </div>

      {/* ODP list */}
      {odps.length > 0 ? (
        <div className="space-y-3">
          {odps.map((odp) => (
            <ODPCard
              key={odp.id}
              odp={odp}
              proveedor={getProveedor(odp.proveedorId)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-16 text-center">
          <p className="font-medium text-text-primary">Sin proveedores asignados</p>
          <p className="mt-1 text-sm text-text-muted">
            Asigna un proveedor del catálogo para este evento
          </p>
        </div>
      )}

      {/* Catalog dialog */}
      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar proveedor</DialogTitle>
            <DialogDescription>
              Selecciona un proveedor del catálogo para asignar a {evento.nombre}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {proveedores.map((p) => {
                const precio = p.precioMin ?? p.precioBase
                return (
                  <Card
                    key={p.id}
                    className="cursor-pointer transition-shadow hover:shadow-md hover:border-brand/40"
                    onClick={() => handleSelectProveedor(p)}
                  >
                    <CardContent className="flex flex-col gap-3 p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-11 w-11 shrink-0 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-brand text-sm font-semibold text-gold">
                            {getInitials(p.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-text-primary">{p.nombre}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {CATEGORIA_LABEL[p.categoria] ?? p.categoria}
                          </Badge>
                        </div>
                      </div>
                      <StarRating rating={p.calificacion} />
                      {precio != null && (
                        <p className="text-xs text-text-muted">
                          Desde <span className="font-medium text-text-primary">{fmt.format(precio)}</span>
                        </p>
                      )}
                      <Button size="sm" className="mt-auto w-full">
                        Seleccionar
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ODP creation dialog after selecting a provider */}
      <Dialog open={selectedProveedor !== null} onOpenChange={(v) => { if (!v && !loading) setSelectedProveedor(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear orden de desempeño</DialogTitle>
            <DialogDescription>
              {selectedProveedor && (
                <>Asignando <strong>{selectedProveedor.nombre}</strong> a {evento.nombre}.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateODP} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="odp-desc">Descripción del servicio</Label>
              <Input
                id="odp-desc"
                placeholder="Fotografía y video — cobertura completa"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="odp-monto">Monto (MXN)</Label>
              <Input
                id="odp-monto"
                type="number"
                placeholder="25000"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="odp-fecha">Fecha del servicio</Label>
              <Input
                id="odp-fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Creando...' : 'Crear ODP'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
