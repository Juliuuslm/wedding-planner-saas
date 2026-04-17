'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_ITEMS, NAV_BOTTOM, type NavItem } from '@/lib/nav-config'
import { getPlanner } from '@/lib/api/planner'
import { cn } from '@/lib/utils'
import type { Planner } from '@/types'

// ─── Internal nav item ────────────────────────────────────────────────────────

function NavItemRow({ item, activeSegment }: { item: NavItem; activeSegment: string }) {
  const isActive = activeSegment === item.segment
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-l-2 border-gold bg-gold/10 text-gold'
          : 'border-l-2 border-transparent text-white/60 hover:bg-white/5 hover:text-white'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  )
}

// ─── Shared content (used in desktop sidebar and mobile Sheet) ────────────────

export function SidebarContent({ activeSegment }: { activeSegment: string }) {
  const [planner, setPlanner] = useState<Planner | null>(null)

  useEffect(() => {
    void getPlanner().then(setPlanner).catch(console.error)
  }, [])

  const initials = planner
    ? planner.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '??'

  const empresa = planner?.empresa ?? 'Wedding Studio'
  const nombre = planner?.nombre ?? ''

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-xs font-bold text-brand">
          AM
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Wedding Studio</p>
          <p className="text-xs text-white/40">{empresa}</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavItemRow key={item.segment} item={item} activeSegment={activeSegment} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-white/10 px-3 py-3">
        {NAV_BOTTOM.map((item) => (
          <NavItemRow key={item.segment} item={item} activeSegment={activeSegment} />
        ))}
      </div>

      {/* Planner avatar + dropdown */}
      <div className="border-t border-white/10 px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-white/5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gold/20 text-xs text-gold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-white">{nombre}</p>
              <p className="truncate text-xs text-white/40">{empresa}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── Desktop sidebar wrapper ──────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const activeSegment = segments[0] ?? 'dashboard'

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-brand md:flex">
      <SidebarContent activeSegment={activeSegment} />
    </aside>
  )
}
