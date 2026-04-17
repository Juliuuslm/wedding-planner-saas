export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getProveedorById, getServiciosByProveedor } from '@/lib/data'
import { VendorTabsNav } from '@/components/proveedores/VendorTabsNav'
import { CatalogoTab } from '@/components/proveedores/CatalogoTab'

const CATEGORIA_LABEL: Record<string, string> = {
  venue:       'Venue',
  catering:    'Catering',
  flores:      'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  entretenimiento: 'Entretenimiento',
  invitaciones: 'Invitaciones',
  mobiliario:  'Mobiliario',
  otro:        'Otro',
}

function getInitials(nombre: string) {
  return nombre.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function CatalogoPage({ params }: Props) {
  const { id } = await params
  const proveedor = await getProveedorById(id)
  if (!proveedor) notFound()

  const servicios = await getServiciosByProveedor(id)

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/proveedores"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al directorio
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarFallback className="rounded-lg bg-brand text-xl font-bold text-gold">
              {getInitials(proveedor.nombre)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{proveedor.nombre}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {CATEGORIA_LABEL[proveedor.categoria] ?? proveedor.categoria}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs nav */}
      <VendorTabsNav proveedorId={proveedor.id} />

      {/* Catálogo */}
      <CatalogoTab proveedorId={proveedor.id} initialServicios={servicios} />
    </div>
  )
}
