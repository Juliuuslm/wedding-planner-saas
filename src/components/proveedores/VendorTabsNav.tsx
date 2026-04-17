'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Info, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VendorTabsNavProps {
  proveedorId: string
}

export function VendorTabsNav({ proveedorId }: VendorTabsNavProps) {
  const pathname = usePathname()
  const tabs = [
    { label: 'General',  href: `/proveedores/${proveedorId}`,          icon: Info,    segment: '' },
    { label: 'Catálogo', href: `/proveedores/${proveedorId}/catalogo`, icon: Library, segment: 'catalogo' },
  ]

  return (
    <nav className="flex border-b border-warm-border">
      {tabs.map(({ label, href, icon: Icon, segment }) => {
        const isActive = segment === ''
          ? pathname === href
          : pathname.startsWith(href)
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-brand text-brand'
                : 'border-transparent text-text-muted hover:text-text-primary',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
