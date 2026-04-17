'use client'

import { useState, useEffect } from 'react'
import { Menu, Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigation } from '@/hooks/useNavigation'
import { getPlanner } from '@/lib/api/planner'
import type { Planner } from '@/types'

interface HeaderProps {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { breadcrumbs, contextualAction } = useNavigation()
  const [planner, setPlanner] = useState<Planner | null>(null)

  useEffect(() => {
    void getPlanner().then(setPlanner).catch(console.error)
  }, [])

  const initials = planner
    ? planner.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '??'

  const firstName = planner ? planner.nombre.split(' ')[0] : ''

  return (
    <header className="flex h-14 items-center gap-4 border-b border-warm-border bg-background px-6">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      {/* Breadcrumb */}
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Contextual action */}
      {contextualAction && (
        <Button size="sm" nativeButton={false} render={<Link href={contextualAction.href} />}>
          <Plus className="mr-1.5 h-4 w-4" />
          {contextualAction.label}
        </Button>
      )}

      {/* Notifications — placeholder, badge removed until real notifs */}
      <Button variant="ghost" size="icon" aria-label="Notificaciones">
        <Bell className="h-5 w-5" />
      </Button>

      {/* Planner avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gold/20 text-xs text-gold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">
            {firstName}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger">Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
