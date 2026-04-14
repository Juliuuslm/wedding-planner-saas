import Link from 'next/link'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Proveedor } from '@/types'

const CATEGORIA_LABEL: Record<string, string> = {
  venue:       'Venue',
  catering:    'Catering',
  floreria:    'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  otro:        'Otros',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'fill-gold text-gold' : 'fill-transparent text-text-muted/30'
          )}
        />
      ))}
      <span className="ml-1 text-xs text-text-muted">{rating}.0</span>
    </div>
  )
}

function getInitials(nombre: string) {
  return nombre
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const fmt = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export function ProveedorCard({ proveedor }: { proveedor: Proveedor }) {
  const precio = proveedor.precioMin ?? proveedor.precioBase

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 shrink-0 rounded-lg">
            <AvatarFallback className="rounded-lg bg-brand text-sm font-semibold text-gold">
              {getInitials(proveedor.nombre)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-text-primary">{proveedor.nombre}</p>
            <Badge variant="outline" className="mt-1 text-xs">
              {CATEGORIA_LABEL[proveedor.categoria] ?? proveedor.categoria}
            </Badge>
          </div>
        </div>

        <StarRating rating={proveedor.calificacion} />

        {proveedor.descripcion && (
          <p className="line-clamp-2 text-sm text-text-secondary">{proveedor.descripcion}</p>
        )}

        {precio != null && (
          <p className="text-xs text-text-muted">
            Desde{' '}
            <span className="font-medium text-text-primary">{fmt.format(precio)}</span>
          </p>
        )}

        <Button
          size="sm"
          variant="outline"
          className="mt-auto w-full"
          nativeButton={false}
          render={<Link href={`/proveedores/${proveedor.id}`} />}
        >
          Ver perfil
        </Button>
      </CardContent>
    </Card>
  )
}
