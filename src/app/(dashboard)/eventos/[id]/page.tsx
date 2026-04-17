export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getEventoFull } from '@/lib/api/eventos'
import { EventoHeader } from '@/components/eventos/EventoHeader'
import { EventoTabs } from '@/components/eventos/EventoTabs'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params
  const data = await getEventoFull(id)
  if (!data) notFound()

  const { evento, cliente, paquete, lineas, tareas, odps, proveedores, contratos } = data

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
