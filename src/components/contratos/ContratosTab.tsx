'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { VistaContrato } from './VistaContrato'
import { NuevoContratoDialog } from './NuevoContratoDialog'
import type { Contrato, Evento, Cliente, Paquete, EstadoContrato } from '@/types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

const ESTADO_MAP: Record<EstadoContrato, { label: string; className: string }> = {
  borrador:  { label: 'Borrador',  className: 'bg-muted text-text-muted' },
  enviado:   { label: 'Enviado',   className: 'bg-warning/10 text-warning border-warning/30' },
  firmado:   { label: 'Firmado',   className: 'bg-success/10 text-success border-success/30' },
  cancelado: { label: 'Cancelado', className: 'bg-danger/10 text-danger border-danger/30' },
}

const PASOS: EstadoContrato[] = ['borrador', 'enviado', 'firmado']
const PASO_LABELS: Record<string, string> = {
  borrador: 'Borrador',
  enviado:  'Enviado',
  firmado:  'Firmado',
}

interface ContratosTabProps {
  evento: Evento
  contratos: Contrato[]
  cliente: Cliente | undefined
  paquete: Paquete | undefined
}

function EstadoStepper({ estado }: { estado: EstadoContrato }) {
  const currentIdx = PASOS.indexOf(estado)
  const isCancelado = estado === 'cancelado'

  if (isCancelado) {
    return (
      <Badge variant="outline" className="text-xs bg-danger/10 text-danger border-danger/30">
        Cancelado
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {PASOS.map((paso, i) => {
        const isCompleted = i < currentIdx
        const isActive    = i === currentIdx
        return (
          <div key={paso} className="flex items-center gap-1">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold',
                isCompleted && 'bg-success/20 text-success',
                isActive    && 'bg-brand text-gold',
                !isCompleted && !isActive && 'border border-warm-border text-text-muted',
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                'text-[10px]',
                isActive    ? 'font-semibold text-text-primary' : 'text-text-muted',
              )}
            >
              {PASO_LABELS[paso]}
            </span>
            {i < PASOS.length - 1 && (
              <div className={cn('mx-1 h-px w-4', isCompleted ? 'bg-success/40' : 'bg-muted')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ContratosTab({ evento, contratos, cliente, paquete }: ContratosTabProps) {
  const [seleccionado, setSeleccionado] = useState<Contrato | null>(null)

  const firmados = contratos.filter((c) => c.estado === 'firmado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text-primary">Contratos del evento</h3>
          <p className="mt-0.5 text-sm text-text-muted">
            {contratos.length} {contratos.length === 1 ? 'contrato' : 'contratos'}
            {contratos.length > 0 && (
              <> · <span className="text-success">{firmados} firmado{firmados !== 1 ? 's' : ''}</span></>
            )}
          </p>
        </div>
        <NuevoContratoDialog eventoId={evento.id} />
      </div>

      {/* Contracts list */}
      {contratos.length > 0 ? (
        <div className="space-y-3">
          {contratos.map((contrato) => {
            const estado = ESTADO_MAP[contrato.estado]
            return (
              <Card key={contrato.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-3">
                      {/* Top row: contraparte + badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-text-primary">{contrato.contraparte}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            contrato.tipo === 'cliente'
                              ? 'bg-brand/10 text-brand border-brand/20'
                              : 'bg-muted text-text-muted',
                          )}
                        >
                          {contrato.tipo === 'cliente' ? 'Cliente' : 'Proveedor'}
                        </Badge>
                        <Badge variant="outline" className={cn('text-xs', estado.className)}>
                          {estado.label}
                        </Badge>
                      </div>

                      {/* Stepper */}
                      <EstadoStepper estado={contrato.estado} />

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <span>Creado: {fmtDate(contrato.fechaCreacion)}</span>
                        {contrato.fechaFirma && (
                          <span className="text-success font-medium">
                            Firmado: {fmtDate(contrato.fechaFirma)}
                          </span>
                        )}
                        <span className="font-semibold tabular-nums text-text-primary">
                          {fmt(contrato.montoTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => setSeleccionado(contrato)}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                      Ver contrato
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-16 text-center">
          <p className="font-medium text-text-primary">Sin contratos registrados</p>
          <p className="mt-1 text-sm text-text-muted">
            Genera el primer contrato para este evento
          </p>
        </div>
      )}

      {/* Vista contrato dialog */}
      <VistaContrato
        contrato={seleccionado}
        evento={evento}
        cliente={cliente}
        paquete={paquete}
        open={seleccionado !== null}
        onClose={() => setSeleccionado(null)}
      />
    </div>
  )
}
