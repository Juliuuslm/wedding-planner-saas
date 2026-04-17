'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getProveedores } from '@/lib/api/proveedores'
import { ProveedorCard } from '@/components/proveedores/ProveedorCard'
import { NuevoProveedorDialog } from '@/components/proveedores/NuevoProveedorDialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Proveedor, CategoriaProveedor } from '@/types'

const CATEGORIA_LABEL: Record<string, string> = {
  venue:       'Venue',
  catering:    'Catering',
  flores:    'Florería',
  fotografia:  'Fotografía',
  musica:      'Música',
  decoracion:  'Decoración',
  video:       'Video',
  transporte:  'Transporte',
  iluminacion: 'Iluminación',
  pasteleria:  'Pastelería',
  otro:        'Otros',
}

export default function ProveedoresPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaProveedor | 'todos'>('todos')
  const [proveedores, setProveedores] = useState<Proveedor[]>([])

  useEffect(() => {
    void getProveedores().then(setProveedores)
  }, [])

  const categorias = useMemo(
    () =>
      Array.from(new Set(proveedores.map((p) => p.categoria))).sort() as CategoriaProveedor[],
    [proveedores]
  )

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return proveedores.filter((p) => {
      const matchCategoria = filtroCategoria === 'todos' || p.categoria === filtroCategoria
      const matchBusqueda =
        q === '' ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      return matchCategoria && matchBusqueda
    })
  }, [proveedores, busqueda, filtroCategoria])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Proveedores</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Catálogo de proveedores y órdenes de desempeño
          </p>
        </div>
        <NuevoProveedorDialog />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroCategoria('todos')}
          className={cn(
            'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
            filtroCategoria === 'todos'
              ? 'border-brand bg-brand text-white'
              : 'border-warm-border text-text-secondary hover:border-brand/50 hover:text-text-primary'
          )}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              filtroCategoria === cat
                ? 'border-brand bg-brand text-white'
                : 'border-warm-border text-text-secondary hover:border-brand/50 hover:text-text-primary'
            )}
          >
            {CATEGORIA_LABEL[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-text-muted">
        {filtrados.length} de {proveedores.length} proveedores
      </p>

      {/* Grid */}
      {filtrados.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
            <ProveedorCard key={p.id} proveedor={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-warm-border py-20 text-center">
          <p className="font-medium text-text-primary">Sin resultados</p>
          <p className="mt-1 text-sm text-text-muted">
            Prueba con otro término o categoría
          </p>
        </div>
      )}
    </div>
  )
}
