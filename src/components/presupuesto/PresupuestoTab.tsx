'use client'

import { useMemo } from 'react'
import { Download, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TablaPresupuesto } from './TablaPresupuesto'
import type { Evento, LineaPresupuesto } from '@/types'

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)
}

export function PresupuestoTab({
  evento,
  lineas,
}: {
  evento: Evento
  lineas: LineaPresupuesto[]
}) {
  const totales = useMemo(() => {
    const pagado = lineas.reduce((s, l) => s + l.montoPagado, 0)
    const saldo  = evento.presupuestoTotal - pagado
    const pct    = evento.presupuestoTotal > 0
      ? Math.round((pagado / evento.presupuestoTotal) * 100)
      : 0
    return { pagado, saldo, pct }
  }, [lineas, evento.presupuestoTotal])

  return (
    <div className="space-y-6">

      {/* ── Resumen financiero ───────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-text-muted">Presupuesto total</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-text-primary">
                {fmt(evento.presupuestoTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Pagado</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-success">
                {fmt(totales.pagado)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Saldo pendiente</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-warning">
                {fmt(totales.saldo)}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Progreso de pagos</span>
              <span className="font-semibold tabular-nums text-text-primary">
                {totales.pct}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${totales.pct}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">
              {lineas.length} conceptos registrados
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Acciones ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (lineas.length === 0) {
              alert('No hay conceptos para exportar.')
              return
            }
            const headers = ['Concepto', 'Estimado', 'Real', 'Pagado', 'Estado']
            const rows = lineas.map((l) => [
              l.concepto,
              l.montoEstimado,
              l.montoReal ?? '',
              l.montoPagado,
              l.estado,
            ])
            const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `presupuesto-${evento.id}.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download className="mr-1.5 h-4 w-4" />
          Exportar a Excel
        </Button>

        {/* Canva placeholder */}
        <div className="flex items-center gap-3 rounded-lg border border-warm-border bg-background px-4 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7D2AE8]/10">
            <ImageIcon className="h-4 w-4 text-[#7D2AE8]" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Referencia de diseño</p>
            <p className="text-xs text-text-muted">Vincula tu tablero de Canva</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 shrink-0 text-text-secondary"
            onClick={() => window.open('https://www.canva.com/', '_blank')}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Abrir en Canva
          </Button>
        </div>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────── */}
      <TablaPresupuesto lineas={lineas} />
    </div>
  )
}
