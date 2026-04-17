'use client'

import { useRouter } from 'next/navigation'
import { updateODP } from '@/lib/api/odp'
import { Button } from '@/components/ui/button'

interface AprobacionActionsProps {
  odpId: string
}

export function AprobacionActions({ odpId }: AprobacionActionsProps) {
  const router = useRouter()

  async function handleAprobar() {
    await updateODP(odpId, { estado: 'confirmada' })
    router.refresh()
  }

  async function handleRechazar() {
    await updateODP(odpId, { estado: 'cancelada' })
    router.refresh()
  }

  return (
    <div className="mt-4 flex gap-2">
      <Button
        size="sm"
        className="bg-success text-white hover:bg-success/90"
        onClick={handleAprobar}
      >
        Aprobar
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-danger/30 text-danger hover:bg-danger/5"
        onClick={handleRechazar}
      >
        Rechazar
      </Button>
    </div>
  )
}
