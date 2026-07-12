import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ReportCategoryCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  className?: string
}

export function ReportCategoryCard({
  title,
  description,
  href,
  icon: Icon,
  className,
}: ReportCategoryCardProps) {
  return (
    <Link to={href} className={cn('block focus-visible:outline-none', className)}>
      <Card className="hover:border-primary/40 h-full transition-colors hover:shadow-sm">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <Icon className="text-foreground size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-primary text-sm font-medium">Open report →</span>
        </CardContent>
      </Card>
    </Link>
  )
}
