import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type CategoriaAsset = 'Paleta' | 'Flores' | 'Decoración' | 'Invitaciones' | 'Menú'

const CATEGORIA_COLOR: Record<CategoriaAsset, string> = {
  Paleta:       'bg-gold/15 text-warning border-gold/30',
  Flores:       'bg-success/10 text-success border-success/20',
  Decoración:   'bg-brand/10 text-brand border-brand/20',
  Invitaciones: 'bg-muted text-text-secondary',
  Menú:         'bg-danger/10 text-danger border-danger/20',
}

// Curated gradients per category for placeholder thumbnails
const CATEGORIA_GRADIENT: Record<CategoriaAsset, string> = {
  Paleta:       'from-[#C9A96E] via-[#8FAF8A] to-[#D4A090]',
  Flores:       'from-[#7FAF7A] via-[#4A7045] to-[#2D4A3E]',
  Decoración:   'from-[#1A1A2E] via-[#2A2A4E] to-[#3D2B5A]',
  Invitaciones: 'from-[#D4C5B0] via-[#C0A882] to-[#8B6B3D]',
  Menú:         'from-[#C5A0A0] via-[#A07070] to-[#805050]',
}

export interface Asset {
  id:        string
  nombre:    string
  categoria: CategoriaAsset
  eventoId?: string
  gradient?: string
}

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const gradient = asset.gradient ?? CATEGORIA_GRADIENT[asset.categoria]

  return (
    <div className="group overflow-hidden rounded-xl border border-warm-border bg-background shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail placeholder */}
      <div className={cn('relative h-36 bg-gradient-to-br', gradient)}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 35%, white 1px, transparent 1px), radial-gradient(circle at 75% 65%, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute inset-0 flex items-end p-3">
          <Badge
            variant="outline"
            className={cn('text-[10px]', CATEGORIA_COLOR[asset.categoria])}
          >
            {asset.categoria}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="truncate text-sm font-medium text-text-primary">{asset.nombre}</p>
      </div>
    </div>
  )
}
