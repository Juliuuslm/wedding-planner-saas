'use client'

import { usePathname } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'
import {
  NAV_ITEMS,
  NAV_BOTTOM,
  CONTEXTUAL_ACTIONS,
  type BreadcrumbItem,
  type ContextualAction,
} from '@/lib/nav-config'
import { getEventos } from '@/lib/api/eventos'
import { getClientes } from '@/lib/api/clientes'
import { getProveedores } from '@/lib/api/proveedores'
import type { Evento, Cliente, Proveedor } from '@/types'

export interface NavigationState {
  activeSegment: string
  breadcrumbs: BreadcrumbItem[]
  contextualAction: ContextualAction | null
}

export function useNavigation(): NavigationState {
  const pathname = usePathname()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])

  useEffect(() => {
    void Promise.all([getEventos(), getClientes(), getProveedores()]).then(
      ([e, c, p]) => {
        setEventos(e)
        setClientes(c)
        setProveedores(p)
      },
    )
  }, [])

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const activeSegment = segments[0] ?? 'dashboard'

    const breadcrumbs = resolveBreadcrumbs(segments, eventos, clientes, proveedores)
    const contextualAction = CONTEXTUAL_ACTIONS[activeSegment] ?? null

    return { activeSegment, breadcrumbs, contextualAction }
  }, [pathname, eventos, clientes, proveedores])
}

function resolveBreadcrumbs(
  segments: string[],
  eventos: Evento[],
  clientes: Cliente[],
  proveedores: Proveedor[],
): BreadcrumbItem[] {
  if (segments.length === 0) {
    return [{ label: 'Dashboard' }]
  }

  const allNavItems = [...NAV_ITEMS, ...NAV_BOTTOM]
  const breadcrumbs: BreadcrumbItem[] = []

  // First segment: find label from nav config
  const firstSegment = segments[0]
  const navItem = allNavItems.find((item) => item.segment === firstSegment)
  const firstLabel = navItem?.label ?? capitalize(firstSegment)

  if (segments.length === 1) {
    breadcrumbs.push({ label: firstLabel })
    return breadcrumbs
  }

  breadcrumbs.push({ label: firstLabel, href: `/${firstSegment}` })

  // Second segment: dynamic id resolution
  const secondSegment = segments[1]

  if (firstSegment === 'eventos') {
    const evento = eventos.find((e) => e.id === secondSegment)
    if (evento) {
      breadcrumbs.push({ label: evento.nombre })
      return breadcrumbs
    }
  }

  if (firstSegment === 'clientes') {
    const cliente = clientes.find((c) => c.id === secondSegment)
    if (cliente) {
      breadcrumbs.push({ label: `${cliente.nombre} ${cliente.apellido}` })
      return breadcrumbs
    }
  }

  if (firstSegment === 'proveedores') {
    const proveedor = proveedores.find((p) => p.id === secondSegment)
    if (proveedor) {
      breadcrumbs.push({ label: proveedor.nombre })
      return breadcrumbs
    }
  }

  // Fallback for unknown dynamic segments
  breadcrumbs.push({ label: capitalize(secondSegment) })
  return breadcrumbs
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
