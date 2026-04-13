import {
  LayoutDashboard,
  Users,
  CalendarHeart,
  Briefcase,
  FileSignature,
  Palette,
  Settings,
  Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  segment: string
}

export interface ContextualAction {
  label: string
  href: string
  icon: LucideIcon
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard, segment: 'dashboard' },
  { href: '/clientes',      label: 'Clientes',      icon: Users,           segment: 'clientes' },
  { href: '/eventos',       label: 'Eventos',        icon: CalendarHeart,   segment: 'eventos' },
  { href: '/proveedores',   label: 'Proveedores',   icon: Briefcase,       segment: 'proveedores' },
  { href: '/contratos',     label: 'Contratos',      icon: FileSignature,   segment: 'contratos' },
  { href: '/diseno',        label: 'Diseño',         icon: Palette,         segment: 'diseno' },
]

export const NAV_BOTTOM: NavItem[] = [
  { href: '/configuracion', label: 'Configuración', icon: Settings, segment: 'configuracion' },
]

export const CONTEXTUAL_ACTIONS: Record<string, ContextualAction> = {
  eventos:      { label: 'Nuevo evento',      href: '/eventos/nuevo',      icon: Plus },
  clientes:     { label: 'Nuevo cliente',     href: '/clientes/nuevo',     icon: Plus },
  proveedores:  { label: 'Nuevo proveedor',   href: '/proveedores/nuevo',  icon: Plus },
  contratos:    { label: 'Nuevo contrato',    href: '/contratos/nuevo',    icon: Plus },
}
