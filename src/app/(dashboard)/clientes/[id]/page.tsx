import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Mail,
  Phone,
  MessageCircle,
  CalendarDays,
  Users,
  ArrowLeft,
  Edit,
  FileText,
  Download,
  ArrowRight,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  mockClientes,
  mockEventos,
  mockLineasPresupuesto,
  mockContratos,
} from '@/data/mock'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const ESTADO_CLIENTE_MAP: Record<string, { label: string; className: string }> = {
  activo:     { label: 'Activo',     className: 'bg-success/10 text-success border-success/20' },
  prospecto:  { label: 'Prospecto',  className: 'bg-gold/10 text-gold border-gold/20' },
  completado: { label: 'Completado', className: 'bg-muted text-text-muted' },
  cancelado:  { label: 'Cancelado',  className: 'bg-danger/10 text-danger border-danger/20' },
}

const ESTADO_LINEA_MAP: Record<string, { label: string; className: string }> = {
  pendiente:      { label: 'Pendiente', className: 'bg-warning/10 text-warning border-warning/30' },
  pagado_parcial: { label: 'Parcial',   className: 'bg-gold/10 text-gold border-gold/30' },
  pagado:         { label: 'Pagado',    className: 'bg-success/10 text-success border-success/30' },
}

const ESTADO_CONTRATO_MAP: Record<string, { label: string; className: string }> = {
  borrador: { label: 'Borrador', className: 'bg-muted text-text-muted' },
  enviado:  { label: 'Enviado',  className: 'bg-gold/10 text-gold border-gold/20' },
  firmado:  { label: 'Firmado',  className: 'bg-success/10 text-success border-success/20' },
  cancelado:{ label: 'Cancelado',className: 'bg-danger/10 text-danger border-danger/20' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientePerfilPage({ params }: Props) {
  const { id } = await params
  const cliente = mockClientes.find((c) => c.id === id)
  if (!cliente) notFound()

  const evento = mockEventos.find((e) => e.clienteId === cliente.id)
  const lineas = evento
    ? mockLineasPresupuesto.filter((l) => l.eventoId === evento.id)
    : []
  const contratos = mockContratos.filter(
    (c) => c.contraparteId === cliente.id && c.tipo === 'cliente'
  )

  const initials = (cliente.nombre[0] + cliente.apellido[0]).toUpperCase()
  const estadoCliente = ESTADO_CLIENTE_MAP[cliente.estado]

  return (
    <div className="space-y-6">

      {/* ── Back link ───────────────────────────────────────────── */}
      <Button
        size="sm"
        variant="ghost"
        className="-ml-1 text-text-secondary"
        nativeButton={false}
        render={<Link href="/clientes" />}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Volver a clientes
      </Button>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-brand text-lg font-semibold text-gold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className={estadoCliente.className}>
                {estadoCliente.label}
              </Badge>
              <span className="text-xs text-text-muted">
                Cliente desde {formatDate(cliente.creadoEn)}
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Edit className="mr-1.5 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Left column: contacto + evento + notas ──────────── */}
        <div className="space-y-6 lg:col-span-1">

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <a
                  href={`mailto:${cliente.email}`}
                  className="truncate text-text-primary hover:text-gold hover:underline"
                >
                  {cliente.email}
                </a>
              </div>
              <Separator />
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="text-text-primary">{cliente.telefono}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2.5 text-sm">
                <MessageCircle className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="text-text-secondary">WhatsApp: {cliente.telefono}</span>
              </div>
            </CardContent>
          </Card>

          {/* Evento asociado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Evento asociado</CardTitle>
            </CardHeader>
            <CardContent>
              {evento ? (
                <div className="space-y-3">
                  <p className="font-medium text-text-primary">{evento.nombre}</p>
                  <div className="space-y-1.5 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(evento.fecha)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {evento.numeroInvitados ?? '—'} invitados
                    </div>
                  </div>
                  {evento.venue && (
                    <p className="text-xs text-text-secondary">{evento.venue}</p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    nativeButton={false}
                    render={<Link href={`/eventos/${evento.id}`} />}
                  >
                    Ver evento
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm italic text-text-muted">Sin evento asociado</p>
              )}
            </CardContent>
          </Card>

          {/* Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                readOnly
                defaultValue={cliente.notas ?? ''}
                placeholder="Sin notas..."
                rows={5}
                className="w-full resize-none rounded-md border border-warm-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </CardContent>
          </Card>

        </div>

        {/* ── Right column: pagos + documentos ────────────────── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Historial de pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Historial de pagos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {lineas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Estimado</TableHead>
                      <TableHead className="text-right">Pagado</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineas.map((linea) => {
                      const estilo = ESTADO_LINEA_MAP[linea.estado]
                      return (
                        <TableRow key={linea.id}>
                          <TableCell className="text-sm">{linea.concepto}</TableCell>
                          <TableCell className="text-right text-sm tabular-nums">
                            {formatMXN(linea.montoEstimado)}
                          </TableCell>
                          <TableCell className="text-right text-sm tabular-nums">
                            {formatMXN(linea.montoPagado)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={cn('text-xs', estilo.className)}
                            >
                              {estilo.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="px-6 py-8 text-center text-sm italic text-text-muted">
                  Sin historial de pagos
                </p>
              )}
            </CardContent>
          </Card>

          {/* Documentos / Contratos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Documentos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {contratos.length > 0 ? (
                <ul className="divide-y divide-warm-border">
                  {contratos.map((contrato) => {
                    const estadoContrato = ESTADO_CONTRATO_MAP[contrato.estado]
                    return (
                      <li
                        key={contrato.id}
                        className="flex items-center gap-3 px-6 py-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                          <FileText className="h-4 w-4 text-gold" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">
                            Contrato v{contrato.version} — {contrato.contraparte}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatDate(contrato.fechaCreacion)}
                            {contrato.fechaFirma && ` · Firmado ${formatDate(contrato.fechaFirma)}`}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn('shrink-0 text-xs', estadoContrato.className)}
                        >
                          {estadoContrato.label}
                        </Badge>
                        <Button size="icon-sm" variant="ghost" className="shrink-0">
                          <Download className="h-3.5 w-3.5 text-text-muted" />
                          <span className="sr-only">Descargar</span>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="px-6 py-8 text-center text-sm italic text-text-muted">
                  Sin documentos
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
