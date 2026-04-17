'use client'

import { useState } from 'react'
import { ExternalLink, Upload, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AssetCard, type Asset, type CategoriaAsset } from './AssetCard'
import type { Evento } from '@/types'

const MOCK_ASSETS: Asset[] = [
  { id: 'a1', nombre: 'Paleta romántica campestre', categoria: 'Paleta',       eventoId: 'evento-1' },
  { id: 'a2', nombre: 'Altar floral — rosas blancas', categoria: 'Flores',     eventoId: 'evento-1' },
  { id: 'a3', nombre: 'Centros de mesa — eucalipto', categoria: 'Flores',      eventoId: 'evento-1' },
  { id: 'a4', nombre: 'Ambientación terraza',        categoria: 'Decoración',   eventoId: 'evento-1' },
  { id: 'a5', nombre: 'Invitación formal v2',        categoria: 'Invitaciones', eventoId: 'evento-1' },
  { id: 'a6', nombre: 'Menú de 3 tiempos',           categoria: 'Menú',         eventoId: 'evento-1' },
]

const CATEGORIAS: CategoriaAsset[] = ['Paleta', 'Flores', 'Decoración', 'Invitaciones', 'Menú']

interface DisenoTabProps {
  evento: Evento
}

export function DisenoTab({ evento }: DisenoTabProps) {
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAsset | 'Todos'>('Todos')

  // Show all mock assets for any event (no design model in backend yet)
  const assets = MOCK_ASSETS
  const filtrados = filtroCategoria === 'Todos'
    ? assets
    : assets.filter((a) => a.categoria === filtroCategoria)

  return (
    <div className="space-y-8">

      {/* ── Canva integration placeholder ──────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-warm-border bg-background shadow-sm">
        {/* Purple-tinted header band */}
        <div className="flex items-center gap-3 border-b border-warm-border bg-[#7D2AE8]/5 px-5 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7D2AE8]/15">
            {/* Canva-style "C" mark */}
            <span className="text-xs font-bold text-[#7D2AE8]">C</span>
          </div>
          <span className="text-sm font-semibold text-text-primary">Canva — Editor de diseño</span>
          <Badge variant="outline" className="ml-auto text-[10px] text-text-muted">
            Integrado
          </Badge>
        </div>

        {/* Main Canva placeholder body */}
        <div className="flex flex-col items-center justify-center gap-5 px-8 py-14 text-center">
          {/* Large Canva icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#7D2AE8] shadow-lg shadow-[#7D2AE8]/20">
            <span className="text-3xl font-bold text-white">C</span>
            <div className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-gold ring-2 ring-background" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-text-primary">Editor de diseño integrado</h3>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              Crea y edita los diseños de tu evento sin salir de la plataforma.
              Invitaciones, paletas, moodboards y mucho más.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="gap-2 bg-[#7D2AE8] text-white hover:bg-[#7D2AE8]/90"
              onClick={() => window.open('https://www.canva.com/', '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en Canva
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://www.canva.com/', '_blank')}
            >
              <ChevronDown className="h-4 w-4" />
              Ver tableros guardados
            </Button>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['Invitaciones', 'Moodboards', 'Paletas de color', 'Menús', 'Señalética'].map((f) => (
              <span
                key={f}
                className="rounded-full border border-warm-border bg-muted/40 px-3 py-1 text-xs text-text-muted"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Assets section ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-text-primary">Assets del evento</h3>
            <p className="mt-0.5 text-sm text-text-muted">
              {filtrados.length} {filtrados.length === 1 ? 'archivo' : 'archivos'}
              {filtroCategoria !== 'Todos' && ` en ${filtroCategoria}`}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert('Subida de assets próximamente')}
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Subir asset
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {(['Todos', ...CATEGORIAS] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filtroCategoria === cat
                  ? 'border-brand bg-brand text-white'
                  : 'border-warm-border bg-background text-text-secondary hover:border-brand/40',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtrados.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-12 text-center">
            <p className="text-sm text-text-muted">Sin assets en esta categoría</p>
          </div>
        )}
      </div>

    </div>
  )
}
