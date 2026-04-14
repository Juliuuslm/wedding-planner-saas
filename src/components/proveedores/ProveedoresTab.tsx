'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ODPCard } from './ODPCard'
import { ProveedorCard } from './ProveedorCard'
import type { Evento, ODP, Proveedor } from '@/types'

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

interface ProveedoresTabProps {
  evento: Evento
  odps: ODP[]
  proveedores: Proveedor[]
}

export function ProveedoresTab({ evento, odps, proveedores }: ProveedoresTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const totalMonto = odps.reduce((s, o) => s + o.monto, 0)

  function getProveedor(id: string) {
    return proveedores.find((p) => p.id === id)
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
        <Button size="sm" onClick={() => setDialogOpen(true)}>
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

      {/* Assign dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar proveedor</DialogTitle>
            <DialogDescription>
              Selecciona un proveedor del catálogo para asignar a {evento.nombre}.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {proveedores.map((p) => (
                <ProveedorCard key={p.id} proveedor={p} />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
