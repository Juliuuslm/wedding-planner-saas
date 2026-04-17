'use client'

import { useMemo, useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { getEventos } from '@/lib/api/eventos'
import { Button } from '@/components/ui/button'
import { AssetCard, type Asset, type CategoriaAsset } from '@/components/diseno/AssetCard'
import { cn } from '@/lib/utils'
import type { Evento } from '@/types'

// All assets across all events
const ALL_ASSETS: Asset[] = [
  // Evento 1 — Boda García-Rodríguez
  { id: 'a1', nombre: 'Paleta romántica campestre',      categoria: 'Paleta',       eventoId: 'evento-1' },
  { id: 'a2', nombre: 'Altar floral — rosas blancas',    categoria: 'Flores',       eventoId: 'evento-1' },
  { id: 'a3', nombre: 'Centros de mesa — eucalipto',     categoria: 'Flores',       eventoId: 'evento-1' },
  { id: 'a4', nombre: 'Ambientación terraza',            categoria: 'Decoración',   eventoId: 'evento-1' },
  { id: 'a5', nombre: 'Invitación formal v2',            categoria: 'Invitaciones', eventoId: 'evento-1' },
  { id: 'a6', nombre: 'Menú de 3 tiempos',               categoria: 'Menú',         eventoId: 'evento-1' },
  // Evento 2 — Boda Martínez-López
  { id: 'a7', nombre: 'Paleta negro, dorado y blanco',   categoria: 'Paleta',       eventoId: 'evento-2' },
  { id: 'a8', nombre: 'Arreglos mesa black-tie',         categoria: 'Decoración',   eventoId: 'evento-2' },
  { id: 'a9', nombre: 'Invitación moderna elegante',     categoria: 'Invitaciones', eventoId: 'evento-2' },
  // Evento 3 — Boda Hernández-Vega
  { id: 'a10', nombre: 'Concepto boho-chic inicial',     categoria: 'Paleta',       eventoId: 'evento-3' },
]

const CATEGORIAS: CategoriaAsset[] = ['Paleta', 'Flores', 'Decoración', 'Invitaciones', 'Menú']

export default function DisenoPage() {
  const [filtroEvento,    setFiltroEvento]    = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaAsset | 'Todos'>('Todos')
  const [eventos, setEventos] = useState<Evento[]>([])

  useEffect(() => {
    void getEventos().then(setEventos)
  }, [])

  const filtrados = useMemo(() =>
    ALL_ASSETS.filter((a) => {
      const matchEvento    = filtroEvento    === 'todos' || a.eventoId === filtroEvento
      const matchCategoria = filtroCategoria === 'Todos' || a.categoria === filtroCategoria
      return matchEvento && matchCategoria
    }),
  [filtroEvento, filtroCategoria])

  function getNombreEvento(id: string) {
    return eventos.find((e) => e.id === id)?.nombre ?? id
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Diseño</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            {filtrados.length} {filtrados.length === 1 ? 'asset' : 'assets'} · todos los eventos
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Upload className="mr-1.5 h-4 w-4" />
          Subir asset
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Evento filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Evento:</span>
          {([{ id: 'todos', label: 'Todos' }, ...eventos.map((e) => ({ id: e.id, label: e.nombre }))] as { id: string; label: string }[]).map((e) => (
            <button
              key={e.id}
              onClick={() => setFiltroEvento(e.id)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filtroEvento === e.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-warm-border bg-background text-text-secondary hover:border-brand/40',
              )}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted">Categoría:</span>
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
      </div>

      {/* Grid */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((asset) => (
            <div key={asset.id} className="space-y-1">
              <AssetCard asset={asset} />
              {filtroEvento === 'todos' && (
                <p className="truncate px-1 text-[10px] text-text-muted">
                  {getNombreEvento(asset.eventoId ?? '')}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-16 text-center">
          <p className="font-medium text-text-primary">Sin assets</p>
          <p className="mt-1 text-sm text-text-muted">Ajusta los filtros o sube un nuevo archivo</p>
        </div>
      )}
    </div>
  )
}
