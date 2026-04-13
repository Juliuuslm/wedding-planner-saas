import { mockProveedores } from '@/data/mock'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PortalProveedorPage({ params }: Props) {
  const { id } = await params
  const proveedor = mockProveedores.find((p) => p.id === id)
  if (!proveedor) notFound()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-text-primary">{proveedor.nombre}</h1>
      <p className="text-text-secondary">
        Bienvenido a tu portal de órdenes de desempeño.
      </p>
    </div>
  )
}
