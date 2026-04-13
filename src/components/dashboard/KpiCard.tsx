import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconClassName?: string
  valueClassName?: string
}

export function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  valueClassName,
}: KpiCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className={cn('text-3xl font-bold text-text-primary', valueClassName)}>
              {value}
            </p>
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              iconClassName ?? 'bg-gold/10 text-gold'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
