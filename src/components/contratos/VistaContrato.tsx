'use client'

import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Contrato, Evento, Cliente, Paquete } from '@/types'

const DescargaPDF = dynamic(() => import('./DescargaPDF').then((m) => m.DescargaPDF), {
  ssr: false,
  loading: () => null,
})

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const ESTADO_MAP: Record<Contrato['estado'], { label: string; className: string }> = {
  borrador:  { label: 'Borrador',  className: 'bg-muted text-text-muted' },
  enviado:   { label: 'Enviado',   className: 'bg-warning/10 text-warning border-warning/30' },
  firmado:   { label: 'Firmado',   className: 'bg-success/10 text-success border-success/30' },
  cancelado: { label: 'Cancelado', className: 'bg-danger/10 text-danger border-danger/30' },
}

const CLAUSULAS = [
  {
    num: 1,
    titulo: 'Obligaciones del Coordinador',
    texto: 'AM Wedding Studio se compromete a prestar los servicios de coordinación descritos en el presente contrato con profesionalismo, puntualidad y dedicación, asignando al personal necesario para garantizar el correcto desarrollo del evento.',
  },
  {
    num: 2,
    titulo: 'Obligaciones del Cliente',
    texto: 'El cliente se compromete a proporcionar la información necesaria para la coordinación del evento en los tiempos acordados, realizar los pagos en las fechas establecidas y tomar decisiones oportunamente para no afectar la planificación.',
  },
  {
    num: 3,
    titulo: 'Cancelación y Reembolsos',
    texto: 'En caso de cancelación del evento con más de 90 días de anticipación, se reembolsará el 50% del anticipo. Cancelaciones con menos de 90 días no serán reembolsables. Casos de fuerza mayor evaluados caso por caso.',
  },
  {
    num: 4,
    titulo: 'Modificaciones',
    texto: 'Cualquier cambio en los términos del contrato deberá ser acordado por escrito y firmado por ambas partes. Las modificaciones de última hora están sujetas a disponibilidad y posibles cargos adicionales.',
  },
  {
    num: 5,
    titulo: 'Jurisdicción',
    texto: 'Las partes se someten a las leyes aplicables de la Ciudad de México para la interpretación y cumplimiento del presente contrato, renunciando a cualquier otra jurisdicción que pudiera corresponderles.',
  },
]

interface VistaContratoProps {
  contrato: Contrato | null
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
  open: boolean
  onClose: () => void
}

export function VistaContrato({
  contrato,
  evento,
  cliente,
  paquete,
  open,
  onClose,
}: VistaContratoProps) {
  if (!contrato) return null

  const estado = ESTADO_MAP[contrato.estado]
  const anticipo = contrato.montoTotal / 2
  const liquidacion = contrato.montoTotal / 2

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Vista del contrato</DialogTitle>
            <Badge variant="outline" className={cn('text-xs', estado.className)}>
              {estado.label}
            </Badge>
          </div>
        </DialogHeader>

        {/* Documento legal */}
        <div className="rounded-lg border border-warm-border bg-white p-8 text-gray-900 shadow-sm">

          {/* Header del estudio */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A2E] text-xs font-bold text-[#C9A96E]">
                  AM
                </div>
                <p className="text-base font-bold text-gray-900">AM Wedding Studio</p>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">andrea@amweddingstudio.mx · +52 55 1234 5678</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Ciudad de México, México</p>
              <p className="mt-0.5">Fecha: {fmtDate(contrato.fechaCreacion)}</p>
            </div>
          </div>

          <hr className="my-5 border-gray-200" />

          {/* Título */}
          <div className="text-center">
            <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-gray-900">
              Contrato de Servicios de Coordinación
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              No. {contrato.id.toUpperCase()} · Versión {contrato.version}
            </p>
          </div>

          <hr className="my-5 border-gray-200" />

          {/* Partes */}
          <section className="mb-5">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Partes del Contrato
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-3">
                <span className="w-36 shrink-0 text-gray-500">Coordinadora:</span>
                <span className="font-medium">Andrea Morales — AM Wedding Studio</span>
              </div>
              <div className="flex gap-3">
                <span className="w-36 shrink-0 text-gray-500">Cliente:</span>
                <span className="font-medium">
                  {cliente ? `${cliente.nombre} ${cliente.apellido}` : contrato.contraparte}
                </span>
              </div>
              {cliente?.email && (
                <div className="flex gap-3">
                  <span className="w-36 shrink-0 text-gray-500">Email:</span>
                  <span>{cliente.email}</span>
                </div>
              )}
            </div>
          </section>

          <hr className="my-4 border-gray-100" />

          {/* Objeto */}
          <section className="mb-5">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Objeto del Contrato
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-3">
                <span className="w-36 shrink-0 text-gray-500">Servicio:</span>
                <span className="font-medium">{paquete?.nombre ?? 'Coordinación de evento'}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-36 shrink-0 text-gray-500">Evento:</span>
                <span>{evento.nombre}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-36 shrink-0 text-gray-500">Fecha del evento:</span>
                <span>{fmtDate(evento.fecha)}</span>
              </div>
              {evento.venue && (
                <div className="flex gap-3">
                  <span className="w-36 shrink-0 text-gray-500">Venue:</span>
                  <span>{evento.venue}</span>
                </div>
              )}
              {evento.numeroInvitados && (
                <div className="flex gap-3">
                  <span className="w-36 shrink-0 text-gray-500">Invitados:</span>
                  <span>{evento.numeroInvitados} personas</span>
                </div>
              )}
            </div>
          </section>

          <hr className="my-4 border-gray-100" />

          {/* Monto y pagos */}
          <section className="mb-5">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Monto y Forma de Pago
            </h3>
            <div className="overflow-hidden rounded-md border border-gray-100">
              <div className="flex justify-between border-b border-gray-100 px-4 py-2.5 text-sm">
                <span className="text-gray-500">Honorarios totales</span>
                <span className="font-bold">{fmt(contrato.montoTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 px-4 py-2.5 text-sm">
                <span className="text-gray-500">Anticipo (50%) — Al firmar</span>
                <span className="font-medium">{fmt(anticipo)}</span>
              </div>
              <div className="flex justify-between bg-gray-50 px-4 py-2.5 text-sm">
                <span className="text-gray-500">Liquidación (50%) — 15 días antes del evento</span>
                <span className="font-medium">{fmt(liquidacion)}</span>
              </div>
            </div>
          </section>

          <hr className="my-4 border-gray-100" />

          {/* Cláusulas */}
          <section className="mb-5">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Cláusulas
            </h3>
            <ol className="space-y-3">
              {CLAUSULAS.map((c) => (
                <li key={c.num} className="text-xs leading-relaxed text-gray-600">
                  <span className="font-semibold text-gray-800">{c.num}. {c.titulo}. </span>
                  {c.texto}
                </li>
              ))}
            </ol>
          </section>

          <hr className="my-4 border-gray-100" />

          {/* Firmas */}
          <section>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Firmas
            </h3>
            <div className="flex justify-between gap-8">
              <div className="flex-1">
                <div className="mb-1 h-8 border-b border-gray-800" />
                <p className="text-sm font-semibold text-gray-900">Andrea Morales</p>
                <p className="text-xs text-gray-500">Coordinadora — AM Wedding Studio</p>
                <p className="mt-2 text-xs text-gray-400">Fecha: ___________________</p>
              </div>
              <div className="flex-1">
                <div className="mb-1 h-8 border-b border-gray-800" />
                <p className="text-sm font-semibold text-gray-900">
                  {cliente ? `${cliente.nombre} ${cliente.apellido}` : contrato.contraparte}
                </p>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="mt-2 text-xs text-gray-400">Fecha: ___________________</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <DescargaPDF
            contrato={contrato}
            evento={evento}
            cliente={cliente}
            paquete={paquete}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
