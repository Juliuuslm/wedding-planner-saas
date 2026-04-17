'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, User, UserPlus, Check } from 'lucide-react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createEvento } from '@/lib/api/eventos'
import { getClientes, createCliente } from '@/lib/api/clientes'
import { getPaquetes } from '@/lib/api/paquetes'
import { toastSuccess, toastError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { Cliente, Paquete, TipoEvento, EstadoEvento } from '@/types'

const TIPOS_EVENTO: { value: TipoEvento; label: string; prefix: string }[] = [
  { value: 'boda',        label: 'Boda',        prefix: 'Boda' },
  { value: 'bautizo',     label: 'Bautizo',     prefix: 'Bautizo' },
  { value: 'quinceanera', label: 'Quinceañera', prefix: 'Quinceañera' },
  { value: 'corporativo', label: 'Corporativo', prefix: 'Evento corporativo' },
  { value: 'otro',        label: 'Otro',        prefix: 'Evento' },
]

type ClienteMode = 'nuevo' | 'existente'

export function NuevoEventoDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [paquetes, setPaquetes] = useState<Paquete[]>([])

  // ── Evento fields ────────────────────────────────────────────────────────
  const [nombre, setNombre] = useState('')
  const [nombreDirty, setNombreDirty] = useState(false)  // track manual edit
  const [tipo, setTipo] = useState<TipoEvento>('boda')
  const [fecha, setFecha] = useState('')
  const [estado, setEstado] = useState<EstadoEvento>('lead')
  const [venue, setVenue] = useState('')
  const [numeroInvitados, setNumeroInvitados] = useState('')
  const [presupuestoTotal, setPresupuestoTotal] = useState('')
  const [paqueteId, setPaqueteId] = useState('')

  // ── Cliente fields ───────────────────────────────────────────────────────
  const [clienteMode, setClienteMode] = useState<ClienteMode>('nuevo')
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const [comboboxOpen, setComboboxOpen] = useState(false)

  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteApellido, setClienteApellido] = useState('')
  const [clienteEmail, setClienteEmail] = useState('')
  const [clienteTelefono, setClienteTelefono] = useState('')

  // ── Data load on open ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    void Promise.all([getClientes(), getPaquetes()]).then(([c, p]) => {
      setClientes(c)
      setPaquetes(p)
      // Si no hay clientes previos, forzar modo "nuevo" y ocultar toggle
      if (c.length === 0) setClienteMode('nuevo')
    })
  }, [open])

  // ── Auto-generar nombre del evento ───────────────────────────────────────
  useEffect(() => {
    if (nombreDirty) return
    const prefix = TIPOS_EVENTO.find((t) => t.value === tipo)?.prefix ?? 'Evento'
    let apellido = ''
    if (clienteMode === 'nuevo' && clienteApellido.trim()) {
      apellido = clienteApellido.trim()
    } else if (clienteMode === 'existente' && selectedClienteId) {
      const c = clientes.find((x) => x.id === selectedClienteId)
      apellido = c?.apellido ?? ''
    }
    if (apellido) setNombre(`${prefix} ${apellido}`)
    else setNombre('')
  }, [tipo, clienteMode, clienteApellido, selectedClienteId, clientes, nombreDirty])

  const selectedCliente = useMemo(
    () => clientes.find((c) => c.id === selectedClienteId),
    [clientes, selectedClienteId],
  )

  function resetForm() {
    setNombre('')
    setNombreDirty(false)
    setTipo('boda')
    setFecha('')
    setEstado('lead')
    setVenue('')
    setNumeroInvitados('')
    setPresupuestoTotal('')
    setPaqueteId('')
    setClienteMode(clientes.length > 0 ? 'existente' : 'nuevo')
    setSelectedClienteId('')
    setClienteNombre('')
    setClienteApellido('')
    setClienteEmail('')
    setClienteTelefono('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validación evento
    if (!nombre.trim() || !fecha) {
      toastError('Campos requeridos', 'Nombre del evento y fecha son obligatorios.')
      return
    }

    // Validación cliente
    if (clienteMode === 'existente') {
      if (!selectedClienteId) {
        toastError('Selecciona un cliente', 'Elige un cliente existente o cambia a "Cliente nuevo".')
        return
      }
    } else {
      if (!clienteNombre.trim() || !clienteApellido.trim() || !clienteEmail.trim()) {
        toastError('Datos del cliente', 'Nombre, apellido y correo del cliente son obligatorios.')
        return
      }
    }

    setLoading(true)
    try {
      // 1. Resolver clienteId (crear o reutilizar)
      let clienteId = selectedClienteId
      if (clienteMode === 'nuevo') {
        const nuevoCliente = await createCliente({
          nombre: clienteNombre,
          apellido: clienteApellido,
          email: clienteEmail,
          telefono: clienteTelefono,
          estado: estado === 'lead' ? 'prospecto' : 'activo',
        })
        clienteId = nuevoCliente.id
      }

      // 2. Crear evento
      const nuevoEvento = await createEvento({
        nombre,
        tipo,
        fecha,
        clienteId,
        venue: venue || undefined,
        numeroInvitados: numeroInvitados ? Number(numeroInvitados) : undefined,
        paqueteId: paqueteId || undefined,
        estado,
        presupuestoTotal: presupuestoTotal ? Number(presupuestoTotal) : 0,
        progreso: 0,
      })

      setOpen(false)
      resetForm()
      toastSuccess('Evento creado', `${nuevoEvento.nombre} fue creado. Te llevamos al evento.`)
      router.push(`/eventos/${nuevoEvento.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error al crear evento:', err)
      toastError('Error al crear evento', 'Verifica los datos e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const hayClientesExistentes = clientes.length > 0

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />
        Nuevo evento
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!loading) {
            setOpen(v)
            if (!v) resetForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
            <DialogDescription>
              Crea el evento y registra al cliente en un solo paso.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-5">

            {/* ── Datos del evento ─────────────────────────────────── */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-tipo">Tipo</Label>
                  <select
                    id="ev-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoEvento)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {TIPOS_EVENTO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ev-estado">Estado</Label>
                  <select
                    id="ev-estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoEvento)}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="lead">Lead (sin confirmar)</option>
                    <option value="planificacion">Planificación (contrato firmado)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ev-fecha">Fecha del evento *</Label>
                <Input
                  id="ev-fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ── Cliente ──────────────────────────────────────────── */}
            <div className="space-y-3 rounded-lg border border-warm-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Cliente</Label>
                {hayClientesExistentes && (
                  <div className="flex rounded-md border border-warm-border bg-background p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setClienteMode('nuevo')}
                      className={cn(
                        'flex items-center gap-1 rounded px-2.5 py-1 transition-colors',
                        clienteMode === 'nuevo'
                          ? 'bg-brand text-white'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <UserPlus className="h-3 w-3" />
                      Nuevo
                    </button>
                    <button
                      type="button"
                      onClick={() => setClienteMode('existente')}
                      className={cn(
                        'flex items-center gap-1 rounded px-2.5 py-1 transition-colors',
                        clienteMode === 'existente'
                          ? 'bg-brand text-white'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <User className="h-3 w-3" />
                      Existente
                    </button>
                  </div>
                )}
              </div>

              {clienteMode === 'existente' ? (
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger render={
                    <button
                      type="button"
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <span className={selectedCliente ? '' : 'text-muted-foreground'}>
                        {selectedCliente
                          ? `${selectedCliente.nombre} ${selectedCliente.apellido}`
                          : 'Buscar cliente...'}
                      </span>
                    </button>
                  } />
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Nombre o correo..." />
                      <CommandList>
                        <CommandEmpty>Sin resultados.</CommandEmpty>
                        <CommandGroup>
                          {clientes.map((c) => (
                            <CommandItem
                              key={c.id}
                              value={`${c.nombre} ${c.apellido} ${c.email}`}
                              onSelect={() => {
                                setSelectedClienteId(c.id)
                                setComboboxOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedClienteId === c.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{c.nombre} {c.apellido}</span>
                                <span className="text-xs text-text-muted">{c.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cl-nombre" className="text-xs">Nombre *</Label>
                      <Input
                        id="cl-nombre"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        placeholder="Valentina"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cl-apellido" className="text-xs">Apellido *</Label>
                      <Input
                        id="cl-apellido"
                        value={clienteApellido}
                        onChange={(e) => setClienteApellido(e.target.value)}
                        placeholder="García"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cl-email" className="text-xs">Correo *</Label>
                      <Input
                        id="cl-email"
                        type="email"
                        value={clienteEmail}
                        onChange={(e) => setClienteEmail(e.target.value)}
                        placeholder="cliente@correo.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cl-telefono" className="text-xs">Teléfono</Label>
                      <Input
                        id="cl-telefono"
                        type="tel"
                        value={clienteTelefono}
                        onChange={(e) => setClienteTelefono(e.target.value)}
                        placeholder="+52 55 ..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Nombre del evento (autogen con override) ─────────── */}
            <div className="space-y-1.5">
              <Label htmlFor="ev-nombre">Nombre del evento *</Label>
              <Input
                id="ev-nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  setNombreDirty(true)
                }}
                placeholder="Boda Valentina García"
                required
              />
              {!nombreDirty && nombre && (
                <p className="text-xs text-text-muted">Sugerencia automática — puedes editarlo.</p>
              )}
            </div>

            {/* ── Detalles opcionales ──────────────────────────────── */}
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary">
                Detalles opcionales (venue, invitados, presupuesto)
              </summary>
              <div className="mt-3 grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-venue" className="text-xs">Venue</Label>
                    <Input
                      id="ev-venue"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Hacienda San Carlos"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-invitados" className="text-xs">Invitados</Label>
                    <Input
                      id="ev-invitados"
                      type="number"
                      value={numeroInvitados}
                      onChange={(e) => setNumeroInvitados(e.target.value)}
                      placeholder="150"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-presupuesto" className="text-xs">Presupuesto (MXN)</Label>
                    <Input
                      id="ev-presupuesto"
                      type="number"
                      value={presupuestoTotal}
                      onChange={(e) => setPresupuestoTotal(e.target.value)}
                      placeholder="500000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ev-paquete" className="text-xs">Paquete</Label>
                    <select
                      id="ev-paquete"
                      value={paqueteId}
                      onChange={(e) => setPaqueteId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Ninguno</option>
                      {paquetes.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </details>

            <DialogFooter showCloseButton>
              <Button size="sm" type="submit" disabled={loading} className="sm:ml-auto">
                {loading ? 'Creando...' : 'Crear evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
