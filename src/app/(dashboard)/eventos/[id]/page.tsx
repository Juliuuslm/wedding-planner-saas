import { mockEventos } from '@/data/mock'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params
  const evento = mockEventos.find((e) => e.id === id)
  if (!evento) notFound()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-text-primary">{evento.nombre}</h1>
      <p className="text-text-secondary">
        {evento.venue ?? 'Venue por confirmar'} ·{' '}
        {new Date(evento.fecha).toLocaleDateString('es-MX', { dateStyle: 'long' })}
      </p>
    </div>
  )
}
