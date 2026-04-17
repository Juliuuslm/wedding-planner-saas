'use client'

import React from 'react'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PresupuestoTab } from '@/components/presupuesto/PresupuestoTab'
import { TimelineTab } from '@/components/timeline/TimelineTab'
import { ProveedoresTab } from '@/components/proveedores/ProveedoresTab'
import { ContratosTab } from '@/components/contratos/ContratosTab'
import { DisenoTab } from '@/components/diseno/DisenoTab'
import type { Evento, Cliente, Paquete, LineaPresupuesto, Tarea, ODP, Proveedor, Contrato } from '@/types'

interface EventoTabsProps {
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
  lineas: LineaPresupuesto[]
  tareas: Tarea[]
  odps: ODP[]
  proveedores: Proveedor[]
  contratos: Contrato[]
}

// MVP: equipo fijo, multi-user en v2
const EQUIPO_VISUAL = [
  { initials: 'AM', nombre: 'Andrea Morales',   rol: 'Coordinadora principal' },
  { initials: 'LP', nombre: 'Luisa Pérez',      rol: 'Asistente de coordinación' },
  { initials: 'MR', nombre: 'Miguel Rodríguez', rol: 'Logística' },
]


export function EventoTabs({ evento, cliente, paquete, lineas, tareas, odps, proveedores, contratos }: EventoTabsProps) {
  const fechaLarga = new Date(evento.fecha).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <Tabs defaultValue="general">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        <TabsTrigger value="contratos">Contratos</TabsTrigger>
        <TabsTrigger value="diseno">Diseño</TabsTrigger>
        <TabsTrigger value="portal">Portal</TabsTrigger>
      </TabsList>

      {/* ── General ────────────────────────────────────────────────── */}
      <TabsContent value="general" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left: datos del evento + notas */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Datos del evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {([
                  { label: 'Fecha',       value: <span className="capitalize">{fechaLarga}</span> },
                  { label: 'Venue',       value: evento.venue ?? 'Por confirmar' },
                  { label: 'Invitados',   value: evento.numeroInvitados ? `${evento.numeroInvitados} personas` : '—' },
                  { label: 'Tipo',        value: evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1) },
                  { label: 'Paquete',     value: paquete?.nombre ?? 'Sin paquete' },
                  { label: 'Presupuesto', value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(evento.presupuestoTotal) },
                ] as { label: string; value: React.ReactNode }[]).map(({ label, value }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-start justify-between gap-4 py-0.5">
                      <span className="shrink-0 text-sm text-text-muted">{label}</span>
                      <span className="text-right text-sm font-medium text-text-primary">{value}</span>
                    </div>
                    {i < arr.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Notas del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {evento.notas ?? 'Sin notas registradas.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: cliente + equipo */}
          <div className="space-y-6">
            {cliente && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-brand text-xs font-semibold text-gold">
                        {(cliente.nombre[0] + cliente.apellido[0]).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-text-primary">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      <p className="text-xs text-text-muted">{cliente.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    nativeButton={false}
                    render={<Link href={`/clientes/${cliente.id}`} />}
                  >
                    Ver perfil del cliente
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Equipo asignado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AvatarGroup>
                  {EQUIPO_VISUAL.map((m) => (
                    <Avatar key={m.initials} className="h-8 w-8">
                      <AvatarFallback className="bg-brand text-xs text-gold">
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <ul className="space-y-2 pt-1">
                  {EQUIPO_VISUAL.map((m) => (
                    <li key={m.initials} className="flex items-center gap-2 text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-brand text-[10px] text-gold">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-text-primary">{m.nombre}</span>
                        <span className="ml-1.5 text-xs text-text-muted">{m.rol}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </TabsContent>

      {/* ── Placeholder tabs ────────────────────────────────────────── */}
      <TabsContent value="presupuesto" className="mt-6">
        <PresupuestoTab evento={evento} lineas={lineas} />
      </TabsContent>
      <TabsContent value="timeline" className="mt-6">
        <TimelineTab evento={evento} tareas={tareas} />
      </TabsContent>
      <TabsContent value="proveedores" className="mt-6">
        <ProveedoresTab evento={evento} odps={odps} proveedores={proveedores} />
      </TabsContent>
      <TabsContent value="contratos" className="mt-6">
        <ContratosTab
          evento={evento}
          contratos={contratos}
          cliente={cliente}
          paquete={paquete}
        />
      </TabsContent>
      <TabsContent value="diseno" className="mt-6">
        <DisenoTab evento={evento} />
      </TabsContent>
      <TabsContent value="portal" className="mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-text-primary">Portales del evento</h3>
            <p className="mt-0.5 text-sm text-text-muted">Accede directamente al portal del cliente o al portal de cada proveedor.</p>
          </div>

          {/* Portal cliente */}
          {cliente && (
            <div className="rounded-lg border border-warm-border p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                  <Globe className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Portal del cliente</p>
                  <p className="text-xs text-text-muted">{cliente.nombre} {cliente.apellido}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/portal-cliente/${evento.id}`} target="_blank" />}
              >
                Abrir portal del cliente
              </Button>
            </div>
          )}

          {/* Portales proveedores */}
          {odps.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-secondary">Portales de proveedores</h4>
              <div className="space-y-2">
                {[...new Map(odps.map((o) => [o.proveedorId, o])).values()].map((odp) => {
                  const prov = proveedores.find((p) => p.id === odp.proveedorId)
                  if (!prov) return null
                  return (
                    <div key={prov.id} className="flex items-center justify-between gap-4 rounded-lg border border-warm-border p-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{prov.nombre}</p>
                        <p className="text-xs text-text-muted capitalize">{prov.categoria}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={`/portal-proveedor/${prov.id}`} target="_blank" />}
                      >
                        Abrir portal
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {odps.length === 0 && !cliente && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-16 text-center">
              <Globe className="h-8 w-8 text-text-muted" />
              <p className="mt-3 text-sm text-text-muted">No hay portales configurados para este evento.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
