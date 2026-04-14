import { notFound } from 'next/navigation'
import { mockEventos, mockClientes, mockPaquetes, mockLineasPresupuesto, mockTareas, mockODPs, mockProveedores, mockContratos } from '@/data/mock'
import { EventoHeader } from '@/components/eventos/EventoHeader'
import { EventoTabs } from '@/components/eventos/EventoTabs'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params
  const evento  = mockEventos.find((e) => e.id === id)
  if (!evento) notFound()

  const cliente = mockClientes.find((c) => c.id === evento.clienteId)
  const paquete = mockPaquetes.find((p) => p.id === evento.paqueteId)
  const lineas     = mockLineasPresupuesto.filter((l) => l.eventoId === evento.id)
  const tareas     = mockTareas.filter((t) => t.eventoId === evento.id)
  const odps       = mockODPs.filter((o) => o.eventoId === evento.id)
  const proveedores = mockProveedores
  const contratos   = mockContratos.filter((c) => c.eventoId === evento.id)

  return (
    <div className="space-y-8">
      <EventoHeader evento={evento} cliente={cliente} paquete={paquete} />
      <EventoTabs
        evento={evento}
        cliente={cliente}
        paquete={paquete}
        lineas={lineas}
        tareas={tareas}
        odps={odps}
        proveedores={proveedores}
        contratos={contratos}
      />
    </div>
  )
}
