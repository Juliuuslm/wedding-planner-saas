'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { updateODP } from '@/lib/api/odp'
import { Button } from '@/components/ui/button'
import type { ODP } from '@/types'

interface OdpActionsProps {
  odp: ODP
}

export function OdpActions({ odp }: OdpActionsProps) {
  const router = useRouter()

  async function handleConfirmar() {
    await updateODP(odp.id, { estado: 'confirmada' })
    router.refresh()
  }

  async function handleSolicitarCambios() {
    const notas = window.prompt('Describe los cambios que necesitas:')
    if (notas === null) return
    await updateODP(odp.id, { estado: 'pendiente', notas })
    router.refresh()
  }

  if (odp.estado === 'pendiente') {
    return (
      <>
        <Button
          size="sm"
          className="w-full bg-success text-white hover:bg-success/90"
          onClick={handleConfirmar}
        >
          Confirmar ODP
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={handleSolicitarCambios}
        >
          Solicitar cambios
        </Button>
      </>
    )
  }

  if (odp.estado === 'confirmada') {
    return (
      <Button size="sm" variant="outline" className="w-full" disabled>
        <CheckCircle2 className="mr-1.5 h-4 w-4 text-success" />
        ODP Confirmada
      </Button>
    )
  }

  if (odp.estado === 'completada') {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md bg-muted/40 py-2 text-sm text-text-muted">
        <CheckCircle2 className="h-4 w-4" />
        Servicio completado
      </div>
    )
  }

  if (odp.estado === 'cancelada') {
    return (
      <div className="flex items-center justify-center rounded-md bg-danger/10 py-2 text-sm text-danger">
        ODP cancelada
      </div>
    )
  }

  return null
}
