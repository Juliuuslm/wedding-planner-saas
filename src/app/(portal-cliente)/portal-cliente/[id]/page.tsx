import { mockEventos, mockClientes } from '@/data/mock'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortalClientePage({ params }: Props) {
  const { id } = await params
  const evento = mockEventos.find((e) => e.id === id)
  if (!evento) notFound()

  const cliente = mockClientes.find((c) => c.id === evento.clienteId)

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-text-primary">
        Hola, {cliente?.nombre ?? 'Cliente'}
      </h1>
      <p className="text-text-secondary">
        Bienvenida a tu portal de seguimiento para <strong>{evento.nombre}</strong>.
      </p>
    </div>
  )
}
