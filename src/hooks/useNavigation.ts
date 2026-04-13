'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import {
  NAV_ITEMS,
  NAV_BOTTOM,
  CONTEXTUAL_ACTIONS,
  type BreadcrumbItem,
  type ContextualAction,
} from '@/lib/nav-config'
import { mockEventos } from '@/data/mock'

export interface NavigationState {
  activeSegment: string
  breadcrumbs: BreadcrumbItem[]
  contextualAction: ContextualAction | null
}

export function useNavigation(): NavigationState {
  const pathname = usePathname()

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const activeSegment = segments[0] ?? 'dashboard'

    const breadcrumbs = resolveBreadcrumbs(segments)
    const contextualAction = CONTEXTUAL_ACTIONS[activeSegment] ?? null

    return { activeSegment, breadcrumbs, contextualAction }
  }, [pathname])
}

function resolveBreadcrumbs(segments: string[]): BreadcrumbItem[] {
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
    const evento = mockEventos.find((e) => e.id === secondSegment)
    if (evento) {
      breadcrumbs.push({ label: evento.nombre })
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
