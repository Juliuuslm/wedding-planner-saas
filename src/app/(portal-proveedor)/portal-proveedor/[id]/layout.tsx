export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getProveedorById } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { CategoriaProveedor } from '@/types'

const CATEGORIA_LABEL: Record<CategoriaProveedor, string> = {
  flores:          'Florería',
  fotografia:      'Fotografía',
  catering:        'Catering',
  musica:          'Música',
  decoracion:      'Decoración',
  venue:           'Venue',
  video:           'Video',
  transporte:      'Transporte',
  iluminacion:     'Iluminación',
  pasteleria:      'Pastelería',
  invitaciones:    'Invitaciones',
  entretenimiento: 'Entretenimiento',
  mobiliario:      'Mobiliario',
  otro:            'Otro',
}

interface PortalProveedorLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function PortalProveedorIdLayout({
  children,
  params,
}: PortalProveedorLayoutProps) {
  const { id } = await params
  const proveedor = await getProveedorById(id)
  if (!proveedor) notFound()

  const initials = proveedor.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-warm-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          {/* Left: Studio logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-gold">
              AM
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">AM Wedding Studio</p>
              <p className="text-[10px] text-text-muted">Portal del Proveedor</p>
            </div>
          </div>

          {/* Right: Category + proveedor name */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {CATEGORIA_LABEL[proveedor.categoria]}
            </Badge>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 rounded-lg">
                <AvatarFallback className="rounded-lg bg-accent-light text-xs font-semibold text-brand">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-text-primary">{proveedor.nombre}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {children}
      </main>
    </>
  )
}
