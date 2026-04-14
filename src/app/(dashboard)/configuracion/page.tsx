'use client'

import { useState } from 'react'
import {
  User, Building2, Package, Users, Bell,
  Upload, Plus, Pencil, Trash2, Mail, Phone,
} from 'lucide-react'
import { mockPlanner, mockPaquetes } from '@/data/mock'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Paquete } from '@/types'

// ── Types ──────────────────────────────────────────────────────────────────────

type Rol = 'Coordinador' | 'Asistente' | 'Diseñador' | 'Logística'

interface MiembroEquipo {
  id:      string
  nombre:  string
  email:   string
  rol:     Rol
  activo:  boolean
  initials: string
}

// ── Static mock data ────────────────────────────────────────────────────────────

const EQUIPO_INICIAL: MiembroEquipo[] = [
  { id: 'm1', nombre: 'Andrea Morales',   email: 'andrea@amweddingstudio.mx',  rol: 'Coordinador', activo: true, initials: 'AM' },
  { id: 'm2', nombre: 'Luisa Pérez',      email: 'luisa@amweddingstudio.mx',   rol: 'Asistente',   activo: true, initials: 'LP' },
  { id: 'm3', nombre: 'Miguel Rodríguez', email: 'miguel@amweddingstudio.mx',  rol: 'Logística',   activo: true, initials: 'MR' },
]

const ROLES: Rol[] = ['Coordinador', 'Asistente', 'Diseñador', 'Logística']

const SERVICIOS_DISPONIBLES = [
  'Coordinación completa',
  'Coordinación del día',
  'Diseño de concepto',
  'Gestión de proveedores',
  'Portal del cliente',
  'Día del evento',
  'Asesoría de proveedores',
  'Coordinación de ceremonias religiosas',
  'Plan de emergencia',
]

const NOTIFICACIONES_CONFIG = [
  {
    seccion: 'Eventos',
    items: [
      { id: 'n1', label: 'Nuevo evento asignado',       email: true, app: true  },
      { id: 'n2', label: 'Evento próximo (7 días)',      email: true, app: true  },
      { id: 'n3', label: 'Cambio de estado del evento', email: false, app: true  },
    ],
  },
  {
    seccion: 'Contratos',
    items: [
      { id: 'n4', label: 'Contrato firmado',   email: true, app: true  },
      { id: 'n5', label: 'Contrato enviado',   email: false, app: true  },
    ],
  },
  {
    seccion: 'Pagos',
    items: [
      { id: 'n6', label: 'Pago recibido',     email: true,  app: true  },
      { id: 'n7', label: 'Pago vencido',      email: true,  app: true  },
    ],
  },
  {
    seccion: 'Proveedores',
    items: [
      { id: 'n8', label: 'ODP confirmada',    email: false, app: true  },
      { id: 'n9', label: 'ODP rechazada',     email: true,  app: true  },
    ],
  },
]

// ── Field row helper ───────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4">
      <Label className="text-sm text-text-secondary">{label}</Label>
      {children}
    </div>
  )
}

// ── Tab: Mi perfil ─────────────────────────────────────────────────────────────

function TabPerfil() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-brand text-lg font-semibold text-gold">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <Button size="sm" variant="outline">
                <Upload className="mr-1.5 h-4 w-4" />
                Subir foto
              </Button>
              <p className="text-xs text-text-muted">JPG, PNG o GIF. Máximo 2 MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Información personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow label="Nombre completo">
            <Input defaultValue={mockPlanner.nombre} />
          </FieldRow>
          <FieldRow label="Email">
            <Input type="email" defaultValue={mockPlanner.email} />
          </FieldRow>
          <FieldRow label="Teléfono">
            <Input type="tel" defaultValue={mockPlanner.telefono} />
          </FieldRow>
          <FieldRow label="WhatsApp">
            <Input type="tel" defaultValue={mockPlanner.telefono} placeholder="+52 55 0000 0000" />
          </FieldRow>
          <FieldRow label="Zona horaria">
            <Input defaultValue={mockPlanner.zonaHoraria} />
          </FieldRow>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" className="bg-brand text-gold hover:bg-brand/90">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

// ── Tab: Mi empresa ────────────────────────────────────────────────────────────

function TabEmpresa() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Logo de la empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-warm-border bg-muted/40">
              <span className="text-xl font-bold text-brand">AM</span>
            </div>
            <div className="space-y-1.5">
              <Button size="sm" variant="outline">
                <Upload className="mr-1.5 h-4 w-4" />
                Subir logo
              </Button>
              <p className="text-xs text-text-muted">PNG o SVG transparente. Máximo 1 MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Datos de la empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow label="Nombre comercial">
            <Input defaultValue={mockPlanner.empresa} />
          </FieldRow>
          <FieldRow label="Descripción">
            <Textarea
              defaultValue="Wedding planning boutique especializada en bodas íntimas y destino en México."
              rows={3}
              className="resize-none"
            />
          </FieldRow>
          <FieldRow label="Sitio web">
            <Input defaultValue="https://amweddingstudio.mx" placeholder="https://..." />
          </FieldRow>
          <FieldRow label="Dirección">
            <Input defaultValue="Polanco, Ciudad de México, México" />
          </FieldRow>
          <FieldRow label="Email de contacto">
            <Input type="email" defaultValue={mockPlanner.email} />
          </FieldRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Colores de marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-text-muted">Color primario</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#1A1A2E"
                  className="h-8 w-10 cursor-pointer rounded border border-warm-border"
                />
                <Input defaultValue="#1A1A2E" className="w-28 font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-text-muted">Color de acento</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#C9A96E"
                  className="h-8 w-10 cursor-pointer rounded border border-warm-border"
                />
                <Input defaultValue="#C9A96E" className="w-28 font-mono text-xs" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-warm-border bg-muted/40 p-3">
            <div className="h-8 w-8 rounded-md bg-[#1A1A2E]" />
            <div className="h-8 w-8 rounded-md bg-[#C9A96E]" />
            <span className="text-xs text-text-muted">Vista previa de tu paleta de marca</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" className="bg-brand text-gold hover:bg-brand/90">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}

// ── Tab: Paquetes ──────────────────────────────────────────────────────────────

function DialogPaquete({
  open,
  paquete,
  onClose,
}: {
  open:     boolean
  paquete:  Paquete | null
  onClose:  () => void
}) {
  const [servicios, setServicios] = useState<string[]>(paquete?.servicios ?? [])

  function toggleServicio(s: string) {
    setServicios((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{paquete ? 'Editar paquete' : 'Nuevo paquete'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre del paquete</Label>
            <Input defaultValue={paquete?.nombre} placeholder="ej. Premium, Esencial…" />
          </div>
          <div className="space-y-1.5">
            <Label>Precio (MXN)</Label>
            <Input type="number" defaultValue={paquete?.precio} placeholder="85000" />
          </div>
          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea
              defaultValue={paquete?.descripcion}
              placeholder="Descripción breve del paquete…"
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Servicios incluidos</Label>
            <div className="space-y-2 rounded-lg border border-warm-border p-3">
              {SERVICIOS_DISPONIBLES.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2.5">
                  <Checkbox
                    checked={servicios.includes(s)}
                    onCheckedChange={() => toggleServicio(s)}
                  />
                  <span className="text-sm text-text-primary">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button size="sm" className="bg-brand text-gold hover:bg-brand/90">
            {paquete ? 'Guardar cambios' : 'Crear paquete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TabPaquetes() {
  const [paquetes, setPaquetes] = useState(
    mockPaquetes.map((p) => ({ ...p, activo: p.activo })),
  )
  const [dialogOpen,     setDialogOpen]     = useState(false)
  const [paqueteEditing, setPaqueteEditing] = useState<Paquete | null>(null)

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

  function toggleActivo(id: string) {
    setPaquetes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)),
    )
  }

  function openNuevo() {
    setPaqueteEditing(null)
    setDialogOpen(true)
  }

  function openEditar(p: Paquete) {
    setPaqueteEditing(p)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">Paquetes de servicio</h3>
          <p className="mt-0.5 text-sm text-text-muted">{paquetes.filter((p) => p.activo).length} activos · {paquetes.length} total</p>
        </div>
        <Button size="sm" variant="outline" onClick={openNuevo}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo paquete
        </Button>
      </div>

      <div className="space-y-4">
        {paquetes.map((p) => (
          <Card key={p.id} className={cn(!p.activo && 'opacity-60')}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary">{p.nombre}</p>
                    {p.activo
                      ? <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px]">Activo</Badge>
                      : <Badge variant="outline" className="text-[10px] text-text-muted">Inactivo</Badge>
                    }
                  </div>
                  <p className="text-sm text-text-secondary">{p.descripcion}</p>
                  <p className="text-lg font-semibold text-brand">{fmt(p.precio)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={p.activo}
                    onCheckedChange={() => toggleActivo(p.id)}
                  />
                  <Button size="icon-sm" variant="ghost" onClick={() => openEditar(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex flex-wrap gap-1.5">
                {p.servicios.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-warm-border bg-muted/40 px-2.5 py-0.5 text-xs text-text-secondary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DialogPaquete
        open={dialogOpen}
        paquete={paqueteEditing}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}

// ── Tab: Equipo ────────────────────────────────────────────────────────────────

function DialogInvitar({
  open,
  onClose,
}: {
  open:    boolean
  onClose: () => void
}) {
  const [rol, setRol] = useState<Rol>('Asistente')

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Invitar miembro al equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Correo electrónico</Label>
            <Input type="email" placeholder="nombre@ejemplo.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRol(r)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    rol === r
                      ? 'border-brand bg-brand text-white'
                      : 'border-warm-border bg-background text-text-secondary hover:border-brand/40',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button size="sm" className="bg-brand text-gold hover:bg-brand/90">
            Enviar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ROL_COLOR: Record<Rol, string> = {
  Coordinador: 'bg-brand/10 text-brand border-brand/20',
  Asistente:   'bg-muted text-text-secondary',
  Diseñador:   'bg-[#7D2AE8]/10 text-[#7D2AE8] border-[#7D2AE8]/20',
  Logística:   'bg-warning/10 text-warning border-warning/30',
}

function TabEquipo() {
  const [equipo,       setEquipo]       = useState<MiembroEquipo[]>(EQUIPO_INICIAL)
  const [inviteOpen,   setInviteOpen]   = useState(false)

  function toggleActivo(id: string) {
    setEquipo((prev) =>
      prev.map((m) => (m.id === id ? { ...m, activo: !m.activo } : m)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">Miembros del equipo</h3>
          <p className="mt-0.5 text-sm text-text-muted">{equipo.filter((m) => m.activo).length} activos · {equipo.length} total</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Invitar miembro
        </Button>
      </div>

      <Card>
        <CardContent className="divide-y divide-warm-border p-0">
          {equipo.map((m) => (
            <div key={m.id} className={cn('flex items-center gap-4 px-5 py-4', !m.activo && 'opacity-50')}>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-brand text-xs font-semibold text-gold">
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-text-primary">{m.nombre}</p>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px]', ROL_COLOR[m.rol])}
                  >
                    {m.rol}
                  </Badge>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {m.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={m.activo}
                  onCheckedChange={() => toggleActivo(m.id)}
                  size="sm"
                />
                <Button size="icon-sm" variant="ghost" className="text-text-muted hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <DialogInvitar open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}

// ── Tab: Notificaciones ────────────────────────────────────────────────────────

function TabNotificaciones() {
  type NotifState = Record<string, { email: boolean; app: boolean }>

  const initialState: NotifState = {}
  NOTIFICACIONES_CONFIG.forEach(({ items }) => {
    items.forEach(({ id, email, app }) => {
      initialState[id] = { email, app }
    })
  })

  const [estado, setEstado] = useState<NotifState>(initialState)

  function toggle(id: string, canal: 'email' | 'app') {
    setEstado((prev) => ({
      ...prev,
      [id]: { ...prev[id], [canal]: !prev[id][canal] },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-text-primary">Preferencias de notificación</h3>
        <p className="mt-0.5 text-sm text-text-muted">Elige cómo y cuándo recibes alertas.</p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-5 text-xs font-medium text-text-muted">
        <span>Tipo</span>
        <span className="text-center">Email</span>
        <span className="text-center">En app</span>
      </div>

      <div className="space-y-4">
        {NOTIFICACIONES_CONFIG.map(({ seccion, items }) => (
          <Card key={seccion}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {seccion}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-warm-border p-0">
              {items.map(({ id, label }) => (
                <div key={id} className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-5 py-3">
                  <span className="text-sm text-text-primary">{label}</span>
                  <div className="flex justify-center">
                    <Switch
                      size="sm"
                      checked={estado[id].email}
                      onCheckedChange={() => toggle(id, 'email')}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      size="sm"
                      checked={estado[id].app}
                      onCheckedChange={() => toggle(id, 'app')}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="bg-brand text-gold hover:bg-brand/90">
          Guardar preferencias
        </Button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'perfil',         label: 'Mi perfil',      icon: User      },
  { value: 'empresa',        label: 'Mi empresa',     icon: Building2 },
  { value: 'paquetes',       label: 'Paquetes',       icon: Package   },
  { value: 'equipo',         label: 'Equipo',         icon: Users     },
  { value: 'notificaciones', label: 'Notificaciones', icon: Bell      },
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Configuración</h1>
        <p className="mt-0.5 text-sm text-text-muted">Perfil del planner, empresa, paquetes y preferencias.</p>
      </div>

      <Tabs defaultValue="perfil">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="perfil"         className="mt-6"><TabPerfil /></TabsContent>
        <TabsContent value="empresa"        className="mt-6"><TabEmpresa /></TabsContent>
        <TabsContent value="paquetes"       className="mt-6"><TabPaquetes /></TabsContent>
        <TabsContent value="equipo"         className="mt-6"><TabEquipo /></TabsContent>
        <TabsContent value="notificaciones" className="mt-6"><TabNotificaciones /></TabsContent>
      </Tabs>
    </div>
  )
}
