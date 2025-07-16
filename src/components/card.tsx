import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  footer?: React.ReactNode
  actions?: React.ReactNode
  variant?: 'default' | 'outline' | 'filled' | 'gradient'
  isLoading?: boolean
}

export function Card({
  title,
  subtitle,
  icon,
  footer,
  actions,
  variant = 'default',
  isLoading = false,
  className,
  children,
  ...props
}: CardProps) {
  const cardClasses = cn(
    'rounded-xl overflow-hidden transition-all duration-200',
    {
      'border border-border shadow-sm hover:shadow-md': variant === 'default',
      'border-2 border-primary/20 shadow-sm hover:shadow-md': variant === 'outline',
      'bg-primary/5 shadow-sm hover:shadow-md': variant === 'filled',
      'bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm hover:shadow-md': variant === 'gradient',
    },
    className
  )

  if (isLoading) {
    return (
      <div className={cardClasses} {...props}>
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || icon || actions) && (
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
              )}
              <div>
                {title && <h3 className="text-lg font-semibold">{title}</h3>}
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-muted/20 border-t">{footer}</div>}
    </div>
  )
}

export function CardGrid({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  isLoading = false,
  className,
  ...props
}: {
  title: string
  value: string | number
  change?: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  isLoading?: boolean
  className?: string
}) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  const trendIcon =
    trend === 'up' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 text-green-600"
      >
        <path
          fillRule="evenodd"
          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
          clipRule="evenodd"
        />
      </svg>
    ) : trend === 'down' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 text-red-600"
      >
        <path
          fillRule="evenodd"
          d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.975.29l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </svg>
    ) : null

  if (isLoading) {
    return (
      <Card className={cn('', className)} {...props}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className="flex items-center gap-1 mt-1">
          {trendIcon}
          <span className={trendColor}>{change}</span>
        </div>
      )}
    </Card>
  )
}